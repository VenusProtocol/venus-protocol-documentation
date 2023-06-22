# RewardsDistributor

Contract used to configure, track and distribute rewards to users based on their actions (borrows and supplies) in the protocol.
Users can receive additional rewards through a `RewardsDistributor`. Each `RewardsDistributor` proxy is initialized with a specific reward
token and `Comptroller`, which can then distribute the reward token to users that supply or borrow in the associated pool.
Authorized users can set the reward token borrow and supply speeds for each market in the pool. This sets a fixed amount of reward
token to be released each block for borrowers and suppliers, which is distributed based on a user’s percentage of the borrows or supplies
respectively. The owner can also set up reward distributions to contributor addresses (distinct from suppliers and borrowers) by setting
their contributor reward token speed, which similarly allocates a fixed amount of reward token per block.

The owner has the ability to transfer any amount of reward tokens held by the contract to any other address. Rewards are not distributed
automatically and must be claimed by a user calling `claimRewardToken()`. Users should be aware that it is up to the owner and other centralized
entities to ensure that the `RewardsDistributor` holds enough tokens to distribute the accumulated rewards of users and contributors.

# Solidity API

```solidity
struct RewardToken {
  uint224 index;
  uint32 block;
}

```

### INITIAL\_INDEX

The initial REWARD TOKEN index for a market

```solidity
uint224 INITIAL_INDEX
```

---

### rewardTokenSupplyState

The REWARD TOKEN market supply state for each market

```solidity
mapping(address => struct RewardsDistributor.RewardToken) rewardTokenSupplyState
```

---

### rewardTokenSupplierIndex

The REWARD TOKEN borrow index for each market for each supplier as of the last time they accrued REWARD TOKEN

```solidity
mapping(address => mapping(address => uint256)) rewardTokenSupplierIndex
```

---

### rewardTokenAccrued

The REWARD TOKEN accrued but not yet transferred to each user

```solidity
mapping(address => uint256) rewardTokenAccrued
```

---

### rewardTokenBorrowSpeeds

The rate at which rewardToken is distributed to the corresponding borrow market (per block)

```solidity
mapping(address => uint256) rewardTokenBorrowSpeeds
```

---

### rewardTokenSupplySpeeds

The rate at which rewardToken is distributed to the corresponding supply market (per block)

```solidity
mapping(address => uint256) rewardTokenSupplySpeeds
```

---

### rewardTokenBorrowState

The REWARD TOKEN market borrow state for each market

```solidity
mapping(address => struct RewardsDistributor.RewardToken) rewardTokenBorrowState
```

---

### rewardTokenContributorSpeeds

The portion of REWARD TOKEN that each contributor receives per block

```solidity
mapping(address => uint256) rewardTokenContributorSpeeds
```

---

### lastContributorBlock

Last block at which a contributor's REWARD TOKEN rewards have been allocated

```solidity
mapping(address => uint256) lastContributorBlock
```

---

### rewardTokenBorrowerIndex

The REWARD TOKEN borrow index for each market for each borrower as of the last time they accrued REWARD TOKEN

```solidity
mapping(address => mapping(address => uint256)) rewardTokenBorrowerIndex
```

---

### initialize

RewardsDistributor initializer

```solidity
function initialize(contract Comptroller comptroller_, contract IERC20Upgradeable rewardToken_, uint256 loopsLimit_, address accessControlManager_) external
```

#### Parameters

| Name                   | Type                       | Description                                                 |
| ---------------------- | -------------------------- | ----------------------------------------------------------- |
| comptroller\_          | contract Comptroller       | Comptroller to attach the reward distributor to             |
| rewardToken\_          | contract IERC20Upgradeable | Reward token to distribute                                  |
| loopsLimit\_           | uint256                    | Maximum number of iterations for the loops in this contract |
| accessControlManager\_ | address                    | AccessControlManager contract address                       |

---

### distributeBorrowerRewardToken

Calculate reward token accrued by a borrower and possibly transfer it to them
Borrowers will begin to accrue after the first interaction with the protocol.

```solidity
function distributeBorrowerRewardToken(address vToken, address borrower, struct ExponentialNoError.Exp marketBorrowIndex) external
```

#### Parameters

| Name              | Type                          | Description                                               |
| ----------------- | ----------------------------- | --------------------------------------------------------- |
| vToken            | address                       | The market in which the borrower is interacting           |
| borrower          | address                       | The address of the borrower to distribute REWARD TOKEN to |
| marketBorrowIndex | struct ExponentialNoError.Exp | The current global borrow index of vToken                 |

---

### grantRewardToken

Transfer REWARD TOKEN to the recipient

```solidity
function grantRewardToken(address recipient, uint256 amount) external
```

#### Parameters

| Name      | Type    | Description                                              |
| --------- | ------- | -------------------------------------------------------- |
| recipient | address | The address of the recipient to transfer REWARD TOKEN to |
| amount    | uint256 | The amount of REWARD TOKEN to (possibly) transfer        |

---

### setRewardTokenSpeeds

Set REWARD TOKEN borrow and supply speeds for the specified markets

```solidity
function setRewardTokenSpeeds(contract VToken[] vTokens, uint256[] supplySpeeds, uint256[] borrowSpeeds) external
```

#### Parameters

| Name         | Type              | Description                                                     |
| ------------ | ----------------- | --------------------------------------------------------------- |
| vTokens      | contract VToken\[] | The markets whose REWARD TOKEN speed to update                  |
| supplySpeeds | uint256\[]         | New supply-side REWARD TOKEN speed for the corresponding market |
| borrowSpeeds | uint256\[]         | New borrow-side REWARD TOKEN speed for the corresponding market |

---

### setContributorRewardTokenSpeed

Set REWARD TOKEN speed for a single contributor

```solidity
function setContributorRewardTokenSpeed(address contributor, uint256 rewardTokenSpeed) external
```

#### Parameters

| Name             | Type    | Description                                        |
| ---------------- | ------- | -------------------------------------------------- |
| contributor      | address | The contributor whose REWARD TOKEN speed to update |
| rewardTokenSpeed | uint256 | New REWARD TOKEN speed for contributor             |

---

### claimRewardToken

Claim all the rewardToken accrued by holder in all markets

```solidity
function claimRewardToken(address holder) external
```

#### Parameters

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| holder | address | The address to claim REWARD TOKEN for |

---

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 limit) external
```

#### Parameters

| Name  | Type    | Description                                   |
| ----- | ------- | --------------------------------------------- |
| limit | uint256 | Limit for the max loops can execute at a time |

---

### updateContributorRewards

Calculate additional accrued REWARD TOKEN for a contributor since last accrual

```solidity
function updateContributorRewards(address contributor) public
```

#### Parameters

| Name        | Type    | Description                                      |
| ----------- | ------- | ------------------------------------------------ |
| contributor | address | The address to calculate contributor rewards for |

---

### claimRewardToken

Claim all the rewardToken accrued by holder in the specified markets

```solidity
function claimRewardToken(address holder, contract VToken[] vTokens) public
```

#### Parameters

| Name    | Type              | Description                                  |
| ------- | ----------------- | -------------------------------------------- |
| holder  | address           | The address to claim REWARD TOKEN for        |
| vTokens | contract VToken\[] | The list of markets to claim REWARD TOKEN in |

---
