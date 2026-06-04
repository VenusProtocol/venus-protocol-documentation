# PrimeV2
PrimeV2 is the Prime token contract with leaderboard-based distribution. Prime status is decided by the `PrimeLeaderboard` contract based on time-weighted XVS staking, and boosted rewards are distributed to Prime holders across supported markets.

# Solidity API

### WRAPPED_NATIVE_TOKEN

Address of wrapped native token

```solidity
address WRAPPED_NATIVE_TOKEN
```

- - -

### NATIVE_MARKET

Address of native market vToken

```solidity
address NATIVE_MARKET
```

- - -

### xvsVault

Address of XVSVault contract

```solidity
address xvsVault
```

- - -

### xvsVaultRewardToken

Reward token address in XVSVault

```solidity
address xvsVaultRewardToken
```

- - -

### xvsVaultPoolId

Pool ID in XVSVault

```solidity
uint256 xvsVaultPoolId
```

- - -

### initialize

PrimeV2 initializer

```solidity
function initialize(uint128 alphaNumerator_, uint128 alphaDenominator_, address accessControlManager_, address primeLiquidityProvider_, address corePoolComptroller_, address oracle_, uint256 loopsLimit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| alphaNumerator_ | uint128 | numerator of alpha. If alpha is 0.5 then numerator is 1 |
| alphaDenominator_ | uint128 | denominator of alpha. If alpha is 0.5 then denominator is 2 |
| accessControlManager_ | address | Address of AccessControlManager |
| primeLiquidityProvider_ | address | Address of PrimeLiquidityProvider |
| corePoolComptroller_ | address | Address of core pool comptroller |
| oracle_ | address | Address of Oracle |
| loopsLimit_ | uint256 | Maximum number of loops allowed in a single transaction |

#### ❌ Errors
* Throw InvalidAddress if any of the address is zero
* Throw InvalidAlphaArguments if alpha arguments are invalid

- - -

### claimPrime

Mint a Prime token for a user in a permissionless way. Checks the user's Prime Score from `PrimeLeaderboard` against `mintThreshold`. Anyone can call this on behalf of an eligible user; no ACM required.

```solidity
function claimPrime(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address to mint for |

#### 📅 Events
* Emits Mint event on new token issuance

#### ❌ Errors
* Throw ScoreUpdateInProgress if a score update round is active
* Throw UserAlreadyHasPrimeToken if user already has a token
* Throw LeaderboardNotSet if primeLeaderboard address is not configured
* Throw MintThresholdNotSet if mintThreshold is zero
* Throw EligibilityBelowThreshold if user's Prime Score < mintThreshold
* Throw InvalidLimit if mint limit would be exceeded
* Throw MintWindowClosed if the minting deadline has passed

- - -

### claimPrimeBatch

Mint Prime tokens for multiple users in a permissionless way. Non-holders below `mintThreshold` are skipped with a `SkippedIneligibleUser` event (not reverted). Existing Prime holders are silently skipped. Anyone can call this; no ACM required.

```solidity
function claimPrimeBatch(address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses to mint for |

#### 📅 Events
* Emits Mint event for each new token issuance
* Emits SkippedIneligibleUser for each non-holder below threshold

#### ❌ Errors
* Throw ScoreUpdateInProgress if a score update round is active
* Throw LeaderboardNotSet if primeLeaderboard address is not configured
* Throw MintThresholdNotSet if mintThreshold is zero
* Throw MintWindowClosed if the minting deadline has passed
* Throw InvalidLimit if mint limit would be exceeded

- - -

### issue

Issue a Prime token to a single user (admin function)

```solidity
function issue(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### 📅 Events
* Emits Mint event on new token issuance

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidAddress if user is zero address
* Throw InvalidLimit if mint limit would be exceeded
* Throw UserAlreadyHasPrimeToken if user already has a token
* Throw ScoreUpdateInProgress if a score update round is active

- - -

### issueBatch

Issue Prime tokens to multiple users (admin function)

```solidity
function issueBatch(address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses |

#### 📅 Events
* Emits Mint event on new token issuance

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidAddress if any user in the batch is zero address
* Throw InvalidLimit if mint limit would be exceeded
* Throw ScoreUpdateInProgress if a score update round is active

- - -

### burn

Burn a user's Prime token (admin function)

```solidity
function burn(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### 📅 Events
* Emits Burn event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw UserHasNoPrimeToken if user has no prime token
* Throw ScoreUpdateInProgress if a score update round is active

- - -

### burnBatch

Burn Prime tokens for multiple users (admin function)

```solidity
function burnBatch(address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses |

#### 📅 Events
* Emits Burn event for each user

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw ScoreUpdateInProgress if a score update round is active

- - -

### isUserPrimeHolder

Check if a user has a Prime token

```solidity
function isUserPrimeHolder(address user) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | whether the user has a Prime token |

- - -

### claimInterest

Claim accrued interest for a market (to msg.sender)

```solidity
function claimInterest(address vToken) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Market address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amount claimed |

#### 📅 Events
* Emits InterestClaimed event

#### ❌ Errors
* Throw MarketNotSupported if market is not supported

- - -

### claimInterest

Claim accrued interest for a market to a specific address. Permissionless: anyone can trigger a claim on behalf of a user. Tokens are always sent to the user address, never to msg.sender.

```solidity
function claimInterest(address vToken, address user) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Market address |
| user | address | Recipient address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amount claimed |

#### 📅 Events
* Emits InterestClaimed event

#### ❌ Errors
* Throw MarketNotSupported if market is not supported

- - -

### accrueInterest

Accrue interest for a market. Intentionally not gated by the pause to ensure fair reward distribution during pauses.

```solidity
function accrueInterest(address vToken) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Market address |

#### ❌ Errors
* Throw MarketNotSupported if market is not supported

- - -

### accrueInterestAndUpdateScore

Accrue interest and update score for a user in a specific market. Called by the Comptroller hooks.

```solidity
function accrueInterestAndUpdateScore(address user, address market) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |
| market | address | Market address |

- - -

### accrueInterestAndUpdateScore

Accrue interest and update score for a user across all markets. Called by `PrimeLeaderboard` when a user's XVS stake changes, so rewards are accrued at the old score before the score is recalculated.

```solidity
function accrueInterestAndUpdateScore(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### ❌ Errors
* Throw OnlyPrimeLeaderboard if caller is not the PrimeLeaderboard contract

- - -

### getPendingRewards

Get pending rewards for a user (accrues first)

```solidity
function getPendingRewards(address user) external returns (struct PrimeV2StorageV1.PendingReward[] pendingRewards)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| pendingRewards | struct PrimeV2StorageV1.PendingReward[] | Array of pending rewards per market |

- - -

### getPendingRewardsStatic

Get pending rewards for a user (view-only, does not accrue). Returns rewards based on the last accrued state without triggering new accrual.

```solidity
function getPendingRewardsStatic(address user) external view returns (struct PrimeV2StorageV1.PendingReward[] pendingRewards)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| pendingRewards | struct PrimeV2StorageV1.PendingReward[] | Array of pending rewards per market |

- - -

### updateScores

Update scores for a batch of users. Intentionally not gated by the pause — the keeper must complete rounds even during pauses.

```solidity
function updateScores(address[] users) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses |

#### 📅 Events
* Emits UserScoreUpdated event

#### ❌ Errors
* Throw NoScoreUpdatesRequired if no score updates are required

- - -

### getAllMarkets

Get all Prime markets

```solidity
function getAllMarkets() external view returns (address[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | Array of market addresses |

- - -

### xvsBalanceOfUser

Get a user's XVS balance from the vault (net of pending withdrawals)

```solidity
function xvsBalanceOfUser(address user) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | User's XVS balance |

- - -

### addMarket

Add a market to Prime

```solidity
function addMarket(address market, uint256 supplyMultiplier, uint256 borrowMultiplier) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | Market address |
| supplyMultiplier | uint256 | Supply multiplier, scaled by 1e18 |
| borrowMultiplier | uint256 | Borrow multiplier, scaled by 1e18 |

#### 📅 Events
* Emits MarketAdded event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketAlreadyExists if market already exists
* Throw InvalidMultipliers if both multipliers are zero
* Throw InvalidVToken if market is not listed
* Throw AssetAlreadyExists if asset already has a market
* Throw MaxLoopsLimitExceeded if listing this market would exceed loopsLimit
* Throw UnsupportedUnderlyingDecimals if underlying token has decimals > 18

- - -

### removeMarket

Remove a market from the Prime program

```solidity
function removeMarket(address market) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | Market vToken address to remove |

#### 📅 Events
* Emits MarketRemoved event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketNotSupported if market doesn't exist
* Throw MarketHasActiveMembers if market still has members with scores

- - -

### setLimit

Update mint limit (maximum Prime tokens)

```solidity
function setLimit(uint256 tokenLimit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenLimit_ | uint256 | New token limit |

#### 📅 Events
* Emits MintLimitUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidLimit if limit is less than current count

- - -

### updateAlpha

Update alpha parameter

```solidity
function updateAlpha(uint128 alphaNumerator_, uint128 alphaDenominator_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| alphaNumerator_ | uint128 | New alpha numerator |
| alphaDenominator_ | uint128 | New alpha denominator |

#### 📅 Events
* Emits AlphaUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidAlphaArguments if alpha arguments are invalid

- - -

### updateMultipliers

Update market multipliers

```solidity
function updateMultipliers(address market, uint256 supplyMultiplier, uint256 borrowMultiplier) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | Market address |
| supplyMultiplier | uint256 | New supply multiplier |
| borrowMultiplier | uint256 | New borrow multiplier |

#### 📅 Events
* Emits MultiplierUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketNotSupported if market is not supported
* Throw InvalidMultipliers if both multipliers are zero

- - -

### pause

Pause the contract

```solidity
function pause() external
```

#### 📅 Events
* Emits Paused event

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### unpause

Unpause the contract

```solidity
function unpause() external
```

#### 📅 Events
* Emits Unpaused event

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### setMaxLoopsLimit

Set the max loops limit

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| loopsLimit | uint256 | New loops limit |

#### 📅 Events
* Emits MaxLoopsLimitUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### setPrimeLeaderboard

Set the `PrimeLeaderboard` contract address used for permissionless mint eligibility

```solidity
function setPrimeLeaderboard(address primeLeaderboard_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| primeLeaderboard_ | address | Address of PrimeLeaderboard contract |

#### 📅 Events
* Emits PrimeLeaderboardSet event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidAddress if address is zero

- - -

### setMintThreshold

Set the minimum Prime Score threshold and minting deadline for permissionless Prime minting. Each epoch is one calendar month; governance typically calls this at end-of-epoch with the #500 user's Prime Score as the threshold. Pass `mintThreshold_ = 0` to disable the permissionless minting window immediately. Pass `mintDeadline_ = 0` for no expiry; otherwise the window auto-closes once `block.timestamp` exceeds it.

```solidity
function setMintThreshold(uint256 mintThreshold_, uint256 mintDeadline_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| mintThreshold_ | uint256 | New mint threshold (set to 0 to close the window) |
| mintDeadline_ | uint256 | Unix timestamp after which minting is closed (0 = no deadline) |

#### 📅 Events
* Emits MintThresholdUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidDeadline if mintDeadline_ is non-zero and not strictly in the future

- - -

### sweepUndistributed

Reclaim PLP income that accrued for a market while no scored members existed in it. Flushes any pending PLP delta via `accrueInterest` first, then transfers the recorded slice to the recipient.

```solidity
function sweepUndistributed(address vToken, address to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Market address whose underlying slice should be swept |
| to | address | Recipient of the swept tokens |

#### 📅 Events
* Emits UndistributedSwept on a non-zero transfer

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw MarketNotSupported if vToken is not a Prime market
* Throw InvalidAddress if to is the zero address

- - -
