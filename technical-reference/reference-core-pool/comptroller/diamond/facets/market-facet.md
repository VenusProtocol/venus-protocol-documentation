# MarketFacet

This facet contract contains functions regarding markets

# Solidity API

### isComptroller

Indicator that this is a Comptroller contract (for inspection)

```solidity
function isComptroller() public pure returns (bool)
```

---

### getAssetsIn

Returns the vToken markets an account has entered in the Core Pool

```solidity
function getAssetsIn(address account) external view returns (contract VToken[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | contract VToken\[] | assets A dynamic array of vToken markets the account has entered |

---

### getAllMarkets

Return all of the markets

```solidity
function getAllMarkets() external view returns (contract VToken[])
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | contract VToken\[] | The list of market addresses |

---

### liquidateCalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateCalculateSeizeTokens(address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | The address of the borrowed vToken |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| \[1] | uint256 |  |

---

### liquidateCalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateCalculateSeizeTokens(address borrower, address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | Address of borrower whose collateral is being seized |
| vTokenBorrowed | address | The address of the borrowed vToken |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| \[1] | uint256 |  |

---

### liquidateVAICalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateVAICalculateSeizeTokens(address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| \[1] | uint256 |  |

---

### checkMembership

Returns whether the given account has entered the specified vToken market in the Core Pool

```solidity
function checkMembership(address account, contract VToken vToken) external view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to check |
| vToken | contract VToken | The vToken to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | True if the account is in the asset, otherwise false |

---

### isMarketListed

Checks whether the given vToken market is listed in the Core Pool (`poolId = 0`)

```solidity
function isMarketListed(contract VToken vToken) external view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The vToken Address of the market to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | listed True if the (Core Pool, vToken) market is listed, otherwise false |

---

### enterMarkets

Add assets to be included in account liquidity calculation

```solidity
function enterMarkets(address[] vTokens) external returns (uint256[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address\[] | The list of addresses of the vToken markets to be enabled |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256\[] | Success indicator for whether each corresponding market was entered |

---

### enterMarketBehalf

Add assets to be included in account liquidity calculation

```solidity
function enterMarketBehalf(address onBehalf, address vToken) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| onBehalf | address | The address of the account entering the market |
| vToken | address | The address of the vToken market to enable for the account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 indicating the result (0 = success, non-zero = failure) |

#### ❌ Errors

* NotAnApprovedDelegate thrown if `msg.sender` is not the account itself or an approved delegate

---

### unlistMarket

Unlists the given vToken market from the Core Pool (`poolId = 0`) by setting `isListed` to false

```solidity
function unlistMarket(address market) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | The address of the market (vToken) to unlist |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (See enum Error for details) |

---

### exitMarket

Removes asset from sender's account liquidity calculation

```solidity
function exitMarket(address vTokenAddress) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenAddress | address | The address of the asset to be removed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Whether or not the account successfully exited the market |

---

### supportMarket

Alias to \_supportMarket to support the Isolated Lending Comptroller Interface

```solidity
function supportMarket(contract VToken vToken) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the market (token) to list |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See enum Error for details) |

---

### \_supportMarket

Adds the given vToken market to the Core Pool (`poolId = 0`) and marks it as listed

```solidity
function _supportMarket(contract VToken vToken) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the vToken market to list in the Core Pool |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See enum Error for details) |

---

### updateDelegate

Grants or revokes the borrowing or redeeming delegate rights to / from an account
If allowed, the delegate will be able to borrow funds on behalf of the sender
Upon a delegated borrow, the delegate will receive the funds, and the borrower
will see the debt on their account
Upon a delegated redeem, the delegate will receive the redeemed amount and the approver
will see a deduction in his vToken balance

```solidity
function updateDelegate(address delegate, bool approved) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The address to update the rights for |
| approved | bool | Whether to grant (true) or revoke (false) the borrowing or redeeming rights |

---

### enterPool

Allows a user to switch to a new pool (e.g., e-mode ).

```solidity
function enterPool(uint96 poolId) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool the user wants to enter. |

#### 📅 Events

* PoolSelected Emitted after a successful pool switch.

#### ❌ Errors

* PoolDoesNotExist The specified pool ID does not exist.
* AlreadyInSelectedPool The user is already in the target pool.
* IncompatibleBorrowedAssets The user's current borrows are incompatible with the new pool.
* LiquidityCheckFailed The user's liquidity is insufficient after switching pools.
* InactivePool The user is trying to enter inactive pool.

---

### createPool

Creates a new pool with the given label.

```solidity
function createPool(string label) external returns (uint96)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| label | string | name for the pool (must be non-empty). |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint96 | poolId The incremental unique identifier of the newly created pool. |

#### 📅 Events

* PoolCreated Emitted after successfully creating a new pool.

#### ❌ Errors

* EmptyPoolLabel Reverts if the provided label is an empty string.

---

### addPoolMarkets

Batch initializes market entries with basic config.

```solidity
function addPoolMarkets(uint96[] poolIds, address[] vTokens) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolIds | uint96\[] | Array of pool IDs. |
| vTokens | address\[] | Array of market (vToken) addresses. |

#### 📅 Events

* PoolMarketInitialized Emitted after successfully initializing a market in a pool.

#### ❌ Errors

* ArrayLengthMismatch Reverts if `poolIds` and `vTokens` arrays have different lengths or if the length is zero.
* InvalidOperationForCorePool Reverts when attempting to call pool-specific methods on the Core Pool.
* PoolDoesNotExist Reverts if the target pool ID does not exist.
* MarketNotListedInCorePool Reverts if the market is not listed in the core pool.
* MarketAlreadyListed Reverts if the given market is already listed in the specified pool.
* InactivePool Reverts if attempted to add markets to an inactive pool.

---

### removePoolMarket

Removes a market (vToken) from the specified pool.

```solidity
function removePoolMarket(uint96 poolId, address vToken) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool from which the market should be removed. |
| vToken | address | The address of the market token to remove. |

#### 📅 Events

* PoolMarketRemoved Emitted after a market is successfully removed from a pool.

#### ❌ Errors

* InvalidOperationForCorePool Reverts if called on the Core Pool.
* PoolMarketNotFound Reverts if the market is not listed in the pool.

---

### getCollateralFactor

Get the core pool collateral factor for a vToken

```solidity
function getCollateralFactor(address vToken) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The address of the vToken to get the collateral factor for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The collateral factor for the vToken, scaled by 1e18 |

---

### getLiquidationThreshold

Get the core pool liquidation threshold for a vToken

```solidity
function getLiquidationThreshold(address vToken) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The address of the vToken to get the liquidation threshold for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The liquidation threshold for the vToken, scaled by 1e18 |

---

### getLiquidationIncentive

Get the core pool liquidation Incentive for a vToken

```solidity
function getLiquidationIncentive(address vToken) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The address of the vToken to get the liquidation Incentive for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | liquidationIncentive The liquidation incentive for the vToken, scaled by 1e18 |

---

### getEffectiveLtvFactor

Get the effective loan-to-value factor (collateral factor or liquidation threshold) for a given account and market.

```solidity
function getEffectiveLtvFactor(address account, address vToken, enum WeightFunction weightingStrategy) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account whose pool is used to determine the market's risk parameters. |
| vToken | address | The address of the vToken market. |
| weightingStrategy | enum WeightFunction | The weighting strategy to use:                          - `WeightFunction.USE_COLLATERAL_FACTOR` to use collateral factor                          - `WeightFunction.USE_LIQUIDATION_THRESHOLD` to use liquidation threshold |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | factor The effective loan-to-value factor, scaled by 1e18. |

---

### getEffectiveLiquidationIncentive

Get the Effective Liquidation Incentive for a given account and market

```solidity
function getEffectiveLiquidationIncentive(address account, address vToken) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account whose pool is used to determine the market's risk parameters |
| vToken | address | The address of the vToken market |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The liquidation Incentive for the vToken, scaled by 1e18 |

---

### getPoolVTokens

Returns the full list of vTokens for a given pool ID.

```solidity
function getPoolVTokens(uint96 poolId) external view returns (address[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool whose vTokens are being queried. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | address\[] | An array of vToken addresses associated with the pool. |

#### ❌ Errors

* PoolDoesNotExist Reverts if the given pool ID do not exist.
* InvalidOperationForCorePool Reverts if called on the Core Pool.

---

### markets

Returns the market configuration for a vToken in the core pool (poolId = 0).

```solidity
function markets(address vToken) external view returns (bool isListed, uint256 collateralFactorMantissa, bool isVenus, uint256 liquidationThresholdMantissa, uint256 liquidationIncentiveMantissa, uint96 marketPoolId, bool isBorrowAllowed)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The address of the vToken whose market configuration is to be fetched. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isListed | bool | Whether the market is listed and enabled. |
| collateralFactorMantissa | uint256 | The maximum borrowable percentage of collateral, in mantissa. |
| isVenus | bool | Whether this market is eligible for VENUS rewards. |
| liquidationThresholdMantissa | uint256 | The threshold at which liquidation is triggered, in mantissa. |
| liquidationIncentiveMantissa | uint256 | The max liquidation incentive allowed for this market, in mantissa. |
| marketPoolId | uint96 | The pool ID this market belongs to. |
| isBorrowAllowed | bool | Whether borrowing is allowed in this market. |

---

### poolMarkets

Returns the market configuration for a vToken from \_poolMarkets.

```solidity
function poolMarkets(uint96 poolId, address vToken) public view returns (bool isListed, uint256 collateralFactorMantissa, bool isVenus, uint256 liquidationThresholdMantissa, uint256 liquidationIncentiveMantissa, uint96 marketPoolId, bool isBorrowAllowed)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool whose market configuration is being queried. |
| vToken | address | The address of the vToken whose market configuration is to be fetched. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isListed | bool | Whether the market is listed and enabled. |
| collateralFactorMantissa | uint256 | The maximum borrowable percentage of collateral, in mantissa. |
| isVenus | bool | Whether this market is eligible for XVS rewards. |
| liquidationThresholdMantissa | uint256 | The threshold at which liquidation is triggered, in mantissa. |
| liquidationIncentiveMantissa | uint256 | The liquidation incentive allowed for this market, in mantissa. |
| marketPoolId | uint96 | The pool ID this market belongs to. |
| isBorrowAllowed | bool | Whether borrowing is allowed in this market. |

#### ❌ Errors

* PoolDoesNotExist Reverts if the given pool ID do not exist.

---

### hasValidPoolBorrows

Returns true if the user can switch to the given target pool, i.e.,
all markets they have borrowed from are also borrowable in the target pool.

```solidity
function hasValidPoolBorrows(address account, uint96 targetPoolId) public view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the user attempting to switch pools. |
| targetPoolId | uint96 | The pool ID the user wants to switch into. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | bool True if the switch is allowed, otherwise False. |

---
