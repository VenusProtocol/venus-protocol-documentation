# RiskFundV2

Contract with basic features to track/hold different assets for different Comptrollers.

# Solidity API

### sweepToken

Function to sweep baseAsset for pool, Tokens are sent to address(to)

```solidity
function sweepToken(address tokenAddress, address to, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | Address of the asset(token) |
| to | address | Address to which assets will be transferred |
| amount | uint256 | Amount need to sweep for the pool |

#### 📅 Events
* Emits SweepToken event on success

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when tokenAddress/to address is zero
* ZeroValueNotAllowed is thrown when amount is zero

- - -

### getPoolsBaseAssetReserves

Get the Amount of the Base asset in the risk fund for the specific pool.

```solidity
function getPoolsBaseAssetReserves(address comptroller) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Comptroller address(pool). |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Base Asset's reserve in risk fund. |

- - -

