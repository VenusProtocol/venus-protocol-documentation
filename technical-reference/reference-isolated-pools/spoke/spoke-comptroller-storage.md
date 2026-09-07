# SpokeComptrollerStorage

Storage layout for the [`SpokeComptroller`](spoke-comptroller.md) contract. A fork of [`ComptrollerStorage`](../comptroller/comptroller-storage.md), kept separate so the spoke layout and the `AccountLiquiditySnapshot` struct can change without touching the shared implementation. Like the implementation it accompanies, it is re-synced by hand when `ComptrollerStorage` changes.

## Layout compatibility

The two layouts are **not** interchangeable, in either direction.

`SpokeComptroller` drops Prime, and rather than leaving a hole where `prime` sat, the fork reclaims that slot into the storage gap. Every variable declared after it therefore moves up by one: `approvedDelegates` here occupies the slot `ComptrollerStorage` gives to `prime`. Neither implementation can be swapped in under a pool running the other.

That is fine in practice, because a spoke pool upgrades through its **own beacon** and never shares an implementation with a pooled `Comptroller`. `tests/hardhat/Spoke/storageLayout.ts` pins the slot list, the divergence, and the gap size.

The contract occupies the same total number of slots as the one it was forked from: the 47 slots `ComptrollerStorage` reserves, plus the reclaimed Prime slot, minus the six slots the additions below take, leaves a `uint256[42]` gap.

## What the fork adds

| Variable | Type | Purpose |
| --- | --- | --- |
| `isSupplyAllowlistEnabled` | `mapping(address => bool)` | whether a market accepts supply only from allowlisted accounts; keyed by market, off by default |
| `isAllowedSupplier` | `mapping(address => mapping(address => bool))` | the accounts a market accepts supply from while its allowlist is enabled |
| `isLiquidationAllowlistEnabled` | `bool` | whether seizing collateral in this pool is restricted; pool-wide, off by default |
| `isAllowedLiquidator` | `mapping(address => bool)` | the accounts allowed to seize collateral while the pool's allowlist is enabled |
| `liquidationIncentives` | `mapping(address => uint256)` | per-collateral-market discount, scaled by 1e18; `0` means the pool-wide value applies |
| `deviationBoundedOracle` | `IDeviationBoundedOracle` | the oracle that bounds an asset's price against a recent window, read only on the collateral-factor path |

## What the fork removes or renames

* **`prime`** and its `NewPrimeToken` machinery are gone.
* **`liquidationIncentiveMantissa`** is renamed to `_poolLiquidationIncentiveMantissa` and made `internal`. The public getter of the same name cannot be a plain public variable any more: it has to resolve the caller's market before answering, because `VToken` reads it on itself and needs the discount that prices its own collateral, not the pool-wide default. See [Per-market liquidation incentive](spoke-comptroller.md#per-market-liquidation-incentive).

## Solidity API

```solidity
struct LiquidationOrder {
  contract VToken vTokenCollateral;
  contract VToken vTokenBorrowed;
  uint256 repayAmount;
}
```

```solidity
struct AccountLiquiditySnapshot {
  uint256 totalCollateral;
  uint256 weightedCollateral;
  uint256 borrows;
  uint256 effects;
  uint256 liquidity;
  uint256 shortfall;
  uint256 maxClearableDebt;
}
```

`maxClearableDebt` is the field this fork adds: the largest borrow value the account's collateral can clear without leaving bad debt behind, computed as the sum over the account's collateral markets of `collateralValue / liquidationIncentive`, each market at its own incentive. It routes an under-threshold account between `liquidateAccount` and `healAccount`.

> `totalCollateral` and `maxClearableDebt` are only meaningful under the **liquidation-threshold** weighting, which is what every caller that reads them passes. Under the collateral factor, `totalCollateral` is derived from the deviation-bounded collateral price rather than spot, and `maxClearableDebt` is not accumulated at all and stays zero — and a zero `maxClearableDebt` would put `healAccount` on a repayment percentage of zero, forgiving the whole position as bad debt.

```solidity
struct RewardSpeeds {
  address rewardToken;
  uint256 supplySpeed;
  uint256 borrowSpeed;
}
```

```solidity
struct Market {
  bool isListed;
  uint256 collateralFactorMantissa;
  uint256 liquidationThresholdMantissa;
  mapping(address => bool) accountMembership;
}
```

The `Action` enum is imported from `ComptrollerInterface` and is unchanged:

```solidity
enum Action {
  MINT,
  REDEEM,
  BORROW,
  REPAY,
  SEIZE,
  LIQUIDATE,
  TRANSFER,
  ENTER_MARKET,
  EXIT_MARKET
}
```

### isSupplyAllowlistEnabled

Whether a market accepts supply only from the accounts on its supply allowlist. Keyed by market, and disabled by default, so a newly listed market accepts supply from anyone.

```solidity
mapping(address => bool) isSupplyAllowlistEnabled
```

---

### isAllowedSupplier

The accounts a market accepts supply from while its supply allowlist is enabled. Keyed by market, then by account.

```solidity
mapping(address => mapping(address => bool)) isAllowedSupplier
```

---

### isLiquidationAllowlistEnabled

Whether seizing collateral in this pool is restricted to the accounts on the liquidation allowlist. Disabled by default. Pool-wide rather than per market, because `healAccount` seizes across every market the borrower is in and so cannot attribute a seizure to a single one of them.

```solidity
bool isLiquidationAllowlistEnabled
```

---

### isAllowedLiquidator

The accounts allowed to seize collateral in this pool while the liquidation allowlist is enabled.

```solidity
mapping(address => bool) isAllowedLiquidator
```

---

### liquidationIncentives

Per-market discount a liquidator receives on the collateral it seizes, scaled by 1e18. Keyed by the collateral market, since that is what the discount prices. `0` means no market value has been set, in which case the pool-wide value applies — which is always at least `1e18` for a listed market, so callers may divide by the effective value.

```solidity
mapping(address => uint256) liquidationIncentives
```

---

### deviationBoundedOracle

Oracle that bounds an asset's price against a recent window, so a deviating print cannot inflate borrowing capacity. Read only where the collateral factor weights the position; the liquidation-threshold paths stay on `oracle`, because they route liquidations. Zero until governance sets it, and while it is zero borrowing and redeeming fail closed.

```solidity
contract IDeviationBoundedOracle deviationBoundedOracle
```

---

### Constants

| Constant | Value | Purpose |
| --- | --- | --- |
| `MIN_CLOSE_FACTOR_MANTISSA` | `0.05e18` | lower bound on the close factor |
| `MAX_CLOSE_FACTOR_MANTISSA` | `0.9e18` | upper bound on the close factor |
| `MAX_COLLATERAL_FACTOR_MANTISSA` | `0.95e18` | upper bound on any market's collateral factor |
| `MIN_POOL_LIQUIDATION_INCENTIVE_MANTISSA` | `1.05e18` | lower bound on the pool-wide liquidation incentive — `1e18` plus `VToken`'s `DEFAULT_PROTOCOL_SEIZE_SHARE_MANTISSA`, restated here because that constant is internal to `VToken`. This is the one constant the shared `ComptrollerStorage` does not have. |
