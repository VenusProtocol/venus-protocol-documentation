# ReserveHelpers

## ReserveHelpers

Contract with basic features to track/hold different assets for different Comptrollers.

## Solidity API

#### getPoolAssetReserve

Get the Amount of the asset in the risk fund for the specific pool.

```solidity
function getPoolAssetReserve(address comptroller, address asset) external view returns (uint256)
```

**Parameters**

| Name        | Type    | Description                |
| ----------- | ------- | -------------------------- |
| comptroller | address | Comptroller address(pool). |
| asset       | address | Asset address.             |

**Return Values**

| Name | Type    | Description                   |
| ---- | ------- | ----------------------------- |
| \[0] | uint256 | Asset's reserve in risk fund. |

**❌ Errors**

* ZeroAddressNotAllowed is thrown when asset address is zero

---

#### updateAssetsState

Update the reserve of the asset for the specific pool after transferring to risk fund and transferring funds to the protocol share reserve

```solidity
function updateAssetsState(address comptroller, address asset) public virtual
```

**Parameters**

| Name        | Type    | Description                |
| ----------- | ------- | -------------------------- |
| comptroller | address | Comptroller address(pool). |
| asset       | address | Asset address.             |

**❌ Errors**

* ZeroAddressNotAllowed is thrown when asset address is zero

---
