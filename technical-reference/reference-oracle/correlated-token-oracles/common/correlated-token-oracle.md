# CorrelatedTokenOracle
This oracle fetches the price of a token that is correlated to another token.

# Solidity API

### CORRELATED_TOKEN

Address of the correlated token

```solidity
address CORRELATED_TOKEN
```

- - -

### UNDERLYING_TOKEN

Address of the underlying token

```solidity
address UNDERLYING_TOKEN
```

- - -

### RESILIENT_ORACLE

Address of Resilient Oracle

```solidity
contract OracleInterface RESILIENT_ORACLE
```

- - -

### getPrice

Fetches the price of the correlated token

```solidity
function getPrice(address asset) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of the correlated token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price The price of the correlated token in scaled decimal places |

- - -

