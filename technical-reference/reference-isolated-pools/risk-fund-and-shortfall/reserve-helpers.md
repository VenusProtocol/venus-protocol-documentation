# 

# Solidity API

### sweepToken

A public function to sweep accidental BEP-20 transfers to this contract. Tokens are sent to the address `to`, provided in input

```solidity
function sweepToken(address _token, address _to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | address | The address of the BEP-20 token to sweep |
| _to | address | Recipient of the output tokens. |

#### ⛔️ Access Requirements
* Only Owner

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when asset address is zero

- - -

### getPoolAssetReserve

Get the Amount of the asset in the risk fund for the specific pool.

```solidity
function getPoolAssetReserve(address comptroller, address asset) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Comptroller address(pool). |
| asset | address | Asset address. |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Asset's reserve in risk fund. |

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when asset address is zero

- - -

### updateAssetsState

Update the reserve of the asset for the specific pool after transferring to risk fund
and transferring funds to the protocol share reserve

```solidity
function updateAssetsState(address comptroller, address asset) public virtual
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Comptroller address(pool). |
| asset | address | Asset address. |

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when asset address is zero

- - -

