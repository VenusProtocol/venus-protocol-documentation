# VenusLens

## Introduction

The read only functions on the VenusLens contract provide a view into:
    - metadata of vToken
    -  daily XVS rewards for an account
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

### vTokenMetadata

```solidity
function vTokenMetadata(VToken vToken) public returns (VTokenMetadata memory)
```

query the metadata of a vToken by its address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | address of vToken |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenMetadata | response struct with token Metadata |

#### Response Data-Structure:

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
function vTokenMetadataAll(VToken[] calldata vTokens) external returns (VTokenMetadata[] memory)
```

query the metadata of a list of vTokens identified by their address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken[] | address[] | array with addresses of vTokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenMetadata[] | Array of response struct with token Metadata |

#### Response Data-Structure:

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


### getDailyXVS

```solidity
function getDailyXVS(address payable account, address comptrollerAddress) external returns (uint) 
```

- query the daily-XVS for a userAccount

  - daily XVS per account = dailyXVS from supply market + dailyXVS from borrow market
  - dailyXVS from supply = dailySupplyXvs * supplyInUsd / marketTotal supply in USD
  - dailyXVS from borrow = dailyBorrowXvs * borrowsInUsd / marketTotal borrow in USD
  - dailySupplyXvs and dailyBorrowXvs = venusSpeedPerBlock * BlocksPerDay in BSC

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | address of user account |
| comptrollerAddress | address | address of user comptrollerProxy |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | daily XVS computed for a user |



### vTokenBalance

```solidity
function vTokenBalances(VToken vToken, address payable account) public returns (VTokenBalances memory)
```

query the balance of a vToken of a user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | address of vToken |
| account | address | address of user account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenBalances | response struct with vToken balance data of user |

#### Response Data-Structure:

```solidity
    struct VTokenBalances {
        address vToken;
        uint balanceOf;
        uint borrowBalanceCurrent;
        uint balanceOfUnderlying;
        uint tokenBalance;
        uint tokenAllowance;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | address of vToken |
| balanceOf | uint | vToken balance of account |
| borrowBalanceCurrent | uint | vToken borrow balance of account |
| balanceOfUnderlying | uint | vToken balance of underlying supplied by account |
| tokenBalance | uint | underlyingBalance of account |
| tokenAllowance | uint | token allowance for underlying of user-account |


### vTokenBalancesAll 

```solidity
function vTokenBalancesAll(VToken[] calldata vTokens, address payable account) external returns (VTokenBalances[] memory)
```

query the balance of a list of vTokens of a user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address[] | address of vToken |
| account | address | address of user account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenBalances[] | array of response struct with vToken balance data of user |


### underlyingPrice of vToken

```solidity
function vTokenUnderlyingPrice(VToken vToken) public view returns (VTokenUnderlyingPrice memory)
```

query the underlyingPrice of a vToken

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | address of vToken |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenUnderlyingPrice | response struct with underlyingPrice info of vToken |

#### Response Data-Structure:

```solidity
    struct VTokenUnderlyingPrice {
        address vToken;
        uint underlyingPrice;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | address of vToken |
| underlyingPrice | uint | price of undelrying for vToken |


### underlyingPrice of many VTokens

```solidity
function vTokenUnderlyingPriceAll(VToken[] calldata vTokens) external view returns (VTokenUnderlyingPrice[] memory)
```

query the underlyingPrice of a list of vTokens

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address[] | addresses oflist of vTokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VTokenUnderlyingPrice[] | array of response struct with underlyingPrice info of vTokens |


### account-limits of a userAccount

```solidity
function getAccountLimits(ComptrollerInterface comptroller, address account) public view returns (AccountLimits memory)
```

- query the account limit of a userAccount.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | address of comptroller |
| account | address | address of account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | AccountLimits | response struct with accountLimit info of account |

#### Response Data-Structure:

```solidity
    struct AccountLimits {
        VToken[] markets;
        uint liquidity;
        uint shortfall;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| markets | VToken[] | array of VTokens |
| liquidity | uint | hypothetical liquidity of account |
| shortfall | uint | total shortfall of account |

### get governance-receipts of a voter-account for a list of proposals

```solidity
    function getGovReceipts(GovernorAlpha governor, address voter, uint[] memory proposalIds) public view returns (GovReceipt[] memory)
```

- Query the voting information of voter-account for a list of governance proposals 
   - has the user voted
   - if yes, then is it a voted for or against
   - votingPower of voter captured while voting on proposal

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| governor | address | address of governance contract |
| voter | address | address of voter-account |
| proposalIds | uint[] | list of proposalIds |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | GovReceipt[] | array of response struct with votingInformation of account for each proposal |

#### Response Data-Structure:

```solidity
    struct GovReceipt {
        uint proposalId;
        bool hasVoted;
        bool support;
        uint96 votes;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalId | uint | proposalId |
| hasVoted | bool | boolean indicator set to true/false if user has voted on proposal |
| support | bool | boolean indicator set to true/false if user has voted in support of proposal |
| votes | uint96 | votingPower of voter-account during the vote capture on proposal |


### get governance-proposals for a list of proposals

```solidity
    function getGovProposals(GovernorAlpha governor, uint[] calldata proposalIds) external view returns (GovProposal[] memory)
```

- Query the details of a list of governance proposals 

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| governor | address | address of governance contract |
| proposalIds | uint[] | list of proposalIds |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | GovProposal[] | array of response struct with details of each proposal |

#### Response Data-Structure:

```solidity
    struct GovProposal {
        uint proposalId;
        address proposer;
        uint eta;
        address[] targets;
        uint[] values;
        string[] signatures;
        bytes[] calldatas;
        uint startBlock;
        uint endBlock;
        uint forVotes;
        uint againstVotes;
        bool canceled;
        bool executed;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalId | uint | proposalId |
| proposer | address | address of proposer |
| eta | uint | estimated time to live |
| targets | address[] | list of addresses of target. this can be contract addresses |
| values | uint[] | values to be passed on to targets |
| signatures | string[] | signatures  |
| calldatas | bytes[] | calldata to be passed on to target contracts |
| startBlock | uint | startBlock - blockNumber from which proposal will be active |
| endBlock | uint | endBlock - blockNumber at which proposal will end |
| forVotes | uint | number of votes voted-in support of proposal |
| againstVotes | uint | number of votes voted-against proposal |
| canceled | bool | indicator to be set to true when proposal is cancelled |
| executed | bool | indicator to be set to true when proposal is executed |


### get XVSBalance Metadata

```solidity
    function getXVSBalanceMetadata(XVS xvs, address account) external view returns (XVSBalanceMetadata memory)
```

- Query the XVSBalance info for a specfic user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | address | XVS token address |
| account | address | user account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | XVSBalanceMetadata | response struct with XVSBalance Info |

#### Response Data-Structure:

```solidity
    struct XVSBalanceMetadata {
        uint balance;
        uint votes;
        address delegate;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| balance | uint | XVS Balance of user account |
| votes | uint | votingPower for the userAccount |
| delegate | address | address to which XVS voting has been delegated |


### get XVSBalance MetadataExt

```solidity
    function getXVSBalanceMetadataExt(XVS xvs, ComptrollerInterface comptroller, address account) external returns (XVSBalanceMetadataExt memory)
```

- Query the XVSBalance extended/comprehensive meta-info for a specfic user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | address | XVS token address |
| comptroller | address | comptroller Proxy address |
| account | address | user account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | XVSBalanceMetadataExt | response struct with XVSBalance Metadata Info |

#### Response Data-Structure:

```solidity
    struct XVSBalanceMetadataExt {
        uint balance;
        uint votes;
        address delegate;
        uint allocated;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| balance | uint | XVS Balance of user account |
| votes | uint | votingPower for the userAccount |
| delegate | address | address to which XVS voting has been delegated |
| allocated | uint | allocated XVS Balance |

### get Venus Votes

```solidity
    function getVenusVotes(XVS xvs, address account, uint32[] calldata blockNumbers) external view returns (VenusVotes[] memory)
```

- Query the VotingPower for a specfic user account at a specific list of blockNumbers

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs | address | XVS token address |
| account | address | user account |
| blockNumbers | uint32[] | array of blockNumbers |


#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VenusVotes[] | array of response struct with VenusVotes Info at various blockNumbers |

#### Response Data-Structure:

```solidity
    struct VenusVotes {
        uint blockNumber;
        uint votes;
    }
```

#### Struct details

| Name | Type | Description |
| ---- | ---- | ----------- |
| blockNumber | uint | XVS Balance of user account |
| votes | uint | votingPower for the userAccount |


### pendingVenus info

```solidity
 function pendingVenus(address holder, ComptrollerInterface comptroller) external view returns (uint)
```

- calculate the total XVS tokens pending or accrued by a user account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | user account |
| comptroller | address | address of comptroller Proxy |


#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | total XVS accrued added to XVS Rewards of a user account |
