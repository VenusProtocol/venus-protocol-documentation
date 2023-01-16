# Chainlink Oracle

## Introduction

This oracle fetchs prices of assets from the Chainlink oracle.

## Solidity API

### initialize

```solidity
function initialize() public
```

Initializes the owner of the contract

### getUnderlyingPrice

```solidity
function getUnderlyingPrice(address vToken) public view returns (uint256)
```

Get the Chainlink price of underlying asset of input vToken, revert when vToken is zero address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price in USD |


### setUnderlyingPrice

```solidity
function setUnderlyingPrice(contract VBep20Interface vToken, uint256 underlyingPriceMantissa) external
```

Set the forced prices of the underlying token of input vToken

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VBep20Interface | vToken address |
| underlyingPriceMantissa | uint256 | price in 18 decimals |

### setDirectPrice

```solidity
function setDirectPrice(address asset, uint256 price) external
```

Set the forced prices of the input token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |
| price | uint256 | price in 18 decimals |

### setTokenConfigs

```solidity
function setTokenConfigs(struct TokenConfig[] tokenConfigs_) external
```

Add multiple token configs at the same time

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct TokenConfig[] | config array |

### setTokenConfig

```solidity
function setTokenConfig(struct TokenConfig tokenConfig) public
```

Add single token config, vToken & feed cannot be zero address, and maxStalePeriod must be positive

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct TokenConfig | token config struct |