# SequencerChainlinkOracle

## Mainnet versions

The following proxy implementations were read on August 27, 2026 and match the [`SequencerChainlinkOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/SequencerChainlinkOracle.sol):

| Network | Checked block | Proxy | Implementation |
|---|---:|---|---|
| Arbitrum One | `498888003` | `0x9cd9Fcc7E3dEDA360de7c080590AaD377ac9F113` | `0x4256f572B8738126466e864D453BCCD0281b3C6C` |
| Optimism | `156113793` | `0x1076e5A60F1aC98e6f361813138275F1179BEb52` | `0x1Abf4919dE8ae2B917d553475e9B1D9CdE6E36D3` |

The sequencer feed is immutable in each implementation. Resolve and verify that immutable rather than assuming the network name alone selects the correct feed. Token feeds, stale periods, direct overrides, ownership, and ACM permissions are still dynamic proxy configuration.

This contract inherits the complete [ChainlinkOracle API](chainlink-oracle.md), including `initialize`, `NATIVE_TOKEN_ADDR`, `prices`, `tokenConfigs`, `setDirectPrice`, `setTokenConfig`, `setTokenConfigs`, `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and `setAccessControlManager`. Its override adds the one-hour sequencer recovery grace-period check before returning a price.

Oracle to fetch price using chainlink oracles on L2s with sequencer

# Solidity API

### sequencer

L2 Sequencer feed

```solidity
contract AggregatorV3Interface sequencer
```

- - -

### GRACE_PERIOD_TIME

L2 Sequencer grace period

```solidity
uint256 GRACE_PERIOD_TIME
```

- - -

### constructor

Contract constructor
        @param _sequencer L2 sequencer
        @custom:oz-upgrades-unsafe-allow constructor

```solidity
constructor(contract AggregatorV3Interface _sequencer) public
```

- - -

### getPrice

Gets the price of a asset from the chainlink oracle

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
| \[0\] | uint256 | Price in USD from Chainlink or a manually set price for the asset |

- - -
