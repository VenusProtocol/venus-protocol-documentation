# ComptrollerLens

- The ComptrollerLens contract has functions to get the number of tokens that can be seized through liquidation, hypothetical account liquidity and shortfall of an account.

# Solidity API

### liquidateCalculateSeizeTokens

```solidity
function liquidateCalculateSeizeTokens(
        address comptroller, 
        address vTokenBorrowed, 
        address vTokenCollateral, 
        uint actualRepayAmount
    ) external view returns (uint, uint)
```

computes the number of collateral tokens to be seized up on liquidation using:
 - address of vToken Borrowed
 - address of collateral
 - actual repayment amount.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | address of comptroller |
| vTokenBorrowed | address | address of the vToken Borrowed |
| vTokenCollateral | address | address of collateral for vToken |
| actualRepayAmount | uint | repayment amount i.e amount to be repaid from total borrowed amount |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator |
| [1] | uint | number of collateral tokens to seize |

### liquidateVAICalculateSeizeTokens

```solidity
function liquidateVAICalculateSeizeTokens(
        address comptroller,
        address vTokenCollateral, 
        uint actualRepayAmount
    ) external view returns (uint, uint)
```

computes the number of VAI tokens to be seized up on liquidation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | address of comptroller |
| vTokenCollateral | address | address of collateral for vToken |
| actualRepayAmount | uint | repayment amount i.e amount to be repaid from total borrowed amount |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator |
| [1] | uint | number of collateral tokens to seize |


### getHypotheticalAccountLiquidity

```solidity
    function getHypotheticalAccountLiquidity(
        address comptroller,
        address account,
        VToken vTokenModify,
        uint redeemTokens,
        uint borrowAmount) external view returns (uint, uint, uint)
```

- computes the hypothetical liquidity and shortfall of a user-account
- Account's snapshot is extracted and totalBorrowAmount of the user is computed
- If the totalBorrowAmount of the user is less than or equal to totalCollateral, then:
   - liquidity is totalCollateral - totalBorrowAmount
   - shortfall is 0
- If the totalBorrowAmount with effects is greater than totalCollateral, then:
   - liquidity is 0
   - shortfall is totalBorrowAmount - totalCollateral

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | address of comptroller |
| account | address | address of the vToken Borrowed |
| vTokenModify | address | address of collateral for vToken |
| redeemTokens | uint | number of vTokens of user to be redeemed |
| borrowAmount | uint | amount borrowed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | error code |
| [1] | uint | liquidity |
| [2] | uint | shortfall |
