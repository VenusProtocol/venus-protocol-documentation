# Prime
Prime Token is used to provide extra rewards to the users who have staked a minimum of `MINIMUM_STAKED_XVS` XVS in the XVSVault for `STAKING_PERIOD` days

# Solidity API

### BLOCKS_PER_YEAR

total blocks per year

```solidity
uint256 BLOCKS_PER_YEAR
```

- - -

### WBNB

address of WBNB contract

```solidity
address WBNB
```

- - -

### VBNB

address of VBNB contract

```solidity
address VBNB
```

- - -

### MINIMUM_STAKED_XVS

minimum amount of XVS user needs to stake to become a prime member

```solidity
uint256 MINIMUM_STAKED_XVS
```

- - -

### MAXIMUM_XVS_CAP

maximum XVS taken in account when calculating user score

```solidity
uint256 MAXIMUM_XVS_CAP
```

- - -

### STAKING_PERIOD

number of days user need to stake to claim prime token

```solidity
uint256 STAKING_PERIOD
```

- - -

### initialize

Prime initializer

```solidity
function initialize(address xvsVault_, address xvsVaultRewardToken_, uint256 xvsVaultPoolId_, uint128 alphaNumerator_, uint128 alphaDenominator_, address accessControlManager_, address primeLiquidityProvider_, address comptroller_, address oracle_, uint256 loopsLimit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| xvsVault_ | address | Address of XVSVault |
| xvsVaultRewardToken_ | address | Address of XVSVault reward token |
| xvsVaultPoolId_ | uint256 | Pool id of XVSVault |
| alphaNumerator_ | uint128 | numerator of alpha. If alpha is 0.5 then numerator is 1.               alphaDenominator_ must be greater than alphaNumerator_, alphaDenominator_ cannot be zero and alphaNumerator_ cannot be zero |
| alphaDenominator_ | uint128 | denominator of alpha. If alpha is 0.5 then denominator is 2.               alpha is alphaNumerator_/alphaDenominator_. So, 0 < alpha < 1 |
| accessControlManager_ | address | Address of AccessControlManager |
| primeLiquidityProvider_ | address | Address of PrimeLiquidityProvider |
| comptroller_ | address | Address of Comptroller |
| oracle_ | address | Address of Oracle |
| loopsLimit_ | uint256 | Maximum number of loops allowed in a single transaction |

#### ❌ Errors
* Throw InvalidAddress if any of the address is invalid

- - -

### getPendingRewards

Returns boosted pending interest accrued for a user for all markets

```solidity
function getPendingRewards(address user) external returns (struct PrimeStorageV1.PendingReward[] pendingRewards)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the account for which to get the accrued interests |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| pendingRewards | struct PrimeStorageV1.PendingReward[] | the number of underlying tokens accrued by the user for all markets |

- - -

### updateScores

Update total score of multiple users and market

```solidity
function updateScores(address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | accounts for which we need to update score |

#### 📅 Events
* Emits UserScoreUpdated event

#### ❌ Errors
* Throw NoScoreUpdatesRequired if no score updates are required
* Throw UserHasNoPrimeToken if user has no prime token

- - -

### updateAlpha

Update value of alpha

```solidity
function updateAlpha(uint128 _alphaNumerator, uint128 _alphaDenominator) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _alphaNumerator | uint128 | numerator of alpha. If alpha is 0.5 then numerator is 1 |
| _alphaDenominator | uint128 | denominator of alpha. If alpha is 0.5 then denominator is 2 |

#### 📅 Events
* Emits AlphaUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### updateMultipliers

Update multipliers for a market

```solidity
function updateMultipliers(address market, uint256 supplyMultiplier, uint256 borrowMultiplier) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | address of the market vToken |
| supplyMultiplier | uint256 | new supply multiplier for the market, scaled by 1e18 |
| borrowMultiplier | uint256 | new borrow multiplier for the market, scaled by 1e18 |

#### 📅 Events
* Emits MultiplierUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketNotSupported if market is not supported

- - -

### setStakedAt

Update staked at timestamp for multiple users

```solidity
function setStakedAt(address[] users, uint256[] timestamps) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | accounts for which we need to update staked at timestamp |
| timestamps | uint256[] | new staked at timestamp for the users |

#### 📅 Events
* Emits StakedAtUpdated event for each user

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidLength if users and timestamps length are not equal

- - -

### addMarket

Add a market to prime program

```solidity
function addMarket(address market, uint256 supplyMultiplier, uint256 borrowMultiplier) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | address of the market vToken |
| supplyMultiplier | uint256 | the multiplier for supply cap. It should be converted to 1e18 |
| borrowMultiplier | uint256 | the multiplier for borrow cap. It should be converted to 1e18 |

#### 📅 Events
* Emits MarketAdded event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketAlreadyExists if market already exists
* Throw InvalidVToken if market is not valid

- - -

### setLimit

Set limits for total tokens that can be minted

```solidity
function setLimit(uint256 _irrevocableLimit, uint256 _revocableLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _irrevocableLimit | uint256 | total number of irrevocable tokens that can be minted |
| _revocableLimit | uint256 | total number of revocable tokens that can be minted |

#### 📅 Events
* Emits MintLimitsUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidLimit if any of the limit is less than total tokens minted

- - -

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| loopsLimit | uint256 | Number of loops limit |

#### 📅 Events
* Emits MaxLoopsLimitUpdated event on success

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### issue

Directly issue prime tokens to users

```solidity
function issue(bool isIrrevocable, address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| isIrrevocable | bool | are the tokens being issued |
| users | address[] | list of address to issue tokens to |

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### xvsUpdated

Executed by XVSVault whenever user's XVSVault balance changes

```solidity
function xvsUpdated(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the account address whose balance was updated |

- - -

### accrueInterestAndUpdateScore

accrues interes and updates score for an user for a specific market

```solidity
function accrueInterestAndUpdateScore(address user, address market) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the account address for which to accrue interest and update score |
| market | address | the market for which to accrue interest and update score |

- - -

### claim

For claiming prime token when staking period is completed

```solidity
function claim() external
```

- - -

### burn

For burning any prime token

```solidity
function burn(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the account address for which the prime token will be burned |

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### togglePause

To pause or unpause claiming of interest

```solidity
function togglePause() external
```

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### claimInterest

For user to claim boosted yield

```solidity
function claimInterest(address vToken) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | the market for which claim the accrued interest |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amount the amount of tokens transferred to the msg.sender |

- - -

### claimInterest

For user to claim boosted yield

```solidity
function claimInterest(address vToken, address user) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | the market for which claim the accrued interest |
| user | address | the user for which to claim the accrued interest |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amount the amount of tokens transferred to the user |

- - -

### getAllMarkets

Retrieves an array of all available markets

```solidity
function getAllMarkets() external view returns (address[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | an array of addresses representing all available markets |

- - -

### claimTimeRemaining

fetch the numbers of seconds remaining for staking period to complete

```solidity
function claimTimeRemaining(address user) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the account address for which we are checking the remaining time |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | timeRemaining the number of seconds the user needs to wait to claim prime token |

- - -

### calculateAPR

Returns supply and borrow APR for user for a given market

```solidity
function calculateAPR(address market, address user) external view returns (uint256 supplyAPR, uint256 borrowAPR)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | the market for which to fetch the APR |
| user | address | the account for which to get the APR |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| supplyAPR | uint256 | supply APR of the user in BPS |
| borrowAPR | uint256 | borrow APR of the user in BPS |

- - -

### estimateAPR

Returns supply and borrow APR for estimated supply, borrow and XVS staked

```solidity
function estimateAPR(address market, address user, uint256 borrow, uint256 supply, uint256 xvsStaked) external view returns (uint256 supplyAPR, uint256 borrowAPR)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | the market for which to fetch the APR |
| user | address | the account for which to get the APR |
| borrow | uint256 | hypothetical borrow amount |
| supply | uint256 | hypothetical supply amount |
| xvsStaked | uint256 | hypothetical staked XVS amount |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| supplyAPR | uint256 | supply APR of the user in BPS |
| borrowAPR | uint256 | borrow APR of the user in BPS |

- - -

### accrueInterest

Distributes income from market since last distribution

```solidity
function accrueInterest(address vToken) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | the market for which to distribute the income |

#### ❌ Errors
* Throw MarketNotSupported if market is not supported

- - -

### getInterestAccrued

Returns boosted interest accrued for a user

```solidity
function getInterestAccrued(address vToken, address user) public returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | the market for which to fetch the accrued interest |
| user | address | the account for which to get the accrued interest |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | interestAccrued the number of underlying tokens accrued by the user since the last accrual |

- - -

