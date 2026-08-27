# TwoKinksInterestRateModel

An interest rate model with two different slope increase or decrease each after a certain utilization threshold called **kink** is reached.

{% hint style="warning" %}
BNB Core model reference. Resolve the vToken's live model and any `CheckpointView` wrapper before using this ABI. Read `BLOCKS_PER_YEAR` from the effective target; the value is not a universal BNB constant.
{% endhint %}

# Solidity API

### BLOCKS_PER_YEAR

Approximate blocks per year used to convert annual constructor parameters to per-block rates.

```solidity
int256 BLOCKS_PER_YEAR
```

---

### MULTIPLIER_PER_BLOCK

The multiplier of utilization rate per block that gives the slope 1 of the interest rate scaled by EXP_SCALE

```solidity
int256 MULTIPLIER_PER_BLOCK
```

---

### BASE_RATE_PER_BLOCK

The base interest rate per block which is the y-intercept when utilization rate is 0 scaled by EXP_SCALE

```solidity
int256 BASE_RATE_PER_BLOCK
```

---

### KINK_1

The utilization point at which the multiplier2 is applied

```solidity
int256 KINK_1
```

---

### MULTIPLIER_2_PER_BLOCK

The multiplier of utilization rate per block that gives the slope 2 of the interest rate scaled by EXP_SCALE

```solidity
int256 MULTIPLIER_2_PER_BLOCK
```

---

### BASE_RATE_2_PER_BLOCK

The base interest rate per block which is the y-intercept when utilization rate hits KINK_1 scaled by EXP_SCALE

```solidity
int256 BASE_RATE_2_PER_BLOCK
```

---

### RATE_1

The maximum kink interest rate scaled by EXP_SCALE

```solidity
int256 RATE_1
```

---

### KINK_2

The utilization point at which the jump multiplier is applied

```solidity
int256 KINK_2
```

---

### JUMP_MULTIPLIER_PER_BLOCK

The multiplier of utilization rate per block that gives the slope 3 of interest rate scaled by EXP_SCALE

```solidity
int256 JUMP_MULTIPLIER_PER_BLOCK
```

---

### RATE_2

The maximum kink interest rate scaled by EXP_SCALE

```solidity
int256 RATE_2
```

---

### constructor

Construct an interest rate model

```solidity
constructor(int256 baseRatePerYear_, int256 multiplierPerYear_, int256 kink1_, int256 multiplier2PerYear_, int256 baseRate2PerYear_, int256 kink2_, int256 jumpMultiplierPerYear_, int256 blocksPerYear_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| baseRatePerYear_ | int256 | The approximate target base APR, as a mantissa (scaled by EXP_SCALE) |
| multiplierPerYear_ | int256 | The rate of increase or decrease in interest rate wrt utilization (scaled by EXP_SCALE) |
| kink1_ | int256 | The utilization point at which the multiplier2 is applied |
| multiplier2PerYear_ | int256 | The rate of increase or decrease in interest rate wrt utilization after hitting KINK_1 (scaled by EXP_SCALE) |
| baseRate2PerYear_ | int256 | The additional base APR after hitting KINK_1, as a mantissa (scaled by EXP_SCALE) |
| kink2_ | int256 | The utilization point at which the jump multiplier is applied |
| jumpMultiplierPerYear_ | int256 | The multiplier after hitting KINK_2 |
| blocksPerYear_ | int256 | The approximate number of blocks per year assumed by this model |

---

### getBorrowRate

Calculates the current borrow rate per slot (block)

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0\] | uint256 | The borrow rate percentage per slot (block) as a mantissa (scaled by EXP_SCALE) |

---

### getSupplyRate

Calculates the current supply rate per slot (block)

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa) public view virtual returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market |
| reserveFactorMantissa | uint256 | The current reserve factor for the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0\] | uint256 | The supply rate percentage per slot (block) as a mantissa (scaled by EXP_SCALE) |

---

### utilizationRate

Calculates the utilization rate of the market: `borrows / (cash + borrows - reserves)`

```solidity
function utilizationRate(uint256 cash, uint256 borrows, uint256 reserves) public pure returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0\] | uint256 | The utilization rate as a mantissa between \[0, EXP_SCALE\] |

---
