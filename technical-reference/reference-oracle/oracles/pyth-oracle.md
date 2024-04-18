# PythOracle
PythOracle contract reads prices from actual Pyth oracle contract which accepts, verifies and stores
the updated prices from external sources

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

Constructor for the implementation contract.

```solidity
constructor() public
```

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

### setTokenConfig

Set single token config. `maxStalePeriod` cannot be 0 and `asset` cannot be a null address

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

### getPrice

Gets the price of a asset from the pyth oracle

```solidity
function getPrice(address asset) public view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of the asset |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Price in USD |

- - -

