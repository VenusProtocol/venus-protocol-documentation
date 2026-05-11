# DeviationBoundedOracle
The DeviationBoundedOracle provides manipulation-resistant pricing for lending operations.

It maintains a per-market rolling min/max price window. When the current spot price deviates
significantly from the window bounds, protection mode activates automatically and conservative
pricing kicks in:
  - Collateral is valued at min(spot, windowMin) — caps collateral value at recent window low
  - Debt is valued at max(spot, windowMax) — floors debt value at recent window high

This protects against instantaneous or short-duration price manipulation attacks on low-liquidity
collateral tokens. Sustained attacks beyond the window period are expected to be handled by
off-chain monitoring systems.

The oracle exposes both view and non-view price functions. The non-view variants update the
price window and trigger protection. The view variants read stored state only. A transient
price cache avoids redundant ResilientOracle calls within the same transaction when
updateProtectionState is called before the view price reads.

For a feature-level description of how protection mode behaves end-to-end (problem statement,
trigger logic, keeper role, exit conditions), see [Protection Mode](../../risk/protection-mode.md).

# Solidity API

```solidity
enum PriceBoundType {
  MIN,
  MAX
}
```

```solidity
enum KeeperAction {
  SetMinPrice,
  SetMaxPrice,
  ExitProtectionMode
}
```

### MarketProtectionState

Per-asset protection state tracking the min/max price window

- - -

```solidity
struct MarketProtectionState {
  uint128 minPrice;
  uint128 maxPrice;
  bool currentlyUsingProtectedPrice;
  bool isBoundedPricingEnabled;
  uint64 lastProtectionTriggeredAt;
  uint64 cooldownPeriod;
  address asset;
  uint128 triggerThreshold;
  uint128 resetThreshold;
  bool cachingEnabled;
}
```

### KeeperActionItem

One item in a syncPriceBoundsAndProtections payload

- - -

```solidity
struct KeeperActionItem {
  address asset;
  enum IDeviationBoundedOracle.KeeperAction action;
  uint256 value;
}
```

### TokenConfigInput

One item in a setTokenConfigs payload

- - -

```solidity
struct TokenConfigInput {
  address asset;
  uint64 cooldownPeriod;
  uint256 triggerThreshold;
  uint256 resetThreshold;
  bool enableBoundedPricing;
  bool enableCaching;
}
```

### MIN_THRESHOLD

Minimum allowed threshold value (5%) to account for keeper deadband

```solidity
uint256 MIN_THRESHOLD
```

- - -

### MAX_THRESHOLD

Maximum allowed threshold value (50%)

```solidity
uint256 MAX_THRESHOLD
```

- - -

### KEEPER_DEADBAND

Keeper deadband threshold (5%). Used by `checkAndGetWindowDrift` (a view) so the off-chain keeper can skip pushes whose delta is below the deadband. Not enforced on-chain inside `updateMinPrice` / `updateMaxPrice` — those only validate the spot bound and the cross bound.

```solidity
uint256 KEEPER_DEADBAND
```

- - -

### RESILIENT_ORACLE

Resilient Oracle used to fetch spot prices

```solidity
contract ResilientOracleInterface RESILIENT_ORACLE
```

- - -

### nativeMarket

Native market address

```solidity
address nativeMarket
```

- - -

### vai

VAI address

```solidity
address vai
```

- - -

### COLLATERAL_PRICE_CACHE_SLOT

Transient storage slot for caching final collateral prices within a transaction

```solidity
bytes32 COLLATERAL_PRICE_CACHE_SLOT
```

- - -

### DEBT_PRICE_CACHE_SLOT

Transient storage slot for caching final debt prices within a transaction

```solidity
bytes32 DEBT_PRICE_CACHE_SLOT
```

- - -

### NATIVE_TOKEN_ADDR

Set this as asset address for Native token on each chain.This is the underlying for vBNB (on bsc)
and can serve as any underlying asset of a market that supports native tokens

```solidity
address NATIVE_TOKEN_ADDR
```

- - -

### assetProtectionConfig

Per-asset protection state

```solidity
mapping(address => struct IDeviationBoundedOracle.MarketProtectionState) assetProtectionConfig
```

- - -

### allAssets

Append-only array of all assets ever initialized, used for enumeration

```solidity
address[] allAssets
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(contract ResilientOracleInterface _resilientOracle, address nativeMarketAddress, address vaiAddress) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _resilientOracle | contract ResilientOracleInterface | Address of the ResilientOracle contract |
| nativeMarketAddress | address | The address of a native market (for bsc it would be vBNB address) |
| vaiAddress | address | The address of the VAI token, or address(0) if VAI is not deployed on the chain. |

- - -

### initialize

Initializes the contract admin

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | Address of the access control manager contract |

- - -

### getBoundedCollateralPrice

Gets the bounded collateral price for a given vToken, updating protection state

```solidity
function getBoundedCollateralPrice(address vToken) external returns (uint256 collateralPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| collateralPrice | uint256 | The bounded collateral price |

#### 📅 Events
* MinPriceUpdated if a new window minimum is recorded
* MaxPriceUpdated if a new window maximum is recorded
* ProtectionTriggered if the spot price deviates beyond the threshold

- - -

### getBoundedDebtPrice

Gets the bounded debt price for a given vToken, updating protection state

```solidity
function getBoundedDebtPrice(address vToken) external returns (uint256 debtPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| debtPrice | uint256 | The bounded debt price |

#### 📅 Events
* MinPriceUpdated if a new window minimum is recorded
* MaxPriceUpdated if a new window maximum is recorded
* ProtectionTriggered if the spot price deviates beyond the threshold

- - -

### getBoundedPrices

Gets both the bounded collateral and debt prices for a given vToken, updating protection state

```solidity
function getBoundedPrices(address vToken) external returns (uint256 collateralPrice, uint256 debtPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| collateralPrice | uint256 | The bounded collateral price |
| debtPrice | uint256 | The bounded debt price |

#### 📅 Events
* MinPriceUpdated if a new window minimum is recorded
* MaxPriceUpdated if a new window maximum is recorded
* ProtectionTriggered if the spot price deviates beyond the threshold

- - -

### updateProtectionState

Fetches the spot price, updates the protection window, and (when the asset's `cachingEnabled` flag is `true`) caches the resolved collateral and debt prices in transient storage for the duration of the transaction. When `cachingEnabled` is `false`, the window/trigger update still happens but no cache write occurs and subsequent view reads recompute live from spot.

```solidity
function updateProtectionState(address vToken) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### 📅 Events
* MinPriceUpdated if a new window minimum is recorded
* MaxPriceUpdated if a new window maximum is recorded
* ProtectionTriggered if the spot price deviates beyond the threshold

- - -

### getBoundedCollateralPriceView

Gets the bounded collateral price for a given vToken (view variant)

```solidity
function getBoundedCollateralPriceView(address vToken) external view returns (uint256 collateralPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| collateralPrice | uint256 | The bounded collateral price |

- - -

### getBoundedDebtPriceView

Gets the bounded debt price for a given vToken (view variant)

```solidity
function getBoundedDebtPriceView(address vToken) external view returns (uint256 debtPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| debtPrice | uint256 | The bounded debt price |

- - -

### getBoundedPricesView

Gets both the bounded collateral and debt prices for a given vToken (view variant)

```solidity
function getBoundedPricesView(address vToken) external view returns (uint256 collateralPrice, uint256 debtPrice)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| collateralPrice | uint256 | The bounded collateral price |
| debtPrice | uint256 | The bounded debt price |

- - -

### updateMinPrice

Updates the minimum price in the rolling window for a given asset. On-chain validation requires `newMin <= maxPrice` and `newMin <= currentSpot`; the 5% `KEEPER_DEADBAND` is *not* enforced here — the keeper consults `checkAndGetWindowDrift` off-chain to decide whether the push is worth it.

```solidity
function updateMinPrice(address asset, uint128 newMin) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| newMin | uint128 | The new minimum price |

#### 📅 Events
* MinPriceUpdated

#### ⛔️ Access Requirements
* Only authorized keeper addresses

#### ❌ Errors
* ZeroPriceNotAllowed if newMin is zero
* MarketNotInitialized if the asset has not been initialized
* InvalidMinPrice if newMin exceeds the current spot or is strictly above maxPrice

- - -

### updateMaxPrice

Updates the maximum price in the rolling window for a given asset. On-chain validation requires `newMax >= minPrice` and `newMax >= currentSpot`; the 5% `KEEPER_DEADBAND` is *not* enforced here — the keeper consults `checkAndGetWindowDrift` off-chain to decide whether the push is worth it.

```solidity
function updateMaxPrice(address asset, uint128 newMax) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| newMax | uint128 | The new maximum price |

#### 📅 Events
* MaxPriceUpdated

#### ⛔️ Access Requirements
* Only authorized keeper addresses

#### ❌ Errors
* ZeroPriceNotAllowed if newMax is zero
* MarketNotInitialized if the asset has not been initialized
* InvalidMaxPrice if newMax is below the current spot or is strictly below minPrice

- - -

### exitProtectionMode

Exits protection mode for a given asset

```solidity
function exitProtectionMode(address asset) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |

#### 📅 Events
* ProtectionModeExited

#### ⛔️ Access Requirements
* Only authorized monitor/keeper addresses

#### ❌ Errors
* ProtectedPriceInactive if protection is not currently active
* CooldownNotElapsed if cooldown period has not elapsed
* PriceRangeNotConverged if window range is still above exit threshold

- - -

### syncPriceBoundsAndProtections

Dispatches a batch of keeper-only actions (set min, set max, or exit protection) under a single ACM check

```solidity
function syncPriceBoundsAndProtections(struct IDeviationBoundedOracle.KeeperActionItem[] actions) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| actions | struct IDeviationBoundedOracle.KeeperActionItem[] | The list of keeper actions to apply |

#### 📅 Events
* MinPriceUpdated, MaxPriceUpdated, ProtectionModeExited

#### ⛔️ Access Requirements
* Only authorized keeper addresses

#### ❌ Errors
* InvalidKeeperAction if an item carries an unsupported action enum value

- - -

### setTokenConfig

Initializes protection for a new asset. The window is seeded with the current spot from the ResilientOracle (so the oracle must be live for the asset). Whitelist participation is independent of initialization — `enableBoundedPricing` may be `false`, in which case the asset is configured but the DBO short-circuits to spot until governance flips the flag with `setAssetBoundedPricingEnabled`.

```solidity
function setTokenConfig(struct IDeviationBoundedOracle.TokenConfigInput tokenConfig_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig_ | struct IDeviationBoundedOracle.TokenConfigInput | Token config input for the asset |

#### 📅 Events
* ProtectionInitialized
* BoundedPricingWhitelistUpdated

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ZeroAddressNotAllowed if asset is the zero address
* ZeroValueNotAllowed if cooldownPeriod, triggerThreshold, or resetThreshold is zero
* MarketAlreadyInitialized if the asset has already been initialized
* ThresholdBelowMinimum if triggerThreshold is below 5%
* ThresholdAboveMaximum if triggerThreshold is above 50%
* InvalidResetThreshold if resetThreshold is at or above triggerThreshold
* VAINotAllowed if asset is the VAI token
* PriceExceedsUint128 if the seeded spot price overflows uint128

- - -

### setTokenConfigs

Batch-initializes protection for multiple assets in a single transaction. Per-item validation matches `setTokenConfig`; any item revert rolls back the whole batch.

```solidity
function setTokenConfigs(struct IDeviationBoundedOracle.TokenConfigInput[] tokenConfigs_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct IDeviationBoundedOracle.TokenConfigInput[] | Array of token config inputs, one per asset |

#### 📅 Events
* ProtectionInitialized for each asset
* BoundedPricingWhitelistUpdated for each asset

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* InvalidArrayLength if the input array is empty
* Any error raised by per-item validation (see `setTokenConfig`)

- - -

### setCooldownPeriod

Sets the cooldown period for an asset

```solidity
function setCooldownPeriod(address asset, uint64 newCooldown) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| newCooldown | uint64 | The new cooldown period in seconds |

#### 📅 Events
* CooldownPeriodSet

#### ⛔️ Access Requirements
* Only Governance

- - -

### setThresholds

Sets the trigger and reset thresholds for an asset

```solidity
function setThresholds(address asset, uint256 newTriggerThreshold, uint256 newResetThreshold) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| newTriggerThreshold | uint256 | The new trigger threshold (mantissa). Must be between 5% and 50% and above the reset threshold. |
| newResetThreshold | uint256 | The new reset threshold (mantissa). Must be non-zero and below the trigger threshold. |

#### 📅 Events
* TriggerThresholdSet if the trigger threshold changed
* ResetThresholdSet if the reset threshold changed

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ThresholdBelowMinimum if newTriggerThreshold is below 5%
* ThresholdAboveMaximum if newTriggerThreshold is above 50%
* InvalidResetThreshold if newResetThreshold is at or above newTriggerThreshold

- - -

### setAssetBoundedPricingEnabled

Sets whether an asset is enabled for bounded pricing

```solidity
function setAssetBoundedPricingEnabled(address asset, bool enabled) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| enabled | bool | Whether bounded pricing should be enabled for the asset |

#### 📅 Events
* BoundedPricingWhitelistUpdated

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ProtectedPriceActive if trying to disable an asset while protection is active

- - -

### setCachingEnabled

Toggles transient caching of the bounded (collateral, debt) pair for an asset

```solidity
function setCachingEnabled(address asset, bool enabled) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |
| enabled | bool | Whether transient caching is enabled for this asset |

#### 📅 Events
* CachingEnabledUpdated

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* MarketNotInitialized if the asset has not been initialized

- - -

### getInitializedAssets

Returns all asset addresses that have ever been initialized

```solidity
function getInitializedAssets() external view returns (address[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | Array of all initialized asset addresses |

- - -

### isBoundedPricingEnabled

Checks if an asset is whitelisted for bounded pricing

```solidity
function isBoundedPricingEnabled(address asset) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the asset is whitelisted |

- - -

### currentlyUsingProtectedPrice

Checks if the asset is currently using the protected (bounded) price

```solidity
function currentlyUsingProtectedPrice(address asset) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the asset is currently using the protected price instead of spot |

- - -

### getAllBoundedPricingEnabledAssets

Returns all currently whitelisted asset addresses

```solidity
function getAllBoundedPricingEnabledAssets() external view returns (address[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | result Array of whitelisted asset addresses |

- - -

### canExitProtection

Checks if protection can be exited for an asset

```solidity
function canExitProtection(address asset) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | The underlying asset address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if protection can be disabled |

- - -

### checkAndGetWindowDrift

Batch-checks which assets' on-chain min/max have drifted beyond the deadband
        from the keeper's proposed window values

```solidity
function checkAndGetWindowDrift(address[] assets, uint128[] proposedMins, uint128[] proposedMaxs) external view returns (bool[] needsMinUpdate, bool[] needsMaxUpdate)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| assets | address[] | Array of asset addresses to check |
| proposedMins | uint128[] | Keeper's off-chain window minimum prices |
| proposedMaxs | uint128[] | Keeper's off-chain window maximum prices |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| needsMinUpdate | bool[] | Whether minPrice drift exceeds deadband for each asset |
| needsMaxUpdate | bool[] | Whether maxPrice drift exceeds deadband for each asset |

#### ❌ Errors
* InvalidArrayLength if the input array lengths do not match

- - -
