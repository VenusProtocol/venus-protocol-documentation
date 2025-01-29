# OmnichainGovernanceExecutor

Executes the proposal transactions sent from the main chain

# Solidity API

```solidity
enum ProposalType {
  NORMAL,
  FASTTRACK,
  CRITICAL
}
```

```solidity
struct Proposal {
  uint256 id;
  uint256 eta;
  address[] targets;
  uint256[] values;
  string[] signatures;
  bytes[] calldatas;
  bool canceled;
  bool executed;
  uint8 proposalType;
}
```

```solidity
enum ProposalState {
  Canceled,
  Queued,
  Executed
}
```

### guardian

A privileged role that can cancel any proposal

```solidity
address guardian
```

---

### srcChainId

Stores BNB chain layerzero endpoint id

```solidity
uint16 srcChainId
```

---

### lastProposalReceived

Last proposal count received

```solidity
uint256 lastProposalReceived
```

---

### proposals

The official record of all proposals ever proposed

```solidity
mapping(uint256 => struct OmnichainGovernanceExecutor.Proposal) proposals
```

---

### proposalTimelocks

Mapping containing Timelock addresses for each proposal type

```solidity
mapping(uint256 => contract ITimelock) proposalTimelocks
```

---

### queued

Represents queue state of proposal

```solidity
mapping(uint256 => bool) queued
```

---

### setSrcChainId

Update source layerzero endpoint id

```solidity
function setSrcChainId(uint16 srcChainId_) external
```

#### Parameters

| Name         | Type   | Description                       |
| ------------ | ------ | --------------------------------- |
| srcChainId\_ | uint16 | The new source chain id to be set |

#### 📅 Events

- Emit SetSrcChainId with old and new source id

#### ⛔️ Access Requirements

- Only owner

---

### setGuardian

Sets the new executor guardian

```solidity
function setGuardian(address newGuardian) external
```

#### Parameters

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| newGuardian | address | The address of the new guardian |

#### 📅 Events

- Emit NewGuardian with old and new guardian address

#### ⛔️ Access Requirements

- Must be call by guardian or owner

---

### addTimelocks

Add timelocks to the ProposalTimelocks mapping

```solidity
function addTimelocks(contract ITimelock[] timelocks_) external
```

#### Parameters

| Name        | Type                 | Description                           |
| ----------- | -------------------- | ------------------------------------- |
| timelocks\_ | contract ITimelock[] | Array of addresses of all 3 timelocks |

#### 📅 Events

- Emits TimelockAdded with old and new timelock and route type

#### ⛔️ Access Requirements

- Only owner

---

### execute

Executes a queued proposal if eta has passed

```solidity
function execute(uint256 proposalId_) external
```

#### Parameters

| Name         | Type    | Description                           |
| ------------ | ------- | ------------------------------------- |
| proposalId\_ | uint256 | Id of proposal that is to be executed |

#### 📅 Events

- Emits ProposalExecuted with proposal id of executed proposal

---

### cancel

Cancels a proposal only if sender is the guardian and proposal is not executed

```solidity
function cancel(uint256 proposalId_) external
```

#### Parameters

| Name         | Type    | Description                           |
| ------------ | ------- | ------------------------------------- |
| proposalId\_ | uint256 | Id of proposal that is to be canceled |

#### 📅 Events

- Emits ProposalCanceled with proposal id of the canceled proposal

#### ⛔️ Access Requirements

- Sender must be the guardian

---

### setTimelockPendingAdmin

Sets the new pending admin of the Timelock

```solidity
function setTimelockPendingAdmin(address pendingAdmin_, uint8 proposalType_) external
```

#### Parameters

| Name           | Type    | Description                  |
| -------------- | ------- | ---------------------------- |
| pendingAdmin\_ | address | Address of new pending admin |
| proposalType\_ | uint8   | Type of proposal             |

#### 📅 Events

- Emits SetTimelockPendingAdmin with new pending admin and proposal type

#### ⛔️ Access Requirements

- Only owner

---

### retryMessage

Resends a previously failed message

```solidity
function retryMessage(uint16 srcChainId_, bytes srcAddress_, uint64 nonce_, bytes payload_) public payable
```

#### Parameters

| Name         | Type   | Description                                              |
| ------------ | ------ | -------------------------------------------------------- |
| srcChainId\_ | uint16 | Source chain Id                                          |
| srcAddress\_ | bytes  | Source address => local app address + remote app address |
| nonce\_      | uint64 | Nonce to identify failed message                         |
| payload\_    | bytes  | The payload of the message to be retried                 |

#### ⛔️ Access Requirements

- Only owner

---

### state

Gets the state of a proposal

```solidity
function state(uint256 proposalId_) public view returns (enum OmnichainGovernanceExecutor.ProposalState)
```

#### Parameters

| Name         | Type    | Description            |
| ------------ | ------- | ---------------------- |
| proposalId\_ | uint256 | The id of the proposal |

#### Return Values

| Name | Type                                           | Description    |
| ---- | ---------------------------------------------- | -------------- |
| [0]  | enum OmnichainGovernanceExecutor.ProposalState | Proposal state |

---
