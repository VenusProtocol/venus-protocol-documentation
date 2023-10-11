# TwapOracle
This oracle fetches price of assets from PancakeSwap.

# Solidity API

```solidity
struct Observation {
  uint256 timestamp;
  uint256 acc;
}
```

```solidity
struct TokenConfig {
  address asset;
  uint256 baseUnit;
  address pancakePool;
  bool isBnbBased;
  bool isReversedPool;
  uint256 anchorPeriod;
}
```

### BNB_ADDR

Set this as asset address for BNB. This is the underlying for vBNB

```solidity
address BNB_ADDR
```

- - -

### WBNB

WBNB address

```solidity
address WBNB
```

- - -

### BNB_BASE_UNIT

the base unit of WBNB and BUSD, which are the paired tokens for all assets

```solidity
uint256 BNB_BASE_UNIT
```

- - -

### tokenConfigs

Configs by token

```solidity
mapping(address => struct TwapOracle.TokenConfig) tokenConfigs
```

- - -

### prices

Stored price by token

```solidity
mapping(address => uint256) prices
```

- - -

### observations

Keeps a record of token observations mapped by address, updated on every updateTwap invocation.

```solidity
mapping(address => struct TwapOracle.Observation[]) observations
```

- - -

### windowStart

Observation array index which probably falls in current anchor period mapped by asset address

```solidity
mapping(address => uint256) windowStart
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(address wBnbAddress) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| wBnbAddress | address | The address of the WBNB |

- - -

### setTokenConfigs

Adds multiple token configs at the same time

```solidity
function setTokenConfigs(struct TwapOracle.TokenConfig[] configs) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| configs | struct TwapOracle.TokenConfig[] | Config array |

#### ❌ Errors
* Zero length error thrown, if length of the config array is 0

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

### getPrice

Get the TWAP price for the given asset

```solidity
function getPrice(address asset) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price asset price in USD |

#### ❌ Errors
* Missing error is thrown if the token config does not exist
* Range error is thrown if TWAP price is not greater than zero

- - -

### setTokenConfig

Adds a single token config

```solidity
function setTokenConfig(struct TwapOracle.TokenConfig config) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| config | struct TwapOracle.TokenConfig | token config struct |

#### 📅 Events
* Emits TokenConfigAdded event if new token config are added with
* asset address, PancakePool address, anchor period address

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Range error is thrown if anchor period is not greater than zero
* Range error is thrown if base unit is not greater than zero
* Value error is thrown if base unit decimals is not the same as asset decimals
* NotNullAddress error is thrown if address of asset is null
* NotNullAddress error is thrown if PancakeSwap pool address is null

- - -

### updateTwap

Updates the current token/BUSD price from PancakeSwap, with 18 decimals of precision.

```solidity
function updateTwap(address asset) public returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | anchorPrice anchor price of the asset |

#### ❌ Errors
* Missing error is thrown if token config does not exist

- - -

### currentCumulativePrice

Fetches the current token/WBNB and token/BUSD price accumulator from PancakeSwap.

```solidity
function currentCumulativePrice(struct TwapOracle.TokenConfig config) public view returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | cumulative price of target token regardless of pair order |

- - -

