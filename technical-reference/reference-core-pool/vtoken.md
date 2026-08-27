# BNB Core Pool vTokens

This page applies only to markets in the BNB Chain Core Pool. It replaces the previous unscoped reference to the abstract `VToken` base, which is not a complete deployable market API.

{% hint style="danger" %}
Core Pools on Ethereum, opBNB, Arbitrum, ZKsync, Optimism, Base, and Unichain use the BeaconProxy VToken architecture from the `isolated-pools` repository. Use the [BeaconProxy VToken reference](../reference-isolated-pools/vtoken/vtoken.md) for those deployments.
{% endhint %}

## BNB market types

| Underlying | Runtime pattern | Concrete API |
| --- | --- | --- |
| ERC-20/BEP-20 token | `VBep20Delegator` proxy → `VBep20Delegate` | [VBep20.sol](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Tokens/VTokens/VBep20.sol) plus shared [VToken.sol](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Tokens/VTokens/VToken.sol) |
| Native BNB | Standalone `VBNB` contract | [VBNB.sol](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Tokens/VTokens/VBNB.sol) plus shared `VToken.sol` |

At BNB Chain block `118,363,255`, the vUSDC delegator reported implementation `0xCDfea50f7CECCB24Fe804657DB8E6c93b689941e`, the delegate installed for the BNB Core ERC-20 markets upgraded by [VIP-640](https://venus.io/governance/proposal/640?chainId=56). Resolve `implementation()` on the exact market instead of assuming every market points to the same delegate.

Current market addresses are listed in [Deployed Markets](../../deployed-contracts/markets.md).

## User entry points

The native-value convention is the most important ABI difference:

| Operation | ERC-20 underlying market | Native BNB market |
| --- | --- | --- |
| Supply | `mint(uint256 mintAmount)` after underlying-token approval | `mint()` payable, or send BNB to `receive()` |
| Redeem vTokens | `redeem(uint256 redeemTokens)` | `redeem(uint256 redeemTokens)` |
| Redeem underlying | `redeemUnderlying(uint256 redeemAmount)` | `redeemUnderlying(uint256 redeemAmount)` |
| Borrow | `borrow(uint256 borrowAmount)` | `borrow(uint256 borrowAmount)` |
| Repay own debt | `repayBorrow(uint256 repayAmount)` after underlying-token approval | `repayBorrow()` payable |
| Repay another account | `repayBorrowBehalf(address,uint256)` after underlying-token approval | `repayBorrowBehalf(address)` payable |
| Liquidate | `liquidateBorrow(address,uint256,VTokenInterface)` after underlying-token approval | `liquidateBorrow(address,VToken)` payable |

For ERC-20 markets, approve the **underlying token** for supply, repay, and liquidation. Calling `approve` on the vToken instead grants permission to transfer the receipt token; it does not approve movement of the underlying asset.

Several ERC-20 methods return `0` on success and a nonzero protocol error code on failure. A successful EVM transaction alone is therefore not sufficient; clients must decode the return value and relevant events. Native BNB entry points generally revert when their internal operation fails.

## Shared accounting and reads

The abstract `VToken` base supplies receipt-token accounting, interest accrual, reserves, borrows, exchange-rate calculations, seizure, and administrative hooks. Important integration boundaries include:

* `balanceOfUnderlying`, `borrowBalanceCurrent`, `totalBorrowsCurrent`, and `exchangeRateCurrent` accrue interest and are not `view` calls.
* Snapshot-style alternatives such as `borrowBalanceStored` and `exchangeRateStored` do not accrue the market first.
* The exchange rate and interest calculations depend on the market's exact implementation and rate-time basis. See [Protocol Math](../../guides/protocol-math.md).
* Borrowing and redeeming are subject to Comptroller policy, market listing, liquidity, caps, and pause state.
* Delegated `mintBehalf`, `borrowBehalf`, and redeem-on-behalf methods require the account to authorize the caller through the BNB Core Comptroller.

## Implementation and administration

ERC-20 market calls go to the delegator address. The delegator stores balances and configuration and delegates execution to its current implementation. Read `implementation()` and generate the ABI from that implementation at the relevant block.

VBNB is not a VBep20 delegator. Some privileged operations are performed through the separate VBNBAdmin wrapper; do not infer the ERC-20 proxy upgrade or approval model for vBNB.

Governance can upgrade delegates, change interest-rate models and Comptroller configuration, or pause actions. Verify the live proxy, Comptroller, Access Control Manager, and pause state before constructing an operator transaction.
