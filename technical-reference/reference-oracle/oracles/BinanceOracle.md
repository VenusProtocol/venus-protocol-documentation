# BinanceOracle
This oracle fetches price of assets from Binance.

# Solidity API

### BNB_ADDR

Set this as asset address for BNB. This is the underlying address for vBNB

```solidity
address BNB_ADDR
```

- - -

### maxStalePeriod

Max stale period configuration for assets

```solidity
mapping(string => uint256) maxStalePeriod
```

- - -

### symbols

Override symbols to be compatible with Binance feed registry

```solidity
mapping(string => string) symbols
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor() public
```

- - -

### setMaxStalePeriod

Used to set the max stale period of an asset

```solidity
function setMaxStalePeriod(string symbol, uint256 _maxStalePeriod) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the asset |
| _maxStalePeriod | uint256 | The max stake period |

- - -

### setSymbolOverride

Used to override a symbol when fetching price

```solidity
function setSymbolOverride(string symbol, string overrideSymbol) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol to override |
| overrideSymbol | string | The symbol after override |

- - -

### initialize

Sets the contracts required to fetch prices

```solidity
function initialize(address _sidRegistryAddress, address _accessControlManager) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _sidRegistryAddress | address | Address of SID registry |
| _accessControlManager | address | Address of the access control manager contract |

- - -

### getFeedRegistryAddress

Uses Space ID to fetch the feed registry address

```solidity
function getFeedRegistryAddress() public view returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | feedRegistryAddress Address of binance oracle feed registry. |

- - -

### getPrice

Gets the price of a asset from the binance oracle

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

