# Yield+

[Venus Yield+](../reference-technical-articles/yield-plus.md) is a relative performance trading product built on Venus Protocol's lending infrastructure. It allows users to express a view that one asset will outperform another, packaged into a single managed position with automated execution, proportional closing, and built-in yield generation.

For architecture details and implementation walkthrough, see the [Yield+ Technical Article](../reference-technical-articles/yield-plus.md).

# Solidity API

### COMPTROLLER

The Venus comptroller contract

```solidity
contract IComptroller COMPTROLLER
```

---

### LEVERAGE_MANAGER

The leverage strategies manager contract

```solidity
contract LeverageStrategiesManager LEVERAGE_MANAGER
```

---

### proportionalCloseTolerance

Tolerance for proportional close (in basis points): 100 = 1% margin of error (governance-controlled)

```solidity
uint256 proportionalCloseTolerance
```

---

### POSITION_ACCOUNT_IMPLEMENTATION

Implementation contract for PositionAccount clones (settable via governance, can only be set once)

```solidity
address POSITION_ACCOUNT_IMPLEMENTATION
```

---

### isPositionAccountImplementationLocked

Lock flag to prevent changing POSITION_ACCOUNT_IMPLEMENTATION after it's set

```solidity
bool isPositionAccountImplementationLocked
```

---

### dsaVTokenIndexCounter

Counter / next index for newly added DSA vTokens (also equals current count)

```solidity
uint8 dsaVTokenIndexCounter
```

---

### isPartiallyPaused

Whether the contract is partially paused (blocks open, scale, withdraw, deactivate but allows close and supply)

```solidity
bool isPartiallyPaused
```

---

### isCompletelyPaused

Whether the contract is completely paused (blocks all state-changing user operations)

```solidity
bool isCompletelyPaused
```

---

### dsaVTokens

Mapping from DSA index to supported DSA (Default Settlement Asset) vToken markets

```solidity
mapping(uint8 => address) dsaVTokens
```

---

### isDsaVTokenActive

Tracks whether a given DSA vToken is currently active for new activations

```solidity
mapping(address => bool) isDsaVTokenActive
```

---

### positions

Mapping from user => longAsset => shortAsset => Position data

```solidity
mapping(address => mapping(address => mapping(address => struct IRelativePositionManager.Position))) positions
```

---

### constructor

Contract constructor

```solidity
constructor(address comptroller, address leverageManager) public
```

#### Parameters

| Name            | Type    | Description                                                                                   |
| --------------- | ------- | --------------------------------------------------------------------------------------------- |
| comptroller     | address | The Venus Comptroller contract address                                                        |
| leverageManager | address | The LeverageStrategiesManager contract address (provides swap helper for enter/exit leverage) |

---

### initialize

Initializes the upgradeable contract

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                                    |
| ---------------------- | ------- | ---------------------------------------------- |
| accessControlManager\_ | address | Address of the Access Control Manager contract |

---

### partialPause

Partially pauses the manager — blocks risk-increasing operations (open, scale, withdraw, deactivate)
while allowing defensive operations (close, supply principal).

```solidity
function partialPause() external
```

---

### partialUnpause

Removes partial pause, re-enabling risk operations (unless completely paused).

```solidity
function partialUnpause() external
```

---

### completePause

Completely pauses all state-changing user operations on the manager

```solidity
function completePause() external
```

---

### completeUnpause

Removes complete pause, re-enabling all operations (unless partially paused).

```solidity
function completeUnpause() external
```

---

### setPositionAccountImplementation

Sets the implementation contract used for PositionAccount clones (can be set only once)

```solidity
function setPositionAccountImplementation(address positionAccountImpl) external
```

#### Parameters

| Name                | Type    | Description                                                 |
| ------------------- | ------- | ----------------------------------------------------------- |
| positionAccountImpl | address | Implementation contract for PositionAccount EIP-1167 clones |

#### 📅 Events

- Emits PositionAccountImplementationSet event.

#### ❌ Errors

- Throw ZeroAddress if positionAccountImpl is zero.
- Throw PositionAccountImplementationLocked if already set.

---

### setProportionalCloseTolerance

Sets the proportional close tolerance (in basis points)

```solidity
function setProportionalCloseTolerance(uint256 newTolerance) external
```

#### Parameters

| Name         | Type    | Description                         |
| ------------ | ------- | ----------------------------------- |
| newTolerance | uint256 | New tolerance value in basis points |

#### 📅 Events

- Emits ProportionalCloseToleranceUpdated event.

#### ❌ Errors

- Throw InvalidProportionalCloseTolerance if tolerance is outside [1, 10000].
- Throw SameProportionalCloseTolerance if tolerance is unchanged.

---

### addDSAVToken

Adds a new DSA vToken to the supported list

```solidity
function addDSAVToken(address dsaVToken) external
```

#### Parameters

| Name      | Type    | Description                                         |
| --------- | ------- | --------------------------------------------------- |
| dsaVToken | address | The vToken market address to add as a supported DSA |

#### 📅 Events

- Emits DSAVTokenAdded event.

#### ❌ Errors

- Throw ZeroAddress if dsaVToken is zero.
- Throw AssetNotListed if the market is not listed in the Comptroller.
- Throw DSAVTokenAlreadyAdded if the DSA vToken is already configured.

---

### setDSAVTokenActive

Updates the active flag for a configured DSA vToken, controlling whether it can be used for new activations

```solidity
function setDSAVTokenActive(uint8 dsaIndex, bool active) external
```

#### Parameters

| Name     | Type  | Description                                                          |
| -------- | ----- | -------------------------------------------------------------------- |
| dsaIndex | uint8 | Index of the DSA vToken in the internal mapping                      |
| active   | bool  | New active flag (true to allow new activations, false to block them) |

#### 📅 Events

- Emits DSAVTokenActiveUpdated when the active flag is changed.

#### ❌ Errors

- Throw InvalidDSA if the index or stored address is invalid.
- Throw SameDSAActiveStatus when called with the current active flag.

---

### executePositionAccountCall

Executes multiple generic calls on behalf of a position account

```solidity
function executePositionAccountCall(address positionAccount, address[] targets, bytes[] data) external
```

#### Parameters

| Name            | Type      | Description                         |
| --------------- | --------- | ----------------------------------- |
| positionAccount | address   | Address of the position account     |
| targets         | address[] | Array of target contract addresses  |
| data            | bytes[]   | Array of encoded function call data |

---

### activateAndOpenPosition

Opens a leveraged position for the first time (combines activation + opening in one call)

```solidity
function activateAndOpenPosition(address longVToken, address shortVToken, uint8 dsaIndex, uint256 initialPrincipal, uint256 effectiveLeverage, uint256 shortAmount, uint256 minLongAmount, bytes swapData) external
```

#### Parameters

| Name              | Type    | Description                                                                         |
| ----------------- | ------- | ----------------------------------------------------------------------------------- |
| longVToken        | address | The vToken market address for the asset to long                                     |
| shortVToken       | address | The vToken market address for the asset to short                                    |
| dsaIndex          | uint8   | Index of the DSA vToken in the dsaVTokens array                                     |
| initialPrincipal  | uint256 | Required initial principal amount to supply during activation (must be > 0)         |
| effectiveLeverage | uint256 | The target leverage ratio for this position (in mantissa, e.g., 2e18 = 2x leverage) |
| shortAmount       | uint256 | Amount to borrow in shortAsset terms                                                |
| minLongAmount     | uint256 | Minimum amount of long asset expected from swap                                     |
| swapData          | bytes   | Swap instructions for converting shortAsset to longAsset                            |

#### 📅 Events

- Emits PositionAccountDeployed (if new account), PositionActivated, PrincipalSupplied, and PositionOpened.

#### ❌ Errors

- Throw InsufficientPrincipal if initialPrincipal is zero.
- Throw ZeroAddress if longVToken or shortVToken is zero.
- Throw SameMarketNotAllowed if long and short vTokens are identical.
- Throw AssetNotListed if a market is not listed.
- Throw InvalidDSA if dsaIndex is not Valid, or DSAInactive if the DSA is inactive.
- Throw InvalidLeverage if effectiveLeverage is out of range.
- Throw PositionAlreadyExists if the position is already active.
- Throw EnterMarketFailed if entering the DSA market on behalf fails.
- Throw MintBehalfFailed if minting initialPrincipal fails.
- Throw ZeroVTokensMinted if initialPrincipal rounds down to 0 vTokens due to exchange rate.
- Throw ZeroShortAmount if shortAmount is zero.
- Throw InvalidOraclePrice if pricing data is unavailable while computing borrow limits.
- Throw BorrowAmountExceedsMaximum if shortAmount exceeds max allowed borrow.

---

### scalePosition

Scales an existing position by adding additional leverage (borrow + swap to long)

```solidity
function scalePosition(contract IVToken longVToken, contract IVToken shortVToken, uint256 additionalPrincipal, uint256 shortAmount, uint256 minLongAmount, bytes swapData) external
```

#### Parameters

| Name                | Type             | Description                                                                  |
| ------------------- | ---------------- | ---------------------------------------------------------------------------- |
| longVToken          | contract IVToken | The vToken market for the asset to long                                      |
| shortVToken         | contract IVToken | The vToken market for the asset to short                                     |
| additionalPrincipal | uint256          | Additional principal to supply this call (0 if none)                         |
| shortAmount         | uint256          | Amount to borrow in shortAsset terms (must not exceed max calculated borrow) |
| minLongAmount       | uint256          | Minimum amount of long asset expected from swap (protects against slippage)  |
| swapData            | bytes            | Swap instructions for converting shortAsset to longAsset                     |

#### 📅 Events

- Emits PositionScaled event (and PrincipalSupplied if additionalPrincipal > 0).

#### ❌ Errors

- Throw ZeroShortAmount if shortAmount is zero.
- Throw PositionNotActive if the position is not active.
- Throw MintBehalfFailed if additionalPrincipal minting on behalf fails.
- Throw ZeroVTokensMinted if additionalPrincipal rounds down to 0 vTokens if Minted.
- Throw InvalidOraclePrice if pricing data is unavailable while computing borrow limits.
- Throw BorrowAmountExceedsMaximum if shortAmount exceeds max allowed borrow.

---

### supplyPrincipal

Supplies additional principal to an active position

```solidity
function supplyPrincipal(address longVToken, address shortVToken, uint256 amount) external
```

#### Parameters

| Name        | Type    | Description                                                                         |
| ----------- | ------- | ----------------------------------------------------------------------------------- |
| longVToken  | address | The vToken market address for the long asset                                        |
| shortVToken | address | The vToken market address for the short asset                                       |
| amount      | uint256 | Amount of DSA underlying to supply (must be large enough to mint at least 1 vToken) |

#### 📅 Events

- Emits PrincipalSupplied event.

#### ❌ Errors

- Throw ZeroAmount if amount is zero.
- Throw PositionNotActive if the position is not active.
- Throw MintBehalfFailed if minting supplied principal on behalf fails.
- Throw ZeroVTokensMinted if supplied amount rounds down to 0 vTokens Minted.

---

### closeWithProfit

Closes a position proportionally; can realize profit on the closed slice (partial or full).
If treasuryPercent is enabled, the LM redeems more than the requested long amount on behalf
of the position account to cover the fee; callers should reduce redeem amounts accordingly
to avoid exceeding the available collateral bucket and causing a revert.

```solidity
function closeWithProfit(contract IVToken longVToken, contract IVToken shortVToken, uint256 closeFractionBps, uint256 longAmountToRedeemForRepay, uint256 minAmountOutRepay, bytes swapDataRepay, uint256 longAmountToRedeemForProfit, uint256 minAmountOutProfit, bytes swapDataProfit) external
```

#### Parameters

| Name                        | Type             | Description                                                                                                                                                                               |
| --------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| longVToken                  | contract IVToken | The vToken market for the long asset                                                                                                                                                      |
| shortVToken                 | contract IVToken | The vToken market for the short asset                                                                                                                                                     |
| closeFractionBps            | uint256          | Proportion to close in basis points (10000 = 100%, 1 = 0.01% minimum)                                                                                                                     |
| longAmountToRedeemForRepay  | uint256          | Amount of long to redeem for the repay leg (validated against BPS)                                                                                                                        |
| minAmountOutRepay           | uint256          | Minimum short Amount expected from repay swap; must be >= required repay amount for the given BPS. Should Include flash-loan fees and (for 100% close) include internal tolerance buffer. |
| swapDataRepay               | bytes            | Swap #1: long → short for debt repayment                                                                                                                                                  |
| longAmountToRedeemForProfit | uint256          | Amount of long to redeem and swap long→DSA as profit (can be non-zero for partial or full close)                                                                                          |
| minAmountOutProfit          | uint256          | Minimum DSA out from the profit swap used for slippage protection                                                                                                                         |
| swapDataProfit              | bytes            | Swap #2: long → DSA for profit realization                                                                                                                                                |

#### 📅 Events

- Emits ProfitConverted event.
- Emits PositionClosed event. When DSA == Long, PositionClosed.longDustRedeemed is reclassified back
  as principal vTokens rather than transferred.

#### ❌ Errors

- Throw PositionNotActive if the position is not active.
- Throw InvalidCloseFractionBps if closeFractionBps is not between 1 and 10000.
- Throw InvalidLongAmountToRedeem if total long to redeem is invalid for the chosen BPS.
- Throw MinAmountOutRepayBelowDebt if minAmountOutRepay is below the calculated short debt for this close.
- Throw ProportionalCloseAmountOutOfTolerance if total long amounts are not within the tolerated BPS band.
- Throw RedeemBehalfFailed if redeem on behalf (profit leg or full-close dust) fails.
- Throw TokenSwapCallFailed if the profit swap helper call fails.
- Throw SlippageExceeded if profit swap output is below minAmountOutProfit.
- Throw MintBehalfFailed if minting converted profit as principal fails.
- Throw ZeroVTokensMinted if profit swap output rounds down to 0 vTokens if Minted.
- Throw PositionNotFullyClosed if 100% close is used but short debt remains (e.g. exitLeverage did not repay fully).

---

### closeWithLoss

Closes a position with loss proportionally (BPS-based, same pattern as closeWithProfit).
If treasuryPercent is enabled, the LM redeems more than the requested DSA amount on behalf
of the position account to cover the fee.

**Implementation notes:**
- **First exit (long → short):** long/short amounts are derived from BPS; the user passes shortAmountToRepayForFirstSwap,
  which is validated to be within [0, expectedShort] and minAmountOutFirst must be >= shortAmountToRepayForFirstSwap.
  For 100% close with one leg, shortAmountToRepayForFirstSwap should be slightly higher to cover the internal tolerance bump.
- **Second exit (DSA → short):** the second repay amount is calculated as expectedShort - shortAmountToRepayForFirstSwap
  (and bumped for 100% close when > 0). minAmountOutSecond must be >= the calculated second repay (slippage protection;
  and should cover the bump but exact match not required).
- **Single-leg scenarios:** this function also supports cases where only one leg (long or DSA) is available
  (e.g. after liquidation), by allowing either the first or second exit to be effectively skipped.
- **Principal handling:** Unused DSA principal stays on the position account. withdrawPrincipal withdraws up to
  the withdrawable amount; deactivatePosition redeems all remaining DSA and sends it to the user.

```solidity
function closeWithLoss(contract IVToken longVToken, contract IVToken shortVToken, uint256 closeFractionBps, uint256 longAmountToRedeemForFirstSwap, uint256 shortAmountToRepayForFirstSwap, uint256 minAmountOutFirst, bytes swapDataFirst, uint256 dsaAmountToRedeemForSecondSwap, uint256 minAmountOutSecond, bytes swapDataSecond) external
```

#### Parameters

| Name                           | Type             | Description                                                                                                                                                                              |
| ------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| longVToken                     | contract IVToken | The vToken market for the long asset                                                                                                                                                     |
| shortVToken                    | contract IVToken | The vToken market for the short asset                                                                                                                                                    |
| closeFractionBps               | uint256          | Proportion to close in basis points (10000 = 100%, 1 = 0.01% minimum)                                                                                                                    |
| longAmountToRedeemForFirstSwap | uint256          | Long amount to redeem for the first swap (validated against BPS within 1% tolerance)                                                                                                     |
| shortAmountToRepayForFirstSwap | uint256          | Short amount to repay in the first exit (validated: 0 <= value <= BPS-derived expected short)                                                                                            |
| minAmountOutFirst              | uint256          | Min short Amount expected from first swap; must be >= shortAmountToRepayForFirstSwap. Should Include flash-loan fees and for 100% close with one leg, include internal tolerance buffer. |
| swapDataFirst                  | bytes            | Swap #1 calldata: long/DSA → short for the first repay leg                                                                                                                               |
| dsaAmountToRedeemForSecondSwap | uint256          | DSA amount to redeem and use as input for the second repay swap                                                                                                                          |
| minAmountOutSecond             | uint256          | Minimum short Amount expected from second swap; must be >= internally calculated second repay amount. Should Include flash-loan fees and (for 100% close) internal tolerance buffer.     |
| swapDataSecond                 | bytes            | Swap #2 calldata: DSA → short for the second repay leg                                                                                                                                   |

#### 📅 Events

- Emits PositionClosed event. When DSA == Long, PositionClosed.longDustRedeemed is reclassified
-               back as principal vTokens rather than transferred.

#### ❌ Errors

- Throw PositionNotActive if the position is not active.
- Throw ZeroDebt if there is no short debt to close.
- Throw InvalidCloseFractionBps if closeFractionBps is not between 1 and 10000.
- Throw MinAmountOutRepayBelowDebt if minAmountOutFirst is below shortAmountToRepayForFirstSwap.
- Throw ProportionalCloseAmountOutOfTolerance if first-exit amounts are not within the tolerated BPS band.
- Throw MinAmountOutSecondBelowDebt if minAmountOutSecond is below the internally calculated second repay.
- Throw InsufficientWithdrawableAmount if either leg's effective amount (after treasury grossup) exceeds its bucket in the shared pool (DSA==long only).
- Throw RedeemBehalfFailed if redeeming long or DSA vTokens on behalf fails.
- Throw TokenSwapCallFailed if a swap helper call fails, or SlippageExceeded if swap output is too low.
- Throw ExcessiveShortDust if short token dust after both exit legs exceeds proportional tolerance.

---

### closeWithProfitAndDeactivate

Fully closes a profitable position and deactivates it in a single atomic transaction.

```solidity
function closeWithProfitAndDeactivate(contract IVToken longVToken, contract IVToken shortVToken, struct IRelativePositionManager.CloseWithProfitParams profitSwapParams) external
```

#### Parameters

| Name             | Type                                                  | Description                                             |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| longVToken       | contract IVToken                                      | The vToken market for the long asset                    |
| shortVToken      | contract IVToken                                      | The vToken market for the short asset                   |
| profitSwapParams | struct IRelativePositionManager.CloseWithProfitParams | CloseWithProfitParams struct containing swap parameters |

---

### closeWithLossAndDeactivate

Fully closes a position at a loss and deactivates it in a single atomic transaction.

```solidity
function closeWithLossAndDeactivate(contract IVToken longVToken, contract IVToken shortVToken, struct IRelativePositionManager.CloseWithLossParams lossSwapParams) external
```

#### Parameters

| Name           | Type                                                | Description                                           |
| -------------- | --------------------------------------------------- | ----------------------------------------------------- |
| longVToken     | contract IVToken                                    | The vToken market for the long asset                  |
| shortVToken    | contract IVToken                                    | The vToken market for the short asset                 |
| lossSwapParams | struct IRelativePositionManager.CloseWithLossParams | CloseWithLossParams struct containing swap parameters |

---

### deactivatePosition

Deactivates a position account

```solidity
function deactivatePosition(contract IVToken longVToken, contract IVToken shortVToken) external
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### 📅 Events

- Emits PositionDeactivated event.

#### ❌ Errors

- Throw PositionNotActive if the position is not active.
- Throw PositionNotFullyClosed if short debt remains.

---

### withdrawPrincipal

Withdraws principal from an active position, subject to utilization constraints

```solidity
function withdrawPrincipal(contract IVToken longVToken, contract IVToken shortVToken, uint256 amount) external
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |
| amount      | uint256          | Amount to withdraw                    |

#### 📅 Events

- Emits PrincipalWithdrawn event when principal is withdrawn.

#### ❌ Errors

- Throw PositionNotActive if the position is not active.
- Throw ZeroAmount if amount is zero.
- Throw InsufficientWithdrawableAmount if amount exceeds withdrawable principal.
- Throw RedeemBehalfFailed if redeem fails.

---

### getPositionAccountAddress

Returns the address at which the PositionAccount would be deployed for the given user and markets

```solidity
function getPositionAccountAddress(address user, contract IVToken longVToken, contract IVToken shortVToken) external view returns (address predicted)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | User address                          |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name      | Type    | Description                                                                                                  |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| predicted | address | The predicted PositionAccount address (same as deployed by activateAndOpenPosition for that user/long/short) |

#### ❌ Errors

- Throw PositionAccountImplementationNotSet if implementation is not configured.

---

### getDsaVTokens

Returns the full list of configured DSA vToken markets

```solidity
function getDsaVTokens() external view returns (address[] dsaVTokensList)
```

#### Return Values

| Name           | Type      | Description                   |
| -------------- | --------- | ----------------------------- |
| dsaVTokensList | address[] | Array of DSA vToken addresses |

---

### getPosition

Returns the position data for a user and asset pair

```solidity
function getPosition(address user, contract IVToken longVToken, contract IVToken shortVToken) external view returns (struct IRelativePositionManager.Position position)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | User address                          |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name     | Type                                     | Description         |
| -------- | ---------------------------------------- | ------------------- |
| position | struct IRelativePositionManager.Position | The Position struct |

---

### getUtilizationInfo

Calculates capital utilization for a position

```solidity
function getUtilizationInfo(address user, contract IVToken longVToken, contract IVToken shortVToken) external returns (struct IRelativePositionManager.UtilizationInfo utilization)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | User address                          |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name        | Type                                            | Description                                                                 |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| utilization | struct IRelativePositionManager.UtilizationInfo | Utilization information including available capital and withdrawable amount |

---

### getAvailableShortCapacity

Returns the remaining short borrow capacity for a position under current market conditions

```solidity
function getAvailableShortCapacity(address user, contract IVToken longVToken, contract IVToken shortVToken) external returns (uint256 availableCapacity)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | User address                          |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name              | Type    | Description                                    |
| ----------------- | ------- | ---------------------------------------------- |
| availableCapacity | uint256 | Remaining borrow capacity in short asset terms |

---

### getMaxLeverageAllowed

Returns the maximum allowed leverage for a given DSA/long market pair based on current collateral factors

```solidity
function getMaxLeverageAllowed(contract IVToken dsaVToken, address longVToken) external view returns (uint256 maxLeverage)
```

#### Parameters

| Name       | Type             | Description                                                   |
| ---------- | ---------------- | ------------------------------------------------------------- |
| dsaVToken  | contract IVToken | The DSA vToken market (CF_dsa used as collateral)             |
| longVToken | address          | The long asset vToken market (CF_long used as hedge coverage) |

#### Return Values

| Name        | Type    | Description                                |
| ----------- | ------- | ------------------------------------------ |
| maxLeverage | uint256 | The maximum leverage ratio (1e18 mantissa) |

---

### getLongCollateralBalance

Returns the actual long collateral balance in underlying for a given user/position,
excluding DSA principal when the DSA and long assets share the same vToken market.

```solidity
function getLongCollateralBalance(address user, contract IVToken longVToken, contract IVToken shortVToken) external returns (uint256 longBalance)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | The position owner                    |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name        | Type    | Description                                                                             |
| ----------- | ------- | --------------------------------------------------------------------------------------- |
| longBalance | uint256 | The long collateral balance in underlying units (principal excluded when shared market) |

---

### getSuppliedPrincipalBalance

Returns the supplied principal balance in underlying units for a given user/position

```solidity
function getSuppliedPrincipalBalance(address user, contract IVToken longVToken, contract IVToken shortVToken) external returns (uint256 balance)
```

#### Parameters

| Name        | Type             | Description                           |
| ----------- | ---------------- | ------------------------------------- |
| user        | address          | The position owner                    |
| longVToken  | contract IVToken | The vToken market for the long asset  |
| shortVToken | contract IVToken | The vToken market for the short asset |

#### Return Values

| Name    | Type    | Description                                |
| ------- | ------- | ------------------------------------------ |
| balance | uint256 | The supplied principal in underlying units |

---

# PositionAccount

Minimal proxy contract that holds user funds for isolated Relative Trading positions

# Solidity API

### COMPTROLLER

Address of the Venus Comptroller (same for all clones)

```solidity
contract IComptroller COMPTROLLER
```

---

### RELATIVE_POSITION_MANAGER

Address of the authorized RelativePositionManager contract (same for all clones)

```solidity
address RELATIVE_POSITION_MANAGER
```

---

### LEVERAGE_MANAGER

Address of the LeverageStrategiesManager contract (same for all clones)

```solidity
address LEVERAGE_MANAGER
```

---

### owner

Address of the position account owner (different for each clone)

```solidity
address owner
```

---

### longVToken

Address of the long vToken for this position

```solidity
address longVToken
```

---

### shortVToken

Address of the short vToken for this position

```solidity
address shortVToken
```

---

### constructor

Constructor for the PositionAccount implementation contract

```solidity
constructor(contract IComptroller comptroller_, address relativePositionManager_, address leverageManager_) public
```

#### Parameters

| Name                      | Type                  | Description                                       |
| ------------------------- | --------------------- | ------------------------------------------------- |
| comptroller\_             | contract IComptroller | The Venus comptroller contract address            |
| relativePositionManager\_ | address               | Address of the RelativePositionManager contract   |
| leverageManager\_         | address               | Address of the LeverageStrategiesManager contract |

#### ❌ Errors

- ZeroAddress if any of the addresses is zero.

---

### initialize

Initializes a new position account clone

```solidity
function initialize(address owner_, address longVToken_, address shortVToken_) external
```

#### Parameters

| Name          | Type    | Description                           |
| ------------- | ------- | ------------------------------------- |
| owner\_       | address | Address of the position account owner |
| longVToken\_  | address | Address of the long market vToken     |
| shortVToken\_ | address | Address of the short market vToken    |

#### ❌ Errors

- ZeroAddress if any of the addresses is zero.

---

### enterLeverage

Forwards enterLeverage to the LeverageStrategiesManager on behalf of this position account

```solidity
function enterLeverage(contract IVToken collateralMarket, uint256 collateralAmountSeed, contract IVToken borrowedMarket, uint256 borrowedAmountToFlashLoan, uint256 minAmountOutAfterSwap, bytes swapData) external
```

#### Parameters

| Name                      | Type             | Description                                             |
| ------------------------- | ---------------- | ------------------------------------------------------- |
| collateralMarket          | contract IVToken | Collateral (e.g. long) vToken to supply after swap      |
| collateralAmountSeed      | uint256          | Optional seed amount of collateral (RPM uses 0)         |
| borrowedMarket            | contract IVToken | Borrowed (e.g. short) vToken to flash-borrow            |
| borrowedAmountToFlashLoan | uint256          | Amount to borrow via flash loan                         |
| minAmountOutAfterSwap     | uint256          | Minimum collateral out after swap (slippage protection) |
| swapData                  | bytes            | Swap calldata (e.g. borrowed → collateral)              |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.

---

### exitLeverage

Forwards exitLeverage to the LeverageStrategiesManager on behalf of this position account

```solidity
function exitLeverage(contract IVToken collateralMarket, uint256 collateralAmountToRedeemForSwap, contract IVToken borrowedMarket, uint256 borrowedAmountToFlashLoan, uint256 minAmountOutAfterSwap, bytes swapData) external
```

#### Parameters

| Name                            | Type             | Description                                         |
| ------------------------------- | ---------------- | --------------------------------------------------- |
| collateralMarket                | contract IVToken | Collateral (e.g. long) vToken to redeem             |
| collateralAmountToRedeemForSwap | uint256          | Amount of collateral to redeem for swap             |
| borrowedMarket                  | contract IVToken | Borrowed (e.g. short) vToken to repay               |
| borrowedAmountToFlashLoan       | uint256          | Amount to repay via flash loan                      |
| minAmountOutAfterSwap           | uint256          | Minimum amount out after swap (slippage protection) |
| swapData                        | bytes            | Swap calldata (e.g. collateral → borrowed)          |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.

---

### exitSingleAssetLeverage

Forwards exitSingleAssetLeverage to the LeverageStrategiesManager on behalf of this position account

```solidity
function exitSingleAssetLeverage(contract IVToken collateralMarket, uint256 collateralAmountToFlashLoan) external
```

#### Parameters

| Name                        | Type             | Description                                        |
| --------------------------- | ---------------- | -------------------------------------------------- |
| collateralMarket            | contract IVToken | vToken market for both collateral and debt         |
| collateralAmountToFlashLoan | uint256          | Amount to borrow via flash loan for debt repayment |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.

---

### exitMarket

Exits a market by calling comptroller.exitMarket with this position account as the sender

```solidity
function exitMarket(address vTokenToExit) external
```

#### Parameters

| Name         | Type    | Description                          |
| ------------ | ------- | ------------------------------------ |
| vTokenToExit | address | Address of the vToken market to exit |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.
- ExitMarketFailed if the exit market operation fails.

---

### transferDustToOwner

Transfers full balance of an ERC20 token from this position account to its owner (dust recovery)

```solidity
function transferDustToOwner(address token) external
```

#### Parameters

| Name  | Type    | Description                            |
| ----- | ------- | -------------------------------------- |
| token | address | Address of the ERC20 token to transfer |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.

---

### genericCalls

Executes multiple generic calls to external contracts

```solidity
function genericCalls(address[] targets, bytes[] data) external
```

#### Parameters

| Name    | Type      | Description                         |
| ------- | --------- | ----------------------------------- |
| targets | address[] | Array of target contract addresses  |
| data    | bytes[]   | Array of encoded function call data |

#### ❌ Errors

- UnauthorizedCaller if caller is not the RelativePositionManager.
- InvalidCallsLength if arrays are empty or lengths mismatch.

---
