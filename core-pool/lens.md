# Core Pool lens

## Introduction

The Readonly functions in the lens contracts provide aggregated view of the vTokens, User Position, Liquidity and Snapshots of User Position in core-pool.

## Details

- Lens contracts in core-pool are:

1. ComptrollerLens
2. VenusLens

# Solidity API

## Comptroller-Lens

- ComptrollerLens contract has functions to get view in to the number of tokens can be seized on liquidation and hypothetical liquidity and shortfall of a user-account.

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


### getHypotheticalAccountLiquidity


- 0: error, 1: liquidity, 2: shortfall