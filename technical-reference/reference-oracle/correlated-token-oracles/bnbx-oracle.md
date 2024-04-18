# BNBxOracle
This oracle fetches the price of BNBx asset

# Solidity API

### NATIVE_TOKEN_ADDR

This is used as token address of BNB on BSC

```solidity
address NATIVE_TOKEN_ADDR
```

- - -

### STAKE_MANAGER

Address of StakeManager

```solidity
contract IStaderStakeManager STAKE_MANAGER
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address stakeManager, address bnbx, address resilientOracle) public
```

- - -

