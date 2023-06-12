# PythOracle
PythOracle contract reads prices from actual Pyth oracle contract which accepts, verifies and stores the updated prices from external sources

# Solidity API

```solidity
struct TokenConfig {
  bytes32 pythId;
  address asset;
  uint64 maxStalePeriod;
}
```

### EXP_SCALE

Exponent scale (decimal precision) of prices

```solidity
uint256 EXP_SCALE
```

- - -

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

### underlyingPythOracle

The actual pyth oracle address fetch & store the prices

```solidity
contract IPyth underlyingPythOracle
```

- - -

### tokenConfigs

Token configs by asset address

```solidity
mapping(address => struct PythOracle.TokenConfig) tokenConfigs
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(address vBnbAddress, address vaiAddress) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vBnbAddress | address | The address of the vBNB |
| vaiAddress | address | The address of the VAI |

- - -

### setTokenConfigs

Batch set token configs

```solidity
function setTokenConfigs(struct PythOracle.TokenConfig[] tokenConfigs_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfigs_ | struct PythOracle.TokenConfig[] | Token config array |

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Zero length error is thrown if length of the array in parameter is 0

- - -

### setUnderlyingPythOracle

Set the underlying Pyth oracle contract address

```solidity
function setUnderlyingPythOracle(contract IPyth underlyingPythOracle_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingPythOracle_ | contract IPyth | Pyth oracle contract address |

#### 📅 Events
* Emits PythOracleSet event with address of Pyth oracle.

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* NotNullAddress error thrown if underlyingPythOracle_ address is zero

- - -

### initialize

Initializes the owner of the contract and sets required contracts

```solidity
function initialize(address underlyingPythOracle_, address accessControlManager_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| underlyingPythOracle_ | address | Address of the Pyth oracle |
| accessControlManager_ | address | Address of the access control manager contract |

- - -

### getUnderlyingPrice

Get price of underlying asset of the input vToken, under the hood this function
get price from Pyth contract, the prices of which are updated externally

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
| [0] | uint256 | price Underlying price with a precision of 18 decimals |

#### ❌ Errors
* Zero address error thrown if underlyingPythOracle address is null
* Zero address error thrown if asset address is null
* Range error thrown if price of Pyth oracle is not greater than zero

- - -

### setTokenConfig

Set single token config. `maxStalePeriod` cannot be 0 and `vToken` can be a null address

```solidity
function setTokenConfig(struct PythOracle.TokenConfig tokenConfig) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenConfig | struct PythOracle.TokenConfig | Token config struct |

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Range error is thrown if max stale period is zero
* NotNullAddress error is thrown if asset address is null

- - -

