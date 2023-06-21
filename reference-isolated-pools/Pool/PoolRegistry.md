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
enum InterestRateModels {
  WhitePaper,
  JumpRate
}

```

```solidity
struct AddMarketInput {
  address comptroller;
  address asset;
  uint8 decimals;
  string name;
  string symbol;
  enum PoolRegistry.InterestRateModels rateModel;
  uint256 baseRatePerYear;
  uint256 multiplierPerYear;
  uint256 jumpMultiplierPerYear;
  uint256 kink_;
  uint256 collateralFactor;
  uint256 liquidationThreshold;
  uint256 reserveFactor;
  contract AccessControlManager accessControlManager;
  address beaconAddress;
  uint256 initialSupply;
  address vTokenReceiver;
  uint256 supplyCap;
  uint256 borrowCap;
}
```

### vTokenFactory

VTokenProxyFactory contract address

```solidity
contract VTokenProxyFactory vTokenFactory
```

---

### jumpRateFactory

JumpRateModelFactory contract address

```solidity
contract JumpRateModelFactory jumpRateFactory
```

---

### whitePaperFactory

WhitePaperInterestRateModelFactory contract address

```solidity
contract WhitePaperInterestRateModelFactory whitePaperFactory
```

---

### shortfall

Shortfall contract address

```solidity
contract Shortfall shortfall
```

---

### protocolShareReserve

Shortfall contract address

```solidity
address payable protocolShareReserve
```

---

### metadata

Maps pool's comptroller address to metadata.

```solidity
mapping(address => struct PoolRegistryInterface.VenusPoolMetaData) metadata
```

---

### setProtocolShareReserve

Sets protocol share reserve contract address

```solidity
function setProtocolShareReserve(address payable protocolShareReserve_) external
```

#### Parameters

| Name                   | Type            | Description                                        |
| ---------------------- | --------------- | -------------------------------------------------- |
| protocolShareReserve\_ | address payable | The address of the protocol share reserve contract |

#### ⛔️ Access Requirements

* Only Governance

#### ❌ Errors

* ZeroAddressNotAllowed is thrown when protocol share reserve address is zero

---

### setShortfallContract

Sets shortfall contract address

```solidity
function setShortfallContract(contract Shortfall shortfall_) external
```

#### Parameters

| Name        | Type               | Description                           |
| ----------- | ------------------ | ------------------------------------- |
| shortfall\_ | contract Shortfall | The address of the shortfall contract |

#### ⛔️ Access Requirements

* Only Governance

#### ❌ Errors

* ZeroAddressNotAllowed is thrown when shortfall contract address is zero

---

### addMarket

Add a market to an existing pool and then mint to provide initial supply.

```solidity
function addMarket(struct PoolRegistry.AddMarketInput input) external
```

#### Parameters

| Name  | Type                               | Description                                                            |
| ----- | ---------------------------------- | ---------------------------------------------------------------------- |
| input | struct PoolRegistry.AddMarketInput | The structure describing the parameters for adding a market to a pool. |

#### ❌ Errors

* ZeroAddressNotAllowed is thrown when Comptroller address is zero
* ZeroAddressNotAllowed is thrown when asset address is zero
* ZeroAddressNotAllowed is thrown when VToken beacon address is zero
* ZeroAddressNotAllowed is thrown when vTokenReceiver address is zero

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
| \[0]  | struct PoolRegistryInterface.VenusPool\[] | A list of all pools within PoolRegistry, with details for each pool |

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
