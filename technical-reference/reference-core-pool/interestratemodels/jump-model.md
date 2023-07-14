# JumpModel

## JumpRateModel Contract

## Solidity API

#### constructor

Construct an interest rate model

```solidity
constructor(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_) public
```

**Parameters**

| Name                  | Type    | Description                                                            |
| --------------------- | ------- | ---------------------------------------------------------------------- |
| baseRatePerYear       | uint256 | The approximate target base APR, as a mantissa (scaled by 1e18)        |
| multiplierPerYear     | uint256 | The rate of increase in interest rate wrt utilization (scaled by 1e18) |
| jumpMultiplierPerYear | uint256 | The multiplierPerBlock after hitting a specified utilization point     |
| kink\_                | uint256 | The utilization point at which the jump multiplier is applied          |



#### utilizationRate

Calculates the utilization rate of the market: `borrows / (cash + borrows - reserves)`

```solidity
function utilizationRate(uint256 cash, uint256 borrows, uint256 reserves) public pure returns (uint256)
```

**Parameters**

| Name     | Type    | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| cash     | uint256 | The amount of cash in the market                        |
| borrows  | uint256 | The amount of borrows in the market                     |
| reserves | uint256 | The amount of reserves in the market (currently unused) |

**Return Values**

| Name | Type    | Description                                           |
| ---- | ------- | ----------------------------------------------------- |
| \[0] | uint256 | The utilization rate as a mantissa between \[0, 1e18] |



#### getBorrowRate

Calculates the current borrow rate per block, with the error code expected by the market

```solidity
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves) public view returns (uint256)
```

**Parameters**

| Name     | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| cash     | uint256 | The amount of cash in the market     |
| borrows  | uint256 | The amount of borrows in the market  |
| reserves | uint256 | The amount of reserves in the market |

**Return Values**

| Name | Type    | Description                                                         |
| ---- | ------- | ------------------------------------------------------------------- |
| \[0] | uint256 | The borrow rate percentage per block as a mantissa (scaled by 1e18) |



#### getSupplyRate

Calculates the current supply rate per block

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa) public view returns (uint256)
```

**Parameters**

| Name                  | Type    | Description                               |
| --------------------- | ------- | ----------------------------------------- |
| cash                  | uint256 | The amount of cash in the market          |
| borrows               | uint256 | The amount of borrows in the market       |
| reserves              | uint256 | The amount of reserves in the market      |
| reserveFactorMantissa | uint256 | The current reserve factor for the market |

**Return Values**

| Name | Type    | Description                                                         |
| ---- | ------- | ------------------------------------------------------------------- |
| \[0] | uint256 | The supply rate percentage per block as a mantissa (scaled by 1e18) |

