# AccessControlledV8

[`AccessControlledV8`](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Governance/AccessControlledV8.sol) is the current Solidity 0.8.25 upgradeable adapter between an inheriting contract and AccessControlManager. The previous statement that this stable source uses Solidity 0.8.13 is stale.

The base inherits OpenZeppelin `Ownable2StepUpgradeable`: `setAccessControlManager` is owner-only, while ownership transfer requires the pending owner to accept. Older inheriting deployments can expose a different inherited surface, so select the ABI by implementation rather than by this base page alone.

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

* Emits NewAccessControlManager event

#### ⛔️ Access Requirements

* Only Governance

---

### accessControlManager

Returns the address of the access control manager contract

```solidity
function accessControlManager() external view returns (contract IAccessControlManagerV8)
```

---
