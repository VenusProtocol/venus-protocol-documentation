# IRMRiskSteward
Contract that can update interest rate models updates received from RiskStewardReceiver.

# Solidity API

### INTEREST_RATE_MODEL

The update type for interest rate model

```solidity
string INTEREST_RATE_MODEL
```

- - -

### INTEREST_RATE_MODEL_KEY

The update type key for interest rate model (keccak256 hash of INTEREST_RATE_MODEL)

```solidity
bytes32 INTEREST_RATE_MODEL_KEY
```

- - -

### CORE_POOL_COMPTROLLER

Address of the BNB Core Pool Comptroller.

```solidity
contract ICorePoolComptroller CORE_POOL_COMPTROLLER
```

- - -

### RISK_STEWARD_RECEIVER

Address of the RiskStewardReceiver used to validate incoming updates

```solidity
contract IRiskStewardReceiver RISK_STEWARD_RECEIVER
```

- - -

### constructor

Sets the immutable CORE_POOL_COMPTROLLER and RISK_STEWARD_RECEIVER addresses and disables initializers

```solidity
constructor(address corePoolComptroller_, address riskStewardReceiver_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| corePoolComptroller_ | address | The address of the Core Pool Comptroller |
| riskStewardReceiver_ | address | The address of the RiskStewardReceiver |

#### ❌ Errors
* Throws ZeroAddressNotAllowed if any of the addresses are zero

- - -

### initialize

Initializes the contract as ownable and access controlled.

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | The address of the access control manager |

- - -

### applyUpdate

Applies an interest rate model update from the RiskStewardReceiver.
Directly updates the market interest rate model on the vToken.

```solidity
function applyUpdate(struct RiskParameterUpdate update) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | RiskParameterUpdate update to apply |

#### 📅 Events
* Emits InterestRateModelUpdated with the updateId, market and new IRM address

#### ⛔️ Access Requirements
* Only callable by the RiskStewardReceiver

#### ❌ Errors
* Throws OnlyRiskStewardReceiver if the sender is not the RiskStewardReceiver
* Throws UnsupportedUpdateType if the update type is not supported

- - -

### isSafeForDirectExecution

Checks if an update is safe for direct execution (no timelock required)

```solidity
function isSafeForDirectExecution(struct RiskParameterUpdate update) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | The update to check |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if update is safe for direct execution, false if timelock is required |

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is not supported
* Throws RedundantValue if the new IRM address is equal to the current IRM address

- - -

