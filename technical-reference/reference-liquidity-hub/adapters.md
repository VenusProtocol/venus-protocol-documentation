# Adapters

An **adapter** translates between a [YieldGroup](yield-groups.md) and one protocol-specific ABI. Each adapter is a **stateless singleton**: a single deployment per ABI family serves every YieldGroup that registers a matching resource — there is no per-(YieldGroup, resource) instance, no proxy, and no clone factory.

There are three adapters in v1:

* **`AdapterCoreV1`** — Venus Core V1 vTokens (Compound-style `mint` / `redeemUnderlying`).
* **`AdapterFlux`** — Fluid Lending fTokens (ERC-4626).
* **`AdapterFRV`** — Venus Fixed-Rate Vault shares (ERC-4626).

All three implement [`IResourceAdapter`](interfaces.md).

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
3. **No arbitrary call targets** — external calls go only to the supplied `resource` and its trusted, chain-fixed dependencies, never a user-supplied address. (`AdapterCoreV1` calls the vToken's `underlying()` and `comptroller()`; `AdapterFlux` calls the fToken's `asset()` and the Fluid `LendingResolver`; `AdapterFRV` calls the vault's `asset()`.)
4. **Mutating functions revert outside a delegatecall context** (the `onlyDelegateCall` guard).

## `IResourceAdapter` surface

* **`deposit(address resource, uint256 amount)` → `uint256 deposited`** — deposit `amount` of underlying into `resource`; receipt tokens are credited to the YieldGroup.
* **`withdraw(address resource, uint256 amount, address to)`** — redeem exactly `amount` of underlying from `resource` and deliver it to `to`.
* **`asset(address resource)` → `address`** — the underlying ERC-20 accepted by `resource`.
* **`totalAssets(address resource, address holder)` → `uint256`** — underlying value `holder` holds via `resource`, using the stale (non-accruing) exchange rate.
* **`maxDeposit(address resource)` → `uint256`** — spare deposit headroom on `resource` right now.
* **`maxWithdraw(address resource, address holder)` → `uint256`** — underlying `holder` can withdraw right now, net of any redeem-time protocol fee.
* **`spotAPYBps(address resource, uint256 blocksPerYear)` → `uint64`** — spot supply-side APY in BPS.
* **`receiptBalance(address resource, address holder)` → `uint256`** — raw receipt-token balance (vToken / fToken / FRV shares), in receipt-token units — used by `removeResource` as a share-based emptiness gate.
* **`validateRegistration(address resource)`** — reverts if `resource` fails a protocol-specific registration precondition.

See [Interfaces](interfaces.md) for the full `IResourceAdapter` contract and its pre/post-conditions.

## AdapterCoreV1

Wraps Venus Core V1 vTokens.

* **`deposit`** — `forceApprove`s the vToken and calls `mint(amount)`; reverts `VTokenMintFailed` on a non-zero Compound error code.
* **`withdraw`** — grosses up the request for the Comptroller's treasury cut (ceil-division), calls `redeemUnderlying`, verifies the received balance delta, and transfers exactly `amount` to `to`. Any gross-up surplus stays as idle on the YieldGroup (counted in `totalAssets`, consumed idle-first next time). Reverts `VTokenRedeemFailed` / `VTokenUnderfilled` on failure.
* **Treasury-fee handling** — when the Comptroller's `treasuryPercent != 0`, `redeemUnderlying(X)` delivers only `X − fee`. The gross-up keeps individual redeems whole. `validateRegistration` **rejects** a vToken whose Comptroller already charges a non-zero `treasuryPercent` (`TreasuryFeeUnsupported`) — that exit fee leaves the pool without burning shares, so it is unmodeled in the Hub's gross NAV. `treasuryPercent >= 1e18` reverts `TreasuryPercentTooHigh`.
* **Dust handling** — a withdraw cascade can hand the adapter a sub-one-vToken redeem (e.g. a 1-wei remainder from an upstream ERC-4626 source) that Compound would floor to zero tokens and reject. In that case the adapter redeems exactly one vToken unit of underlying so the burn is non-zero, then transfers only `amount` and leaves the surplus idle on the YieldGroup. A no-op for normal-sized redeems.
* **Spot APY** — `supplyRatePerBlock × blocksPerYear`, scaled to BPS and clamped to `uint64.max`.
* **`maxDeposit`** — honors the Comptroller's mint pause and supply cap (`supplyCap == 0` rejects mint outright, surfaced as 0 capacity).
* **vBNB is unsupported by design** — `IVToken(resource).underlying()` reverts on vBNB, which trips `asset()` and prevents registration.

**Constants:** `MANTISSA_ONE` (`1e18`), `EXP_SCALE` (`1e18`), `MANTISSA_TO_BPS` (`1e14`).

**Errors:** `NotDelegateCall`, `VTokenMintFailed`, `VTokenRedeemFailed`, `VTokenUnderfilled`, `TreasuryPercentTooHigh`, `TreasuryFeeUnsupported`.

## AdapterFlux

Wraps Fluid Lending fTokens (ERC-4626 shares). The adapter holds the Fluid `LendingResolver` address as an `immutable`, set at construction (`ZeroResolver` if zero).

* **`deposit` / `withdraw`** — uses the fToken's ERC-4626 `deposit` / `withdraw`. There is no redeem-time pool fee (Fluid's cut is already in the supply rate), so no gross-up is needed.
* **Spot APY** — read from the Fluid `LendingResolver` as a pre-annualised APR (not a per-block rate), so the `blocksPerYear` argument is unused here.
* **`maxDeposit`** — a Fluid fToken's protocol-level `maxDeposit` is effectively unbounded, which is why the per-resource cap on `YieldGroupFlux` is the primary deposit control.
* **`validateRegistration`** — a no-op (`pure`); Flux has no per-redeem pool fee to guard against.

**Errors:** `NotDelegateCall`, `ZeroResolver`.

## AdapterFRV

Wraps Venus Fixed-Rate Vault shares (ERC-4626).

* **`deposit` / `withdraw`** — uses the vault's ERC-4626 `deposit` / `withdraw`. There is no redeem-time pool fee (the reserve factor is taken once at settlement).
* **`spotAPYBps`** — reads the vault's `state()` and returns the vault's `fixedAPY` **only while `Fundraising` or `Lock`**; in any other state it contributes no APY (the rate is not meaningful outside the active window).
* **State machine** — the adapter does **not** call `updateVaultState()`; `YieldGroupFRV` pokes it before every routing decision so the adapter always reads a current state (see the [FRV lifecycle](yield-groups.md#frv-lifecycle)).
* **`validateRegistration`** — a no-op (`pure`); FRV has no per-redeem pool fee.

**Errors:** `NotDelegateCall`.

## Adding a new protocol family

Because adapters are stateless and reached only through `IResourceAdapter`, supporting a new yield protocol (e.g. a future Core V2) requires only a new adapter deployment plus per-YieldGroup `addResource` calls — no changes to the Hub, the YieldGroups, the interfaces, or any existing adapter.
