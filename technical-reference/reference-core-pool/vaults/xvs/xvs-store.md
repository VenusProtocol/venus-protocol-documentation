# XVS Store
XVS Store responsible for distributing XVS rewards

# Solidity API

### safeRewardTransfer

Safely transfer rewards. Only active reward tokens can be sent using this function.
Only callable by owner

```solidity
function safeRewardTransfer(address token, address _to, uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | Reward token to transfer |
| _to | address | Destination address of the reward |
| _amount | uint256 | Amount to transfer |

- - -

### setPendingAdmin

Allows the admin to propose a new admin
Only callable admin

```solidity
function setPendingAdmin(address _admin) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _admin | address | Propose an account as admin of the XVS store |

- - -

### acceptAdmin

Allows an account that is pending as admin to accept the role
nly calllable by the pending admin

```solidity
function acceptAdmin() external
```

- - -

### setNewOwner

Set the contract owner

```solidity
function setNewOwner(address _owner) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _owner | address | The address of the owner to set Only callable admin |

- - -

### setRewardToken

Set or disable a reward token

```solidity
function setRewardToken(address _tokenAddress, bool status) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenAddress | address | The address of a token to set as active or inactive |
| status | bool | Set whether a reward token is active or not |

- - -

### emergencyRewardWithdraw

Security function to allow the owner of the contract to withdraw from the contract

```solidity
function emergencyRewardWithdraw(address _tokenAddress, uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenAddress | address | Reward token address to withdraw |
| _amount | uint256 | Amount of token to withdraw |

- - -

