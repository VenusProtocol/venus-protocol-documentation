# E-Mode Implementation in Venus BNB Core Pool

## Overview

The **Venus Protocol BNB Core Pool** has been enhanced with **E-Mode (Efficiency Mode)**, a feature designed to give users greater **capital efficiency** when lending and borrowing. E-Mode introduces specialized categories of **correlated assets**—such as **stablecoins** or **ETH-based tokens**—each with their own customized **risk parameters**.

When a user activates an **E-Mode category**, their borrowing is restricted to assets within that category, but with **higher collateral factors (CF)** and **liquidation thresholds (LT)** compared to the default Core Pool. A **lower liquidation incentive (LI)** is also applied, reducing the penalty at liquidation and making borrowing within E-Mode more efficient.

This allows users to unlock **more borrowing power** while keeping **risk contained** within the category.

Unlike **isolated pools**, which fully segregate assets into separate environments, E-Mode keeps everything within the Core Pool. Users do not need to transfer assets to benefit from different risk profiles. Instead, they can simply activate an E-Mode category, gaining higher efficiency for correlated assets while maintaining their existing positions. This design balances capital optimization with contained risk management, making E-Mode a powerful extension of the Core Pool.

### Key Benefits of E-Mode

* **Increased Borrowing Power**: Higher CF and LT enable users to leverage more borrowing capacity in correlated asset categories.
* **Reduced Liquidation Penalties**: Lower LI minimizes losses during volatile market conditions.
* **Seamless Integration**: No asset transfers required; all operations remain in the Core Pool.
* **Risk Isolation**: Borrowing limits prevent cross-category exposure, reducing systemic risks.
* **Governance Flexibility**: Pool parameters can be dynamically adjusted via Venus governance proposals.

### Potential Risks and Considerations

* **Borrow Restrictions**: Users must ensure existing borrows align with the target pool's allowed assets.
* **VAI Incompatibility**: Users with VAI debt cannot enter E-Mode, ensuring stablecoin-specific isolation.
* **Parameter Changes**: Governance updates (e.g., lowering CF) can impact positions without notice.
* **Fallback to Core**: Non-pool assets revert to stricter Core parameters, potentially altering liquidation priorities.

The implementation extends the **Comptroller contract** to support:

* Pool-specific risk configurations.
* User-driven category selection.
* Refined, category-based risk management.

All of this is achieved while maintaining **backward compatibility** with the Core Pool’s legacy operations.

## Comptroller Changes for E-Mode in Core Pool

The introduction of **E-Mode** in the Venus BNB Core Pool required significant enhancements to the `Comptroller` contract. These changes enable fine-grained risk management while preserving the existing Core Pool functionality. Below is a summary of the major updates:

| Change | Description | Impact |
|--------|-------------|--------|
| **Liquidation Threshold (LT) Support in Core Pool** | The Core Pool now supports **Liquidation Thresholds**, similar to isolated pools. LT allows borrowing limits (CF) and liquidation conditions (LT) to be defined separately, improving risk control. | Enables more precise liquidity calculations, separating borrow caps from liquidation triggers for better user safety. |
| **Per-Market Liquidation Incentives (LI)** | The global LI has been replaced with **per-market LIs**, enabling governance to assign asset-specific liquidation rewards based on risk. | Liquidators receive tailored incentives, optimizing protocol security and efficiency for high-risk vs. low-risk assets. |
| **Unified Pool-Market Mapping** | The existing `markets` mapping has been replaced with `_poolMarkets`, a flexible structure keyed by a new `PoolMarketId` type (`bytes32`), which uniquely identifies each pool-market pair, while maininging the backward compatibilty for existing markets getters | Supports multiple pools without storage conflicts, allowing pool-specific overrides while maintaining legacy access. |

These enhancements ensure E-Mode operates as a lightweight overlay on the Core Pool, minimizing gas costs and migration efforts.

## Implementation Details

### 1. Markets Mapping

The core data structure for tracking markets has been upgraded to handle multiple pools efficiently.

**Previously**: Address as index

```solidity
mapping(address => Market) public markets;
```

**Now**: `bytes32` as index

```solidity
type PoolMarketId is bytes32;
mapping(PoolMarketId => Market) public _poolMarkets;
```

* **Core Pool (poolId = 0)**: The `PoolMarketId` is the vToken address left-padded to 32 bytes, preserving storage layout for compatibility.
* **E-Mode Pools (poolId > 0)**: The key is constructed by combining the `poolId` (uint96, shifted left by 160 bits) with the vToken address (uint160).

This approach ensures:

* **No collisions** between pool-market pairs.
* **Pool-specific overrides** (e.g., CF/LT/LI).
* **Backward compatibility** is preserved through updated getter functions, which return Core Pool values when called with only a vToken address, while maintaining the same function signatures.

### 2. Market Struct

The `Market` struct now includes fields to support LT, per-market LI, and pool-specific borrowing rules:

```solidity
struct Market {
    bool isListed;
    uint256 collateralFactorMantissa;
    mapping(address => bool) accountMembership;
    bool isVenus;
    uint256 liquidationThresholdMantissa;
    uint256 liquidationIncentiveMantissa;
    uint96 poolId;
    bool isBorrowAllowed;
}
```

* **accountMembership**: Stored only in Core Pool entries, since borrows and collateral are tracked globally across all pools. In E-Mode entries, this mapping remains empty for structural consistency, reducing storage overhead.

* `isBorrowAllowed`: A pool-level flag that governance can toggle, overriding global borrow caps for E-Mode restrictions.

### 3. Pool Tracking

Pools are defined and managed via a dedicated mapping for metadata and asset lists:

```solidity
struct PoolData {
    string label;      // e.g., "Stablecoin E-Mode"
    address[] vTokens; // Markets in this pool
}

mapping(uint96 => PoolData) public pools;

uint96 public lastPoolId;
```

* `lastPoolId` tracks the latest assigned poolId (`0` is reserved for Core).
* Pools hold metadata and a list of associated vTokens.

**Governance Workflow**: New pools are created via `createPool(string calldata label)`, which assigns the next `poolId` and initializes the `PoolData`. This allows for easy expansion to new categories like "ETH Correlated" or "BNB Derivatives."

### 4. User Pool Selection

Each user is associated with exactly one pool at a time, simplifying state management:

```solidity
mapping(address => uint96) public userPoolId;
```

* Defaults to **0 (Core Pool)**.
* Switching updates `userPoolId` with proper validations.

This ensures all collateral and borrowing operations are evaluated within the context of the user’s active pool. **Edge Case Handling**: If a user's pool is disabled by governance, their `userPoolId` is automatically reset to 0, triggering a fallback event.

### 5. Pool Markets Configuration

Governance configures E-Mode via a suite of administrative functions:

* **Add/Remove**: `addPoolMarkets` and `removePoolMarket` manage vTokens in non-Core pools.
* **Borrow Control**: `setIsBorrowAllowed` toggles borrowing eligibility.
* **Risk Parameters**: Setters for CF, LT, and LI support poolId for E-Mode and address-only for Core.

**Example Setters**:

```solidity
// E-Mode setter
function setCollateralFactor(uint96 poolId, VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external returns (uint256);

// Core Pool setter
function setCollateralFactor(VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external returns (uint256);
```

## E-Mode: User Journey

### 1. Default State

* Every user starts in the **Core Pool (poolId = 0)**.
* Core Pool applies **standard parameters** (lower CF/LT, higher LI).
* If the user never switches pools, nothing changes—ensuring zero disruption for legacy users.

### 2. Explore Available Pools

Users can discover available E-Mode pools using:

* **Venus Lens**: By calling the `getMarketsDataByPool` function to fetch pool data directly from the Comptroller. This returns supported E-Mode pools and their vTokens along with parameters such as CF, LT, LI, and borrow permissions.
  *Note: `getMarketsDataByPool` does not return values for the Core Pool; it only returns data for other pools.*
* **Venus App UI**: A user-friendly interface that displays the same information without requiring direct blockchain queries.

### 3. Validate Compatibility

* Before switching, make sure all your borrowed assets are supported as borrowable assets in the E-Mode pool you want to enter.
* If any borrowed asset is not allowed in the target pool, the `enterPool` transaction will revert on: **hasValidPoolBorrows()** check.

### 4. Enter the Pool

* **Call**:
  enterPool(uint96 poolId)
* **Comptroller checks**:
  * Pool exists and user isn’t already in it.
  * Borrow compatibility (`hasValidPoolBorrows`).
  * **VAI check**: Users with outstanding VAI debt or active minting positions cannot switch into E-Mode.
  * **Liquidity check**: Runs `_getAccountLiquidity` with new pool’s CF/LT.
    * ❌ If shortfall > 0 (would become liquidatable), tx reverts.
* **On success**:
  * `userPoolId` updated
  * `PoolSelected` event emitted

### 5. Post-Entry Impacts

* **Borrowing**: Restricted to markets marked `isBorrowAllowed` in chosen pool.
* **Collateral**:
  * Pool assets use **pool CF/LT/LI**.
  * Non-pool assets fall back to **Core parameters** (lower CF, higher LI).
* **Liquidation**:
  * Pool assets → more efficient (lower LI).
  * Non-pool assets → liquidators prefer them due to higher LI.
* **VAI**: Minting and repayment only possible in Core Pool.

## Common Scenarios

### Borrowed Asset Not Allowed

* Example: A user has borrowed BTC and tries to enter the Stablecoin Pool.
* BTC is not part of that pool, so it is not listed as borrowable.
* Result: `enterPool` fails with `IncompatibleBorrowedAssets`.
* Even if an asset is included in a pool, governance can set `isBorrowAllowed = false`. In this case, supplying the asset as collateral is fine, but new borrows of that asset are restricted.

### Mixed Collateral

* Users can provide collateral outside of the E-Mode pool’s listed assets.
* These non-pool collaterals always use **Core Pool parameters** (normal CF, LT, LI).
* Since Core Pool liquidation incentives (LI) are typically higher, liquidators may target these assets first during liquidation.
* Example: In Stablecoin Pool, a user supplies USDC + SXP.
  * USDC → CF/LT/LI from E-Mode (e.g., LI = 5%)
  * SXP → CF/LT/LI from Core Pool (e.g., LI = 10%)
  * If liquidation occurs, SXP will likely be seized first because it gives the liquidator higher profit.

### Switching Back to Core

* Switching back is allowed only if the account remains healthy under Core Pool’s stricter parameters.
* Example: In Stablecoin Pool, a user is safe with CF = 0.90. Switching back to Core Pool with CF = 0.60 may immediately create a shortfall → reverts with `LiquidityCheckFailed`.
* **Important scenario**:
  * If a user is close to liquidation in Core Pool, they may switch into an E-Mode pool (with higher CF/LT) to immediately improve their account health and avoid liquidation.
  * However, if they attempt to switch back to Core, the stricter parameters would again make them liquidatable, so the transaction reverts.
* This ensures users cannot bypass liquidation risk by cycling between pools.

### Governance Changes

Governance has significant control over pool configurations, which can directly affect user positions:

1. **Borrow Restrictions:**
   * Governance can set `isBorrowAllowed = false` for a market.
   * Existing borrows remain, but new borrows are blocked.
   * This behaves similarly to setting the borrow cap to 0 in the Core Pool.
   * When borrow cap set to 0, no additional borrows are possible, but existing borrows are unaffected.

2. **Market Removal from E-Mode:**
   * If governance removes a market from an E-Mode pool, the market’s risk factors instantly revert to its Core Pool values.
   * This is effectively the same as updating CF, LT, or LI parameters via a VIP.
   * Users need to monitor VIP proposals to anticipate changes.

3. **Disabling an E-Mode Pool:**
   * Governance can disable an entire E-Mode pool.
   * In that case, all users currently in the pool automatically fall back to Core Pool parameters.

**Rule of Risk Factor Selection:**

* If a parameter (CF, LT, LI) is defined in the active E-Mode pool, that value is used.
* If governance sets a value to `0` in the pool (e.g., CF = 0), the `0` applies — it does not fall back to Core.
* Fallback to Core Pool happens only in two cases:
  1. The pool is disabled.
  2. The asset is not included in the E-Mode pool.

## Effect on User on Switching Into E-Mode

To see how E-Mode changes borrowing power, liquidation, and borrow restrictions, let’s follow a single user journey. This example uses hypothetical parameters to illustrate key mechanics.

### Pool Setup

| Asset | Core Pool CF | Core Pool LT | Core Pool LI | E-Mode CF | E-Mode LT | E-Mode LI | E-Mode Borrow Allowed? |
|-------|--------------|--------------|--------------|-----------|-----------|-----------|------------------------|
| **USDC** | 60% | 65% | 10% | 90% | 93% | 5% | Yes |
| **DAI** | 60% | 65% | 10% | 90% | 93% | 5% | No |
| **SXP** | 50% | 55% | 12% | N/A (Fallback to Core) | N/A | N/A | N/A |

### Step 1: Alex in Core Pool

* Supplies: **$1,000 USDC**
* Borrows: **$500 DAI**

**Liquidity Calculation**:
$$
\text{Borrow Limit} = 1000 \times 0.6 = 600
$$
$$
\text{Liquidity} = \text{Borrow Limit} - \text{Total Borrow} = 600 - 500 = 100
$$
$$
\text{Shortfall} = 0 \quad (\text{since liquidity ≥ 0})
$$

* **Liquidity = $100, Shortfall = $0 → safe**

### Step 2: Attempting to Enter Stablecoin E-Mode

Alex wants to switch to the Stablecoin Pool.

* Borrowed DAI is **not allowed** in the target pool (`isBorrowAllowed = false`).
* Comptroller checks fail → transaction **reverts** with `IncompatibleBorrowedAssets`.

> This demonstrates **borrow restrictions in E-Mode**: existing borrows in disallowed markets prevent entering the pool.

### Step 3: Adjusting Position and Entering

* Alex repays $500 DAI → no active borrows.
* Calls `enterPool(stablecoinPoolId)` → succeeds.

**Liquidity Calculation in E-Mode**:
$$
\text{Borrow Limit} = 1000 \times 0.9 = 900
$$
$$
\text{Liquidity} = 900 - 0 = 900
$$
$$
\text{Shortfall} = 0 \quad (\text{safe})
$$

**Effect of E-Mode Activation**:

* **Collateral Factor (CF)** for USDC increases from 60% → 90%

* **Liquidation Incentive (LI)** for USDC decreases from 10% → 5%

* Can borrow USDC (allowed), but **cannot borrow DAI** (isBorrowAllowed = false).

### Step 4: Borrowing in E-Mode

* Alex borrows **$500 USDC**
* Borrowing **DAI fails** (restricted by pool-level `isBorrowAllowed`)

**Liquidity Calculation after borrow**:
$$
\text{Borrow Limit} = 1000 \times 0.9 = 900
$$
$$
\text{Liquidity} = 900 - 500 = 400
$$
$$
\text{Shortfall} = 0 \quad (\text{safe})
$$

### Step 5: Switching Back to Core

Suppose Alex borrowed up to **$850 USDC** in E-Mode.

**Core Pool Borrow Limit**:
$$
\text{Borrow Limit} = 1000 \times 0.6 = 600
$$
$$
\text{Liquidity} = 600 - 850 = -250
$$
$$
\text{Shortfall} = 250 \quad (\text{tx reverts})
$$

To switch safely, Alex can either:

1. **Add collateral** → $500 more USDC → new Core borrow limit = 1500 × 0.6 = 900 → liquidity = 900 - 850 = 50 → switch succeeds.
2. **Repay debt** → reduce borrow ≤ $600 → liquidity ≥ 0 → switch succeeds.

## Liquidator Considerations in E-Mode

The introduction of **E-Mode in the BNB Core Pool** also changes how liquidators must evaluate accounts and select assets for liquidation. To remain effective and profitable, liquidators need to adapt to the updated mechanics and new getter functions.

### 1. Per-Market Liquidation Incentives (LI)

* The Core Pool no longer uses a **global LI**.
* Each market now has its own **per-market liquidation incentive**, configurable by governance.
* **Impact**: Liquidators must always query the market’s specific LI before deciding which collateral to seize, since incentives may differ significantly between assets.
* **Strategy**: Prioritize assets with higher LI when selecting which collateral to liquidate for maximum profit.

### 2. Liquidation Thresholds (LT) in Core Pool

* The Core Pool now supports **Liquidation Thresholds (LT)**, just like isolated pools.
* Unlike **Collateral Factors (CF)**, which only define borrow limits, **LT determines liquidation conditions**.
* **Impact**: Liquidators must check account health against LT rather than CF.
* **Recommended Function**:
  ```solidity
  function getAccountLiquidity(address account) external view returns (uint256, uint256, uint256);
  ```
  This function has been updated to use LT internally when computing liquidity and shortfall.

### 3. Effective Risk Factor Queries

Because E-Mode overrides Core parameters with pool-specific ones, the protocol provides new getters to return the **effective factors** for any user and market.

* **Get Effective LTV (Collateral Factor or LT depending on weighting):**

  ```solidity
  enum WeightFunction {
      USE_COLLATERAL_FACTOR,        // 0
      USE_LIQUIDATION_THRESHOLD     // 1
  }

  function getEffectiveLtvFactor(
      address account,
      address vToken,
      WeightFunction weightingStrategy
  ) external view returns (uint256);
  ```

  * Use `weightingStrategy = 0` to fetch the **effective CF**.
  * Use `weightingStrategy = 1` to fetch the **effective LT**.

* **Get Effective Liquidation Incentive (LI):**

  ```solidity
  function getEffectiveLiquidationIncentive(
      address account,
      address vToken
  ) external view returns (uint256);
  ```

---

### TL;DR: E-Mode in Venus BNB Core Pool

**Efficiency Boost**: E-Mode lets you use **higher Collateral Factors (CF)** and **Liquidation Thresholds (LT)**, plus **lower Liquidation Incentives (LI)**, for similar assets (e.g., stablecoins).

**Borrow Limits**: You can only borrow from pool-approved assets (`isBorrowAllowed = true`). If you have borrows in non-approved assets, you can't enter; new borrows are blocked to keep risks isolated.

**How Risk Factors Are Chosen**:

* **In E-Mode Pool**: Use the pool's CF/LT/LI values (even if set to 0).
* **Fallback to Core Pool**: If the asset isn't in your pool or the pool is disabled.
* **Mixed Assets**: Assets in the selected E-Mode pool benefit from higher CF and LT, while assets outside remain on normal Core Pool values. Compared to E-Mode assets, these non–E-Mode assets have lower risk factors and higher LI, making them more attractive for liquidators.

**Liquidator Notes**:

* Core Pool now uses **per-market LI** (no global incentive). Always fetch per-asset LI before liquidating.
* **Liquidation Threshold (LT)** replaces CF as the trigger for liquidations—use `getAccountLiquidity` for checks.
* Use new getters to fetch **effective parameters** considering pool overrides:

  * `getEffectiveLtvFactor(account, vToken, 0)` → effective CF
  * `getEffectiveLtvFactor(account, vToken, 1)` → effective LT
  * `getEffectiveLiquidationIncentive(account, vToken)` → effective LI

---