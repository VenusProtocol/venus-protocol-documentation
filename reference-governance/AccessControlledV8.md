# AccessControlledV8

This contract is helper between access control manager and actual contract. This contract further inherited by other contract (using solidity 0.8.13)
to integrate access controlled mechanism. It provides initialise methods and verifying access methods.

# Solidity API

### setAccessControlManager

Sets the address of AccessControlManager

```solidity
function setAccessControlManager(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                                 |
| ---------------------- | ------- | ------------------------------------------- |
| accessControlManager\_ | address | The new address of the AccessControlManager |

#### 📅 Events

- Emits NewAccessControlManager event

#### ⛔️ Access Requirements

- Only Governance

---

### accessControlManager

Returns the address of the access control manager contract

```solidity
function accessControlManager() external view returns (contract IAccessControlManagerV8)
```

---
