# RiskFundV2

`RiskFundV2` is the BNB Chain mainnet protocol-fund custody contract. It holds raw ERC-20 balances and receives USDT from `RiskFundBuyback`. It does not maintain a current per-Comptroller or per-pool reserve ledger, and it does not support native BNB.

{% hint style="warning" %}
The current implementation is not the former per-pool RiskFund API. The VIP-620/VIP-621 migration removed `poolAssetsFunds`, `updatePoolState`, and `sweepTokenFromPool`. Do not build against those selectors even if an old merged proxy artifact or explorer view still displays them.
{% endhint %}

At BNB Chain mainnet block `118349571` (August 27, 2026, 08:12:46 UTC), the proxy and implementation were:

| Contract | Address |
|---|---|
| RiskFundV2 proxy | [`0xdF31a28D68A2AB381D42b380649Ead7ae2A76E42`](https://bscscan.com/address/0xdF31a28D68A2AB381D42b380649Ead7ae2A76E42) |
| Implementation | [`0x01BE9c56A0844040b2c1a684B1a72cE88489486a`](https://bscscan.com/address/0x01BE9c56A0844040b2c1a684B1a72cE88489486a) |

The proxy's `owner()` getter returned the Normal Timelock, `convertibleBaseAsset()` returned BNB Chain mainnet USDT, and `shortfall()` returned the deployed Shortfall proxy. The raw USDT balance was about 3.41 million USDT, while `getPoolsBaseAssetReserves` returned zero for every PoolRegistry pool. Balances and governance configuration can change; read them again for current operations.

Current source: [`protocol-reserve@eaed4e3: RiskFundV2.sol`](https://github.com/VenusProtocol/protocol-reserve/blob/eaed4e323edd44bf87b5be1e56522fc772cb5990/contracts/ProtocolReserve/RiskFundV2.sol).

## State getters

### convertibleBaseAsset

ERC-20 asset used for the Shortfall-compatible transfer path. On BNB Chain mainnet this is USDT, not native BNB.

```solidity
function convertibleBaseAsset() external view returns (address);
```

### shortfall

Only this configured address can call `transferReserveForAuction`.

```solidity
function shortfall() external view returns (address);
```

### maxLoopsLimit

Deprecated state retained for proxy-storage compatibility. The current RiskFundV2 logic does not use it to iterate pools.

```solidity
function maxLoopsLimit() external view returns (uint256);
```

## Governance configuration

### setConvertibleBaseAsset

Updates the ERC-20 base asset used by `transferReserveForAuction`.

```solidity
function setConvertibleBaseAsset(address convertibleBaseAsset_) external;
```

| Requirement | Detail |
|---|---|
| Access | `onlyOwner` |
| Validation | The new address must be nonzero. |
| Event | `ConvertibleBaseAssetUpdated(oldConvertibleBaseAsset, newConvertibleBaseAsset)` |

### setShortfallContractAddress

Updates the only caller authorized to request reserves through the auction-compatible path.

```solidity
function setShortfallContractAddress(address shortfallContractAddress_) external;
```

| Requirement | Detail |
|---|---|
| Access | `onlyOwner` |
| Validation | The new address must be nonzero. |
| Event | `ShortfallContractUpdated(oldShortfallContract, newShortfallContract)` |

## Token movement

### sweepToken

Transfers any ERC-20 held by RiskFundV2 to a governance-selected recipient. It is not limited to the configured base asset or to a pool-attributed balance.

```solidity
function sweepToken(
    address tokenAddress,
    address to,
    uint256 amount
) external;
```

| Requirement | Detail |
|---|---|
| Access | `onlyOwner` |
| Reentrancy | `nonReentrant` |
| Validation | Token, recipient, and amount must be nonzero; `amount` cannot exceed the contract's raw token balance. |
| Event | `SweepToken(tokenAddress, to, amount)` |

The contract does not reserve a portion for a Comptroller before this balance check. Governance procedures must determine whether a proposed sweep is appropriate.

### transferReserveForAuction

Transfers the configured base asset from RiskFundV2 to Shortfall.

```solidity
function transferReserveForAuction(
    address comptroller,
    uint256 amount
) external returns (uint256);
```

| Requirement | Detail |
|---|---|
| Access | `msg.sender` must equal `shortfall()`. Otherwise the call reverts with `InvalidShortfallAddress`. |
| Reentrancy | `nonReentrant` |
| Balance | `amount` cannot exceed the raw `convertibleBaseAsset` balance. |
| Attribution | `comptroller` is not used for accounting; it is emitted in `TransferredReserveForAuction`. |
| Return | The amount transferred. |

This selector remains for Shortfall compatibility, but BNB Chain mainnet Shortfall auctions are paused. It must not be interpreted as an active automated recovery route.

## Compatibility getter

### getPoolsBaseAssetReserves

```solidity
function getPoolsBaseAssetReserves(
    address comptroller
) external view returns (uint256);
```

The current implementation ignores `comptroller` and always returns `0`. This preserves the selector expected by Shortfall while preventing a legacy auction from sizing a per-pool reserve against the global raw balance.

Returning zero does not itself cause `startAuction` to revert: if auctions were resumed and other requirements were satisfied, the old sizing logic would see zero pool-attributed risk-fund value. The current protection against new starts and restarts is the separate `Shortfall.auctionsPaused()` state.

## Removed legacy selectors

The following former RiskFund paths are not part of the current implementation:

* `sweepTokenFromPool`;
* `updatePoolState`;
* `poolAssetsFunds`;
* the RiskFundConverter callback path; and
* in-contract PancakeSwap conversion settings and execution.

Conversion now occurs in `RiskFundBuyback`, and former storage positions remain reserved only for upgrade compatibility. See [RiskFundV2 storage](risk-fund-storage.md) and [TokenBuyback](../../../whats-new/token-converter.md).
