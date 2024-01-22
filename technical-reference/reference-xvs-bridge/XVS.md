# XVS
XVS contract serves as a customized ERC-20 token with additional minting and burning functionality.
 It also incorporates access control features provided by the "TokenController" contract to ensure proper governance and restrictions on minting and burning operations.

# Solidity API

### mint

Creates `amount_` tokens and assigns them to `account_`, increasing
the total supply. Checks access and eligibility.

```solidity
function mint(address account_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account_ | address | Address to which tokens are assigned. |
| amount_ | uint256 | Amount of tokens to be assigned. |

#### 📅 Events
* Emits MintLimitDecreased with new available limit.

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

#### ❌ Errors
* MintLimitExceed is thrown when minting amount exceeds the maximum cap.

- - -

### burn

Destroys `amount_` tokens from `account_`, reducing the
total supply. Checks access and eligibility.

```solidity
function burn(address account_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account_ | address | Address from which tokens be destroyed. |
| amount_ | uint256 | Amount of tokens to be destroyed. |

#### 📅 Events
* Emits MintLimitIncreased with new available limit.

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

