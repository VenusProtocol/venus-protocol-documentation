# BinanceOracle

This oracle fetches price of assets from Binance.

# Solidity API

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

### maxStalePeriod

Max stale period configuration for assets

```solidity
mapping(string => uint256) maxStalePeriod
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

### setMaxStalePeriod

Used to set the max stale period of an asset

```solidity
function setMaxStalePeriod(string symbol, uint256 _maxStalePeriod) external
```

#### Parameters

| Name             | Type    | Description             |
| ---------------- | ------- | ----------------------- |
| symbol           | string  | The symbol of the asset |
| \_maxStalePeriod | uint256 | The max stake period    |

---

### initialize

Sets the contracts required to fetch prices

```solidity
function initialize(address _sidRegistryAddress, address _accessControlManager) external
```

#### Parameters

| Name                   | Type    | Description                                    |
| ---------------------- | ------- | ---------------------------------------------- |
| \_sidRegistryAddress   | address | Address of SID registry                        |
| \_accessControlManager | address | Address of the access control manager contract |

---

### getUnderlyingPrice

Gets the price of a vToken from the binance oracle

```solidity
function getUnderlyingPrice(address vToken) external view returns (uint256)
```

#### Parameters

| Name   | Type    | Description           |
| ------ | ------- | --------------------- |
| vToken | address | Address of the vToken |

#### Return Values

| Name | Type    | Description  |
| ---- | ------- | ------------ |
| \[0]  | uint256 | Price in USD |

---

### getFeedRegistryAddress

Uses Space ID to fetch the feed registry address

```solidity
function getFeedRegistryAddress() public view returns (address)
```

#### Return Values

| Name | Type    | Description                                                  |
| ---- | ------- | ------------------------------------------------------------ |
| \[0]  | address | feedRegistryAddress Address of binance oracle feed registry. |

---
