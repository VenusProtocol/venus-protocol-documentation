# PoolRegistry

The Isolated Pools architecture centers around the `PoolRegistry` contract. The `PoolRegistry` maintains a directory of isolated lending
pools and can perform actions like creating and registering new pools, adding new markets to existing pools, setting and updating the pool's required
metadata, and providing the getter methods to get information on the pools.

Isolated lending has three main components: PoolRegistry, pools, and markets. The PoolRegistry is responsible for managing pools.
It can create new pools, update pool metadata and manage markets within pools. PoolRegistry contains getter methods to get the details of
any existing pool like `getVTokenForAsset` and `getPoolsSupportedByAsset`. It also contains methods for updating pool metadata (`updatePoolMetadata`)
and setting pool name (`setPoolName`).

The directory of pools is managed through two mappings: `_poolByComptroller` which is a hashmap with the comptroller address as the key and `VenusPool` as
the value and `_poolsByID` which is an array of comptroller addresses. Individual pools can be accessed by calling `getPoolByComptroller` with the pool's
comptroller address. `_poolsByID` is used to iterate through all of the pools.

PoolRegistry also contains a map of asset addresses called `_supportedPools` that maps to an array of assets suppored by each pool. This array of pools by
asset is retrieved by calling `getPoolsSupportedByAsset`.

PoolRegistry registers new isolated pools in the directory with the `createRegistryPool` method. Isolated pools are composed of independent markets with
specific assets and custom risk management configurations according to their markets.

# Solidity API

```solidity
struct AddMarketInput {
  contract VToken vToken;
  uint256 collateralFactor;
  uint256 liquidationThreshold;
  uint256 initialSupply;
  address vTokenReceiver;
  uint256 supplyCap;
  uint256 borrowCap;
}
```

### metadata

Maps pool's comptroller address to metadata.

```solidity
mapping(address => struct PoolRegistryInterface.VenusPoolMetaData) metadata
```

---

### initialize

Initializes the deployer to owner

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                           |
| ---------------------- | ------- | ------------------------------------- |
| accessControlManager\_ | address | AccessControlManager contract address |

---

### addPool

Adds a new Venus pool to the directory

```solidity
function addPool(string name, contract Comptroller comptroller, uint256 closeFactor, uint256 liquidationIncentive, uint256 minLiquidatableCollateral) external virtual returns (uint256 index)
```

#### Parameters

| Name                      | Type                 | Description                                                  |
| ------------------------- | -------------------- | ------------------------------------------------------------ |
| name                      | string               | The name of the pool                                         |
| comptroller               | contract Comptroller | Pool's Comptroller contract                                  |
| closeFactor               | uint256              | The pool's close factor (scaled by 1e18)                     |
| liquidationIncentive      | uint256              | The pool's liquidation incentive (scaled by 1e18)            |
| minLiquidatableCollateral | uint256              | Minimal collateral for regular (non-batch) liquidations flow |

#### Return Values

| Name  | Type    | Description                            |
| ----- | ------- | -------------------------------------- |
| index | uint256 | The index of the registered Venus pool |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when Comptroller address is zero
- ZeroAddressNotAllowed is thrown when price oracle address is zero

---

### addMarket

Add a market to an existing pool and then mint to provide initial supply

```solidity
function addMarket(struct PoolRegistry.AddMarketInput input) external
```

#### Parameters

| Name  | Type                               | Description                                                           |
| ----- | ---------------------------------- | --------------------------------------------------------------------- |
| input | struct PoolRegistry.AddMarketInput | The structure describing the parameters for adding a market to a pool |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when vToken address is zero
- ZeroAddressNotAllowed is thrown when vTokenReceiver address is zero

---

### setPoolName

Modify existing Venus pool name

```solidity
function setPoolName(address comptroller, string name) external
```

#### Parameters

| Name        | Type    | Description        |
| ----------- | ------- | ------------------ |
| comptroller | address | Pool's Comptroller |
| name        | string  | New pool name      |

---

### updatePoolMetadata

Update metadata of an existing pool

```solidity
function updatePoolMetadata(address comptroller, struct PoolRegistryInterface.VenusPoolMetaData metadata_) external
```

#### Parameters

| Name        | Type                                           | Description        |
| ----------- | ---------------------------------------------- | ------------------ |
| comptroller | address                                        | Pool's Comptroller |
| metadata\_  | struct PoolRegistryInterface.VenusPoolMetaData | New pool metadata  |

---

### getAllPools

Returns arrays of all Venus pools' data

```solidity
function getAllPools() external view returns (struct PoolRegistryInterface.VenusPool[])
```

#### Return Values

| Name | Type                                     | Description                                                         |
| ---- | ---------------------------------------- | ------------------------------------------------------------------- |
| [0]  | struct PoolRegistryInterface.VenusPool[] | A list of all pools within PoolRegistry, with details for each pool |

---

### getVTokenForAsset

Get the address of the VToken contract in the Pool where the underlying token is the provided asset

```solidity
function getVTokenForAsset(address comptroller, address asset) external view returns (address)
```

---

### getPoolsSupportedByAsset

Get the addresss of the Pools supported that include a market for the provided asset

```solidity
function getPoolsSupportedByAsset(address asset) external view returns (address[])
```

---
