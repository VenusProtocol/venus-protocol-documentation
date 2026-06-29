# RiskStewardReceiver
Contract that reads updates from a Risk Oracle, validates them with timelock and debounce,
        and either executes them locally via the configured RiskSteward or forwards them cross‑chain.

# Solidity API

### UPDATE_EXPIRATION_TIME

Period after which a proposed update becomes expired and can no longer be applied

```solidity
uint256 UPDATE_EXPIRATION_TIME
```

- - -

### LAYER_ZERO_EID

Source chain LayerZero endpoint ID

```solidity
uint32 LAYER_ZERO_EID
```

- - -

### RISK_ORACLE

The Risk Oracle contract address

```solidity
contract IRiskOracle RISK_ORACLE
```

- - -

### paused

Pause flag

```solidity
bool paused
```

- - -

### riskParameterConfigs

Mapping of supported risk configurations and their validation parameters (keyed by hashed updateType)

```solidity
mapping(bytes32 => struct IRiskStewardReceiver.RiskParamConfig) riskParameterConfigs
```

- - -

### updates

Master storage of all registered updates by update ID

```solidity
mapping(uint256 => struct IRiskStewardReceiver.RegisteredUpdate) updates
```

- - -

### lastProcessedUpdate

Track last processed update ID per (updateTypeKey, market)

```solidity
mapping(bytes32 => mapping(address => uint256)) lastProcessedUpdate
```

- - -

### lastRegisteredUpdate

Track the current registered update per (updateType, market) to avoid registering multiple updates

```solidity
mapping(bytes32 => mapping(address => uint256)) lastRegisteredUpdate
```

- - -

### whitelistedExecutors

Mapping from executor address to whitelist status

```solidity
mapping(address => bool) whitelistedExecutors
```

- - -

### constructor

Disables initializers and sets the Risk Oracle and LayerZero configuration.

```solidity
constructor(address riskOracle_, address endpoint_, uint32 layerZeroLzEid_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| riskOracle_ | address | The address of the Risk Oracle contract. |
| endpoint_ | address | The LayerZero endpoint contract used by the underlying `OAppUpgradeable`. |
| layerZeroLzEid_ | uint32 | The LayerZero endpoint ID (EID) for this chain. |

- - -

### initialize

Initializes the contract with the Access Control Manager and OApp owner.

```solidity
function initialize(address acm_, address delegate_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| acm_ | address | The address of the Access Control Manager |
| delegate_ | address | The address of the OApp owner passed to `__OApp_init`. |

- - -

### receive

Accepts native tokens (e.g., BNB) sent to this contract.

```solidity
receive() external payable
```

- - -

### sweepNative

Allows the owner to sweep leftover native tokens (e.g., BNB) from the contract.

```solidity
function sweepNative() external
```

#### 📅 Events
* Emits SweepNative event.

- - -

### setPaused

Sets the pause status for `processUpdate`.

```solidity
function setPaused(bool paused_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| paused_ | bool | True to pause, false to unpause |

#### 📅 Events
* Emits PauseStatusUpdated

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

- - -

### setRiskParameterConfig

Sets the risk parameter config for a given update type

```solidity
function setRiskParameterConfig(string updateType, address riskSteward, uint256 debounce, uint256 timelock) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The type of update to configure |
| riskSteward | address | The address for the risk steward contract responsible for processing the update |
| debounce | uint256 | The debounce period for the update |
| timelock | uint256 | The timelock period before the update can be executed |

#### 📅 Events
* Emits RiskParameterConfigUpdated

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* InvalidUpdateType if the update type string is empty
* Throws InvalidDebounce if the debounce is 0
* Throws InvalidTimelock if the timelock is greater than or equal to the expiration time
* Throws ZeroAddressNotAllowed if the risk steward address is zero

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

### setWhitelistedExecutor

Manages the whitelist of executors that are allowed to execute timelocked registered updates.

```solidity
function setWhitelistedExecutor(address executor, bool approved) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| executor | address | The address of the executor |
| approved | bool | The whitelist status to set (true to whitelist, false to remove) |

#### 📅 Events
* Emits ExecutorStatusUpdated with the executor address, previous approval status, and approval status

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws ZeroAddressNotAllowed if the executor address is zero
* Throws ExecutorStatusUnchanged if the executor whitelist status is already set to the desired value

- - -

### processUpdate

Processes an update from the Risk Oracle. Validates, registers the update,
and either executes immediately, registers with timelock, or forwards cross-chain.

```solidity
function processUpdate(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The update ID from the oracle's perspective |

#### 📅 Events
* Emits UpdateRegistered, UpdateExecuted, or UpdateSentToDestination depending on the update type

#### ❌ Errors
* Throws UpdateAlreadyResolved if the update was already processed
* Throws UpdateIsExpired if the update has expired
* Throws ConfigNotActive if the config is not active
* Throws UpdateTooFrequent if the debounce period has not passed
* Throws RegisteredUpdateTypeExist if there is a non-expired pending update of the same type

- - -

### executeRegisteredUpdate

Executes a registered update. Only whitelisted executors can call this function.
        This function can be used for updates that have completed their timelock and are ready to execute.

```solidity
function executeRegisteredUpdate(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The oracle update ID of the update to execute |

#### 📅 Events
* Emits UpdateExecuted with the oracle update ID

#### ⛔️ Access Requirements
* Only whitelisted executors can call this function

#### ❌ Errors
* Throws NotAnExecutor if the caller is not a whitelisted executor
* Throws InvalidRegisteredUpdate if the update was never registered
* Throws UpdateAlreadyResolved if the update was already executed or rejected
* Throws UpdateIsExpired if the update has expired
* Throws ConfigNotActive if the config is not active
* Throws UpdateNotUnlocked if the unlock time has not passed

- - -

### rejectUpdate

Rejects a registered update

```solidity
function rejectUpdate(uint256 updateId) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The oracle update ID of the update to reject |

#### 📅 Events
* Emits UpdateRejected with the oracle update ID

#### ⛔️ Access Requirements
* Only whitelisted executors can call this function

#### ❌ Errors
* Throws UpdateAlreadyResolved if the update was already executed or rejected

- - -

### resendRemoteUpdate

Resends a remote update to the destination chain. This function is useful in case of bridge failures.

```solidity
function resendRemoteUpdate(uint256 updateId, bytes options) external payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The oracle update ID to resend |
| options | bytes | LayerZero message options; if empty, default executor option is used |

#### 📅 Events
* Emits UpdateResentToDestination with the update ID, destination chain ID, update type, and market

#### ⛔️ Access Requirements
* Only whitelisted executors can call this function

#### ❌ Errors
* Throws NotAnExecutor if the caller is not a whitelisted executor
* Throws InvalidUpdateToResend if the update status is not SENT_TO_DESTINATION
* Throws UpdateIsExpired if the update has expired

- - -

### getExecutableUpdates

Returns an array of update IDs for executable registered updates for a given update type and comptroller.

```solidity
function getExecutableUpdates(string updateType, address comptroller) external view returns (uint256[] executableUpdates)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human‑readable identifier of the update type to filter by |
| comptroller | address | The address of the Comptroller (either Core Pool or Isolated Pools) that manages the markets |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| executableUpdates | uint256[] | Array of update IDs that are ready to be executed |

- - -

### isUpdateExecutable

Returns whether a registered update is ready to be executed.

```solidity
function isUpdateExecutable(uint256 updateId) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | The oracle update ID to query |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the update is pending, not expired, active, and past its timelock |

- - -

### getRiskParameterConfig

Returns the risk parameter configuration for a given update type

```solidity
function getRiskParameterConfig(string updateType) external view returns (struct IRiskStewardReceiver.RiskParamConfig)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IRiskStewardReceiver.RiskParamConfig | The risk parameter configuration |

- - -

### getLastProcessedUpdate

Returns the last processed update ID for a given update type and market

```solidity
function getLastProcessedUpdate(string updateType, address market) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |
| market | address | The address of the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The last processed update ID |

- - -

### getLastRegisteredUpdate

Returns the last registered update ID for a given update type and market

```solidity
function getLastRegisteredUpdate(string updateType, address market) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The human-readable identifier of the update type |
| market | address | The address of the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The last registered update ID |

- - -

### quote

Quotes the gas fee needed to pay for the full omnichain transaction in native gas or ZRO token.

```solidity
function quote(struct RiskParameterUpdate update, bytes options, bool payInLzToken) public view returns (struct MessagingFee fee)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | The risk parameter update payload to be sent |
| options | bytes | Message execution options (e.g., for sending gas to the destination) |
| payInLzToken | bool | Whether to return the fee in ZRO token instead of native gas |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | struct MessagingFee | A `MessagingFee` struct containing the calculated gas fee |

- - -

### lzSend

Sends a `RiskParameterUpdate` to a destination chain via LayerZero.

```solidity
function lzSend(uint32 dstEid, struct RiskParameterUpdate update, bytes options, struct MessagingFee fee, address refundAddress) public payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| dstEid | uint32 | Destination chain endpoint ID |
| update | struct RiskParameterUpdate | The risk parameter update payload to send |
| options | bytes | LayerZero message options; if empty, a default executor option is used |
| fee | struct MessagingFee | Messaging fee structure returned by `quote` |
| refundAddress | address | Address to receive any surplus fee refunds |

#### ❌ Errors
* InvalidLzSendCaller if called by any address other than this contract

- - -

### renounceOwnership

Disables renounceOwnership function

```solidity
function renounceOwnership() public pure
```

#### ❌ Errors
* Throws RenounceOwnershipNotAllowed

- - -

