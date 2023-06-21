# Logic for Compound's JumpRateModel Contract V2.

An interest rate model with a steep increase after a certain utilization threshold called **kink** is reached.
This rate model uses the following formula for the borrow rate:

* $borrow\\\_rate(u)=a\_1 \cdot u + b$, when $u < kink$
* $borrow\\\_rate(u)=a\_1 \cdot kink + a\_2  \cdot (u-kink) + b$, otherwise

The parameters of this interest rate model can be adjusted by the owner.
Version 2 modifies Version 1 by enabling updateable parameters.

# Solidity API

### accessControlManager

The address of the AccessControlManager contract

```solidity
contract IAccessControlManagerV8 accessControlManager
```

---

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

### jumpMultiplierPerBlock

The multiplier per block after hitting a specified utilization point

```solidity
uint256 jumpMultiplierPerBlock
```

---

### kink

The utilization point at which the jump multiplier is applied

```solidity
uint256 kink
```

---

### updateJumpRateModel

Update the parameters of the interest rate model

```solidity
function updateJumpRateModel(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_) external virtual
```

#### Parameters

| Name                  | Type    | Description                                                                 |
| --------------------- | ------- | --------------------------------------------------------------------------- |
| baseRatePerYear       | uint256 | The approximate target base APR, as a mantissa (scaled by EXP\_SCALE)        |
| multiplierPerYear     | uint256 | The rate of increase in interest rate wrt utilization (scaled by EXP\_SCALE) |
| jumpMultiplierPerYear | uint256 | The multiplierPerBlock after hitting a specified utilization point          |
| kink\_                | uint256 | The utilization point at which the jump multiplier is applied               |

#### ⛔️ Access Requirements

* Controlled by AccessControlManager

#### ❌ Errors

* Unauthorized if the sender is not allowed to call this function

---

### getSupplyRate

Calculates the current supply rate per block

```solidity
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa, uint256 badDebt) public view virtual returns (uint256)
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
| \[0]  | uint256 | The supply rate percentage per block as a mantissa (scaled by EXP\_SCALE) |

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
| \[0]  | uint256 | The utilization rate as a mantissa between \[0, MANTISSA\_ONE] |

---
