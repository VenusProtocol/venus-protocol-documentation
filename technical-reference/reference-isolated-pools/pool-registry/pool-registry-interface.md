# PoolRegistryInterface

The current [`PoolRegistryInterface`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/Pool/PoolRegistryInterface.sol) defines two return structures and five read functions.

## Structures

```solidity
struct VenusPool {
    string name;
    address creator;
    address comptroller;
    uint256 blockPosted;
    uint256 timestampPosted;
}

struct VenusPoolMetaData {
    string category;
    string logoURL;
    string description;
}
```

`comptroller` is the pool's Comptroller **proxy**, not an implementation address. `creator`, `blockPosted`, and `timestampPosted` describe registration; they do not prove that the pool is currently promoted or that every market is listed.

## Read API

```solidity
function getAllPools() external view returns (VenusPool[] memory);

function getPoolByComptroller(
    address comptroller
) external view returns (VenusPool memory);

function getVTokenForAsset(
    address comptroller,
    address asset
) external view returns (address);

function getPoolsSupportedByAsset(
    address asset
) external view returns (address[] memory);

function getVenusPoolMetadata(
    address comptroller
) external view returns (VenusPoolMetaData memory);
```

The registry has no active/deprecated flag and does not remove exit or debt obligations. Consumers must combine these results with Comptroller listing and pause state, VToken balances and debt, and the documented product lifecycle.
