# MarketCapsRiskSteward
Contract that can update supply and borrow caps received from RiskStewardReceiver. Requires that the update is within the max delta.
Expects the new value to be an encoded uint256 value of un padded bytes.

# Solidity API

### maxDeltaBps

The max delta bps for the update relative to the current value

```solidity
uint256 maxDeltaBps
```

- - -

### CORE_POOL_COMPTROLLER

Address of the CorePoolComptroller used for selecting the correct comptroller abi

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

### SUPPLY_CAP

The update type for supply caps

```solidity
string SUPPLY_CAP
```

- - -

### BORROW_CAP

The update type for borrow caps

```solidity
string BORROW_CAP
```

- - -

### setMaxDeltaBps

Sets the max delta bps

```solidity
function setMaxDeltaBps(uint256 maxDeltaBps_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| maxDeltaBps_ | uint256 | The new max delta bps |

#### 📅 Events
* Emits MaxDeltaBpsUpdated with the old and new max delta bps

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* InvalidMaxDeltaBps if the max delta bps is 0 or greater than MAX_BPS

- - -

### processUpdate

Processes a market cap update from the RiskStewardReceiver.
Validates that the update is within range and then directly update the market supply or borrow cap on the market's comptroller.
RiskParameterUpdate shape is as follows:
 * newValue - encoded uint256 value of un padded bytes
 * previousValue - encoded uint256 value of un padded bytes
 * updateType - supplyCap | borrowCap
 * additionalData - encoded bytes of (address underlying, uint16 destChainId)

```solidity
function processUpdate(struct RiskParameterUpdate update) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | RiskParameterUpdate update to process. |

#### 📅 Events
* Emits SupplyCapUpdated or BorrowCapUpdated depending on the update with the market and new cap

#### ⛔️ Access Requirements
* Only callable by the RiskStewardReceiver

#### ❌ Errors
* OnlyRiskStewardReceiver Thrown if the sender is not the RiskStewardReceiver
* UnsupportedUpdateType Thrown if the update type is not supported
* UpdateNotInRange Thrown if the update is not within the allowed range

- - -

