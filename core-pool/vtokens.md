# vtoken

## Introduction

vTokens are the primary means of interacting with the Venus Protocol; when a user mints, redeems, borrows, repays a borrow, liquidates a borrow, or transfers vTokens, she will do so using the vToken contract.

There are currently two types of vTokens: 
1. VBep20
2. VBnb

- Both types expose the EIP-20 interface
- VBep20 wraps an underlying BEP-20 asset
- VBnb simply wraps BNB itself

Core functions which involve transferring an asset into the protocol have slightly different interfaces depending on the type which are listed below.


## Details

- VToken actions:

1. Mint
2. Redeem
3. Redeem Underlying
4. Borrow
5. Repay Borrow
6. Repay Borrow Behalf
7. Liquidate Borrow

- View functions and storage values:

1. ExchangeRate
2. Cash
3. Total Borrows
4. Borrow Balance
5. Borrow Rate
6. Total Supply
7. UnderlyingBalance
8. Supply Rate
9. Total Reserves
10. Reserve Factor

# Solidity API

### Mint VToken

The mint function transfers an asset into the protocol, which begins accumulating interest based on the current Supply Rate for The user receives a quantity of vTokens equal to the underlying tokens tokens supplied, divided by the current Exchange Rate.

```solidity
function mint(uint mintAmount) returns (uint)
```
#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintAmount | uint | address of comptroller |
| vTokenBorrowed | address | address of the vToken Borrowed |
| vTokenCollateral | address | address of collateral for vToken |
| actualRepayAmount | uint | repayment amount i.e amount to be repaid from total borrowed amount |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator |
| [1] | uint | number of collateral tokens to seize |
