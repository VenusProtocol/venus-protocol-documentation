# BoundValidator

## Mainnet versions

The current transparent-proxy implementations below were read on August 27, 2026 and match the [`BoundValidator` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/BoundValidator.sol):

| Network | Checked block | Proxy | Implementation |
|---|---:|---|---|
| BNB Chain | `118367342` | `0x6E332fF0bB52475304494E4AE5063c1051c7d735` | `0xbE4176749a74320641e24102B2Af2Ca37FAF2DF1` |
| Ethereum | `25845949` | `0x1Cd5f336A1d28Dff445619CC63d3A0329B4d8a58` | `0x955c01a8307618Ac3e5Fc08a7444f5cB6bD7d71e` |
| Arbitrum One | `498888003` | `0x2245FA2420925Cd3C2D889Ddc5bA1aefEF0E14CF` | `0x20Fb908a61C000431C4FCb4A51FcB67b73a8A526` |
| Optimism | `156113793` | `0x37A04a1eF784448377a19F2b1b67cD40c09eA505` | `0xc04C8dFF5a91f82f5617Ee9Bd83f6d96de0eb39C` |
| Base | `50518509` | `0x66dDE062D3DC1BB5223A0096EbB89395d1f11DB0` | `0xc92eefCE80e7Ca529a060C485F462C90416cA38A` |
| opBNB | `178837732` | `0xd1f80C371C6E2Fa395A5574DB3E3b4dAf43dadCE` | `0xe630fa259c893D9a1d8b1d61EdFB1B59EF574df4` |
| zkSync Era | `71738420` | `0x51519cdCDDD05E2ADCFA108f4a960755D9d6ea8b` | `0xc79fE34320903dA7a19E6335417C7131293844ED` |
| Unichain | `57078006` | `0xfdaA5dEEA7850997dA8A6E2F2Ab42E60F1011C19` | `0x287F0f107ab4a5066bd257d684AFCc09c8d31Bde` |

Bounds are per-asset mutable configuration. This version map does not certify any current upper/lower ratio.

The proxy API inherits `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and owner-only `setAccessControlManager`.

The BoundValidator contract is used to validate prices fetched from two different sources.
Each asset has an upper and lower bound ratio set in the config. In order for a price to be valid
it must fall within this range of the validator price.

# Solidity API

```solidity
struct ValidateConfig {
  address asset;
  uint256 upperBoundRatio;
  uint256 lowerBoundRatio;
}
```

### validateConfigs

validation configs by asset

```solidity
mapping(address => struct BoundValidator.ValidateConfig) validateConfigs
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

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

### setValidateConfigs

Add multiple validation configs at the same time

```solidity
function setValidateConfigs(struct BoundValidator.ValidateConfig[] configs) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| configs | struct BoundValidator.ValidateConfig[] | Array of validation configs |

#### 📅 Events
* Emits ValidateConfigAdded for each validation config that is successfully set

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Zero length error is thrown if length of the config array is 0

- - -

### setValidateConfig

Add a single validation config

```solidity
function setValidateConfig(struct BoundValidator.ValidateConfig config) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| config | struct BoundValidator.ValidateConfig | Validation config struct |

#### 📅 Events
* Emits ValidateConfigAdded when a validation config is successfully set

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Null address error is thrown if asset address is null
* Range error thrown if bound ratio is not positive
* Range error thrown if lower bound is greater than or equal to upper bound

- - -

### validatePriceWithAnchorPrice

Test reported asset price against anchor price

```solidity
function validatePriceWithAnchorPrice(address asset, uint256 reportedPrice, uint256 anchorPrice) public view virtual returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | asset address |
| reportedPrice | uint256 | The price to be tested |
| anchorPrice | uint256 |  |

#### ❌ Errors
* Missing error thrown if asset config is not set
* Price error thrown if anchor price is not valid

- - -
