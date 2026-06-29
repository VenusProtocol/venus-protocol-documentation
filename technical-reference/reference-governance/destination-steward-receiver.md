# DestinationStewardReceiver
Destination‑chain contract that receives bridged updates from `RiskStewardReceiver` via LayerZero,
        enforces a fixed remote delay, and then executes the updates on the configured `IRiskSteward` contracts.

# Solidity API

### REMOTE_UPDATE_EXPIRATION_TIME

Time before a bridged update is considered stale on the destination chain

```solidity
uint256 REMOTE_UPDATE_EXPIRATION_TIME
```

- - -

### LAYER_ZERO_EID

Destination chain LayerZero endpoint ID

```solidity
uint32 LAYER_ZERO_EID
```

- - -

### remoteDelay

Delay before a bridged update can be executed on the destination chain

```solidity
uint256 remoteDelay
```

- - -

### riskParameterConfigs

Mapping of supported risk configurations per update type (hashed updateType string)

```solidity
mapping(bytes32 => struct IDestinationStewardReceiver.RiskParamConfig) riskParameterConfigs
```

- - -

### updates

Master storage of all bridged updates by update ID

```solidity
mapping(uint256 => struct IDestinationStewardReceiver.DestinationUpdate) updates
```

- - -

### lastRegisteredUpdateId

Mapping from (updateType, market) to currently registered remote update ID

```solidity
mapping(bytes32 => mapping(address => uint256)) lastRegisteredUpdateId
```

- - -

### lastExecutedAt

Track last executed update timestamp per (updateType, market)

```solidity
mapping(bytes32 => mapping(address => uint256)) lastExecutedAt
```

- - -

### whitelistedExecutors

Mapping from executor address to whitelist status

```solidity
mapping(address => bool) whitelistedExecutors
```

- - -

### constructor

Disables initializers and sets immutable values.

```solidity
constructor(address endpoint_, uint32 layerZeroEid_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| endpoint_ | address | Local LayerZero endpoint on this chain |
| layerZeroEid_ | uint32 | LayerZero endpoint ID for this destination chain |

- - -

### initialize

Initializes the contract with the Access Control Manager and owner.

```solidity
function initialize(address accessControlManager_, address delegate_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | The address of the access control manager |
| delegate_ | address | The owner (and LayerZero delegate) of this contract |

- - -

### setRiskParameterConfig

Sets the risk parameter config for a given update type on the destination chain.

```solidity
function setRiskParameterConfig(string updateType, address riskSteward, uint256 debounce) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to configure (e.g., "supplyCap", "borrowCap") |
| riskSteward | address | The address for the risk steward contract responsible for processing the update |
| debounce | uint256 | The debounce period for updates of this type on the destination (anti‑DoS) |

#### 📅 Events
* Emits RiskParameterConfigUpdated

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* InvalidUpdateType if the update type string is empty
* InvalidDebounce if the debounce is 0

- - -

### setConfigActive

Sets the active status of a risk parameter config

```solidity
function setConfigActive(string updateType, bool active) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to configure |
| active | bool | The active status to set |

#### 📅 Events
* Emits ConfigActiveUpdated with the update type hash, update type, previous active status, and the active status

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is not supported
* Throws ConfigStatusUnchanged if the active status is already set to the desired value

- - -

### setRemoteDelay

Sets the remote delay before bridged updates can be executed on the destination chain.

```solidity
function setRemoteDelay(uint256 newRemoteDelay) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newRemoteDelay | uint256 | The new remote delay in seconds |

#### 📅 Events
* Emits RemoteDelaySet with the new remote delay value

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* InvalidRemoteDelay if the delay is 0 or greater than or equal to the remote update expiration time
* RemoteDelayUnchanged if the new delay is equal to the current delay

- - -

### setWhitelistedExecutor

Sets the whitelist status of an executor on the destination chain.

```solidity
function setWhitelistedExecutor(address executor, bool approved) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| executor | address | The address of the executor |
| approved | bool | The whitelist status to set (true to whitelist, false to remove) |

#### 📅 Events
* Emits ExecutorStatusUpdated with the executor address, previous approval status, and new approval status

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws ZeroAddressNotAllowed if the executor address is zero
* Throws ExecutorStatusUnchanged if the executor whitelist status is already set to the desired value

- - -

### executeUpdate

Executes a bridged update after its remote delay has passed.

```solidity
function executeUpdate(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The bridged update ID to execute |

#### 📅 Events
* Emits RemoteUpdateExecuted with the executed update ID

#### ⛔️ Access Requirements
* Only whitelisted executors can execute updates

#### ❌ Errors
* NotAnExecutor if the caller is not a whitelisted executor
* ConfigNotActive if the configuration for the update type is not active
* UpdateNotFound if the update is not pending for the given (updateType, market)
* UpdateNotUnlocked if the remote delay has not elapsed
* UpdateIsExpired if the bridged update has expired on the destination
* UpdateTooFrequent if the debounce period has not passed since the last execution

- - -

### rejectUpdate

Rejects a registered remote update on the destination chain.

```solidity
function rejectUpdate(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The oracle update ID of the update to reject |

#### 📅 Events
* Emits UpdateRejected with the rejected update ID

#### ⛔️ Access Requirements
* Only whitelisted executors can reject updates

#### ❌ Errors
* NotAnExecutor if the caller is not a whitelisted executor
* UpdateNotFound if there is no pending update with the given ID

- - -

### getExecutableUpdates

Returns executable updates for a given update type and comptroller.

```solidity
function getExecutableUpdates(string updateType, address comptroller) external view returns (uint256[] executableUpdates)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human‑readable identifier of the update type to filter by |
| comptroller | address | The address of the Isolated Pools Comptroller that manages the markets |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| executableUpdates | uint256[] | Array of update IDs that are ready to be executed |

- - -

### getRiskParameterConfig

Returns the risk parameter configuration for a given update type

```solidity
function getRiskParameterConfig(string updateType) external view returns (struct IDestinationStewardReceiver.RiskParamConfig)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IDestinationStewardReceiver.RiskParamConfig | The risk parameter configuration |

- - -

### getRegisteredUpdate

Returns the registered update for a given update type and market

```solidity
function getRegisteredUpdate(string updateType, address market) external view returns (struct IDestinationStewardReceiver.DestinationUpdate)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |
| market | address | The address of the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IDestinationStewardReceiver.DestinationUpdate | The registered update |

- - -

### getLastExecutedAt

Returns the last executed timestamp for a given update type and market

```solidity
function getLastExecutedAt(string updateType, address market) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |
| market | address | The address of the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The last executed timestamp |

- - -

### renounceOwnership

Disables renounceOwnership function

```solidity
function renounceOwnership() public pure
```

#### ❌ Errors
* Throws RenounceOwnershipNotAllowed

- - -

