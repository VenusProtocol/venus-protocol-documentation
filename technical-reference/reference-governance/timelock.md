# Timelock
The Timelock contract.

# Solidity API

### setDelay

Setter for the transaction queue delay

```solidity
function setDelay(uint256 delay_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| delay_ | uint256 | The new delay period for the transaction queue |

- - -

### acceptAdmin

Method for accepting a proposed admin

```solidity
function acceptAdmin() public
```

- - -

### setPendingAdmin

Method to propose a new admin authorized to call timelock functions. This should be the Governor Contract

```solidity
function setPendingAdmin(address pendingAdmin_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| pendingAdmin_ | address | Address of the proposed admin |

- - -

### queueTransaction

Called for each action when queuing a proposal

```solidity
function queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) public returns (bytes32)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | Address of the contract with the method to be called |
| value | uint256 | Native token amount sent with the transaction |
| signature | string | Ssignature of the function to be called |
| data | bytes | Arguments to be passed to the function when called |
| eta | uint256 | Timestamp after which the transaction can be executed |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | Hash of the queued transaction |

- - -

### cancelTransaction

Called to cancel a queued transaction

```solidity
function cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | Address of the contract with the method to be called |
| value | uint256 | Native token amount sent with the transaction |
| signature | string | Ssignature of the function to be called |
| data | bytes | Arguments to be passed to the function when called |
| eta | uint256 | Timestamp after which the transaction can be executed |

- - -

### executeTransaction

Called to execute a queued transaction

```solidity
function executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) public payable returns (bytes)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | Address of the contract with the method to be called |
| value | uint256 | Native token amount sent with the transaction |
| signature | string | Ssignature of the function to be called |
| data | bytes | Arguments to be passed to the function when called |
| eta | uint256 | Timestamp after which the transaction can be executed |

- - -

