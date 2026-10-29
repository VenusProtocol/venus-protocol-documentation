# Hub

The `Hub` is the per-asset ERC-4626 entry point of the Liquidity Hub. It accepts a single underlying asset, mints share tokens, and routes capital through a registry of Sources under a governance-set policy. One `Hub` is deployed per asset as a beacon proxy.

A Hub extends ERC-4626 with a Source registry, dual caps, an asymmetric multi-level pause, Operator reallocation, and management, performance and redeem fees. Registry and queue admin logic is delegatecall-linked into the **`HubAdminLib`** library to keep the Hub under the 24 KB bytecode limit; the library executes in the Hub's storage context.

## Inheritance

The Hub is built on the Venus upgradeable stack:

* **`ERC4626Upgradeable`** — OpenZeppelin's ERC-4626 base (deposit / mint / withdraw / redeem, share accounting).
* **`AccessControlledV8`** — every privileged setter is gated through `AccessControlManagerV8` via `_checkAccessAllowed("<function signature>")`. The role string is the literal signature text (e.g. `"addYieldGroup(address,uint256,uint16)"`), never the 4-byte selector. This base also brings in `Ownable2StepUpgradeable`, which supplies the ownership surface documented below.
* **`ReentrancyGuardUpgradeable`** — supplies the `nonReentrant` guard on the asset-moving entry points (see [Invariants and safety](#invariants-and-safety)).
* **`HubStorage`** — isolates all Hub state in a base contract with a reserved `__gap` for upgrade safety.
* **`IHub`** — external interface (see [Interfaces](interfaces.md) for the boundary types it shares with YieldGroups).

The declaration order is `ERC4626Upgradeable, AccessControlledV8, ReentrancyGuardUpgradeable, HubStorage, IHub` and is load-bearing for upgrade safety — never reorder it.

Storage lives entirely in `HubStorage`; never reorder or prepend its fields. New fields are appended and the `__gap` is shrunk by the same number of slots.

## Operation flows

All user-facing mutating operations are **atomic-or-revert** — they complete in full or revert with a named error. There is no partial fill and no remainder returned.

### Deposit

<figure><img src="../../.gitbook/assets/liquidity-hub-deposit-flow.svg" alt="Deposit flow: assets routed from the user through the Hub and a YieldGroup's adapter into a resource, with shares minted back to the receiver"><figcaption></figcaption></figure>

1. User calls `deposit(assets, receiver)` (or `mint`).
2. The Hub accrues fees, then pulls `assets` from the user — so the caller trades against the post-accrual share price.
3. The Hub snapshots `totalAssets()` (which already includes the just-transferred idle) and walks the **outer deposit queue**.
4. For each Source: skip if unregistered or paused; compute `capRoom = max(0, effectiveCap − source.totalAssets())`; send `min(remaining, capRoom, source.maxDeposit())`. A **partial fill is accepted here** — the Source places what its inner queue can absorb, refunds the unplaced remainder to the Hub, and returns the placed amount; the cascade routes that remainder to the next Source. A Source whose `deposit` call reverts outright is caught, skipped (`YieldGroupSkipped`), and routing continues. `YieldGroupUnderfilled` is a `reallocate`-only error, not a deposit-cascade one.
5. Each Source walks its **inner deposit queue**, delegatecalling its adapter per resource (respecting any per-resource cap), and credits receipt tokens to the YieldGroup for synchronous families. A Centrifuge allocation instead creates an asynchronous deposit request, with shares collected after settlement; live Centrifuge Sources are funded through targeted reallocation rather than the lender deposit queue.
6. The Hub mints share tokens to the receiver.
7. If capacity across the whole queue is short, the **entire transaction reverts** (`HubCapacityExceeded`).

### Withdrawal

<figure><img src="../../.gitbook/assets/liquidity-hub-withdrawal-flow.svg" alt="Withdrawal flow: assets pulled from a resource back through the adapter, YieldGroup, and Hub to the user, with the owner's shares burned at the Hub"><figcaption></figcaption></figure>

1. User calls `withdraw(assets, receiver, owner)` (or `redeem`).
2. The Hub accrues fees, enforces the **per-transaction withdrawal cap** (`HubWithdrawCapExceeded`), then burns shares from `owner`.
3. The Hub consumes its own **idle balance first**, then walks the **outer withdraw queue** (independent of the deposit queue).
4. For each Source, the Hub calls `Source.withdraw(amount, hub)`; the Source uses its own idle balance first, then walks its **inner withdraw queue**, delegatecalling the adapter's `redeemUnderlying` / `withdraw`.
5. The Hub measures the delivered balance delta (rather than trusting a return value) and reverts `YieldGroupUnderfilled` on any shortfall.
6. Underlying flows Resource → YieldGroup → Hub → receiver.
7. If liquidity is short, the **entire transaction reverts** (`HubInsufficientLiquidity`).

### Reallocate

<figure><img src="../../.gitbook/assets/liquidity-hub-reallocate-flow.svg" alt="Reallocate flow: the Operator directs the Hub to pull from Source A and push to Source B in a net-zero rebalance where funds never leave the Hub"><figcaption></figcaption></figure>

Reallocate moves assets between Sources — and, optionally, between specific resources within a Source — without funds entering or leaving the Hub. Both legs share the [`ReallocateLeg`](#structs) struct. The Hub treats `resource` as an **opaque pass-through**: it holds no resource registry and never reads resource state — it relays the address to the owning Source, which validates it against its own registry.

1. The Operator calls `reallocate(withdraws, deposits)`.
2. The Hub accrues fees. While paused (the `emergencyReallocate` path) it charges no fee but still settles every Source's resources, and that settlement is **fail-open**: a Source whose `accrue()` reverts is skipped and emits `YieldGroupAccrualFailed`, so it cannot block the wind-down of the healthy ones. A leg that then pulls from an unsettled Source still has to deliver its full amount or it reverts.
3. **Pull phase** — every withdraw leg runs first: `Source.withdraw` (queue) or `Source.withdrawResource` (targeted). Underlying returns to the Hub as idle. Pulling from a *paused* resource is allowed (wind-down). Every leg on both sides must carry a non-zero `amount` — a zero-amount leg reverts `ZeroAmount` rather than being skipped, which matters when the plan is generated programmatically and a no-op leg is a natural artifact.
4. The Hub takes a single TVL snapshot after all pulls — the cap reference for every push (valid because a balanced reallocate conserves TVL). While unpaused this is the strict, fail-closed `totalAssets()`. While paused (the `emergencyReallocate` path) it is a **fail-open** sum that skips any Source whose `totalAssets()` reverts, so a single bricked Source cannot block a rebalance among the healthy ones.
5. **Push phase** — each deposit leg checks the Source is registered, unpaused, and within its effective cap, then `Source.deposit` (queue) or `Source.depositResource` (targeted). Depositing into a paused resource reverts.
6. The Hub enforces `Σ withdraws == Σ deposits` (`ReallocateImbalanced` otherwise). **Net-zero invariant.**

A targeted leg (non-zero `resource`) moves the full `amount` into / out of that one resource or reverts. Setting both legs to the same `source` performs an **intra-Source move** (e.g. `vUSDT_v1` → `vUSDT_v2`). `emergencyReallocate` performs the same net-zero rebalance but **remains callable while the Hub is paused**, giving governance a wind-down lever without granting the Operator a pause bypass.

## totalAssets computation

`totalAssets()` drives share pricing for every deposit / withdraw (`convertToShares` / `convertToAssets`).

```
Hub.totalAssets()
  = Σ Source.totalAssets()  +  Hub idle balance
        │
        └─ Source.totalAssets()
             = Σ adapter.totalAssets(resource, yieldGroup)  +  Source idle balance
```

* `totalAssets()` **fails closed**. It sums every registered Source with no error isolation, so a Source whose `totalAssets()` view reverts makes the whole NAV read revert — and with it every `convertTo*` / `preview*` view and every deposit / mint / withdraw / redeem / `accrueFees` / `reallocate` — until the Source is fixed or evicted. This is deliberate: NAV is the share-price denominator, so silently counting a live Source as 0 would under-pay redeemers and over-credit depositors. Fault isolation covers the other failures: `maxWithdraw` and the withdraw routing skip a Source whose own `maxWithdraw()` reverts, the withdraw routing also skips one whose `withdraw` reverts (emitting `YieldGroupSkipped`), and the deposit routing skips a Source whose `maxDeposit()` view or `deposit` reverts. The deposit-side view lives on `HubLens` rather than the Hub, see [Sizing a deposit](#sizing-a-deposit). Recovery is the emergency path of `removeYieldGroup`, which permits removal precisely when the view reverts.
* Hub idle is normally zero (deposits route out atomically, withdrawals pull exact amounts, reallocate is balanced). A direct token donation persists and is intentionally counted into NAV — it accrues to LPs and is consumed first on withdraw; the underlying cannot be swept.
* View paths use the **stored** exchange rate (`exchangeRateStored`, stale up to one accrual cycle, no state mutation). Mutating paths trigger interest accrual on the resource during mint / redeem, so the rate is current by the time the operation completes.

## Cap enforcement

**Source level — dual cap.** Each Source carries an absolute amount AND a percentage of Hub TVL; the stricter binds:

```
effectiveCap = (percentageCapBps == 10_000)
             ? absoluteCap
             : min(absoluteCap, ceil(percentageCapBps × hubTVL / 10_000))
```

`percentageCapBps == 10_000` (100%) is a sentinel that **disables** the percentage component — required so a fresh Hub at TVL = 0 can take its first deposit (otherwise `pct × 0` collapses the cap to zero). `absoluteCap == type(uint256).max` is rejected; use the sentinel to disable the percentage dimension instead.

**Per-transaction withdrawal cap.** `maxWithdrawalSize` (asset units) bounds every single withdraw / redeem so one transaction cannot drain a downstream product's liquidity; exceeding it reverts `HubWithdrawCapExceeded`.

The optional **per-resource deposit cap** (Core, Flux and Spoke) binds one level down, inside the YieldGroup — see [Yield Groups](yield-groups.md#resource-caps-core-flux-and-spoke-only).

## Sizing a deposit

`Hub.maxDeposit` and `Hub.maxMint` are **not** limits. They return `type(uint256).max` and reflect neither the caps nor the pause state. Sizing a deposit off either one gives no signal that the deposit will revert, exactly as with `previewDeposit`.

The real ceiling lives on **`HubLens`**, a stateless, unowned, non-upgradeable periphery contract. It takes the Hub as a parameter, so a single deployment serves every Hub:

```solidity
// IHubLens is not in a published @venusprotocol/liquidity-hub release yet.
// Declare what you call, or take the full interface from the deployed contract.
interface IHubLens {
    function maxDeposit(address hub) external view returns (uint256 assets);
}

uint256 room = IHubLens(lens).maxDeposit(hub);   // 0 while the Hub is paused
```

The figure is priced against the TVL the deposit itself produces, because the cascade prices the percentage caps there too. Each Source's room is then trimmed by **0.01% of its mark**, to cover the interest the deposit settles on its way in before caps are priced. So `hub.deposit(room, receiver)` fits in the ordinary case, but it is a margin and not a proof: an accrual larger than 0.01% between the read and the deposit reverts rather than over-filling a cap. `maxMint` carries that margin twice, once through `maxDeposit` and once on the share price the mint is charged at.

A floor changes how the figure is produced. When any resource in a Source's inner deposit queue carries a minimum deposit, today only an FRV vault's `minSupplierDeposit`, `HubLens` stops solving in closed form and dry-runs the cascade instead, offering each floored Source its room candidates largest first and keeping the first amount that routes in full. That answer can sit well below the cap room, and it is `0` when every candidate leaves a leg under its floor, since such a deposit would revert rather than part-fill. `depositCapacityBreakdown` splits the same solved figure and `maxMint` runs the solve against the double-trimmed budget. Every FRV vault live on either network sets `minSupplierDeposit` to `0`, so the closed-form path is what answers today.

`depositCapacityBreakdown(hub)` returns that same total split by the Source that would receive it, in deposit-queue order, so the parts sum to `maxDeposit`. It answers "where would my deposit land", not "how much could this Source take on its own": a Source late in the queue reads `0` whenever the ones ahead of it absorb everything. Both arrays come back empty while the Hub is paused, and a Source that is paused, unregistered, view-reverting, or registered but absent from the deposit queue is left out of them entirely.

`spotAPYBps(hub)` is on the same contract: a blended spot APY in BPS, the weighted average of each Source's own `spotAPYBps()` over the Hub's whole `totalAssets()`. It is not a sum. Idle assets are counted at 0% rather than dropped, whether they sit on the Hub or on a Source, so the figure is what a lender actually earns. A Source whose `spotAPYBps()` reverts contributes 0.

If a deposit is sent anyway and does not fit, it reverts `HubCapacityExceeded(uint256 requested, uint256 maxAvailable)`. On a deposit the second argument is the amount the failed attempt routed before reverting. **It is not a safe size to retry with.** The cascade priced every percentage cap against a TVL that included the whole attempted deposit, so a smaller retry lowers that TVL and the caps with it, and can revert again. For example, ignoring fees and interest: the Hub's NAV is 100, and the only Source that can take deposits holds 40 under a 50% cap. Depositing 100 prices that cap at 100 and places 60, so it reverts with `(100, 60)`. Retrying 60 prices the cap at 80 and places only 40, so it reverts too; 20 succeeds. Size a deposit with `HubLens` and simulate the transaction rather than retrying with the reported figure.

`HubLens` inherits the Hub's fault split rather than escaping it. A Source whose quantity views revert contributes `0` and the rest of the figure still comes back; a Source whose `totalAssets()` reverts halts every `HubLens` function too, because `Hub.totalAssets()` halts first and a figure priced against a wrong NAV is worse than no figure.

Nothing on chain points at `HubLens`: it is not registered in the `HubRegistry` and no Hub exposes its address. Take it from [Deployed contracts](../../deployed-contracts/liquidity-hub.md).

## Fees

Three fee types. Management and performance fees are minted as **dilution shares** to a single `feeRecipient` (`address(0)` disables minting); the redeem fee is taken from the withdrawing lender. Accrual is idempotent within a block and runs before every deposit / withdraw / reallocate. The management and performance rates are capped at `MAX_FEE_BPS` (50%); the redeem fee is capped at `MAX_REDEEM_FEE_BPS` (5%).

* **Management fee** — linear time proration: `totalAssets × bps × Δt / (10_000 × 365 days)`. A single accrual is capped at `MAX_MGMT_FEE_PER_ACCRUAL_BPS` (100%) of TVL. When the cap binds, the accrual cursor advances only over the window that produced the cap, so the **remaining elapsed time defers** to the next accrual — but the clamped fee itself is not minted: a separate `totalFee < totalAssets()` guard skips any accrual whose combined management + performance fee would reach 100% of TVL. At the launch rate of `0` neither path is reachable.
* **Performance fee** — charged only on gains in price-per-share above a **high-water mark** (`totalAssets × 1e18 / totalSupply`). The mark moves on three paths: it ratchets up to PPS on a new high during accrual (independent of whether a fee is minted, so a later rate increase cannot retroactively claim past gains); it is incremented by the retained exit-fee PPS uplift on `withdraw` / `redeem`, so the redeem fee is not taxed as performance; and it is **re-anchored to the entry PPS — possibly downward — on a refill from an empty vault**, so a new cohort is neither shielded by nor charged for a prior cohort's high. It is therefore non-decreasing for any continuously-held cohort, but not monotonic across a full emptying.

* **Redeem fee** — an exit fee in BPS applied to `withdraw` / `redeem`, charged directly to the withdrawing lender rather than diluting the pool. Capped at `MAX_REDEEM_FEE_BPS` (`500` = 5%).

v1 launches with all three set to `0`; the machinery exists for governance to enable them later.

## Multi-level pause

Three independent scopes — a broader scope blocks everything beneath it; siblings keep operating. The Operator and Guardian can pause at every scope and unpause individual resources. Only governance can unpause a Hub or YieldGroup; unpausing a resource does not clear either broader pause.

<figure><img src="../../.gitbook/assets/liquidity-hub-multi-level-pause.svg" alt="Multi-level pause: a Hub pause blocks all user operations; a paused Source is skipped in routing while sibling Sources keep operating; a paused resource is skipped in its YieldGroup's inner queue"><figcaption></figcaption></figure>

* **Hub paused** — all deposits / withdrawals / mints / redeems, `reallocate`, and fee accrual and the fee setters are blocked; `emergencyReallocate` and `sweep` stay callable; views stay readable, though `maxWithdraw` / `maxRedeem` return `0` and `HubLens.maxDeposit` reports `0` (`maxDeposit` / `maxMint` on the Hub are not overridden, so they keep returning `type(uint256).max` even while paused). Underlying products keep operating. Only the **time-based management fee** is excluded from the pause window — `unpauseHub` advances the accrual cursor by the pause duration, so LPs are not charged rent for frozen time. The performance fee is *not* excluded: the high-water mark is deliberately left unchanged, so per-share gains the underlying products earn during the freeze are charged on the first post-resume accrual.
* **Source paused** — the Hub-level flag makes routing skip the Source **silently in both directions**: a user `deposit` / `mint` cascades to the next Source and a user `withdraw` / `redeem` pulls from elsewhere, with no `YieldGroupPaused` revert (only `HubCapacityExceeded` / `HubInsufficientLiquidity` fire if the rest of the queue cannot cover the amount). Its balance still counts in `totalAssets()` but is excluded from `maxWithdraw()` and from the `HubLens` deposit figure. Funds remain reachable via `reallocate` / `emergencyReallocate` — a **pull** leg from a paused Source is allowed, while a **push** leg into one reverts `YieldGroupPaused`.
* **Resource paused** — set on the YieldGroup, not the Hub; see [Yield Groups](yield-groups.md#pause-asymmetric).

### Automatic pause on a NAV break

{% hint style="info" %}
**Deployed; armed by VIP-673.** `HubNavDeviationSentinel` is deployed on BNB Chain at [`0x26E9497384bC4d123b9e1C530E2bC3A0dF49d2AB`](https://bscscan.com/address/0x26E9497384bC4d123b9e1C530E2bC3A0dF49d2AB) ([venus-periphery#75](https://github.com/VenusProtocol/venus-periphery/pull/75)) and on BNB Chain testnet at [`0x347fBbC71C07496fbBb2fEc5D2a036605F14089D`](https://testnet.bscscan.com/address/0x347fBbC71C07496fbBb2fEc5D2a036605F14089D), where it points at the testnet `EBrake` `0x957c09e3Ac3d9e689244DC74307c94111FBa8B42` and `HubRegistry` `0x5346f648029d1D1d1034e09e8AD7a115f5D7A159`. [VIP-673](https://app.venus.io/#/governance/proposal/673?chainId=56), queued with an ETA of 2026-10-30, arms the mainnet one: it upgrades `EBrake` to an implementation with the `pauseHub(address)` forwarder, accepts ownership of the sentinel, trusts its keeper, grants it `EBrake.pauseHub` and configures the Centrifuge resources. Until it executes, nothing is watched on mainnet: no resource is configured, no keeper is trusted, no ACM role has been granted on it, it is `Ownable2Step` with the Normal Timelock nominated but not yet accepted, and the pause itself cannot land yet: the live `EBrake` implementation [`0x2D36677EcA318c9536011D53aa752F042dd01DE8`](https://bscscan.com/address/0x2D36677EcA318c9536011D53aa752F042dd01DE8) predates the `pauseHub(address)` forwarder the sentinel calls, which shipped in `venus-periphery` v1.3.0. Every step below therefore describes the contract, not a live guard.
{% endhint %}

For a resource whose value is published by a counterparty, such as a Centrifuge vault, a trusted keeper (set with `setTrustedKeeper`, and separate from the Centrifuge Keeper role) can pause the **whole Hub** when that value moves too far from the centre of the resource's [NAV band](yield-groups.md#nav-band). The check lives in `HubNavDeviationSentinel`, a contract of its own rather than part of [`DeviationSentinel`](../reference-periphery/deviation-sentinel.md), and the pause goes through [`EBrake`](../reference-periphery/ebrake.md), the same path as the existing price-deviation check.

* Governance sets a threshold per (YieldGroup, resource) pair with `setHubNavConfig`, in basis points of the band's anchor, measured above and below the band's centre (a pause is due past `centre ± anchor × bps / 10_000`), and switches monitoring on separately with `setNavMonitoringEnabled`. A threshold of zero leaves that side unwatched; both at zero is rejected.
* The same call takes a `minPauseGap` in asset units, which has to be above zero. A band's anchor is zero from a resource's first deposit until its first re-anchor, which puts both trip points on the centre, so without that floor a routine gap would pause the Hub.
* Anyone can read whether a pause is due with `checkNavGuardDeviation(yieldGroup, resource)`, which returns a status rather than reverting. The keeper acts with `handleNavGuardDeviation`, which reverts when no action is due.
* The Hub is paused, not only the resource, because the Hub's `totalAssets()` still counts a paused resource, so the wrong value would stay in the share price.
* The pause only tightens. Unpausing stays a governance action.

## Permissions

Every ACM-gated call is authorised through `AccessControlManagerV8` — the role is `keccak256(abi.encodePacked(targetContract, roleString))`, where `roleString` is the literal function signature. The ownership functions (`transferOwnership` / `acceptOwnership` / `setAccessControlManager`) sit outside the ACM and are owner-only; see [Ownership and access control](#ownership-and-access-control). The contracts do not hard-code an Operator-vs-governance branch; the asymmetry is entirely a matter of which addresses governance grants each role to.

The main role holders are governance (a VIP, behind the Normal Timelock), the **Operator** (a Venus
operations multisig acting as the routine keeper, distinct from the Guardian), and the **Guardian**
(a multisig that acts with no timelock delay, so it can contain an incident immediately). The
Guardian can pause, perform emergency reallocation and replace resource adapters. It can also
unpause resources, but cannot unpause a Hub or YieldGroup. The Centrifuge Sources add a fourth holder, a Keeper limited to the four claim functions. All role holders are addresses granted by
proposal, not roles baked into the bytecode; the granted addresses are listed under
[Deployment](README.md#deployment).

| Action class                                                                        | Governance (VIP) | Operator | Guardian |
| ------------------------------------------------------------------------------------ | :--------------: | :------: | :------: |
| Add / remove YieldGroup, add / remove a resource                                       | ✅               | ❌       | ❌       |
| Re-adapter a resource (`updateResourceAdapter`)                                        | ✅               | ❌       | ✅       |
| Set fees and fee recipient, `sweep`, `setBlocksPerYear`                                | ✅               | ❌       | ❌       |
| **Raise** the per-transaction withdrawal cap                                           | ✅               | ❌       | ❌       |
| **Unpause** a Hub or YieldGroup                                                      | ✅               | ❌       | ❌       |
| **Unpause** a resource                                                               | ✅               | ✅       | ✅       |
| **Raise or lower** YieldGroup caps and per-resource caps                               | ✅               | ✅       | ❌       |
| **Lower** the per-transaction withdrawal cap, reorder outer / inner queues             | ✅               | ✅       | ❌       |
| **Pause** — Hub, YieldGroup, or resource                                               | ✅               | ✅       | ✅       |
| `emergencyReallocate` (works while paused)                                             | ✅               | ❌       | ✅       |
| `forceRemoveResource` (FRV and Centrifuge)                                                            | ✅               | ❌       | ✅       |
| `reallocate` between YieldGroups / resources                                           | ❌               | ✅       | ❌       |
| `addHub` / `removeHub` on the `HubRegistry`                                            | ✅               | ❌       | ❌       |
| `deposit` / `mint` / `withdraw` / `redeem`, `accrueFees`, views                        | permissionless   | permissionless | permissionless |

Two rows are worth reading carefully, because both depart from a naive loosening-vs-tightening split:

* **`raiseYieldGroupCap` and `raiseResourceCap` are Operator-accessible.** They let the Operator open headroom immediately before a `reallocate` without waiting for a governance round. The Operator can also unpause individual resources. Raising the *per-transaction withdrawal cap* and unpausing a Hub or YieldGroup remain governance-only.
* **Governance does not hold `reallocate`.** It is Operator-only. Governance's equivalent lever is `emergencyReallocate`, which has the same net-zero semantics and additionally works while the Hub is paused.

The Guardian holds pause at all three levels, `emergencyReallocate`, `forceRemoveResource`, `unpauseResource` and `updateResourceAdapter`. [VIP-661](https://app.venus.io/#/governance/proposal/661?chainId=56) granted resource unpause and adapter replacement to both the Operator and Guardian on the existing Sources; [VIP-666](https://app.venus.io/#/governance/proposal/666?chainId=56) revoked adapter replacement from the Operator. [VIP-669](https://app.venus.io/#/governance/proposal/669?chainId=56) granted the same resource-unpause and adapter-replacement split on the new Spoke Sources. Resource unpause does not clear a Hub-level or YieldGroup-level pause.

Nothing in the contracts hard-codes these role holders. The split is entirely a matter of which addresses
governance grants each role to — the asymmetry is a deployment decision, not a code branch.

## Invariants and safety

* **Atomic-or-revert.** Deposits, withdrawals, and reallocate fully complete or revert with a named error — no partial fills, no remainder returned.
* **Net-zero reallocate.** `Σ withdraws == Σ deposits`; the Operator can only move funds among registered routes, never in or out.
* **Reentrancy-guarded value paths.** Every entry point that moves assets is `nonReentrant` (`ReentrancyGuardUpgradeable`) — `deposit` / `mint` / `withdraw` / `redeem`, `reallocate`, `emergencyReallocate`, `accrueFees`, `sweep` on the Hub, and `deposit` / `withdraw` / `depositResource` / `withdrawResource` / `sweep` on each YieldGroup — since each makes external calls into Sources, delegatecalls into adapters, and reaches into the underlying Core / Flux / FRV protocols. The ACM-gated admin setters and the `onlyHub` `accrue()` poke are **not** individually guarded; they rely on ACM gating and `onlyHub` instead.
* **Fault isolation on the quantity gates, fail-closed on price.** A Source whose `maxWithdraw()` view reverts contributes 0 to `maxWithdraw()` and is skipped by the withdraw routing, as is one whose `withdraw` reverts; one whose `maxDeposit()` view or `deposit` reverts is skipped by the deposit routing. A Source whose `totalAssets()` view reverts is not isolated: `Hub.totalAssets()` is deliberately **fail-closed** and reverts with it, halting share pricing and every path that reads it rather than understating NAV. Such a Source can still be removed as an emergency eviction: `removeYieldGroup` catches the reverting view and permits removal.
* **Removal safety.** `removeYieldGroup` gates on the Source's balance so a funded Source can't be silently dropped; YieldGroups apply the same gate on a raw receipt-token balance.
* **Inflation defense.** The ERC-4626 decimals offset is set per asset at `initialize` and enforced **on-chain in both directions**: `0` and anything above `MAX_DECIMALS_OFFSET` (12) revert `InvalidDecimalsOffset`, so a Hub can never be deployed with the offset disabled. A non-zero offset is required for every asset regardless of its decimals — offset 0 would let a donation attack zero a first depositor's shares.
* **Standard ERC-20 only.** Fee-on-transfer, deflationary, and rebasing underlyings are unsupported (deposits fail closed if a token delivers less than requested).
* **Upgrade-safe storage.** State is isolated in `HubStorage` with a reserved `__gap`; fields are never reordered or prepended.

## Constants

| Constant                       | Value     | Description                                                        |
| ------------------------------ | --------- | ----------------------------------------------------------------- |
| `BPS_DENOMINATOR`              | `10_000`  | Basis-point denominator (100%)                                    |
| `EXP_SCALE`                    | `1e18`    | Fixed-point mantissa                                              |
| `MAX_DECIMALS_OFFSET`          | `12`      | Maximum ERC-4626 inflation-defense decimals offset               |
| `MAX_FEE_BPS`                  | `5_000`   | Maximum management or performance fee rate (50%)                 |
| `MAX_MGMT_FEE_PER_ACCRUAL_BPS` | `10_000`  | Cap on one management-fee accrual (100% of TVL); remainder defers |
| `MAX_REDEEM_FEE_BPS`           | `500`     | Maximum redeem (exit) fee rate (5%)                              |
| `SECONDS_PER_YEAR`             | `365 days`| Seconds per year, used for management-fee time proration          |

## State variables

Defined in `HubStorage`:

| Variable                    | Type                                          | Description                                              |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `_hubPaused`                | `bool`                                        | True while the Hub is paused                            |
| `_decimalsOffsetStored`     | `uint8`                                        | ERC-4626 inflation-defense offset, set once at init     |
| `_maxWithdrawalSize`        | `uint256`                                      | Per-transaction withdraw / redeem cap, in asset units   |
| `_registeredYieldGroups`        | `address[]`                                    | Canonical set of registered Sources                     |
| `_yieldGroupIndex`              | `mapping(address => uint256)`                  | 1-indexed position in the registry (0 = not registered) |
| `_yieldGroups`                  | `mapping(address => YieldGroupConfig)`             | Per-Source caps, pause, and registered flag             |
| `_outerDepositQueue`        | `address[]`                                    | Deposit cascading order                                 |
| `_outerWithdrawQueue`       | `address[]`                                    | Withdraw pulling order (independent of deposit queue)   |
| `_managementFeeBps`         | `uint16`                                       | Management fee rate in BPS                               |
| `_performanceFeeBps`        | `uint16`                                       | Performance fee rate in BPS                              |
| `_feeRecipient`             | `address`                                      | Recipient of newly-minted fee shares                    |
| `_redeemFeeBps`             | `uint16`                                       | Redeem (exit) fee rate in BPS; **retained in the vault** as a price-per-share uplift, not paid to `_feeRecipient` |
| `_highWaterMarkPerShare`    | `uint256`                                      | Performance HWM (`totalAssets × 1e18 / totalSupply`)    |
| `_lastFeeAccrualTimestamp`  | `uint64`                                       | Timestamp of last fee accrual                           |
| `_pauseStart`               | `uint64`                                       | Timestamp the current pause began; management-fee accrual skips the window |
| `_lastFeeAccrualBlock`      | `uint64`                                       | Block of last fee accrual; makes accrual idempotent per block |

The rows are listed in `HubStorage` declaration order. `_managementFeeBps`, `_performanceFeeBps`, `_feeRecipient` and `_redeemFeeBps` share one packed slot.

## Structs

### YieldGroupConfig

```solidity
struct YieldGroupConfig {
    uint256 absoluteCap;       // hard cap on the Source's holdings, in asset units
    uint16 percentageCapBps;   // cap as a fraction of totalAssets(); 10_000 disables this component
    bool paused;               // when true, routing skips this Source; balance still counts
    bool registered;           // true iff present in registeredYieldGroups()
}
```

### ReallocateLeg

```solidity
struct ReallocateLeg {
    address yieldGroup; // YieldGroup to act on (must be registered)
    address resource;  // specific resource, or address(0) to route through the inner queue
    uint256 amount;    // asset units to move on this leg
}
```

The same shape is reused for both the withdraw (pull) and deposit (push) arrays of `reallocate`. `resource == address(0)` cascades through the Source's inner queue (idle-first on a pull, capacity-order on a push); a non-zero `resource` moves the full `amount` against that one market / vault and bypasses the queue.

## Solidity API

### ERC-4626 user functions

Permissionless and atomic-or-revert. Each accrues fees before pricing.

* **`deposit(uint256 assets, address receiver)`** — deposit `assets`, route through the outer deposit queue, mint shares to `receiver`. Reverts `HubCapacityExceeded` / `HubPaused`.
* **`mint(uint256 shares, address receiver)`** — mint exactly `shares`, depositing the required assets.
* **`withdraw(uint256 assets, address receiver, address owner)`** — burn shares from `owner`, pull `assets` (Hub idle first, then the outer withdraw queue), deliver to `receiver`. Size the call against `maxWithdraw(owner)`: it is already clamped to the owner's balance, aggregate liquidity and `maxWithdrawalSize()`, so an over-sized request trips the inherited OpenZeppelin guard and reverts with the string error `"ERC4626: withdraw more than max"` rather than `HubWithdrawCapExceeded` or `HubInsufficientLiquidity`. Those two named errors remain reachable on the routing path.
* **`redeem(uint256 shares, address receiver, address owner)`** — burn exactly `shares` and deliver the corresponding assets.
* **`totalAssets()`** — `Σ Source.totalAssets() + Hub idle balance`.

Two consent-gated variants take an extra `bytes32 consentHash` and emit it in the same transaction as the deposit, so an integrator can prove the supplier acknowledged a specific set of terms. The hash is **event-only** — no storage is written and there is no on-chain getter, so proving acknowledgement is a log query, not a contract read. They are otherwise identical to their plain counterparts.

* **`depositWithConsent(uint256 assets, address receiver, bytes32 consentHash)`** — emits `ConsentRecorded` when `consentHash` is non-zero, then deposits. Passing `bytes32(0)` skips the emit and behaves exactly like `deposit`.
* **`mintWithConsent(uint256 shares, address receiver, bytes32 consentHash)`** — the same, for `mint`.

Not all the standard ERC-4626 views behave identically to the OpenZeppelin base:

* `convertToShares` / `convertToAssets` / `previewDeposit` / `previewMint` are **inherited unmodified**. They are pure share math and reflect *none* of the caps, liquidity, pause state or fees — sizing a deposit off `previewDeposit` gives no signal that the deposit will revert.
* `maxDeposit` / `maxMint` are **inherited unmodified** and return `type(uint256).max`, ERC-4626's "no limit" value. The Hub does not compute a deposit ceiling: OpenZeppelin's `deposit` / `mint` call these two views on every call, and solving every Source's dual cap against the TVL the deposit itself creates does not belong on that path. Caps are still enforced, by the routing cascade. Read the real figure from `HubLens`, see [Sizing a deposit](#sizing-a-deposit).
* `maxWithdraw` / `maxRedeem` are **overridden** and do reflect aggregate liquidity, the per-transaction withdrawal cap and the redeem fee. Both return `0` while the Hub is paused.
* `previewWithdraw` / `previewRedeem` are **overridden** to account for the redeem (exit) fee, so they diverge from `convertToAssets` / `convertToShares` whenever that fee is non-zero.

### Source registry (governance)

* **`addYieldGroup(address source, uint256 absoluteCap, uint16 percentageCapBps)`** — register a Source. Validates `source.asset() == asset()` (`YieldGroupAssetMismatch`) and the cap pair (`InvalidCap`); `YieldGroupAlreadyRegistered` if present. Emits `YieldGroupAdded`.
* **`removeYieldGroup(address source)`** — remove a Source. `YieldGroupHasBalance` if it still custodies a balance. Emits `YieldGroupRemoved`.
* **`raiseYieldGroupCap(address source, uint256 absoluteCap, uint16 percentageCapBps)`** — loosen caps. **Both** dimensions must be ≥ their current values and at least one must strictly increase; a full no-op reverts `NotIncreasing`. Raising one dimension while lowering the other is rejected — that needs two calls. Also reverts `YieldGroupNotRegistered` and `InvalidCap`. Operator-accessible. Emits `YieldGroupCapRaised`.
* **`lowerYieldGroupCap(address source, uint256 absoluteCap, uint16 percentageCapBps)`** — tighten caps. **Both** dimensions must be ≤ their current values and at least one must strictly decrease; a full no-op reverts `NotDecreasing`. Also reverts `YieldGroupNotRegistered` and `InvalidCap`. Operator-accessible. Emits `YieldGroupCapLowered`.

### Outer queues (Operator)

* **`setOuterDepositQueue(address[] queue)`** — replace the deposit routing order; every entry must be a registered Source (`YieldGroupNotRegistered` otherwise) with no duplicates (`InvalidQueue`). Emits `OuterDepositQueueSet`.
* **`setOuterWithdrawQueue(address[] queue)`** — replace the withdraw routing order under the same registration / duplicate validation; additionally, dropping a Source that still holds a balance reverts `WithdrawQueueOmitsFundedYieldGroup`. The funded test is **fail-closed**: a Source whose `totalAssets()` view *reverts* counts as funded, so a bricked Source can never be dropped from the withdraw queue — the mirror of `removeYieldGroup`, which deliberately permits evicting it from the registry in exactly that case. Note also that `totalAssets()` counts a Source's idle balance, so a 1-wei donation to an otherwise-empty Source is enough to pin it in the queue. Emits `OuterWithdrawQueueSet`.

### Reallocate (Operator)

* **`reallocate(ReallocateLeg[] withdraws, ReallocateLeg[] deposits)`** — atomic net-zero rebalance; `ReallocateImbalanced` if sums differ. Emits `WithdrawRouted` / `DepositRouted`.
* **`emergencyReallocate(ReallocateLeg[] withdraws, ReallocateLeg[] deposits)`** — same semantics, callable while paused, governance-only role.

### Pause (asymmetric)

* **`pauseHub()`** / **`unpauseHub()`** — pause is Operator-accessible (also Guardian); unpause is governance-only. Emits `HubPauseToggled`.
* **`pauseYieldGroup(address source)`** / **`unpauseYieldGroup(address source)`** — pause is Operator-accessible; unpause is governance-only. Emits `YieldGroupPauseToggled`.

### Per-transaction withdrawal cap

* **`raiseMaxWithdrawalSize(uint256 newSize)`** — governance-only; `NotIncreasing` if not strictly higher. Emits `MaxWithdrawalSizeRaised`.
* **`lowerMaxWithdrawalSize(uint256 newSize)`** — Operator-accessible; `NotDecreasing` if not strictly lower, and `ZeroAmount` if `newSize == 0` — the cap can never be set to zero, so use `pauseHub()` to stop withdrawals entirely. Emits `MaxWithdrawalSizeLowered`.

### Fees

* **`setManagementFeeBps(uint16 bps)`** / **`setPerformanceFeeBps(uint16 bps)`** — set fee rates; pending fees accrue at the OLD rate first. `InvalidFeeBps` above `MAX_FEE_BPS`. Emits `ManagementFeeBpsSet` / `PerformanceFeeBpsSet`.
* **`setFeeRecipient(address recipient)`** — set the recipient; pending fees mint to the OLD recipient first; `address(0)` disables minting. Emits `FeeRecipientSet`.
* **`accrueFees()`** — permissionless poke; idempotent within a block. Emits `FeesAccrued` / `HighWaterMarkUpdated`.
* **`setRedeemFeeBps(uint16 bps)`** — set the exit fee charged on `withdraw` / `redeem`. `InvalidFeeBps` above `MAX_REDEEM_FEE_BPS`. Emits `RedeemFeeBpsSet`.

### Sweep

* **`sweep(address token, address to)`** — forward the Hub's full balance of an arbitrary ERC-20 to `to`. `SweepProtectedAsset` if `token == asset()` — the underlying can never be swept. Governance-only. Emits `Swept`.

### Ownership and access control

The Hub is `Ownable2Step`, so a transfer only completes when the incoming owner accepts it. Ownership
is separate from the ACM roles above: the owner replaces the ACM itself, while the ACM decides who may
call everything else. Both sit with governance in v1.

* **`transferOwnership(address newOwner)`** — nominate a new owner. Emits `OwnershipTransferStarted`.
* **`acceptOwnership()`** — the nominee claims it. Emits `OwnershipTransferred`. The onboarding proposal calls this on each Hub.
* **`pendingOwner()` / `owner()`** — the nominee and the current owner.
* **`setAccessControlManager(address acm)`** — point the Hub at a different `AccessControlManagerV8`. Owner-only. Emits `NewAccessControlManager`.
* **`accessControlManager()`** — the ACM currently in force.

### Views

* **`yieldGroupConfig(address source)` → `YieldGroupConfig`** — full stored config for a Source.
* **`yieldGroupEffectiveCap(address source)` → `uint256`** — live effective cap (the stricter of the dual cap).
* **`registeredYieldGroups()` → `address[]`** — the Source registry.
* **`outerDepositQueue()` / `outerWithdrawQueue()` → `address[]`** — the current routing orders.
* **`maxWithdrawalSize()` → `uint256`** — per-transaction withdraw cap.
* **`hubPaused()` → `bool`** — Hub-level pause state.
* **`feeRecipient()` → `address`** — current fee recipient.
* **`feeBps()` → `(uint16 managementBps, uint16 performanceBps)`** — current dilution fee rates.
* **`redeemFeeBps()` → `uint16`** — current exit fee rate.
* **`highWaterMarkPerShare()` → `uint256`** — performance HWM in share-price units.

The Hub exposes no deposit-capacity view. That figure comes from `HubLens`, see [Sizing a deposit](#sizing-a-deposit).

## Events

| Event                     | Parameters                                                  | Description                                       |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `YieldGroupAdded`             | `yieldGroup` (indexed), `absoluteCap`, `percentageCapBps`   | Source registered                                 |
| `YieldGroupRemoved`           | `yieldGroup` (indexed)                                      | Source removed                                    |
| `YieldGroupCapRaised`         | `yieldGroup` (indexed), `absoluteCap`, `percentageCapBps`   | Source caps loosened                              |
| `YieldGroupCapLowered`        | `yieldGroup` (indexed), `absoluteCap`, `percentageCapBps`   | Source caps tightened                             |
| `YieldGroupPauseToggled`      | `yieldGroup` (indexed), `paused`                            | Source pause flag flipped                         |
| `OuterDepositQueueSet`    | `queue`                                                     | Deposit routing order replaced                    |
| `OuterWithdrawQueueSet`   | `queue`                                                     | Withdraw routing order replaced                   |
| `HubPauseToggled`         | `paused`                                                    | Hub pause flag flipped                            |
| `MaxWithdrawalSizeRaised` | `oldSize`, `newSize`                                        | Per-tx withdraw cap raised                        |
| `MaxWithdrawalSizeLowered`| `oldSize`, `newSize`                                        | Per-tx withdraw cap lowered                       |
| `DepositRouted`           | `yieldGroup` (indexed), `amount`                            | Assets deposited into a Source                    |
| `WithdrawRouted`          | `yieldGroup` (indexed), `amount`                            | Assets withdrawn from a Source                    |
| `ManagementFeeBpsSet`     | `oldBps`, `newBps`                                          | Management fee rate changed                       |
| `PerformanceFeeBpsSet`    | `oldBps`, `newBps`                                          | Performance fee rate changed                      |
| `FeeRecipientSet`         | `oldRecipient`, `newRecipient`                              | Fee recipient changed                             |
| `FeesAccrued`             | `managementShares`, `performanceShares`, `totalShares`      | Fee shares minted in an accrual                   |
| `HighWaterMarkUpdated`    | `oldHwm`, `newHwm`                                          | Performance HWM changed — ratcheted up on a new PPS high, incremented by the retained exit-fee uplift on withdraw, or **re-anchored (possibly downward)** to the entry PPS on a refill from an empty vault. Do not assume `newHwm >= oldHwm` |
| `RedeemFeeBpsSet`         | `oldBps`, `newBps`                                          | Redeem (exit) fee rate changed                    |
| `YieldGroupSkipped`       | `yieldGroup`, `isDeposit`                                   | A YieldGroup's mutating `deposit` / `withdraw` call **reverted** and routing routed around it. A healthy system emits this zero times — paused, at-cap and dry YieldGroups are skipped silently with no event |
| `YieldGroupAccrualFailed` | `yieldGroup` (indexed)                                      | An `emergencyReallocate` could not settle a YieldGroup's resources because its `accrue()` reverted, and the call continued without it. A healthy system emits this zero times |
| `ConsentRecorded`         | `supplier`, `receiver`, `consentHash`                       | A consent-gated deposit or mint recorded its hash |
| `Swept`                   | `token`, `to`, `amount`                                     | Stray-token balance rescued                       |
| `OwnershipTransferStarted`| `previousOwner`, `newOwner`                                 | Ownership transfer nominated                      |
| `OwnershipTransferred`    | `previousOwner`, `newOwner`                                 | Ownership transfer accepted                       |
| `NewAccessControlManager` | `oldAccessControlManager`, `newAccessControlManager`        | The Hub was pointed at a different ACM            |

## Errors

| Error                          | When                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| `Unauthorized`                 | Caller lacked the ACM role for the called function                        |
| `HubCapacityExceeded`          | Deposit / mint exceeds aggregate spare cap across unpaused Sources, **or** a `reallocate` / `emergencyReallocate` push leg exceeds the destination Source's own effective cap. Carries `(requested, maxAvailable)`: on a deposit, `maxAvailable` is the amount the failed attempt routed before reverting, which is not a safe retry size (see [Sizing a deposit](#sizing-a-deposit)); on a push leg, it is the destination's remaining cap room |
| `HubInsufficientLiquidity`     | Withdraw / redeem exceeds liquid funds (withdraw queue + Hub idle)         |
| `YieldGroupUnderfilled`            | A Source delivered an amount **not exactly equal** to the amount requested — under- *or* over-delivery, since the check is `!=` — on a user withdraw / redeem cascade step or on a `reallocate` leg. Not raised by the deposit cascade, which accepts partial fills |
| `HubWithdrawCapExceeded`       | Withdraw / redeem exceeds `maxWithdrawalSize()`                            |
| `HubPaused`                    | A user-facing mutating call is attempted while the Hub is paused           |
| `YieldGroupPaused`                 | A `reallocate` / `emergencyReallocate` **push** leg targets a paused Source. User deposits never raise this — the cascade skips paused Sources silently and surfaces `HubCapacityExceeded` if the amount cannot be placed |
| `YieldGroupNotRegistered`          | Operation targets a Source not in the registry                            |
| `YieldGroupAlreadyRegistered`      | `addYieldGroup` on an already-registered Source                               |
| `YieldGroupHasBalance`             | `removeYieldGroup` while the Source still holds non-zero **resource-backed** value; its idle `asset()` balance is netted out, so a Source holding only a dust donation is removable. If the Source's `totalAssets()` reverts, removal is permitted anyway as an emergency eviction |
| `YieldGroupAssetMismatch`          | A Source's `asset()` does not match the Hub's underlying                  |
| `InvalidCap`                   | Cap pair is invalid (e.g. percentage > 100%, or `absoluteCap == uint256.max`) |
| `InvalidQueue`                 | A queue contains a duplicate entry (an *unregistered* entry reverts `YieldGroupNotRegistered` instead) |
| `ReallocateImbalanced`         | `reallocate` withdraw and deposit sums do not match                       |
| `WithdrawQueueOmitsFundedYieldGroup`| A withdraw-queue replacement drops a funded Source. A Source whose `totalAssets()` reverts is treated as funded, so it cannot be dropped |
| `SweepProtectedAsset`          | `sweep` called with `token == asset()`                                   |
| `ZeroAddress` / `ZeroAmount`   | A required non-zero address / amount parameter was zero. `ZeroAmount` also fires on a zero-amount `reallocate` / `emergencyReallocate` leg (either side), and on any attempt to set `maxWithdrawalSize` to `0` |
| `InvalidDecimalsOffset`        | `decimalsOffset_` at init was `0` **or** exceeded `MAX_DECIMALS_OFFSET` (12) |
| `InvalidFeeBps`                | A management / performance rate exceeded `MAX_FEE_BPS` (5000 = 50%), **or** the redeem rate exceeded `MAX_REDEEM_FEE_BPS` (500 = 5%) |
| `NotIncreasing` / `NotDecreasing` | `raiseMaxWithdrawalSize` / `lowerMaxWithdrawalSize` was not strictly increasing / decreasing. For `raiseYieldGroupCap` / `lowerYieldGroupCap`, **both** dimensions must move in the requested direction (or stay equal) and at least one must move strictly — mixing a raise of one with a lower of the other reverts |

## ACM role strings

The role gating each privileged function is `keccak256(hubAddress, roleString)` where `roleString` is the literal signature. The ACM binds a role per contract address, so each per-asset Hub carries its own copy of all 19.

`addYieldGroup(address,uint256,uint16)`, `removeYieldGroup(address)`, `raiseYieldGroupCap(address,uint256,uint16)`, `lowerYieldGroupCap(address,uint256,uint16)`, `setOuterDepositQueue(address[])`, `setOuterWithdrawQueue(address[])`, `pauseHub()`, `unpauseHub()`, `pauseYieldGroup(address)`, `unpauseYieldGroup(address)`, `raiseMaxWithdrawalSize(uint256)`, `lowerMaxWithdrawalSize(uint256)`, `setManagementFeeBps(uint16)`, `setPerformanceFeeBps(uint16)`, `setFeeRecipient(address)`, `setRedeemFeeBps(uint16)`, `sweep(address,address)`, `reallocate((address,address,uint256)[],(address,address,uint256)[])`, `emergencyReallocate((address,address,uint256)[],(address,address,uint256)[])`.

Note the two `ReallocateLeg[]` signatures expand the struct to its tuple form `(address,address,uint256)[]` — the ACM role string must use the expanded form, not `ReallocateLeg[]`.

The `HubRegistry` carries two of its own: `addHub(address)` and `removeHub(address)`. Per-YieldGroup role strings are listed in [Yield Groups](yield-groups.md#acm-role-strings).
