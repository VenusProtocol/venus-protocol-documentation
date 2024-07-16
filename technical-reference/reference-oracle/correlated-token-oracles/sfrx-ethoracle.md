# SFrxETHOracle
This oracle fetches the price of sfrxETH

# Solidity API

### SFRXETH_FRAX_ORACLE

Address of SfrxEthFraxOracle

```solidity
contract ISfrxEthFraxOracle SFRXETH_FRAX_ORACLE
```

- - -

### SFRXETH

Address of sfrxETH

```solidity
address SFRXETH
```

- - -

### maxAllowedPriceDifference

Maximum allowed price difference

```solidity
uint256 maxAllowedPriceDifference
```

- - -

### constructor

Constructor for the implementation contract.

```solidity
constructor(address _sfrxEthFraxOracle, address _sfrxETH) public
```

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when `_sfrxEthFraxOracle` or `_sfrxETH` are the zero address

- - -

### initialize

Sets the contracts required to fetch prices

```solidity
function initialize(address _accessControlManager, uint256 _maxAllowedPriceDifference) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _accessControlManager | address | Address of the access control manager contract |
| _maxAllowedPriceDifference | uint256 | Maximum allowed price difference |

#### ❌ Errors
* ZeroValueNotAllowed is thrown if `_maxAllowedPriceDifference` is zero

- - -

### setMaxAllowedPriceDifference

Sets the maximum allowed price difference

```solidity
function setMaxAllowedPriceDifference(uint256 _maxAllowedPriceDifference) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _maxAllowedPriceDifference | uint256 | Maximum allowed price difference |

#### ❌ Errors
* ZeroValueNotAllowed is thrown if `_maxAllowedPriceDifference` is zero

- - -

### getPrice

Fetches the USD price of sfrxETH

```solidity
function getPrice(address asset) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of the sfrxETH token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | price The price scaled by 1e18 |

#### ❌ Errors
* InvalidTokenAddress is thrown when the `asset` is not the sfrxETH token (`SFRXETH`)
* BadPriceData is thrown if the `SFRXETH_FRAX_ORACLE` oracle informs it has bad data
* ZeroValueNotAllowed is thrown if the prices (low or high, in USD) are zero
* PriceDifferenceExceeded is thrown if priceHigh/priceLow is greater than `maxAllowedPriceDifference`

- - -

