# Binance Oracle

## Introduction

This oracle fetchs prices of assets from Binance oracle.

## Solidity APIs

### initialize

```solidity
function initialize(contract FeedRegistryInterface feed) public
```

Sets the contracts required to fetch price

#### Parameters

| Name | Type                           | Description                              |
| ---- | ------------------------------ | ---------------------------------------- |
| feed | contract FeedRegistryInterface | Address of binance oracle feed registry. |

### getUnderlyingPrice

```solidity
function getUnderlyingPrice(contract VBep20Interface vToken) public view returns (uint256)
```

Gets the price of vToken from binance oracle

#### Parameters

| Name   | Type                     | Description           |
| ------ | ------------------------ | --------------------- |
| vToken | contract VBep20Interface | Address of the vToken |

#### Return Values

| Name | Type    | Description  |
| ---- | ------- | ------------ |
| [0]  | uint256 | price in USD |
