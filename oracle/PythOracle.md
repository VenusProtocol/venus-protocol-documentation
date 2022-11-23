# TWAP Oracle

## Introduction

This oracle fetches price of assets from Pyth oracle

## Solidity API


### initialize

```solidity
function initialize(address underlyingPythOracle_) public
```

Initializes the owner of the contract and sets required contracts

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingPythOracle_ | address | Address of the pyth oracle |

### setTokenConfigs

```solidity
function setTokenConfigs(struct TokenConfig[] tokenConfigs_) external
```

Batch set token configs

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct TokenConfig[] | token config array |

### setTokenConfig

```solidity
function setTokenConfig(struct TokenConfig tokenConfig) public
```

Set single token config, `maxStalePeriod` cannot be 0 and `vToken` can be zero address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct TokenConfig | token config struct |

### setUnderlyingPythOracle

```solidity
function setUnderlyingPythOracle(contract IPyth underlyingPythOracle_) external
```

set the underlying pyth oracle contract address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingPythOracle_ | contract IPyth | pyth oracle contract address |

### getUnderlyingPrice

```solidity
function getUnderlyingPrice(address vToken) public view returns (uint256)
```

Get price of underlying asset of the input vToken, under the hood this function
get price from Pyth contract, the prices of which are updated externally

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price in 10 decimals |

