# PrimeLeaderboard
PrimeLeaderboard manages Prime V2 eligibility with time-weighted scoring. It tracks per-deposit timestamps for LIFO withdrawals and computes each user's Effective Stake. It is called by the `XVSVault` via the existing `xvsUpdated()` callback. Governance reads `getEffectiveStakeBatch()` off-chain, ranks users, and either sets a mint threshold on PrimeV2 (for permissionless minting) or calls `PrimeV2.issue()` / `burn()` directly.

# Solidity API

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

PrimeLeaderboard initializer. Initializes the default multiplier tiers: 30 days → 1.3x, 60 days → 1.6x, 90 days → 2.0x (cap).

```solidity
function initialize(address accessControlManager_, uint256 loopsLimit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | Address of AccessControlManager |
| loopsLimit_ | uint256 | Maximum number of loops allowed in a single transaction |

- - -

### initializeStakers

Batch-seed existing stakers' deposit data during migration. Idempotent: skips users with `totalStaked[user] != 0` (already seeded). Caller must batch appropriately to avoid exceeding block gas limits.

```solidity
function initializeStakers(address[] users, uint256[] amounts, uint64[] timestamps) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses to initialize |
| amounts | uint256[] | Array of staked amounts (in XVS wei) |
| timestamps | uint64[] | Array of deposit timestamps |

#### 📅 Events
* Emits StakerInitialized for each user successfully seeded

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw StakersAlreadyInitialized if finalizeInitialization was already called
* Throw LengthMismatch if array lengths don't match
* Throw InvalidTimestamp if a seeded timestamp is zero or in the future

- - -

### finalizeInitialization

Finalize staker initialization, preventing further seeding. Must be called after all `initializeStakers` batches are complete.

```solidity
function finalizeInitialization() external
```

#### 📅 Events
* Emits StakersInitializationFinalized

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw StakersAlreadyInitialized if already finalized

- - -

### xvsUpdated

Called by the XVSVault (via `primeToken.xvsUpdated`) when a user's stake changes. Reads the user's current vault balance, diffs it against `totalStaked`, and records the appropriate deposit or LIFO withdrawal internally. Then forwards `accrueInterestAndUpdateScore(user)` to PrimeV2 if set.

```solidity
function xvsUpdated(address user) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | The user whose stake changed |

#### 📅 Events
* Emits DepositRecorded event on deposit
* Emits WithdrawalRecorded event on withdrawal
* Emits DepositsCompacted event if deposits are compacted

#### ⛔️ Access Requirements
* Only callable by XVSVault

#### ❌ Errors
* Throw OnlyXVSVaultAllowed if caller is not XVSVault
* Throw ZeroAddress if user address is zero

- - -

### getEffectiveStake

Get a user's current Effective Stake (time-weighted score)

```solidity
function getEffectiveStake(address user) public view returns (uint256 effectiveStake)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | The user's address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| effectiveStake | uint256 | The time-weighted score |

- - -

### getEffectiveStakeBatch

Batch view to get effective stakes for multiple users

```solidity
function getEffectiveStakeBatch(address[] users) external view returns (uint256[] scores)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| users | address[] | Array of user addresses |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| scores | uint256[] | Array of effective stake scores |

- - -

### getTotalStaked

Get a user's total staked amount

```solidity
function getTotalStaked(address user) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | The user's address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The total XVS staked |

- - -

### getDeposits

Get a user's deposit stack

```solidity
function getDeposits(address user) external view returns (struct IPrimeLeaderboard.Deposit[] deposits)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | The user's address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| deposits | struct IPrimeLeaderboard.Deposit[] | Array of deposits (index 0 = oldest) |

- - -

### getDepositCount

Get the number of deposit tranches for a user

```solidity
function getDepositCount(address user) external view returns (uint256 count)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | The user's address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | Number of deposit tranches |

- - -

### getMultiplier

Calculate the multiplier for a given holding duration

```solidity
function getMultiplier(uint256 holdingDuration) external view returns (uint256 multiplier)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holdingDuration | uint256 | Duration in seconds |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| multiplier | uint256 | The multiplier (scaled by 1e18) |

- - -

### getMultiplierTiers

Get the multiplier tier configuration

```solidity
function getMultiplierTiers() external view returns (uint256[] durations, uint256[] multipliers)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| durations | uint256[] | Array of duration thresholds |
| multipliers | uint256[] | Array of multiplier values |

- - -

### setMultiplierTiers

Set the multiplier tiers. Durations and multipliers must be strictly ascending, and each multiplier must be ≥ the base multiplier (1e18).

```solidity
function setMultiplierTiers(uint256[] durations, uint256[] multipliers) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| durations | uint256[] | Array of duration thresholds in seconds |
| multipliers | uint256[] | Array of multiplier values (scaled by 1e18) |

#### 📅 Events
* Emits MultiplierTiersUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw LengthMismatch if durations and multipliers arrays have different lengths
* Throw InvalidValue if durations array is empty
* Throw InvalidMultiplierTiers if tiers are not in ascending order or multipliers below base

- - -

### setPrimeV2

Set the PrimeV2 contract address

```solidity
function setPrimeV2(address primeV2_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| primeV2_ | address | Address of PrimeV2 contract |

#### 📅 Events
* Emits PrimeV2Set event

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw ZeroAddress if address is zero

- - -

### setMaxLoopsLimit

Set the limit for the loops that can iterate to avoid DOS

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| loopsLimit | uint256 | Limit for the max loops that can execute at a time |

#### 📅 Events
* Emits MaxLoopsLimitUpdated event

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

