# Resilient Oracle

## Introduction

The Resilient Oracle is the main contract that the protocol uses to fetch prices of assets.

DeFi protocols are vulnerable to price oracle failures including oracle manipulation and incorrectly reported prices. If only one oracle is used, this creates a single point of failure and opens a vector for attacking the protocol.

The Resilient Oracle uses multiple sources and fallback mechanisms to provide accurate prices and protect the protocol from oracle attacks. Currently it includes integrations with Chainlink, Pyth, Binance Oracle and TWAP (Time-Weighted Average Price) oracles. TWAP uses PancakeSwap as the on-chain price source.

## Details

For every market (vToken) we configure the main, pivot and fallback oracles. The main oracle oracle is the most trustworthy price source, the pivot oracle is used as a loose sanity checker and the fallback oracle is used as a backup price source.

![Resilient Oracle](../.gitbook/assets/oracles.png)

To validate prices returned from two oracles, we use an upper and lower bound ratio that is set for every market. The upper bound ratio represents the deviation between reported price (the price that’s being validated) and the anchor price (the price we are validating against) above which the reported price will be invalidated. The lower bound ratio presents the deviation between reported price and anchor price below which the reported price will be invalidated. So for oracle price to be considered valid the below statement should be true:

```
anchorRatio = anchorPrice/reporterPrice
isValid = anchorRatio <= upperBoundAnchorRatio && anchorRatio >= lowerBoundAnchorRatio
```

In most cases, Chainlink is used as the main oracle, TWAP or Pyth oracles are used as the pivot oracle depending on which supports the given market and Binance oracle is used as the fallback oracle. For some markets we may use Pyth or TWAP as the main oracle if the token price is not supported by Chainlink or Binance oracles. 

For a fetched price to be valid it must be positive and not stagnant. If the price is invalid then we consider the oracle to be stagnant and treat it like it's disabled.

## Solidity API

### initialize

```solidity
function initialize(contract BoundValidatorInterface _boundValidator) public
```

Initializes the contract admin and sets the required contracts

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _boundValidator | contract BoundValidatorInterface | Address of the bound validator contract |

### pause

```solidity
function pause() external
```

Pause oracle

### unpause

```solidity
function unpause() external
```

Unpause oracle

### getTokenConfig

```solidity
function getTokenConfig(address vToken) external view returns (struct ResilientOracle.TokenConfig)
```

_Get token config by vToken address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vtoken address |

### getOracle

```solidity
function getOracle(address vToken, enum ResilientOracle.OracleRole role) public view returns (address oracle, bool enabled)
```

Get oracle & enabling status by vToken address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vtoken address |
| role | enum ResilientOracle.OracleRole | oracle role |

### setTokenConfigs

```solidity
function setTokenConfigs(struct ResilientOracle.TokenConfig[] tokenConfigs_) external
```

Batch set token configs

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct ResilientOracle.TokenConfig[] | token config array |

### setTokenConfig

```solidity
function setTokenConfig(struct ResilientOracle.TokenConfig tokenConfig) public
```

Set single token configs, vToken MUST HAVE NOT be added before, and main oracle MUST NOT be zero address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct ResilientOracle.TokenConfig | token config struct |

### setOracle

```solidity
function setOracle(address vToken, address oracle, enum ResilientOracle.OracleRole role) external
```

Set oracle of any type for the input vToken, input vToken MUST exist

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |
| oracle | address | oracle address |
| role | enum ResilientOracle.OracleRole | oracle role |

### enableOracle

```solidity
function enableOracle(address vToken, enum ResilientOracle.OracleRole role, bool enable) external
```

Enable/disable oracle for the input vToken, input vToken MUST exist

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |
| role | enum ResilientOracle.OracleRole | oracle role |
| enable | bool | expected status |

### updatePrice

```solidity
function updatePrice(address vToken) external
```

Currently it calls the updateTwap. This function should be called everytime before calling getUnderlyingPrice

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

### getUnderlyingPrice

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

Get price of underlying asset of the input vToken, check flow:
- check the global pausing status
- check price from main oracle against pivot oracle
- check price from fallback oracle against pivot oracle or main oracle if fails

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | USD price in scaled decimals e.g., vToken decimals is 8 then price is returned as `10**18 * 10**(18-8) = 10**28` decimals  |
