# Adapters

An **adapter** translates between a [YieldGroup](yield-groups.md) and one protocol-specific ABI. Each adapter is a **stateless singleton**: a single deployment per ABI family serves every YieldGroup that registers a matching resource — there is no per-(YieldGroup, resource) instance, no proxy, and no clone factory.

The adapters are:

* **`AdapterCoreV1`** — Venus Core V1 vTokens (Compound-style `mint` / `redeemUnderlying`).
* **`AdapterFlux`** — Fluid Lending fTokens (ERC-4626).
* **`AdapterFRV`** — Venus Fixed-Rate Vault shares (ERC-4626).
* **`AdapterSpokeV1`**: the liquidity side of a [hub-funded spoke pool](../reference-isolated-pools/spoke/README.md): an isolated-pools `VToken` governed by a `SpokeComptroller`.

Each implements [`IResourceAdapter`](interfaces.md).

## Dispatch model

The split between mutating and view dispatch is load-bearing for security:

* **Mutating functions (`deposit`, `withdraw`) MUST be invoked via `delegatecall`** from the YieldGroup. They execute in the YieldGroup's storage context, so receipt-token credits and debits land on the YieldGroup, not the adapter. From the resource's perspective, `msg.sender` is the YieldGroup.
* **View functions are invoked via normal `call` / `staticcall`.** Where the answer depends on whose position is being queried, they take an explicit `holder` parameter (the YieldGroup). `maxDeposit` and `validateRegistration` name no account. `AdapterSpokeV1` reads `msg.sender` in both, which is the calling YieldGroup; the other adapters do not need the caller there. See [Caller identity](#caller-identity).

### `onlyDelegateCall` guard

Each adapter captures its own address into an `immutable` (`_ADAPTER_SELF`) at construction. The `onlyDelegateCall` modifier reverts `NotDelegateCall` when `address(this) == _ADAPTER_SELF` — i.e. when a mutating function is invoked directly on the adapter rather than through a delegatecall. This prevents an accidental direct call that would orphan receipt tokens on the adapter. (Immutables live in bytecode, not storage slots, so they are safe to read across a delegatecall.)

### Storage-safety invariants

Verified at audit for every adapter:

1. **Zero storage variables** — only `immutable` and `constant` values are declared; the contract never `sstore`s.
2. **No inline assembly performs `sstore`.**
3. **No arbitrary call targets**: external calls go only to the supplied `resource` and its trusted, chain-fixed dependencies, never a user-supplied address. (`AdapterCoreV1` calls the vToken's `underlying()` and `comptroller()`; `AdapterFlux` calls the fToken's `asset()` and the Fluid `LendingResolver`; `AdapterFRV` calls the vault's `asset()`; `AdapterSpokeV1` calls the vToken's `underlying()` and `comptroller()`.)
4. **Mutating functions revert outside a delegatecall context** (the `onlyDelegateCall` guard).

## `IResourceAdapter` surface

* **`deposit(address resource, uint256 amount)` → `uint256 deposited`** — deposit `amount` of underlying into `resource`; receipt tokens are credited to the YieldGroup.
* **`withdraw(address resource, uint256 amount, address to)`** — redeem exactly `amount` of underlying from `resource` and deliver it to `to`.
* **`asset(address resource)` → `address`** — the underlying ERC-20 accepted by `resource`.
* **`totalAssets(address resource, address holder)` → `uint256`**: underlying value `holder` holds via `resource`. The basis is per-adapter: `AdapterCoreV1` uses the stale (non-accruing) `exchangeRateStored` net of any Comptroller `treasuryPercent`; `AdapterFlux` uses the fToken's live `previewRedeem`; `AdapterFRV` uses a time-based linear coupon accrual; `AdapterSpokeV1` uses the market's own `exchangeRateStored`, which keeps `badDebt` in its numerator.
* **`maxDeposit(address resource)` → `uint256`** — spare deposit headroom on `resource` right now.
* **`maxWithdraw(address resource, address holder)` → `uint256`** — underlying `holder` can withdraw right now, net of any redeem-time protocol fee.
* **`spotAPYBps(address resource, uint256 blocksPerYear)` → `uint64`** — spot supply-side APY in BPS.
* **`receiptBalance(address resource, address holder)` → `uint256`** — raw receipt-token balance (vToken / fToken / FRV shares), in receipt-token units — used by `removeResource` as a share-based emptiness gate.
* **`accrue(address resource)`**: settle `resource`'s own global interest state so a following `totalAssets` read prices the position at a fresh rate. Invoked via normal `call`, **not** delegatecall, and therefore carries no `onlyDelegateCall` guard: it mutates the resource's global index, not the holder's position. Only block-lazy adapters do real work: `AdapterCoreV1` and `AdapterSpokeV1` call their vToken's `accrueInterest()`; `AdapterFlux` and `AdapterFRV` are no-ops.
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

{% hint style="info" %}
**Source branch.** `AdapterSpokeV1` and the `resourceName` member are not on venus-liquidity-hub `develop` yet. They are on `fix/hub-maxDeposit`, in [venus-liquidity-hub#20](https://github.com/VenusProtocol/venus-liquidity-hub/pull/20) (open against `develop`). The live adapter `0x231915FfE3e3A6Be09B0E5c73EFA2F1a4FF8Aa69` was built from that branch.
{% endhint %}

Wraps the **liquidity side of a hub-funded spoke pool**: an isolated-pools `VToken` whose Comptroller is a [`SpokeComptroller`](../reference-isolated-pools/spoke/spoke-comptroller.md). One deployment serves every YieldGroup that registers a spoke market.

Its selectors are nearly the same as `AdapterCoreV1`'s, but four things differ: error handling, how liquidity is measured, the exit fee, and the supply cap sentinel.

* **Mutating calls carry no error code to check.** `mint`, `redeem` and `accrueInterest` either return `NO_ERROR` or revert; the Compound-style codes `AdapterCoreV1` inspects are set by the legacy Core pool alone.
* **Liquidity is cash *net of reserves*,** and both it and the position are floored to a whole number of vTokens, because `withdraw` redeems by vToken **count** rather than by underlying amount.
* **No exit fee to gross up.** Isolated pools have no `treasuryPercent`; their cut is the reserve factor, already netted out of the exchange rate. There is nothing unmodeled to reject at registration, so `validateRegistration` guards the market listing and the supply allowlist instead.
* **The supply cap has an uncapped sentinel** that Core does not (see `maxDeposit` below).

Detail per function:

* **`deposit`**: `forceApprove`s the market and calls `mint(amount)`. Under delegatecall the market sees the YieldGroup as `msg.sender`, so the vTokens are credited there. That is also the account the market's supply allowlist checks. Reverts `DepositBelowOneVToken` rather than minting zero for a sub-one-vToken remainder, which hands the leg back to the YieldGroup's cascade to route around instead of stranding the amount silently.
* **`withdraw`**: **denominated in vTokens, not in underlying.** It calls `redeem(tokens)` with the fewest vTokens worth at least `amount`, rather than `redeemUnderlying(amount)`. `redeemUnderlying` derives the burn by rounding up and that derived count is not bounded by the caller's balance, so `_redeemFresh` can panic in checked arithmetic when it overshoots. Naming the burn avoids that. The payout is `truncate(exchangeRate × tokens)`, so it is at least `amount` and exceeds it by up to one vToken unit; the adapter forwards exactly `amount` and leaves the surplus as idle on the YieldGroup. **Unlike Flux and FRV, Spoke leaves a surplus on essentially every redeem.** If the vTokens left after the redeem would be worth 0 underlying, it redeems the whole balance instead, so no worthless remainder stays in the market.
* **`accrue`**: pokes the market's `accrueInterest()`, like Core.
* **`maxDeposit`**: honors, in order: the market's supply allowlist, its `MINT` pause, and its supply cap. **The uncapped sentinel is one-sided**: here `type(uint256).max` skips the cap check entirely, while `0` is a real cap of zero (`preMintHook` compares `nextTotalSupply > supplyCap`, so every mint is rejected). The Core Comptroller has no uncapped sentinel, and there `0` is the value that disables minting. Uncapped markets report `type(uint128).max` rather than `type(uint256).max`, because `YieldGroupBase.maxDeposit()` sums the room of every queued resource in checked arithmetic and two uncapped markets would overflow that sum. Headroom is then trimmed by a **0.1% conservative margin**, as Core does, so a normal accrual between the view and the mint cannot push `deposit(maxDeposit())` over the cap. Room below one vToken unit is reported as zero.
* **`maxWithdraw`**: the lesser of the position's value and the market's *payable* cash (`getCash − totalReserves`; reserves sit inside cash but are not redeemable, and `_redeemFresh` gates on the difference). Subtracting reserves also makes the figure invariant across the reserve sweep `accrueInterest` performs. Both sides are floored to a whole number of vTokens and valued back into underlying, because `withdraw` redeems by count. The flooring is exact rather than conservative, so the last vToken stays withdrawable and a market can be drained to zero and deregistered.
* **`spotAPYBps`**: `supplyRatePerBlock × blocksOrSecondsPerYear`, read from the **market itself**. The `blocksPerYear` argument is ignored: an isolated-pools market carries its own annualizer as an immutable and may be block- or time-based, so a YieldGroup-level constant would misprice whichever kind it was not configured for. Deploy the Spoke YieldGroup with `blocksPerYear = 0`, as the Flux family already does. A market with zero `totalSupply` reports 0 rather than reverting, because `JumpRateModelV2.getSupplyRate` divides by `cash + borrows + badDebt − reserves` with no zero guard.
* **`resourceName`**: returns the market's own ERC-20 `name()`, since a spoke market is an isolated-pools `VToken`.
* **`validateRegistration`**: rejects the two configurations `preMintHook` would reject on every deposit, either of which would leave the resource holding a queue slot it can never fill:
  * a market its own Comptroller does not list (`MarketNotListed`), and
  * a market whose supply allowlist is enabled without the registering YieldGroup on it (`SupplyNotAllowed`). **The listing VIP must therefore call `setAllowedSupplier(vToken, <SpokeSource>, true)` on the pool before `addResource`.**

  The two checks also establish what the market is. The listing check ties `resource` to the Comptroller it names: any contract can return a real `SpokeComptroller` from `comptroller()`, but only a market that Comptroller lists passes. The allowlist getters exist only on the spoke fork, so the call reverts against any other Comptroller. Nothing else is checked. An unset `deviationBoundedOracle` does not block registration: borrowing reverts, which stops the market's yield, and so do redeem, transfer and exit for any account that has entered the market. The Hub's deposits and withdrawals are unaffected, because the YieldGroup never enters the market.

### Valuation

An isolated-pools market keeps `badDebt` in the numerator of its exchange rate, so the rate does **not** fall when `healAccount` writes a loss off. `totalAssets` values the position at that same rate, `balance × exchangeRateStored`, exactly as `AdapterCoreV1` does.

The written-off amount is cash the market does not have, not a lower share price. While it is outstanding, suppliers who exit first are paid in full out of the cash that is left, and `maxWithdraw` is bounded by that cash rather than by the position's value. Paying the debt down raises cash and lowers `badDebt` by the same amount, so more becomes withdrawable and the share price does not move.

### Caller identity

`maxDeposit` and `validateRegistration` name no `holder`, and both are invoked by the YieldGroup as a plain call, so `msg.sender` **is** the prospective supplier, and reading the market's allowlist against it is exact rather than a convention. (Every other view that depends on whose position is being queried takes the holder explicitly, and the mutating members arrive by delegatecall.) Operationally this means a YieldGroup whose grant is revoked reports zero room and is routed around, instead of advertising capacity that every deposit then reverts on.

Fee-on-transfer underlyings are unsupported, matching the rest of the Hub.

**Constants:** `EXP_SCALE` (`1e18`), `UNCAPPED_DEPOSIT_ROOM` (`type(uint128).max`), `MANTISSA_TO_BPS` (`1e14`), `CAP_TRIM_DIVISOR` (`1000`).

**Errors:** `NotDelegateCall`, `VTokenUnderfilled`, `DepositBelowOneVToken`, `SupplyNotAllowed`, `MarketNotListed`.

Unlike `AdapterCoreV1` there are no `VTokenMintFailed` / `VTokenRedeemFailed` / `VTokenAccrueFailed` variants: an isolated-pools `mint`, `redeem` or `accrueInterest` either returns `NO_ERROR` or reverts, so a failure arrives as the market's own revert rather than as an error code. Only the legacy Core pool still sets those codes.

## Adding a new protocol family

Because adapters are stateless and reached only through `IResourceAdapter`, supporting a new yield protocol (e.g. a future Core V2) requires only a new adapter deployment plus per-YieldGroup `addResource` calls — no changes to the Hub, the YieldGroups, the interfaces, or any existing adapter.
