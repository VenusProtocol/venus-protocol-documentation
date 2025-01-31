# OmnichainExecutorOwner

OmnichainProposalSender contract acts as a governance and access control mechanism,
allowing owner to upsert signature of OmnichainGovernanceExecutor contract,
also contains function to transfer the ownership of contract as well.

# Solidity API

### OMNICHAIN_GOVERNANCE_EXECUTOR

@custom:oz-upgrades-unsafe-allow state-variable-immutable

```solidity
contract IOmnichainGovernanceExecutor OMNICHAIN_GOVERNANCE_EXECUTOR
```

---

### functionRegistry

Stores function signature corresponding to their 4 bytes hash value

```solidity
mapping(bytes4 => string) functionRegistry
```

---

### initialize

Initialize the contract

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                       |
| ---------------------- | ------- | --------------------------------- |
| accessControlManager\_ | address | Address of access control manager |

---

### setTrustedRemoteAddress

Sets the source message sender address

```solidity
function setTrustedRemoteAddress(uint16 srcChainId_, bytes srcAddress_) external
```

#### Parameters

| Name         | Type   | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| srcChainId\_ | uint16 | The LayerZero id of a source chain              |
| srcAddress\_ | bytes  | The address of the contract on the source chain |

#### 📅 Events

- Emits SetTrustedRemoteAddress with source chain Id and source address

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### fallback

Invoked when called function does not exist in the contract

```solidity
fallback(bytes data_) external returns (bytes)
```

#### Parameters

| Name   | Type  | Description                                   |
| ------ | ----- | --------------------------------------------- |
| data\_ | bytes | Calldata containing the encoded function call |

#### Return Values

| Name | Type  | Description             |
| ---- | ----- | ----------------------- |
| [0]  | bytes | Result of function call |

#### ⛔️ Access Requirements

- Controlled by Access Control Manager

---

### upsertSignature

A registry of functions that are allowed to be executed from proposals

```solidity
function upsertSignature(string[] signatures_, bool[] active_) external
```

#### Parameters

| Name         | Type     | Description                                |
| ------------ | -------- | ------------------------------------------ |
| signatures\_ | string[] | Function signature to be added or removed  |
| active\_     | bool[]   | bool value, should be true to add function |

#### ⛔️ Access Requirements

- Only owner

---

### transferBridgeOwnership

This function transfer the ownership of the executor from this contract to new owner

```solidity
function transferBridgeOwnership(address newOwner_) external
```

#### Parameters

| Name       | Type    | Description                         |
| ---------- | ------- | ----------------------------------- |
| newOwner\_ | address | New owner of the governanceExecutor |

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### renounceOwnership

@notice Empty implementation of renounce ownership to avoid any mishappening

```solidity
function renounceOwnership() public virtual
```

---
