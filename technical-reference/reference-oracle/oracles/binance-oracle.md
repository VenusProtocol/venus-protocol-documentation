# BinanceOracle

## Mainnet versions

The following transparent-proxy implementations were read on August 27, 2026 and match the [`BinanceOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/BinanceOracle.sol):

| Network | Checked block | Proxy | Implementation |
|---|---:|---|---|
| BNB Chain | `118367342` | `0x594810b741d136f1960141C0d8Fb4a91bE78A820` | `0x201C72986d391A5a8E1713ac5a42CEAf90556a1b` |
| opBNB | `178837732` | `0xB09EC9B628d04E1287216Aa3e2432291f50F9588` | `0x05CEE4B936C654be43993D3A8Baa76c8fdd5BeCC` |

Feed-registry addresses, token-symbol overrides, stale periods, ownership, ACM permissions, and active ResilientOracle roles are dynamic and must be read separately.

The proxy API inherits `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and owner-only `setAccessControlManager`.

This oracle fetches price of assets from Binance.

# Solidity API

### sidRegistryAddress

Used to fetch feed registry address.

```solidity
address sidRegistryAddress
```

- - -

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

### feedRegistryAddress

Used to fetch price of assets used directly when space ID is not supported by current chain.

```solidity
address feedRegistryAddress
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor() public
```

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

### setFeedRegistryAddress

Used to set feed registry address when current chain does not support space ID.

```solidity
function setFeedRegistryAddress(address newfeedRegistryAddress) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newfeedRegistryAddress | address | Address of new feed registry. |

- - -

### getFeedRegistryAddress

Uses Space ID to fetch the feed registry address

```solidity
function getFeedRegistryAddress() public view returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0\] | address | feedRegistryAddress Address of binance oracle feed registry. |

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
| \[0\] | uint256 | Price in USD |

- - -
