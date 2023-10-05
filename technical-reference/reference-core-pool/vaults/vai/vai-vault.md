# VAI Vault
The VAI Vault is configured for users to stake VAI And receive XVS as a reward.

# Solidity API

### pause

Pause vault

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

### deposit

Deposit VAI to VAIVault for XVS allocation

```solidity
function deposit(uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount to deposit to vault |

- - -

### withdraw

Withdraw VAI from VAIVault

```solidity
function withdraw(uint256 _amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount to withdraw from vault |

- - -

### claim

Claim XVS from VAIVault

```solidity
function claim() external
```

- - -

### claim

Claim XVS from VAIVault

```solidity
function claim(address account) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account for which to claim XVS |

- - -

### pendingXVS

View function to see pending XVS on frontend

```solidity
function pendingXVS(address _user) public view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _user | address | The user to see pending XVS |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Amount of XVS the user can claim |

- - -

### updatePendingRewards

Function that updates pending rewards

```solidity
function updatePendingRewards() public
```

- - -

### _become

* Admin Functions **

```solidity
function _become(contract VAIVaultProxy vaiVaultProxy) external
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

