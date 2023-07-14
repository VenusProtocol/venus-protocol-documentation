# VTreasury

## VTreasury

Contract for treasury all tokens as fee and transfer to governance

## Solidity API

#### fallback

To receive BNB

```solidity
fallback() external payable
```



#### withdrawTreasuryBEP20

Withdraw Treasury BEP20 Tokens, Only owner call it

```solidity
function withdrawTreasuryBEP20(address tokenAddress, uint256 withdrawAmount, address withdrawAddress) external
```

**Parameters**

| Name            | Type    | Description                   |
| --------------- | ------- | ----------------------------- |
| tokenAddress    | address | The address of treasury token |
| withdrawAmount  | uint256 | The withdraw amount to owner  |
| withdrawAddress | address | The withdraw address          |



#### withdrawTreasuryBNB

Withdraw Treasury BNB, Only owner call it

```solidity
function withdrawTreasuryBNB(uint256 withdrawAmount, address payable withdrawAddress) external payable
```

**Parameters**

| Name            | Type            | Description                  |
| --------------- | --------------- | ---------------------------- |
| withdrawAmount  | uint256         | The withdraw amount to owner |
| withdrawAddress | address payable | The withdraw address         |

