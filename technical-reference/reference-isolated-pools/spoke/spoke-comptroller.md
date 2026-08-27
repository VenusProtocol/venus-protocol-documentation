# SpokeComptroller

`SpokeComptroller` is the Comptroller of a hub-funded spoke pool. It is a fork of the shared isolated-pools [`Comptroller`](../comptroller/comptroller.md) and behaves identically except where this page says otherwise: the same hooks, the same account-liquidity model, the same market listing and pause machinery, the same rewards flywheel.

Read [Hub-Funded Spoke Pools](README.md) first for why the fork exists and how a spoke pool is shaped.

## What the fork changes

| Area | Shared `Comptroller` | `SpokeComptroller` |
| --- | --- | --- |
| Supplying to a market | anyone, subject to the supply cap | optionally restricted to a **per-market allowlist**, checked in `preMintHook` |
| Seizing collateral | anyone | optionally restricted to a **pool-wide liquidation allowlist** |
| Liquidation incentive | one pool-wide value | **per collateral market**, falling back to the pool-wide value |
| Batch-liquidation routing | `totalCollateral` vs `borrows × incentive` | `borrows` vs `maxClearableDebt = Σ Cᵢ / incentiveᵢ` |
| Borrow-power pricing | `ResilientOracle` spot | [`DeviationBoundedOracle`](../../reference-oracle/deviation-bounded-oracle.md) bounded prices |
| Prime | `prime` + `setPrimeToken`, seven `*Verify` hooks update Prime scores | removed; the seven hooks are no-ops |
| Revert reasons | mixture of custom errors and `require` strings | every revert is a custom error |

Exit is never gated, in either implementation. Redeem, repay, withdraw and transfer are not access-controlled, and an account removed from an allowlist keeps the position it already holds and can still leave. Governance retains the usual market-level pause.

## Supply allowlist

Per market, and off by default, so a newly listed market accepts supply from anyone.

```solidity
mapping(address vToken => bool) public isSupplyAllowlistEnabled;
mapping(address vToken => mapping(address account => bool)) public isAllowedSupplier;
```

It is enforced in exactly one place — `preMintHook`:

```solidity
if (isSupplyAllowlistEnabled[vToken] && !isAllowedSupplier[vToken][minter]) {
    revert SupplyNotAllowed(vToken, minter);
}
```

**The account metered is the one credited with the vTokens, not the one paying for them.** `VToken.mintBehalf` lets a third party fund a mint attributed to someone else, and only the recipient is checked. This is deliberate: metering the recipient is what bounds a market's supply, and a third party funding a mint credited to the Hub is a donation to the pool, not a way around the restriction.

Redeeming is never restricted. Enabling the allowlist on a market that is already serving supply cuts off every account that is not on the list, including whoever seeded it — that is the intended effect, but it is worth knowing before flipping it on a live market.

On the liquidity side of a hub-funded pool the single allowlisted account is the Liquidity Hub's Spoke YieldGroup. The listing VIP must call `setAllowedSupplier` **before** the Hub registers the market as a resource: `AdapterSpokeV1.validateRegistration` rejects a market that will not accept the registering YieldGroup.

## Liquidation allowlist

Pool-wide, and off by default.

```solidity
bool public isLiquidationAllowlistEnabled;
mapping(address account => bool) public isAllowedLiquidator;
```

It is pool-wide rather than per market because `healAccount` seizes across every market the borrower is in and cannot attribute a seizure to a single one of them.

Three call sites enforce it:

* **`preSeizeHook`** — every seizure reaches this hook carrying the account that receives the collateral, whichever entry point it came from, so this is the check that actually enforces the list.
* **`healAccount`**, at the entry — a borrower holding no vTokens at all takes a branch that only calls `healBorrow` and never reaches a hook carrying the caller. Without this check anyone could move the whole remaining principal into bad debt at no cost.
* **`liquidateAccount`**, at the entry — redundant with `preSeizeHook`, but it keeps the two batch operations symmetric and fails before any interest is accrued or debt repaid.

Enabling the list also restricts `healAccount`, so any keeper relied on to record bad debt has to be allowlisted too.

Note that when the collateral is a tokenized stock liquidated through [`BStockLiquidator`](../../reference-core-pool/bstock-liquidator.md), it is **that contract's** address that has to be on the list, not the operator's — the liquidator contract is the account that receives the seized collateral.

## Per-market liquidation incentive

```solidity
mapping(address vTokenCollateral => uint256) public liquidationIncentives;
```

Keyed on the **collateral market**, because the incentive is the discount on the collateral being seized. `0` is the "unset" sentinel, in which case the pool-wide value applies:

```solidity
effectiveLiquidationIncentive(vToken) = liquidationIncentives[vToken] != 0
    ? liquidationIncentives[vToken]
    : poolLiquidationIncentive
```

The motivation is risk steering: a higher incentive on high-volatility collateral pushes liquidators to seize the riskiest collateral first, which de-risks an account faster. A borrow-only market (collateral factor `0`, never seizable) never has its incentive read at all, so it does not need a meaningful value.

**Two getters, deliberately different.**

* `effectiveLiquidationIncentive(address vToken)` — takes the market as an argument. This is what a lens, a keeper or a liquidation bot should read.
* `liquidationIncentiveMantissa()` — takes no argument and answers **for `msg.sender`**. This is the getter `ComptrollerViewInterface` declares and the one `VToken` calls on itself: `VToken._seize` divides the protocol seize share by it and `VToken.setProtocolSeizeShare` bounds that share against it, and both need the discount that prices the calling market's own collateral. Any caller that is not a market of this pool reads the pool-wide value from it.

**Floors.** An incentive is a multiplier on the debt repaid, and `VToken._seize` hands the protocol `protocolSeizeShareMantissa` of that debt out of the seized collateral. An incentive below `1e18 + protocolSeizeShareMantissa` therefore pays the liquidator less collateral than it repaid, and nobody liquidates that market.

* `setMarketLiquidationIncentive` enforces `≥ 1e18 + vToken.protocolSeizeShareMantissa()` against the market's live share.
* `setLiquidationIncentive` (the pool-wide value) enforces `≥ MIN_POOL_LIQUIDATION_INCENTIVE_MANTISSA = 1.05e18`, which is `1e18` plus `VToken`'s default seize share. That covers a freshly listed market carrying the default share and no incentive of its own. This is stricter than the shared `Comptroller`, which stops at `1e18` and would let a pool be registered with a value that pays every default-share market's liquidator less than it repaid.
* `VToken.setProtocolSeizeShare` holds the same bound from the other side, reading the incentive back through `liquidationIncentiveMantissa()`.

A market whose seize share is later raised above the default still needs an incentive of its own; the pool-wide floor is a backstop for the freshly-listed case, not a full guarantee.

There is **no way back to "unset"** once a per-market value is stored: `setMarketLiquidationIncentive` rejects `0`, so a mistaken zero cannot silently move a market back onto the pool-wide value. Pass the pool-wide value explicitly to get the same effect.

## Batch-liquidation routing

The shared `Comptroller` routes an under-threshold account between `liquidateAccount` and `healAccount` using one pool-wide incentive. With per-market incentives that no longer works, so the account snapshot carries a new field:

```
maxClearableDebt = Σ over the account's collateral markets of ( Cᵢ / incentiveᵢ )
```

where `Cᵢ` is the account's collateral value in market `i` and `incentiveᵢ` is that market's own effective incentive. It is the largest borrow value the account's collateral can clear without leaving bad debt behind.

The two batch operations are the two sides of that one benchmark, so every under-threshold account routes to exactly one of them — no gap, no overlap:

| | Condition | Reverts with |
| --- | --- | --- |
| `liquidateAccount` | `borrows < maxClearableDebt` | `DebtExceedsClearableAmount(borrows, maxClearableDebt)` |
| `healAccount` | `maxClearableDebt ≤ borrows` | `CollateralCoversDebt(borrows, maxClearableDebt)` |

`healAccount`'s repayment share becomes:

```
percentage = maxClearableDebt / borrows
```

One blended share applies to every borrow, so what the caller pays in total is the sum over the collateral markets of each market's value at its own incentive. **The discount is exact in aggregate; it is not attributed per piece of collateral.**

`liquidateAccount` needs no change beyond its gate — each order is a `(debt, collateral)` pair, and `liquidateCalculateSeizeTokens` already prices it at the collateral market's own incentive.

`maxClearableDebt` is only accumulated on liquidation-threshold snapshots. A collateral-factor snapshot leaves it at zero, and reading it there would put `healAccount` on a repayment percentage of zero — forgiving the whole position as bad debt.

Both batch operations still require the account's total collateral to be at or below `minLiquidatableCollateral`; above that threshold they revert `CollateralExceedsThreshold` and the position must go through the regular `VToken.liquidateBorrow` path.

## Bounded collateral pricing

A spoke pool values **borrowing capacity** through the [`DeviationBoundedOracle`](../../reference-oracle/deviation-bounded-oracle.md) rather than at spot. This is the same mechanism the Core pool uses; see the [DeviationBoundedOracle article](../../reference-technical-articles/deviation-bounded-oracle.md) for the window, trigger and exit logic, and [Protection Mode](../../../risk/protection-mode.md) for the user-facing behaviour.

Which oracle is read depends on which risk parameter weights the snapshot:

| Weighting | Used by | Collateral price | Debt price |
| --- | --- | --- | --- |
| `USE_COLLATERAL_FACTOR` | `preBorrowHook`, `preRedeemHook`, `getBorrowingPower`, `getHypotheticalAccountLiquidity` | `deviationBoundedOracle` | `deviationBoundedOracle` |
| `USE_LIQUIDATION_THRESHOLD` | `preLiquidateHook`, `healAccount`, `liquidateAccount`, `getAccountLiquidity` | `oracle` (spot) | `oracle` (spot) |

While protection is active for an asset the bounded oracle values collateral at the low end of its recent price window and debt at the high end; otherwise it returns spot on both legs, including for an asset it holds no configuration for. A deviating print can therefore only ever **shrink** an account's borrowing capacity, never inflate it.

The liquidation paths stay on spot because they route liquidations and set how much of a position healing repays, which has to track the live price. `liquidateCalculateSeizeTokens` is likewise priced at spot.

Before each of the two collateral-factor liquidity checks, the Comptroller calls `deviationBoundedOracle.updateProtectionState(vToken)` for every market the account is in, so a deviating print latches protection and starts its cooldown instead of evaporating once the price returns to the window.

> **`deviationBoundedOracle` must be set before the pool serves any borrow or redeem.** Nothing falls back to spot when it is unset: both calls into the zero address revert, so borrowing and redeeming fail closed rather than running unbounded. Minting and repaying are unaffected — they never read a price — and so is a redeem by an account that is not a member of the market, since `preRedeemHook` returns before the liquidity check in that case. A supply-only account such as the Liquidity Hub's YieldGroup never becomes a market member, so it can still exit a market whose pool has no bounded oracle set.

## Solidity API

Only the surface this fork adds or changes is listed here. Everything else matches the shared [`Comptroller`](../comptroller/comptroller.md).

### setMarketLiquidationIncentive

Sets the discount a liquidator receives on the collateral it seizes from a single market.

```solidity
function setMarketLiquidationIncentive(address vToken, uint256 newLiquidationIncentiveMantissa) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| vToken | address | The collateral market to set the incentive for |
| newLiquidationIncentiveMantissa | uint256 | New incentive for this market, scaled by 1e18, at least `1e18 + protocolSeizeShareMantissa` of the market |

#### 📅 Events

* Emits `NewMarketLiquidationIncentive` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* `MarketNotListed` is thrown if the market is not listed
* `InvalidLiquidationIncentive` is thrown if the new incentive would leave the liquidator with less collateral than the debt it repaid, `0` included

---

### setSupplyAllowlistEnabled

Restricts supplying to a market to the accounts on its supply allowlist, or lifts the restriction.

```solidity
function setSupplyAllowlistEnabled(address vToken, bool enabled) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| vToken | address | The market to change the setting for |
| enabled | bool | Whether the market should accept supply only from allowlisted accounts |

#### 📅 Events

* Emits `SupplyAllowlistEnabledUpdated` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* `MarketNotListed` is thrown if the market is not listed

---

### setAllowedSupplier

Adds an account to a market's supply allowlist or removes it. Takes effect only while that market's allowlist is enabled. Setting an account to the value it already holds is not an error, so a governance action that overlaps an earlier one still executes.

```solidity
function setAllowedSupplier(address vToken, address supplier, bool allowed) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| vToken | address | The market whose allowlist to update |
| supplier | address | The account to add or remove |
| allowed | bool | Whether the account should be allowed to supply |

#### 📅 Events

* Emits `AllowedSupplierUpdated` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* `MarketNotListed` is thrown if the market is not listed
* `ZeroAddressNotAllowed` is thrown if the account is the zero address

---

### setLiquidationAllowlistEnabled

Restricts seizing collateral in this pool to the accounts on the liquidation allowlist, or lifts the restriction. Also restricts `healAccount`.

```solidity
function setLiquidationAllowlistEnabled(bool enabled) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| enabled | bool | Whether seizing collateral should be restricted to allowlisted accounts |

#### 📅 Events

* Emits `LiquidationAllowlistEnabledUpdated` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

---

### setAllowedLiquidator

Adds an account to the pool's liquidation allowlist or removes it. Takes effect only while the allowlist is enabled.

```solidity
function setAllowedLiquidator(address liquidator, bool allowed) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| liquidator | address | The account to add or remove |
| allowed | bool | Whether the account should be allowed to seize collateral |

#### 📅 Events

* Emits `AllowedLiquidatorUpdated` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* `ZeroAddressNotAllowed` is thrown if the account is the zero address

---

### setDeviationBoundedOracle

Sets the deviation-bounded oracle the pool prices borrowing capacity through.

```solidity
function setDeviationBoundedOracle(IDeviationBoundedOracle newBoundedOracle) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| newBoundedOracle | IDeviationBoundedOracle | Address of the new deviation-bounded oracle |

#### 📅 Events

* Emits `NewDeviationBoundedOracle` on success

#### ⛔️ Access Requirements

* Only the owner (governance)

#### ❌ Errors

* `ZeroAddressNotAllowed` is thrown when the new oracle address is zero

---

### setLiquidationIncentive

Sets the liquidation incentive applied to any market that has no incentive of its own. Unchanged from the shared `Comptroller` except for the floor and the revert type.

```solidity
function setLiquidationIncentive(uint256 newLiquidationIncentiveMantissa) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| newLiquidationIncentiveMantissa | uint256 | New pool-wide incentive, scaled by 1e18, at least `1.05e18` |

#### 📅 Events

* Emits `NewLiquidationIncentive` on success

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* `InvalidLiquidationIncentive` is thrown if the new incentive is below `MIN_POOL_LIQUIDATION_INCENTIVE_MANTISSA`

---

### effectiveLiquidationIncentive

The discount that applies to a market: its own if it has one, otherwise the pool-wide value.

```solidity
function effectiveLiquidationIncentive(address vToken) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| vToken | address | The collateral market to read the discount of |

#### Return Values

| Name | Type | Description |
| --- | --- | --- |
| [0] | uint256 | The discount that prices this market's collateral, scaled by 1e18 |

---

### liquidationIncentiveMantissa

The discount a liquidator receives on the collateral it seizes **from the calling market**. Answers for `msg.sender` rather than taking the market as an argument — see [Per-market liquidation incentive](#per-market-liquidation-incentive).

```solidity
function liquidationIncentiveMantissa() external view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| --- | --- | --- |
| [0] | uint256 | The discount that applies to the caller, scaled by 1e18 |

---

### healAccount

Seizes all of a given account's collateral, requiring the caller to repay `maxClearableDebt / borrows` of its debt in every market. The shortfall is recorded as `badDebt` on each market and can then be auctioned for the pool's risk reserves.

```solidity
function healAccount(address user) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| user | address | The account to heal |

#### ⛔️ Access Requirements

* Not restricted while the liquidation allowlist is disabled, otherwise the caller has to be on it

#### ❌ Errors

* `LiquidationNotAllowed` is thrown if the liquidation allowlist is enabled and the caller is not on it
* `CollateralExceedsThreshold` is thrown when the account's collateral is above `minLiquidatableCollateral`
* `CollateralCoversDebt` is thrown when the collateral can clear the whole debt at each market's own incentive, which leaves nothing to heal — use `liquidateAccount`
* `InsufficientShortfall` is thrown when the account is not liquidatable

---

### liquidateAccount

Liquidates all of a borrower's positions in one call, executing the supplied orders. Skips the close-factor check.

```solidity
function liquidateAccount(address borrower, struct LiquidationOrder[] orders) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| borrower | address | The account to liquidate |
| orders | LiquidationOrder[] | The `(vTokenCollateral, vTokenBorrowed, repayAmount)` orders to execute |

#### ⛔️ Access Requirements

* Not restricted while the liquidation allowlist is disabled, otherwise the caller has to be on it

#### ❌ Errors

* `LiquidationNotAllowed` is thrown if the liquidation allowlist is enabled and the caller is not on it
* `CollateralExceedsThreshold` is thrown when the account's collateral is above `minLiquidatableCollateral`
* `DebtExceedsClearableAmount` is thrown when the debt is too large for the collateral to clear — use `healAccount`
* `NonzeroBorrowBalanceAfterLiquidation` is thrown if a debt remains in any of the borrower's markets once every order has executed
* `InsufficientShortfall` is thrown when the account is not liquidatable

---

### preMintHook

Unchanged apart from the allowlist check.

```solidity
function preMintHook(address vToken, address minter, uint256 mintAmount) external
```

#### ❌ Errors

* `SupplyNotAllowed` is thrown if the market's supply allowlist is enabled and the **minter** — the account credited with the vTokens, not necessarily the payer — is not on it
* plus every error the shared `Comptroller` throws here

---

### Post-action hooks

`mintVerify`, `redeemVerify`, `borrowVerify`, `repayBorrowVerify`, `liquidateBorrowVerify`, `seizeVerify` and `transferVerify` are all **no-ops**. They cannot be removed: `ComptrollerInterface` declares all seven, and the `VToken` calls each of them with a plain external call against a Comptroller that has no fallback, so a missing function would revert the operation it belongs to.

## Events

Everything the shared `Comptroller` emits, plus:

| Event | Emitted when |
| --- | --- |
| `NewMarketLiquidationIncentive(address indexed vToken, uint256 oldLiquidationIncentiveMantissa, uint256 newLiquidationIncentiveMantissa)` | a single market's liquidation incentive changes |
| `NewDeviationBoundedOracle(IDeviationBoundedOracle oldBoundedOracle, IDeviationBoundedOracle newBoundedOracle)` | the deviation-bounded oracle changes |
| `SupplyAllowlistEnabledUpdated(address indexed vToken, bool enabled)` | a market's supply allowlist is armed or disarmed |
| `AllowedSupplierUpdated(address indexed vToken, address indexed supplier, bool allowed)` | an account is added to or removed from a market's supply allowlist |
| `LiquidationAllowlistEnabledUpdated(bool enabled)` | the pool's liquidation allowlist is armed or disarmed |
| `AllowedLiquidatorUpdated(address indexed liquidator, bool allowed)` | an account is added to or removed from the liquidation allowlist |

`NewPrimeToken` is **not** emitted — Prime is not part of a spoke pool.

## Errors

### New

| Error | Meaning |
| --- | --- |
| `SupplyNotAllowed(address market, address supplier)` | the market's supply allowlist is enabled and the account being credited is not on it |
| `LiquidationNotAllowed(address liquidator)` | the liquidation allowlist is enabled and the account seizing is not on it |
| `InvalidLiquidationIncentive()` | an incentive below `1e18 + protocolSeizeShareMantissa` for a market, or below `MIN_POOL_LIQUIDATION_INCENTIVE_MANTISSA` for the pool-wide value |
| `CollateralCoversDebt(uint256 borrows, uint256 maxClearableDebt)` | `healAccount` on an account whose collateral can clear the whole debt |
| `DebtExceedsClearableAmount(uint256 borrows, uint256 maxClearableDebt)` | `liquidateAccount` on an account whose debt the collateral cannot clear |
| `NonzeroBorrowBalanceAfterLiquidation()` | the orders passed to `liquidateAccount` did not cover the whole position |

### Replacing `require` strings

The fork converts every remaining revert string to a custom error:

| Error | Replaces |
| --- | --- |
| `InvalidCloseFactor()` | `"Close factor greater than maximum close factor"` / `"Close factor smaller than minimum close factor"` |
| `InvalidVToken()` | `"Comptroller: Invalid vToken"` |
| `InvalidArrayLength()` | `"invalid input"` / `"invalid number of markets"` |
| `RewardsDistributorAlreadyExists()` | `"already exists"` |
| `MarketNotListed(address)` | `"cannot pause a market that is not listed"` |
| `NonzeroBorrowBalanceAfterLiquidation()` | `"Nonzero borrow balance after liquidation"` |

### Changed meaning

* **`CollateralExceedsThreshold(uint256 expectedLessThanOrEqualTo, uint256 actual)`** keeps the shared `Comptroller`'s name, arguments and selector, and is thrown by both batch operations when the account's collateral is above `minLiquidatableCollateral`. In the shared `Comptroller` `healAccount` also uses it for the "collateral covers the debt" case; here that case is `CollateralCoversDebt`.
* **`InsufficientCollateral`** does not exist in this fork. `liquidateAccount` throws `DebtExceedsClearableAmount` instead — both of its arguments are debt values rather than collateral values, and reusing the old name would leave two incompatible versions sharing one selector.
