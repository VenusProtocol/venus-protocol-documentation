# ChainlinkOracle
This oracle fetches prices of assets from the Chainlink oracle.

# Solidity API

```solidity
struct TokenConfig {
  address asset;
  address feed;
  uint256 maxStalePeriod;
}
```

### NATIVE_TOKEN_ADDR

Set this as asset address for native token on each chain.
This is the underlying address for vBNB on BNB chain or an underlying asset for a native market on any chain.

```solidity
address NATIVE_TOKEN_ADDR
```

- - -

### prices

Manually set an override price, useful under extenuating conditions such as price feed failure

```solidity
mapping(address => uint256) prices
```

- - -

### tokenConfigs

Token config by assets

```solidity
mapping(address => struct ChainlinkOracle.TokenConfig) tokenConfigs
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor() public
```

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

### setDirectPrice

Manually set the price of a given asset

```solidity
function setDirectPrice(address asset, uint256 price) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Asset address |
| price | uint256 | Asset price in 18 decimals |

#### 📅 Events
* Emits PricePosted event on succesfully setup of asset price

#### ⛔️ Access Requirements
* Only Governance

- - -

### setTokenConfigs

Add multiple token configs at the same time

```solidity
function setTokenConfigs(struct ChainlinkOracle.TokenConfig[] tokenConfigs_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct ChainlinkOracle.TokenConfig[] | config array |

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Zero length error thrown, if length of the array in parameter is 0

- - -

### setTokenConfig

Add single token config. asset & feed cannot be null addresses and maxStalePeriod must be positive

```solidity
function setTokenConfig(struct ChainlinkOracle.TokenConfig tokenConfig) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct ChainlinkOracle.TokenConfig | Token config struct |

#### 📅 Events
* Emits TokenConfigAdded event on succesfully setting of the token config

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* NotNullAddress error is thrown if asset address is null
* NotNullAddress error is thrown if token feed address is null
* Range error is thrown if maxStale period of token is not greater than zero

- - -

### getPrice

Gets the price of a asset from the chainlink oracle

```solidity
function getPrice(address asset) public view virtual returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of the asset |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Price in USD from Chainlink or a manually set price for the asset |

- - -

