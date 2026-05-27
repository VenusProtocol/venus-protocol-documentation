# Fixed Rate Vaults

**Fixed Rate Vaults** are a new lending product on Venus Protocol. Institutions borrow stablecoins for a fixed term at a fixed interest rate, backing the loan with on-chain collateral. Suppliers fund the loan during a fundraising window and earn the headline APY at maturity.

The system is deployed as a clone factory. The **InstitutionalVaultController** is the orchestration surface. It deploys a fresh **InstitutionalLoanVault** clone per institution, mints a position NFT to the nominated operator, and proxies governance operations to the vault. Suppliers interact with the vault directly via the standard ERC-4626 interface.

| Component | Description |
| --- | --- |
| **BaseVault** | Abstract ERC-4626 base providing shared fundraising, interest computation, state machine, settlement waterfall, and pause logic |
| **InstitutionalLoanVault** | Concrete vault deployed as an EIP-1167 clone. Extends `BaseVault` with collateral, borrowing, risk checks, and liquidation hooks |
| **InstitutionalVaultController** | Orchestrator. Deploys clones, mints position NFTs, holds the AccessControlManager reference, and proxies governance calls |
| **InstitutionPositionToken** | Non-upgradeable singleton ERC-721. One token per vault, minted to the institution's nominated operator. Transfer-gated by governance approval |
| **LiquidationAdapter** | Routes both health-based and overdue liquidations. Holds liquidator/settler whitelists, the global `closeFactor`, and the protocol liquidation share |

---

## Architecture

The Fixed Rate Vaults system consists of four contracts plus the shared ERC-4626 base:

| Contract | Role |
| --- | --- |
| **InstitutionalVaultController** | Central governance surface. Validates configurations, deploys vault clones, maintains the vault registry, and exposes ACM-gated admin functions. Deployed behind a transparent proxy. |
| **InstitutionalLoanVault** | Per-loan vault. Holds collateral, raised funds, and debt; enforces the state machine; exposes institution and supplier entrypoints. Deployed as a minimal EIP-1167 clone |
| **InstitutionPositionToken** | Singleton ERC-721. Mints one token per vault; gates transfers behind a single-use governance approval; provides the on-chain ownership credential for institution-side actions. Deployed once and cannot be upgraded. |
| **LiquidationAdapter** | Routes liquidation calls. Enforces liquidator/settler whitelists, calculates seize amounts using either `liquidationIncentive` (health-based) or `latePenaltyRate` (overdue), and accrues the protocol share for periodic sweeps to PSR |

### Per-Vault Isolation

Each vault is an entirely independent contract. Collateral, supplier deposits, debt, settlement, and risk thresholds are scoped to a single vault, so one vault cannot affect another. Even institutions running multiple loans concurrently receive a fresh clone per loan.

| Layer | Mechanism |
| --- | --- |
| **Fund custody** | Each vault holds its own balance of the supply asset (ERC-4626 underlying) and collateral asset. |
| **State machine** | Each vault advances through its own `VaultState` independently. Lifecycle timers (`openStartTime`, `lockEndTime`, `settlementDeadline`) are recorded on the vault itself |
| **Access control** | Institution operations are gated by `onlyPositionHolder` which is checked against `positionToken.ownerOf(positionTokenId)` at call time. Governance operations are proxied through the controller and gated by Venus AccessControlManager |
| **Deterministic deployment** | Clones are deployed with `Clones.cloneDeterministic(impl, salt)` using `keccak256(institution, nonce)` as salt. Per-institution nonce ensures uniqueness across deployments |

## State Machine

Vault lifecycle is encoded as the `VaultState` enum (defined in `IVaultTypes.sol`). A vault advances through these states in a single direction; there is no rollback.

```solidity
enum VaultState {
    WaitingForMargin,           // 0 — awaiting institution margin deposit
    MarginDeposited,            // 1 — margin in, awaiting governance to open
    Fundraising,                // 2 — suppliers depositing supply asset
    InstitutionConfirmation,    // 3 — reserved for subcontract use; unused here
    Lock,                       // 4 — funds committed, interest accruing
    PendingSettlement,          // 5 — maturity reached, awaiting repayment
    SettlementDeadlineExceeded, // 6 — deadline passed with outstanding debt
    Matured,                    // 7 — repayment settled, shares redeemable
    Failed,                     // 8 — fundraising shortfall or institution default
    Liquidated,                 // 9 — bad-debt rescue path
    Closed                      // 10 — governance delisted; all actions blocked
}
```

The diagram below shows how a vault moves between states, with each arrow labelled by the condition that triggers the transition.

```
                       +------------------------+
                       |    WaitingForMargin     |-- cancelVault() (governance) --+
                       +-----------+------------+                                 |
                                   |  depositCollateral()                         |
                                   |  (collateral >= required margin)             |
                                   v                                              |
                       +------------------------+-- cancelVault() (governance) ---+
                       |     MarginDeposited     |                                |
                       +-----------+------------+                                 |
                                   |  openVault()  (governance)                   |
                                   v                                              |
                       +------------------------+     raise short OR              |
                       |       Fundraising       |--> collateral underdelivered --+
                       |    (suppliers supply)   |                                | 
                       +-----------+------------+                                 v
                                   |  raised >= minBorrowCap                  +--------+                   +--------+
                                   |  and collateral met                      | Failed |-- closeVault() -> | Closed |
                                   v                                          +--------+                   +--------+
                       +------------------------+     LT shortfall > 0
                       |          Lock           |--> (health-based            +------------+                   +--------+
                       |       (borrowing)       |     liquidation) ---------> | Liquidated |-- closeVault() -> | Closed |
                       +-----------+------------+                              +------------+                   +--------+
                                   |                                                ^
                                   |  lockDuration elapsed                          |
                                   |  (repaid in full early ------> Matured)        |
                                   v                                                |
                       +------------------------+                                   |
                       |    PendingSettlement    |                                  |
                       +-----------+------------+                                   |
                                   |  settlementDeadline expired + debt > 0         |
                                   |  (repaid ------> Matured)                      |
                                   v                                                |
                       +----------------------------+   liquidateOverdueVault()     |
                       | SettlementDeadlineExceeded  |------------------------------+
                       +-------------+--------------+
                                     |  repaid
                                     v
                                 +---------+
                                 | Matured |
                                 +----+----+
                                      |  closeVault() (governance)
                                      v
                                 +--------+
                                 | Closed |
                                 +--------+
```

| State | Meaning | Allowed transitions |
| --- | --- | --- |
| **WaitingForMargin** | Vault deployed; institution must deposit the margin in a single transaction | → `MarginDeposited` (margin met), or → `Failed` (cancelled by governance) |
| **MarginDeposited** | Margin in. Lifecycle timelines pre-computed but not started | → `Fundraising` (via `openVault`), or → `Failed` (cancelled) |
| **Fundraising** | Suppliers deposit the supply asset; institution tops up to `idealCollateralAmount` | → `Lock` (raised ≥ minBorrowCap, collateral met), → `Failed` (raise short OR collateral underdelivered) |
| **Lock** | Funds committed; full interest fixed; institution may claim funds, repay, top up collateral | → `PendingSettlement` (lock duration elapsed), → `Matured` (repaid in full early), → `Liquidated` (HF-based liquidation completed) |
| **PendingSettlement** | Maturity reached; awaiting institution repayment | → `Matured` (debt cleared), → `SettlementDeadlineExceeded` (deadline passed with debt outstanding) |
| **SettlementDeadlineExceeded** | Deadline breached with debt outstanding. Liquidatable at late-penalty rate | → `Matured` (repaid), → `Liquidated` (overdue liquidation completed) |
| **Matured** | Settlement complete. Suppliers redeem pro-rata against `settlementAmount` | → `Closed` (governance delists) |
| **Failed** | Two sub-scenarios — see below. Suppliers redeem; institution recovers residual collateral | → `Closed` |
| **Liquidated** | Debt was cleared via liquidation. Suppliers redeem pro-rata against the leftover supply asset balance | → `Closed` |
| **Closed** | Terminal. All entrypoints revert | — |

### Happy Path

`WaitingForMargin` → `MarginDeposited` → `Fundraising` → `Lock` → `PendingSettlement` → `Matured` → `Closed`

### Failed Sub-Scenarios

The `Failed` state covers two distinct outcomes, distinguished by the `institutionDefaulted` flag in `InstitutionalRuntime`:

* **Scenario A (raise shortfall).** `totalRaised < minBorrowCap` at the end of the open window. `institutionDefaulted = false`, `confiscatedMarginRemaining = 0`. Suppliers redeem principal only; institution recovers all collateral including the margin.
* **Scenario B (collateral underdelivery).** `totalRaised ≥ minBorrowCap` but `totalCollateralDeposited < idealCollateralAmount` at the end of the open window. The margin (`idealCollateralAmount × marginRate`) is confiscated; `institutionDefaulted = true`. Suppliers redeem principal plus a pro-rata share of the confiscated margin in the collateral asset; institution recovers `totalCollateralDeposited − confiscatedMargin`.

## Lifecycle Parameters

All vault configuration is set once at deployment via `createVault` and cannot be changed afterwards (except `RiskConfig` fields, which are governance-mutable post-deployment).

### Shared Vault Configuration (`VaultConfig`)

| Field | Type | Meaning |
| --- | --- | --- |
| `supplyAsset` | `IERC20` | The loan asset suppliers deposit and the institution borrows |
| `fixedAPY` | `uint256` | Annualized interest rate. |
| `reserveFactor` | `uint256` | Protocol share of interest.|
| `minBorrowCap` | `uint256` | Minimum fundraise required to enter `Lock`. Below this, vault enters `Failed`|
| `maxBorrowCap` | `uint256` | Hard ceiling on fundraising. Deposits clamp to remaining capacity |
| `minSupplierDeposit` | `uint256` | Floor for a single deposit. Waived only when filling the final residual capacity |
| `openDuration` | `uint40` | Length of the fundraising window in seconds |
| `lockDuration` | `uint40` | Length of the locked-loan period in seconds. Used to compute total interest |
| `settlementWindow` | `uint40` | Grace period after lock end before the vault becomes overdue |

### Institutional Configuration (`InstitutionalConfig`)

| Field | Type | Meaning |
| --- | --- | --- |
| `collateralAsset` | `IERC20` | Asset the institution posts as collateral |
| `idealCollateralAmount` | `uint256` | Target collateral the institution should post. Computed off-chain by applying a collateral factor to `maxBorrowCap` |
| `marginRate` | `uint256` | Margin percentage of `idealCollateralAmount`. |
| `institutionOperator` | `address` | Initial recipient of the position NFT |
| `positionTokenId` | `uint256` | NFT id assigned at vault creation |

### Risk Configuration (`RiskConfig`)

| Field | Type | Meaning | Mutable |
| --- | --- | --- | --- |
| `liquidationThreshold` | `uint256` | Maximum debt-to-collateral ratio before liquidation. | Yes |
| `liquidationIncentive` | `uint256` | Health-based liquidator bonus. | Yes |
| `latePenaltyRate` | `uint256` | Overdue liquidation bonus. Same range as `liquidationIncentive` | Yes |

All risk parameter updates flow through `InstitutionalVaultController.setLiquidationThreshold` / `setLiquidationIncentive` / `setLatePenaltyRate`, each gated by AccessControlManager.


## Function Reference

### Governance (on `InstitutionalVaultController`)

All controller entrypoints are gated by Venus AccessControlManager via the `_checkAccessAllowed` modifier.

| Function | Effect |
| --- | --- |
| `createVault(...)` | Deploys a fresh `InstitutionalLoanVault` clone, mints the position NFT, registers the vault, and applies its `VaultConfig` / `InstitutionalConfig` / `RiskConfig`. Vault starts in `WaitingForMargin`. Emits `VaultCreated` |
| `openVault(vault)` | `MarginDeposited` → `Fundraising`; fixes all lifecycle timers |
| `cancelVault(vault)` | Cancels a pre-launch vault (`WaitingForMargin` / `MarginDeposited`) and refunds all collateral, including the margin; transitions to `Failed` with `institutionDefaulted = false` |
| `approvePositionTransfer(vault, recipient)` / `revokePositionTransfer(vault)` | Grant or revoke a single-use approval for a position-NFT transfer |
| `partialPauseVault` / `completePauseVault` / `unpauseVault` | Two-level pause control — see [Pause System](#pause-system) under Security Model |
| `closeVault(vault)` | Terminal: transitions a settled vault to `Closed` |
| `setLiquidationThreshold` / `setLiquidationIncentive` / `setLatePenaltyRate` | Update the mutable `RiskConfig` fields post-deployment |

### Institution (on the vault)

The `onlyPositionHolder` modifier checks `positionToken.ownerOf(positionTokenId) == msg.sender` at call time. Transferring the NFT immediately transfers control of these functions.

#### depositCollateral

```solidity
function depositCollateral(uint256 amount) external;
```

Pulls the collateral asset from the caller. Allowed in `WaitingForMargin`, `Fundraising`, and `Lock`. In `WaitingForMargin`, the deposit must bring `totalCollateralDeposited` to at least `idealCollateralAmount × marginRate` in a single transaction. Partial deposits below the margin threshold revert with `InsufficientCollateral`. On success in `WaitingForMargin`, the vault transitions to `MarginDeposited`. Emits `CollateralDeposited(amount, totalCollateralDeposited)`.

#### withdrawCollateral

```solidity
function withdrawCollateral(uint256 amount) external;
```

Releases collateral to the caller. Allowed in `Lock`, `Matured`, and `Failed`; blocked in all other states. During `Lock`, two checks gate the call:

1. **Floor check.** `totalCollateralDeposited − amount ≥ minimumCollateralRequired`, where the floor is recalculated at Lock entry as `idealCollateralAmount × totalRaised / maxBorrowCap`. Withdrawals cannot touch the locked portion.
2. **LT health check.** `_getHypotheticalVaultLiquidity(amount, 0)` simulates the post-withdrawal balance; if it would breach the liquidation threshold, the call reverts with `WithdrawalWouldBreachLT`.

In `Failed` (`institutionDefaulted = true`), the withdrawable amount is capped at `totalCollateralDeposited − confiscatedMarginRemaining`.

#### claimRaisedFunds

```solidity
function claimRaisedFunds() external;
```

One-shot transfer of the entire raised supply asset balance to the caller. Allowed only in `Lock`, gated by `fundsWithdrawn` (set true on success). Pre-call health check: simulating the resulting debt (`_runtime.totalRaised`) against current collateral must not produce a shortfall, otherwise reverts with `ClaimWouldBreachLT`. Emits `RaisedFundsClaimed(amount)`.

#### repay

```solidity
function repay(uint256 amount) external;
```

Anyone can call. Pulls supply asset from the caller and reduces `totalDebt`. Allowed in `Lock`, `PendingSettlement`, and `SettlementDeadlineExceeded`. Overpayment is automatically clamped to `outstandingDebt`. Emits `Repaid(amount, remainingDebt)`.

### Supplier (on the vault, ERC-4626 interface)

All supplier functions are permissionless. Anyone can supply.

```solidity
function deposit(uint256 assets, address receiver) external returns (uint256 shares);
function mint(uint256 shares, address receiver) external returns (uint256 assets);
function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
```

* `deposit` and `mint` are allowed only in `Fundraising`. Both clamp to remaining capacity (`maxBorrowCap − totalRaised`); exceeding capacity does not revert unless capacity is zero, in which case `ExceedsMaxCap` is raised. `minSupplierDeposit` is enforced unless the deposit fills the final residual slot.

* `withdraw` and `redeem` are allowed in `Matured`, `Failed`, and `Liquidated` only. Both follow standard ERC-4626 semantics, computing the supply-asset payout from `settlementAmount` and `totalSupply()`. In `Failed`, the `_afterWithdrawHook` additionally transfers a pro-rata slice of the confiscated margin in the collateral asset.

Shares are standard ERC-20s, freely transferable at all times. Suppliers track their position through the share balance, not through any per-user NFT.

### Liquidator (via `LiquidationAdapter`)

Two liquidation paths exist on the vault, each gated by the `onlyLiquidationAdapter` modifier:

```solidity
function liquidate(uint256 repayAmount) external returns (uint256 actualRepay);
function liquidateOverdueVault(uint256 repayAmount) external returns (uint256 actualRepay);
```

* `liquidate` (health-based) requires a current LT shortfall. Allowed in `Lock`, `PendingSettlement`, or `SettlementDeadlineExceeded`. The liquidator (via the adapter) repays up to `min(repayAmount, outstandingDebt × closeFactor)` and seizes collateral at the `liquidationIncentive` rate.

* `liquidateOverdueVault` (deadline-based) requires the vault to be in `SettlementDeadlineExceeded`. No collateral shortfall is required; the time breach alone qualifies. Seize amount is computed at the `latePenaltyRate`.

In both cases, seized collateral is split between the caller and the protocol per `LiquidationAdapter.protocolLiquidationShare`; the protocol share is accrued inside the adapter and periodically swept to PSR via `sweepProtocolShareToReserve`.

### Read-Only Views

```solidity
function state() external view returns (VaultState);
function config() external view returns (VaultConfig memory);      // BaseVault — shared config
function runtime() external view returns (VaultRuntime memory);    // BaseVault — shared runtime
function institutionalConfig() external view returns (InstitutionalConfig memory);
function institutionalRuntime() external view returns (InstitutionalRuntime memory);
function riskConfig() external view returns (RiskConfig memory);
function outstandingDebt() external view returns (uint256);
function totalAssets() external view returns (uint256);
function maxDeposit(address) external view returns (uint256);
function maxWithdraw(address) external view returns (uint256);
function maxRedeem(address) external view returns (uint256);
function previewDeposit(uint256) external view returns (uint256);
function previewRedeem(uint256) external view returns (uint256);
```

`totalAssets()` returns `totalRaised` until shares become redeemable. Once the vault settles (`Matured`, `Failed`, or `Liquidated`) it returns `settlementAmount`.

## Math

### Required Margin

The margin the institution must deposit to advance from `WaitingForMargin` to `MarginDeposited`:

$$
\text{requiredMargin} = \text{idealCollateralAmount} \times \frac{\text{marginRate}}{10^{18}}
$$

### Minimum Collateral Floor (at Lock Entry)

When the vault transitions to `Lock`, the locked-collateral floor is recalculated proportionally to the actual raise:

$$
\text{minimumCollateralRequired} = \text{idealCollateralAmount} \times \frac{\text{totalRaised}}{\text{maxBorrowCap}}
$$

This frees the excess collateral above the floor for withdrawal during `Lock` when the raise underfills the cap.

### Total Interest

Fixed interest is computed once at Lock entry and is owed in full at maturity, regardless of when the institution repays:

$$
\text{totalInterest} = \frac{\text{totalRaised} \times \text{fixedAPY} \times \text{lockDuration}}{\text{BPS} \times \text{YEAR}}
$$

Where `BPS = 10000` and `YEAR = 365 days`. The result is stored as `totalDebt` at Lock entry; `claimRaisedFunds` adds `totalRaised` to `totalDebt`.

### Protocol Fee at Settlement

`_settleProtocolShare` runs the settlement waterfall once on entry to `Matured` or `Liquidated`. Three branches:

| Branch | Condition | Protocol fee | Settlement amount |
| --- | --- | --- | --- |
| **Full repayment** | `available ≥ totalRaised + totalInterest` | `totalInterest × reserveFactor` | `available − (protocolFee + surplus)` |
| **Partial interest shortfall** | `totalRaised < available < totalRaised + totalInterest` | `(available − totalRaised) × reserveFactor` | `available − protocolFee` |
| **Principal shortfall** | `available ≤ totalRaised` | `0` | `available` |

Any surplus above `totalRaised + totalInterest` is also forwarded to PSR. `ShortfallDetected(expected, available)` fires in the partial and principal-shortfall branches.

### Per-Supplier Payout

Standard ERC-4626 pro-rata against the post-settlement `settlementAmount`:

$$
\text{payout} = \text{shares} \times \frac{\text{settlementAmount}}{\text{totalSupply}}
$$

### Margin Compensation per Redeem

When the institution defaults on collateral delivery, the margin is distributed pro-rata to suppliers as they redeem:

$$
\text{compensation} = \text{confiscatedMarginRemaining} \times \frac{\text{shares}}{\text{totalSupplyBeforeBurn}}
$$

Compensation is paid in the collateral asset, not the supply asset. Integer division means the last supplier to redeem may receive a marginally smaller compensation than the proportional share suggests; the dust amount is negligible in practice.

## Liquidation

### Standard (Health-Based) Liquidation

Triggered when the vault's debt exceeds its LT-capped collateral value. The liquidator (whitelisted on `LiquidationAdapter`) repays up to a fraction of the outstanding debt, capped by the global `closeFactor`, and seizes collateral at the `liquidationIncentive` rate.

* **Eligibility**: the vault has a non-zero shortfall.
* **Allowed states**: `Lock`, `PendingSettlement`, `SettlementDeadlineExceeded`.
* **Repay cap**: `min(repayAmount, outstandingDebt × closeFactor)`. `closeFactor` lives on `LiquidationAdapter`, shared across all vaults.
* **Seize amount**: computed from oracle-priced collateral and the supply asset, scaled by `liquidationIncentive`.

When the resulting repayment clears the debt, the vault transitions to `Matured` if collateral remains, or to `Liquidated` if the settlement is bad-debt (collateral insufficient to fully cover principal + interest).

### Overdue (Deadline-Based) Liquidation

Triggered when the settlement deadline passes with debt outstanding, irrespective of collateral health.

* **Eligibility**: `state == SettlementDeadlineExceeded` and `outstandingDebt > 0`.
* **No collateral shortfall required.** The time breach alone qualifies.
* **Seize amount**: scaled by `latePenaltyRate` instead of `liquidationIncentive`.

A vault that breaches both the LT cap **and** the settlement deadline can be liquidated through either path; the chosen path determines the bonus rate applied to the seize.

### Bad-Debt Rescue

If a liquidation completes but leaves the vault unable to repay suppliers in full, `repayBadDebt` is the path for governance or a sponsoring party to inject supply asset and transition the vault to `Matured` cleanly. Without this rescue, the vault remains in `Liquidated` and suppliers redeem against whatever the seized + remaining balance allows.

## Events

The events suppliers, institutions, and indexers will care about:

| Event | Emitted by | Meaning |
| --- | --- | --- |
| `StateTransition(from, to, timestamp)` | `BaseVault` | Every state change. The canonical lifecycle hook |
| `Deposit(caller, owner, assets, shares)` | ERC-4626 standard | Supplier deposited |
| `Withdraw(caller, receiver, owner, assets, shares)` | ERC-4626 standard | Supplier redeemed |
| `CollateralDeposited(amount, total)` | `InstitutionalLoanVault` | Institution posted collateral |
| `CollateralWithdrawn(positionHolder, amount, remaining)` | `InstitutionalLoanVault` | Institution withdrew collateral |
| `RaisedFundsClaimed(amount)` | `BaseVault` | Institution claimed the raised funds |
| `Repaid(amount, remainingDebt)` | `BaseVault` | Any repayment toward `totalDebt` |
| `VaultLocked(totalRaised, lockEndTime)` | `InstitutionalLoanVault` | Vault entered `Lock` |
| `VaultFailed(totalRaised, minBorrowCap)` | `InstitutionalLoanVault` | Vault entered `Failed` |
| `MarginConfiscated(marginAmount)` | `InstitutionalLoanVault` | Failed — margin reserved for suppliers |
| `MarginCompensationClaimed(receiver, amount)` | `InstitutionalLoanVault` | Per-supplier margin payout on redeem |
| `LiquidationExecuted(liquidator, repayAmount, collateralSeized)` | `InstitutionalLoanVault` | Health-based liquidation |
| `OverdueLiquidationExecuted(settler, repayAmount, collateralSeized)` | `InstitutionalLoanVault` | Deadline-based liquidation |
| `SettlementConfirmed(settlementAmount, protocolFee, surplus)` | `BaseVault` | Settlement waterfall completed |
| `ShortfallDetected(totalOwed, available)` | `BaseVault` | Available balance < expected repayment at settlement |
| `VaultClosed(state)` | `BaseVault` | Vault terminated by governance |

## Security Model

### Access Boundaries

| Surface | Gate | Notes |
| --- | --- | --- |
| Governance operations (create, open, cancel, pause, close, risk updates) | Venus AccessControlManager via `_checkAccessAllowed` on `InstitutionalVaultController` | Each function is independently gated by its selector signature |
| Institution operations (collateral, claim) | `onlyPositionHolder` on the vault — checks `positionToken.ownerOf(tokenId)` at call time | NFT transfer immediately reassigns control |
| Liquidation entrypoints on the vault | `onlyLiquidationAdapter` | Only the configured adapter address can call `liquidate` / `liquidateOverdueVault` |
| Liquidator/settler whitelists | ACM-gated `updateLiquidatorWhitelist` / `updateSettlerWhitelist` on the adapter | Separate whitelists for the two liquidation paths |
| Supplier deposits and redemptions | Permissionless | Standard ERC-4626; no allowlist |

### Pause System

A two-level pause governs all operations:

* `Unpaused` (0): normal operation.
* `Partial` (1): blocks deposits, collateral operations, fund claim, and the institution's repay path. Liquidation entrypoints and supplier withdrawals remain available.
* `Complete` (2): blocks everything, including repayment and liquidation. Supplier withdrawals are still permitted via the `whenNotCompletelyPaused` guard, providing a safety valve to ensure suppliers can exit terminal-state vaults even during a complete pause.

### Position NFT Transfer

`InstitutionPositionToken` is a singleton ERC-721 deployed once and owned by the controller. Transfers are blocked unless governance has approved a specific recipient via `approveTransfer(tokenId, recipient)`. The approval is single-use. This prevents institutions from silently transferring control without governance review.

### One-Shot Lifecycle

The state machine is monotonic; no state can re-enter `Fundraising` once it has been left. This eliminates classes of issues around re-initialization, ensures that interest cannot be compounded across cycles, and keeps the per-vault accounting bounded.

## Source

Source contracts live in the [VenusProtocol fixed-rate-vaults repository](https://github.com/VenusProtocol/fixed-rate-vaults).
