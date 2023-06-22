# Compound's InterestRateModel Interface

# Solidity API

### getBorrowRate

Calculates the current borrow interest rate per block

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) external view virtual returns (uint256)
```

#### Parameters

| Name     | Type    | Description                                            |
| -------- | ------- | ------------------------------------------------------ |
| cash     | uint256 | The total amount of cash the market has                |
| borrows  | uint256 | The total amount of borrows the market has outstanding |
| reserves | uint256 | The total amount of reserves the market has            |
| badDebt  | uint256 | The amount of badDebt in the market                    |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| \[0]  | uint256 | The borrow rate per block (as a percentage, and scaled by 1e18) |

---

### getSupplyRate

Calculates the current supply interest rate per block

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa, uint256 badDebt) external view virtual returns (uint256)
```

#### Parameters

| Name                  | Type    | Description                                            |
| --------------------- | ------- | ------------------------------------------------------ |
| cash                  | uint256 | The total amount of cash the market has                |
| borrows               | uint256 | The total amount of borrows the market has outstanding |
| reserves              | uint256 | The total amount of reserves the market has            |
| reserveFactorMantissa | uint256 | The current reserve factor the market has              |
| badDebt               | uint256 | The amount of badDebt in the market                    |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| \[0]  | uint256 | The supply rate per block (as a percentage, and scaled by 1e18) |

---

### isInterestRateModel

Indicator that this is an InterestRateModel contract (for inspection)

```solidity
function isInterestRateModel() external pure virtual returns (bool)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0]  | bool | Always true |

---
