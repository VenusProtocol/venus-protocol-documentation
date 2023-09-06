# ProtocolShareReserve

Contract used to store and distribute the reserves generated in the markets.

# Solidity API

```solidity
enum Schema {
  DEFAULT,
  SPREAD_PRIME_CORE
}
```

```solidity
struct DistributionConfig {
  enum ProtocolShareReserve.Schema schema;
  uint256 percentage;
  address destination;
}
```

### CORE_POOL_COMPTROLLER

address of core pool comptroller contract

```solidity
address CORE_POOL_COMPTROLLER
```

- - -

### WBNB

address of WBNB contract

```solidity
address WBNB
```

- - -

### vBNB

address of vBNB contract

```solidity
address vBNB
```

- - -

### prime

address of Prime contract

```solidity
address prime
```

- - -

### poolRegistry

address of pool registry contract

```solidity
address poolRegistry
```

- - -

### assetsReserves

comptroller => asset => schema => balance

```solidity
mapping(address => mapping(address => mapping(enum ProtocolShareReserve.Schema => uint256))) assetsReserves
```

- - -

### totalAssetReserve

asset => balance

```solidity
mapping(address => uint256) totalAssetReserve
```

- - -

### distributionTargets

configuration for different income distribution targets

```solidity
struct ProtocolShareReserve.DistributionConfig[] distributionTargets
```

- - -

