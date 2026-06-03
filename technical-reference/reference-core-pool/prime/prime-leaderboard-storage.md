# PrimeLeaderboardStorageV1
Storage layout for the PrimeLeaderboard contract

# Solidity API

```solidity
// Individual deposit record for LIFO tracking
struct Deposit {
  uint128 amount;    // Amount deposited
  uint64 timestamp;  // Deposit timestamp
  uint64 _reserved;  // Reserved for future use
}
```

### BASE_MULTIPLIER

Base multiplier (1.0x) scaled by 1e18

```solidity
uint256 BASE_MULTIPLIER
```

- - -

### MAX_DEPOSITS_PER_USER

Maximum deposits per user (DoS protection). Default 30.

```solidity
uint256 MAX_DEPOSITS_PER_USER
```

- - -

### totalStaked

User's total staked XVS

```solidity
mapping(address => uint256) totalStaked
```

- - -

### primeV2

Address of the PrimeV2 contract

```solidity
address primeV2
```

- - -

### stakersInitialized

Whether staker initialization is complete (prevents further initialization calls)

```solidity
bool stakersInitialized
```

- - -
