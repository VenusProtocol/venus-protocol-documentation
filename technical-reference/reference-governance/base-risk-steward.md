# BaseRiskSteward
Abstract base contract for Risk Steward contracts providing common functionality

[`BaseRiskSteward` at governance-contracts v2.15.0](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/RiskSteward/BaseRiskSteward.sol) is not deployed directly. It provides the shared `safeDeltaBps` threshold and owner-only update used by the concrete market-cap, collateral-factor, and interest-rate-model stewards.

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
