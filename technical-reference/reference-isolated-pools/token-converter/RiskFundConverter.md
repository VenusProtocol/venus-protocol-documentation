# RiskFundConverter
This contract extends the AbtractTokenConverter contract. It maintains a distribution of assets per comptroller and assets. ProtocolShareReserve will send RiskFund's share of income to this contract which will convert the assets and send them to RiskFund.

# Solidity API

### corePoolComptroller

Address of the core pool comptroller

```solidity
address corePoolComptroller
```

- - -

### vBNB

Address of the vBNB

```solidity
address vBNB
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

This mapping would contain the assets for the pool which would be send to RiskFund directly

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
| values | bool[][] |  |

#### ⛔️ Access Requirements
* Restricted by ACM

#### ❌ Errors
* InvalidArguments thrown when comptrollers array length is not equal to assets array length

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

- - -

