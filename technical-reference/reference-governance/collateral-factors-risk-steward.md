# CollateralFactorsRiskSteward
Contract that can update collateral factors and liquidation thresholds received from `RiskStewardReceiver`.

# Solidity API

### COLLATERAL_FACTORS

The update type for collateral factor and liquidation threshold.

```solidity
string COLLATERAL_FACTORS
```

- - -

### COLLATERAL_FACTORS_KEY

The update type key for collateral factors (keccak256 hash of COLLATERAL_FACTORS)

```solidity
bytes32 COLLATERAL_FACTORS_KEY
```

- - -

### CORE_POOL_COMPTROLLER

Address of the BNB Core Pool Comptroller.

```solidity
contract ICorePoolComptroller CORE_POOL_COMPTROLLER
```

- - -

### RISK_STEWARD_RECEIVER

Address of the `RiskStewardReceiver` used to validate and dispatch incoming updates.

```solidity
contract IRiskStewardReceiver RISK_STEWARD_RECEIVER
```

- - -

### constructor

Sets the immutable `CORE_POOL_COMPTROLLER` and `RISK_STEWARD_RECEIVER` addresses and disables initializers.

```solidity
constructor(address corePoolComptroller_, address riskStewardReceiver_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| corePoolComptroller_ | address | The address of the Core Pool Comptroller |
| riskStewardReceiver_ | address | The address of the `RiskStewardReceiver` |

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

### setSafeDeltaBps

Sets the safe delta bps.

```solidity
function setSafeDeltaBps(uint256 safeDeltaBps_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| safeDeltaBps_ | uint256 | The new safe delta bps |

#### 📅 Events
* Emits SafeDeltaBpsUpdated with the old and new safe delta bps

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Throws InvalidSafeDeltaBps if the safe delta bps is greater than MAX_BPS
* Throws RedundantValue if the new safe delta bps is equal to the current value

- - -

### isSafeForDirectExecution

Checks if an update is safe for direct execution (no timelock required).

```solidity
function isSafeForDirectExecution(struct RiskParameterUpdate update) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | The update to check. |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if update is safe for direct execution, false if timelock is required |

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is not supported
* Throws RedundantValue if the new collateral factor and liquidation threshold are unchanged

- - -

### applyUpdate

Applies a collateral parameter update from the `RiskStewardReceiver`.
        Delta validation and timelock checks are already performed by `RiskStewardReceiver` before execution.

```solidity
function applyUpdate(struct RiskParameterUpdate update) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | RiskParameterUpdate update to apply |

#### 📅 Events
* Emits CollateralFactorsUpdated with updateId

#### ⛔️ Access Requirements
* Only callable by the `RiskStewardReceiver`

#### ❌ Errors
* Throws OnlyRiskStewardReceiver if the sender is not the `RiskStewardReceiver`
* Throws UnsupportedUpdateType if the update type is not supported

- - -

