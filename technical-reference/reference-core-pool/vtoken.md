# vToken Contract

Abstract base for vTokens

# Solidity API

```solidity
struct MintLocalVars {
  enum CarefulMath.MathError mathErr;
  uint256 exchangeRateMantissa;
  uint256 mintTokens;
  uint256 totalSupplyNew;
  uint256 accountTokensNew;
  uint256 actualMintAmount;
}
```

```solidity
struct RedeemLocalVars {
  enum CarefulMath.MathError mathErr;
  uint256 exchangeRateMantissa;
  uint256 redeemTokens;
  uint256 redeemAmount;
  uint256 totalSupplyNew;
  uint256 accountTokensNew;
}
```

```solidity
struct BorrowLocalVars {
  enum CarefulMath.MathError mathErr;
  uint256 accountBorrows;
  uint256 accountBorrowsNew;
  uint256 totalBorrowsNew;
}
```

```solidity
struct RepayBorrowLocalVars {
  enum TokenErrorReporter.Error err;
  enum CarefulMath.MathError mathErr;
  uint256 repayAmount;
  uint256 borrowerIndex;
  uint256 accountBorrows;
  uint256 accountBorrowsNew;
  uint256 totalBorrowsNew;
  uint256 actualRepayAmount;
}
```

### transfer

Transfer `amount` tokens from `msg.sender` to `dst`

```solidity
function transfer(address dst, uint256 amount) external returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| dst | address | The address of the destination account |
| amount | uint256 | The number of tokens to transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | Whether or not the transfer succeeded |

---

### transferFrom

Transfer `amount` tokens from `src` to `dst`

```solidity
function transferFrom(address src, address dst, uint256 amount) external returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| src | address | The address of the source account |
| dst | address | The address of the destination account |
| amount | uint256 | The number of tokens to transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | Whether or not the transfer succeeded |

---

### approve

Approve `spender` to transfer up to `amount` from `src`

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address of the account which may transfer tokens |
| amount | uint256 | The number of tokens that are approved (-1 means infinite) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | Whether or not the approval succeeded |

---

### balanceOfUnderlying

Get the underlying balance of the `owner`

```solidity
function balanceOfUnderlying(address owner) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the account to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The amount of underlying owned by `owner` |

---

### totalBorrowsCurrent

Returns the current total borrows plus accrued interest

```solidity
function totalBorrowsCurrent() external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The total borrows with interest |

---

### borrowBalanceCurrent

Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex

```solidity
function borrowBalanceCurrent(address account) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address whose balance should be calculated after updating borrowIndex |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The calculated balance |

---

### seize

Transfers collateral tokens (this market) to the liquidator.

```solidity
function seize(address liquidator, address borrower, uint256 seizeTokens) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidator | address | The account receiving seized collateral |
| borrower | address | The account having collateral seized |
| seizeTokens | uint256 | The number of vTokens to seize |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setPendingAdmin

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```solidity
function _setPendingAdmin(address payable newPendingAdmin) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newPendingAdmin | address payable | New pending admin. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```solidity
function _acceptAdmin() external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setReserveFactor

accrues interest and sets a new reserve factor for the protocol using `_setReserveFactorFresh`

```solidity
function _setReserveFactor(uint256 newReserveFactorMantissa) external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_reduceReserves

Accrues interest and reduces reserves by transferring to admin

```solidity
function _reduceReserves(uint256 reduceAmount) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| reduceAmount | uint256 | Amount of reduction to reserves |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### allowance

Get the current allowance from `owner` for `spender`

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the account which owns the tokens to be spent |
| spender | address | The address of the account which may transfer tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The number of tokens allowed to be spent (-1 means infinite) |

---

### balanceOf

Get the token balance of the `owner`

```solidity
function balanceOf(address owner) external view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the account to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The number of tokens owned by `owner` |

---

### getAccountSnapshot

Get a snapshot of the account's balances, and the cached exchange rate

```solidity
function getAccountSnapshot(address account) external view returns (uint256, uint256, uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address of the account to snapshot |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (possible error, token balance, borrow balance, exchange rate mantissa) |
| \[1] | uint256 |  |
| \[2] | uint256 |  |
| \[3] | uint256 |  |

---

### supplyRatePerBlock

Returns the current per-block supply interest rate for this vToken

```solidity
function supplyRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The supply interest rate per block, scaled by 1e18 |

---

### borrowRatePerBlock

Returns the current per-block borrow interest rate for this vToken

```solidity
function borrowRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The borrow interest rate per block, scaled by 1e18 |

---

### getCash

Get cash balance of this vToken in the underlying asset

```solidity
function getCash() external view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The quantity of underlying asset owned by this contract |

---

### initialize

Initialize the money market

```solidity
function initialize(contract ComptrollerInterface comptroller_, contract InterestRateModel interestRateModel_, uint256 initialExchangeRateMantissa_, string name_, string symbol_, uint8 decimals_) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller\_ | contract ComptrollerInterface | The address of the Comptroller |
| interestRateModel\_ | contract InterestRateModel | The address of the interest rate model |
| initialExchangeRateMantissa\_ | uint256 | The initial exchange rate, scaled by 1e18 |
| name\_ | string | EIP-20 name of this token |
| symbol\_ | string | EIP-20 symbol of this token |
| decimals\_ | uint8 | EIP-20 decimal precision of this token |

---

### exchangeRateCurrent

Accrue interest then return the up-to-date exchange rate

```solidity
function exchangeRateCurrent() public returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Calculated exchange rate scaled by 1e18 |

---

### accrueInterest

Applies accrued interest to total borrows and reserves

```solidity
function accrueInterest() public returns (uint256)
```

---

### \_setComptroller

Sets a new comptroller for the market

```solidity
function _setComptroller(contract ComptrollerInterface newComptroller) public returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setInterestRateModel

Accrues interest and updates the interest rate model using \_setInterestRateModelFresh

```solidity
function _setInterestRateModel(contract InterestRateModel newInterestRateModel) public returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newInterestRateModel | contract InterestRateModel | The new interest rate model to use |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### exchangeRateStored

Calculates the exchange rate from the underlying to the VToken

```solidity
function exchangeRateStored() public view returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Calculated exchange rate scaled by 1e18 |

---

### borrowBalanceStored

Return the borrow balance of account based on stored data

```solidity
function borrowBalanceStored(address account) public view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address whose balance should be calculated |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The calculated balance |

---
