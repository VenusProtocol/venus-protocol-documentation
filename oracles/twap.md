# TWAP Oracle

## Introduction

This oracle fetches price of assets from PancakeSwap

## Solidity API

### initialize

```solidity
function initialize(address WBNB_) public
```

Initializes the owner of the contract and sets the contracts required

#### Parameters

| Name   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| WBNB\_ | address | Address of the WBNB token contract |

### setTokenConfigs

```solidity
function setTokenConfigs(struct TokenConfig[] configs) external
```

Add multiple token configs at the same time

#### Parameters

| Name    | Type                 | Description  |
| ------- | -------------------- | ------------ |
| configs | struct TokenConfig[] | config array |

### setTokenConfig

```solidity
function setTokenConfig(struct TokenConfig config) public
```

Add single token configs

#### Parameters

| Name   | Type               | Description         |
| ------ | ------------------ | ------------------- |
| config | struct TokenConfig | token config struct |

### getUnderlyingPrice

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

Get the underlying TWAP price of input vToken

#### Parameters

| Name   | Type    | Description    |
| ------ | ------- | -------------- |
| vToken | address | vToken address |

#### Return Values

| Name | Type    | Description  |
| ---- | ------- | ------------ |
| [0]  | uint256 | price in USD |

### currentCumulativePrice

```solidity
function currentCumulativePrice(struct TokenConfig config) public view returns (uint256)
```

Fetches the current token/WBNB and token/BUSD price accumulator from pancakeswap.

#### Return Values

| Name | Type    | Description                                               |
| ---- | ------- | --------------------------------------------------------- |
| [0]  | uint256 | cumulative price of target token regardless of pair order |

### updateTwap

```solidity
function updateTwap(address vToken) public returns (uint256)
```

Updates the current token/BUSD price from PancakeSwap, with 18 decimals of precision.

#### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| [0]  | uint256 | vToken Address of vToken |
