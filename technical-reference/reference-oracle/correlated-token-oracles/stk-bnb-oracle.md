# StkBNBOracle
This oracle fetches the price of stkBNB asset

# Solidity API

### NATIVE_TOKEN_ADDR

This is used as token address of BNB on BSC

```solidity
address NATIVE_TOKEN_ADDR
```

- - -

### STAKE_POOL

Address of StakePool

```solidity
contract IPStakePool STAKE_POOL
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address stakePool, address stkBNB, address resilientOracle) public
```

- - -

