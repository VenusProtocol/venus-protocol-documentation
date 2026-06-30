# BaseRiskSteward
Abstract base contract for Risk Steward contracts providing common functionality

# Solidity API

### safeDeltaBps

The safe delta threshold in basis points.
Updates within this delta are considered safe and require no timelock. Updates exceeding this delta require timelock.

```solidity
uint256 safeDeltaBps
```

- - -

### renounceOwnership

Disables renounceOwnership function

```solidity
function renounceOwnership() public pure
```

#### ❌ Errors
* Throws RenounceOwnershipNotAllowed

- - -

