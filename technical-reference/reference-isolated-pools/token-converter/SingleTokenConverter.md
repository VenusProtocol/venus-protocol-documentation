# Solidity API

### baseAsset

Address of the base asset token

```solidity
address baseAsset
```

- - -

### setBaseAsset

Sets the base asset for the contract

```solidity
function setBaseAsset(address baseAsset_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| baseAsset_ | address | The new address of the base asset |

#### ⛔️ Access Requirements
* Only Governance

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
| tokenBalance | uint256 | Balance of the token the contract has |

- - -

