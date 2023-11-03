# RiskFund

Contract with basic features to track/hold different assets for different Comptrollers.

# Solidity API

### initialize

Initializes the deployer to owner.

```solidity
function initialize(address pancakeSwapRouter_, uint256 minAmountToConvert_, address convertibleBaseAsset_, address accessControlManager_, uint256 loopsLimit_) external
```

#### Parameters

| Name                   | Type    | Description                                                    |
| ---------------------- | ------- | -------------------------------------------------------------- |
| pancakeSwapRouter\_    | address | Address of the PancakeSwap router                              |
| minAmountToConvert\_   | uint256 | Minimum amount assets must be worth to convert into base asset |
| convertibleBaseAsset\_ | address | Address of the base asset                                      |
| accessControlManager\_ | address | Address of the access control contract                         |
| loopsLimit\_           | uint256 | Limit for the loops in the contract to avoid DOS               |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when PCS router address is zero
- ZeroAddressNotAllowed is thrown when convertible base asset address is zero

---

### setPoolRegistry

Pool registry setter

```solidity
function setPoolRegistry(address poolRegistry_) external
```

#### Parameters

| Name           | Type    | Description                  |
| -------------- | ------- | ---------------------------- |
| poolRegistry\_ | address | Address of the pool registry |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when pool registry address is zero

---

### setShortfallContractAddress

Shortfall contract address setter

```solidity
function setShortfallContractAddress(address shortfallContractAddress_) external
```

#### Parameters

| Name                       | Type    | Description                     |
| -------------------------- | ------- | ------------------------------- |
| shortfallContractAddress\_ | address | Address of the auction contract |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when shortfall contract address is zero

---

### setPancakeSwapRouter

PancakeSwap router address setter

```solidity
function setPancakeSwapRouter(address pancakeSwapRouter_) external
```

#### Parameters

| Name                | Type    | Description                       |
| ------------------- | ------- | --------------------------------- |
| pancakeSwapRouter\_ | address | Address of the PancakeSwap router |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when PCS router address is zero

---

### setMinAmountToConvert

Min amount to convert setter

```solidity
function setMinAmountToConvert(uint256 minAmountToConvert_) external
```

#### Parameters

| Name                 | Type    | Description            |
| -------------------- | ------- | ---------------------- |
| minAmountToConvert\_ | uint256 | Min amount to convert. |

---

### setConvertibleBaseAsset

Sets a new convertible base asset

```solidity
function setConvertibleBaseAsset(address _convertibleBaseAsset) external
```

#### Parameters

| Name                   | Type    | Description                             |
| ---------------------- | ------- | --------------------------------------- |
| \_convertibleBaseAsset | address | Address for new convertible base asset. |

---

### swapPoolsAssets

Swap array of pool assets into base asset's tokens of at least a minimum amount

```solidity
function swapPoolsAssets(address[] markets, uint256[] amountsOutMin, address[][] paths, uint256 deadline) external returns (uint256)
```

#### Parameters

| Name          | Type        | Description                                          |
| ------------- | ----------- | ---------------------------------------------------- |
| markets       | address[]   | Array of vTokens whose assets to swap for base asset |
| amountsOutMin | uint256[]   | Minimum amount to receive for swap                   |
| paths         | address[][] | A path consisting of PCS token pairs for each swap   |
| deadline      | uint256     | Deadline for the swap                                |

#### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| [0]  | uint256 | Number of swapped tokens |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown if PoolRegistry contract address is not configured

---

### transferReserveForAuction

Transfer tokens for auction.

```solidity
function transferReserveForAuction(address comptroller, uint256 amount) external returns (uint256)
```

#### Parameters

| Name        | Type    | Description                                   |
| ----------- | ------- | --------------------------------------------- |
| comptroller | address | Comptroller of the pool.                      |
| amount      | uint256 | Amount to be transferred to auction contract. |

#### Return Values

| Name | Type    | Description             |
| ---- | ------- | ----------------------- |
| [0]  | uint256 | Number reserved tokens. |

---

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 limit) external
```

#### Parameters

| Name  | Type    | Description                                   |
| ----- | ------- | --------------------------------------------- |
| limit | uint256 | Limit for the max loops can execute at a time |

---

### getPoolsBaseAssetReserves

Get the Amount of the Base asset in the risk fund for the specific pool.

```solidity
function getPoolsBaseAssetReserves(address comptroller) external view returns (uint256)
```

#### Parameters

| Name        | Type    | Description                |
| ----------- | ------- | -------------------------- |
| comptroller | address | Comptroller address(pool). |

#### Return Values

| Name | Type    | Description                        |
| ---- | ------- | ---------------------------------- |
| [0]  | uint256 | Base Asset's reserve in risk fund. |

---

### updateAssetsState

Update the reserve of the asset for the specific pool after transferring to risk fund.

```solidity
function updateAssetsState(address comptroller, address asset) public
```

#### Parameters

| Name        | Type    | Description                |
| ----------- | ------- | -------------------------- |
| comptroller | address | Comptroller address(pool). |
| asset       | address | Asset address.             |

---
