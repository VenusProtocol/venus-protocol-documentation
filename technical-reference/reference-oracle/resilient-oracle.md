# ResilientOracle

`ResilientOracle` is the price-oracle interface used by Venus Comptrollers. It maps each underlying asset to a configurable main source and optional pivot and fallback sources, validates configured source pairs with `BoundValidator`, and returns a price or reverts.

This reference was checked against the oracle repository's stable [`main` implementation at `d40a413`](https://github.com/VenusProtocol/oracle/blob/d40a4133247eda414ae5d0ccea2d29d110659829/contracts/ResilientOracle.sol). Resolve the live proxy implementation before assuming a deployment uses this exact revision.

## Source roles

| Role | Purpose |
|---|---|
| `MAIN` | Preferred source and returned price when it passes the configured path |
| `PIVOT` | Anchor used to validate a main or fallback price within asset-specific bounds |
| `FALLBACK` | Alternate source considered when the main-to-pivot path does not return a price |

Roles are configured by underlying asset, not by provider type. An asset can have only a main source. If its pivot is disabled or unconfigured, a successful main-source response is returned without a bounds comparison.

When a pivot is enabled, price selection proceeds in this order:

1. return the main price if it validates against the pivot;
2. otherwise return the fallback price if it validates against the pivot;
3. otherwise return the main price if it validates against the fallback; or
4. revert with `invalid resilient oracle price`.

An unavailable or reverting source is treated as invalid for that path. A configured pivot that is enabled but fails to return a price does not silently become an unvalidated-main configuration; a valid main/fallback comparison is then required.

## Token configuration

```solidity
enum OracleRole {
    MAIN,
    PIVOT,
    FALLBACK
}

struct TokenConfig {
    address asset;
    address[3] oracles;
    bool[3] enableFlagsForOracles;
    bool cachingEnabled;
}
```

`oracles` and `enableFlagsForOracles` use the enum order `[MAIN, PIVOT, FALLBACK]`. The main address cannot be zero when a configuration is set. The contract stores configurations by underlying asset address.

## Price updates and transaction-local caching

`updatePrice(vToken)` resolves the market's underlying asset; `updateAssetPrice(asset)` accepts the asset directly. Both try to update a capped main-oracle snapshot. The call intentionally ignores a failed `updateSnapshot()` attempt because source adapters that do not implement the capped-oracle interface can revert there.

When `cachingEnabled` is true, the selected price is stored in transient storage and reused for the rest of the transaction. This is not a persistent cross-transaction cache. Integrations that rely on a capped main source should follow the expected update-before-read flow.

## Native asset handling

The implementation has immutable `nativeMarket`, `vai`, and `boundValidator` values. It represents a chain's native asset with:

```solidity
address constant NATIVE_TOKEN_ADDR = 0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB;
```

For `getUnderlyingPrice(vToken)`, the configured native market maps to this sentinel address, the VAI market maps to the immutable VAI address, and other markets are resolved through `underlying()`.

## Read API

### `getUnderlyingPrice`

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

Resolves the market's underlying asset and returns its selected USD price. Reverts when the oracle is paused, the market address is zero, the underlying cannot be resolved, or no configured validation path produces a valid price.

### `getPrice`

```solidity
function getPrice(address asset) external view returns (uint256)
```

Returns the selected USD price for an underlying asset. Reverts when paused or when no configured validation path produces a valid price.

### `getTokenConfig`

```solidity
function getTokenConfig(address asset) external view returns (TokenConfig memory)
```

Returns all three source addresses, their enable flags, and the transient-caching flag for an asset.

### `getOracle`

```solidity
function getOracle(address asset, OracleRole role) public view returns (address oracle, bool enabled)
```

Returns the source address and enable flag for one role.

### `updatePrice` and `updateAssetPrice`

```solidity
function updatePrice(address vToken) external
function updateAssetPrice(address asset) external
```

Update the capped main-source snapshot when supported and populate the transaction-local price cache when enabled. These functions are permissionless.

## Configuration API

The following functions are restricted through the Venus `AccessControlManager`; the authorized caller must be verified against the live deployment.

### `setTokenConfig` and `setTokenConfigs`

```solidity
function setTokenConfig(TokenConfig memory tokenConfig) public
function setTokenConfigs(TokenConfig[] memory tokenConfigs) external
```

Set or replace one or more complete asset configurations. The asset and main-source addresses must be nonzero, and a batch cannot be empty.

### `setOracle`

```solidity
function setOracle(address asset, address oracle, OracleRole role) external
```

Changes one role's source address on an existing configuration. The main source cannot be set to zero.

### `enableOracle`

```solidity
function enableOracle(address asset, OracleRole role, bool enable) external
```

Enables or disables one role on an existing configuration.

### `pause` and `unpause`

```solidity
function pause() external
function unpause() external
```

Pause or resume price reads for this `ResilientOracle` deployment.

## Initialization and events

The proxy initializer is:

```solidity
function initialize(address accessControlManager) external
```

The implementation emits `TokenConfigAdded`, `OracleSet`, `OracleEnabled`, and `CachedEnabled` for configuration changes. Read current state rather than reconstructing it from a partial event range.

## Live verification checklist

1. Read the relevant Comptroller's active oracle address.
2. Resolve the oracle proxy implementation and its immutable constructor values.
3. Call `paused()`, `getTokenConfig(asset)`, and `getOracle(asset, role)`.
4. Read the `BoundValidator` configuration for the same asset.
5. Resolve each enabled source proxy and confirm its feed, staleness, and asset-decimal configuration.
6. Review the latest executed governance actions for changes after any documentation snapshot.

See the [configuration snapshot](../../risk/resilient-price-oracle.md#current-configuration), [deployed oracle addresses](../../deployed-contracts/oracles.md), and [price source adapters](oracles/README.md).
