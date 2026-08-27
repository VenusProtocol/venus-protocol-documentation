# Adapters

An **adapter** translates between a [YieldGroup](yield-groups.md) and one protocol-specific ABI. Each adapter is a **stateless singleton**: a single deployment per ABI family serves every YieldGroup that registers a matching resource — there is no per-(YieldGroup, resource) instance, no proxy, and no clone factory.

There are four adapters:

* **`AdapterCoreV1`** — Venus Core V1 vTokens (Compound-style `mint` / `redeemUnderlying`).
* **`AdapterFlux`** — Fluid Lending fTokens (ERC-4626).
* **`AdapterFRV`** — Venus Fixed-Rate Vault shares (ERC-4626).
* **`AdapterSpokeV1`** — the liquidity side of a [hub-funded spoke pool](../reference-isolated-pools/spoke/README.md): an isolated-pools `VToken` governed by a `SpokeComptroller`. Built but **not yet deployed or wired**.

All four implement [`IResourceAdapter`](interfaces.md).

## Dispatch model

The split between mutating and view dispatch is load-bearing for security:

* **Mutating functions (`deposit`, `withdraw`) MUST be invoked via `delegatecall`** from the YieldGroup. They execute in the YieldGroup's storage context, so receipt-token credits and debits land on the YieldGroup, not the adapter. From the resource's perspective, `msg.sender` is the YieldGroup.
* **View functions are invoked via normal `call` / `staticcall`.** Where the answer depends on whose position is being queried, they take an explicit `holder` parameter (the YieldGroup).

### `onlyDelegateCall` guard

Each adapter captures its own address into an `immutable` (`_ADAPTER_SELF`) at construction. The `onlyDelegateCall` modifier reverts `NotDelegateCall` when `address(this) == _ADAPTER_SELF` — i.e. when a mutating function is invoked directly on the adapter rather than through a delegatecall. This prevents an accidental direct call that would orphan receipt tokens on the adapter. (Immutables live in bytecode, not storage slots, so they are safe to read across a delegatecall.)

### Storage-safety invariants

Verified at audit for every adapter:

1. **Zero storage variables** — only `immutable` and `constant` values are declared; the contract never `sstore`s.
2. **No inline assembly performs `sstore`.**
3. **No arbitrary call targets** — external calls go only to the supplied `resource` and its trusted, chain-fixed dependencies, never a user-supplied address. (`AdapterCoreV1` calls the vToken's `underlying()` and `comptroller()`; `AdapterFlux` calls the fToken's `asset()` and the Fluid `LendingResolver`; `AdapterFRV` calls the vault's `asset()`; `AdapterSpokeV1` calls the vToken's `underlying()` and `comptroller()`.)
4. **Mutating functions revert outside a delegatecall context** (the `onlyDelegateCall` guard).

## `IResourceAdapter` surface

* **`deposit(address resource, uint256 amount)` → `uint256 deposited`** — deposit `amount` of underlying into `resource`; receipt tokens are credited to the YieldGroup.
* **`withdraw(address resource, uint256 amount, address to)`** — redeem exactly `amount` of underlying from `resource` and deliver it to `to`.
* **`asset(address resource)` → `address`** — the underlying ERC-20 accepted by `resource`.
* **`totalAssets(address resource, address holder)` → `uint256`** — underlying value `holder` holds via `resource`. The basis is per-adapter: `AdapterCoreV1` uses the stale (non-accruing) `exchangeRateStored` net of any Comptroller `treasuryPercent`; `AdapterFlux` uses the fToken's live `previewRedeem`; `AdapterFRV` uses a time-based linear coupon accrual; `AdapterSpokeV1` uses the market's backing with `badDebt` excluded.
* **`maxDeposit(address resource)` → `uint256`** — spare deposit headroom on `resource` right now.
* **`maxWithdraw(address resource, address holder)` → `uint256`** — underlying `holder` can withdraw right now, net of any redeem-time protocol fee.
* **`spotAPYBps(address resource, uint256 blocksPerYear)` → `uint64`** — spot supply-side APY in BPS.
* **`receiptBalance(address resource, address holder)` → `uint256`** — raw receipt-token balance (vToken / fToken / FRV shares), in receipt-token units — used by `removeResource` as a share-based emptiness gate.
* **`accrue(address resource)`** — settle `resource`'s own global interest state so a following `totalAssets` read prices the position at a fresh rate. Invoked via normal `call`, **not** delegatecall, and therefore carries no `onlyDelegateCall` guard: it mutates the resource's global index, not the holder's position. Only block-lazy adapters do real work — `AdapterCoreV1` and `AdapterSpokeV1` call their vToken's `accrueInterest()`; `AdapterFlux` and `AdapterFRV` are no-ops.
* **`validateRegistration(address resource)`** — reverts if `resource` fails a protocol-specific registration precondition.

See [Interfaces](interfaces.md) for the full `IResourceAdapter` contract and its pre/post-conditions.

## AdapterCoreV1

Wraps Venus Core V1 vTokens.

* **`deposit`** — `forceApprove`s the vToken and calls `mint(amount)`; reverts `VTokenMintFailed` on a non-zero Compound error code.
* **`withdraw`** — grosses up the request for the Comptroller's treasury cut (ceil-division), calls `redeemUnderlying`, verifies the received balance delta, and transfers exactly `amount` to `to`. Any gross-up surplus stays as idle on the YieldGroup (counted in `totalAssets`, consumed idle-first next time). Reverts `VTokenRedeemFailed` / `VTokenUnderfilled` on failure.
* **Treasury-fee handling** — when the Comptroller's `treasuryPercent != 0`, `redeemUnderlying(X)` delivers only `X − fee`. The gross-up keeps individual redeems whole. `validateRegistration` **rejects** a vToken whose Comptroller already charges a non-zero `treasuryPercent` (`TreasuryFeeUnsupported`) — that exit fee leaves the pool without burning shares, so it is unmodeled in the Hub's gross NAV. The adapter performs no upper-bound check of its own on `treasuryPercent`; it relies on the Venus Comptroller's setter enforcing `treasuryPercent < 1e18`, which is what keeps the `MANTISSA_ONE − treasuryPct` subtraction and the gross-up denominator safe. Were that invariant ever violated on-chain, `withdraw` and `totalAssets` would revert on arithmetic underflow rather than with a named error.
* **Dust handling** — a withdraw cascade can hand the adapter a sub-one-vToken redeem (e.g. a 1-wei remainder from an upstream ERC-4626 source) that Compound would floor to zero tokens and reject. In that case the adapter redeems exactly one vToken unit of underlying so the burn is non-zero, then transfers only `amount` and leaves the surplus idle on the YieldGroup. A no-op for normal-sized redeems.
* **Spot APY** — `supplyRatePerBlock × blocksPerYear`, scaled to BPS and clamped to `uint64.max`.
* **`maxDeposit`** — honors the Comptroller's mint pause and supply cap (`supplyCap == 0` rejects mint outright, surfaced as 0 capacity), then trims a **0.1% conservative margin** (`raw − raw / 1000`) off the remaining headroom, so a normal inter-block interest accrual between the view and the mint cannot push `deposit(maxDeposit())` over the cap. Expect a persistent small shortfall when reconciling against the Comptroller's raw `supplyCaps(vToken)`.
* **vBNB is unsupported by design** — `IVToken(resource).underlying()` reverts on vBNB, which trips `asset()` and prevents registration.

**Constants:** `MANTISSA_ONE` (`1e18`), `EXP_SCALE` (`1e18`), `MANTISSA_TO_BPS` (`1e14`).

**Errors:** `NotDelegateCall`, `VTokenMintFailed`, `VTokenRedeemFailed`, `VTokenAccrueFailed`, `VTokenUnderfilled`, `TreasuryFeeUnsupported`.

## AdapterFlux

Wraps Fluid Lending fTokens (ERC-4626 shares). The adapter holds the Fluid `LendingResolver` address as an `immutable`, set at construction (`ZeroResolver` if zero).

* **`deposit` / `withdraw`** — uses the fToken's ERC-4626 `deposit` / `withdraw`. There is no redeem-time pool fee (Fluid's cut is already in the supply rate), so no gross-up is needed.
* **Spot APY** — read from the Fluid `LendingResolver` via `getFTokenDetails`, as the base `supplyRate` (already in BPS) **plus `rewardsRate / 1e10`** (1e12-precision rewards converted to BPS), clamped to `uint64.max`. Both are pre-annualised APRs, not per-block rates, so the `blocksPerYear` argument is unused here. Reconciling this figure against Fluid's base `supplyRate` alone will show a gap equal to the reward rate.
* **`maxDeposit`** — a Fluid fToken's protocol-level `maxDeposit` is effectively unbounded, which is why the per-resource cap on the Flux-configured `YieldGroup` deployment is the primary deposit control.
* **`validateRegistration`** — a no-op (`pure`); Flux has no per-redeem pool fee to guard against.

**Errors:** `NotDelegateCall`, `ZeroResolver`.

## AdapterFRV

Wraps Venus Fixed-Rate Vault shares (ERC-4626).

* **`deposit` / `withdraw`** — uses the vault's ERC-4626 `deposit` / `withdraw`. There is no redeem-time pool fee (the reserve factor is taken once at settlement).
* **`spotAPYBps`** — reads the vault's `state()` and returns the vault's `fixedAPY` **only while `Fundraising` or `Lock`**; in any other state it contributes no APY (the rate is not meaningful outside the active window).
* **State machine** — the adapter does **not** call `updateVaultState()`; `YieldGroupFRV` pokes it before every routing decision so the adapter always reads a current state (see the [FRV lifecycle](yield-groups.md#frv-lifecycle)).
* **`validateRegistration`** — a no-op (`pure`); FRV has no per-redeem pool fee.

**Errors:** `NotDelegateCall`.

## AdapterSpokeV1

Wraps the **liquidity side of a hub-funded spoke pool** — an isolated-pools `VToken` whose Comptroller is a [`SpokeComptroller`](../reference-isolated-pools/spoke/spoke-comptroller.md). One deployment serves every YieldGroup that registers a spoke market.

Its selectors are nearly the same as `AdapterCoreV1`'s, and it disagrees with it on every number that matters. Four differences:

* **NAV excludes `badDebt`.** See [Valuation](#valuation-excludes-written-off-debt) below — this is the important one.
* **Liquidity is cash *net of reserves*,** and both it and the position are floored to a whole number of vTokens, because `withdraw` redeems by vToken **count** rather than by underlying amount.
* **No exit fee to gross up.** Isolated pools have no `treasuryPercent`; their cut is the reserve factor, already netted out of the exchange rate. There is nothing unmodeled to reject at registration, so `validateRegistration` guards the supply allowlist instead.
* **The supply-cap sentinels are inverted** relative to Core (see `maxDeposit` below).

Detail per function:

* **`deposit`** — `forceApprove`s the market and calls `mint(amount)`. Under delegatecall the market sees the YieldGroup as `msg.sender`, so the vTokens are credited there — and that is also the account the market's supply allowlist checks. Reverts `DepositBelowOneVToken` rather than minting zero for a sub-one-vToken remainder, which hands the leg back to the YieldGroup's cascade to route around instead of stranding the amount silently.
* **`withdraw`** — **denominated in vTokens, not in underlying**: it calls `redeem(tokens)` with the fewest vTokens worth at least `amount`, rather than `redeemUnderlying(amount)`. `redeemUnderlying` derives the burn by rounding up and that derived count is not bounded by the caller's balance — `_redeemFresh` subtracts it in checked arithmetic and panics when it overshoots. Naming the burn removes the derivation. The payout is `truncate(exchangeRate × tokens)`, so it is at least `amount` and exceeds it by up to one vToken unit; the adapter forwards exactly `amount` and leaves the surplus as idle on the YieldGroup. **Unlike Flux and FRV, Spoke leaves a surplus on essentially every redeem.**
* **`accrue`** — pokes the market's `accrueInterest()`, like Core.
* **`maxDeposit`** — honors, in order: the market's supply allowlist, its `MINT` pause, and its supply cap. **The cap sentinels are the inverse of Core's**: a cap of `0` is a real cap of zero (`preMintHook` rejects every mint against it), and `type(uint256).max` is the "uncapped" sentinel. Uncapped markets report `type(uint128).max` rather than `type(uint256).max`, because `YieldGroupBase.maxDeposit()` sums the room of every queued resource in checked arithmetic and two uncapped markets would overflow that sum. Headroom is then trimmed by a **0.1% conservative margin**, as Core does, so a normal accrual between the view and the mint cannot push `deposit(maxDeposit())` over the cap. Room below one vToken unit is reported as zero.
* **`maxWithdraw`** — the lesser of the position's recoverable value and the market's *payable* cash (`getCash − totalReserves`; reserves sit inside cash but are not redeemable, and `_redeemFresh` gates on the difference). Subtracting reserves also makes the figure invariant across the reserve sweep `accrueInterest` performs. Both sides are floored to a whole number of vTokens and valued back into underlying, because `withdraw` redeems by count. The flooring is exact rather than conservative, so the last vToken stays withdrawable and a market can be drained to zero and deregistered.
* **`spotAPYBps`** — `supplyRatePerBlock × blocksOrSecondsPerYear`, read from the **market itself**. The `blocksPerYear` argument is ignored: an isolated-pools market carries its own annualiser as an immutable and may be block- or time-based, so a YieldGroup-level constant would misprice whichever kind it was not configured for. Deploy the Spoke YieldGroup with `blocksPerYear = 0`, as the Flux family already does.
* **`validateRegistration`** — rejects a market whose supply allowlist is enabled without the registering YieldGroup on it (`SupplyNotAllowed`); every deposit would revert, so the resource would occupy a queue slot it can never fill. **The listing VIP must therefore call `setAllowedSupplier(vToken, <SpokeSource>, true)` on the pool before `addResource`.** The same call doubles as proof that the market really belongs to a spoke pool, since the allowlist accessors exist only on `SpokeComptroller` and the call reverts against any other Comptroller. Nothing else is asserted — in particular an unset `deviationBoundedOracle` is *not* grounds for rejection: it blocks borrowing, and so the market's yield, but leaves the Hub's own paths intact.

### Valuation excludes written-off debt

An isolated-pools market keeps `badDebt` in the numerator of its exchange rate, so the rate does **not** fall when `healAccount` writes a loss off; the loss surfaces only as redemptions failing for want of cash. Valuing a Hub position at that rate would report unrecoverable value, and inside the Hub the loss would then land by exit order — early LPs out at the pre-loss share price, the last one absorbing everything.

`totalAssets` therefore values the position at its pro-rata share of `cash + totalBorrows − totalReserves`, which is `exchangeRateStored` with `badDebt` dropped, capped at the market's own valuation of the same tokens. The mark is pro-rata (`balance / totalSupply`), so it stays correct whether or not the Hub is the market's only supplier, and it marks every LP down at the same instant. A [Shortfall](../reference-isolated-pools/risk-fund-and-shortfall/shortfall.md) auction that later recovers the debt raises cash and lowers `badDebt` by the same amount, so the mark recovers with no Hub-side action.

The cap exists because of rounding, not risk: the adapter reaches its figure in one step where the market takes two, so with no `badDebt` the one-step figure can land a unit above `balanceOfUnderlying` — value no redeem can reach. Whenever `badDebt` is non-zero the cap is the looser of the two and the recoverable figure is what binds.

Note that `maxDeposit` uses the market's **own** (badDebt-inclusive) exchange rate, not this valuation basis, because its headroom math has to mirror `preMintHook`'s own cap check.

### Caller identity

`maxDeposit` and `validateRegistration` are the two `IResourceAdapter` members that take no `holder`, and both are invoked by the YieldGroup as a plain call — so `msg.sender` **is** the prospective supplier, and reading the market's allowlist against it is exact rather than a convention. Operationally this means a YieldGroup whose grant is revoked reports zero room and is routed around, instead of advertising capacity that every deposit then reverts on.

Fee-on-transfer underlyings are unsupported, matching the rest of the Hub.

**Constants:** `EXP_SCALE` (`1e18`), `UNCAPPED_DEPOSIT_ROOM` (`type(uint128).max`), `MANTISSA_TO_BPS` (`1e14`), `CAP_TRIM_DIVISOR` (`1000`).

**Errors:** `NotDelegateCall`, `VTokenMintFailed`, `VTokenRedeemFailed`, `VTokenAccrueFailed`, `VTokenUnderfilled`, `DepositBelowOneVToken`, `SupplyNotAllowed`.

## Adding a new protocol family

Because adapters are stateless and reached only through `IResourceAdapter`, supporting a new yield protocol (e.g. a future Core V2) requires only a new adapter deployment plus per-YieldGroup `addResource` calls — no changes to the Hub, the YieldGroups, the interfaces, or any existing adapter.
