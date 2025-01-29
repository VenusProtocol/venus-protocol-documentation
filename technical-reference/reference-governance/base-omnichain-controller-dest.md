# BaseOmnichainControllerDest

# Solidity API

### maxDailyReceiveLimit

Maximum daily limit for receiving commands from Binance chain

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
