# BStockLiquidator

`BStockLiquidator` is Venus's **atomic backstop liquidator for bStock collateral** — tokenized stock markets such as vTSLAB, vNVDAB or vSPCXB, whose underlying trades on request-for-quote venues rather than on an AMM.

In one transaction it repays an undercollateralized borrow, seizes the bStock vToken, redeems it to the raw bStock, and sells that bStock to the debt asset. Because seizing and selling happen in the same transaction there is no price-drift window, and the realized proceeds must clear a caller-supplied floor or the whole call reverts — the protocol never ends up holding the RFQ-only asset.

It is **not** a public utility. `liquidate` and `flashLiquidate` are operator-gated, because the contract custodies protocol capital and forwards a caller-supplied calldata blob to an external router. Anyone may still liquidate bStock through the ordinary permissionless Venus path with their own funds and their own offload; this contract exists so Venus itself can act as a backstop.

## Two pools, two funding modes

The same core path serves four combinations. Neither dimension is a flag the caller sets — the pool is resolved from on-chain state, and the funding mode is the entry point chosen.

**Pools**, resolved in `_resolvePool` from the *collateral* market's own `comptroller()`:

* **Core** — the Venus Core pool. The repay goes through the pool-wide Venus [Liquidator](liquidator.md) gate.
* **Isolated** — a [hub-funded spoke pool](../reference-isolated-pools/spoke/README.md) that is registered in the [`PoolRegistry`](../reference-isolated-pools/pool-registry/pool-registry.md) the owner configured. The repay goes straight to the debt market.

**Funding modes:**

* **INVENTORY** (`liquidate`) — the contract is pre-funded with the debt asset and repays from its own balance.
* **FLASH** (`flashLiquidate`) — the debt asset is flash-borrowed from Venus Core and repaid with its premium inside the same transaction, so no capital is locked in the contract.

Only the repay differs between pools. Redeem, sale, `minOut` enforcement and `sweep` are shared.

> **The isolated branch is unreachable until a registry is configured.** While `poolRegistry` is the zero address, a non-Core position reverts `PoolRegistryNotSet` and all the spoke support adds to a Core liquidation is one `vBStock.comptroller()` staticcall.

### Liquidating in a spoke pool

Three things differ from the Core path.

**The pool is checked against *our* registry, then both legs against the pool.** `_resolvePool` reads the collateral market's `comptroller()`; anything other than the Core Comptroller has to round-trip through the configured registry — `getPoolByComptroller(pool).comptroller` must equal `pool`, since an unregistered pool reads back as a zero-filled struct rather than reverting. The registry consulted is the one the owner configured here, never one the pool names for itself: a hostile contract can claim any registry, but it cannot get itself into this one. A pool that is not there reverts `PoolNotRegistered`.

Core then has a `Comptroller.liquidatorContract` gate that validates the markets on the way through; an isolated pool has none, and the repay approves a *caller-supplied* `vDebt`. So both legs are additionally checked against the pool's own storage (`isMarketListed`) rather than trusting what a market claims about itself. A hostile contract can forge `comptroller()`; it cannot forge an entry in the pool's storage. A market that fails this check reverts `MarketNotInPool`.

**The flash source is configured, not derived.** Isolated pools have no flash lender of their own, but a Core flash loan is not tied to the liquidation target: `FlashLoanFacet` hands over a Core market's underlying and wants it back in the same transaction. So a spoke USDT debt is funded from the **Core** USDT market, named per debt token by `setCoreFlashSource`. Without an entry, `flashLiquidate` reverts `FlashSourceNotSet` and the position has to go through `liquidate` instead. The configured source's `underlying()` is re-asserted at call time, not just at configuration time, because the market is upgradeable.

**The pool's liquidation allowlist gates *this contract*, not the operator.** If the spoke pool has [`isLiquidationAllowlistEnabled`](../reference-isolated-pools/spoke/spoke-comptroller.md#liquidation-allowlist) turned on, `BStockLiquidator`'s own address must be on it — it is the account that receives the seized collateral.

Isolated pools are ERC20-only, so the vBNB and VAI branches described below are Core-only.

## The swap

Selling bStock takes one or two hops.

* **Hop 1** sells bStock through an allowlisted RFQ router, using a pre-fetched, off-chain-signed `swapCalldata`. The contract is router-agnostic and just forwards the opaque blob. RFQ sources quote bStock → USDT only.
* **Hop 2** is optional. For a non-USDT debt it converts the intermediate (USDT) to the debt asset through a second allowlisted router — typically an AMM or aggregator. Set `router2 = address(0)` for a single hop.

`minOut` is always the floor on the **final debt-asset** amount across the whole chain, and it must be non-zero (`ZeroMinOut`). `deadline` is a unix-timestamp expiry, so a transaction left sitting in the mempool cannot settle against a stale quote.

Each hop approves the router's configured spender the exact amount being sold, and resets the approval to zero afterwards. The spender defaults to the router itself when unset — the RFQ shape, where the call target is the puller — and aggregators with a separate settlement contract get an entry through `setRouterSpender`. Hop 2 approves the *measured balance delta* of the intermediate rather than the whole balance, so pre-existing inventory is never exposed.

If a hop pulls less than was approved (a partially filled RFQ quote), the unconsumed remainder stays in the contract and is announced via `PartialSwapLeftover`; recover it with `sweep`. `minOut` still bounds the realized proceeds either way.

## Special debt assets (Core only)

**Native BNB (vBNB).** Supported in both funding modes, with WBNB as the debt-accounting token. The repay must be native BNB, so exactly the repay amount of WBNB is unwrapped and forwarded to the gate's payable path — pre-existing WBNB inventory is untouched. The swap chain lands WBNB (bStock → USDT → WBNB) and `minOut` is measured in WBNB. FLASH mode borrows from **vWBNB, not vBNB**: vBNB cannot be flash-repaid, because its `doTransferIn` requires `msg.value`.

**VAI.** INVENTORY mode only. VAI is not a vToken — a `vDebt` equal to `comptroller.vaiController()` is VAI — so the repay is a plain ERC20 approval to the gate, which burns it through `VAIController.liquidateVAI`. A VAI debt is inherently two-hop; hop 2 is expected to be the [Peg Stability Module](psm/peg-stability.md), allowlisted as `router2`, which mints VAI from USDT at the oracle rate. `flashLiquidate` rejects a VAI debt with `FlashNotSupportedForVai`: `executeFlashLoan` lends a vToken's underlying, and there is no vVAI market.

## Loss floors differ by mode

* **FLASH** — `executeOperation` requires the swap proceeds **alone** to cover principal plus premium (`InsufficientOut`). Without that check, any debt-asset inventory the contract happens to hold would silently backfill an underwater swap, since the flash repayment is pulled from the total balance rather than from the swap output.
* **INVENTORY** — there is no built-in floor tying proceeds to the repay, and that asymmetry is deliberate: a repay can legitimately out-cost its proceeds, for example because the Venus Liquidator keeps a treasury cut of the seized collateral. **`minOut` is the operator's chosen loss floor in this mode** — set it to the lowest acceptable debt-asset return.

## Security model

* `liquidate` and `flashLiquidate` are `onlyOperator` (the owner, or an allowlisted operator), and both are `nonReentrant`.
* **Both** swap targets must be allowlisted in `isRouter`, which is what defends the low-level `router.call(swapCalldata)` on each hop. The swap recipient lives inside that caller-supplied calldata, so an open entry point would let anyone route the proceeds to themselves.
* A router spender must be a deployed contract (`SpenderNotContract`) — it receives a live token approval, so an EOA spender is always a misconfiguration.
* `executeOperation` accepts calls only from the Core Comptroller, and only with `initiator == address(this)`, which proves the flash was started by this contract's own `flashLiquidate`.
* `renounceOwnership` is a deliberate no-op. The contract custodies capital and every admin function is `onlyOwner`, so renouncing would strand those funds permanently. Ownership is still transferable through the two-step `Ownable2Step` flow.
* Liquidatability is **not** pre-checked. The owning pool's own liquidate hook enforces it, and pre-checking shortfall would wrongly block forced liquidations, which liquidate healthy accounts by design.

## Immutables

Set in the constructor of the implementation, so changing any of them means a new implementation.

| Immutable | Purpose |
| --- | --- |
| `comptroller` | Venus Core Comptroller (diamond): reads the liquidation gate, provides the flash loan |
| `vBNB` | the native BNB market; a `vDebt` equal to this is settled in native BNB |
| `vWBNB` | the flash-borrow source for BNB debt |
| `wbnb` | the debt-accounting token for BNB debt, unwrapped for the native repay |

## Solidity API

### LiquidationParams

```solidity
struct LiquidationParams {
    address borrower;           // account to liquidate
    IVBep20 vDebt;              // borrowed market to repay (e.g. vUSDT)
    IVBep20 vBStock;            // bStock collateral market to seize (e.g. vTSLAB)
    uint256 repayAmount;        // debt underlying to repay, in its own decimals
    address router;             // hop-1 RFQ router; must be allowlisted
    bytes swapCalldata;         // hop-1 calldata (off-chain-signed RFQ order)
    uint256 minOut;             // minimum FINAL debt-asset amount; must be non-zero
    address router2;            // hop-2 router; address(0) = single hop
    bytes swapCalldata2;        // hop-2 calldata; the recipient inside it MUST be this contract
    address intermediateToken;  // token hop 1 outputs and hop 2 consumes (e.g. USDT)
    uint256 deadline;           // unix timestamp after which the call reverts
}
```

---

### liquidate

Liquidate using the contract's own debt-asset inventory.

```solidity
function liquidate(LiquidationParams calldata params) external returns (uint256 debtOut)
```

#### Return Values

| Name | Type | Description |
| --- | --- | --- |
| debtOut | uint256 | Debt-asset proceeds of the swap chain |

#### 📅 Events

* Emits `Liquidated` with `flash = false`; may emit `PartialSwapLeftover`

#### ⛔️ Access Requirements

* Owner or an allowlisted operator

---

### flashLiquidate

Liquidate by flash-borrowing the repay amount from Venus Core, repaid with its premium in the same transaction. Profit stays in the contract; withdraw it with `sweep`.

```solidity
function flashLiquidate(LiquidationParams calldata params) external
```

Requires this contract to be `authorizedFlashLoan` in the Core Comptroller. The market flash-borrowed from is `vDebt` itself in Core mode, vWBNB for a BNB debt, or `coreFlashSource[debtToken]` in isolated mode.

#### 📅 Events

* Emits `Liquidated` with `flash = true`; may emit `PartialSwapLeftover`

#### ⛔️ Access Requirements

* Owner or an allowlisted operator

---

### setPoolRegistry

Sets the `PoolRegistry` that decides which non-Core pools may be liquidated in. Gates the entire isolated branch.

```solidity
function setPoolRegistry(address poolRegistry_) external
```

A pool is accepted only while that registry holds an entry for it, so **enabling a spoke pool is done by registering it there, not by a call here**. Passing `address(0)` clears the registry and closes the isolated branch.

Spoke pools are listed in [a `PoolRegistry` instance of their own](../reference-isolated-pools/spoke/README.md#a-registry-of-its-own), separate from the isolated pools' registry, so that is the address to configure here — pointing this at the isolated-pools registry would not resolve a spoke pool.

A non-zero address is validated on the way in: it must have code (`PoolRegistryNotContract`), and `getPoolByComptroller` is probed so a wrong address fails here rather than mid-liquidation. Only that the call answers and decodes is checked, not what it returns.

#### 📅 Events

* Emits `PoolRegistrySet`

#### ⛔️ Access Requirements

* Only the owner

#### ❌ Errors

* `PoolRegistryNotContract(address poolRegistry)` — the address has no code

---

### setCoreFlashSource

Set the Core market whose underlying flash-funds the repay of a non-Core pool's debt token. `vToken = address(0)` clears the entry.

```solidity
function setCoreFlashSource(address debtToken, IVBep20 vToken) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| debtToken | address | The non-Core pool's debt underlying (e.g. USDT) |
| vToken | IVBep20 | The Core market to flash-borrow from; its `underlying()` must equal `debtToken` |

#### 📅 Events

* Emits `CoreFlashSourceSet`

#### ⛔️ Access Requirements

* Only the owner

---

### Other admin

| Function | Purpose |
| --- | --- |
| `setOperator(address operator, bool allowed)` | allowlist an address to trigger liquidations |
| `setRouter(address router, bool allowed)` | allowlist a swap target |
| `setRouterSpender(address router, address spender)` | set the approval target for a router whose puller differs from the call target; `address(0)` restores the default |
| `sweep(address token, address to, uint256 amount)` | withdraw profit, leftover inventory, or stuck dust |
| `sweepNative(address to, uint256 amount)` | withdraw stuck native BNB |

All are `onlyOwner`.

## Events

| Event | Emitted when |
| --- | --- |
| `Liquidated(address indexed borrower, address indexed vBStock, address indexed vDebt, uint256 repayAmount, uint256 seizedBStock, uint256 debtOut, bool flash)` | a liquidation succeeds |
| `OperatorSet(address indexed operator, bool allowed)` | an operator is allowlisted or removed |
| `RouterSet(address indexed router, bool allowed)` | a router is allowlisted or removed |
| `RouterSpenderSet(address indexed router, address indexed spender)` | a router's approval target is set or cleared |
| `PoolRegistrySet(address indexed oldPoolRegistry, address indexed newPoolRegistry)` | the registry that decides non-Core pools is set or cleared |
| `CoreFlashSourceSet(address indexed debtToken, address indexed vToken)` | the Core flash source for a debt token is set or cleared |
| `PartialSwapLeftover(address indexed token, uint256 amount)` | a swap hop pulls less than was approved, leaving a recoverable residual |
| `Swept(address indexed token, address indexed to, uint256 amount)` / `SweptNative(address indexed to, uint256 amount)` | the owner withdraws |

## Errors

| Error | Meaning |
| --- | --- |
| `NotOperator()` | the caller is neither the owner nor an allowlisted operator |
| `RouterNotAllowed(address router)` | the supplied swap router is not allowlisted |
| `SpenderNotContract(address spender)` | the router spender being set is not a deployed contract |
| `RedeemFailed(uint256 errCode)` | `vBStock.redeem` returned a non-zero error code |
| `SwapFailed()` | the low-level call to the router reverted |
| `InsufficientOut(uint256 got, uint256 minOut)` | proceeds are below `minOut`, or below principal + premium in FLASH mode |
| `ZeroMinOut()` | `minOut` was zero, which would silently accept any proceeds |
| `InvalidIntermediate()` | a two-hop `intermediateToken` is zero, or equals the debt or bStock token |
| `OnlyComptroller()` | `executeOperation` was called by something other than the Core Comptroller |
| `BadInitiator(address initiator)` | the flash-loan initiator is not this contract |
| `WrongFlashAsset()` | the flashed asset does not match the debt market |
| `FlashNotSupportedForVai()` | `flashLiquidate` was called with a VAI debt |
| `DeadlineExpired(uint256 deadline, uint256 nowTs)` | the call was submitted after `params.deadline` |
| `PoolRegistryNotSet()` | the position is in a non-Core pool and no `PoolRegistry` is configured |
| `PoolNotRegistered(address comptroller)` | the pool owning the position has no entry in the configured `PoolRegistry` |
| `PoolRegistryNotContract(address poolRegistry)` | the address being set as the registry has no code |
| `MarketNotInPool(address comptroller, address market)` | a market is not listed in the registered pool it claims to belong to |
| `FlashSourceNotSet(address debtToken)` | `flashLiquidate` for a non-Core pool whose debt token has no configured Core flash source |
| `FlashSourceMismatch(address flashSource, address debtToken)` | the configured flash source's underlying is not the debt token |

## Deployment

| Network | Address |
| --- | --- |
| BNB Chain mainnet | `0x5974Badab6911a78Ba15229045514C2C1bD42343` (transparent proxy) |

The spoke-pool support described on this page is **not yet deployed**: it requires an implementation upgrade, and no `PoolRegistry` has been configured through `setPoolRegistry`, so no spoke pool can be resolved yet.
