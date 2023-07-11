# ChainlinkOracle

This oracle fetches prices of assets from the Chainlink oracle.

# Solidity API

```solidity
struct TokenConfig {
  address asset;
  address feed;
  uint256 maxStalePeriod;
}
```

### vBnb

vBNB address

```solidity
address vBnb
```

---

### vai

VAI address

```solidity
address vai
```

---

### BNB\_ADDR

Set this as asset address for BNB. This is the underlying address for vBNB

```solidity
address BNB_ADDR
```

---

### prices

Manually set an override price, useful under extenuating conditions such as price feed failure

```solidity
mapping(address => uint256) prices
```

---

### tokenConfigs

Token config by assets

```solidity
mapping(address => struct ChainlinkOracle.TokenConfig) tokenConfigs
```

---

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(address vBnbAddress, address vaiAddress) public
```

#### Parameters

| Name        | Type    | Description             |
| ----------- | ------- | ----------------------- |
| vBnbAddress | address | The address of the vBNB |
| vaiAddress  | address | The address of the VAI  |

---

### setUnderlyingPrice

Set the forced prices of the underlying token of input vToken

```solidity
function setUnderlyingPrice(contract VBep20Interface vToken, uint256 underlyingPriceMantissa) external
```

#### Parameters

| Name                    | Type                     | Description          |
| ----------------------- | ------------------------ | -------------------- |
| vToken                  | contract VBep20Interface | vToken address       |
| underlyingPriceMantissa | uint256                  | price in 18 decimals |

#### 📅 Events

* Emits PricePosted event on succesfully setup of underlying price

#### ⛔️ Access Requirements

* Only Governance

#### ❌ Errors

* NotNullAddress thrown if address of vToken is null

---

### setDirectPrice

Manually set the price of a given asset

```solidity
function setDirectPrice(address asset, uint256 price) external
```

#### Parameters

| Name  | Type    | Description                     |
| ----- | ------- | ------------------------------- |
| asset | address | Asset address                   |
| price | uint256 | Underlying price in 18 decimals |

#### 📅 Events

* Emits PricePosted event on succesfully setup of underlying price

#### ⛔️ Access Requirements

* Only Governance

---

### setTokenConfigs

Add multiple token configs at the same time

```solidity
function setTokenConfigs(struct ChainlinkOracle.TokenConfig[] tokenConfigs_) external
```

#### Parameters

| Name           | Type                                 | Description  |
| -------------- | ------------------------------------ | ------------ |
| tokenConfigs\_ | struct ChainlinkOracle.TokenConfig\[] | config array |

#### ⛔️ Access Requirements

* Only Governance

#### ❌ Errors

* Zero length error thrown, if length of the array in parameter is 0

---

### initialize

Initializes the owner of the contract

```solidity
function initialize(address accessControlManager_) external
```

#### Parameters

| Name                   | Type    | Description                                    |
| ---------------------- | ------- | ---------------------------------------------- |
| accessControlManager\_ | address | Address of the access control manager contract |

---

### getUnderlyingPrice

Gets the Chainlink price for the underlying asset of a given vToken, revert when vToken is a null address

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

#### Parameters

| Name   | Type    | Description    |
| ------ | ------- | -------------- |
| vToken | address | vToken address |

#### Return Values

| Name | Type    | Description                   |
| ---- | ------- | ----------------------------- |
| \[0]  | uint256 | price Underlying price in USD |

---

### setTokenConfig

Add single token config. vToken & feed cannot be null addresses and maxStalePeriod must be positive

```solidity
function setTokenConfig(struct ChainlinkOracle.TokenConfig tokenConfig) public
```

#### Parameters

| Name        | Type                               | Description         |
| ----------- | ---------------------------------- | ------------------- |
| tokenConfig | struct ChainlinkOracle.TokenConfig | Token config struct |

#### 📅 Events

* Emits TokenConfigAdded event on succesfully setting of the token config

#### ⛔️ Access Requirements

* Only Governance

#### ❌ Errors

* NotNullAddress error is thrown if asset address is null
* NotNullAddress error is thrown if token feed address is null
* Range error is thrown if maxStale period of token is not greater than zero

---
