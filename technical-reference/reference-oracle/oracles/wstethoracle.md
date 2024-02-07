# WstETHOracle
This oracle returns the USD price of wstETH asset.
Price is based on assumption that 1 stETH = 1 ETH.

# Solidity API

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
constructor(address wstETHAddress, address wETHAddress, address stETHAddress, address resilientOracleAddress) public
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
