# EBrake

EBrake (Emergency Brake) is a Venus periphery contract that acts as an emergency action router for the protocol. It exposes a curated set of Comptroller emergency functions behind Access Control Manager (ACM) permissions, allowing the multisig, automated monitoring contracts, and trusted third-party services to rapidly tighten protocol parameters during an incident — without waiting for a governance VIP.

## Overview

During a security incident, every block of delay increases potential losses. EBrake provides a fast-path for protective actions that are safe to take without governance: pausing market actions, reducing collateral factors, and lowering supply/borrow caps. It enforces a strict **"tighten only, never loosen"** invariant — the worst outcome from a compromised EBrake caller is a temporary freeze, never fund loss.

Recovery from any EBrake action always goes through a governance VIP, which also calls the snapshot reset functions to prepare EBrake for future incidents.

### Callers and Integration Patterns

EBrake is designed to be called from three types of principals:

| Caller                  | Access Method                     | Description                                                                                             |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Venus Multisig          | Direct ACM whitelist              | Full access to all EBrake functions. Used during manual incident response.                              |
| On-chain monitors       | Direct ACM whitelist              | Contracts like `DeviationSentinel` that contain their own detection logic and call EBrake on trigger.   |
| Third-party monitors    | Safe Module on multisig           | External services (e.g. Hypernative) get a dedicated Safe Module that scopes which functions they can call. |

This architecture keeps detection logic isolated from execution. EBrake only handles execution — it holds no detection logic of its own.

### Safety Invariant

EBrake can only tighten restrictions, never loosen them. This means it intentionally **cannot**:

- **Unpause** — recovery is always via governance VIP
- **Pause REPAY or SEIZE** — users must always be able to repay to avoid liquidation, and liquidations must always work to prevent bad debt
- **Pause the protocol** — `setProtocolPaused` blocks repay and liquidation, which violates the safety invariant
- **Lower liquidation threshold** — this would instantly make healthy positions liquidatable
- **Increase caps** — caps can only be decreased to reduce exposure
- **Enable forced liquidation** — this would make any borrower liquidatable regardless of their collateral ratio
- **Target individual users** — prevents griefing specific addresses
- **Change the oracle or liquidation incentive** — would cause mass mispricing or alter liquidation economics for all users

**Worst-case if EBrake is compromised:**

- Pauses minting, borrowing, redeeming, or transfers (inconvenient, no fund loss)
- Zeros supply/borrow caps (blocks new positions; existing positions are unaffected)
- Decreases collateral factor (blocks new borrows against an asset; does **not** liquidate existing positions since LT is unchanged)
- Pauses flash loans (blocks flash loan attack vector, no user impact)

Recovery is a governance VIP that restores all parameters — a temporary freeze, not a catastrophic loss.

### Pre-Incident Snapshots

Whenever EBrake tightens a parameter for the first time, it snapshots the original value using a **first-write-wins** strategy. These snapshots are stored in `marketStates` and serve as a reference for governance to restore to when issuing a recovery VIP. After restoring values on-chain, governance calls the corresponding reset function (`resetCFSnapshot`, `resetBorrowCapSnapshot`, `resetSupplyCapSnapshot`) to clear the snapshot and prepare EBrake for future incidents.

### BSC vs Non-BSC Differences

EBrake is deployed on all Venus chains, but its behavior differs based on the underlying comptroller:

| Feature                              | BSC — Diamond Comptroller (`IS_ISOLATED_POOL=false`) | Non-BSC — IL Comptroller (`IS_ISOLATED_POOL=true`) |
| ------------------------------------ | ---------------------------------------------------- | -------------------------------------------------- |
| `decreaseCF(market, newCF)`          | Iterates all pools (`corePoolId` to `lastPoolId`), silently skips pools already at or below `newCF` | Applies to the single market; reverts if `newCF > currentCF` |
| `decreaseCF(market, poolId, newCF)`  | Supported — targets a single pool (core or e-mode)  | Reverts with `NotSupportedOnIsolatedPool`          |
| `pauseFlashLoan()`                   | Supported — flash loans only exist on Diamond       | Not ACM-granted                                    |
| `disablePoolBorrow(poolId, market)`  | Supported — per-pool granular borrow disable        | Not ACM-granted                                    |
| `revokeFlashLoanAccess(account)`     | Supported — removes account from flash loan whitelist | Not ACM-granted                                  |
| E-mode pool support                  | Yes — via `poolId > 0`                              | No — no pool concept                               |

All other functions (`pauseActions`, `pauseSupply`, `pauseBorrow`, `pauseRedeem`, `pauseTransfer`, `setMarketBorrowCaps`, `setMarketSupplyCaps`) are ABI-compatible across both comptroller types and work identically on all chains.

## Inheritance

- `AccessControlledV8` — All functions are gated via the Venus Access Control Manager

## State Variables

### Immutable

| Variable          | Type                    | Description                                                                                    |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `COMPTROLLER`     | `ICorePoolComptroller`  | The Venus Comptroller this EBrake instance operates on. On BSC this is a Diamond proxy; on other chains it is an IL comptroller. |
| `IS_ISOLATED_POOL`| `bool`                  | Set at deployment. `true` for IL comptroller (isolated-pools); `false` for Diamond (BSC).     |

### Mutable

| Variable       | Type                                  | Description                                                                              |
| -------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `marketStates` | `mapping(address => MarketState)`     | Pre-incident snapshots keyed by vToken market address, captured on the first tightening. |

## Structs

### MarketState

```solidity
struct MarketState {
    uint256 borrowCap;
    uint256 supplyCap;
    bool borrowCapSnapshotted;
    bool supplyCapSnapshotted;
    mapping(uint96 => uint256) poolCFs;
    mapping(uint96 => uint256) poolLTs;
}
```

Holds the pre-incident state captured by EBrake before any tightening action. Nested mapping fields (`poolCFs`, `poolLTs`) must be read via `getMarketCFSnapshot()`. Cap fields are accessible via the auto-generated `marketStates()` getter.

| Field                  | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `borrowCap`            | Borrow cap value before EBrake decreased it.                           |
| `supplyCap`            | Supply cap value before EBrake decreased it.                           |
| `borrowCapSnapshotted` | True if a borrow cap snapshot has been recorded.                       |
| `supplyCapSnapshotted` | True if a supply cap snapshot has been recorded.                       |
| `poolCFs`              | Mapping of `poolId` to the collateral factor before EBrake decreased it. |
| `poolLTs`              | Mapping of `poolId` to the liquidation threshold at snapshot time.     |

# Solidity API

## EBrake

### pauseActions

Pause multiple actions on multiple markets in a single call.

```solidity
function pauseActions(address[] calldata markets, IComptroller.Action[] calldata actions) external
```

#### Parameters

| Name    | Type                      | Description                                        |
| ------- | ------------------------- | -------------------------------------------------- |
| markets | `address[]`               | The vToken market addresses to pause actions on.   |
| actions | `IComptroller.Action[]`   | The actions to pause.                              |

#### Behavior

Calls `setActionsPaused(markets, actions, true)` on the comptroller for the provided markets and actions. Only `MINT`, `REDEEM`, `BORROW`, and `TRANSFER` are allowed. Passing `REPAY`, `SEIZE`, `LIQUIDATE`, `ENTER_MARKET`, or `EXIT_MARKET` reverts.

#### Access Requirements

- ACM permission required: `pauseActions(address[],uint8[])`

#### Errors

- `EmptyArray` if `markets` or `actions` is empty
- `ForbiddenAction` if any action is not one of the four permitted actions

#### Events

- `ActionsPaused` emitted on success

---

### pauseSupply

Pause supply (mint) on a single market. Blocks new deposits; existing suppliers can still redeem.

```solidity
function pauseSupply(address market) external
```

#### Parameters

| Name   | Type      | Description               |
| ------ | --------- | ------------------------- |
| market | `address` | The vToken market address.|

#### Access Requirements

- ACM permission required: `pauseSupply(address)`

#### Events

- `ActionPaused` emitted with `action = MINT`

---

### pauseRedeem

Pause redeem on a single market. Blocks withdrawals. Use when draining must be stopped immediately.

```solidity
function pauseRedeem(address market) external
```

#### Parameters

| Name   | Type      | Description               |
| ------ | --------- | ------------------------- |
| market | `address` | The vToken market address.|

#### Access Requirements

- ACM permission required: `pauseRedeem(address)`

#### Events

- `ActionPaused` emitted with `action = REDEEM`

---

### pauseBorrow

Pause borrowing on a single market. Blocks new borrows; existing borrowers can still repay.

```solidity
function pauseBorrow(address market) external
```

#### Parameters

| Name   | Type      | Description               |
| ------ | --------- | ------------------------- |
| market | `address` | The vToken market address.|

#### Access Requirements

- ACM permission required: `pauseBorrow(address)`

#### Events

- `ActionPaused` emitted with `action = BORROW`

---

### pauseTransfer

Pause vToken transfers on a single market. Blocks vToken movement, preventing an attacker from moving stolen collateral.

```solidity
function pauseTransfer(address market) external
```

#### Parameters

| Name   | Type      | Description               |
| ------ | --------- | ------------------------- |
| market | `address` | The vToken market address.|

#### Access Requirements

- ACM permission required: `pauseTransfer(address)`

#### Events

- `ActionPaused` emitted with `action = TRANSFER`

---

### pauseFlashLoan

Pause flash loans across the core pool.

```solidity
function pauseFlashLoan() external
```

#### Behavior

Calls `setFlashLoanPaused(true)` on the Diamond comptroller. Idempotent: silently returns without emitting an event when flash loans are already paused, so `FlashLoanPaused` is always a true state-change signal.

#### Access Requirements

- ACM permission required: `pauseFlashLoan()`
- **BSC (Diamond) only** — not ACM-granted on IL chains

#### Events

- `FlashLoanPaused` emitted on state change (not emitted if already paused)

---

### disablePoolBorrow

Disable borrowing for a market in a specific pool, leaving all other pools unaffected.

```solidity
function disablePoolBorrow(uint96 poolId, address market) external
```

#### Parameters

| Name   | Type      | Description                                            |
| ------ | --------- | ------------------------------------------------------ |
| poolId | `uint96`  | The pool identifier (0 = core pool, >0 = e-mode pools).|
| market | `address` | The vToken market address.                             |

#### Behavior

Calls `setIsBorrowAllowed(poolId, market, false)` on the Diamond comptroller. The `false` argument is hardcoded — EBrake can only disable, never re-enable. This flag is independent of `pauseBorrow(market)`, which flips the global `_actionPaused[market][BORROW]` flag across every pool. Both flags must allow borrowing for borrows to proceed in a given pool/market; recovery therefore requires governance to clear both if both were set.

#### Access Requirements

- ACM permission required: `disablePoolBorrow(uint96,address)`
- **BSC (Diamond) only** — not ACM-granted on IL chains

#### Events

- `PoolBorrowDisabled` emitted on success

---

### revokeFlashLoanAccess

Remove a single account from the flash loan whitelist.

```solidity
function revokeFlashLoanAccess(address account) external
```

#### Parameters

| Name    | Type      | Description                                        |
| ------- | --------- | -------------------------------------------------- |
| account | `address` | The account whose flash loan access is revoked.    |

#### Behavior

Calls `setWhiteListFlashLoanAccount(account, false)` on the Diamond comptroller. The surgical alternative to `pauseFlashLoan()` — use when a single whitelisted integrator is compromised and a full flash loan pause would harm innocent users. The `false` is hardcoded; re-granting access requires governance.

#### Access Requirements

- ACM permission required: `revokeFlashLoanAccess(address)`
- **BSC (Diamond) only** — not ACM-granted on IL chains

#### Errors

- `ZeroAddress` if `account` is the zero address

#### Events

- `FlashLoanAccessRevoked` emitted on success

---

### decreaseCF (batch)

Decrease collateral factor to `newCF` for a market across all relevant pools. Liquidation threshold is left unchanged.

```solidity
function decreaseCF(address market, uint256 newCF) external
```

#### Parameters

| Name   | Type      | Description                                              |
| ------ | --------- | -------------------------------------------------------- |
| market | `address` | The vToken market address whose CF should be decreased.  |
| newCF  | `uint256` | The new collateral factor value.                         |

#### Behavior

- **Diamond (BSC):** Iterates all pools from `corePoolId` to `lastPoolId`. Applies `newCF` only to pools where `currentCF > newCF`; silently skips pools already at or below `newCF` and unlisted pools. Does not revert due to CF comparison — use the per-pool overload for strict enforcement on a specific pool.
- **IL (non-BSC):** Applies to the single market entry. Reverts with `CFExceedsCurrent` if `newCF > currentCF`. No-ops (returns without event) if `newCF == currentCF`.

Decreasing CF blocks or limits new borrows against the asset. It does **not** make existing positions liquidatable — that would require lowering LT, which EBrake cannot do.

#### Access Requirements

- ACM permission required: `decreaseCF(address,uint256)`

#### Errors

- `MarketNotListed` if the market is not listed in the core pool (Diamond) or the comptroller (IL)
- `CFExceedsCurrent` if `newCF > currentCF` (IL only; Diamond silently skips)
- `SetCollateralFactorFailed` if the comptroller returns a non-zero error code (Diamond only)

#### Events

- `CollateralFactorDecreased` emitted per pool where CF was actually changed

---

### decreaseCF (per pool)

Decrease collateral factor to `newCF` for a market in a specific pool.

```solidity
function decreaseCF(address market, uint96 poolId, uint256 newCF) external
```

#### Parameters

| Name   | Type      | Description                                                           |
| ------ | --------- | --------------------------------------------------------------------- |
| market | `address` | The vToken market address whose CF should be decreased.               |
| poolId | `uint96`  | The pool ID (0 for core pool, >0 for e-mode pools).                  |
| newCF  | `uint256` | The new collateral factor value. Must be ≤ current CF in the pool.   |

#### Behavior

Targets a single pool. No-ops (returns without event) if `newCF == currentCF`. Unlike the batch overload, this reverts with `CFExceedsCurrent` if `newCF > currentCF`, making it suitable for multisig use where strict enforcement per pool is required.

#### Access Requirements

- ACM permission required: `decreaseCF(address,uint96,uint256)`
- **BSC (Diamond) only** — reverts with `NotSupportedOnIsolatedPool` on IL chains

#### Errors

- `NotSupportedOnIsolatedPool` if called on an IL comptroller deployment
- `MarketNotListed` if the market is not listed in the given pool
- `CFExceedsCurrent` if `newCF > currentCF`
- `SetCollateralFactorFailed` if the comptroller returns a non-zero error code

#### Events

- `CollateralFactorDecreased` emitted on success

---

### setMarketBorrowCaps

Decrease borrow caps on one or more markets. Setting to 0 blocks all new borrows. Existing borrows are never affected by caps.

```solidity
function setMarketBorrowCaps(address[] calldata markets, uint256[] calldata newBorrowCaps) external
```

#### Parameters

| Name         | Type        | Description                                                                                    |
| ------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| markets      | `address[]` | The vToken market addresses to adjust borrow caps on.                                          |
| newBorrowCaps| `uint256[]` | The new borrow cap values. Each must be ≤ current cap (equality is a no-op; greater reverts). |

#### Behavior

Iterates the markets array. Elements equal to the current cap are silently skipped (no snapshot pollution). Elements strictly lower than the current cap trigger a cap decrease and record a first-write-wins snapshot. Only calls the comptroller if at least one element actually decreased.

#### Access Requirements

- ACM permission required: `setMarketBorrowCaps(address[],uint256[])`

#### Errors

- `EmptyArray` if `markets` is empty
- `ArrayLengthMismatch` if `markets` and `newBorrowCaps` have different lengths
- `CapExceedsCurrent` if any new cap is strictly greater than the current cap

#### Events

- `BorrowCapsDecreased` emitted when at least one cap was actually decreased

---

### setMarketSupplyCaps

Decrease supply caps on one or more markets. Setting to 0 blocks all new deposits. Existing deposits are never affected by caps.

```solidity
function setMarketSupplyCaps(address[] calldata markets, uint256[] calldata newSupplyCaps) external
```

#### Parameters

| Name         | Type        | Description                                                                                     |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------- |
| markets      | `address[]` | The vToken market addresses to adjust supply caps on.                                           |
| newSupplyCaps| `uint256[]` | The new supply cap values. Each must be ≤ current cap (equality is a no-op; greater reverts).  |

#### Behavior

Identical to `setMarketBorrowCaps` but operates on supply caps.

#### Access Requirements

- ACM permission required: `setMarketSupplyCaps(address[],uint256[])`

#### Errors

- `EmptyArray` if `markets` is empty
- `ArrayLengthMismatch` if `markets` and `newSupplyCaps` have different lengths
- `CapExceedsCurrent` if any new cap is strictly greater than the current cap

#### Events

- `SupplyCapsDecreased` emitted when at least one cap was actually decreased

---

### resetCFSnapshot

Reset the stored CF/LT snapshot for a market. Called by governance as part of a recovery VIP after restoring collateral factors.

```solidity
function resetCFSnapshot(address market) external
```

#### Parameters

| Name   | Type      | Description                                           |
| ------ | --------- | ----------------------------------------------------- |
| market | `address` | The vToken market address whose CF snapshot to clear. |

#### Behavior

Clears `poolCFs` and `poolLTs` for all relevant pools (all pools on Diamond; pool 0 on IL). Does not touch cap snapshots. After this call, the next `decreaseCF` call will capture a fresh pre-incident value.

#### Access Requirements

- ACM permission required: `resetCFSnapshot(address)`

#### Events

- `CFSnapshotReset` emitted on success

---

### resetBorrowCapSnapshot

Reset the stored borrow cap snapshot for a market. Called by governance after restoring the borrow cap.

```solidity
function resetBorrowCapSnapshot(address market) external
```

#### Parameters

| Name   | Type      | Description                                                    |
| ------ | --------- | -------------------------------------------------------------- |
| market | `address` | The vToken market address whose borrow cap snapshot to clear.  |

#### Behavior

Clears `borrowCap` and sets `borrowCapSnapshotted = false`. Does not touch supply cap or CF snapshots.

#### Access Requirements

- ACM permission required: `resetBorrowCapSnapshot(address)`

#### Events

- `BorrowCapSnapshotReset` emitted on success

---

### resetSupplyCapSnapshot

Reset the stored supply cap snapshot for a market. Called by governance after restoring the supply cap.

```solidity
function resetSupplyCapSnapshot(address market) external
```

#### Parameters

| Name   | Type      | Description                                                    |
| ------ | --------- | -------------------------------------------------------------- |
| market | `address` | The vToken market address whose supply cap snapshot to clear.  |

#### Behavior

Clears `supplyCap` and sets `supplyCapSnapshotted = false`. Does not touch borrow cap or CF snapshots.

#### Access Requirements

- ACM permission required: `resetSupplyCapSnapshot(address)`

#### Events

- `SupplyCapSnapshotReset` emitted on success

---

### getMarketCFSnapshot

Read the stored collateral factor and liquidation threshold snapshot for a market in a specific pool.

```solidity
function getMarketCFSnapshot(address market, uint96 poolId) external view returns (uint256 cf, uint256 lt)
```

#### Parameters

| Name   | Type      | Description                                                        |
| ------ | --------- | ------------------------------------------------------------------ |
| market | `address` | The vToken market address.                                         |
| poolId | `uint96`  | The pool ID (0 for IL chains or the core pool on Diamond).         |

#### Return Values

| Name | Type      | Description                                                                          |
| ---- | --------- | ------------------------------------------------------------------------------------ |
| cf   | `uint256` | The collateral factor stored before EBrake decreased it. 0 if no snapshot exists.   |
| lt   | `uint256` | The liquidation threshold at the time of the snapshot. 0 if no snapshot exists.     |

---

## Events

| Event                  | Parameters                                                    | Description                                                   |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `ActionsPaused`        | `caller`, `markets[]`, `actions[]`                            | Emitted when actions are batch-paused on markets.             |
| `ActionPaused`         | `caller`, `market`, `action`                                  | Emitted when a single action is paused on a market.           |
| `FlashLoanPaused`      | `caller`                                                      | Emitted when flash loans are paused (BSC only).               |
| `PoolBorrowDisabled`   | `caller`, `poolId`, `market`                                  | Emitted when pool-level borrow is disabled (BSC only).        |
| `FlashLoanAccessRevoked`| `caller`, `account`                                          | Emitted when an account's flash loan access is revoked (BSC only). |
| `CollateralFactorDecreased` | `caller`, `market`, `poolId`, `newCF`                   | Emitted per pool where CF was actually decreased.             |
| `BorrowCapsDecreased`  | `caller`, `markets[]`, `newBorrowCaps[]`                      | Emitted when at least one borrow cap was decreased.           |
| `SupplyCapsDecreased`  | `caller`, `markets[]`, `newSupplyCaps[]`                      | Emitted when at least one supply cap was decreased.           |
| `CFSnapshotReset`      | `market`                                                      | Emitted when a market's CF/LT snapshot is cleared.            |
| `BorrowCapSnapshotReset`| `market`                                                     | Emitted when a market's borrow cap snapshot is cleared.       |
| `SupplyCapSnapshotReset`| `market`                                                     | Emitted when a market's supply cap snapshot is cleared.       |

## Errors

| Error                       | Parameters                                          | Description                                                                          |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `ForbiddenAction`           | `action`                                            | A forbidden action (REPAY, SEIZE, etc.) was passed to batch pause.                   |
| `ZeroAddress`               | —                                                   | A zero address was passed where a valid address is required.                         |
| `MarketNotListed`           | `poolId`, `market`                                  | The market is not listed in the given pool.                                          |
| `SetCollateralFactorFailed` | `errorCode`                                         | `setCollateralFactor` returned a non-zero error code (Diamond only).                 |
| `EmptyArray`                | —                                                   | An empty array was passed where at least one element is required.                    |
| `ArrayLengthMismatch`       | `expected`, `actual`                                | Array lengths do not match.                                                          |
| `CapExceedsCurrent`         | `market`, `currentCap`, `requestedCap`              | Attempted to set a cap higher than the current value.                                |
| `NotSupportedOnIsolatedPool`| —                                                   | A Diamond-only function was called on an IL comptroller deployment.                  |
| `CFExceedsCurrent`          | `market`, `poolId`, `currentCF`, `requestedCF`      | Attempted to set a collateral factor higher than the current value.                  |

## Security Considerations

### Access Control

All functions are gated via the Venus ACM. No function can be called without an explicit ACM permission grant. The set of permissions granted at deployment differs between BSC and non-BSC chains — Diamond-only functions (`pauseFlashLoan`, `disablePoolBorrow`, `revokeFlashLoanAccess`, `decreaseCF(address,uint96,uint256)`) are not granted on IL chains.

### Snapshot Integrity

EBrake uses first-write-wins snapshots to capture the pre-incident state:

- CF/LT snapshots: `_snapshotCF` only writes if `poolCFs[poolId] == 0` and `currentCF > 0`. If the CF was already 0 before EBrake acted, nothing is recorded.
- Cap snapshots: written only on the first actual decrease (equality skipped to avoid polluting the snapshot with a no-op call).
- Each snapshot type (CF, borrow cap, supply cap) is independent and has its own reset function. Resetting one does not affect the others.

### Collateral Factor vs Liquidation Threshold

EBrake decreases CF but always preserves LT when calling `setCollateralFactor`. This is intentional:

- Decreasing CF prevents **new** borrows against the asset but does not affect existing positions.
- Decreasing LT would instantly make previously healthy positions liquidatable, harming innocent users.

Recovery VIPs may restore both CF and LT to their original values, which is why both are included in the snapshot.

### Per-Pool vs Global Borrow Disable (BSC)

On BSC there are two independent borrow flags:

1. **Global pause** (`pauseBorrow` → `_actionPaused[market][BORROW]`): applies across every pool for the market.
2. **Per-pool disable** (`disablePoolBorrow` → `isBorrowAllowed[poolId][market]`): applies only to the targeted pool, leaving other pools unaffected.

Both flags must allow borrowing for borrows to actually proceed. A recovery VIP must clear both flags if both were set by EBrake.

## Deployment

EBrake is deployed behind a `TransparentUpgradeableProxy`. The `IS_ISOLATED_POOL` flag is set in the constructor and cannot be changed. On BSC, `IS_ISOLATED_POOL = false`; on all other chains, `IS_ISOLATED_POOL = true`.

### BNB Chain Mainnet

| Contract            | Address                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| EBrake (Proxy)      | [`0x35eBaBB99c7Fb7ba0C90bCc26e5d55Cdf89C23Ec`](https://bscscan.com/address/0x35eBaBB99c7Fb7ba0C90bCc26e5d55Cdf89C23Ec)       |
| EBrake (Implementation) | [`0x2D36677EcA318c9536011D53aa752F042dd01DE8`](https://bscscan.com/address/0x2D36677EcA318c9536011D53aa752F042dd01DE8)   |

### BNB Chain Testnet

| Contract            | Address                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| EBrake (Proxy)      | [`0x957c09e3Ac3d9e689244DC74307c94111FBa8B42`](https://testnet.bscscan.com/address/0x957c09e3Ac3d9e689244DC74307c94111FBa8B42)                   |
| EBrake (Implementation) | [`0x9cA0f0C412d2E8a2c4323c04214D811375c17B24`](https://testnet.bscscan.com/address/0x9cA0f0C412d2E8a2c4323c04214D811375c17B24)           |

## Audits

EBrake undergoes security audits before mainnet deployment. Audit reports are available in the [venus-periphery repository](https://github.com/VenusProtocol/venus-periphery/tree/main/audits).
