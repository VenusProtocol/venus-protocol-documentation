# Exponential module for storing fixed-precision decimals

Exp is a struct which stores decimals with a fixed precision of 18 decimal places.
Thus, if we wanted to store the 5.1, mantissa would store 5.1e18. That is:
`Exp({mantissa: 5100000000000000000})`.

# Solidity API

```solidity
struct Exp {
  uint256 mantissa;
}
```

```solidity
struct Double {
  uint256 mantissa;
}
```
