# VenusERC4626

### Overview

`VenusERC4626` is an upgradeable, ERC4626-compliant vault that wraps a Venus vToken, enabling standard ERC4626 vault interactions with the Venus Protocol. It manages deposits, withdrawals, minting, redeeming, and reward distribution, with additional access control and loop limit protections.

# Solidity API

### State Variables

- **`NO_ERROR`** (`uint256`, internal constant):  
   Error code representing no errors in Venus operations.

- **`vToken`** (`VToken`, public):  
   The Venus vToken associated with this ERC4626 vault.

- **`comptroller`** (`IComptroller`, public):  
   The Venus Comptroller contract responsible for market operations.

- **`rewardRecipient`** (`address`, public):  
   The address that receives rewards distributed by the Venus Protocol.

---

### Events

- **`ClaimRewards(uint256 amount, address indexed rewardToken)`**  
   Emitted when rewards are claimed.

  - `amount`: The amount of reward tokens claimed.
  - `rewardToken`: The address of the reward token claimed.

- **`RewardRecipientUpdated(address indexed oldRecipient, address indexed newRecipient)`**  
   Emitted when the reward recipient address is updated.

  - `oldRecipient`: The previous reward recipient address.
  - `newRecipient`: The new reward recipient address.

- **`SweepToken(address indexed token, address indexed receiver, uint256 amount)`**  
   Emitted when tokens are swept from the contract.
  - `token`: The token address.
  - `receiver`: The receiver address.
  - `amount`: The amount swept.

---

### Errors

- **`VenusERC4626__VenusError(uint256 errorCode)`**  
   Thrown when a Venus protocol call returns an error.

  - `errorCode`: The error code returned by Venus.

- **`ERC4626__DepositMoreThanMax()`**  
   Thrown when a deposit exceeds the maximum allowed.

- **`ERC4626__MintMoreThanMax()`**  
   Thrown when a mint operation exceeds the maximum allowed.

- **`ERC4626__WithdrawMoreThanMax()`**  
   Thrown when a withdrawal exceeds the maximum available assets.

- **`ERC4626__RedeemMoreThanMax()`**  
   Thrown when a redemption exceeds the maximum redeemable shares.

- **`ERC4626__ZeroAmount(string operation)`**  
   Thrown when attempting an operation with a zero amount.
  - `operation`: The name of the operation (e.g., "deposit", "withdraw", "mint", "redeem").

### Constructor

- **@custom:oz-upgrades-unsafe-allow constructor**  
  Disables initializers for the upgradeable contract pattern.

---

### Functions

### initialize

Initializes the VenusERC4626 vault with the associated vToken address.

```solidity
function initialize(address vToken_) public initializer
```

#### Parameters

| Name     | Type    | Description                                                                 |
| -------- | ------- | --------------------------------------------------------------------------- |
| vToken\_ | address | The vToken associated with the vault, representing the yield-bearing asset. |

#### Notes

- Only the vToken address is set in this function.
- `initialize2` must be called to complete the configuration.

---

### initialize2

Completes the configuration of the VenusERC4626 vault by setting additional attributes.

```solidity
function initialize2(address accessControlManager_, address rewardRecipient_, uint256 loopsLimit_, address vaultOwner_) public
```

#### Parameters

| Name                   | Type    | Description                                                             |
| ---------------------- | ------- | ----------------------------------------------------------------------- |
| accessControlManager\_ | address | The address of the access control manager contract.                     |
| rewardRecipient\_      | address | The initial recipient of rewards.                                       |
| loopsLimit\_           | uint256 | The maximum number of loops for certain operations to enhance security. |
| vaultOwner\_           | address | The address of the vault owner.              |

#### Notes

- Can only be called once.
- Use with caution to avoid misconfiguration.

---

### setMaxLoopsLimit

Sets the maximum number of loops for certain operations.

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters

| Name       | Type    | Description                            |
| ---------- | ------- | -------------------------------------- |
| loopsLimit | uint256 | The new maximum loops limit to be set. |

#### Events

- Emits `MaxLoopsLimitUpdated` on success.

#### Access

- Controlled by the Access Control Manager (ACM).

---

### setRewardRecipient

Sets a new recipient for rewards distributed by the Venus Protocol.

```solidity
function setRewardRecipient(address newRecipient) external
```

#### Parameters

| Name         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| newRecipient | address | The address of the new reward recipient. |

#### Events

- Emits `RewardRecipientUpdated` on success.

#### Access

- Controlled by the ACM.

---

### sweepToken

Sweeps the specified token from the contract and sends it to the contract owner.

```solidity
function sweepToken(IERC20Upgradeable token) external onlyOwner
```

#### Parameters

| Name  | Type              | Description           |
| ----- | ----------------- | --------------------- |
| token | IERC20Upgradeable | Address of the token. |

#### Events

- Emits `SweepToken` on success.

#### Access

- Only the owner.

---

### claimRewards

Claims rewards from all reward distributors associated with the vToken and transfers them to the reward recipient.

```solidity
function claimRewards() external
```

#### Notes

- Iterates through all reward distributors fetched from the comptroller, claims rewards, and transfers them if available.

---

### deposit

Deposits assets into the vault, minting corresponding shares to the receiver.

```solidity
function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256)
```

#### Parameters

| Name     | Type    | Description                      |
| -------- | ------- | -------------------------------- |
| assets   | uint256 | The amount of assets to deposit. |
| receiver | address | The address to receive shares.   |

#### Returns

| Name   | Type    | Description              |
| ------ | ------- | ------------------------ |
| shares | uint256 | Amount of shares minted. |

#### Notes

- Overrides ERC4626Upgradeable deposit.
- Includes non-reentrant protection and custom Venus logic.

---

### mint

Mints new shares of the vault, allocating the corresponding amount of assets to the receiver.

```solidity
function mint(uint256 shares, address receiver) public override nonReentrant returns (uint256)
```

#### Parameters

| Name     | Type    | Description                    |
| -------- | ------- | ------------------------------ |
| shares   | uint256 | The amount of shares to mint.  |
| receiver | address | The address to receive shares. |

#### Returns

| Name   | Type    | Description                 |
| ------ | ------- | --------------------------- |
| assets | uint256 | Amount of assets deposited. |

#### Notes

- Overrides ERC4626Upgradeable mint.
- Includes non-reentrant protection and custom Venus logic.

---

### withdraw

Withdraws assets from the vault, burning the corresponding amount of shares from the owner's balance.

```solidity
function withdraw(uint256 assets, address receiver, address owner) public override nonReentrant returns (uint256)
```

#### Parameters

| Name     | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| assets   | uint256 | The amount of assets to withdraw.    |
| receiver | address | The address to receive assets.       |
| owner    | address | The address whose shares are burned. |

#### Returns

| Name   | Type    | Description              |
| ------ | ------- | ------------------------ |
| shares | uint256 | Amount of shares burned. |

#### Notes

- Overrides ERC4626Upgradeable withdraw.
- Includes non-reentrant protection and custom Venus logic.

---

### redeem

Redeems shares of the vault, returning the corresponding amount of assets to the receiver.

```solidity
function redeem(uint256 shares, address receiver, address owner) public override nonReentrant returns (uint256)
```

#### Parameters

| Name     | Type    | Description                            |
| -------- | ------- | -------------------------------------- |
| shares   | uint256 | The amount of shares to redeem.        |
| receiver | address | The address to receive assets.         |
| owner    | address | The address whose shares are redeemed. |

#### Returns

| Name   | Type    | Description                |
| ------ | ------- | -------------------------- |
| assets | uint256 | Amount of assets returned. |

#### Notes

- Overrides ERC4626Upgradeable redeem.
- Includes non-reentrant protection and custom Venus logic.

---

### totalAssets

Returns the total amount of assets managed by the vault, including both deposited assets and accrued rewards.

```solidity
function totalAssets() public view virtual override returns (uint256)
```

#### Returns

| Name   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| assets | uint256 | Total assets managed by the vault. |

#### Notes

- Overrides ERC4626Upgradeable totalAssets.

---

### maxDeposit

Returns the maximum deposit allowed, based on Venus supply caps.

```solidity
function maxDeposit(address account) public view virtual override returns (uint256)
```

#### Parameters

| Name    | Type    | Description                 |
| ------- | ------- | --------------------------- |
| account | address | The address of the account. |

#### Returns

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| amount | uint256 | Maximum assets that can be deposited. |

#### Notes

- Returns 0 if minting is paused or the supply cap has been reached.

---

### maxMint

Returns the maximum amount of shares that can be minted.

```solidity
function maxMint(address account) public view virtual override returns (uint256)
```

#### Parameters

| Name    | Type    | Description                 |
| ------- | ------- | --------------------------- |
| account | address | The address of the account. |

#### Returns

| Name   | Type    | Description                        |
| ------ | ------- | ---------------------------------- |
| shares | uint256 | Maximum shares that can be minted. |

#### Notes

- Derived from the maximum deposit amount converted to shares.

---

### maxWithdraw

Returns the maximum amount of assets that can be withdrawn.

```solidity
function maxWithdraw(address receiver) public view virtual override returns (uint256)
```

#### Parameters

| Name     | Type    | Description                             |
| -------- | ------- | --------------------------------------- |
| receiver | address | The address of the account withdrawing. |

#### Returns

| Name   | Type    | Description                           |
| ------ | ------- | ------------------------------------- |
| amount | uint256 | Maximum assets that can be withdrawn. |

#### Notes

- This value is limited by the available cash in the vault.

---

### maxRedeem

Returns the maximum amount of shares that can be redeemed.

```solidity
function maxRedeem(address receiver) public view virtual override returns (uint256)
```

#### Parameters

| Name     | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| receiver | address | The address of the account redeeming. |

#### Returns

| Name   | Type    | Description                          |
| ------ | ------- | ------------------------------------ |
| shares | uint256 | Maximum shares that can be redeemed. |

#### Notes

- Limited by the available cash in the vault.
