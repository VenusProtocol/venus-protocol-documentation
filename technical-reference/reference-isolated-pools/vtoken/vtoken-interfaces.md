# VToken State and Interface

This page follows [`VTokenInterfaces.sol` in v4.4.0](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/VTokenInterfaces.sol). The public fields and selectors are useful for integrations, but they are not a complete storage layout. For upgrades, resolve the live VToken beacon implementation and inspect the compiler layout for that exact build.

## Deployment-version boundary

The v4.4.0 `internalCash` implementation was installed on the seven non-BNB mainnets by [VIP-600](https://github.com/VenusProtocol/vips/blob/main/vips/vip-600/bscmainnet-3.ts). The BNB Chain VToken beacon still points to the [VIP-524](https://github.com/VenusProtocol/vips/blob/main/vips/vip-524/bscmainnet.ts) implementation and therefore must not be assumed to have the v4.4.0 cash-tracking ABI. See the [live beacon map](../README.md#mainnet-implementation-map).

## Public state

| Getter | Meaning |
|---|---|
| `underlying()` | underlying ERC-20 address |
| `name()`, `symbol()`, `decimals()` | VToken ERC-20 metadata |
| `comptroller()` | this market's Comptroller proxy |
| `interestRateModel()` | current rate-model address |
| `protocolShareReserve()` / `shortfall()` | reserve destination and bad-debt recovery contract |
| `reserveFactorMantissa()` | share of borrower interest allocated to reserves |
| `accrualBlockNumber()` | last accrual **slot**; a block or timestamp despite the legacy name |
| `borrowIndex()` | global accumulated borrow index |
| `totalBorrows()`, `totalReserves()`, `totalSupply()`, `badDebt()` | market accounting totals |
| `protocolSeizeShareMantissa()` | share of seized collateral allocated to protocol reserves |
| `reduceReservesBlockDelta()` / `reduceReservesBlockNumber()` | reserve-transfer interval and last transfer **slot**, block or timestamp |
| `internalCash()` | v4.4.0 tracked cash; not part of the current BNB implementation |

The current storage also includes `_notEntered`, `initialExchangeRateMantissa`, account token balances, transfer allowances, per-account borrow snapshots, inherited upgradeable state, and a `uint256[47]` gap. Do not derive slots from the order of the public-getter table.

## Clock API

```solidity
function isTimeBased() external view returns (bool);
function blocksOrSecondsPerYear() external view returns (uint256);
function getBlockNumberOrTimestamp() external view returns (uint256);
```

Legacy selectors such as `borrowRatePerBlock`, `supplyRatePerBlock`, and `accrualBlockNumber` retain their names on time-based deployments but return or store per-second/timestamp values.

## User interface

```solidity
mint(uint256)
mintBehalf(address,uint256)
redeem(uint256)
redeemBehalf(address,uint256)
redeemUnderlying(uint256)
redeemUnderlyingBehalf(address,uint256)
borrow(uint256)
borrowBehalf(address,uint256)
repayBorrow(uint256)
repayBorrowBehalf(address,uint256)
liquidateBorrow(address,uint256,address)
transfer(address,uint256)
transferFrom(address,address,uint256)
approve(address,uint256)
increaseAllowance(address,uint256)
decreaseAllowance(address,uint256)
```

Delegated redeem and borrow permissions come from `Comptroller.updateDelegate`, not from the VToken's ERC-20 allowance.

## Accruing and stored reads

`balanceOfUnderlying`, `borrowBalanceCurrent`, `totalBorrowsCurrent`, `exchangeRateCurrent`, and `accrueInterest` can update state. Their stored counterparts (`balanceOf`, `borrowBalanceStored`, `exchangeRateStored`, and the total getters) do not accrue to the current slot.

The interface also exposes `getAccountSnapshot`, `getCash`, `allowance`, `borrowRatePerBlock`, `supplyRatePerBlock`, and `isVToken`.

## Operational interface

```solidity
setReserveFactor(uint256)
reduceReserves(uint256)
setInterestRateModel(address)
addReserves(uint256)
healBorrow(address,address,uint256)
forceLiquidateBorrow(address,address,uint256,address,bool)
seize(address,address,uint256)
badDebtRecovered(uint256)
setProtocolSeizeShare(uint256)
setProtocolShareReserve(address)
setShortfallContract(address)
sweepToken(address)
setReduceReservesBlockDelta(uint256)
syncCash()
```

Caller restrictions differ across these functions; use the [VToken API page](vtoken.md#privileged-and-protocol-operations) rather than treating this selector list as an authorization guide.

The implementation also exposes `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, owner-only `setAccessControlManager`, and the `NO_ERROR` compatibility getter.
