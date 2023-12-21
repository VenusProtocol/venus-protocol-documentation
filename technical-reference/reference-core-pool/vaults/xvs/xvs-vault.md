# XVS Vault
The XVS Vault allows XVS holders to lock their XVS to recieve voting rights in Venus governance and are rewarded with XVS.

# Solidity API

### pause

Pauses vault

```solidity
function pause() external
```

- - -

### resume

Resume vault

```solidity
function resume() external
```

- - -

### poolLength

Returns the number of pools with the specified reward token

```solidity
function poolLength(address rewardToken) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| rewardToken | address | Reward token address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Number of pools that distribute the specified token as a reward |

- - -

### add

Add a new token pool

```solidity
function add(address _rewardToken, uint256 _allocPoint, contract IBEP20 _token, uint256 _rewardPerBlock, uint256 _lockPeriod) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _allocPoint | uint256 | Number of allocation points assigned to this pool |
| _token | contract IBEP20 | Staked token |
| _rewardPerBlock | uint256 | Initial reward per block, in terms of _rewardToken |
| _lockPeriod | uint256 | A period between withdrawal request and a moment when it's executable |

- - -

### set

Update the given pool's reward allocation point

```solidity
function set(address _rewardToken, uint256 _pid, uint256 _allocPoint) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _pid | uint256 | Pool index |
| _allocPoint | uint256 | Number of allocation points assigned to this pool |

- - -

### setRewardAmountPerBlock

Update the given reward token's amount per block

```solidity
function setRewardAmountPerBlock(address _rewardToken, uint256 _rewardAmount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _rewardAmount | uint256 | Number of allocation points assigned to this pool |

- - -

### setWithdrawalLockingPeriod

Update the lock period after which a requested withdrawal can be executed

```solidity
function setWithdrawalLockingPeriod(address _rewardToken, uint256 _pid, uint256 _newPeriod) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _pid | uint256 | Pool index |
| _newPeriod | uint256 | New lock period |

- - -

### deposit

Deposit XVSVault for XVS allocation

```solidity
function deposit(address _rewardToken, uint256 _pid, uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _amount | uint256 | The amount to deposit to vault |

- - -

### claim

Claim rewards for pool

```solidity
function claim(address _account, address _rewardToken, uint256 _pid) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _account | address | The account for which to claim rewards |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |

- - -

### executeWithdrawal

Execute withdrawal to XVSVault for XVS allocation

```solidity
function executeWithdrawal(address _rewardToken, uint256 _pid) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |

- - -

### requestWithdrawal

Request withdrawal to XVSVault for XVS allocation

```solidity
function requestWithdrawal(address _rewardToken, uint256 _pid, uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _amount | uint256 | The amount to withdraw from the vault |

- - -

### getEligibleWithdrawalAmount

Get unlocked withdrawal amount

```solidity
function getEligibleWithdrawalAmount(address _rewardToken, uint256 _pid, address _user) external view returns (uint256 withdrawalAmount)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _user | address | The User Address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| withdrawalAmount | uint256 | Amount that the user can withdraw |

- - -

### getRequestedAmount

Get requested amount

```solidity
function getRequestedAmount(address _rewardToken, uint256 _pid, address _user) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _user | address | The User Address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Total amount of requested but not yet executed withdrawals (including both executable and locked ones) |

- - -

### getWithdrawalRequests

Returns the array of withdrawal requests that have not been executed yet

```solidity
function getWithdrawalRequests(address _rewardToken, uint256 _pid, address _user) external view returns (struct XVSVaultStorageV1.WithdrawalRequest[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _user | address | The User Address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct XVSVaultStorageV1.WithdrawalRequest[] | An array of withdrawal requests |

- - -

### pendingReward

View function to see pending XVSs on frontend

```solidity
function pendingReward(address _rewardToken, uint256 _pid, address _user) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _pid | uint256 | Pool index |
| _user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Reward the user is eligible for in this pool, in terms of _rewardToken |

- - -

### updatePool

Update reward variables of the given pool to be up-to-date

```solidity
function updatePool(address _rewardToken, uint256 _pid) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _pid | uint256 | Pool index |

- - -

### getUserInfo

Get user info with reward token address and pid

```solidity
function getUserInfo(address _rewardToken, uint256 _pid, address _user) external view returns (uint256 amount, uint256 rewardDebt, uint256 pendingWithdrawals)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | Reward token address |
| _pid | uint256 | Pool index |
| _user | address | User address |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Deposited amount |
| rewardDebt | uint256 | Reward debt (technical value used to track past payouts) |
| pendingWithdrawals | uint256 | Requested but not yet executed withdrawals |

- - -

### pendingWithdrawalsBeforeUpgrade

Gets the total pending withdrawal amount of a user before upgrade

```solidity
function pendingWithdrawalsBeforeUpgrade(address _rewardToken, uint256 _pid, address _user) public view returns (uint256 beforeUpgradeWithdrawalAmount)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _rewardToken | address | The Reward Token Address |
| _pid | uint256 | The Pool Index |
| _user | address | The address of the user |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| beforeUpgradeWithdrawalAmount | uint256 | Total pending withdrawal amount in requests made before the vault upgrade |

- - -

### delegate

Delegate votes from `msg.sender` to `delegatee`

```solidity
function delegate(address delegatee) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| delegatee | address | The address to delegate votes to |

- - -

### delegateBySig

Delegates votes from signatory to `delegatee`

```solidity
function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| delegatee | address | The address to delegate votes to |
| nonce | uint256 | The contract state required to match the signature |
| expiry | uint256 | The time at which to expire the signature |
| v | uint8 | The recovery byte of the signature |
| r | bytes32 | Half of the ECDSA signature pair |
| s | bytes32 | Half of the ECDSA signature pair |

- - -

### getCurrentVotes

Gets the current votes balance for `account`

```solidity
function getCurrentVotes(address account) external view returns (uint96)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to get votes balance |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint96 | The number of current votes for `account` |

- - -

### getPriorVotes

Determine the xvs stake balance for an account

```solidity
function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to check |
| blockNumber | uint256 | The block number to get the vote balance at |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint96 | The balance that user staked |

- - -

### _become

* Admin Functions **

```solidity
function _become(contract XVSVaultProxy xvsVaultProxy) external
```

- - -

### setAccessControl

Sets the address of the access control of this contract

```solidity
function setAccessControl(address newAccessControlAddress) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newAccessControlAddress | address | New address for the access control |

- - -

