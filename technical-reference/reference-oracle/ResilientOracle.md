# ResilientOracle
The Resilient Oracle is the main contract that the protocol uses to fetch prices of assets.

DeFi protocols are vulnerable to price oracle failures including oracle manipulation and incorrectly
reported prices. If only one oracle is used, this creates a single point of failure and opens a vector
for attacking the protocol.

The Resilient Oracle uses multiple sources and fallback mechanisms to provide accurate prices and protect
the protocol from oracle attacks. Currently it includes integrations with Chainlink, Pyth, Binance Oracle
and TWAP (Time-Weighted Average Price) oracles. TWAP uses PancakeSwap as the on-chain price source.

For every market (vToken) we configure the main, pivot and fallback oracles. The oracles are configured per 
vToken's underlying asset address. The main oracle oracle is the most trustworthy price source, the pivot 
oracle is used as a loose sanity checker and the fallback oracle is used as a backup price source. 

To validate prices returned from two oracles, we use an upper and lower bound ratio that is set for every
market. The upper bound ratio represents the deviation between reported price (the price that’s being
validated) and the anchor price (the price we are validating against) above which the reported price will
be invalidated. The lower bound ratio presents the deviation between reported price and anchor price below
which the reported price will be invalidated. So for oracle price to be considered valid the below statement
should be true:

```
anchorRatio = anchorPrice/reporterPrice
isValid = anchorRatio <= upperBoundAnchorRatio && anchorRatio >= lowerBoundAnchorRatio
```

In most cases, Chainlink is used as the main oracle, TWAP or Pyth oracles are used as the pivot oracle depending
on which supports the given market and Binance oracle is used as the fallback oracle. For some markets we may
use Pyth or TWAP as the main oracle if the token price is not supported by Chainlink or Binance oracles. 

For a fetched price to be valid it must be positive and not stagnant. If the price is invalid then we consider the
oracle to be stagnant and treat it like it's disabled.

# Solidity API

```solidity
enum OracleRole {
  MAIN,
  PIVOT,
  FALLBACK
}
```

```solidity
struct TokenConfig {
  address asset;
  address[3] oracles;
  bool[3] enableFlagsForOracles;
}
```

### vBnb

vBNB address

```solidity
address vBnb
```

- - -

### vai

VAI address

```solidity
address vai
```

- - -

### BNB_ADDR

Set this as asset address for BNB. This is the underlying for vBNB

```solidity
address BNB_ADDR
```

- - -

### boundValidator

Bound validator contract address

```solidity
contract BoundValidatorInterface boundValidator
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(address vBnbAddress, address vaiAddress, contract BoundValidatorInterface _boundValidator) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vBnbAddress | address | The address of the vBNB |
| vaiAddress | address | The address of the VAI |
| _boundValidator | contract BoundValidatorInterface | Address of the bound validator contract |

- - -

### initialize

Initializes the contract admin and sets the BoundValidator contract address

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | Address of the access control manager contract |

- - -

### pause

Pauses oracle

```solidity
function pause() external
```

#### ⛔️ Access Requirements
* Only Governance

- - -

### unpause

Unpauses oracle

```solidity
function unpause() external
```

#### ⛔️ Access Requirements
* Only Governance

- - -

### setTokenConfigs

Batch sets token configs

```solidity
function setTokenConfigs(struct ResilientOracle.TokenConfig[] tokenConfigs_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct ResilientOracle.TokenConfig[] | Token config array |

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Throws a length error if the length of the token configs array is 0

- - -

### setOracle

Sets oracle for a given asset and role.

```solidity
function setOracle(address asset, address oracle, enum ResilientOracle.OracleRole role) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Asset address |
| oracle | address | Oracle address |
| role | enum ResilientOracle.OracleRole | Oracle role |

#### 📅 Events
* Emits OracleSet event with asset address, oracle address and role of the oracle for the asset

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Null address error if main-role oracle address is null
* NotNullAddress error is thrown if asset address is null
* TokenConfigExistance error is thrown if token config is not set

- - -

### enableOracle

Enables/ disables oracle for the input asset. Token config for the input asset **must** exist

```solidity
function enableOracle(address asset, enum ResilientOracle.OracleRole role, bool enable) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Asset address |
| role | enum ResilientOracle.OracleRole | Oracle role |
| enable | bool | Enabled boolean of the oracle |

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* NotNullAddress error is thrown if asset address is null
* TokenConfigExistance error is thrown if token config is not set

- - -

### updatePrice

Updates the TWAP pivot oracle price.

```solidity
function updatePrice(address vToken) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

- - -

### updateAssetPrice

Updates the pivot oracle price. Currently using TWAP

```solidity
function updateAssetPrice(address asset) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |

- - -

### getUnderlyingPrice

Gets price of the underlying asset for a given vToken. Validation flow:
- Check if the oracle is paused globally
- Validate price from main oracle against pivot oracle
- Validate price from fallback oracle against pivot oracle if the first validation failed
- Validate price from main oracle against fallback oracle if the second validation failed
In the case that the pivot oracle is not available but main price is available and validation is successful,
main oracle price is returned.

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | vToken address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price USD price in scaled decimal places. |

#### ❌ Errors
* Paused error is thrown when resilent oracle is paused
* Invalid resilient oracle price error is thrown if fetched prices from oracle is invalid

- - -

### getPrice

Gets price of the asset

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
| [0] | uint256 | price USD price in scaled decimal places. |

#### ❌ Errors
* Paused error is thrown when resilent oracle is paused
* Invalid resilient oracle price error is thrown if fetched prices from oracle is invalid

- - -

### setTokenConfig

Sets/resets single token configs.

```solidity
function setTokenConfig(struct ResilientOracle.TokenConfig tokenConfig) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct ResilientOracle.TokenConfig | Token config struct |

#### 📅 Events
* Emits TokenConfigAdded event when the asset config is set successfully by the authorized account

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* NotNullAddress is thrown if asset address is null
* NotNullAddress is thrown if main-role oracle address for asset is null

- - -

### getOracle

Gets oracle and enabled status by asset address

```solidity
function getOracle(address asset, enum ResilientOracle.OracleRole role) public view returns (address oracle, bool enabled)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |
| role | enum ResilientOracle.OracleRole | Oracle role |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| oracle | address | Oracle address based on role |
| enabled | bool | Enabled flag of the oracle based on token config |

- - -

