# Interfaces

Two interfaces define the boundaries that keep the Liquidity Hub layered. The Hub depends only on `ISource`; a YieldGroup depends only on `IResourceAdapter`. Neither the Hub nor a YieldGroup ever reaches past its boundary into the layer below.

* **`ISource`** — the Hub ↔ YieldGroup boundary.
* **`IResourceAdapter`** — the YieldGroup ↔ adapter boundary.

The Hub's own external interface, `IHub`, is documented on the [Hub](hub.md) page.

## ISource

The boundary between the Hub and the concrete typed Sources (`YieldGroupCore`, `YieldGroupFlux`, `YieldGroupFRV`, …). The Hub depends only on this interface; adding a new Source family never touches the Hub.

### Conventions

* All amounts are denominated in `asset()` units — there is no share conversion at this layer.
* `deposit` pulls from `msg.sender` via `safeTransferFrom`; the caller must have approved.
* `withdraw` pushes the underlying to the supplied `to` address (today the Hub passes `address(this)`), leaving room for a future Hub optimization that routes straight to the end receiver without an interface revision.
* `deposit` returns the placed amount because fee-on-transfer underlyings make under-placement possible — the Hub revert-checks the return.
* `withdraw` has no return value: it MUST deliver exactly `amount` to `to` or revert. The Hub defensively measures the resulting balance delta rather than trusting a self-reported number.
* A Source may hold assets across multiple internal resources and route via its own inner queue; that detail is opaque to the Hub.

### Mutating

```solidity
function deposit(uint256 amount) external returns (uint256 deposited);
function withdraw(uint256 amount, address to) external;
function depositResource(address resource, uint256 amount) external returns (uint256 deposited);
function withdrawResource(address resource, uint256 amount, address to) external;
```

* **`deposit`** — move `amount` from the caller into the Source's resources via the inner deposit queue. `deposited` may be less than `amount` only if a downstream resource rejects mid-route or the underlying is fee-on-transfer (the Hub reverts in that case).
* **`withdraw`** — pull `amount` via the inner withdraw queue and send it to `to`; must deliver exactly `amount` or revert (no partial fill).
* **`depositResource` / `withdrawResource`** — target one specific resource, bypassing the inner queue. They exist solely for Hub-orchestrated `reallocate`. The Hub treats `resource` as an opaque address it does not interpret; the Source validates it against its own registry. The full `amount` moves into / out of that one resource or the call reverts. `withdrawResource` does not consume idle first and does not cascade; pulling from a paused resource is permitted (wind-down).

### Views

```solidity
function asset() external view returns (address underlying);
function totalAssets() external view returns (uint256 total);
function maxDeposit() external view returns (uint256 capacity);
function maxWithdraw() external view returns (uint256 liquid);
function spotAPYBps() external view returns (uint64 apyBps);
```

* **`asset`** — the ERC-20 the Source accepts; must equal `Hub.asset()`.
* **`totalAssets`** — sum of `asset` held across all of the Source's resources; the Hub sums this over its registry.
* **`maxDeposit`** — aggregate remaining deposit capacity. The honesty contract requires that `deposit(maxDeposit())` does not revert.
* **`maxWithdraw`** — aggregate currently-withdrawable amount. `withdraw(maxWithdraw(), to)` must not revert (subject to upstream liquidity).
* **`spotAPYBps`** — TVL-weighted spot supply-side APY across the Source's resources, in BPS. The Hub EMA-smooths this into its own `realizedAPYBps()`; the Source layer has no notion of historical realization.

## IResourceAdapter

The boundary between a YieldGroup and a specific yield-protocol ABI. A single deployment of each implementation is shared across every YieldGroup that registers a resource of the matching family.

### Dispatch model

* **Mutating functions (`deposit`, `withdraw`) MUST be invoked via `delegatecall`** from the YieldGroup, so they execute in the YieldGroup's storage context and receipt-token credits / debits land on the YieldGroup. Implementations enforce this with an `address(this) != _ADAPTER_SELF` guard.
* **View functions are invoked via normal `call` / `staticcall`** and take an explicit `holder` parameter where the answer depends on whose position is queried.

### Implementation invariants

Verified at audit:

1. The contract declares zero storage variables; only `immutable` and `constant` values are permitted (both live in bytecode, not storage slots).
2. No inline assembly performs `sstore`.
3. External calls go only to the supplied `resource` and its trusted, chain-fixed dependencies — the resource's `underlying()` / `asset()` / `comptroller()` and (for Flux) the Fluid `LendingResolver` — never an arbitrary user-supplied address.
4. Mutating functions revert when called outside a delegatecall context.

### Mutating

```solidity
function deposit(address resource, uint256 amount) external returns (uint256 deposited);
function withdraw(address resource, uint256 amount, address to) external;
```

* **`deposit`** — delegatecalled; the YieldGroup already holds `amount` of underlying. Post-conditions: receipt tokens are credited to the YieldGroup and the adapter holds zero underlying balance.
* **`withdraw`** — delegatecalled; redeems exactly `amount` and delivers it to `to`. Any gross-up surplus (treasury-fee rounding) remains as idle on the YieldGroup, counted in `totalAssets` and consumed on the next call.

### Views

```solidity
function asset(address resource) external view returns (address underlying);
function totalAssets(address resource, address holder) external view returns (uint256 value);
function maxDeposit(address resource) external view returns (uint256 capacity);
function maxWithdraw(address resource, address holder) external view returns (uint256 liquid);
function spotAPYBps(address resource, uint256 blocksPerYear) external view returns (uint64 apyBps);
function receiptBalance(address resource, address holder) external view returns (uint256 shares);
function validateRegistration(address resource) external view;
```

* **`asset`** — the underlying accepted by `resource`; the YieldGroup uses it to validate a resource matches its own asset at registration.
* **`totalAssets`** — underlying value `holder` holds via `resource`, using stale (non-accruing) exchange-rate state — cheap and safe for Hub-level aggregation.
* **`maxDeposit`** — spare deposit headroom on `resource` right now (before its own caps or pause reject a mint).
* **`maxWithdraw`** — underlying `holder` can withdraw right now, net of any redeem-time protocol fee, bounded by the lesser of the position value and the resource's available cash.
* **`spotAPYBps`** — spot supply-side APY in BPS; annualization uses the `blocksPerYear` the YieldGroup passes (chain-dependent).
* **`receiptBalance`** — raw receipt-token balance (vToken / fToken / FRV shares), NOT underlying value. Used by `removeResource` as a share-based emptiness gate so a value-based check can't round a small balance to zero and orphan tokens.
* **`validateRegistration`** — reverts if `resource` fails a protocol-specific precondition. `AdapterCoreV1` rejects a vToken whose Comptroller charges a non-zero `treasuryPercent`; `AdapterFlux` and `AdapterFRV` implement it as a no-op.
