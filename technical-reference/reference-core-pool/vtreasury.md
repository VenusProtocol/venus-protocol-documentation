# VTreasury

This page documents the BNB-specific legacy [`VTreasury` source in `venus-protocol` v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Governance/VTreasury.sol), an `Ownable` contract that can receive native BNB and hold BEP-20 tokens.

{% hint style="danger" %}
Both withdrawal functions can move the contract's full available balance to an arbitrary recipient and are owner-only in this source. The deployed address, owner, balances, allowances, and continuing operational duty are dynamic. Use the [Funds registry](../../deployed-contracts/funds.md) to select a chain address, then verify its exact implementation and live owner; do not treat this legacy API as the treasury model for every network.
{% endhint %}

If the requested withdrawal exceeds the live balance, this implementation withdraws the available balance rather than reverting for an excessive amount.

## Solidity API

### fallback

To receive BNB

```solidity
function() external payable
```

---

### withdrawTreasuryBEP20

Withdraws up to the available balance of a BEP-20 token. Only the live owner can call this function.

```solidity
function withdrawTreasuryBEP20(address tokenAddress, uint256 withdrawAmount, address withdrawAddress) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | The address of treasury token |
| withdrawAmount | uint256 | Requested amount; capped to the contract's token balance |
| withdrawAddress | address | Recipient of the withdrawn tokens |

---

### withdrawTreasuryBNB

Withdraws up to the available native BNB balance. Only the live owner can call this function.

```solidity
function withdrawTreasuryBNB(uint256 withdrawAmount, address payable withdrawAddress) external payable
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| withdrawAmount | uint256 | Requested amount; capped to the contract's BNB balance |
| withdrawAddress | address payable | Recipient of the withdrawn BNB |

---
