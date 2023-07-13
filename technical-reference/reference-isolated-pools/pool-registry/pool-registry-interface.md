# PoolRegistryInterface

Interface implemented by `PoolRegistry`.

# Solidity API

```solidity
struct VenusPool {
  string name;
  address creator;
  address comptroller;
  uint256 blockPosted;
  uint256 timestampPosted;
}

```

```solidity
struct VenusPoolMetaData {
  string category;
  string logoURL;
  string description;
}

```

### getAllPools

Get all pools in PoolRegistry

```solidity
function getAllPools() external view returns (struct PoolRegistryInterface.VenusPool[])
```

---

### getPoolByComptroller

Get a pool by comptroller address

```solidity
function getPoolByComptroller(address comptroller) external view returns (struct PoolRegistryInterface.VenusPool)
```

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

### getVenusPoolMetadata

Get the metadata of a Pool by comptroller address

```solidity
function getVenusPoolMetadata(address comptroller) external view returns (struct PoolRegistryInterface.VenusPoolMetaData)
```

---
