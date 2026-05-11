# Protection Mode

### Overview

Venus already protects every market with the [Resilient Oracle](resilient-price-oracle.md), which validates prices across multiple independent sources before any value is used by the protocol. Protection Mode adds a second layer on top of that foundation for low-liquidity collateral assets: when a sudden price move on an asset looks like manipulation, Protection Mode activates and switches its borrow-capacity price to a conservative, manipulation-resistant value, while liquidations continue to use real-time spot.

The risk it mitigates is well-known on lending protocols. An attacker can pump the price of a low-liquidity token they hold as collateral, borrow far more than the token's real value warrants, and exit before the protocol can recover — leaving the protocol holding collateral worth a fraction of the outstanding debt, bad debt that socializes losses across all lenders. The mirror attack on the debt side has the same structure: an attacker manipulates the oracle to undervalue a borrow asset, drains far more of it than the collateral truly warrants at fair value, and exits before the price recovers — leaving the protocol with debt whose true value exceeds the collateral backing it.

Protection Mode prevents this by introducing a per-asset rolling spot-price window. When the current spot deviates beyond a configured threshold from that window, the asset's borrow-power calculation switches to a conservative dual-price scheme:

* **Collateral value** is computed at `min(spot, windowMin)` — caps borrow power at the recent window low so a pumped asset cannot be over-borrowed against.
* **Debt value** is computed at `max(spot, windowMax)` — floors outstanding debt at the recent window high so a crashed borrow asset cannot be repaid cheaply.
* **Liquidations continue to use spot price** — eligibility and seize-amount calculations stay on real-time prices so liquidator incentives stay correct and underwater positions are still caught immediately.
* **Only new actions are constrained** — existing positions keep their health factor evaluated at spot, so activation does not endanger any open position; the bounded prices apply only to new borrows and additional collateral movements.

### Key Mechanics

#### Rolling Price Window

For each whitelisted asset the [DeviationBoundedOracle](../technical-reference/reference-oracle/deviation-bounded-oracle.md) tracks a `(minPrice, maxPrice)` pair representing the lowest and highest spot prices observed inside a short rolling window (target: ~15 minutes). It is maintained from two sources:

* **User-triggered, expansion only.** Every relevant price read pulls spot from the [Resilient Oracle](resilient-price-oracle.md). If spot is below `minPrice` it is pulled down to spot; if above `maxPrice`, pushed up. User activity can only widen the window — never contract it.
* **Keeper-triggered, bidirectional.** An off-chain keeper maintains the true rolling window and pushes corrected `minPrice` / `maxPrice` values on-chain. The keeper queries `checkAndGetWindowDrift` to identify assets whose stored bounds have drifted past the 5% `KEEPER_DEADBAND` and only pushes those, to avoid wasting gas on no-op corrections. This is what brings the window back inwards once an extreme has aged out.

Keeper writes are validated on-chain to prevent inverted or implausible windows: a `newMin` must be `≤ spot` and `≤ maxPrice`, and a `newMax` must be `≥ spot` and `≥ minPrice`. The deadband itself is *not* enforced on-chain — it is purely a keeper-side push decision. Keeper liveness is a hard dependency for window correctness.

#### Trigger

Protection activates as a side-effect of a price read when the spot crosses the deviation threshold relative to the stored bounds:

* **Pump:** `spot > minPrice × (1 + triggerThreshold)` — spot is significantly above the recent low.
* **Crash:** `spot < maxPrice × (1 − triggerThreshold)` — spot is significantly below the recent high.

The trigger threshold is set per asset by governance, sits between 5% and 50% (the lower bound keeps routine keeper corrections from accidentally firing it), and is informed by the asset's collateral factor. The cooldown timer is re-stamped only when spot makes a *new* extreme (a new window low or high) while the trigger is sustained; recovery within the existing window keeps the cooldown ticking, so exit remains reachable once the price stabilises.

#### Exit

Protection cannot turn itself off. Exit is gated by two conditions, both of which must hold:

1. **Cooldown elapsed** since the most recent trigger.
2. **Window converged**: `(maxPrice − minPrice) / minPrice < resetThreshold`, where `resetThreshold` is configured below `triggerThreshold`.

When both conditions are satisfied, the off-chain monitor / keeper calls `exitProtectionMode(asset)` (or includes an `ExitProtectionMode` item inside `syncPriceBoundsAndProtections`) to clear the flag. Governance retains a fallback path.

#### Per-Asset Whitelist and Configuration

Protection Mode is opt-in per asset. Governance enables it by calling `setTokenConfig` (or the batch variant) on the DeviationBoundedOracle, which:

* Initializes the rolling window from the current spot.
* Stores the per-asset `cooldownPeriod`, `triggerThreshold`, and `resetThreshold`.
* Sets the bounded-pricing whitelist flag from the `enableBoundedPricing` argument — when `true` the asset participates in the Comptroller's bounded borrow-power path; when `false` the asset is initialized but the DBO short-circuits to spot until governance flips the flag with `setAssetBoundedPricingEnabled`.
* Sets the per-asset transient-cache flag from the `enableCaching` argument (configurable later via `setCachingEnabled`).

VAI is hard-rejected at config time and can never be whitelisted. For all other assets, whether Protection Mode is enabled is a governance decision driven by each asset's liquidity profile and manipulation surface; it can be toggled later with `setAssetBoundedPricingEnabled` (it cannot be turned off while protection is active).

### Where Protection Mode Applies

| Operation | Price Used When Protected | Price Used Otherwise |
| --- | --- | --- |
| Borrow-power evaluation (collateral side) | `min(spot, windowMin)` | spot |
| Borrow-power evaluation (debt side) | `max(spot, windowMax)` | spot |
| Liquidation eligibility | spot | spot |
| Liquidation seize amount | spot | spot |

The Comptroller routes borrow-power price fetches through the DeviationBoundedOracle; the liquidation path is unchanged and continues to call the Resilient Oracle directly. Non-whitelisted markets always use spot.

### Effect on Existing Positions

Three consequences follow directly from the design and are worth stating explicitly:

1. **Liquidations are unaffected.** Eligibility and seize-amount calculations continue to use the Resilient Oracle's spot price exactly as today — no code path change, and liquidator incentives stay identical.
2. **Existing positions are not retroactively endangered.** Because liquidation eligibility is evaluated at spot, switching an asset into Protection Mode does not, by itself, push any user closer to liquidation. Bounded prices apply only to the borrow-power check, so an active position keeps its existing health factor at spot. What Protection Mode restricts is **new borrow capacity** — additional borrows and collateral withdrawals are evaluated against the conservative bounded prices, reducing the headroom for new actions until protection clears.
3. **Keeper failure or misbehavior cannot threaten existing positions either.** The keeper's on-chain write constraints are limited to `newMin ≤ spot ∧ newMin ≤ maxPrice` and `newMax ≥ spot ∧ newMax ≥ minPrice` — they prevent inverted windows but do not stop a keeper from pushing the window toward an extreme. So in principle a faulty or adversarial keeper could keep Protection Mode active longer than warranted. The worst-case effect is still confined to the borrow-power path — it can over-tighten the bounded prices and **block new borrows or collateral withdrawals**, but it cannot trigger a liquidation, change a seize amount, or otherwise alter an open position. Keeper risk is bounded to denial of new capacity, never harm to existing exposure.

### Roles

* **DeviationBoundedOracle** — stores the per-asset window and protection state, performs the trigger check on every read, returns the bounded or spot price as appropriate. Wraps the Resilient Oracle, never replaces it.
* **Resilient Oracle** — the canonical spot-price source, untouched by Protection Mode and read by the DeviationBoundedOracle.
* **Keeper** — off-chain service that maintains the true rolling window, pushes `minPrice` / `maxPrice` corrections, and submits exit transactions when conditions are met.
* **Off-chain monitor** — observes protection activations and confirms price normalization before any keeper-driven exit.
* **Governance** — whitelists assets, configures thresholds and cooldowns, and acts as a fallback for disabling protection if the keeper path is unavailable.

### Frontend Indication

When Protection Mode is active for a market, the Venus interface surfaces a protection icon next to the affected asset in the dashboard, market list, and asset pages.

### Further Reading

* [DeviationBoundedOracle contract reference](../technical-reference/reference-oracle/deviation-bounded-oracle.md)
* [Resilient Price Oracle](resilient-price-oracle.md) — the spot-price source Protection Mode wraps
* [Repository](https://github.com/VenusProtocol/oracle)
