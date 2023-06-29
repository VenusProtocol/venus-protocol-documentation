# VAI Unitroller

This is the proxy contract for the VAIComptroller

# Solidity API

### \_setPendingImplementation

* Admin Functions \*\*

```solidity
function _setPendingImplementation(address newPendingImplementation) public returns (uint256)
```

---

### \_acceptImplementation

Accepts new implementation of comptroller. msg.sender must be pendingImplementation

```solidity
function _acceptImplementation() public returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_setPendingAdmin

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```solidity
function _setPendingAdmin(address newPendingAdmin) public returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newPendingAdmin | address | New pending admin. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```solidity
function _acceptAdmin() public returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---
