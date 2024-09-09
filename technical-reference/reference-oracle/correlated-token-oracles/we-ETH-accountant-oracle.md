# WeETHAccountantOracle
This oracle fetches the price of Ether.fi tokens based on an `Accountant` contract (i.e. weETHs and weETHk)

# Solidity API

### ACCOUNTANT

Address of Accountant

```solidity
contract IAccountant ACCOUNTANT
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address accountant, address weethLRT, address weth, address resilientOracle) public
```

- - -

