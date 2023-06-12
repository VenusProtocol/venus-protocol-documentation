# Compound&#x27;s WhitePaperInterestRateModel Contract

The parameterized model described in section 2.4 of the original Compound Protocol whitepaper

# Solidity API

### multiplierPerBlock

The multiplier of utilization rate that gives the slope of the interest rate

```solidity
uint256 multiplierPerBlock
```

---

### baseRatePerBlock

The base interest rate which is the y-intercept when utilization rate is 0

```solidity
uint256 baseRatePerBlock
```

---

### constructor

Construct an interest rate model

```solidity
constructor(uint256 baseRatePerYear, uint256 multiplierPerYear) public
```

#### Parameters

| Name              | Type    | Description                                                                 |
| ----------------- | ------- | --------------------------------------------------------------------------- |
| baseRatePerYear   | uint256 | The approximate target base APR, as a mantissa (scaled by EXP_SCALE)        |
| multiplierPerYear | uint256 | The rate of increase in interest rate wrt utilization (scaled by EXP_SCALE) |

---

### getBorrowRate

Calculates the current borrow rate per block, with the error code expected by the market

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) public view returns (uint256)
```

#### Parameters

| Name     | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| cash     | uint256 | The amount of cash in the market     |
| borrows  | uint256 | The amount of borrows in the market  |
| reserves | uint256 | The amount of reserves in the market |
| badDebt  | uint256 | The amount of badDebt in the market  |

#### Return Values

| Name | Type    | Description                                                              |
| ---- | ------- | ------------------------------------------------------------------------ |
| [0]  | uint256 | The borrow rate percentage per block as a mantissa (scaled by EXP_SCALE) |

---

### getSupplyRate

Calculates the current supply rate per block

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa, uint256 badDebt) public view returns (uint256)
```

#### Parameters

| Name                  | Type    | Description                               |
| --------------------- | ------- | ----------------------------------------- |
| cash                  | uint256 | The amount of cash in the market          |
| borrows               | uint256 | The amount of borrows in the market       |
| reserves              | uint256 | The amount of reserves in the market      |
| reserveFactorMantissa | uint256 | The current reserve factor for the market |
| badDebt               | uint256 | The amount of badDebt in the market       |

#### Return Values

| Name | Type    | Description                                                              |
| ---- | ------- | ------------------------------------------------------------------------ |
| [0]  | uint256 | The supply rate percentage per block as a mantissa (scaled by EXP_SCALE) |

---

### utilizationRate

Calculates the utilization rate of the market: `(borrows + badDebt) / (cash + borrows + badDebt - reserves)`

```solidity
function utilizationRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) public pure returns (uint256)
```

#### Parameters

| Name     | Type    | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| cash     | uint256 | The amount of cash in the market                        |
| borrows  | uint256 | The amount of borrows in the market                     |
| reserves | uint256 | The amount of reserves in the market (currently unused) |
| badDebt  | uint256 | The amount of badDebt in the market                     |

#### Return Values

| Name | Type    | Description                                                  |
| ---- | ------- | ------------------------------------------------------------ |
| [0]  | uint256 | The utilization rate as a mantissa between [0, MANTISSA_ONE] |

---
