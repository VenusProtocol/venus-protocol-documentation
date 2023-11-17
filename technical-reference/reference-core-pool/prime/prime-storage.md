# PrimeStorageV1
Storage for Prime Token

# Solidity API

```solidity
struct Token {
  bool exists;
  bool isIrrevocable;
}
```

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

### tokens

Mapping to get prime token's metadata

```solidity
mapping(address => struct PrimeStorageV1.Token) tokens
```

- - -

### totalIrrevocable

Tracks total irrevocable tokens minted

```solidity
uint256 totalIrrevocable
```

- - -

### totalRevocable

Tracks total revocable tokens minted

```solidity
uint256 totalRevocable
```

- - -

### revocableLimit

Indicates maximum revocable tokens that can be minted

```solidity
uint256 revocableLimit
```

- - -

### irrevocableLimit

Indicates maximum irrevocable tokens that can be minted

```solidity
uint256 irrevocableLimit
```

- - -

### stakedAt

Tracks when prime token eligible users started staking for claiming prime token

```solidity
mapping(address => uint256) stakedAt
```

- - -

### markets

vToken to market configuration

```solidity
mapping(address => struct PrimeStorageV1.Market) markets
```

- - -

### interests

vToken to user to user index

```solidity
mapping(address => mapping(address => struct PrimeStorageV1.Interest)) interests
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

### xvsVault

address of XVS vault

```solidity
address xvsVault
```

- - -

### xvsVaultRewardToken

address of XVS vault reward token

```solidity
address xvsVaultRewardToken
```

- - -

### xvsVaultPoolId

address of XVS vault pool id

```solidity
uint256 xvsVaultPoolId
```

- - -

### isScoreUpdated

mapping to check if a account's score was updated in the round

```solidity
mapping(uint256 => mapping(address => bool)) isScoreUpdated
```

- - -

### nextScoreUpdateRoundId

unique id for next round

```solidity
uint256 nextScoreUpdateRoundId
```

- - -

### totalScoreUpdatesRequired

total number of accounts whose score needs to be updated

```solidity
uint256 totalScoreUpdatesRequired
```

- - -

### pendingScoreUpdates

total number of accounts whose score is yet to be updated

```solidity
uint256 pendingScoreUpdates
```

- - -

### vTokenForAsset

mapping used to find if an asset is part of prime markets

```solidity
mapping(address => address) vTokenForAsset
```

- - -

### comptroller

address of core pool comptroller contract

```solidity
address comptroller
```

- - -

### unreleasedPLPIncome

unreleased income from PLP that's already distributed to prime holders

```solidity
mapping(address => uint256) unreleasedPLPIncome
```

- - -

### primeLiquidityProvider

The address of PLP contract

```solidity
address primeLiquidityProvider
```

- - -

### oracle

The address of ResilientOracle contract

```solidity
contract ResilientOracleInterface oracle
```

- - -

