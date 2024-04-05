# XVSVaultTreasury

This contract stores `XVS` received from XVSVaultConverter and funds XVSVault

# Solidity API

### XVS_ADDRESS

The xvs token address

```solidity
address XVS_ADDRESS
```

- - -

### xvsVault

The xvsvault address

```solidity
address xvsVault
```

- - -

### fundXVSVault

This function transfers funds to the XVS vault

```solidity
function fundXVSVault(uint256 amountMantissa) external
```

#### 📅 Events
* FundsTransferredToXVSStore emits on success

#### ⛔️ Access Requirements
* Restricted by ACM

#### ❌ Errors
* InsufficientBalance is thrown when amount entered is greater than balance

### sweepToken

This function sweep tokens from the contract

```solidity
function sweepToken(address tokenAddress, address to, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | Address of the asset(token) |
| to | address | Address to which assets will be transferred |
| amount | uint256 | Amount need to sweep from the contract |

#### 📅 Events
* SweepToken emits on success

#### ⛔️ Access Requirements
* Restricted by ACM
- - -

