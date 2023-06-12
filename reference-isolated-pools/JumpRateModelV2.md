# Compound&#x27;s JumpRateModel Contract V2 for V2 vTokens

Supports only for V2 vTokens

# Solidity API

### getBorrowRate

Calculates the current borrow rate per block

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) external view returns (uint256)
```

#### Parameters

| Name     | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| cash     | uint256 | The amount of cash in the market     |
| borrows  | uint256 | The amount of borrows in the market  |
| reserves | uint256 | The amount of reserves in the market |
| badDebt  | uint256 | The amount of badDebt in the market  |

#### Return Values

| Name | Type    | Description                                                         |
| ---- | ------- | ------------------------------------------------------------------- |
| [0]  | uint256 | The borrow rate percentage per block as a mantissa (scaled by 1e18) |

---
