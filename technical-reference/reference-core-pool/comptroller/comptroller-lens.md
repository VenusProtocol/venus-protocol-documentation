# ComptrollerLens Contract
The ComptrollerLens contract has functions to get the number of tokens that
can be seized through liquidation, hypothetical account liquidity and shortfall of an account.

# Solidity API

```solidity
struct AccountLiquidityLocalVars {
  uint256 sumCollateral;
  uint256 sumBorrowPlusEffects;
  uint256 vTokenBalance;
  uint256 borrowBalance;
  uint256 exchangeRateMantissa;
  uint256 oraclePriceMantissa;
  struct ExponentialNoError.Exp weightedFactor;
  struct ExponentialNoError.Exp exchangeRate;
  struct ExponentialNoError.Exp oraclePrice;
  struct ExponentialNoError.Exp tokensToDenom;
}
```

### liquidateCalculateSeizeTokens

Computes the number of collateral tokens to be seized in a liquidation event

```solidity
function liquidateCalculateSeizeTokens(address comptroller, address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Address of comptroller |
| vTokenBorrowed | address | Address of the borrowed vToken |
| vTokenCollateral | address | Address of collateral for the borrow |
| actualRepayAmount | uint256 | Repayment amount i.e amount to be repaid of total borrowed amount |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A tuple of error code, and tokens to seize |
| [1] | uint256 |  |

- - -

### liquidateCalculateSeizeTokens

Computes the number of collateral tokens to be seized in a liquidation event

```solidity
function liquidateCalculateSeizeTokens(address borrower, address comptroller, address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | Address of borrower whose collateral is being seized |
| comptroller | address | Address of comptroller |
| vTokenBorrowed | address | Address of the borrowed vToken |
| vTokenCollateral | address | Address of collateral for the borrow |
| actualRepayAmount | uint256 | Repayment amount i.e amount to be repaid of total borrowed amount |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A tuple of error code, and tokens to seize |
| [1] | uint256 |  |

- - -

### liquidateVAICalculateSeizeTokens

Computes the number of VAI tokens to be seized in a liquidation event

```solidity
function liquidateVAICalculateSeizeTokens(address comptroller, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Address of comptroller |
| vTokenCollateral | address | Address of collateral for vToken |
| actualRepayAmount | uint256 | Repayment amount i.e amount to be repaid of the total borrowed amount |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A tuple of error code, and tokens to seize |
| [1] | uint256 |  |

- - -

### getHypotheticalAccountLiquidity

Computes the hypothetical liquidity and shortfall of an account given a hypothetical borrow
     A snapshot of the account is taken and the total borrow amount of the account is calculated

```solidity
function getHypotheticalAccountLiquidity(address comptroller, address account, contract VToken vTokenModify, uint256 redeemTokens, uint256 borrowAmount, enum WeightFunction weightingStrategy) external view returns (uint256, uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Address of comptroller |
| account | address | Address of the borrowed vToken |
| vTokenModify | contract VToken | Address of collateral for vToken |
| redeemTokens | uint256 | Number of vTokens being redeemed |
| borrowAmount | uint256 | Amount borrowed |
| weightingStrategy | enum WeightFunction | The weighting strategy to use:                          - `WeightFunction.USE_COLLATERAL_FACTOR` to use collateral factor                          - `WeightFunction.USE_LIQUIDATION_THRESHOLD` to use liquidation threshold |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Returns a tuple of error code, liquidity, and shortfall |
| [1] | uint256 |  |
| [2] | uint256 |  |

- - -

