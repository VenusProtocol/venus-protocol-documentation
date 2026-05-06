# DeviationBoundedOracle

The DeviationBoundedOracle (DBO) is the contract that sits between the [ResilientOracle](../reference-oracle/resilient-oracle.md) and the Core Pool Comptroller on the borrow-power path. It maintains a per-asset rolling price window, detects when spot deviates beyond a configured threshold, and returns conservative bounded prices while the deviation persists. Its user-visible behaviour is the [Protection Mode](../../risk/protection-mode.md) feature; this article covers the contract itself — where it gets prices, what it stores, and how the Comptroller calls it.

For function-level signatures, structs, events, and errors see the [DeviationBoundedOracle reference](../reference-oracle/deviation-bounded-oracle.md).

## Pricing stack

```
                              +----------------------------+
                              |     Comptroller / Lens     |
                              +-------------+--------------+
                                            |
                                            | weightingStrategy
                +---------------------------+----------------------------+
                |                                                        |
       USE_COLLATERAL_FACTOR                                    USE_LIQUIDATION_THRESHOLD
       (borrow / redeem / supply)                               (liquidate-borrow / seize)
                |                                                        |
                |  (1) updateProtectionState   [non-view, warms cache]   |
                |  (2) getBoundedPricesView    [view, reads cache]       |
                v                                                        v
   +-------------------------------+                +----------------------------------+
   |    DeviationBoundedOracle     |                |         ResilientOracle          |
   |  + EIP-1153 transient cache   | --getPrice-->  |      (validated spot price)      |
   |                               | <--- spot ---  +----------------+-----------------+
   |  whitelisted + protection on: |                                 |
   |    returns bounded prices     |                                 v
   |                               |                  [Chainlink] [RedStone] [Binance / ...]
   |  otherwise:                   |
   |    returns spot               |
   |    (window / trigger may      |
   |     still update for          |
   |     whitelisted markets)      |
   +---------------^---------------+
                   |
                   |  updateMinPrice / updateMaxPrice / exitProtectionMode
                   |  (or batched via syncPriceBoundsAndProtections)
                   |
            +------+-------+
            |    Keeper    |
            +--------------+

  Other off-chain side channels into the DBO:
    Monitor     :  observes events, gates keeper exits on real recovery
    Governance  :  setTokenConfig, threshold / cooldown / whitelist updates
```

- The **ResilientOracle** fetches and cross-validates spot from the configured sources, exactly as today. The DBO does not replace this — it wraps it. The borrow-power path on the Comptroller never queries the ResilientOracle itself; the DBO is the only oracle the Comptroller talks to on that path.
- The **DeviationBoundedOracle (DBO)** is the single entry point for every borrow-power read on every market. On each call it fetches spot from the ResilientOracle, then returns one of three outcomes:
  - **Asset not whitelisted** (bounded pricing disabled): returns `(spot, spot)` immediately. No window read, no trigger logic, no storage write — a thin pass-through.
  - **Asset whitelisted, protection inactive**: returns `(spot, spot)`. The price equals spot, but the call still expands the rolling window if needed and runs the trigger check, so this is the path that *enters* protection mode if a deviation appears.
  - **Asset whitelisted, protection active**: returns `(min(spot, windowMin), max(spot, windowMax))`.
- The **liquidation path** (`USE_LIQUIDATION_THRESHOLD` and `liquidateCalculateSeizeTokens`) calls the ResilientOracle directly and never touches the DBO. Eligibility, seize amount, and incentive calculations stay on real-time spot regardless of whether protection is active on either side of the position.

So the DBO is always in the call chain for the borrow-power path. For non-whitelisted markets it is transparent and the price the Comptroller sees is identical to what the ResilientOracle returned; for whitelisted markets it adds the window/trigger logic on top.

## Rolling price window

For each whitelisted asset the DBO stores a `(minPrice, maxPrice)` pair representing the lowest and highest spot prices observed inside a short rolling window (target ~15 minutes). It is maintained from two distinct sources:

- **User-triggered, expansion only.** Every relevant price read pulls spot from the ResilientOracle. If `spot < minPrice`, `minPrice` is pulled down to spot; if `spot > maxPrice`, `maxPrice` is pushed up. User activity can only widen the window — never contract it.
- **Keeper-triggered, bidirectional.** The keeper maintains the true rolling window off-chain and pushes corrected values via `updateMinPrice` / `updateMaxPrice`. On-chain validation enforces both a spot bound (`newMin ≤ spot`, `newMax ≥ spot`) and a cross bound (`newMin ≤ maxPrice`, `newMax ≥ minPrice`) so the window can never be inverted. The 5% `KEEPER_DEADBAND` is *not* enforced inside the write path; the keeper queries `checkAndGetWindowDrift` (a view) to skip pushes whose delta is below the deadband, purely as a gas-saving heuristic. This is what brings the window back inwards once an extreme has aged out.

## Trigger and exit

Protection activates as a side-effect of the price read whenever spot has moved past the deviation threshold relative to the stored window:

```
pump:  spot >  minPrice × (1 + triggerThreshold)
crash: spot <  maxPrice × (1 − triggerThreshold)
```

`triggerThreshold` is per-asset, configured by governance, and bounded between `MIN_THRESHOLD = 5%` and `MAX_THRESHOLD = 50%` (the 5% floor keeps routine keeper corrections from accidentally firing it). The cooldown timer (`lastProtectionTriggeredAt`) is re-stamped only on the first activation or when spot makes a *new* extreme this update (`windowExpanded == true`). Recovery within the existing window keeps the cooldown ticking, so `exitProtectionMode` remains reachable once the price stabilises — sustained reads at the same elevated/depressed level do not, by themselves, defer exit.

Exit cannot turn itself off. Both conditions must hold:

```
1. now − lastTrigger ≥ cooldownPeriod
2. (maxPrice − minPrice) / minPrice < resetThreshold        // resetThreshold < triggerThreshold
```

When both are satisfied, the keeper / monitor calls `exitProtectionMode(asset)` (or includes an `ExitProtectionMode` item inside `syncPriceBoundsAndProtections`) to clear the active flag. Governance retains a fallback path.

## Bounded-price computation

For each whitelisted asset the DBO returns a `(collateralPrice, debtPrice)` pair:

```
protection inactive:  collateralPrice = spot,                  debtPrice = spot
protection active:    collateralPrice = min(spot, windowMin),  debtPrice = max(spot, windowMax)
```

- Collateral is capped at the recent window low so a pumped asset cannot be over-borrowed against.
- Debt is floored at the recent window high so a crashed borrow asset cannot be repaid cheaply.
- Both legs collapse back to spot once the trigger clears.

## Transient price cache

Every non-view path writes the resolved `(collateralPrice, debtPrice)` pair into EIP-1153 transient storage so a follow-up `getBoundedPricesView` in the same transaction can return it without re-fetching spot. The cache is per-asset, transaction-scoped, and clears at the end of the transaction.

Caching is configurable per asset via `setCachingEnabled(asset, enabled)`, independently of the bounded-pricing flag. When disabled, writes are no-ops and reads always miss, so every view call recomputes live from the ResilientOracle — a safety lever for forcing fresh evaluation, not a default knob.

## Function surface

The contract exposes three small groups of entry points, one per caller role.

**Comptroller — borrow-power path.** Computing a bounded price requires fetching fresh spot and updating the rolling window — both are state-mutating, so they cannot live inside a `view` function. But the borrow-power check runs through `ComptrollerLens`, which is `view`. The DBO splits the work into two calls and uses the transient cache (above) as the bridge:

- `updateProtectionState(vToken)` — non-view. Pulls fresh spot, expands the window, evaluates the trigger, and writes the resolved pair to the cache. The Comptroller calls this once per entered asset at the start of every borrow-power check, *before* the lens runs. This is also the single non-view entry point that advances DBO state day-to-day.
- `getBoundedPricesView(vToken)` (and the per-leg `getBoundedCollateralPriceView` / `getBoundedDebtPriceView`) — view. Returns the cached pair if `updateProtectionState` ran earlier in the same transaction; otherwise recomputes live from spot without any state writes.
- `getBoundedPrices(vToken)` — non-view convenience that does both in one call; for integrators that don't need the pre-warmed-cache split.

**Keeper — window correction and exit.** All three actions are gated by `AccessControlManager`.

- `updateMinPrice(asset, newMin)` / `updateMaxPrice(asset, newMax)` — push corrected bounds. On-chain checks enforce `newMin ≤ spot ∧ newMin ≤ maxPrice` and `newMax ≥ spot ∧ newMax ≥ minPrice`. The 5% `KEEPER_DEADBAND` is checked *off-chain* via `checkAndGetWindowDrift`, not in this write path.
- `exitProtectionMode(asset)` — clears the active flag once cooldown has elapsed and the window has converged below `resetThreshold`. Reverts otherwise.
- `syncPriceBoundsAndProtections(items[])` — atomic batch of the above across multiple assets in a single ACM check; any item revert rolls back the whole batch.

**Governance — configuration.**

- `setTokenConfig(...)` (and the batch variant) — initializes a market's `MarketProtectionState`, sets `triggerThreshold`, `resetThreshold`, `cooldownPeriod`, the initial `cachingEnabled` flag, and the initial bounded-pricing flag. Reverts on `MarketAlreadyInitialized`, `VAINotAllowed` (VAI is rejected by design), threshold violations, or if the seeded spot price overflows `uint128`. The initial bounded-pricing flag is independent of initialization, so an asset can be configured first and whitelisted later via `setAssetBoundedPricingEnabled`.
- `setAssetBoundedPricingEnabled(asset, enabled)` — toggles whether the DBO runs the full window/trigger logic for the asset or short-circuits to spot.
- `setCachingEnabled(asset, enabled)` — toggles the per-asset transient cache participation independently of bounded pricing.

## Liquidation path is unchanged

```
Liquidator → Comptroller (USE_LIQUIDATION_THRESHOLD) → ComptrollerLens → ResilientOracle.getUnderlyingPrice(...)
```

The borrow-power path uses `WeightFunction.USE_COLLATERAL_FACTOR` and is the only path that calls `_updateProtectionStates`. The liquidation path uses `WeightFunction.USE_LIQUIDATION_THRESHOLD` and reads spot from the ResilientOracle directly. No bounded prices touch eligibility, seize-amount, or incentive calculations regardless of whether protection is active on either side of the position.

## Off-chain components

- **Keeper.** Maintains the authoritative 15-minute rolling window off-chain and pushes corrected `minPrice` / `maxPrice` on-chain whenever the stored values have drifted past the 5% deadband. The on-chain writes are constrained by `newMin ≤ spot` and `newMax ≥ spot`. Once the on-chain exit conditions are satisfied — cooldown elapsed and window converged below `resetThreshold` — the keeper submits `exitProtectionMode(asset)`, or includes an `ExitProtectionMode` item inside a `syncPriceBoundsAndProtections` batch.
- **Monitor.** Observes protection events and price normalization across independent feeds; gates keeper exit calls on real recovery rather than just the on-chain timer.
- **Governance.** Whitelists assets via `setTokenConfig` (single or batch), sets per-asset `triggerThreshold`, `resetThreshold`, and `cooldownPeriod`, can toggle bounded pricing through `setAssetBoundedPricingEnabled`, and retains a fallback path to disable protection for an asset if the keeper path is unavailable.


## Further Reading

- [Protection Mode (risk overview)](../../risk/protection-mode.md)
- [DeviationBoundedOracle contract reference](../reference-oracle/deviation-bounded-oracle.md)
- [Resilient Price Oracle](../../risk/resilient-price-oracle.md)
- [Repository](https://github.com/VenusProtocol/oracle)
