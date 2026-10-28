# ProtocolShareReserve

`ProtocolShareReserve` (PSR) records and distributes protocol income received from Venus markets and supported products. It is a current, cross-pool component deployed on multiple networks; its location in the Isolated Pools reference tree does not mean it was deprecated with the standalone Isolated Pools interface.

This page describes the source on [`protocol-reserve` `develop`](https://github.com/VenusProtocol/protocol-reserve/blob/develop/contracts/ProtocolReserve/ProtocolShareReserve.sol), which carries the multiple pool registry support from [protocol-reserve#168](https://github.com/VenusProtocol/protocol-reserve/pull/168). That change is deployed on BNB Chain but is not in the `v3.5.0` release or on `main`, so a deployment on another chain may still run the single-registry implementation. Constructor immutables, proxy implementations, PoolRegistry addresses, distribution targets, and accumulated balances are deployment-specific and must be verified on the relevant chain.

At BNB Chain mainnet block `118349571` (August 27, 2026, 08:12:46 UTC), the PSR proxy was [`0xCa01D5A9A248a830E9D93231e791B1afFed7c446`](https://bscscan.com/address/0xCa01D5A9A248a830E9D93231e791B1afFed7c446), its implementation was [`0x4eC6D748a2647000895b455c408f85602A144Ed6`](https://bscscan.com/address/0x4eC6D748a2647000895b455c408f85602A144Ed6), and `totalDistributions()` returned 18. Treat these as a dated snapshot, not permanent configuration. [VIP-668](https://app.venus.io/#/governance/proposal/668?chainId=56) has since upgraded that proxy to the multiple-registry implementation [`0x842B9774eeff04b0497fA52d5F235A79D144764b`](https://bscscan.com/address/0x842B9774eeff04b0497fA52d5F235A79D144764b) and registered the [hub-funded spoke pools](../spoke/README.md) registry alongside the isolated pools one: at block `130272555`, `getPoolRegistries()` returned [`0x9F7b01A536aFA00EF10310A162877fd792cD0666`](https://bscscan.com/address/0x9F7b01A536aFA00EF10310A162877fd792cD0666) and [`0x372D0eE44993B5c6eb641364BAB939311e8e5B4c`](https://bscscan.com/address/0x372D0eE44993B5c6eb641364BAB939311e8e5B4c).

## Income and distribution types

```solidity
enum IncomeType {
    SPREAD,
    LIQUIDATION,
    ERC4626_WRAPPER_REWARDS,
    FLASHLOAN,
    INSTITUTIONAL_VAULT_PROTOCOL_FEE,
    INSTITUTIONAL_VAULT_LIQUIDATION
}

enum Schema {
    PROTOCOL_RESERVES,
    ADDITIONAL_REVENUE
}

struct DistributionConfig {
    Schema schema;
    uint16 percentage;
    address destination;
}
```

`SPREAD` income maps to `PROTOCOL_RESERVES`. Every other `IncomeType` maps to `ADDITIONAL_REVENUE`. `percentage` is denominated in basis points against `MAX_PERCENT = 10_000`; it is not a human-readable percentage.

For each schema, the configured percentages must total either zero or 10,000. PSR has no built-in 50/50 split. Governance configuration determines the actual destinations and allocations.

## Deployment-specific state

### Constructor immutables

```solidity
function CORE_POOL_COMPTROLLER() external view returns (address);

function WBNB() external view returns (address);

function vBNB() external view returns (address);
```

These values are set on the implementation constructor. Their BNB-oriented names are part of the shared contract API; verify the values rather than assuming the BNB Chain addresses on another deployment.

### Pool and loop configuration

```solidity
function poolRegistry() external view returns (address);

function getPoolRegistries() external view returns (address[] memory registries);

function maxLoopsLimit() external view returns (uint256);
```

`poolRegistry` is the primary registry. `getPoolRegistries` returns every registry the PSR resolves markets through, primary first, and is the read to use: the PSR can hold additional registries beyond the primary one, and `poolRegistry` alone does not show them.

`maxLoopsLimit` bounds both the number of distribution targets accepted by configuration updates and the number of additional registries. The target array itself is dynamic governance state.

## Accounting state

```solidity
function assetsReserves(
    address comptroller,
    address asset,
    Schema schema
) external view returns (uint256);

function totalAssetReserve(address asset) external view returns (uint256);

function distributionTargets(
    uint256 index
) external view returns (Schema schema, uint16 percentage, address destination);
```

`assetsReserves` is an internal accounting attribution. `totalAssetReserve` is the accounted total for an asset across pools and schemas; it is not necessarily equal to the ERC-20 `balanceOf(PSR)` if tokens arrived but have not yet been attributed.

## Initialization and owner configuration

### initialize

```solidity
function initialize(
    address accessControlManager_,
    uint256 loopsLimit_
) external;
```

Initializes the proxy's ACM, reentrancy guard, and maximum loop limit. It can run only once through the initializer guard.

### setPoolRegistry

```solidity
function setPoolRegistry(address poolRegistry_) external;
```

Only the contract owner can call this function. The new PoolRegistry address must be nonzero, and must not already be one of the additional registries (`PoolRegistryAlreadyAdded`). It **replaces** the primary registry rather than adding to it, so every market of the outgoing registry stops resolving and `updateAssetsState` begins reverting for them. To bring a second registry's pools in, use `addPoolRegistry`.

### addPoolRegistry

```solidity
function addPoolRegistry(address poolRegistry_) external;
```

Only the contract owner can call this function. Registers an additional registry, keeping the primary one in place, and emits `PoolRegistryAdded`. The address must be nonzero, must not be the primary registry and must not already be registered (`PoolRegistryAlreadyAdded`); the additional set is bounded by `maxLoopsLimit`.

This is what makes a second registry's pools work at all, not merely report income: `updateAssetsState` reverts for a market no registry lists, and vTokens call it both when reducing reserves and when seizing the protocol's share of liquidated collateral.

### removePoolRegistry

```solidity
function removePoolRegistry(address poolRegistry_) external;
```

Only the contract owner can call this function. Removes an additional registry and emits `PoolRegistryRemoved`; the address must be in the additional set (`PoolRegistryNotFound`). The primary registry cannot be removed this way.

Markets that no remaining registry lists stop working rather than merely stop reporting income. `updateAssetsState` reverts for them, from the protocol seize during liquidation and from `accrueInterest` once `reduceReservesBlockDelta` passes, so supply, withdraw, borrow, repay and liquidate all revert from that point. Adding the registry back restores them.

### setMaxLoopsLimit

```solidity
function setMaxLoopsLimit(uint256 limit) external;
```

Only the contract owner can call this function. Emits `MaxLoopsLimitUpdated`. A limit of `type(uint128).max` or more is rejected (`InvalidMaxLoopsLimit`), since it would be no cap at all.

## Distribution configuration

### addOrUpdateDistributionConfigs

```solidity
function addOrUpdateDistributionConfigs(
    DistributionConfig[] calldata configs
) external;
```

This function is restricted through ACM permission for `addOrUpdateDistributionConfigs(DistributionConfig[])`. It updates a row with the same `(schema, destination)` pair or appends a new row.

After processing the batch:

* each destination must be nonzero;
* each schema's total allocation must be zero or 10,000 bps; and
* the number of target rows must not exceed `maxLoopsLimit`.

### removeDistributionConfig

```solidity
function removeDistributionConfig(
    Schema schema,
    address destination
) external;
```

This cleanup function is restricted through ACM permission for `removeDistributionConfig(Schema,address)`. It removes a matching row only when that row's percentage has already been set to zero. An authorized caller cannot use it to remove a nonzero allocation or choose a replacement destination: a row that still holds a share reverts with `NonZeroPercentage`, and a `(schema, destination)` pair that does not exist reverts with `DistributionConfigNotFound`. Zero the percentage out with `addOrUpdateDistributionConfigs` first, so the remaining targets keep summing to 100%. The function re-checks the per-schema percentage invariant after removal.

## Recording income

### updateAssetsState

```solidity
function updateAssetsState(
    address comptroller,
    address asset,
    IncomeType incomeType
) public;
```

This function is permissionless but validates its attribution inputs:

* `comptroller.isComptroller()` must return true;
* `asset` must be nonzero; and
* for a non-Core Comptroller, one of the registries in `getPoolRegistries()` must return a vToken for that `(comptroller, asset)` pair. The primary registry is probed first and the additional ones in registration order; the first hit passes.

The function does not receive an amount. It reads the current ERC-20 balance and compares it with `totalAssetReserve[asset]`. If the balance is higher, the entire positive difference is attributed to the supplied Comptroller and the schema derived from `incomeType`.

Consequently, a direct token transfer does not identify its own pool or income type. The first later valid `updateAssetsState` call can attribute that unaccounted balance difference to its arguments. Integrators should transfer and update state in the intended protocol flow and should not infer provenance from the token transfer alone.

## Releasing income

### releaseFunds

```solidity
function releaseFunds(
    address comptroller,
    address[] calldata assets
) external;
```

Any address can trigger a release. The caller selects only the already-accounted Comptroller and asset list; on-chain distribution rows determine the recipients and percentages.

For each asset, PSR:

1. reads the recorded balance for both schemas;
2. calculates each destination amount as `schemaBalance × percentage / 10_000`;
3. transfers the ERC-20 to the configured destination;
4. calls `destination.updateAssetsState(comptroller, asset)`; and
5. subtracts the amounts transferred from `assetsReserves` and `totalAssetReserve`.

Integer division rounds each destination amount down, so a small remainder can stay recorded in PSR. If a token transfer or destination callback reverts, the transaction reverts rather than completing a partial distribution.

## Read helpers

### getUnreleasedFunds

```solidity
function getUnreleasedFunds(
    address comptroller,
    Schema schema,
    address destination,
    address asset
) external view returns (uint256);
```

Returns the destination's current pro-rata share of the recorded schema balance, or zero if no matching distribution row exists.

### getPercentageDistribution

```solidity
function getPercentageDistribution(
    address destination,
    Schema schema
) external view returns (uint256);
```

Returns the configured basis-point percentage for the `(destination, schema)` pair, or zero if it is not configured.

### totalDistributions

```solidity
function totalDistributions() external view returns (uint256);
```

Returns the current number of rows in `distributionTargets`.

For the current BNB Chain mainnet downstream route, see [Protocol income, RiskFundV2, and bad-debt handling](../../../risk/risk-fund-and-shortfall-handling.md) and [TokenBuyback](../../../whats-new/token-converter.md).
