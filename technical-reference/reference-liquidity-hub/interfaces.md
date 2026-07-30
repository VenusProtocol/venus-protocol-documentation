# Interfaces

Two interfaces define the boundaries that keep the Liquidity Hub layered. The Hub depends only on `IYieldGroupBase`; a YieldGroup depends only on `IResourceAdapter`. Neither the Hub nor a YieldGroup ever reaches past its boundary into the layer below.

* **`IYieldGroupBase`** — the Hub ↔ YieldGroup boundary.
* **`IResourceAdapter`** — the YieldGroup ↔ adapter boundary.

The Hub's own external interface, `IHub`, is documented on the [Hub](hub.md) page.

## IYieldGroupBase

The boundary between the Hub and the concrete typed YieldGroups: the generic `YieldGroup` (which serves both the Core-vToken and Fluid-fToken deployments) and `YieldGroupFRV`. The Hub depends only on this interface; adding a new Source family never touches the Hub.

Two leaf interfaces extend it with family-specific surface:

* **`IYieldGroup`** — the per-resource deposit cap setters and `setBlocksPerYear`, implemented by the Core and Flux deployments.
* **`IYieldGroupFRV`** — `forceRemoveResource`, implemented by the FRV deployment.

> There is no `ISource` type in the code. Earlier drafts of this page used that name; the Solidity uses *YieldGroup* end to end.

### Conventions

* All amounts are denominated in `asset()` units — there is no share conversion at this layer.
* `deposit` / `withdraw` / `depositResource` / `withdrawResource` are **`onlyHub`-gated** (any other caller reverts `NotHub`) and `nonReentrant`.
* `deposit` and `depositResource` pull from `msg.sender` via `safeTransferFrom`, so the Hub approves the YieldGroup immediately before calling.
* `withdraw` pushes the underlying to the supplied `to` address (today the Hub passes `address(this)`), leaving room for a future Hub optimization that routes straight to the end receiver without an interface revision.
* `deposit` returns the **actually-placed** amount, which may be less than `amount` when the inner deposit queue cannot absorb it all. The implementer MUST refund the unplaced remainder to the Hub and return the placed amount; the Hub's cascade routes that remainder to the next YieldGroup rather than reverting. Fee-on-transfer underlyings are a separate matter — they are unsupported and fail closed *inside* the deposit.
* `withdraw` has no return value: it MUST deliver exactly `amount` to `to` or revert. The Hub defensively measures the resulting balance delta rather than trusting a self-reported number.
* A Source may hold assets across multiple internal resources and route via its own inner queue; that detail is opaque to the Hub.

### Mutating

```solidity
function deposit(uint256 amount) external returns (uint256 deposited);
function withdraw(uint256 amount, address to) external;
function depositResource(address resource, uint256 amount) external returns (uint256 deposited);
function withdrawResource(address resource, uint256 amount, address to) external;
function accrue() external;
```

* **`deposit`** — move `amount` from the caller into the Source's resources via the inner deposit queue. `deposited` may be less than `amount` whenever the inner queue cannot absorb the full amount (per-resource caps, protocol supply caps, or paused / rejecting resources). The Source refunds the unplaced remainder to the Hub, which routes it onward; the Hub does **not** revert on a short return here.
* **`withdraw`** — pull `amount` via the inner withdraw queue and send it to `to`; must deliver exactly `amount` or revert (no partial fill).
* **`depositResource` / `withdrawResource`** — target one specific resource, bypassing the inner queue. They exist solely for Hub-orchestrated `reallocate`. The Hub treats `resource` as an opaque address it does not interpret; the Source validates it against its own registry. The full `amount` moves into / out of that one resource or the call reverts. `withdrawResource` does not consume idle first and does not cascade; pulling from a paused resource is permitted (wind-down).
* **`accrue`** — `onlyHub`. The Hub calls it on every registered Source before reading NAV, so the management fee is charged on interest-current value. Block-lazy families (Core vTokens) poke each registered resource; Flux and FRV inherit the base no-op. The poke is best-effort per resource — one whose accrual reverts is skipped and reported via `ResourceAccrualFailed` rather than bubbling. A Source implementing only the four asset-moving functions would revert the Hub's fee accrual and therefore brick deposits and withdrawals.

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
* **`spotAPYBps`** — TVL-weighted spot supply-side APY across the Source's resources, in BPS. This is an instantaneous reading; the Source layer has no notion of historical realization, and the Hub does not currently aggregate or smooth it.

## IResourceAdapter

The boundary between a YieldGroup and a specific yield-protocol ABI. A single deployment of each implementation is shared across every YieldGroup that registers a resource of the matching family.

### Dispatch model

* **The asset-moving mutating functions (`deposit`, `withdraw`) MUST be invoked via `delegatecall`** from the YieldGroup, so they execute in the YieldGroup's storage context and receipt-token credits / debits land on the YieldGroup. Implementations enforce this with an `address(this) != _ADAPTER_SELF` guard.
* **`accrue` is invoked via normal `call`**, not `delegatecall`, and deliberately carries no guard: it settles the resource's own global interest state rather than the holder's position, so it needs neither the YieldGroup's storage context nor a delegatecall.
* **View functions are invoked via normal `call` / `staticcall`** and take an explicit `holder` parameter where the answer depends on whose position is queried.

### Implementation invariants

Verified at audit:

1. The contract declares zero storage variables; only `immutable` and `constant` values are permitted (both live in bytecode, not storage slots).
2. No inline assembly performs `sstore`.
3. External calls go only to the supplied `resource` and its trusted, chain-fixed dependencies — the resource's `underlying()` / `asset()` / `comptroller()` and (for Flux) the Fluid `LendingResolver` — never an arbitrary user-supplied address.
4. The delegatecall-dispatched mutating functions (`deposit`, `withdraw`) revert when called outside a delegatecall context. `accrue` is the deliberate exception — it is invoked by plain `call` and has no such guard.

### Mutating

```solidity
function deposit(address resource, uint256 amount) external returns (uint256 deposited);
function withdraw(address resource, uint256 amount, address to) external;
function accrue(address resource) external;
```

* **`deposit`** — delegatecalled; the YieldGroup already holds `amount` of underlying. Post-conditions: receipt tokens are credited to the YieldGroup, and the full `amount` of underlying leaves the YieldGroup into `resource`. Because the code runs in the YieldGroup's storage context, the adapter contract itself never custodies funds.
* **`withdraw`** — delegatecalled; redeems **at least** `amount` and transfers exactly `amount` to `to`. Any surplus stays as idle on the YieldGroup, counted in `totalAssets` and consumed idle-first on the next withdrawal. `AdapterCoreV1` produces surplus from two sources: the sub-one-vToken dust bump, and — only if Venus governance later enables it — the Comptroller `treasuryPercent` gross-up.
* **`accrue`** — invoked via normal `call`, NOT delegatecall; settles `resource`'s own global interest state so a following `totalAssets` read prices the position at a fresh rate. Only block-lazy adapters do real work: `AdapterCoreV1` calls the vToken's `accrueInterest()`, while `AdapterFlux` and `AdapterFRV` are no-ops.

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
* **`totalAssets`** — underlying value `holder` holds via `resource`, valued at **realizable** terms. The basis is per-adapter: `AdapterCoreV1` uses the stale (non-accruing) `exchangeRateStored`, net of any Comptroller `treasuryPercent`; `AdapterFlux` uses the fToken's live `previewRedeem`; `AdapterFRV` uses a time-based linear accrual (principal plus the coupon accrued so far over the lock). Cheap and safe for Hub-level aggregation.
* **`maxDeposit`** — spare deposit headroom on `resource` right now (before its own caps or pause reject a mint).
* **`maxWithdraw`** — underlying `holder` can withdraw right now, net of any redeem-time protocol fee, bounded by the lesser of the position value and the resource's available cash.
* **`spotAPYBps`** — spot supply-side APY in BPS; annualization uses the `blocksPerYear` the YieldGroup passes (chain-dependent).
* **`receiptBalance`** — raw receipt-token balance (vToken / fToken / FRV shares), NOT underlying value. Used by `removeResource` as a share-based emptiness gate so a value-based check can't round a small balance to zero and orphan tokens.
* **`validateRegistration`** — reverts if `resource` fails a protocol-specific precondition. `AdapterCoreV1` rejects a vToken whose Comptroller charges a non-zero `treasuryPercent`; `AdapterFlux` and `AdapterFRV` implement it as a no-op.
