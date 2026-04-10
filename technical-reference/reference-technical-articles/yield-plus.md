# Venus Yield+: Technical Reference

{% hint style="info" %}
Available on BNB Chain Core Pool.
{% endhint %}

## Overview

**Venus Yield+** is a relative performance trading system built as a peripheral orchestration layer on top of Venus Protocol's existing lending and borrowing infrastructure. It allows users to express a view that one asset will outperform another — packaged into a single, easy-to-manage position with automated execution, proportional closing, and built-in yield generation.

Users deposit a stablecoin collateral (the **Default Settlement Asset**, or DSA), select a long and short vToken pair, and Yield+ handles all leveraged execution — flash loans, swaps, supply, and borrow — atomically in a single transaction.

This is not directional trading. Yield+ positions profit (or lose) based on the **relative price movement between two assets**, regardless of whether the overall market is going up or down. While held, positions also generate yield: supply APY on the long asset, DSA APY on collateral, minus borrow APY on the short asset.

| Component | Description |
| --- | --- |
| **RelativePositionManager** | The main orchestration contract that manages the full lifecycle of Yield+ positions — from activation and opening to proportional closing and deactivation |
| **PositionAccount** | A dedicated smart contract account deployed per user per trading pair. All collateral, borrow positions, and yield accrual live here, fully isolated from other positions |
| **Paired Positions** | Long and short legs treated as a single unit with combined PnL, health, and lifecycle management |
| **Default Settlement Asset (DSA)** | A designated stablecoin (USDT or USDC) used as collateral and as the currency for all PnL settlement |
| **Proportional Closing** | Flexible partial or full position closing using on-chain flash loans and token swaps, with automatic dust handling |
| **Capital Utilization Tracking** | Real-time calculation of how much deposited collateral is locked by open positions, enabling accurate withdrawable balance reporting |

No changes were made to the Venus Core Pool, Comptroller, vToken contracts, interest rate models, oracles, or any existing protocol infrastructure. Existing users are not affected.

---

## Architecture

The Yield+ system consists of four contracts:

| Contract | Role |
| --- | --- |
| **RelativePositionManager** | Central orchestration contract. Manages position state, validates operations, calculates utilization, and delegates execution to PositionAccount. |
| **PositionAccount** | A minimal proxy clone deployed per user per trading pair. Holds all funds, enters Venus markets, and delegates leverage execution to LeverageStrategiesManager. |
| **LeverageStrategiesManager** | Pre-existing Venus periphery contract. Executes flash loans via the Comptroller and invokes the SwapHelper. |
| **SwapHelper** | Pre-existing Venus periphery contract. Executes authorized on-chain swaps using signed multicall data. |

```
┌──────────────────────────────────────────────────────────────────┐
│                      Venus Core Pool                             │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Comptroller  │  │   vTokens    │  │   Flash Loan Module   │ │
│  └───────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │
└──────────┼─────────────────┼──────────────────────┼─────────────┘
           │                 │                      │
           │                 │            ┌─────────┘
           │                 │   ┌────────┴──────────────────────┐
           │                 │   │   LeverageStrategiesManager   │
           │                 │   │   - Flash loan executor       │
           │                 │   │   - enter / exitLeverage()    │
           │                 │   └──────────────┬────────────────┘
           │                 │                  │
┌──────────┼─────────────────┼──────────────────┼─────────────────┐
│          ▼                 ▼                  ▼                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              RelativePositionManager                     │   │
│  │  - Position lifecycle (activate → open → close → exit)   │   │
│  │  - Capital utilization and withdrawal logic               │   │
│  │  - Proportional close validation and execution            │   │
│  └────────────────────────────┬──────────────────────────────┘   │
│                               │                                   │
│                               ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           PositionAccount  (per user × pair)             │   │
│  │  Deterministic deploy · Owns all funds                   │   │
│  │  RPM-only access · User-gated calls                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        Venus Periphery                            │
└──────────────────────────────────────────────────────────────────┘
```

### Position Isolation

Every unique `(user, longVToken, shortVToken)` triple gets its own **PositionAccount** — a minimal EIP-1167 clone deployed with a deterministic CREATE2 salt. Collateral, debt, and Health Factor are entirely independent across accounts. A liquidation or loss on one PositionAccount cannot affect any other.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Position Isolation                            │
├──────────────────────────────────┬───────────────────────────────────┤
│            User A                │            User B                 │
├──────────────────────────────────┼───────────────────────────────────┤
│                                  │                                   │
│  ETH↑ / BNB↓                    │  ETH↑ / BNB↓                     │
│  ┌──────────────────────────┐    │  ┌──────────────────────────────┐ │
│  │  PositionAccount A1      │    │  │  PositionAccount B1          │ │
│  │  Venus HF: 2.1           │    │  │  Venus HF: 1.8               │ │
│  └──────────────────────────┘    │  └──────────────────────────────┘ │
│                                  │                                   │
│  BTC↑ / USDT↓                   │                                   │
│  ┌──────────────────────────┐    │                                   │
│  │  PositionAccount A2      │    │                                   │
│  │  Venus HF: 3.4           │    │                                   │
│  └──────────────────────────┘    │                                   │
│                                  │                                   │
├──────────────────────────────────┴───────────────────────────────────┤
│  All PositionAccounts route through RelativePositionManager.         │
│  No external caller can move funds directly out of a PositionAccount.│
└──────────────────────────────────────────────────────────────────────┘
```

| Layer | Mechanism |
| --- | --- |
| **Fund custody** | Each PositionAccount is a separate on-chain address. Venus vTokens and underlying balances are held there, not in the RelativePositionManager. |
| **Access restriction** | `PositionAccount.onlyRelativePositionManager` reverts any call not originating from the single trusted manager address. |
| **Comptroller membership** | Each PositionAccount enters Venus markets independently. Its Health Factor is computed solely from its own supplied and borrowed balances. |
| **Delegate approval** | During initialization the PositionAccount approves both the RelativePositionManager and LeverageStrategiesManager as delegates in the Comptroller — this allows flash-loan execution while keeping all debt on the PositionAccount, not on the manager. |
| **Deterministic deployment** | Clones are deployed with `ClonesUpgradeable.cloneDeterministic(impl, keccak256(user, long, short))`. A given user cannot create two accounts for the same pair; the address is unique and pre-determined. |

---

## Key Concepts

### Long Leg and Short Leg

A Yield+ position always consists of two legs:

- **Long Leg** — the asset expected to outperform. Supplied into Venus to earn supply APY.
- **Short Leg** — the asset expected to underperform. Borrowed from Venus, creating an interest cost.

The two legs are treated as a single position with combined PnL — users never manage them separately.

### Default Settlement Asset (DSA)

When activating a position, the user selects a **Default Settlement Asset** (USDT or USDC). The DSA serves as:

- The initial collateral deposited into the PositionAccount
- The asset that backs borrow risk (its collateral factor determines how much can be borrowed)
- The currency in which realized profits are accumulated
- The asset used to cover losses on close

### Leverage

Leverage amplifies exposure to relative price movement. The maximum leverage is derived from the collateral factors of the DSA and long asset:

$$
\text{maxLeverage} = \frac{CF_{DSA}}{1 - CF_{long} \times (1 - \text{tolerance})}
$$

Where `tolerance` is the `proportionalCloseTolerance`, used as a buffer to prevent activations that would immediately be at the boundary of the safe borrow range. Leverage is recorded at activation and is fixed for the position's lifecycle.

### Capital Utilization

Capital utilization measures how much of the deposited DSA principal is "locked" by the open leveraged position. The remainder — **Available Capital** — can be withdrawn or used to scale the position further. See [Capital Utilization](#capital-utilization-1) for the full formula.

### Yield Generation

Yield+ positions generate yield while held:

| Component | Description |
| --- | --- |
| **Supply APY** | The long asset is supplied into Venus and earns lending yield |
| **DSA APY** | The stablecoin collateral is supplied into Venus and earns yield |
| **Borrow APY** | Interest paid on the borrowed short asset (deducted from yield) |
| **Net APY** | DSA APY + Supply APY − Borrow APY |

All yield accrues automatically and is reflected in position balances in real time. There is no claim or harvest step.

---

## Implementation Details

### 1. RelativePositionManager

The primary external interface for all Yield+ operations. All user-facing calls pass through this contract, which enforces lifecycle rules, validates parameters, computes capital utilization, and delegates execution to the PositionAccount.

**Inheritance:**
- `AccessControlledV8` — governance-gated admin functions via AccessControlManager
- `ReentrancyGuardUpgradeable` — reentrancy protection on all state-changing calls
- Custom two-level pause — `isPartiallyPaused` / `isCompletelyPaused` with `whenNotPaused` and `whenNotCompletelyPaused` modifiers

**Key state:**

```solidity
// Per-position state
mapping(address user => mapping(address longVToken => mapping(address shortVToken => Position))) positions;

// DSA configuration
mapping(uint8 index => address vToken) dsaVTokens;
mapping(address vToken => bool active) isDsaVTokenActive;

// Proportional close tolerance (BPS, default 100 = 1%)
uint256 proportionalCloseTolerance;
```

#### activateAndOpenPosition

Atomically activates a new position for the caller and executes the first leveraged open in a single transaction. If a PositionAccount clone does not yet exist for this `(user, long, short)` triple, it is deployed in the same transaction.

The function executes three sequential phases:

1. **Validation** — verifies that `longVToken` and `shortVToken` are listed in the Comptroller and are not the same market, that neither is vBNB, that the DSA index maps to an active registered DSA, that `effectiveLeverage` is in `[1e18, maxLeverage]`, and that no active position already exists for this pair.
2. **Activation** — deploys the PositionAccount clone if needed (via `ClonesUpgradeable.cloneDeterministic`), increments `cycleId`, records the position configuration, calls `Comptroller.enterMarketBehalf` to register the DSA market for the PositionAccount, and calls `vToken.mintBehalf` to deposit `initialPrincipal`. The returned vToken amount is stored as `suppliedPrincipalVTokens`.
3. **Open** — validates `shortAmount ≤ maxBorrow` (available capital × clamped leverage / short price), then calls `positionAccount.enterLeverage(longVToken, 0, shortVToken, shortAmount, minLongAmount, swapData)`. The LeverageStrategiesManager flash-loans `shortAmount`, swaps to the long asset, and supplies it to the PositionAccount's long vToken position.

```solidity
function activateAndOpenPosition(
    address longVToken,
    address shortVToken,
    uint8 dsaIndex,
    uint256 initialPrincipal,
    uint256 effectiveLeverage,
    uint256 shortAmount,
    uint256 minLongAmount,
    bytes calldata swapData
) external;
```

The caller must approve `initialPrincipal` of the DSA underlying to the RelativePositionManager before calling. The function uses `mintBehalf` so that the vToken balance accrues directly on the PositionAccount — the RPM itself holds no collateral.

---

#### scalePosition

Adds additional short exposure to an existing active position. Optionally accepts more DSA principal if `additionalPrincipal > 0`.

Scaling recalculates `maxBorrow` from the updated available capital (including any newly deposited principal) before validating `shortAmount`. The stored `effectiveLeverage` is **not updated** by scaling — it remains fixed at the value set during activation and is used for utilization calculations across the position's lifecycle.

```solidity
function scalePosition(
    IVToken longVToken,
    IVToken shortVToken,
    uint256 additionalPrincipal,
    uint256 shortAmount,
    uint256 minLongAmount,
    bytes calldata swapData
) external;
```

---

#### closeWithProfit

Proportionally closes a fraction of the position when the long asset has outperformed the short asset. Takes two swap legs: one to repay debt and one to harvest the profit into DSA principal.

The caller specifies `closeFractionBps` (1–10000) to indicate what fraction of the position to close. The protocol validates that the total long amount specified (`longAmountToRedeemForRepay + longAmountToRedeemForProfit`) is within `proportionalCloseTolerance` of the expected proportional amount:

```
expectedLong = currentLongBalance × closeFractionBps / 10000
assert |totalLong − expectedLong| ≤ expectedLong × tolerance / 10000
```

**Execution flow:**
1. Redeem `longAmountToRedeemForRepay` from the PositionAccount's long vToken position
2. Swap long → short via `positionAccount.exitLeverage()` to repay the proportional debt
3. Redeem `longAmountToRedeemForProfit` from the long vToken position
4. Swap long → DSA and mint as DSA principal on the PositionAccount
5. Update `suppliedPrincipalVTokens` += newly minted DSA vTokens (profit increases Available Capital)

```solidity
function closeWithProfit(
    IVToken longVToken,
    IVToken shortVToken,
    uint256 closeFractionBps,
    uint256 longAmountToRedeemForRepay,
    uint256 minAmountOutRepay,
    bytes calldata swapDataRepay,
    uint256 longAmountToRedeemForProfit,
    uint256 minAmountOutProfit,
    bytes calldata swapDataProfit
) external;
```

---

#### closeWithLoss

Proportionally closes a fraction of the position when the long asset value is insufficient to cover the proportional short debt. Uses a two-leg approach to repay the full debt fraction.

- **Leg 1** — redeems long collateral, swaps long → short, repays as much debt as possible
- **Leg 2** — redeems DSA collateral, swaps DSA → short (or uses directly if DSA == short via `exitSingleAssetLeverage`), repays remaining debt

Leg 2 is optional — pass `dsaAmountToRedeemForSecondSwap = 0` if leg 1 fully covers the debt. The `suppliedPrincipalVTokens` counter is decremented by the DSA vTokens burned in leg 2, reflecting the principal consumed to cover the loss.

```solidity
function closeWithLoss(
    IVToken longVToken,
    IVToken shortVToken,
    uint256 closeFractionBps,
    uint256 longAmountToRedeemForFirstSwap,
    uint256 shortAmountToRepayForFirstSwap,
    uint256 minAmountOutFirst,
    bytes calldata swapDataFirst,
    uint256 dsaAmountToRedeemForSecondSwap,
    uint256 minAmountOutSecond,
    bytes calldata swapDataSecond
) external;
```

---

#### supplyPrincipal

Deposits additional DSA collateral into the PositionAccount without opening a new leveraged trade. Transfers DSA from the caller, calls `vToken.mintBehalf` to supply it on the PositionAccount, and increments `suppliedPrincipalVTokens`.

This increases Available Capital and improves the position's Health Factor. Allowed during partial pause — classified as a defensive operation.

```solidity
function supplyPrincipal(address longVToken, address shortVToken, uint256 amount) external;
```

---

#### withdrawPrincipal

Withdraws Available Capital (unused DSA collateral) from the PositionAccount to the caller's wallet.

The maximum withdrawable amount is computed by `getUtilizationInfo()` as `availableCapitalUSD / dsaPrice`. The function redeems the corresponding DSA vTokens from the PositionAccount and decrements `suppliedPrincipalVTokens`. Blocked during partial pause.

```solidity
function withdrawPrincipal(IVToken longVToken, IVToken shortVToken, uint256 amount) external;
```

---

#### deactivatePosition

Fully exits a position after the short debt has been repaid to zero. Exits all Venus markets, redeems all remaining collateral (both DSA and long), and transfers everything to the caller's wallet.

After deactivation, `isActive` is set to `false` and `suppliedPrincipalVTokens` is cleared. The PositionAccount contract remains deployed — a subsequent call to `activateAndOpenPosition` increments `cycleId` and starts a fresh cycle without redeploying the clone.

When DSA ≠ long, collateral is redeemed from two separate markets. When DSA == long, a single redemption is performed with a treasury fee grossup to avoid over-redemption:

```
grossedUpAmount = ⌈amount / (1 − treasuryPercent)⌉
```

```solidity
function deactivatePosition(IVToken longVToken, IVToken shortVToken) external;
```

---

### 2. PositionAccount

A minimal proxy clone (EIP-1167) deployed per user per trading pair. It holds all collateral and debt positions in Venus and is the sole entity that enters markets and executes borrows and supplies — the RelativePositionManager never holds funds itself.

**Deployment:** Clones use `ClonesUpgradeable.cloneDeterministic` with a CREATE2 salt:

```solidity
salt = keccak256(abi.encodePacked(user, longVToken, shortVToken))
```

This makes the PositionAccount address deterministic and pre-computable via `getPositionAccountAddress()` before the account is deployed.

**Access control:** The `onlyRelativePositionManager` modifier reverts any call not originating from the single trusted RelativePositionManager address. No EOA or other contract can directly move funds out of a PositionAccount.

#### initialize

Called once when the clone is first deployed. Sets the position owner, long vToken, and short vToken for this clone, and approves both the RelativePositionManager and LeverageStrategiesManager as delegates in the Venus Comptroller.

The delegate approval is what allows the RelativePositionManager to call `Comptroller.enterMarketBehalf` and `vToken.mintBehalf` on behalf of the PositionAccount while the PositionAccount remains the on-chain owner of all collateral and debt. The RelativePositionManager and LeverageStrategiesManager addresses are set in the constructor as immutables shared across all clones.

```solidity
function initialize(address owner_, address longVToken_, address shortVToken_) external;
```

---

#### enterLeverage

Initiates the flash loan sequence to open a leveraged long position. Called by the RelativePositionManager as part of `activateAndOpenPosition` and `scalePosition`.

Internally delegates to `LeverageStrategiesManager.flashLoan(...)`, which:

1. Flash-loans `borrowedAmountToFlashLoan` of the short asset from the Comptroller's flash loan module
2. Swaps the short asset to the long asset via the SwapHelper using `swapData`
3. Supplies the resulting long tokens to the PositionAccount's long vToken position via `vToken.mintBehalf`
4. Repays the flash loan by opening a borrow on the PositionAccount's short vToken position

```solidity
function enterLeverage(
    IVToken collateralMarket,
    uint256 collateralAmountSeed,
    IVToken borrowedMarket,
    uint256 borrowedAmountToFlashLoan,
    uint256 minAmountOutAfterSwap,
    bytes calldata swapData
) external onlyRelativePositionManager;
```

---

#### exitLeverage

Initiates the flash loan sequence to close a leveraged position — redeem collateral, swap, and repay debt. Used in both `closeWithProfit` and `closeWithLoss`.

Internally delegates to `LeverageStrategiesManager.flashLoan(...)`, which:

1. Flash-loans `borrowedAmountToFlashLoan` of the short asset
2. Redeems `collateralAmountToRedeemForSwap` from the PositionAccount's collateral vToken position
3. Swaps the redeemed collateral to the short asset via the SwapHelper
4. Repays the flash loan + the original borrow debt using the swap output

```solidity
function exitLeverage(
    IVToken collateralMarket,
    uint256 collateralAmountToRedeemForSwap,
    IVToken borrowedMarket,
    uint256 borrowedAmountToFlashLoan,
    uint256 minAmountOutAfterSwap,
    bytes calldata swapData
) external onlyRelativePositionManager;
```

---

#### exitSingleAssetLeverage

Used when the DSA and the short asset are the same token (e.g., the position uses USDC as both DSA and borrow). In this case, no swap is required to repay the debt — DSA collateral is redeemed directly to cover the borrow.

```solidity
function exitSingleAssetLeverage(
    IVToken collateralMarket,
    uint256 collateralAmountToFlashLoan
) external onlyRelativePositionManager;
```

---

## Position Data Model

```solidity
struct Position {
    address user;                     // Position owner
    address longVToken;               // vToken for the long (supplied) asset
    address shortVToken;              // vToken for the short (borrowed) asset
    address positionAccount;          // Address of the PositionAccount clone
    bool isActive;                    // Whether the position is currently active
    uint8 dsaIndex;                   // Index of the DSA in the dsaVTokens registry
    address dsaVToken;                // vToken for the DSA (collateral and settlement)
    uint256 suppliedPrincipalVTokens; // DSA principal tracked in vToken units
    uint256 effectiveLeverage;        // Stored leverage in 1e18 mantissa
    uint256 cycleId;                  // Incremented each time a position is activated
}
```

**cycleId** provides a monotonically increasing identifier for each activation. This allows off-chain systems and events to distinguish between different activation cycles of the same pair without ambiguity.

**suppliedPrincipalVTokens** is updated on every principal supply, withdrawal, profit conversion, and after liquidations (synced down if the actual balance has been reduced by a liquidator).

---

## Position Lifecycle

### Stage 1: Activation and Opening

`activateAndOpenPosition()` is the entry point. It combines activation and first open into one atomic transaction.

**Activation steps:**
1. Validate that the long and short markets are listed in the Comptroller and are not the same market
2. Validate that vBNB is not used (not supported)
3. Validate that the DSA index refers to an active, registered DSA vToken
4. Validate leverage is in the range `[1e18, maxLeverage]`
5. Deploy a PositionAccount clone if one does not exist for this `(user, long, short)` triple
6. Set `isActive = true`, increment `cycleId`, record `dsaIndex`, `dsaVToken`, `effectiveLeverage`
7. Enter the DSA market on behalf of the PositionAccount via `Comptroller.enterMarketBehalf`
8. Transfer DSA from the user and mint vTokens on behalf of the PositionAccount via `vToken.mintBehalf`
9. Record `suppliedPrincipalVTokens`
10. Emit `PositionActivated` and `PrincipalSupplied`

**Opening steps (executed after activation):**
1. Calculate `maxBorrow` from available capital and clamped leverage
2. Validate `shortAmount <= maxBorrow`
3. Call `positionAccount.enterLeverage(longVToken, 0, shortVToken, shortAmount, minLongAmount, swapData)`
4. LeverageStrategiesManager flash-loans `shortAmount` of the short asset, swaps to the long asset, and mints it on the PositionAccount
5. Any dust from the swap is swept from the PositionAccount to the user's wallet
6. Emit `PositionOpened`

**Maximum leverage formula:**

$$
\text{maxLeverage} = \frac{CF_{DSA}}{1 - CF_{long} \times (1 - \text{tolerance})}
$$

Where `tolerance` is the `proportionalCloseTolerance` used as a buffer. This prevents activations that would immediately be at the boundary of the safe borrow range.

---

### Stage 2: Scaling (Adding to a Position)

`scalePosition()` adds additional exposure to an existing active position.

- Optionally supplies additional DSA principal if `additionalPrincipal > 0`
- Recalculates `maxBorrow` using the updated available capital
- Calls `positionAccount.enterLeverage(...)` for the additional amount
- Emits `PositionScaled`

The stored `effectiveLeverage` is not changed by scaling. Only `suppliedPrincipalVTokens` increases if additional principal is supplied.

---

### Stage 3: Closing

Closing is proportional. The caller specifies `closeFractionBps` (1–10000 BPS, where 10000 = 100%) and the system closes exactly that fraction of the current position.

There are two closing paths depending on whether the position is in profit or in loss.

#### Profit Close (`closeWithProfit`)

Used when the long asset value (converted to short asset) exceeds the proportional short debt.

**Validation:**

```
expectedLong = currentLongBalance × closeFractionBps / 10000
totalLong = longAmountToRedeemForRepay + longAmountToRedeemForProfit
assert |totalLong − expectedLong| ≤ expectedLong × proportionalCloseTolerance / 10000
assert minAmountOutRepay ≥ expectedShortDebt (with tolerance bump for 100% closes)
```

**Execution:**
1. Redeem `longAmountToRedeemForRepay` from the PositionAccount's long vToken position
2. Swap long → short via `positionAccount.exitLeverage()`
3. Repay `amountToRepay` of short debt
4. Redeem `longAmountToRedeemForProfit` from the long vToken position
5. Swap long → DSA and mint as DSA principal on the PositionAccount
6. Update `suppliedPrincipalVTokens` += newly minted DSA vTokens
7. Emit `PositionClosed` and `ProfitConverted`

#### Loss Close (`closeWithLoss`)

Used when the proportional long asset value is insufficient to cover the full proportional short debt.

**Two-leg repayment:**
- **Leg 1:** Redeem long collateral → swap to short → repay as much debt as possible
- **Leg 2:** Redeem DSA collateral → swap to short (or use directly if DSA == short) → repay remaining debt

**Validation:**

```
expectedLong = currentLongBalance × closeFractionBps / 10000
assert |longAmountToRedeemForFirstSwap − expectedLong| within tolerance
expectedShort = currentShortDebt × closeFractionBps / 10000
amountToRepayFirst = min(leg1Output, expectedShort)
amountToRepaySecond = expectedShort − amountToRepayFirst
assert shortDust ≤ expectedShort × proportionalCloseTolerance / 10000
```

**Execution:**
1. Leg 1: `positionAccount.exitLeverage(longVToken → shortVToken)` — redeems long collateral, swaps to short, repays debt
2. Leg 2: `positionAccount.exitLeverage(dsaVToken → shortVToken)` — or `exitSingleAssetLeverage` when DSA == short
3. Update `suppliedPrincipalVTokens` -= DSA vTokens burned in leg 2
4. Emit `PositionClosed`

---

### Stage 4: Principal Management

**`supplyPrincipal()`** — deposit additional DSA without opening a new trade. Transfers DSA from the user, mints vTokens on the PositionAccount, increments `suppliedPrincipalVTokens`.

**`withdrawPrincipal()`** — withdraw Available Capital back to the user's wallet. Validates that `amount <= withdrawableAmount` (from `getUtilizationInfo()`), redeems the corresponding DSA vTokens from the PositionAccount, and decrements `suppliedPrincipalVTokens`.

---

### Stage 5: Deactivation

`deactivatePosition()` fully exits the position account for a trading pair.

**Prerequisites:** The short debt must be fully repaid (zero borrow balance).

**Steps:**
1. Set `isActive = false`, clear `suppliedPrincipalVTokens`
2. Exit all markets and redeem all remaining collateral:
   - **DSA ≠ long:** Redeem all long vTokens, exit DSA market, redeem all DSA vTokens separately
   - **DSA == long:** Redeem all vTokens from the shared market (accounting for the treasury redemption fee grossup)
3. Transfer all redeemed underlying to the user's wallet
4. Emit `PositionDeactivated`

After deactivation, the PositionAccount contract remains deployed. A new activation (`activateAndOpenPosition`) will increment `cycleId` and start a fresh position cycle without redeploying the contract.

---

## Capital Utilization

Capital utilization determines how much of the user's DSA principal is "in use" by the open position and how much can be withdrawn or used to open new positions.

### Formula

```
// Nominal utilization: based on the stored leverage ratio
nominalCapitalUtilized = ⌈borrowValueUSD × 1e18 / clampedLeverage⌉

// Actual utilization: based on how much DSA backing is needed given long collateral
excessBorrow = max(0, borrowValueUSD − longValueUSD × CF_long)
actualCapitalUtilized =
    if CF_dsa > 0: ⌈excessBorrow × 1e18 / CF_dsa⌉
    if CF_dsa == 0 and excessBorrow > 0: suppliedPrincipalUSD  // entire principal is at risk

// Final utilization: conservative (use whichever is higher)
finalCapitalUtilized = min(suppliedPrincipalUSD, max(nominalCapitalUtilized, actualCapitalUtilized))

// Available capital
availableCapitalUSD = suppliedPrincipalUSD − finalCapitalUtilized
withdrawableAmount = availableCapitalUSD × 1e18 / dsaPrice
```

### Leverage Clamping

The stored `effectiveLeverage` is the leverage set at activation. However, if collateral factors change after activation (e.g., governance lowers a CF), the actual maximum leverage may drop below the stored value. In this case, `clampedLeverage = min(storedLeverage, currentMaxLeverage)` is used for all utilization and borrow capacity calculations.

This ensures that capital utilization reporting and borrow limits remain conservative and safe even when market parameters change post-activation.

### Two Utilization Paths

The system tracks utilization from two perspectives simultaneously:

**Nominal:** "Given the leverage ratio I agreed to, how much capital does this position conceptually consume?"
- This path uses the stored leverage and is predictable for users.

**Actual:** "Given the current value of my long collateral and short debt, how much DSA backing is actually needed to maintain the position safely?"
- This path accounts for real market prices and collateral factors.
- The long asset's CF reduces the DSA backing needed (long collateral partially covers the borrow).
- As prices diverge from the entry, this number can grow.

The **maximum of the two** is used as the final utilization, ensuring the most conservative estimate is always applied.

---

## DSA Mechanics

### DSA ≠ Long (Standard Case)

The PositionAccount holds two separate vToken positions:
- Long vTokens (from leveraged swaps)
- DSA vTokens (user's principal)

Principal tracking: `suppliedPrincipalVTokens` directly maps to the DSA vToken balance. Long collateral balance is simply `longVToken.balanceOfUnderlying(positionAccount)`.

### DSA == Long (Shared Market Case)

When the user selects a DSA that is the same token as the long asset (e.g., USDC as both DSA and long), the PositionAccount holds only **one** vToken balance that represents the sum of both.

The RelativePositionManager separates them using:

```
totalVTokens = dsaVToken.balanceOf(positionAccount)
longCollateralVTokens = totalVTokens − suppliedPrincipalVTokens
```

When `suppliedPrincipalVTokens` exceeds `totalVTokens` (which can happen if the position is partially liquidated), the system syncs `suppliedPrincipalVTokens` down to `totalVTokens` and emits `RefreshedSuppliedPrincipal`. This prevents the system from treating liquidated collateral as still available.

**Deactivation in this case** redeems from the shared market in a single call, accounting for the treasury fee grossup to avoid over-redemption:

```
grossedUpAmount = ⌈amount / (1 − treasuryPercent)⌉
```

---

## Proportional Close Tolerance

`proportionalCloseTolerance` (default 100 BPS = 1%) defines the acceptable deviation band for close amounts.

**Why it is needed:** Interest accrues continuously on the borrow position, and swap outputs are subject to slippage. The close amount derived from `closeFractionBps × currentBalance` will not match exactly by the time the transaction executes.

**Tolerance band for long amounts:**

```
lower = expectedLong × (10000 − tolerance) / 10000
upper = expectedLong × (10000 + tolerance) / 10000
assert lower ≤ totalLong ≤ upper
```

**Tolerance bump for 100% closes:**
For full closes (closeFractionBps = 10000), the repay amount is bumped by the tolerance to ensure that accumulated interest since the close was estimated does not cause a dust leftover:

```
amountToRepay = expectedShortDebt × (10000 + tolerance) / 10000
```

Any short dust remaining after the repay is validated to be within:

```
shortDust ≤ expectedShort × tolerance / 10000
```

**Governance can adjust `proportionalCloseTolerance`** via `setProportionalCloseTolerance()`. A wider tolerance allows more flexibility but reduces proportionality precision; a narrower tolerance enforces stricter accounting but may cause more reverts due to market movement between estimation and execution.

---

## Flash Loan Integration

Yield+ uses the existing `LeverageStrategiesManager` for all flash loan execution. The PositionAccount calls into the LeverageStrategiesManager which uses the Venus Comptroller's flash loan module.

### Opening a Position (`enterLeverage`)

```
positionAccount.enterLeverage(
    collateralMarket = longVToken,
    collateralAmountSeed = 0,           // DSA is the true collateral seed, not long
    borrowedMarket = shortVToken,
    borrowedAmountToFlashLoan = shortAmount,
    minAmountOutAfterSwap = minLongAmount,
    swapData = signedMulticallData
)

LeverageStrategiesManager:
  1. Flash loan shortAmount on shortVToken
  2. Swap shortAmount (short) → longAmount (long) using swapData
  3. Mint longAmount into positionAccount.longVToken position
  4. Repay flash loan from positionAccount.shortVToken (opens borrow)
```

### Closing a Position (`exitLeverage`)

```
positionAccount.exitLeverage(
    collateralMarket = longVToken,
    collateralAmountToRedeemForSwap = longAmountToRedeem,
    borrowedMarket = shortVToken,
    borrowedAmountToFlashLoan = shortAmountToRepay,
    minAmountOutAfterSwap = minAmountOutRepay,
    swapData = signedMulticallData
)

LeverageStrategiesManager:
  1. Flash loan shortAmountToRepay on shortVToken
  2. Redeem longAmountToRedeem from positionAccount.longVToken
  3. Swap longAmount (long) → shortAmount (short) using swapData
  4. Repay flash loan + original debt
```

### Same-Asset Close (`exitSingleAssetLeverage`)

When DSA == short (e.g., closing a loss using USDC as both DSA and borrow repayment), no swap is needed:

```
positionAccount.exitSingleAssetLeverage(
    collateralMarket = dsaVToken,      // same as shortVToken
    collateralAmountToFlashLoan = amountToRepay
)

LeverageStrategiesManager:
  1. Flash loan amountToRepay on dsaVToken
  2. Redeem amountToRepay from positionAccount.dsaVToken
  3. Repay flash loan + original debt (no swap)
```

---

## Liquidation

Yield+ positions are subject to the standard Venus liquidation mechanism. The PositionAccount is a regular address from the Comptroller's perspective — it enters markets, borrows, and supplies like any other account.

When the Health Factor drops below 1 (i.e., the borrow value exceeds the liquidation threshold-weighted collateral value), third-party liquidators can call `liquidateBorrow` on the appropriate vToken. This repays part of the debt and seizes a portion of the supplied collateral at a discount.

**Post-liquidation behavior:**
- If DSA == long, `suppliedPrincipalVTokens` may now exceed the actual vToken balance. The next call to `_getLongCollateralBalance` or `_getSuppliedPrincipalBalance` will detect this and emit `RefreshedSuppliedPrincipal` to sync the counter down.
- The position remains `isActive = true` after liquidation. The user can still manage (close, supply, withdraw) the reduced position.

---

## Pause Mechanism

The contract supports two pause levels:

| Pause Level | Blocked Operations | Allowed Operations |
| --- | --- | --- |
| **Partial Pause** | `activateAndOpenPosition`, `scalePosition`, `withdrawPrincipal`, `deactivatePosition` | `closeWithProfit`, `closeWithLoss`, `supplyPrincipal` |
| **Complete Pause** | All state-changing operations | None |

This design allows governance to freeze risky operations (opening new exposure, withdrawing, deactivating) while keeping defensive operations (closing, adding collateral) available during an incident.

---

## Governance and Access Control

All privileged functions are gated via the Venus `AccessControlManager`.

| Function | Permission Required | Notes |
| --- | --- | --- |
| `setPositionAccountImplementation` | Admin | One-time; locked after first call |
| `addDSAVToken` | Admin | Adds a new stablecoin to the DSA registry |
| `setDSAVTokenActive` | Admin | Enables/disables DSA for new activations |
| `setProportionalCloseTolerance` | Admin | Adjusts the close tolerance band |
| `partialPause` / `partialUnpause` | Admin | Toggles partial pause |
| `completePause` / `completeUnpause` | Admin | Toggles complete pause |
| `executePositionAccountCall` | Admin | Emergency call forwarder (e.g., asset rescue) |

**DSA management:** When a DSA is set to inactive (`setDSAVTokenActive(index, false)`), existing positions using that DSA are unaffected. Only new position activations are blocked from selecting that DSA index.

**PositionAccount implementation:** The EIP-1167 clone implementation is set once and then locked (`isPositionAccountImplementationLocked = true`). This prevents governance from changing the implementation after positions have been deployed, ensuring users' PositionAccount contracts are immutable.

---

## Security Considerations

### Access Control

- Only the RelativePositionManager can call PositionAccount methods. All external position operations are gated through this single entrypoint.
- All admin functions are controlled by the Venus `AccessControlManager`.

### Reentrancy

- `ReentrancyGuardUpgradeable` is applied to all state-changing external functions on the RelativePositionManager.

### Oracle Dependency

- All USD value calculations use the Venus `ResilientOracle`. If an oracle price is zero or stale, the relevant function reverts with `InvalidOraclePrice`.

### Flash Loan Safety

- The flash loan callback (`executeOperation`) on the LeverageStrategiesManager validates that the initiator is the LeverageStrategiesManager itself and that the caller is the Comptroller, preventing unauthorized replay.

### Proportional Close Integrity

- The tolerance band enforces that close amounts cannot deviate significantly from the intended BPS fraction. This prevents griefing attacks that would allow disproportionate collateral extraction relative to debt repayment.

### PositionAccount Immutability

- The EIP-1167 clone implementation is locked after the first call to `setPositionAccountImplementation`. This means the RelativePositionManager cannot upgrade the PositionAccount logic for existing positions after deployment.

---

## Audits

RelativePositionManager and PositionAccount were audited by CertiK and Quantstamp before mainnet deployment. Audit reports are available in the [venus-periphery repository](https://github.com/VenusProtocol/venus-periphery/tree/main/audits) and in the [Security & Audits](../../security-and-audits.md) section of the Venus documentation.
