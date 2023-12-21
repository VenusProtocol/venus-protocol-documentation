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

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountMantissa | uint256 | Amount to be sent to XVS vault |

#### 📅 Events
* FundsTransferredToXVSStore emits on success

#### ⛔️ Access Requirements
* Restricted by ACM

#### ❌ Errors
* InsufficientBalance is thrown when amount entered is greater than balance

- - -

