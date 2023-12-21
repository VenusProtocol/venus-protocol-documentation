# FacetBase
This facet contract contains functions related to access and checks

# Solidity API

### actionPaused

Checks if a certain action is paused on a market

```solidity
function actionPaused(address market, enum ComptrollerV9Storage.Action action) public view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | vToken address |
| action | enum ComptrollerV9Storage.Action | Action id |

- - -

### getBlockNumber

Get the latest block number

```solidity
function getBlockNumber() public view returns (uint256)
```

- - -

### releaseToVault

Transfer XVS to VAI Vault

```solidity
function releaseToVault() public
```

- - -

### getXVSAddress

Return the address of the XVS token

```solidity
function getXVSAddress() public pure returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of XVS |

- - -

