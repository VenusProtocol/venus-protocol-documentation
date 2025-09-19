# RiskStewardReceiver

Contract that can read updates from the Chaos Labs Risk Oracle, validate them, and push them to the correct RiskSteward.

# Solidity API

### riskParameterConfigs

Mapping of supported risk configurations and their validation parameters

```solidity
mapping(string => struct RiskParamConfig) riskParameterConfigs
```

- - -

### RISK_ORACLE

Whitelisted oracle address to receive updates from

```solidity
contract IRiskOracle RISK_ORACLE
```

- - -

### lastProcessedTime

Mapping of market and update type to last update timestamp. Used for debouncing updates.

```solidity
mapping(bytes => uint256) lastProcessedTime
```

- - -

### processedUpdates

Mapping of processed updates. Used to prevent re-execution

```solidity
mapping(uint256 => bool) processedUpdates
```

- - -

### UPDATE_EXPIRATION_TIME

Time before a submitted update is considered stale

```solidity
uint256 UPDATE_EXPIRATION_TIME
```

- - -

### initialize

Initializes the contract as ownable, pausable, and access controlled

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | The address of the access control manager |

- - -

### pause

Pauses processing of updates

```solidity
function pause() external
```

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### unpause

Unpauses processing of updates

```solidity
function unpause() external
```

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setRiskParameterConfig

Sets the risk parameter config for a given update type

```solidity
function setRiskParameterConfig(string updateType, address riskSteward, uint256 debounce) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to configure |
| riskSteward | address | The address for the risk steward contract responsible for processing the update |
| debounce | uint256 | The debounce period for the update |

#### 📅 Events
* Emits RiskParameterConfigSet with the update type, previous risk steward, new risk steward, previous debounce,
* new debounce, previous active status, and new active status

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is an empty string
* Throws InvalidDebounce if the debounce is 0
* Throws ZeroAddressNotAllowed if the risk steward address is zero

- - -

### toggleConfigActive

Toggles the active status of a risk parameter config

```solidity
function toggleConfigActive(string updateType) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to toggle on or off |

#### 📅 Events
* Emits ToggleConfigActive with the update type and the new active status

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is not supported

- - -

### processUpdateById

Processes an update by its ID. Will validate that the update configuration is active, is not expired, unprocessed, and that the debounce period has passed.
Validated updates will be processed by the associated risk steward contract which will perform update specific validations and apply validated updates.

```solidity
function processUpdateById(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The ID of the update to process |

#### 📅 Events
* Emits RiskParameterUpdated with the update ID

#### ❌ Errors
* Throws ConfigNotActive if the config is not active
* Throws UpdateIsExpired if the update is expired
* Throws ConfigAlreadyProcessed if the update has already been processed
* Throws UpdateTooFrequent if the update is too frequent

- - -

### processUpdateByParameterAndMarket

Processes the latest update for a given parameter and market. Will validate that the update configuration is active, is not expired,
unprocessed, and that the debounce period has passed.
Validated updates will be processed by the associated risk steward contract which will perform update specific validations and apply validated updates.

```solidity
function processUpdateByParameterAndMarket(string updateType, address market) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to process |
| market | address | The market to process the update for |

#### 📅 Events
* Emits RiskParameterUpdated with the update ID

#### ❌ Errors
* Throws ConfigNotActive if the config is not active
* Throws UpdateIsExpired if the update is expired
* Throws ConfigAlreadyProcessed if the update has already been processed
* Throws UpdateTooFrequent if the update is too frequent

- - -

