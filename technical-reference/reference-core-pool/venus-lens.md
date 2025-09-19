# VenusLens

## Introduction

The read only functions on the VenusLens contract provide a view into: - metadata of vToken - daily XVS rewards for an account - account balance for a single vToken - account balances for all vTokens in an account - underlying price of a vToken - underlying prices for a set of vTokens - get liquidity and shortfall of an account - get user's vote history - get proposal details for a set of proposals - get account XVS balance, total votes, and delegated votes - get historical voting balance for a user - get pending XVS Rewards for an account

# Solidity API

### BLOCKS\_PER\_DAY

Blocks Per Day

```solidity
uint256 BLOCKS_PER_DAY
```

---

### VTOKEN\_ACTIONS

Total actions available on VToken

```solidity
uint256 VTOKEN_ACTIONS
```

---

```solidity
struct VenusMarketState {
  uint224 index;
  uint32 block;
}
```

```solidity
struct VTokenMetadata {
  address vToken;
  uint256 exchangeRateCurrent;
  uint256 supplyRatePerBlock;
  uint256 borrowRatePerBlock;
  uint256 reserveFactorMantissa;
  uint256 totalBorrows;
  uint256 totalReserves;
  uint256 totalSupply;
  uint256 totalCash;
  bool isListed;
  uint256 collateralFactorMantissa;
  address underlyingAssetAddress;
  uint256 vTokenDecimals;
  uint256 underlyingDecimals;
  uint256 venusSupplySpeed;
  uint256 venusBorrowSpeed;
  uint256 dailySupplyXvs;
  uint256 dailyBorrowXvs;
  uint256 pausedActions;
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
struct AccountLimits {
  contract VToken[] markets;
  uint256 liquidity;
  uint256 shortfall;
}
```

```solidity
struct XVSBalanceMetadata {
  uint256 balance;
  uint256 votes;
  address delegate;
}
```

```solidity
struct XVSBalanceMetadataExt {
  uint256 balance;
  uint256 votes;
  address delegate;
  uint256 allocated;
}
```

```solidity
struct VenusVotes {
  uint256 blockNumber;
  uint256 votes;
}
```

```solidity
struct ClaimVenusLocalVariables {
  uint256 totalRewards;
  uint224 borrowIndex;
  uint32 borrowBlock;
  uint224 supplyIndex;
  uint32 supplyBlock;
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
  struct VenusLens.PendingReward[] pendingRewards;
}
```

### MarketData

Holds full market information for a single vToken within a specific pool (excluding the Core Pool)

---

```solidity
struct MarketData {
  uint96 poolId;
  string poolLabel;
  address vToken;
  bool isListed;
  uint256 collateralFactor;
  bool isVenus;
  uint256 liquidationThreshold;
  uint256 liquidationIncentive;
  bool isBorrowAllowed;
}
```

### PoolWithMarkets

Struct representing a pool (excluding the Core Pool) and its associated markets

---

```solidity
struct PoolWithMarkets {
  uint96 poolId;
  string label;
  struct VenusLens.MarketData[] markets;
}
```

### vTokenMetadata

Query the metadata of a vToken by its address

```solidity
function vTokenMetadata(contract VToken vToken) public returns (struct VenusLens.VTokenMetadata)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the vToken to fetch VTokenMetadata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenMetadata | VTokenMetadata struct with vToken supply and borrow information. |

---

### vTokenMetadataAll

Get VTokenMetadata for an array of vToken addresses

```solidity
function vTokenMetadataAll(contract VToken[] vTokens) external returns (struct VenusLens.VTokenMetadata[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | Array of vToken addresses to fetch VTokenMetadata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenMetadata\[] | Array of structs with vToken supply and borrow information. |

---

### getDailyXVS

Get amount of XVS distributed daily to an account

```solidity
function getDailyXVS(address payable account, address comptrollerAddress) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address payable | Address of account to fetch the daily XVS distribution |
| comptrollerAddress | address | Address of the comptroller proxy |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Amount of XVS distributed daily to an account |

---

### vTokenBalances

Get the current vToken balance (outstanding borrows) for an account

```solidity
function vTokenBalances(contract VToken vToken, address payable account) public returns (struct VenusLens.VTokenBalances)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | Address of the token to check the balance of |
| account | address payable | Account address to fetch the balance of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenBalances | VTokenBalances with token balance information |

---

### vTokenBalancesAll

Get the current vToken balances (outstanding borrows) for all vTokens on an account

```solidity
function vTokenBalancesAll(contract VToken[] vTokens, address payable account) external returns (struct VenusLens.VTokenBalances[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | Addresses of the tokens to check the balance of |
| account | address payable | Account address to fetch the balance of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenBalances\[] | VTokenBalances Array with token balance information |

---

### vTokenUnderlyingPrice

Get the price for the underlying asset of a vToken

```solidity
function vTokenUnderlyingPrice(contract VToken vToken) public view returns (struct VenusLens.VTokenUnderlyingPrice)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | address of the vToken |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenUnderlyingPrice | response struct with underlyingPrice info of vToken |

---

### vTokenUnderlyingPriceAll

Query the underlyingPrice of an array of vTokens

```solidity
function vTokenUnderlyingPriceAll(contract VToken[] vTokens) external view returns (struct VenusLens.VTokenUnderlyingPrice[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | Array of vToken addresses |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VTokenUnderlyingPrice\[] | array of response structs with underlying price information of vTokens |

---

### getAccountLimits

Query the account liquidity and shortfall of an account

```solidity
function getAccountLimits(contract ComptrollerInterface comptroller, address account) public view returns (struct VenusLens.AccountLimits)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | contract ComptrollerInterface | Address of comptroller proxy |
| account | address | Address of the account to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.AccountLimits | Struct with markets user has entered, liquidity, and shortfall of the account |

---

### getXVSBalanceMetadata

Query the XVSBalance info of an account

```solidity
function getXVSBalanceMetadata(contract IXVS xvs, address account) external view returns (struct VenusLens.XVSBalanceMetadata)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract IXVS | XVS contract address |
| account | address | Account address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.XVSBalanceMetadata | Struct with XVS balance and voter details |

---

### getXVSBalanceMetadataExt

Query the XVSBalance extended info of an account

```solidity
function getXVSBalanceMetadataExt(contract IXVS xvs, contract ComptrollerInterface comptroller, address account) external returns (struct VenusLens.XVSBalanceMetadataExt)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract IXVS | XVS contract address |
| comptroller | contract ComptrollerInterface | Comptroller proxy contract address |
| account | address | Account address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.XVSBalanceMetadataExt | Struct with XVS balance and voter details and XVS allocation |

---

### getVenusVotes

Query the voting power for an account at a specific list of block numbers

```solidity
function getVenusVotes(contract IXVS xvs, address account, uint32[] blockNumbers) external view returns (struct VenusLens.VenusVotes[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract IXVS | XVS contract address |
| account | address | Address of the account |
| blockNumbers | uint32\[] | Array of blocks to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.VenusVotes\[] | Array of VenusVotes structs with block number and vote count |

---

### pendingRewards

Calculate the total XVS tokens pending and accrued by a user account

```solidity
function pendingRewards(address holder, contract ComptrollerInterface comptroller) external view returns (struct VenusLens.RewardSummary)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | Account to query pending XVS |
| comptroller | contract ComptrollerInterface | Address of the comptroller |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | struct VenusLens.RewardSummary | Reward object contraining the totalRewards and pending rewards for each market |

---

### getAllPoolsData

Returns all pools (excluding the Core Pool) along with their associated market data

```solidity
function getAllPoolsData(contract ComptrollerInterface comptroller) external view returns (struct VenusLens.PoolWithMarkets[] poolsData)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | contract ComptrollerInterface | The Comptroller contract to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolsData | struct VenusLens.PoolWithMarkets\[] | An array of PoolWithMarkets structs, each containing pool info and its markets |

---

### getMarketsDataByPool

Retrieves full market data for all vTokens in a specific pool (excluding the Core Pool)

```solidity
function getMarketsDataByPool(uint96 poolId, contract ComptrollerInterface comptroller) public view returns (struct VenusLens.MarketData[] result)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The pool ID to fetch data for |
| comptroller | contract ComptrollerInterface | The address of the Comptroller contract |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| result | struct VenusLens.MarketData\[] | An array of MarketData structs containing detailed market info for the given pool |

#### ❌ Errors

* PoolDoesNotExist Reverts if the given pool ID does not exist
* InvalidOperationForCorePool Reverts if called on the Core Pool (`poolId = 0`)

---
