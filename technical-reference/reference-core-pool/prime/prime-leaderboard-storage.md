# PrimeLeaderboardStorageV1
Storage layout for the PrimeLeaderboard contract

# Solidity API

```solidity
// Individual deposit record for LIFO tracking (declared in IPrimeLeaderboard)
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

Maximum deposits per user (DoS protection). Constant, set to 30.

```solidity
uint256 MAX_DEPOSITS_PER_USER
```

- - -

### EXP_SCALE

Scaling factor for calculations (1e18)

```solidity
uint256 EXP_SCALE
```

- - -

### _depositStacks

User's deposit stack (LIFO order, index 0 = oldest). Holds the `Deposit` records described above.

```solidity
mapping(address => IPrimeLeaderboard.Deposit[]) _depositStacks
```

- - -

### totalStaked

User's total staked XVS

```solidity
mapping(address => uint256) totalStaked
```

- - -

### _multiplierDurations

Multiplier tier duration thresholds, in seconds. Default `[30 days, 60 days, 90 days]`.

```solidity
uint256[] _multiplierDurations
```

- - -

### _multiplierValues

Multiplier values corresponding to each tier (scaled by 1e18). Default `[1.3e18, 1.6e18, 2.0e18]`.

```solidity
uint256[] _multiplierValues
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
