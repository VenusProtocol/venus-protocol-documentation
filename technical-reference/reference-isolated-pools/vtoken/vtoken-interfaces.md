# VTokenStorage

Storage layout used by the `VToken` contract

# Solidity API

```solidity
struct BorrowSnapshot {
  uint256 principal;
  uint256 interestIndex;
}

```

### underlying

Underlying asset for this VToken

```solidity
address underlying
```

---

### name

EIP-20 token name for this token

```solidity
string name
```

---

### symbol

EIP-20 token symbol for this token

```solidity
string symbol
```

---

### decimals

EIP-20 token decimals for this token

```solidity
uint8 decimals
```

---

### protocolShareReserve

Protocol share Reserve contract address

```solidity
address payable protocolShareReserve
```

---

### comptroller

Contract which oversees inter-vToken operations

```solidity
contract ComptrollerInterface comptroller
```

---

### interestRateModel

Model which tells what the current interest rate should be

```solidity
contract InterestRateModel interestRateModel
```

---

### reserveFactorMantissa

Fraction of interest currently set aside for reserves

```solidity
uint256 reserveFactorMantissa
```

---

### accrualBlockNumber

Block number that interest was last accrued at

```solidity
uint256 accrualBlockNumber
```

---

### borrowIndex

Accumulator of the total earned interest rate since the opening of the market

```solidity
uint256 borrowIndex
```

---

### totalBorrows

Total amount of outstanding borrows of the underlying in this market

```solidity
uint256 totalBorrows
```

---

### totalReserves

Total amount of reserves of the underlying held in this market

```solidity
uint256 totalReserves
```

---

### totalSupply

Total number of tokens in circulation

```solidity
uint256 totalSupply
```

---

### badDebt

Total bad debt of the market

```solidity
uint256 badDebt
```

---

### protocolSeizeShareMantissa

Share of seized collateral that is added to reserves

```solidity
uint256 protocolSeizeShareMantissa
```

---

### shortfall

Storage of Shortfall contract address

```solidity
address shortfall
```

---

```solidity
struct RiskManagementInit {
  address shortfall;
  address payable protocolShareReserve;
}

```

### isVToken

Indicator that this is a VToken contract (for inspection)

```solidity
function isVToken() external pure virtual returns (bool)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0]  | bool | Always true |

---
