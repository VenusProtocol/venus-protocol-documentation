# ChainlinkOracle

## Mainnet versions

The following proxy implementations were read on August 27, 2026 and match the [`ChainlinkOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/ChainlinkOracle.sol):

| Network | Checked block | Proxy | Implementation |
|---|---:|---|---|
| BNB Chain | `118367342` | `0x1B2103441A0A108daD8848D8F5d790e4D402921F` | `0x219cFfEFB1afA9F34695C7fACD9B98d1b3291C8b` |
| Ethereum | `25845949` | `0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2` | `0x36EFe8716fa2ff9f59D528d154D89054581866A5` |
| Base | `50518509` | `0x6F2eA73597955DB37d7C06e1319F0dC7C7455dEb` | `0xdA079597acD9eda0c7638534fDB43F06393Fe507` |
| zkSync Era | `71738420` | `0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5` | `0xb20d1B03C62D2c8Dc150298b8D151AF022068347` |

Arbitrum One and Optimism mainnet use the [`SequencerChainlinkOracle`](sequencer-chainlink-oracle.md) family instead. Feed addresses, stale periods, direct price overrides, ownership, and ACM permissions remain per-proxy dynamic configuration.

The proxy API inherits `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and owner-only `setAccessControlManager`.

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
| \[0\] | uint256 | Price in USD from Chainlink or a manually set price for the asset |

- - -
