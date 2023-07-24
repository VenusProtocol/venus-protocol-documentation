# BoundValidator
The BoundValidator contract is used to validate prices fetched from two different sources.
Each asset has an upper and lower bound ratio set in the config. In order for a price to be valid
it must fall within this range of the validator price.

# Solidity API

```solidity
struct ValidateConfig {
  address asset;
  uint256 upperBoundRatio;
  uint256 lowerBoundRatio;
}
```

### validateConfigs

validation configs by asset

```solidity
mapping(address => struct BoundValidator.ValidateConfig) validateConfigs
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor() public
```

- - -

### setValidateConfigs

Add multiple validation configs at the same time

```solidity
function setValidateConfigs(struct BoundValidator.ValidateConfig[] configs) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| configs | struct BoundValidator.ValidateConfig[] | Array of validation configs |

#### 📅 Events
* Emits ValidateConfigAdded for each validation config that is successfully set

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Zero length error is thrown if length of the config array is 0

- - -

### initialize

Initializes the owner of the contract

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | Address of the access control manager contract |

- - -

### setValidateConfig

Add a single validation config

```solidity
function setValidateConfig(struct BoundValidator.ValidateConfig config) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| config | struct BoundValidator.ValidateConfig | Validation config struct |

#### 📅 Events
* Emits ValidateConfigAdded when a validation config is successfully set

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Null address error is thrown if asset address is null
* Range error thrown if bound ratio is not positive
* Range error thrown if lower bound is greater than or equal to upper bound

- - -

### validatePriceWithAnchorPrice

Test reported asset price against anchor price

```solidity
function validatePriceWithAnchorPrice(address asset, uint256 reportedPrice, uint256 anchorPrice) public view virtual returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |
| reportedPrice | uint256 | The price to be tested |
| anchorPrice | uint256 |  |

#### ❌ Errors
* Missing error thrown if asset config is not set
* Price error thrown if anchor price is not valid

- - -

