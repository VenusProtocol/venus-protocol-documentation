---
title: "Yield Groups"
---

A **YieldGroup** is a Source implementation: it aggregates one or more *resources* of a single protocol family behind the uniform [`IYieldGroupBase`](/technical-reference/reference-liquidity-hub/interfaces) boundary the Hub depends on. Each YieldGroup is deployed per asset as a beacon proxy and owns its own inner deposit / withdraw queues, per-resource registry, and per-resource pause flags.

One YieldGroup contract can back more than one family, so there are fewer contracts than families:

* **Core** — the generic `YieldGroup` contract behind the Core beacon, registering Venus Core-pool vTokens (`mint` / `redeemUnderlying`) via `AdapterCoreV1`, initialised with the chain's `blocksPerYear`.
* **Flux** — the *same* `YieldGroup` contract behind the Flux beacon, registering Fluid Lending fTokens (ERC-4626 shares) via `AdapterFlux`, initialised with `blocksPerYear = 0`.
* **Spoke**: the *same* `YieldGroup` contract behind the Spoke beacon, registering the liquidity side of [hub-funded spoke pools](/technical-reference/reference-isolated-pools/spoke) via `AdapterSpokeV1`, also initialized with `blocksPerYear = 0` (each market carries its own annualizer).
* **`YieldGroupFRV`** — a separate contract, for Venus Fixed-Rate Vaults (ERC-4626 with an 11-state lifecycle).
* **`YieldGroupCentrifuge`**: a separate contract, for Centrifuge ERC-7540 fund vaults, where deposits and redemptions are requests settled later. It runs on the USDT and USDC Hubs; the U Hub has none.

"Core", "Flux" and "Spoke" are **deployment identities, not contract names**: which adapter, resources, caps and `blocksPerYear` governance wires into the proxy is the only difference. There is no `YieldGroupCore`, `YieldGroupFlux` or `YieldGroupSpoke` type to import.

All of them share the same Hub-facing surface and the same registry / queue / pause admin surface; they differ only in the protocol-specific behavior delegated to their [adapter](/technical-reference/reference-liquidity-hub/adapters) and in a few family-specific rules noted below.

> **Terminology.** These docs call this layer a *Source*; the code names the contract a *YieldGroup* and the Hub-facing interface `IYieldGroupBase`. There is no `ISource` type: "Source" survives in the Solidity only as deployment-artifact aliases (`CoreSource_USDT`, `FluxSource_USDC`, `FRVSource_U`, `SpokeSource_USDT`). A registered market or vault is a *resource*.

## Hub-facing surface (`IYieldGroupBase`)

Every YieldGroup implements `IYieldGroupBase`. The Hub depends only on these functions and never reaches past a Source into the underlying market. Mutating entry points (`deposit` / `withdraw` / `depositResource` / `withdrawResource`) are `onlyHub`-gated (`NotHub` otherwise) and `nonReentrant`.

* **`deposit(uint256 amount)` → `uint256 deposited`** — pull `amount` from the caller and place it across resources via the inner deposit queue.
* **`withdraw(uint256 amount, address to)`** — pull `amount` from resources via the inner withdraw queue (idle-first) and deliver exactly `amount` to `to`, or revert.
* **`depositResource(address resource, uint256 amount)` → `uint256 deposited`** — deposit the full `amount` into one specific resource, bypassing the inner queue (for Operator reallocation). Reverts if that resource cannot accept exactly `amount`.
* **`withdrawResource(address resource, uint256 amount, address to)`** — redeem exactly `amount` from one specific resource (no idle-first, no cascade); pulling from a paused resource is permitted (wind-down).
* **`accrue()`**: `onlyHub`; the Hub pokes every registered Source before reading NAV so the management fee is charged on interest-current value. **Every family overrides the base no-op**, so it is unreachable in deployed code. Core, Flux and Spoke share the `YieldGroup` loop, which calls `IResourceAdapter.accrue` on every registered resource: real work for Core and Spoke (both call their vToken's `accrueInterest()`), an empty body for Flux. `YieldGroupFRV` instead pokes each vault's `updateVaultState()`, advancing its lifecycle, and `YieldGroupCentrifuge` only re-anchors each vault's NAV band. The generic `YieldGroup` and FRV isolate a failed resource poke and emit `ResourceAccrualFailed`. Centrifuge handles an unreadable NAV observation silently: it keeps the existing band anchor and emits no `ResourceAccrualFailed`. This does not make valuation fail-open: a subsequent `totalAssets()` read still reverts if the adapter cannot value the resource.
* **Views** — `asset()`, `totalAssets()`, `maxDeposit()`, `maxWithdraw()`, `spotAPYBps()`.

See [Interfaces](/technical-reference/reference-liquidity-hub/interfaces) for the full `IYieldGroupBase` contract and its conventions.

## ResourceConfig

Each YieldGroup stores per-resource state. The struct is declared on `IYieldGroupBase`:

```solidity
struct ResourceConfig {
    bool registered;   // true iff present in the resource registry
    bool paused;        // when true, routing skips this resource; balance still counts
    address adapter;    // IResourceAdapter implementation handling this resource's ABI
}
```

The public accessor **`resourceConfig(address resource)`** returns the three fields as separate values `(bool registered, bool paused, address adapter)`, not as a struct.

The optional per-resource deposit cap (Core, Flux and Spoke only) lives in a separate `resourceCap` mapping so it does not disturb the struct's single-slot packing.

## Receipt tracking

Core, Flux, FRV and Spoke count only the receipt tokens (vTokens, fTokens or vault shares) they minted themselves. Valuing the whole wallet instead would let anyone move a Hub's share price by sending receipt tokens in directly, including vTokens of a market carrying bad debt, which are worth less than their exchange rate says.

Each YieldGroup keeps the count per resource, readable with `trackedReceipt(resource)`:

* A deposit adds the receipt tokens it minted, measured as the change in the wallet balance around the adapter call.
* A withdrawal subtracts the receipt tokens it burned. The count floors at zero instead of reverting, and a remainder worth 0 is dropped: a Spoke withdrawal decides whether to burn a worthless remainder by looking at the whole wallet, so donated dust could otherwise leave a count that no withdrawal reaches and that blocks `removeResource`.
* `totalAssets()` prices the count with the adapter's `receiptValue`. The liquidity a resource contributes to `maxWithdraw()` and to the withdraw path is capped at that value, so uncounted receipts never back a withdrawal. The spot APY weighting and the [per-resource cap](#resource-caps-core-flux-and-spoke-only) use the same value.

Receipt tokens sent in directly stay on the YieldGroup uncounted. Governance can admit them with `syncReceipt(resource, maxAdded)`, which sets the count to the wallet balance but adds at most `maxAdded`, and emits `ReceiptSynced`. The cap is the amount governance reviewed: a VIP executes days after it is proposed, and anything sent in meanwhile stays out above it. Syncing a vToken of a market carrying bad debt hands that loss to the Hub's lenders, so on BNB Chain mainnet the Guardian does not hold `syncReceipt`. `type(uint256).max` syncs the whole wallet. Receipt tokens nobody syncs can be [swept](#other-governance-functions) once their resource is removed.

`YieldGroupCentrifuge` does not track. Centrifuge mints the shares when it settles a request, after the deposit call has returned, so a balance change measured around the call would miss them. It still values everything it holds, bounded by the [NAV band](#nav-band). The deployed Centrifuge YieldGroups have no `syncReceipt` selector, and VIP-681 does not upgrade them. The implementation on `develop` adds the selector but reverts `ReceiptTrackingOff`.

## Initialization

Called once via the proxy:

Core, Flux and Spoke are the **same `YieldGroup` contract** behind different beacons, so they share one initializer; only the argument they pass for `blocksPerYear` differs. FRV and Centrifuge are separate contracts with an initializer of their own.

* **Core** — `initialize(address hub_, address asset_, uint256 blocksPerYear_, address acm_)`. Core annualises per-block supply rates, so it is deployed with the chain's `blocksPerYear` (**70,080,000** on BNB Chain, at roughly 0.45s per block).
* **Flux** — the same `initialize(address hub_, address asset_, uint256 blocksPerYear_, address acm_)`, deployed with `blocksPerYear_ = 0`: `AdapterFlux` reads a pre-annualised APR from the Fluid `LendingResolver` and ignores the argument.
* **FRV** — `initialize(address hub_, address asset_, address acm_)`. `YieldGroupFRV` passes `0` through to the shared base internally.
* **Centrifuge** — `initialize(address hub_, address asset_, address acm_)`, the same shape as FRV.

Each validates `asset_ == Hub.asset()` (`HubAssetMismatch` otherwise).

## Registry (governance)

* **`addResource(address resource, address adapter)`**: register a resource alongside the stateless adapter that handles its ABI. Validates that both are contracts (`ResourceNotContract` / `AdapterNotContract`) and that `adapter.asset(resource)` matches the YieldGroup's underlying (`ResourceAssetMismatch`). It then calls `adapter.validateRegistration(resource)`, which is where family-specific preconditions live: `AdapterCoreV1` rejects a vToken whose Comptroller charges a non-zero `treasuryPercent`, and `AdapterSpokeV1` rejects a market its own Comptroller does not list (`MarketNotListed`) or a market whose supply allowlist is enabled without this YieldGroup on it (`SupplyNotAllowed`), while `AdapterFlux` and `AdapterFRV` implement it as a no-op. Does not auto-append to either inner queue. Reverts `ResourceAlreadyRegistered` if present. Emits `ResourceAdded`.
* **`removeResource(address resource)`** — remove a resource. Requires a zero [tracked receipt count](#receipt-tracking), or on Centrifuge a zero raw receipt balance (`ResourceHasBalance` otherwise). Both count shares rather than value, so a sub-unit residual cannot round to zero and be orphaned, and receipt tokens sent in directly do not block removal. Also removes it from both inner queues via swap-and-pop, clears its tracked count, **and clears its per-resource cap**: `addResource` never writes that mapping and the cap setters are registered-only, so leaving it set would let a later re-add of the same address silently inherit a stale value. A remove / re-add cycle therefore starts from *unbounded*, and the cap must be set again. Emits `ResourceRemoved`.

* **`updateResourceAdapter(address resource, address adapter)`** — repoint a registered resource at a different adapter, without unwinding the position. Revalidates the new adapter the same way `addResource` does. Emits `ResourceAdapterUpdated`.
* **`forceRemoveResource(address resource)`** — FRV and Centrifuge only. On FRV, evict a resource whose vault has become unusable, abandoning any shares still held rather than blocking on the balance gate, and clear its tracked count. Reverts `ResourceHasValue` if the position is still worth recovering. Emits `ResourceForceRemoved`.

The same stateless adapter address may be reused across any number of resources in the same protocol family.

## Other governance functions

* **`setBlocksPerYear(uint256 blocksPerYear)`**: Core, Flux and Spoke only. Retune the annualisation factor if the chain's block cadence changes. Emits `BlocksPerYearSet`.
* **`sweep(address token, address to)`** — forward the full balance of an allowed ERC-20 out of the YieldGroup. Cannot take the underlying (`SweepProtectedAsset`) or a token whose own address is registered as a resource (`SweepProtectedResource`). For Core, Flux, FRV and Spoke, the resource address is also the receipt token, so receipt tokens sent in directly can only be swept after the resource is removed. Centrifuge is the exception: its registered vault and its `share()` token have different addresses, so the share token can be swept by an account holding the sweep permission. See [Centrifuge lifecycle](#centrifuge-lifecycle).

## Inner queues (Operator)

* **`setInnerDepositQueue(address[] queue)`** — replace the inner deposit-routing order. Every entry must be a registered resource; duplicates revert `InvalidQueue`. Emits `InnerDepositQueueSet`.
* **`setInnerWithdrawQueue(address[] queue)`** — replace the inner withdraw-routing order, independent of the deposit queue, under the same registration / duplicate validation; additionally, dropping a resource with a non-zero tracked count (a non-zero raw receipt balance on Centrifuge) reverts `WithdrawQueueOmitsFundedResource`. The deposit queue carries no such guard — only the withdraw side must stay able to reach funded resources. Emits `InnerWithdrawQueueSet`.

## Pause (asymmetric)

* **`pauseResource(address resource)`** — make the inner queue skip a resource. Operator-accessible. Balance still counts; `depositResource` into it reverts; `withdrawResource` from it is allowed. Emits `ResourcePauseToggled`.
* **`unpauseResource(address resource)`** — governance- and Guardian-accessible. Does not clear a Hub-level or YieldGroup-level pause. Emits `ResourcePauseToggled`.

There is no global YieldGroup pause — the only granularity inside a YieldGroup is per-resource. (A whole YieldGroup is paused at the Hub level via `pauseYieldGroup`.)

## Resource caps (Core, Flux and Spoke only)

An optional per-resource deposit cap limits how much underlying *this YieldGroup* holds in one market, independent of the market's own protocol supply cap. Effective room is `min(protocolHeadroom, resourceCap − trackedValue)`, where `trackedValue` is what the [tracked receipts](#receipt-tracking) are worth.

* **`raiseResourceCap(address resource, uint256 newCap)`** — loosen (Operator-accessible, like `lowerResourceCap`, so the Operator can open headroom ahead of a rebalance without a governance round). `newCap == 0` means unbounded, so raising to `0` removes the cap; the new value must be strictly looser (`NotIncreasing` otherwise). Emits `ResourceCapRaised`.
* **`lowerResourceCap(address resource, uint256 newCap)`** — tighten (Operator-accessible). Must be strictly tighter and non-zero (`NotDecreasing` otherwise). Lowering below the current balance simply stops new deposits; it never forces a withdrawal. Emits `ResourceCapLowered`.

`YieldGroupFRV` and `YieldGroupCentrifuge` do not expose these. FRV capacity comes entirely from the vault's own cap and its Fundraising-only rule; Centrifuge does not read the vault for capacity: the adapter reports `type(uint128).max` less the pending deposit request, zero while a deposit cancel is pending, so in practice the Hub's cap for the Source is the bound.

## Family-specific behavior

|                          | **Core** (`YieldGroup`)                                  | **Flux** (`YieldGroup`)                  | **`YieldGroupFRV`**                            | **Spoke** (`YieldGroup`)                       | **`YieldGroupCentrifuge`**                     |
| ------------------------ | -------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Resource                 | Venus Core vToken                                        | Fluid fToken                             | Fixed-Rate Vault share                         | spoke-pool vToken (isolated-pools)             | Centrifuge ERC-7540 vault share |
| Redeem-time pool fee     | grossed-up for Comptroller `treasuryPercent` if enabled; registration blocked while non-zero | none | none | none (isolated pools have no `treasuryPercent`) | none |
| Spot APY source          | `supplyRatePerBlock` × `blocksPerYear`                   | Fluid `LendingResolver` (pre-annualised) | vault `fixedAPY` net of `reserveFactor` (Fundraising / Lock only)| `supplyRatePerBlock` × the market's `blocksOrSecondsPerYear` | published with `setSpotAPYBps` |
| Per-resource deposit cap | optional                                                 | optional (primary control — Fluid `maxDeposit` is effectively unbounded) | not applicable | optional, under the pool's `supplyCaps` | not applicable |
| Lifecycle                | none                                                     | none                                     | 11-state machine (below)                       | none                                           | async request and claim (below) |

## FRV lifecycle

FRV vaults are ERC-4626 with an **11-state machine** on top. `YieldGroupFRV` calls the vault's permissionless `updateVaultState()` before every **mutating** sizing read — both cascade legs and both targeted `*Resource` legs — so deposit / withdraw routing always acts on current state. Its `accrue()` override pokes every registered vault the same way, so any Hub operation that accrues fees advances the whole family's lifecycle, not only the vault being routed to. The `maxDeposit()` / `maxWithdraw()` **views** are `view` and structurally cannot advance state, so they can report a stale figure until someone pokes `updateVaultState()`.

<figure><img src="/assets/liquidity-hub-frv-lifecycle.svg" alt="FRV lifecycle: the happy path WaitingForMargin to Matured, with deposits only in Fundraising and withdrawals only in the terminal Matured, Failed, or Liquidated states before Closed"></figure>

The full `FRVVaultState` enum (values 0–10): `WaitingForMargin`, `MarginDeposited`, `Fundraising`, `InstitutionConfirmation`, `Lock`, `PendingSettlement`, `SettlementDeadlineExceeded`, `Matured`, `Failed`, `Liquidated`, `Closed`.

* **Deposits** are accepted **only in `Fundraising`** (`maxDeposit` is 0 in every other state). Each vault has a `minSupplierDeposit` floor: a sub-floor cascade leg is skipped to the next vault; a sub-floor targeted `depositResource` reverts `ResourceBelowMinimumDeposit` — *unless* the sub-floor amount exactly fills the vault's remaining capacity (the residual tail), which is always accepted.
* **Withdrawals** are possible **only in the terminal states** `Matured`, `Failed`, or `Liquidated` — capital is locked through `Lock` and `PendingSettlement`. `Matured` adds the fixed-rate yield; `Failed` / `Liquidated` can return **less than principal**, which marks down both `maxWithdraw` and `totalAssets`.
* **Mark-to-model gap.** `AdapterFRV` values a locked position at principal plus the coupon accrued straight-line over the lock, and holds the **full** term coupon flat through `PendingSettlement` and `SettlementDeadlineExceeded` — while `maxWithdraw` stays `0` throughout. That accrued coupon therefore enters `Hub.totalAssets()` and the ERC-4626 share price before it is realized or withdrawable, and it is written down only if the vault settles `Failed` / `Liquidated`. Depositors minting during a lock buy in at a price that includes it; redeemers cannot exit against it until a terminal state.
* Because `maxDeposit()` is a view it cannot advance state, so it can report stale non-zero capacity for a vault that is time-due to leave `Fundraising`; a permissionless `updateVaultState()` poke resolves it. In practice ordinary Hub traffic supplies that poke — every `deposit` / `mint` / `withdraw` / `redeem` / `reallocate` / `accrueFees` runs `YieldGroupFRV.accrue()`, which calls `updateVaultState()` on **every** registered vault, not just the one being routed to. This is a documented honesty-contract caveat, not a fund-safety issue.

## Centrifuge lifecycle

A Centrifuge vault is **asynchronous**: the Hub moves assets straight away, but the fund manager fills a deposit or a redemption later, at a price Centrifuge publishes. `YieldGroupCentrifuge` adds the steps that sit between the request and the result.

1. **Deposit.** The Operator moves capital in with a reallocation into the group (`depositResource`), which becomes a `requestDeposit` to the vault. A lender deposit never lands here: no Centrifuge Source is in an outer deposit queue, and both have an empty inner deposit queue. While a request is pending, its value counts at face.
2. **Claim the shares.** Once the fund manager fills the request, a Keeper calls `claimDeposit(resource)` to collect the issued shares into the group.
3. **Redeem.** The Operator calls `requestRedeem(resource, shares)` to put shares up for redemption. Nothing becomes withdrawable until it is filled.
4. **Claim the assets.** A Keeper calls `claimRedeem(resource)` to collect the settled assets into the group as idle balance. A targeted `withdrawResource` can also pull settled assets directly.

A pending request can be cancelled with `cancelDepositRequest` or `cancelRedeemRequest` (Operator), and its result collected with `claimCancelDeposit` or `claimCancelRedeem` (Keeper). While a deposit cancel is pending, Centrifuge accepts no new deposit from the group, so the group reports zero deposit room until the cancel settles.

What the group holds in a vault is valued as the held shares, plus every pending and claimable amount: amounts in assets at face, amounts in shares at the vault's share price. `accrue()` claims nothing; it only re-anchors the NAV band below.

* **APY is published, not read.** Centrifuge puts no rate on chain, so each vault's rate is set with `setSpotAPYBps(resource, apyBps)`, by governance, the Operator or the Guardian. Left unset, the vault reports zero.
* **Writing off a vault.** If a position can never be claimed, `forceRemoveResource(resource)` drops the vault and writes its value off. Governance and the Guardian hold it, and it reverts `HubNotPaused` unless the Hub is paused.
* **Sweeping fund shares.** `sweep` can transfer the Centrifuge share-token balance, including the backing of a live position. It does not adjust the NAV band. If exposure remains, the floor can continue reporting value that was swept out; re-anchor with `setNavGuardSnapshot` in the same transaction. This is a privileged position transfer, not just recovery of stray tokens.
* **Investor lists.** Each fund only accepts addresses on its investor list, so Centrifuge has to add a Source before any capital can be allocated to it. Both live Sources have been added and both hold capital.

### NAV band

Every term of a Centrifuge position's value is computed off chain and published on BNB Chain, and the Hub's share price is built on it. A zero share price always reverts. On top of that, each vault can have a **NAV band** (`NavGuard`), which holds the value the group reports inside a range around an expected value:

* The band's centre starts at the last value accepted from Centrifuge, grows at `driftBps` a year, and moves by exactly the amount of every deposit and withdrawal the group makes.
* The reported value is clamped to between `centre − anchor × downGapBps / 10000` and `centre + anchor × upGapBps / 10000`: the gaps are sized to the anchor, not the centre. It never reverts.
* At most once per `interval`, the band re-anchors on the clamped reading. A wrong value can therefore move the reported value by at most one gap per interval, which gives time to notice it.
* Above the band, an inflated value is reported lower, so nobody withdraws against value that is not there. Below the band, a real loss is reported higher at first, and is marked down one gap per interval rather than all at once.

Governance, the Operator and the Guardian configure it with `setNavGuardRate(resource, driftBps, upGapBps, downGapBps, interval, capEnabled, floorEnabled)`, switches either side on or off with `setNavGuardEnabled(resource, capEnabled, floorEnabled)`, and forces a new centre with `setNavGuardSnapshot(resource, snapshot, timestamp)`, for example to accept a real markdown. Read the band with `navGuard(resource)` and its live state with `navGuardStatus(resource)`.

The band only limits how fast a wrong value moves the share price. A separate keeper check pauses the whole Hub when the value moves past a set threshold. It is live on BNB Chain: see [Automatic pause on a NAV break](/technical-reference/reference-liquidity-hub/hub#automatic-pause-on-a-nav-break).

Live values, identical on the USDT and USDC Sources:

| Vault | Drift | Band up | Band down | Re-anchor | Published APY |
| --- | --- | --- | --- | --- | --- |
| JTRSY (Janus Henderson Treasury Fund) | 5.00% | 2% | 5% | daily | 3.16% |
| JAAA (Janus Henderson AAA CLO Fund) | 5.50% | 2% | 5% | daily | 4.78% |

The two assets have separate vault contracts and therefore separate bands and separate request state, even though the funds share their share classes and NAV.

Events: `RedeemRequested`, `DepositCancelRequested`, `RedeemCancelRequested`, `DepositClaimed`, `RedeemClaimed`, `DepositCancelClaimed`, `RedeemCancelClaimed`, `ResourceForceRemoved`, `SpotAPYBpsSet`, and for the band `NavGuardConfigured`, `NavGuardEnabledSet`, `NavGuardReanchored`, `NavGuardCentreMoved`, `NavGuardClamped` and `NavGuardClosed`. Alert on `NavGuardClosed`: with the cap armed the position is then valued at zero (a floor-only band stops binding instead) until a deposit or `setNavGuardSnapshot` reopens it.

## Events

The table below covers the YieldGroup events. Centrifuge does not emit `ResourceAccrualFailed`. FRV and Centrifuge omit the three `IYieldGroup`-only events (`ResourceCapRaised`, `ResourceCapLowered`, `BlocksPerYearSet`), and they are the two that emit `ResourceForceRemoved`, with a different payload each: `(resource, orphanedShares)` on FRV, `(resource, writtenOffValue, orphanedReceipt)` on Centrifuge:

| Event                  | Parameters             | Description                                       |
| ---------------------- | ---------------------- | ------------------------------------------------- |
| `ResourceAdded`        | `resource`, `adapter`  | Resource registered alongside its adapter         |
| `ResourceRemoved`      | `resource`             | Resource removed                                  |
| `ResourcePauseToggled` | `resource`, `paused`   | Resource pause flag flipped                       |
| `InnerDepositQueueSet` | `queue`                | Inner deposit-routing order replaced              |
| `InnerWithdrawQueueSet`| `queue`                | Inner withdraw-routing order replaced             |
| `DepositRouted`        | `resource`, `amount`   | Underlying placed into a resource                 |
| `WithdrawRouted`       | `resource`, `amount`   | Underlying pulled from a resource                 |
| `ResourceCapRaised`     | `resource`, `newCap`                     | Per-resource deposit cap loosened (Core / Flux / Spoke)  |
| `ResourceCapLowered`    | `resource`, `newCap`                     | Per-resource deposit cap tightened (Core / Flux / Spoke) |
| `ResourceAdapterUpdated`| `resource`, `oldAdapter`, `newAdapter`   | A resource's adapter was swapped                 |
| `ResourceSkipped`       | `resource`, `isDeposit`                  | A cascade leg's adapter dispatch **reverted** and was routed around; a healthy system emits this zero times (paused / at-cap / dry resources are skipped silently, with no event) |
| `ResourceAccrualFailed` | `resource`, `adapter`                    | A resource poke failed and was isolated (generic YieldGroup and FRV only) |
| `BlocksPerYearSet`      | `oldBlocksPerYear`, `newBlocksPerYear`   | Annualisation factor retuned (Core / Flux / Spoke) |
| `ResourceForceRemoved`  | `resource`, `orphanedShares`             | Bricked resource evicted, abandoning its shares (FRV; Centrifuge emits its own payload, see above) |
| `Swept`                 | `token`, `to`, `amount`                  | Token balance transferred by an authorized sweep                      |
| `ReceiptSynced`         | `resource`, `oldShares`, `newShares`     | Governance synced a resource's tracked receipt count (all but Centrifuge) |

## Errors

| Error                          | When                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| `NotHub`                       | An `onlyHub` function was called by a non-Hub address                 |
| `Unauthorized`                 | Caller lacked the ACM role for the called function                    |
| `ZeroAddress`                  | A required non-zero address parameter was zero                        |
| `HubAssetMismatch`             | The asset at init does not match the Hub's `asset()`                  |
| `ResourceAssetMismatch`        | A resource's underlying does not match this YieldGroup's asset        |
| `ResourceAlreadyRegistered`    | `addResource` on an already-registered resource                       |
| `ResourceNotRegistered`        | Operation targeted a resource not in the registry                     |
| `ResourceHasBalance`           | `removeResource` while the resource's tracked count (raw receipt balance on Centrifuge) is non-zero |
| `ResourceIsPaused`             | A deposit was routed to a paused resource                             |
| `ResourceCapacityExceeded`     | A **targeted** `depositResource` exceeded that one resource's spare capacity. The inner-queue `deposit` path never reverts on capacity — it partial-fills and refunds the remainder |
| `ResourceLiquidityInsufficient`| Withdraw exceeded aggregate liquid funds across the inner queue       |
| `ResourceNotContract`          | The supplied resource address has no code                            |
| `AdapterNotContract`           | The supplied adapter address has no code                             |
| `AdapterUnderfilled`           | An adapter delegatecall's observed effect did not match the request   |
| `InvalidQueue`                 | A queue contains a **duplicate** entry (an *unregistered* entry reverts `ResourceNotRegistered` instead) |
| `NotIncreasing` / `NotDecreasing` | A `raiseResourceCap` / `lowerResourceCap` call was not strictly looser / tighter (Core / Flux / Spoke) |
| `ResourceBelowMinimumDeposit`  | An FRV targeted deposit was below `minSupplierDeposit` and not the residual tail (FRV only) |
| `ZeroShares`                   | A Centrifuge `requestRedeem` was called with zero shares (Centrifuge only) |
| `HubNotPaused`                 | A Centrifuge `forceRemoveResource` was called while the Hub was unpaused (Centrifuge only) |
| `NavGuardNotConfigured`        | `setNavGuardEnabled` was asked to arm a side of a band `setNavGuardRate` never configured (Centrifuge only) |
| `InvalidNavGuardRate`          | `setNavGuardRate` got a zero `interval`, or a gap of 100% or more (Centrifuge only) |
| `InvalidNavGuardSnapshot`      | `setNavGuardSnapshot` was called on a band never configured, or with a zero snapshot, or a zero or future timestamp (Centrifuge only) |
| `NavGuardUnreadable`           | `setNavGuardRate` could not read what the resource is worth, so arming would centre the band at zero (Centrifuge only) |
| `NavGuardCentreOverflow`       | A deposit would push a band's centre past `uint128`, so the deposit reverted (Centrifuge only) |
| `ResourceHasValue`             | (FRV only) A force-removal target still holds value that would be abandoned |
| `SweepProtectedAsset`          | `sweep` called with the YieldGroup's own underlying                   |
| `SweepProtectedResource`       | `sweep` called with a token address that is itself a registered resource             |
| `WithdrawQueueOmitsFundedResource` | An inner withdraw-queue replacement drops a funded resource       |
| `ReceiptTrackingOff`           | `syncReceipt` called on the Centrifuge implementation on `develop`; the deployed version has no such selector |
| `OnlySelf`                     | An internal dispatch entry point was called externally                |

## ACM role strings

Per YieldGroup, the role is `keccak256(yieldGroupAddress, roleString)`.

Shared by every deployed family (8):

`addResource(address,address)`, `removeResource(address)`, `updateResourceAdapter(address,address)`, `setInnerDepositQueue(address[])`, `setInnerWithdrawQueue(address[])`, `pauseResource(address)`, `unpauseResource(address)`, `sweep(address,address)`.

Core, Flux, FRV and Spoke also expose `syncReceipt(address,uint256)` after the receipt-tracking upgrade. The deployed Centrifuge YieldGroups do not.

Core, Flux and Spoke add three more, for **12** in total:

`raiseResourceCap(address,uint256)`, `lowerResourceCap(address,uint256)`, `setBlocksPerYear(uint256)`.

FRV adds one to its nine instead, for **10** in total:

`forceRemoveResource(address)`.

Centrifuge adds twelve to the shared eight, for **20** in total in the deployed version:

`requestRedeem(address,uint256)`, `cancelDepositRequest(address)`, `cancelRedeemRequest(address)`, `claimDeposit(address)`, `claimRedeem(address)`, `claimCancelDeposit(address)`, `claimCancelRedeem(address)`, `forceRemoveResource(address)`, `setSpotAPYBps(address,uint64)`, `setNavGuardRate(address,uint16,uint16,uint16,uint32,bool,bool)`, `setNavGuardSnapshot(address,uint128,uint64)`, `setNavGuardEnabled(address,bool,bool)`.

On the live Centrifuge Sources the Normal Timelock holds all twenty callable permissions, the Operator holds the queues, the async lifecycle, the four claims, `pauseResource` (but not `unpauseResource`), the band and `setSpotAPYBps`, a Keeper holds only the four claims, and the Guardian holds the pause pair, `forceRemoveResource`, `updateResourceAdapter`, the band and `setSpotAPYBps`. Across the families, adapter replacement is held by both the Normal Timelock and the Guardian. On BNB Chain mainnet, only the Normal Timelock holds `syncReceipt(address,uint256)`, granted as a wildcard role by VIP-681; that grant does not add the selector to the deployed Centrifuge contracts.
