# AccessControlledV5

[`AccessControlledV5`](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Governance/AccessControlledV5.sol) is the Solidity 0.5.16 adapter retained for legacy contracts such as Governor Bravo and older protocol components. Its compiler generation is old, but the base is not globally deprecated while those deployments remain active.

It exposes the configured AccessControlManager and provides internal initialization and permission-check helpers. It has no public ACM setter; the inheriting contract determines when `_setAccessControlManager` can run.

# Solidity API

### accessControlManager

Returns the address of the access control manager contract

```solidity
function accessControlManager() external view returns (contract IAccessControlManagerV5)
```

---
