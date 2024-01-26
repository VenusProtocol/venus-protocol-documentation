# RiskFundConverter
This contract extends the AbtractTokenConverter contract. It maintains a distribution of assets per comptroller and assets. ProtocolShareReserve will send RiskFund's share of income to this contract which will convert the assets and send them to RiskFund.

# Solidity API

### CORE_POOL_COMPTROLLER

Address of the core pool comptroller

```solidity
address CORE_POOL_COMPTROLLER
```

- - -

### VBNB

Address of the vBNB

```solidity
address VBNB
```

- - -

### NATIVE_WRAPPED

Address of the native wrapped currency

```solidity
address NATIVE_WRAPPED
```

- - -

### poolRegistry

Address of pool registry contract

```solidity
address poolRegistry
```

- - -

### poolsAssetsDirectTransfer

The mapping contains the assets for each pool which are sent to RiskFund directly

```solidity
mapping(address => mapping(address => bool)) poolsAssetsDirectTransfer
```

- - -

### setPoolsAssetsDirectTransfer

Update the poolsAssetsDirectTransfer mapping

```solidity
function setPoolsAssetsDirectTransfer(address[] comptrollers, address[][] assets, bool[][] values) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptrollers | address[] | Addresses of the pools |
| assets | address[][] | Addresses of the assets need to be added for direct transfer |
| values | bool[][] | Boolean value to indicate whether direct transfer is allowed for each asset. |

#### 📅 Events
* PoolAssetsDirectTransferUpdated emits on success

#### ⛔️ Access Requirements
* Restricted by ACM

- - -

### balanceOf

Get the balance for specific token

```solidity
function balanceOf(address tokenAddress) public view returns (uint256 tokenBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | Address of the token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenBalance | uint256 | Reserves of the token the contract has |

- - -

### getPools

Get the array of all pools addresses

```solidity
function getPools(address tokenAddress) public view returns (address[] poolsWithCore)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | Address of the token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| poolsWithCore | address[] | Array of the pools addresses in which token is available |

- - -

