# WstETHOracle
Depending on the equivalence flag price is either based on assumption that 1 stETH = 1 ETH
        or the price of stETH/USD (secondary market price) is obtained from the oracle.

# Solidity API

### ASSUME_STETH_ETH_EQUIVALENCE

A flag assuming 1:1 price equivalence between stETH/ETH

```solidity
bool ASSUME_STETH_ETH_EQUIVALENCE
```

- - -

### STETH

Address of stETH

```solidity
contract IStETH STETH
```

- - -

### WSTETH_ADDRESS

Address of wstETH

```solidity
address WSTETH_ADDRESS
```

- - -

### WETH_ADDRESS

Address of WETH

```solidity
address WETH_ADDRESS
```

- - -

### RESILIENT_ORACLE

Address of Resilient Oracle

```solidity
contract OracleInterface RESILIENT_ORACLE
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address wstETHAddress, address wETHAddress, address stETHAddress, address resilientOracleAddress, bool assumeEquivalence) public
```

- - -

### getPrice

Gets the USD price of wstETH asset

```solidity
function getPrice(address asset) public view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of wstETH |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | wstETH Price in USD scaled by 1e18 |

- - -

