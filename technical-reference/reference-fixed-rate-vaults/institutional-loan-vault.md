# InstitutionalLoanVault

**Inherits:** [BaseVault](base-vault.md)

**Title:** InstitutionalLoanVault

ERC-4626 vault for institutional fixed-term lending with on-chain collateral,
borrowing, and liquidation support. Deployed as EIP-1167 minimal proxy clones.

Inherits BaseVault for shared ERC-4626 mechanics, fundraising, interest, settlement,
and core state machine. Adds: collateral deposit/withdraw, borrowing, risk checks,
liquidation entry points, and pre-fundraising states (WaitingForMargin, MarginDeposited).
No ACM — all governance calls are proxied through VaultController.
Position-holder gated functions (collateral ops, claimRaisedFunds) are restricted to the
current owner of the vault's PositionToken — not the original institution address. The
institution can transfer vault ownership by transferring the token to another address.
Fee-on-transfer tokens are NOT supported for either the underlying asset or collateral.

## Solidity API

## State Variables

### _instConfig

Institutional-specific configuration — collateral, sizing, position identity.

```solidity
InstitutionalConfig internal _instConfig
```

### _instRuntime

Institutional-specific runtime — collateral accounting, margin confiscation.

```solidity
InstitutionalRuntime internal _instRuntime
```

### _riskConfig

Risk parameters — LT/LI/latePenaltyRate mutable via controller.

```solidity
RiskConfig internal _riskConfig
```

### positionToken

InstitutionPositionToken contract — from controller storage.

```solidity
IInstitutionPositionToken public positionToken
```

## Functions

### onlyPositionHolder

Restricts to the current owner of the vault's PositionToken. Ownership is transferable —
if the institution transfers the token, the new holder gains access to position-holder gated functions.

```solidity
modifier onlyPositionHolder();
```

### onlyLiquidationAdapter

Restricts to the LiquidationAdapter contract stored on the controller.

```solidity
modifier onlyLiquidationAdapter();
```

### constructor

**Note:** oz-upgrades-unsafe-allow: constructor

```solidity
constructor();
```

### initialize

Initializes the vault clone. Called once by VaultController.

```solidity
function initialize(
    VaultConfig calldata config_,
    InstitutionalConfig calldata instConfig_,
    RiskConfig calldata riskConfig_,
    IInstitutionPositionToken positionToken_,
    string calldata name_,
    string calldata symbol_
) external initializer;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `config_` | `VaultConfig` | Shared vault configuration (asset, rates, caps, timing). |
| `instConfig_` | `InstitutionalConfig` | Institutional-specific configuration (collateral, sizing, position identity). |
| `riskConfig_` | `RiskConfig` | Risk parameters. |
| `positionToken_` | `IInstitutionPositionToken` | InstitutionPositionToken contract reference. |
| `name_` | `string` | ERC-20 share token name. |
| `symbol_` | `string` | ERC-20 share token symbol. |

### openVault

Transitions MarginDeposited -> Fundraising. Controller only.

**Notes:**
- error: InvalidState If vault is not in MarginDeposited state.
- event: VaultOpened Emitted with the open end time.
- event: StateTransition Emitted for MarginDeposited -> Fundraising.

```solidity
function openVault() external onlyController;
```

### cancelVault

Cancels a vault that has not yet launched and refunds any deposited collateral
to the NFT position holder. Restricted to the two pre-launch states:
WaitingForMargin (no collateral yet) or MarginDeposited (margin in escrow).
Uses positionToken.ownerOf so any approved NFT transfer is honoured.

**Notes:**
- error: InvalidState If vault is not in WaitingForMargin or MarginDeposited.
- event: VaultCancelled Emitted with the position-holder recipient and refunded collateral amount.
- event: StateTransition Emitted by _stateTransition for WaitingForMargin/MarginDeposited -> Failed.

```solidity
function cancelVault() external onlyController nonReentrant;
```

### repayBadDebt

Permissionless bad-debt rescue. Anyone may repay to settle a vault where collateral < debt.

**Notes:**
- error: InvalidState If vault is not in Lock, PendingSettlement, or SettlementDeadlineExceeded.
- error: ZeroRepayAmount If repayAmount is zero.
- error: NoOutstandingDebt If there is no debt to repay.
- error: NotBadDebt If collateral value >= debt value.
- error: InsufficientRepayment If outstanding debt after repay still exceeds total interest (principal not fully returned).

```solidity
function repayBadDebt(uint256 repayAmount) external nonReentrant whenNotCompletelyPaused;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `repayAmount` | `uint256` | Amount of supply asset to pull from caller. |

### setLiquidationThreshold

Updates liquidation threshold. Controller only.

**Note:** event: LiquidationThresholdUpdated

```solidity
function setLiquidationThreshold(uint256 newLT) external onlyController;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newLT` | `uint256` | New liquidation threshold (mantissa). |

### setLiquidationIncentive

Updates liquidation incentive. Controller only.

**Note:** event: LiquidationIncentiveUpdated

```solidity
function setLiquidationIncentive(uint256 newLI) external onlyController;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newLI` | `uint256` | New liquidation incentive (mantissa). |

### setLatePenaltyRate

Updates late penalty rate. Controller only.

**Note:** event: LatePenaltyRateUpdated

```solidity
function setLatePenaltyRate(uint256 newRate) external onlyController;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newRate` | `uint256` | New late penalty rate (mantissa). |

### liquidate

HF-based liquidation. LiquidationAdapter only.

**Notes:**
- error: ZeroRepayAmount If repayAmount is zero.
- error: InvalidState If vault is not in Lock, PendingSettlement, or SettlementDeadlineExceeded.
- error: NoOutstandingDebt If there is no debt to repay.
- error: NotLiquidatable If vault has no LT shortfall.
- event: LiquidationExecuted Emitted with liquidator, repay amount, and collateral seized.

```solidity
function liquidate(
    uint256 repayAmount
) external onlyLiquidationAdapter nonReentrant whenNotCompletelyPaused returns (uint256 actualRepay);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `repayAmount` | `uint256` | Amount of supply asset to repay. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `actualRepay` | `uint256` | Actual amount repaid after clamping to outstanding debt. |

### liquidateOverdueVault

Deadline-based liquidation. LiquidationAdapter only.

**Notes:**
- error: ZeroRepayAmount If repayAmount is zero.
- error: InvalidStateForOverdueLiquidation If not in SettlementDeadlineExceeded.
- error: NoOutstandingDebt If there is no debt to repay.
- error: ExceedsCloseFactor If actualRepay exceeds the close factor limit (via _executeLiquidation).
- error: InsufficientCollateralForSeize If seize amount exceeds collateral balance (via _executeLiquidation).
- event: OverdueLiquidationExecuted Emitted with settler, repay amount, and collateral seized.

```solidity
function liquidateOverdueVault(
    uint256 repayAmount
) external onlyLiquidationAdapter nonReentrant whenNotCompletelyPaused returns (uint256 actualRepay);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `repayAmount` | `uint256` | Amount of supply asset to repay. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `actualRepay` | `uint256` | Actual amount repaid after clamping to outstanding debt. |

### depositCollateral

Deposits collateral into the vault. Fee-on-transfer / rebasing collateral tokens are NOT supported.

- WaitingForMargin: the full margin amount must be deposited in a single transaction to transition to MarginDeposited; partial deposits revert.
- Fundraising: institution deposits remaining collateral alongside lender fundraising.
- Lock: top-up collateral.

**Notes:**
- error: InvalidState If vault is not in WaitingForMargin, Fundraising, or Lock.
- error: InsufficientCollateral If deposit in WaitingForMargin does not meet margin threshold.
- event: CollateralDeposited Emitted with actual deposited amount and total collateral.

```solidity
function depositCollateral(uint256 amount) external onlyPositionHolder nonReentrant whenNotPaused;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `amount` | `uint256` | Amount of collateral tokens to deposit. |

### withdrawCollateral

Withdraws collateral.

- Lock: floor-checked (minimumCollateralRequired) + LT-checked.
- Failed (Scenario A — raised < minCap): withdraw all deposited collateral.
- Failed (Scenario B — institution default): withdraw deposited minus confiscated margin.
- Matured: capped at totalCollateralDeposited, unrestricted.
- Liquidated: blocked — collateral is recoverable by governance via sweep().

**Notes:**
- error: InvalidState If vault is not in Lock, Matured, or Failed.
- error: InsufficientCollateral If withdrawal would breach floor or exceed available amount.
- error: WithdrawalWouldBreachLT If withdrawal would cause LT shortfall during Lock.
- event: CollateralWithdrawn Emitted with position holder, amount, and remaining collateral.

```solidity
function withdrawCollateral(uint256 amount) external onlyPositionHolder nonReentrant whenNotPaused;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `amount` | `uint256` | Amount of collateral tokens to withdraw. |

### claimRaisedFunds

One-time fund withdrawal. Transfers all raised supply assets to institution.

**Notes:**
- error: AlreadyWithdrawn if funds already claimed.
- error: ClaimWouldBreachLT if post-claim debt would exceed LT cap.
- event: RaisedFundsClaimed

```solidity
function claimRaisedFunds() external onlyPositionHolder nonReentrant whenNotPaused;
```

### repay

Repays outstanding debt. Anyone may call. Clamped to outstandingDebt.

**Notes:**
- error: InvalidState If vault is not in Lock, PendingSettlement, or SettlementDeadlineExceeded.
- error: ZeroRepayAmount if amount is zero.
- error: NoOutstandingDebt if there is no debt to repay.
- event: Repaid

```solidity
function repay(uint256 amount) external nonReentrant whenNotCompletelyPaused;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `amount` | `uint256` | Amount of supply asset to repay. |

### getCollateralValueUSD

Current collateral value in USD via oracle.

```solidity
function getCollateralValueUSD() external view returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Collateral value in 18-decimal USD. |

### getDebtValueUSD

Current outstanding debt value in USD via oracle.

```solidity
function getDebtValueUSD() external view returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Debt value in 18-decimal USD. |

### institutionalConfig

Returns the institutional-specific configuration.

```solidity
function institutionalConfig() external view returns (InstitutionalConfig memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `InstitutionalConfig` | Institutional config struct. |

### riskConfig

Returns the risk configuration.

```solidity
function riskConfig() external view returns (RiskConfig memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `RiskConfig` | Risk parameters struct. |

### institutionalRuntime

Returns the institutional-specific runtime state.

```solidity
function institutionalRuntime() external view returns (InstitutionalRuntime memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `InstitutionalRuntime` | Institutional runtime struct. |

### getVaultLiquidity

Returns current liquidity and shortfall for the vault.

```solidity
function getVaultLiquidity() external view returns (uint256 liquidity, uint256 shortfall);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `liquidity` | `uint256` | Excess liquidity (0 if shortfall). |
| `shortfall` | `uint256` | LT shortfall (0 if healthy). |

### getHypotheticalVaultLiquidity

Returns hypothetical liquidity/shortfall after a simulated withdrawal and/or debt increase.

```solidity
function getHypotheticalVaultLiquidity(
    uint256 withdrawAmount,
    uint256 additionalDebt
) external view returns (uint256 liquidity, uint256 shortfall);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `withdrawAmount` | `uint256` | Simulated collateral withdrawal amount. |
| `additionalDebt` | `uint256` | Simulated additional debt on top of outstanding. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `liquidity` | `uint256` | Excess liquidity (0 if shortfall). |
| `shortfall` | `uint256` | LT shortfall (0 if healthy). |

### calculateSeizeAmount

Preview seize amount for a given repay and liquidation type.

```solidity
function calculateSeizeAmount(
    uint256 repayAmount,
    LiquidationType liquidationType
) external view returns (uint256);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `repayAmount` | `uint256` | Amount being repaid. |
| `liquidationType` | `LiquidationType` | HF_BASED or DEADLINE. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Collateral seize amount. |

## Events

### VaultOpened

```solidity
event VaultOpened(uint256 openEndTime);
```

### VaultLocked

```solidity
event VaultLocked(uint256 totalRaised, uint256 lockEndTime);
```

### VaultFailed

```solidity
event VaultFailed(uint256 totalRaised, uint256 minBorrowCap);
```

### VaultLiquidated

```solidity
event VaultLiquidated(uint256 available);
```

### CollateralDeposited

```solidity
event CollateralDeposited(uint256 amount, uint256 totalCollateral);
```

### CollateralWithdrawn

```solidity
event CollateralWithdrawn(address indexed positionHolder, uint256 amount, uint256 remaining);
```

### LiquidationExecuted

```solidity
event LiquidationExecuted(address indexed liquidator, uint256 repayAmount, uint256 collateralSeized);
```

### OverdueLiquidationExecuted

```solidity
event OverdueLiquidationExecuted(address indexed settler, uint256 repayAmount, uint256 collateralSeized);
```

### MarginConfiscated

```solidity
event MarginConfiscated(uint256 marginAmount);
```

### MarginCompensationClaimed

```solidity
event MarginCompensationClaimed(address indexed receiver, uint256 amount);
```

### VaultCancelled

```solidity
event VaultCancelled(address indexed recipient, uint256 collateralAmount);
```

### LiquidationThresholdUpdated

```solidity
event LiquidationThresholdUpdated(uint256 oldLT, uint256 newLT);
```

### LiquidationIncentiveUpdated

```solidity
event LiquidationIncentiveUpdated(uint256 oldLI, uint256 newLI);
```

### LatePenaltyRateUpdated

```solidity
event LatePenaltyRateUpdated(uint256 oldRate, uint256 newRate);
```

## Errors

### InsufficientCollateral

```solidity
error InsufficientCollateral();
```

### NotPositionHolder

```solidity
error NotPositionHolder();
```

### InvalidStateForOverdueLiquidation

```solidity
error InvalidStateForOverdueLiquidation();
```

### NotBadDebt

```solidity
error NotBadDebt();
```

### InsufficientRepayment

```solidity
error InsufficientRepayment();
```

### NotLiquidatable

```solidity
error NotLiquidatable();
```

### ExceedsCloseFactor

```solidity
error ExceedsCloseFactor();
```

### InsufficientCollateralForSeize

```solidity
error InsufficientCollateralForSeize(uint256 seizeAmount, uint256 availableCollateral);
```

### WithdrawalWouldBreachLT

```solidity
error WithdrawalWouldBreachLT();
```

### WithdrawExceedsCollateral

```solidity
error WithdrawExceedsCollateral();
```

### ClaimWouldBreachLT

```solidity
error ClaimWouldBreachLT();
```

### InvalidOraclePrice

```solidity
error InvalidOraclePrice();
```
