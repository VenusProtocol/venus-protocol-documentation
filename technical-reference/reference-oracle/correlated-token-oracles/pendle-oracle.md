# PendleOracle
This oracle fetches the price of a pendle token

# Solidity API

### PT_ORACLE

Address of the PT oracle

```solidity
contract IPendlePtOracle PT_ORACLE
```

- - -

### MARKET

Address of the market

```solidity
address MARKET
```

- - -

### TWAP_DURATION

Twap duration for the oracle

```solidity
uint32 TWAP_DURATION
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address market, address ptOracle, address ptToken, address underlyingToken, address resilientOracle, uint32 twapDuration) public
```

- - -

