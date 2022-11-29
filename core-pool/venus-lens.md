# VenusLens

## Introduction

The read only functions on the VenusLens contract provide a view into:
    - metadata of vToken
    - daily XVS rewards for an account
    - account balance for a single vToken
    - account balances for all vTokens in an account
    - underlying price of a vToken
    - underlying prices for a set of vTokens
    - get liquidity and shortfall of an account
    - get user's vote history
    - get proposal details for a set of proposals
    - get account XVS balance, total votes, and delegated votes
    - get historical voting balance for a user
    - get pending XVS Rewards for an account

# Solidity API

### vTokenMetadata

```solidity
function vTokenMetadata(contract VToken vToken) public returns (struct VenusLens.VTokenMetadata)
```

Query the metadata of a vToken by its address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the vToken to fetch VTokenMetadata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenMetadata | VTokenMetadata struct with vToken supply and borrow information. |

```solidity
    struct VTokenMetadata {
        address vToken;
        uint exchangeRateCurrent;
        uint supplyRatePerBlock;
        uint borrowRatePerBlock;
        uint reserveFactorMantissa;
        uint totalBorrows;
        uint totalReserves;
        uint totalSupply;
        uint totalCash;
        bool isListed;
        uint collateralFactorMantissa;
        address underlyingAssetAddress;
        uint vTokenDecimals;
        uint underlyingDecimals;
        uint venusSupplySpeed;
        uint venusBorrowSpeed;
        uint dailySupplyXvs;
        uint dailyBorrowXvs;
    }
```

### vTokenMetadataAll

```solidity
function vTokenMetadataAll(contract VToken[] vTokens) external returns (struct VenusLens.VTokenMetadata[])
```

Get VTokenMetadata for an array of vToken addresses

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | Array of vToken addresses to fetch VTokenMetadata |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenMetadata[] | Array of structs with vToken supply and borrow information. |

### getDailyXVS

```solidity
function getDailyXVS(address payable account, address comptrollerAddress) external returns (uint256)
```

Get amount of XVS distributed daily to an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address payable | Address of account to fetch the daily XVS distribution |
| comptrollerAddress | address | Address of the comptroller proxy |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Amount of XVS distributed daily to an account |

### vTokenBalances

```solidity
function vTokenBalances(contract VToken vToken, address payable account) public returns (struct VenusLens.VTokenBalances)
```

Get the current vToken balance (outstanding borrows) for an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | Address of the token to check the balance of |
| account | address payable | Account address to fetch the balance of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenBalances | VTokenBalances with token balance information |

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

### vTokenBalancesAll

```solidity
function vTokenBalancesAll(contract VToken[] vTokens, address payable account) external returns (struct VenusLens.VTokenBalances[])
```

Get the current vToken balances (outstanding borrows) for all vTokens on an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | Addresses of the tokens to check the balance of |
| account | address payable | Account address to fetch the balance of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenBalances[] | VTokenBalances Array with token balance information |

### vTokenUnderlyingPrice

```solidity
function vTokenUnderlyingPrice(contract VToken vToken) public view returns (struct VenusLens.VTokenUnderlyingPrice)
```

Get the price for the underlying asset of a vToken

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | address of the vToken |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenUnderlyingPrice | response struct with underlyingPrice info of vToken |


```solidity
struct VTokenUnderlyingPrice {
  address vToken;
  uint256 underlyingPrice;
}
```

### vTokenUnderlyingPriceAll

```solidity
function vTokenUnderlyingPriceAll(contract VToken[] vTokens) external view returns (struct VenusLens.VTokenUnderlyingPrice[])
```

Query the underlyingPrice of an array of vTokens

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | Array of vToken addresses |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VTokenUnderlyingPrice[] | array of response structs with underlying price information of vTokens |

### getAccountLimits

```solidity
function getAccountLimits(contract ComptrollerInterface comptroller, address account) public view returns (struct VenusLens.AccountLimits)
```

Query the account liquidity and shortfall of an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | contract ComptrollerInterface | Address of comptroller proxy |
| account | address | Address of the account to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.AccountLimits | Struct with markets user has entered, liquidity, and shortfall of the account |

```solidity
struct AccountLimits {
  contract VToken[] markets;
  uint256 liquidity;
  uint256 shortfall;
}
```

### getGovReceipts

```solidity
function getGovReceipts(contract GovernorAlpha governor, address voter, uint256[] proposalIds) public view returns (struct VenusLens.GovReceipt[])
```

Query the voting information of an account for a list of governance proposals

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| governor | contract GovernorAlpha | Governor address |
| voter | address | Voter address |
| proposalIds | uint256[] | Array of proposal ids |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.GovReceipt[] | Array of governor receipts |

```solidity
struct GovReceipt {
  uint256 proposalId;
  bool hasVoted;
  bool support;
  uint96 votes;
}
```

### getGovProposals

```solidity
function getGovProposals(contract GovernorAlpha governor, uint256[] proposalIds) external view returns (struct VenusLens.GovProposal[])
```

Query the details of a list of governance proposals

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| governor | contract GovernorAlpha | Address of governor contract |
| proposalIds | uint256[] | Array of proposal Ids |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.GovProposal[] | GovProposal structs for provided proposal Ids |

```solidity
struct GovProposal {
  uint256 proposalId;
  address proposer;
  uint256 eta;
  address[] targets;
  uint256[] values;
  string[] signatures;
  bytes[] calldatas;
  uint256 startBlock;
  uint256 endBlock;
  uint256 forVotes;
  uint256 againstVotes;
  bool canceled;
  bool executed;
}
```

### getXVSBalanceMetadata

```solidity
function getXVSBalanceMetadata(contract XVS xvs, address account) external view returns (struct VenusLens.XVSBalanceMetadata)
```

Query the XVSBalance info of an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract XVS | XVS contract address |
| account | address | Account address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.XVSBalanceMetadata | Struct with XVS balance and voter details |

```solidity
struct XVSBalanceMetadata {
  uint256 balance;
  uint256 votes;
  address delegate;
}
```

### getXVSBalanceMetadataExt

```solidity
function getXVSBalanceMetadataExt(contract XVS xvs, contract ComptrollerInterface comptroller, address account) external returns (struct VenusLens.XVSBalanceMetadataExt)
```

Query the XVSBalance extended info of an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract XVS | XVS contract address |
| comptroller | contract ComptrollerInterface | Comptroller proxy contract address |
| account | address | Account address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.XVSBalanceMetadataExt | Struct with XVS balance and voter details and XVS allocation |

```solidity
struct XVSBalanceMetadataExt {
  uint256 balance;
  uint256 votes;
  address delegate;
  uint256 allocated;
}
```

### getVenusVotes

```solidity
function getVenusVotes(contract XVS xvs, address account, uint32[] blockNumbers) external view returns (struct VenusLens.VenusVotes[])
```

Query the voting power for an account at a specific list of block numbers

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | contract XVS | XVS contract address |
| account | address | Address of the account |
| blockNumbers | uint32[] | Array of blocks to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VenusLens.VenusVotes[] | Array of VenusVotes structs with block number and vote count |

```solidity
struct VenusVotes {
  uint256 blockNumber;
  uint256 votes;
}
```

### pendingVenus

```solidity
function pendingVenus(address holder, contract ComptrollerInterface comptroller) external view returns (uint256)
```

Calculate the total XVS tokens pending or accrued by a user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | Account to query pending XVS |
| comptroller | contract ComptrollerInterface | Address of the comptroller |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Total number of accrued XVS that can be claimed |
