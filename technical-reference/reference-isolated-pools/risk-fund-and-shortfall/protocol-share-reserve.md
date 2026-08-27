# ProtocolShareReserve

`ProtocolShareReserve` (PSR) records and distributes protocol income received from Venus markets and supported products. It is a current, cross-pool component deployed on multiple networks; its location in the Isolated Pools reference tree does not mean it was deprecated with the standalone Isolated Pools interface.

This page describes the source at [`protocol-reserve@eaed4e3`](https://github.com/VenusProtocol/protocol-reserve/blob/eaed4e323edd44bf87b5be1e56522fc772cb5990/contracts/ProtocolReserve/ProtocolShareReserve.sol). Constructor immutables, proxy implementations, PoolRegistry addresses, distribution targets, and accumulated balances are deployment-specific and must be verified on the relevant chain.

At BNB Chain mainnet block `118349571` (August 27, 2026, 08:12:46 UTC), the PSR proxy was [`0xCa01D5A9A248a830E9D93231e791B1afFed7c446`](https://bscscan.com/address/0xCa01D5A9A248a830E9D93231e791B1afFed7c446), its implementation was [`0x4eC6D748a2647000895b455c408f85602A144Ed6`](https://bscscan.com/address/0x4eC6D748a2647000895b455c408f85602A144Ed6), and `totalDistributions()` returned 18. Treat these as a dated snapshot, not permanent configuration.

## Income and distribution types

```solidity
enum IncomeType {
    SPREAD,
    LIQUIDATION,
    ERC4626_WRAPPER_REWARDS,
    FLASHLOAN,
    INSTITUTIONAL_VAULT_PROTOCOL_FEE,
    INSTITUTIONAL_VAULT_LIQUIDATION
}

enum Schema {
    PROTOCOL_RESERVES,
    ADDITIONAL_REVENUE
}

struct DistributionConfig {
    Schema schema;
    uint16 percentage;
    address destination;
}
```

`SPREAD` income maps to `PROTOCOL_RESERVES`. Every other `IncomeType` maps to `ADDITIONAL_REVENUE`. `percentage` is denominated in basis points against `MAX_PERCENT = 10_000`; it is not a human-readable percentage.

For each schema, the configured percentages must total either zero or 10,000. PSR has no built-in 50/50 split. Governance configuration determines the actual destinations and allocations.

## Deployment-specific state

### Constructor immutables

```solidity
function CORE_POOL_COMPTROLLER() external view returns (address);

function WBNB() external view returns (address);

function vBNB() external view returns (address);
```

These values are set on the implementation constructor. Their BNB-oriented names are part of the shared contract API; verify the values rather than assuming the BNB Chain addresses on another deployment.

### Pool and loop configuration

```solidity
function poolRegistry() external view returns (address);

function maxLoopsLimit() external view returns (uint256);
```

`maxLoopsLimit` bounds the number of distribution targets accepted by configuration updates. The target array itself is dynamic governance state.

## Accounting state

```solidity
function assetsReserves(
    address comptroller,
    address asset,
    Schema schema
) external view returns (uint256);

function totalAssetReserve(address asset) external view returns (uint256);

function distributionTargets(
    uint256 index
) external view returns (Schema schema, uint16 percentage, address destination);
```

`assetsReserves` is an internal accounting attribution. `totalAssetReserve` is the accounted total for an asset across pools and schemas; it is not necessarily equal to the ERC-20 `balanceOf(PSR)` if tokens arrived but have not yet been attributed.

## Initialization and owner configuration

### initialize

```solidity
function initialize(
    address accessControlManager_,
    uint256 loopsLimit_
) external;
```

Initializes the proxy's ACM, reentrancy guard, and maximum loop limit. It can run only once through the initializer guard.

### setPoolRegistry

```solidity
function setPoolRegistry(address poolRegistry_) external;
```

Only the contract owner can call this function. The new PoolRegistry address must be nonzero.

## Distribution configuration

### addOrUpdateDistributionConfigs

```solidity
function addOrUpdateDistributionConfigs(
    DistributionConfig[] calldata configs
) external;
```

This function is restricted through ACM permission for `addOrUpdateDistributionConfigs(DistributionConfig[])`. It updates a row with the same `(schema, destination)` pair or appends a new row.

After processing the batch:

* each destination must be nonzero;
* each schema's total allocation must be zero or 10,000 bps; and
* the number of target rows must not exceed `maxLoopsLimit`.

### removeDistributionConfig

```solidity
function removeDistributionConfig(
    Schema schema,
    address destination
) external;
```

This cleanup function is restricted through ACM permission for `removeDistributionConfig(Schema,address)`. It removes a matching row only when that row's percentage has already been set to zero. An authorized caller cannot use it to remove a nonzero allocation or choose a replacement destination. The function re-checks the per-schema percentage invariant after removal.

## Recording income

### updateAssetsState

```solidity
function updateAssetsState(
    address comptroller,
    address asset,
    IncomeType incomeType
) public;
```

This function is permissionless but validates its attribution inputs:

* `comptroller.isComptroller()` must return true;
* `asset` must be nonzero; and
* for a non-Core Comptroller, PoolRegistry must return a vToken for that `(comptroller, asset)` pair.

The function does not receive an amount. It reads the current ERC-20 balance and compares it with `totalAssetReserve[asset]`. If the balance is higher, the entire positive difference is attributed to the supplied Comptroller and the schema derived from `incomeType`.

Consequently, a direct token transfer does not identify its own pool or income type. The first later valid `updateAssetsState` call can attribute that unaccounted balance difference to its arguments. Integrators should transfer and update state in the intended protocol flow and should not infer provenance from the token transfer alone.

## Releasing income

### releaseFunds

```solidity
function releaseFunds(
    address comptroller,
    address[] calldata assets
) external;
```

Any address can trigger a release. The caller selects only the already-accounted Comptroller and asset list; on-chain distribution rows determine the recipients and percentages.

For each asset, PSR:

1. reads the recorded balance for both schemas;
2. calculates each destination amount as `schemaBalance × percentage / 10_000`;
3. transfers the ERC-20 to the configured destination;
4. calls `destination.updateAssetsState(comptroller, asset)`; and
5. subtracts the amounts transferred from `assetsReserves` and `totalAssetReserve`.

Integer division rounds each destination amount down, so a small remainder can stay recorded in PSR. If a token transfer or destination callback reverts, the transaction reverts rather than completing a partial distribution.

## Read helpers

### getUnreleasedFunds

```solidity
function getUnreleasedFunds(
    address comptroller,
    Schema schema,
    address destination,
    address asset
) external view returns (uint256);
```

Returns the destination's current pro-rata share of the recorded schema balance, or zero if no matching distribution row exists.

### getPercentageDistribution

```solidity
function getPercentageDistribution(
    address destination,
    Schema schema
) external view returns (uint256);
```

Returns the configured basis-point percentage for the `(destination, schema)` pair, or zero if it is not configured.

### totalDistributions

```solidity
function totalDistributions() external view returns (uint256);
```

Returns the current number of rows in `distributionTargets`.

For the current BNB Chain mainnet downstream route, see [Protocol income, RiskFundV2, and bad-debt handling](../../../risk/risk-fund-and-shortfall-handling.md) and [TokenBuyback](../../../whats-new/token-converter.md).
