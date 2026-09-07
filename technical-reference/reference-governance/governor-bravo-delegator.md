# GovernorBravoDelegator

[`GovernorBravoDelegator`](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Governance/GovernorBravoDelegator.sol) is the BNB mainnet governor proxy at `0x2d56dC077072B53571b8252008C60e945108c75a`. At block `118369123`, its public `implementation()` getter returned `0x9975d7064e40D16E1B76B90e56F606D72B385701`.

This page documents the delegator-only upgrade entry point. Calls not implemented by the delegator are delegated to the active [GovernorBravoDelegate](governor-bravo-delegate.md), so the user-facing proxy ABI is the union of both surfaces. Only the delegator admin can change the implementation.

# Solidity API

### \_setImplementation

Called by the admin to update the implementation of the delegator

```solidity
function _setImplementation(address implementation_) public
```

#### Parameters

| Name             | Type    | Description                                          |
| ---------------- | ------- | ---------------------------------------------------- |
| implementation\_ | address | The address of the new implementation for delegation |

---
