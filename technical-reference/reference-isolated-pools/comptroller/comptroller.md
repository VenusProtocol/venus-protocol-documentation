# Comptroller
The Comptroller is designed to provide checks for all minting, redeeming, transferring, borrowing, lending, repaying, liquidating,
and seizing done by the `vToken` contract. Each pool has one `Comptroller` checking these interactions across markets. When a user interacts
with a given market by one of these main actions, a call is made to a corresponding hook in the associated `Comptroller`, which either allows
or reverts the transaction. These hooks also update supply and borrow rewards as they are called. The comptroller holds the logic for assessing
liquidity snapshots of an account via the collateral factor and liquidation threshold. This check determines the collateral needed for a borrow,
as well as how much of a borrow may be liquidated. A user may borrow a portion of their collateral with the maximum amount determined by the
markets collateral factor. However, if their borrowed amount exceeds an amount calculated using the market’s corresponding liquidation threshold,
the borrow is eligible for liquidation.

The `Comptroller` also includes two functions `liquidateAccount()` and `healAccount()`, which are meant to handle accounts that do not exceed
the `minLiquidatableCollateral` for the `Comptroller`:

- `healAccount()`: This function is called to seize all of a given user’s collateral, requiring the `msg.sender` repay a certain percentage
of the debt calculated by `collateral/(borrows*liquidationIncentive)`. The function can only be called if the calculated percentage does not exceed
100%, because otherwise no `badDebt` would be created and `liquidateAccount()` should be used instead. The difference in the actual amount of debt
and debt paid off is recorded as `badDebt` for each market, which can then be auctioned off for the risk reserves of the associated pool.
- `liquidateAccount()`: This function can only be called if the collateral seized will cover all borrows of an account, as well as the liquidation
incentive. Otherwise, the pool will incur bad debt, in which case the function `healAccount()` should be used instead. This function skips the logic
verifying that the repay amount does not exceed the close factor.

# Solidity API

### enterMarkets

Add assets to be included in account liquidity calculation; enabling them to be used as collateral

```solidity
function enterMarkets(address[] vTokens) external returns (uint256[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address[] | The list of addresses of the vToken markets to be enabled |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | errors An array of NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events
* MarketEntered is emitted for each market on success

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if entering any of the markets is paused
* MarketNotListed error is thrown if any of the markets is not listed

- - -

### exitMarket

Removes asset from sender's account liquidity calculation; disabling them as collateral

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
| [0] | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events
* MarketExited is emitted on success

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if exiting the market is paused
* NonzeroBorrowBalance error is thrown if the user has an outstanding borrow in this market
* MarketNotListed error is thrown when the market is not listed
* InsufficientLiquidity error is thrown if exiting the market would lead to user's insolvency
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### preMintHook

Checks if the account should be allowed to mint tokens in the given market

```solidity
function preMintHook(address vToken, address minter, uint256 mintAmount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the mint against |
| minter | address | The account which would get the minted tokens |
| mintAmount | uint256 | The amount of underlying being supplied to the market in exchange for tokens |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if supplying to this market is paused
* MarketNotListed error is thrown when the market is not listed
* SupplyCapExceeded error is thrown if the total supply exceeds the cap after minting

- - -

### preRedeemHook

Checks if the account should be allowed to redeem tokens in the given market

```solidity
function preRedeemHook(address vToken, address redeemer, uint256 redeemTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the redeem against |
| redeemer | address | The account which would redeem the tokens |
| redeemTokens | uint256 | The number of vTokens to exchange for the underlying asset in the market |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if withdrawals are paused in this market
* MarketNotListed error is thrown when the market is not listed
* InsufficientLiquidity error is thrown if the withdrawal would lead to user's insolvency
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### preBorrowHook

disable-eslint

```solidity
function preBorrowHook(address vToken, address borrower, uint256 borrowAmount) external
```

- - -

### preRepayHook

Checks if the account should be allowed to repay a borrow in the given market

```solidity
function preRepayHook(address vToken, address borrower) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the repay against |
| borrower | address | The account which would borrowed the asset |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if repayments are paused in this market
* MarketNotListed error is thrown when the market is not listed

- - -

### preLiquidateHook

Checks if the liquidation should be allowed to occur

```solidity
function preLiquidateHook(address vTokenBorrowed, address vTokenCollateral, address borrower, uint256 repayAmount, bool skipLiquidityCheck) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| borrower | address | The address of the borrower |
| repayAmount | uint256 | The amount of underlying being repaid |
| skipLiquidityCheck | bool | Allows the borrow to be liquidated regardless of the account liquidity |

#### ❌ Errors
* ActionPaused error is thrown if liquidations are paused in this market
* MarketNotListed error is thrown if either collateral or borrowed token is not listed
* TooMuchRepay error is thrown if the liquidator is trying to repay more than allowed by close factor
* MinimalCollateralViolated is thrown if the users' total collateral is lower than the threshold for non-batch liquidations
* InsufficientShortfall is thrown when trying to liquidate a healthy account
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### preSeizeHook

Checks if the seizing of assets should be allowed to occur

```solidity
function preSeizeHook(address vTokenCollateral, address seizerContract, address liquidator, address borrower) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| seizerContract | address | Contract that tries to seize the asset (either borrowed vToken or Comptroller) |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if seizing this type of collateral is paused
* MarketNotListed error is thrown if either collateral or borrowed token is not listed
* ComptrollerMismatch error is when seizer contract or seized asset belong to different pools

- - -

### preTransferHook

Checks if the account should be allowed to transfer tokens in the given market

```solidity
function preTransferHook(address vToken, address src, address dst, uint256 transferTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the transfer against |
| src | address | The account which sources the tokens |
| dst | address | The account which receives the tokens |
| transferTokens | uint256 | The number of vTokens to transfer |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* ActionPaused error is thrown if withdrawals are paused in this market
* MarketNotListed error is thrown when the market is not listed
* InsufficientLiquidity error is thrown if the withdrawal would lead to user's insolvency
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### healAccount

Seizes all the remaining collateral, makes msg.sender repay the existing
  borrows, and treats the rest of the debt as bad debt (for each market).
  The sender has to repay a certain percentage of the debt, computed as
  collateral / (borrows * liquidationIncentive).

```solidity
function healAccount(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | account to heal |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* CollateralExceedsThreshold error is thrown when the collateral is too big for healing
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### liquidateAccount

Liquidates all borrows of the borrower. Callable only if the collateral is less than
  a predefined threshold, and the account collateral can be seized to cover all borrows. If
  the collateral is higher than the threshold, use regular liquidations. If the collateral is
  below the threshold, and the account is insolvent, use healAccount.

```solidity
function liquidateAccount(address borrower, struct ComptrollerStorage.LiquidationOrder[] orders) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | the borrower address |
| orders | struct ComptrollerStorage.LiquidationOrder[] | an array of liquidation orders |

#### ⛔️ Access Requirements
* Not restricted

#### ❌ Errors
* CollateralExceedsThreshold error is thrown when the collateral is too big for a batch liquidation
* InsufficientCollateral error is thrown when there is not enough collateral to cover the debt
* SnapshotError is thrown if some vToken fails to return the account's supply and borrows
* PriceError is thrown if the oracle returns an incorrect price for some asset

- - -

### setCloseFactor

Sets the closeFactor to use when liquidating borrows

```solidity
function setCloseFactor(uint256 newCloseFactorMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newCloseFactorMantissa | uint256 | New close factor, scaled by 1e18 |

#### 📅 Events
* Emits NewCloseFactor on success

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setCollateralFactor

Sets the collateralFactor for a market

```solidity
function setCollateralFactor(contract VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The market to set the factor on |
| newCollateralFactorMantissa | uint256 | The new collateral factor, scaled by 1e18 |
| newLiquidationThresholdMantissa | uint256 | The new liquidation threshold, scaled by 1e18 |

#### 📅 Events
* Emits NewCollateralFactor when collateral factor is updated
*    and NewLiquidationThreshold when liquidation threshold is updated

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* MarketNotListed error is thrown when the market is not listed
* InvalidCollateralFactor error is thrown when collateral factor is too high
* InvalidLiquidationThreshold error is thrown when liquidation threshold is lower than collateral factor
* PriceError is thrown when the oracle returns an invalid price for the asset

- - -

### setLiquidationIncentive

Sets liquidationIncentive

```solidity
function setLiquidationIncentive(uint256 newLiquidationIncentiveMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newLiquidationIncentiveMantissa | uint256 | New liquidationIncentive scaled by 1e18 |

#### 📅 Events
* Emits NewLiquidationIncentive on success

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### supportMarket

Add the market to the markets mapping and set it as listed

```solidity
function supportMarket(contract VToken vToken) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the market (token) to list |

#### ⛔️ Access Requirements
* Only PoolRegistry

#### ❌ Errors
* MarketAlreadyListed is thrown if the market is already listed in this pool

- - -

### setMarketBorrowCaps

Set the given borrow caps for the given vToken markets. Borrowing that brings total borrows to or above borrow cap will revert.

```solidity
function setMarketBorrowCaps(contract VToken[] vTokens, uint256[] newBorrowCaps) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | The addresses of the markets (tokens) to change the borrow caps for |
| newBorrowCaps | uint256[] | The new borrow cap values in underlying to be set. A value of type(uint256).max corresponds to unlimited borrowing. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setMarketSupplyCaps

Set the given supply caps for the given vToken markets. Supply that brings total Supply to or above supply cap will revert.

```solidity
function setMarketSupplyCaps(contract VToken[] vTokens, uint256[] newSupplyCaps) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | The addresses of the markets (tokens) to change the supply caps for |
| newSupplyCaps | uint256[] | The new supply cap values in underlying to be set. A value of type(uint256).max corresponds to unlimited supply. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setActionsPaused

Pause/unpause specified actions

```solidity
function setActionsPaused(contract VToken[] marketsList, enum ComptrollerStorage.Action[] actionsList, bool paused) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| marketsList | contract VToken[] | Markets to pause/unpause the actions on |
| actionsList | enum ComptrollerStorage.Action[] | List of action ids to pause/unpause |
| paused | bool | The new paused state (true=paused, false=unpaused) |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setMinLiquidatableCollateral

Set the given collateral threshold for non-batch liquidations. Regular liquidations
  will fail if the collateral amount is less than this threshold. Liquidators should use batch
  operations like liquidateAccount or healAccount.

```solidity
function setMinLiquidatableCollateral(uint256 newMinLiquidatableCollateral) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newMinLiquidatableCollateral | uint256 | The new min liquidatable collateral (in USD). |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### addRewardsDistributor

Add a new RewardsDistributor and initialize it with all markets. We can add several RewardsDistributor
contracts with the same rewardToken, and there could be overlaping among them considering the last reward block

```solidity
function addRewardsDistributor(contract RewardsDistributor _rewardsDistributor) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardsDistributor | contract RewardsDistributor | Address of the RewardDistributor contract to add |

#### 📅 Events
* Emits NewRewardsDistributor with distributor address

#### ⛔️ Access Requirements
* Only Governance

- - -

### setPriceOracle

Sets a new price oracle for the Comptroller

```solidity
function setPriceOracle(contract ResilientOracleInterface newOracle) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newOracle | contract ResilientOracleInterface | Address of the new price oracle to set |

#### 📅 Events
* Emits NewPriceOracle on success

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when the new oracle address is zero

- - -

### setMaxLoopsLimit

Set the for loop iteration limit to avoid DOS

```solidity
function setMaxLoopsLimit(uint256 limit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| limit | uint256 | Limit for the max loops can execute at a time |

- - -

### getAccountLiquidity

Determine the current account liquidity with respect to liquidation threshold requirements

```solidity
function getAccountLiquidity(address account) external view returns (uint256 error, uint256 liquidity, uint256 shortfall)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account get liquidity for |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| error | uint256 | Always NO_ERROR for compatibility with Venus core tooling |
| liquidity | uint256 | Account liquidity in excess of liquidation threshold requirements, |
| shortfall | uint256 | Account shortfall below liquidation threshold requirements |

- - -

### getBorrowingPower

Determine the current account liquidity with respect to collateral requirements

```solidity
function getBorrowingPower(address account) external view returns (uint256 error, uint256 liquidity, uint256 shortfall)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account get liquidity for |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| error | uint256 | Always NO_ERROR for compatibility with Venus core tooling |
| liquidity | uint256 | Account liquidity in excess of collateral requirements, |
| shortfall | uint256 | Account shortfall below collateral requirements |

- - -

### getHypotheticalAccountLiquidity

Determine what the account liquidity would be if the given amounts were redeemed/borrowed

```solidity
function getHypotheticalAccountLiquidity(address account, address vTokenModify, uint256 redeemTokens, uint256 borrowAmount) external view returns (uint256 error, uint256 liquidity, uint256 shortfall)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account to determine liquidity for |
| vTokenModify | address | The market to hypothetically redeem/borrow in |
| redeemTokens | uint256 | The number of tokens to hypothetically redeem |
| borrowAmount | uint256 | The amount of underlying to hypothetically borrow |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| error | uint256 | Always NO_ERROR for compatibility with Venus core tooling |
| liquidity | uint256 | Hypothetical account liquidity in excess of collateral requirements, |
| shortfall | uint256 | Hypothetical account shortfall below collateral requirements |

- - -

### getAllMarkets

Return all of the markets

```solidity
function getAllMarkets() external view returns (contract VToken[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract VToken[] | markets The list of market addresses |

- - -

### isMarketListed

Check if a market is marked as listed (active)

```solidity
function isMarketListed(contract VToken vToken) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | vToken Address for the market to check |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | listed True if listed otherwise false |

- - -

### getAssetsIn

Returns the assets an account has entered

```solidity
function getAssetsIn(address account) external view returns (contract VToken[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to pull assets for |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract VToken[] | A list with the assets the account has entered |

- - -

### checkMembership

Returns whether the given account is entered in a given market

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
| [0] | bool | True if the account is in the market specified, otherwise false. |

- - -

### liquidateCalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateCalculateSeizeTokens(address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256 error, uint256 tokensToSeize)
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
| error | uint256 | Always NO_ERROR for compatibility with Venus core tooling |
| tokensToSeize | uint256 | Number of vTokenCollateral tokens to be seized in a liquidation |

#### ❌ Errors
* PriceError if the oracle returns an invalid price

- - -

### getRewardsByMarket

Returns reward speed given a vToken

```solidity
function getRewardsByMarket(address vToken) external view returns (struct ComptrollerStorage.RewardSpeeds[] rewardSpeeds)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The vToken to get the reward speeds for |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| rewardSpeeds | struct ComptrollerStorage.RewardSpeeds[] | Array of total supply and borrow speeds and reward token for all reward distributors |

- - -

### getRewardDistributors

Return all reward distributors for this pool

```solidity
function getRewardDistributors() external view returns (contract RewardsDistributor[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract RewardsDistributor[] | Array of RewardDistributor addresses |

- - -

### isComptroller

A marker method that returns true for a valid Comptroller contract

```solidity
function isComptroller() external pure returns (bool)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Always true |

- - -

### updatePrices

Update the prices of all the tokens associated with the provided account

```solidity
function updatePrices(address account) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address of the account to get associated tokens with |

- - -

### actionPaused

Checks if a certain action is paused on a market

```solidity
function actionPaused(address market, enum ComptrollerStorage.Action action) public view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | vToken address |
| action | enum ComptrollerStorage.Action | Action to check |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | paused True if the action is paused otherwise false |

- - -

### isDeprecated

Check if a vToken market has been deprecated

```solidity
function isDeprecated(contract VToken vToken) public view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The market to check if deprecated |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | deprecated True if the given vToken market has been deprecated |

- - -

