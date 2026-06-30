# Risk Oracle
Contract for managing and publishing risk parameter updates for Risk-Steward Updates

# Solidity API

### updateCounter

Counter to keep track of the total number of updates

```solidity
uint256 updateCounter
```

- - -

### allUpdateTypes

Array to store all update types

```solidity
string[] allUpdateTypes
```

- - -

### activeUpdateTypes

Whitelist of valid update type identifiers, keyed by updateType hash

```solidity
mapping(bytes32 => bool) activeUpdateTypes
```

- - -

### updatesById

Mapping from unique update ID to the update details

```solidity
mapping(uint256 => struct RiskParameterUpdate) updatesById
```

- - -

### authorizedSenders

Authorized accounts capable of proposing updates

```solidity
mapping(address => bool) authorizedSenders
```

- - -

### latestUpdateIdByMarketAndType

Mapping to store the latest update ID for each combination of update type key and market

```solidity
mapping(bytes32 => mapping(address => uint256)) latestUpdateIdByMarketAndType
```

- - -

### constructor

Disables initializers

```solidity
constructor() public
```

- - -

### initialize

Initializes the contract with access control manager

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | Address of the access control manager |

#### ❌ Errors
* Reverts with "invalid acess control manager address" if accessControlManager_ is zero address

- - -

### addAuthorizedSender

Adds a new sender to the list of addresses authorized to perform updates

```solidity
function addAuthorizedSender(address sender) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | Address to be authorized |

#### 📅 Events
* Emits AuthorizedSenderAdded when sender is successfully added

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws ZeroAddressNotAllowed if sender is zero address
* Throws SenderAlreadyAuthorized if sender is already authorized
* Throws Unauthorized if caller is not allowed by AccessControlManager

- - -

### removeAuthorizedSender

Removes an address from the list of authorized senders

```solidity
function removeAuthorizedSender(address sender) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | Address to be unauthorized |

#### 📅 Events
* Emits AuthorizedSenderRemoved when sender is successfully removed

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws SenderNotAuthorized if sender is not currently authorized
* Throws Unauthorized if caller is not allowed by AccessControlManager

- - -

### addUpdateType

Adds a new type of update to the list of authorized update types

```solidity
function addUpdateType(string newUpdateType) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newUpdateType | string | New type of update to allow |

#### 📅 Events
* Emits UpdateTypeAdded when update type is successfully added

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws InvalidUpdateTypeString if update type string is empty or exceeds 64 characters
* Throws UpdateTypeAlreadyExists if update type already exists
* Throws Unauthorized if caller is not allowed by AccessControlManager

- - -

### setUpdateTypeActive

Sets the active status of an existing update type

```solidity
function setUpdateTypeActive(string updateType, bool active) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The update type to set active status for |
| active | bool | True to activate, false to deactivate |

#### 📅 Events
* Emits UpdateTypeActiveStatusChanged when status is successfully changed

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws UpdateTypeNotFound if update type doesn't exist
* Throws UpdateTypeStatusUnchanged if status is already set to the desired value
* Throws Unauthorized if caller is not allowed by AccessControlManager

- - -

### publishRiskParameterUpdate

Publishes a new risk parameter update

```solidity
function publishRiskParameterUpdate(string referenceId, bytes newValue, string updateType, address market, uint96 poolId, uint32 dstEid, bytes additionalData) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| referenceId | string | An external reference ID associated with the update |
| newValue | bytes | The new value of the risk parameter being updated |
| updateType | string | Type of update performed, must be previously authorized |
| market | address | Address for market of the parameter update |
| poolId | uint96 | Pool identifier for eMode-style collateral configuration (0 for regular markets) |
| dstEid | uint32 | Destination endpoint ID for cross-chain routing |
| additionalData | bytes | Additional data for the update |

#### 📅 Events
* Emits UpdatePublished when update is successfully published

#### ❌ Errors
* Throws SenderNotAuthorized if caller is not an authorized sender
* Throws UpdateTypeNotActive if update type is not active
* Throws ZeroAddressNotAllowed if market is zero address

- - -

### publishBulkRiskParameterUpdates

Publishes multiple risk parameter updates in a single transaction

```solidity
function publishBulkRiskParameterUpdates(string[] referenceIds, bytes[] newValues, string[] updateTypes, address[] markets, uint96[] poolIds, uint32[] dstEid, bytes[] additionalData) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| referenceIds | string[] | Array of external reference IDs |
| newValues | bytes[] | Array of new values for each update |
| updateTypes | string[] | Array of types for each update, all must be authorized |
| markets | address[] | Array of addresses for markets of the parameter updates |
| poolIds | uint96[] | Array of pool identifiers for eMode-style collateral configuration (0 for regular markets) |
| dstEid | uint32[] | Array of destination endpoint IDs for cross-chain routing |
| additionalData | bytes[] | Array of additional data for the updates |

#### 📅 Events
* Emits UpdatePublished for each successfully published update

#### ❌ Errors
* Throws SenderNotAuthorized if caller is not an authorized sender
* Throws ArrayLengthMismatch if the array lengths do not match or if no updates are provided
* Throws UpdateTypeNotActive if any update type is not active
* Throws ZeroAddressNotAllowed if any market is zero address

- - -

### getLatestUpdateByTypeAndMarket

Fetches the most recent update for a specific parameter in a specific market

```solidity
function getLatestUpdateByTypeAndMarket(string updateType, address market) external view returns (struct RiskParameterUpdate)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The identifier for the parameter |
| market | address | The market identifier |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct RiskParameterUpdate | The most recent RiskParameterUpdate for the specified parameter and market |

#### ❌ Errors
* Throws NoUpdateFound if no update exists for the specified parameter and market

- - -

### getUpdateById

Fetches the update for a provided updateId

```solidity
function getUpdateById(uint256 updateId) external view returns (struct RiskParameterUpdate)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateId | uint256 | Update ID |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct RiskParameterUpdate | The RiskParameterUpdate for the specified id |

#### ❌ Errors
* Throws InvalidUpdateId if updateId is 0 or greater than updateCounter

- - -

### allUpdateTypesLength

Returns the total number of update types in the allUpdateTypes array

```solidity
function allUpdateTypesLength() external view returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The length of the allUpdateTypes array |

- - -

### getLatestUpdateIdByTypeAndMarket

Gets the latest update ID for a specific market and update type (string) combination

```solidity
function getLatestUpdateIdByTypeAndMarket(string updateType, address market) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The update type string |
| market | address | The market address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The latest update ID for the given market and update type, or 0 if none exists |

- - -

### getActiveUpdateTypes

Checks if a given update type is currently active.

```solidity
function getActiveUpdateTypes(string updateType) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| updateType | string | The update type string to check |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the update type is active, false otherwise |

- - -

### getAllUpdateTypes

Returns all update types in the allUpdateTypes array

```solidity
function getAllUpdateTypes() external view returns (string[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string[] | An array of all update type strings |

- - -

### renounceOwnership

Disables renounceOwnership function

```solidity
function renounceOwnership() public pure
```

#### ❌ Errors
* Throws RenounceOwnershipNotAllowed

- - -

