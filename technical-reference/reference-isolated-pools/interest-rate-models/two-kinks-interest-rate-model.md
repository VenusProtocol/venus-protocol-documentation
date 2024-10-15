# TwoKinksInterestRateModel
An interest rate model with two different slope increase or decrease each after a certain utilization threshold called **kink** is reached.

# Solidity API

### MULTIPLIER_PER_BLOCK_OR_SECOND

The multiplier of utilization rate per block or second that gives the slope 1 of the interest rate scaled by EXP_SCALE

```solidity
int256 MULTIPLIER_PER_BLOCK_OR_SECOND
```

- - -

### BASE_RATE_PER_BLOCK_OR_SECOND

The base interest rate per block or second which is the y-intercept when utilization rate is 0 scaled by EXP_SCALE

```solidity
int256 BASE_RATE_PER_BLOCK_OR_SECOND
```

- - -

### KINK_1

The utilization point at which the multiplier2 is applied

```solidity
int256 KINK_1
```

- - -

### MULTIPLIER_2_PER_BLOCK_OR_SECOND

The multiplier of utilization rate per block or second that gives the slope 2 of the interest rate scaled by EXP_SCALE

```solidity
int256 MULTIPLIER_2_PER_BLOCK_OR_SECOND
```

- - -

### BASE_RATE_2_PER_BLOCK_OR_SECOND

The base interest rate per block or second which is the y-intercept when utilization rate hits KINK_1 scaled by EXP_SCALE

```solidity
int256 BASE_RATE_2_PER_BLOCK_OR_SECOND
```

- - -

### RATE_1

The maximum kink interest rate scaled by EXP_SCALE

```solidity
int256 RATE_1
```

- - -

### KINK_2

The utilization point at which the jump multiplier is applied

```solidity
int256 KINK_2
```

- - -

### JUMP_MULTIPLIER_PER_BLOCK_OR_SECOND

The multiplier of utilization rate per block or second that gives the slope 3 of interest rate scaled by EXP_SCALE

```solidity
int256 JUMP_MULTIPLIER_PER_BLOCK_OR_SECOND
```

- - -

### RATE_2

The maximum kink interest rate scaled by EXP_SCALE

```solidity
int256 RATE_2
```

- - -

### constructor

Construct an interest rate model

```solidity
constructor(int256 baseRatePerYear_, int256 multiplierPerYear_, int256 kink1_, int256 multiplier2PerYear_, int256 baseRate2PerYear_, int256 kink2_, int256 jumpMultiplierPerYear_, bool timeBased_, uint256 blocksPerYear_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| baseRatePerYear_ | int256 | The approximate target base APR, as a mantissa (scaled by EXP_SCALE) |
| multiplierPerYear_ | int256 | The rate of increase or decrease in interest rate wrt utilization (scaled by EXP_SCALE) |
| kink1_ | int256 | The utilization point at which the multiplier2 is applied |
| multiplier2PerYear_ | int256 | The rate of increase or decrease in interest rate wrt utilization after hitting KINK_1 (scaled by EXP_SCALE) |
| baseRate2PerYear_ | int256 | The additonal base APR after hitting KINK_1, as a mantissa (scaled by EXP_SCALE) |
| kink2_ | int256 | The utilization point at which the jump multiplier is applied |
| jumpMultiplierPerYear_ | int256 | The multiplier after hitting KINK_2 |
| timeBased_ | bool | A boolean indicating whether the contract is based on time or block. |
| blocksPerYear_ | uint256 | The number of blocks per year |

- - -

### getBorrowRate

Calculates the current borrow rate per slot (block or second)

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market |
| badDebt | uint256 | The amount of badDebt in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The borrow rate percentage per slot (block or second) as a mantissa (scaled by EXP_SCALE) |

- - -

### getSupplyRate

Calculates the current supply rate per slot (block or second)

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa, uint256 badDebt) public view virtual returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market |
| reserveFactorMantissa | uint256 | The current reserve factor for the market |
| badDebt | uint256 | The amount of badDebt in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The supply rate percentage per slot (block or second) as a mantissa (scaled by EXP_SCALE) |

- - -

### utilizationRate

Calculates the utilization rate of the market: `(borrows + badDebt) / (cash + borrows + badDebt - reserves)`

```solidity
function utilizationRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 badDebt) public pure returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| cash | uint256 | The amount of cash in the market |
| borrows | uint256 | The amount of borrows in the market |
| reserves | uint256 | The amount of reserves in the market (currently unused) |
| badDebt | uint256 | The amount of badDebt in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The utilization rate as a mantissa between [0, MANTISSA_ONE] |

- - -

