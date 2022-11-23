# Bound Validator

## Introduction

This contracts is used to validate prices from two different sources. We need to set upper and lower bound ratios config for each vToken in this contract.

## Solidity API


### initialize

```solidity
function initialize() public
```

Initializes the owner of the contract

### setValidateConfigs

```solidity
function setValidateConfigs(struct ValidateConfig[] configs) external virtual
```

Add multiple validation configs at the same time

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| configs | struct ValidateConfig[] | config array |

### setValidateConfig

```solidity
function setValidateConfig(struct ValidateConfig config) public virtual
```

Add single validation config

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| config | struct ValidateConfig | config struct |

### validatePriceWithAnchorPrice

```solidity
function validatePriceWithAnchorPrice(address vToken, uint256 reporterPrice, uint256 anchorPrice) public view virtual returns (bool)
```

Test reported asset price against anchor price

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |
| reporterPrice | uint256 | the price to be tested |
| anchorPrice | uint256 |  |

### _isWithinAnchor

```solidity
function _isWithinAnchor(address asset, uint256 reporterPrice, uint256 anchorPrice) internal view returns (bool)
```

Test whether the reported price is within the predefined bounds

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |
| reporterPrice | uint256 | the price to be tested |
| anchorPrice | uint256 | anchor price as testing anchor |
