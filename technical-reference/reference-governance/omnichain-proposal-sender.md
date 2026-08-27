# OmnichainProposalSender

[`OmnichainProposalSender` at v2.15.0](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Cross-chain/OmnichainProposalSender.sol) is the BNB-side LayerZero V1 sender. It sends proposal data to configured destination executors after the BNB proposal passes. In the production governance flow its owner is the Normal Timelock, while the exact caller permissions for `execute` and administrative functions are resolved by AccessControlManager.

The current API includes inherited `setMaxDailyLimit`, `pause`, `unpause`, `setAccessControlManager`, `owner`, and `transferOwnership` selectors. Ownership renunciation is deliberately disabled. `retryExecute` is for sends that failed before LayerZero accepted them; `fallbackWithdraw` clears a matching stored execution and recovers its original native-token value.

# Solidity API

### proposalCount

Stores the total number of remote proposals

```solidity
uint256 proposalCount
```

---

### storedExecutionHashes

Execution hashes of failed messages

```solidity
mapping(uint256 => bytes32) storedExecutionHashes
```

---

### LZ_ENDPOINT

LayerZero endpoint for sending messages to remote chains

```solidity
contract ILayerZeroEndpoint LZ_ENDPOINT
```

---

### trustedRemoteLookup

Specifies the allowed path for sending messages (remote chainId => remote app address + local app address)

```solidity
mapping(uint16 => bytes) trustedRemoteLookup
```

---

### estimateFees

Estimates LayerZero fees for cross-chain message delivery to the remote chain

```solidity
function estimateFees(uint16 remoteChainId_, bytes payload_, bool useZro_, bytes adapterParams_) external view returns (uint256, uint256)
```

#### Parameters

| Name            | Type   | Description                                                                                                                                                       |
| --------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| remoteChainId\_ | uint16 | The LayerZero id of a remote chain                                                                                                                                |
| payload\_       | bytes  | The payload to be sent to the remote chain. It's computed as follows: payload = abi.encode(abi.encode(targets, values, signatures, calldatas, proposalType), pId) |
| useZro\_        | bool   | Bool that indicates whether to pay in ZRO tokens or not                                                                                                           |
| adapterParams\_ | bytes  | The params used to specify the custom amount of gas required for the execution on the destination                                                                 |

#### Return Values

| Name | Type    | Description                                                    |
| ---- | ------- | -------------------------------------------------------------- |
| \[0]  | uint256 | nativeFee The amount of fee in the native gas token (e.g. ETH) |
| \[1]  | uint256 | zroFee The amount of fee in ZRO token                          |

---

### removeTrustedRemote

Remove trusted remote from storage

```solidity
function removeTrustedRemote(uint16 remoteChainId_) external
```

#### Parameters

| Name            | Type   | Description                                                       |
| --------------- | ------ | ----------------------------------------------------------------- |
| remoteChainId\_ | uint16 | The chain's id corresponds to setting the trusted remote to empty |

#### 📅 Events

- Emit TrustedRemoteRemoved with remote chain id

#### ⛔️ Access Requirements

- Controlled by Access Control Manager

---

### execute

Sends a message to execute a remote proposal

```solidity
function execute(uint16 remoteChainId_, bytes payload_, bytes adapterParams_, address zroPaymentAddress_) external payable
```

#### Parameters

| Name                | Type    | Description                                                                                                                                     |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| remoteChainId\_     | uint16  | The LayerZero id of the remote chain                                                                                                            |
| payload\_           | bytes   | The payload to be sent to the remote chain It's computed as follows: payload = abi.encode(targets, values, signatures, calldatas, proposalType) |
| adapterParams\_     | bytes   | The params used to specify the custom amount of gas required for the execution on the destination                                               |
| zroPaymentAddress\_ | address | The address of the ZRO token holder who would pay for the transaction. This must be either address(this) or tx.origin                           |

#### 📅 Events

- Emits ExecuteRemoteProposal with remote chain id, proposal ID and payload on success
- Emits StorePayload with last stored payload proposal ID, remote chain id, payload, adapter params, values and reason for failure

#### ⛔️ Access Requirements

- Controlled by Access Control Manager

---

### retryExecute

Resends a previously failed message

```solidity
function retryExecute(uint256 pId_, uint16 remoteChainId_, bytes payload_, bytes adapterParams_, address zroPaymentAddress_, uint256 originalValue_) external payable
```

#### Parameters

| Name                | Type    | Description                                                                                                                                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pId\_               | uint256 | The proposal ID to identify a failed message                                                                                                                     |
| remoteChainId\_     | uint16  | The LayerZero id of the remote chain                                                                                                                             |
| payload\_           | bytes   | The payload to be sent to the remote chain It's computed as follows: payload = abi.encode(abi.encode(targets, values, signatures, calldatas, proposalType), pId) |
| adapterParams\_     | bytes   | The params used to specify the custom amount of gas required for the execution on the destination                                                                |
| zroPaymentAddress\_ | address | The address of the ZRO token holder who would pay for the transaction.                                                                                           |
| originalValue\_     | uint256 | The msg.value passed when execute() function was called                                                                                                          |

#### 📅 Events

- Emits ClearPayload with proposal ID and hash

#### ⛔️ Access Requirements

- Controlled by Access Control Manager

---

### fallbackWithdraw

Clear previously failed message

```solidity
function fallbackWithdraw(address to_, uint256 pId_, uint16 remoteChainId_, bytes payload_, bytes adapterParams_, uint256 originalValue_) external
```

#### Parameters

| Name            | Type    | Description                                                                                                                                                      |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to\_            | address | Address of the receiver                                                                                                                                          |
| pId\_           | uint256 | The proposal ID to identify a failed message                                                                                                                     |
| remoteChainId\_ | uint16  | The LayerZero id of the remote chain                                                                                                                             |
| payload\_       | bytes   | The payload to be sent to the remote chain It's computed as follows: payload = abi.encode(abi.encode(targets, values, signatures, calldatas, proposalType), pId) |
| adapterParams\_ | bytes   | The params used to specify the custom amount of gas required for the execution on the destination                                                                |
| originalValue\_ | uint256 | The msg.value passed when execute() function was called                                                                                                          |

#### 📅 Events

- Emits ClearPayload with proposal ID and hash
- Emits FallbackWithdraw with receiver and amount

#### ⛔️ Access Requirements

- Only owner

---

### setTrustedRemoteAddress

Sets the remote message receiver address

```solidity
function setTrustedRemoteAddress(uint16 remoteChainId_, bytes newRemoteAddress_) external
```

#### Parameters

| Name               | Type   | Description                                                                               |
| ------------------ | ------ | ----------------------------------------------------------------------------------------- |
| remoteChainId\_    | uint16 | The LayerZero id of a remote chain                                                        |
| newRemoteAddress\_ | bytes  | The address of the contract on the remote chain to receive messages sent by this contract |

#### 📅 Events

- Emits SetTrustedRemoteAddress with remote chain Id and remote address

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### setConfig

Sets the configuration of the LayerZero messaging library of the specified version

```solidity
function setConfig(uint16 version_, uint16 chainId_, uint256 configType_, bytes config_) external
```

#### Parameters

| Name         | Type    | Description                                                               |
| ------------ | ------- | ------------------------------------------------------------------------- |
| version\_    | uint16  | Messaging library version                                                 |
| chainId\_    | uint16  | The LayerZero chainId for the pending config change                       |
| configType\_ | uint256 | The type of configuration. Every messaging library has its own convention |
| config\_     | bytes   | The configuration in bytes. It can encode arbitrary content               |

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### setSendVersion

Sets the configuration of the LayerZero messaging library of the specified version

```solidity
function setSendVersion(uint16 version_) external
```

#### Parameters

| Name      | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| version\_ | uint16 | New messaging library version |

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

---

### getConfig

Gets the configuration of the LayerZero messaging library of the specified version

```solidity
function getConfig(uint16 version_, uint16 chainId_, uint256 configType_) external view returns (bytes)
```

#### Parameters

| Name         | Type    | Description                                                           |
| ------------ | ------- | --------------------------------------------------------------------- |
| version\_    | uint16  | Messaging library version                                             |
| chainId\_    | uint16  | The LayerZero chainId                                                 |
| configType\_ | uint256 | Type of configuration. Every messaging library has its own convention |

---
