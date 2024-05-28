# OneJumpOracle
This oracle fetches the price of an asset in through an intermediate asset

# Solidity API

### INTERMEDIATE_ORACLE

Address of the intermediate oracle

```solidity
contract OracleInterface INTERMEDIATE_ORACLE
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address correlatedToken, address underlyingToken, address resilientOracle, address intermediateOracle) public
```

- - -

