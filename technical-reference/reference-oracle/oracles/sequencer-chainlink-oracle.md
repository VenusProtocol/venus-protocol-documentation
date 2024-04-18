# Sequencer Chain Link Oracle
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
| [0] | uint256 | Price in USD from Chainlink or a manually set price for the asset |

- - -

