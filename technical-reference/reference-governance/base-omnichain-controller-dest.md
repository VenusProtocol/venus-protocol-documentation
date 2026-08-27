# BaseOmnichainControllerDest

[`BaseOmnichainControllerDest` at v2.15.0](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Cross-chain/BaseOmnichainControllerDest.sol) is the abstract destination-side base for OmnichainGovernanceExecutor. It uses the LayerZero V1 `NonblockingLzApp` API, applies one 24-hour receive-command limit to the BNB source, and disables ownership renunciation. It is not a standalone deployment.

# Solidity API

### maxDailyReceiveLimit

Maximum daily limit for receiving commands from BNB Chain

```solidity
uint256 maxDailyReceiveLimit
```

---

### last24HourCommandsReceived

Total received commands within the last 24-hour window from Binance chain

```solidity
uint256 last24HourCommandsReceived
```

---

### last24HourReceiveWindowStart

Timestamp when the last 24-hour window started from Binance chain

```solidity
uint256 last24HourReceiveWindowStart
```

---

### setMaxDailyReceiveLimit

Sets the maximum daily limit for receiving commands

```solidity
function setMaxDailyReceiveLimit(uint256 limit_) external
```

#### Parameters

| Name    | Type    | Description        |
| ------- | ------- | ------------------ |
| limit\_ | uint256 | Number of commands |

#### 📅 Events

- Emits SetMaxDailyReceiveLimit with old and new limit

#### ⛔️ Access Requirements

- Only Owner

---

### pause

Triggers the paused state of the controller

```solidity
function pause() external
```

#### ⛔️ Access Requirements

- Only owner

---

### unpause

Triggers the resume state of the controller

```solidity
function unpause() external
```

#### ⛔️ Access Requirements

- Only owner

---

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishappening

```solidity
function renounceOwnership() public
```

---
