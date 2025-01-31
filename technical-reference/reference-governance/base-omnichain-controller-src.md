# BaseOmnichainControllerSrc

# Solidity API

### accessControlManager

ACM (Access Control Manager) contract address

```solidity
address accessControlManager
```

---

### chainIdToMaxDailyLimit

Maximum daily limit for commands from the local chain

```solidity
mapping(uint16 => uint256) chainIdToMaxDailyLimit
```

---

### chainIdToLast24HourCommandsSent

Total commands transferred within the last 24-hour window from the local chain

```solidity
mapping(uint16 => uint256) chainIdToLast24HourCommandsSent
```

---

### chainIdToLast24HourWindowStart

Timestamp when the last 24-hour window started from the local chain

```solidity
mapping(uint16 => uint256) chainIdToLast24HourWindowStart
```

---

### chainIdToLastProposalSentTimestamp

Timestamp when the last proposal sent from the local chain to dest chain

```solidity
mapping(uint16 => uint256) chainIdToLastProposalSentTimestamp
```

---

### setMaxDailyLimit

Sets the limit of daily (24 Hour) command amount

```solidity
function setMaxDailyLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| chainId\_ | uint16  | Destination chain id |
| limit\_   | uint256 | Number of commands   |

#### 📅 Events

- Emits SetMaxDailyLimit with old and new limit and its corresponding chain id

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### pause

Triggers the paused state of the controller

```solidity
function pause() external
```

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### unpause

Triggers the resume state of the controller

```solidity
function unpause() external
```

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### setAccessControlManager

Sets the address of Access Control Manager (ACM)

```solidity
function setAccessControlManager(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                                   |
| ---------------------- | ------- | --------------------------------------------- |
| accessControlManager\_ | address | The new address of the Access Control Manager |

#### 📅 Events

- Emits NewAccessControlManager with old and new access control manager addresses

#### ⛔️ Access Requirements

- Only owner

---

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishap

```solidity
function renounceOwnership() public
```

---
