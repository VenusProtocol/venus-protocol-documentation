# RiskFundV2

Contract with basic features to track/hold different assets for different Comptrollers.

# Solidity API

### sweepToken

Function to sweep baseAsset for pool, Tokens are sent to admin (timelock)

```solidity
function sweepToken(address comptroller, address asset, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | The address of the pool for the amount need to be sweeped |
| asset | address | Address of the asset(token) |
| amount | uint256 | Amount need to sweep for the pool |

#### 📅 Events
* Emits SweepToken event on success

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when tokenAddress/to address is zero
* InsufficientPoolReserve is thrown when pool reserve is less than the amount needed

- - -

