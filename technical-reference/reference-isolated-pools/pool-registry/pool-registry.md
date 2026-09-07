# PoolRegistry

[`PoolRegistry`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/Pool/PoolRegistry.sol) is an upgradeable directory and administration entry point. It registers an already deployed Comptroller proxy; it does not expose a `createRegistryPool` function.

See the [engine version map](../README.md#mainnet-implementation-map) for current mainnet proxy and implementation addresses.

## Initialization

```solidity
function initialize(address accessControlManager) external;
```

Initialization configures `Ownable2StepUpgradeable` and `AccessControlledV8`. It must be performed through the proxy exactly once.

## Privileged operations

All four operations below call `AccessControlManager`. Authorization is checked against the exact signature shown.

### `addPool`

```solidity
function addPool(
    string name,
    Comptroller comptroller,
    uint256 closeFactor,
    uint256 liquidationIncentive,
    uint256 minLiquidatableCollateral
) external returns (uint256 index);
```

Authorization signature: `addPool(string,address,uint256,uint256,uint256)`.

The Comptroller and its oracle must already exist. The call registers the Comptroller proxy and then configures the pool's close factor, liquidation incentive, and minimum liquidatable collateral. It does not deploy a pool.

### `addMarket`

```solidity
struct AddMarketInput {
    VToken vToken;
    uint256 collateralFactor;
    uint256 liquidationThreshold;
    uint256 initialSupply;
    address vTokenReceiver;
    uint256 supplyCap;
    uint256 borrowCap;
}

function addMarket(AddMarketInput input) external;
```

Authorization signature: `addMarket(AddMarketInput)`.

The VToken must belong to a registered Comptroller. The call lists the market, sets risk factors and caps, records the underlying-to-VToken mapping, transfers `initialSupply` from the caller, and calls `mintBehalf(vTokenReceiver, amountReceived)`. The caller pays the underlying; the receiver gets the vTokens.

### Metadata changes

```solidity
function setPoolName(address comptroller, string name) external;

function updatePoolMetadata(
    address comptroller,
    VenusPoolMetaData metadata
) external;
```

Authorization signatures are `setPoolName(address,string)` and `updatePoolMetadata(address,VenusPoolMetaData)`. Pool names are limited to 100 bytes.

## Read API

```solidity
function getAllPools() external view returns (VenusPool[] memory);
function getPoolByComptroller(address comptroller) external view returns (VenusPool memory);
function getVTokenForAsset(address comptroller, address asset) external view returns (address);
function getPoolsSupportedByAsset(address asset) external view returns (address[] memory);
function getVenusPoolMetadata(address comptroller) external view returns (VenusPoolMetaData memory);
function metadata(address comptroller) external view returns (string, string, string);
```

`getAllPools()` iterates over the complete registry and is intended for offchain calls. `_supportedPools` maps an **asset** to Comptroller proxy addresses—not a pool to its assets.

The implementation also inherits `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and owner-only `setAccessControlManager`.

## Lifecycle boundary

PoolRegistry has no removal method or supported-product flag. A returned pool can be active, paused, unlisted in part, or retained for exits. Registry results are therefore discovery data, not an instruction to open a new position.
