# AccessControlledV5
This contract is helper between access control manager and actual contract. This contract further inherited by other contract (using solidity 0.5.16)
to integrate access controlled mechanism. It provides initialise methods and verifying access methods.

# Solidity API

### accessControlManager

Returns the address of the access control manager contract

```solidity
function accessControlManager() external view returns (contract IAccessControlManagerV5)
```

- - -

