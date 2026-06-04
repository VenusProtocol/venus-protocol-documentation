# PrimeV2StorageV1
Storage layout for the PrimeV2 contract with leaderboard-based Prime token distribution

# Solidity API

```solidity
struct Market {
  uint256 supplyMultiplier;
  uint256 borrowMultiplier;
  uint256 rewardIndex;
  uint256 sumOfMembersScore;
  bool exists;
}
```

```solidity
struct Interest {
  uint256 accrued;
  uint256 score;
  uint256 rewardIndex;
}
```

```solidity
struct PendingReward {
  address vToken;
  address rewardToken;
  uint256 amount;
}
```

### isPrimeHolder

Whether a user holds a Prime token

```solidity
mapping(address => bool) isPrimeHolder
```

- - -

### totalTokens

Total count of Prime tokens

```solidity
uint256 totalTokens
```

- - -

### tokenLimit

Maximum number of Prime tokens allowed

```solidity
uint256 tokenLimit
```

- - -

### markets

Mapping of vToken to its market configuration

```solidity
mapping(address => struct PrimeV2StorageV1.Market) markets
```

- - -

### interests

Mapping of vToken -> user -> interest info

```solidity
mapping(address => mapping(address => struct PrimeV2StorageV1.Interest)) interests
```

- - -

### vTokenForAsset

Mapping of underlying token to vToken address (used to check if an asset is part of Prime markets)

```solidity
mapping(address => address) vTokenForAsset
```

- - -

### alphaNumerator

numerator of alpha. Ex: if alpha is 0.5 then this will be 1

```solidity
uint128 alphaNumerator
```

- - -

### alphaDenominator

denominator of alpha. Ex: if alpha is 0.5 then this will be 2

```solidity
uint128 alphaDenominator
```

- - -

### primeLiquidityProvider

The address of the PrimeLiquidityProvider contract

```solidity
address primeLiquidityProvider
```

- - -

### oracle

The address of the ResilientOracle contract

```solidity
contract ResilientOracleInterface oracle
```

- - -

### corePoolComptroller

Address of the core pool comptroller contract

```solidity
address corePoolComptroller
```

- - -

### unreleasedPLPIncome

Unreleased income from the PLP per token that's already distributed to Prime holders

```solidity
mapping(address => uint256) unreleasedPLPIncome
```

- - -

### undistributedReward

Income accrued while no scored members existed in the market. Tracked per underlying so governance can reclaim the slice via `sweepUndistributed` without touching user-owed funds.

```solidity
mapping(address => uint256) undistributedReward
```

- - -

### isScoreUpdated

Mapping to check if an account's score was updated in a round

```solidity
mapping(uint256 => mapping(address => bool)) isScoreUpdated
```

- - -

### nextScoreUpdateRoundId

Current score update round ID

```solidity
uint256 nextScoreUpdateRoundId
```

- - -

### pendingScoreUpdates

Number of pending score updates in the current round

```solidity
uint256 pendingScoreUpdates
```

- - -

### primeLeaderboard

Address of the PrimeLeaderboard contract for permissionless eligibility checks

```solidity
address primeLeaderboard
```

- - -

### mintThreshold

Minimum Prime Score required for permissionless Prime minting

```solidity
uint256 mintThreshold
```

- - -

### mintDeadline

Unix timestamp after which permissionless minting is closed (0 = no deadline)

```solidity
uint256 mintDeadline
```

- - -
