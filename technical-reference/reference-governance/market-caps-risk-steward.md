# MarketCapsRiskSteward
Contract that can update supply and borrow caps updates received from RiskStewardReceiver.

This page follows [`MarketCapsRiskSteward.sol` at v2.15.0](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/RiskSteward/MarketCapsRiskSteward.sol). On BNB mainnet at block `118369568`, proxy `0x816FfD00A274EDE0091421F77817ca260Db3a3E3` used implementation `0x6c4538b7e85b073099BFf08B43F7273E4792Bb43`, matching the tagged artifact. Destination-mainnet deployment must be verified separately; the stable tag contains destination instances on testnets.

# Solidity API

### SUPPLY_CAP

The update type for supply caps

```solidity
string SUPPLY_CAP
```

- - -

### SUPPLY_CAP_KEY

The update type key for supply caps (keccak256 hash of SUPPLY_CAP)

```solidity
bytes32 SUPPLY_CAP_KEY
```

- - -

### BORROW_CAP

The update type for borrow caps

```solidity
string BORROW_CAP
```

- - -

### BORROW_CAP_KEY

The update type key for borrow caps (keccak256 hash of BORROW_CAP)

```solidity
bytes32 BORROW_CAP_KEY
```

- - -

### RISK_STEWARD_RECEIVER

Address of the RiskStewardReceiver used to validate incoming updates

```solidity
contract IRiskStewardReceiver RISK_STEWARD_RECEIVER
```

- - -

### constructor

Sets the immutable RiskStewardReceiver address and disables initializers

```solidity
constructor(address riskStewardReceiver_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| riskStewardReceiver_ | address | The address of the RiskStewardReceiver |

#### ❌ Errors
* Throws ZeroAddressNotAllowed if the RiskStewardReceiver address is zero

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

Sets the safe delta bps

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
| \[0] | bool | True if update is safe for direct execution, false if timelock is required |

#### ❌ Errors
* Throws UnsupportedUpdateType if the update type is not supported
* Throws RedundantValue if the new cap value is equal to the current cap value

- - -

### applyUpdate

Applies a market cap update from the RiskStewardReceiver.
Directly updates the market supply or borrow cap on the market's comptroller.

```solidity
function applyUpdate(struct RiskParameterUpdate update) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| update | struct RiskParameterUpdate | RiskParameterUpdate update to apply |

#### 📅 Events
* Emits SupplyCapUpdated or BorrowCapUpdated depending on the update with the updateId, market and new cap

#### ⛔️ Access Requirements
* Only callable by the RiskStewardReceiver

#### ❌ Errors
* Throws OnlyRiskStewardReceiver if the sender is not the RiskStewardReceiver
* Throws UnsupportedUpdateType if the update type is not supported

- - -
