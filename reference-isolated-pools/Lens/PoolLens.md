# PoolLens

The `PoolLens` contract is designed to retrieve important information for each registered pool. A list of essential information
for all pools within the lending protocol can be acquired through the function `getAllPools()`. Additionally, the following records can be
looked up for specific pools and markets:

- the vToken balance of a given user;
- the pool data (oracle address, associated vToken, liquidation incentive, etc) of a pool via its associated comptroller address;
- the vToken address in a pool for a given asset;
- a list of all pools that support an asset;
- the underlying asset price of a vToken;
- the metadata (exchange/borrow/supply rate, total supply, collateral factor, etc) of any vToken.

# Solidity API

```solidity
struct PoolData {
  string name;
  address creator;
  address comptroller;
  uint256 blockPosted;
  uint256 timestampPosted;
  string category;
  string logoURL;
  string description;
  address priceOracle;
  uint256 closeFactor;
  uint256 liquidationIncentive;
  uint256 minLiquidatableCollateral;
  struct PoolLens.VTokenMetadata[] vTokens;
}
```

```solidity
struct VTokenMetadata {
  address vToken;
  uint256 exchangeRateCurrent;
  uint256 supplyRatePerBlock;
  uint256 borrowRatePerBlock;
  uint256 reserveFactorMantissa;
  uint256 supplyCaps;
  uint256 borrowCaps;
  uint256 totalBorrows;
  uint256 totalReserves;
  uint256 totalSupply;
  uint256 totalCash;
  bool isListed;
  uint256 collateralFactorMantissa;
  address underlyingAssetAddress;
  uint256 vTokenDecimals;
  uint256 underlyingDecimals;
}

```

```solidity
struct VTokenBalances {
  address vToken;
  uint256 balanceOf;
  uint256 borrowBalanceCurrent;
  uint256 balanceOfUnderlying;
  uint256 tokenBalance;
  uint256 tokenAllowance;
}

```

```solidity
struct VTokenUnderlyingPrice {
  address vToken;
  uint256 underlyingPrice;
}

```

```solidity
struct PendingReward {
  address vTokenAddress;
  uint256 amount;
}

```

```solidity
struct RewardSummary {
  address distributorAddress;
  address rewardTokenAddress;
  uint256 totalRewards;
  struct PoolLens.PendingReward[] pendingRewards;
}
```

```solidity
struct RewardTokenState {
  uint224 index;
  uint32 block;
}

```

```solidity
struct BadDebt {
  address vTokenAddress;
  uint256 badDebtUsd;
}

```

```solidity
struct BadDebtSummary {
  address comptroller;
  uint256 totalBadDebtUsd;
  struct PoolLens.BadDebt[] badDebts;
}
```

### vTokenBalancesAll

Queries the user's supply/borrow balances in vTokens

```solidity
function vTokenBalancesAll(contract VToken[] vTokens, address account) external returns (struct PoolLens.VTokenBalances[])
```

#### Parameters

| Name    | Type              | Description                  |
| ------- | ----------------- | ---------------------------- |
| vTokens | contract VToken[] | The list of vToken addresses |
| account | address           | The user Account             |

#### Return Values

| Name | Type                             | Description                                |
| ---- | -------------------------------- | ------------------------------------------ |
| [0]  | struct PoolLens.VTokenBalances[] | A list of structs containing balances data |

---

### getAllPools

Queries all pools with addtional details for each of them

```solidity
function getAllPools(address poolRegistryAddress) external view returns (struct PoolLens.PoolData[])
```

#### Parameters

| Name                | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| poolRegistryAddress | address | The address of the PoolRegistry contract |

#### Return Values

| Name | Type                       | Description                     |
| ---- | -------------------------- | ------------------------------- |
| [0]  | struct PoolLens.PoolData[] | Arrays of all Venus pools' data |

---

### getPoolByComptroller

Queries the details of a pool identified by Comptroller address

```solidity
function getPoolByComptroller(address poolRegistryAddress, address comptroller) external view returns (struct PoolLens.PoolData)
```

#### Parameters

| Name                | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| poolRegistryAddress | address | The address of the PoolRegistry contract |
| comptroller         | address | The Comptroller implementation address   |

#### Return Values

| Name | Type                     | Description                                           |
| ---- | ------------------------ | ----------------------------------------------------- |
| [0]  | struct PoolLens.PoolData | PoolData structure containing the details of the pool |

---

### getVTokenForAsset

Returns vToken holding the specified underlying asset in the specified pool

```solidity
function getVTokenForAsset(address poolRegistryAddress, address comptroller, address asset) external view returns (address)
```

#### Parameters

| Name                | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| poolRegistryAddress | address | The address of the PoolRegistry contract |
| comptroller         | address | The pool comptroller                     |
| asset               | address | The underlyingAsset of VToken            |

#### Return Values

| Name | Type    | Description           |
| ---- | ------- | --------------------- |
| [0]  | address | Address of the vToken |

---

### getPoolsSupportedByAsset

Returns all pools that support the specified underlying asset

```solidity
function getPoolsSupportedByAsset(address poolRegistryAddress, address asset) external view returns (address[])
```

#### Parameters

| Name                | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| poolRegistryAddress | address | The address of the PoolRegistry contract |
| asset               | address | The underlying asset of vToken           |

#### Return Values

| Name | Type      | Description                     |
| ---- | --------- | ------------------------------- |
| [0]  | address[] | A list of Comptroller contracts |

---

### vTokenUnderlyingPriceAll

Returns the price data for the underlying assets of the specified vTokens

```solidity
function vTokenUnderlyingPriceAll(contract VToken[] vTokens) external view returns (struct PoolLens.VTokenUnderlyingPrice[])
```

#### Parameters

| Name    | Type              | Description                  |
| ------- | ----------------- | ---------------------------- |
| vTokens | contract VToken[] | The list of vToken addresses |

#### Return Values

| Name | Type                                    | Description                                       |
| ---- | --------------------------------------- | ------------------------------------------------- |
| [0]  | struct PoolLens.VTokenUnderlyingPrice[] | An array containing the price data for each asset |

---

### getPendingRewards

Returns the pending rewards for a user for a given pool.

```solidity
function getPendingRewards(address account, address comptrollerAddress) external view returns (struct PoolLens.RewardSummary[])
```

#### Parameters

| Name               | Type    | Description       |
| ------------------ | ------- | ----------------- |
| account            | address | The user account. |
| comptrollerAddress | address | address           |

#### Return Values

| Name | Type                            | Description           |
| ---- | ------------------------------- | --------------------- |
| [0]  | struct PoolLens.RewardSummary[] | Pending rewards array |

---

### getPoolBadDebt

Returns a summary of a pool's bad debt broken down by market

```solidity
function getPoolBadDebt(address comptrollerAddress) external view returns (struct PoolLens.BadDebtSummary)
```

#### Parameters

| Name               | Type    | Description                |
| ------------------ | ------- | -------------------------- |
| comptrollerAddress | address | Address of the comptroller |

#### Return Values

| Name | Type                           | Description                                                                                                                  |
| ---- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [0]  | struct PoolLens.BadDebtSummary | badDebtSummary A struct with comptroller address, total bad debut denominated in usd, and a break down of bad debt by market |

---

### vTokenBalances

Queries the user's supply/borrow balances in the specified vToken

```solidity
function vTokenBalances(contract VToken vToken, address account) public returns (struct PoolLens.VTokenBalances)
```

#### Parameters

| Name    | Type            | Description      |
| ------- | --------------- | ---------------- |
| vToken  | contract VToken | vToken address   |
| account | address         | The user Account |

#### Return Values

| Name | Type                           | Description                           |
| ---- | ------------------------------ | ------------------------------------- |
| [0]  | struct PoolLens.VTokenBalances | A struct containing the balances data |

---

### getPoolDataFromVenusPool

Queries additional information for the pool

```solidity
function getPoolDataFromVenusPool(address poolRegistryAddress, struct PoolRegistryInterface.VenusPool venusPool) public view returns (struct PoolLens.PoolData)
```

#### Parameters

| Name                | Type                                   | Description                            |
| ------------------- | -------------------------------------- | -------------------------------------- |
| poolRegistryAddress | address                                | Address of the PoolRegistry            |
| venusPool           | struct PoolRegistryInterface.VenusPool | The VenusPool Object from PoolRegistry |

#### Return Values

| Name | Type                     | Description       |
| ---- | ------------------------ | ----------------- |
| [0]  | struct PoolLens.PoolData | Enriched PoolData |

---

### vTokenMetadata

Returns the metadata of VToken

```solidity
function vTokenMetadata(contract VToken vToken) public view returns (struct PoolLens.VTokenMetadata)
```

#### Parameters

| Name   | Type            | Description           |
| ------ | --------------- | --------------------- |
| vToken | contract VToken | The address of vToken |

#### Return Values

| Name | Type                           | Description           |
| ---- | ------------------------------ | --------------------- |
| [0]  | struct PoolLens.VTokenMetadata | VTokenMetadata struct |

---

### vTokenMetadataAll

Returns the metadata of all VTokens

```solidity
function vTokenMetadataAll(contract VToken[] vTokens) public view returns (struct PoolLens.VTokenMetadata[])
```

#### Parameters

| Name    | Type              | Description                  |
| ------- | ----------------- | ---------------------------- |
| vTokens | contract VToken[] | The list of vToken addresses |

#### Return Values

| Name | Type                             | Description                        |
| ---- | -------------------------------- | ---------------------------------- |
| [0]  | struct PoolLens.VTokenMetadata[] | An array of VTokenMetadata structs |

---

### vTokenUnderlyingPrice

Returns the price data for the underlying asset of the specified vToken

```solidity
function vTokenUnderlyingPrice(contract VToken vToken) public view returns (struct PoolLens.VTokenUnderlyingPrice)
```

#### Parameters

| Name   | Type            | Description    |
| ------ | --------------- | -------------- |
| vToken | contract VToken | vToken address |

#### Return Values

| Name | Type                                  | Description                   |
| ---- | ------------------------------------- | ----------------------------- |
| [0]  | struct PoolLens.VTokenUnderlyingPrice | The price data for each asset |

---
