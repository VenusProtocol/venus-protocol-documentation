# Venus&#x27;s vToken Contract

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

| Name   | Type    | Description                            |
| ------ | ------- | -------------------------------------- |
| dst    | address | The address of the destination account |
| amount | uint256 | The number of tokens to transfer       |

#### Return Values

| Name | Type | Description                           |
| ---- | ---- | ------------------------------------- |
| [0]  | bool | Whether or not the transfer succeeded |

---

### transferFrom

Transfer `amount` tokens from `src` to `dst`

```solidity
function transferFrom(address src, address dst, uint256 amount) external returns (bool)
```

#### Parameters

| Name   | Type    | Description                            |
| ------ | ------- | -------------------------------------- |
| src    | address | The address of the source account      |
| dst    | address | The address of the destination account |
| amount | uint256 | The number of tokens to transfer       |

#### Return Values

| Name | Type | Description                           |
| ---- | ---- | ------------------------------------- |
| [0]  | bool | Whether or not the transfer succeeded |

---

### approve

Approve `spender` to transfer up to `amount` from `src`

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

#### Parameters

| Name    | Type    | Description                                                |
| ------- | ------- | ---------------------------------------------------------- |
| spender | address | The address of the account which may transfer tokens       |
| amount  | uint256 | The number of tokens that are approved (-1 means infinite) |

#### Return Values

| Name | Type | Description                           |
| ---- | ---- | ------------------------------------- |
| [0]  | bool | Whether or not the approval succeeded |

---

### balanceOfUnderlying

Get the underlying balance of the `owner`

```solidity
function balanceOfUnderlying(address owner) external returns (uint256)
```

#### Parameters

| Name  | Type    | Description                         |
| ----- | ------- | ----------------------------------- |
| owner | address | The address of the account to query |

#### Return Values

| Name | Type    | Description                               |
| ---- | ------- | ----------------------------------------- |
| [0]  | uint256 | The amount of underlying owned by `owner` |

---

### totalBorrowsCurrent

Returns the current total borrows plus accrued interest

```solidity
function totalBorrowsCurrent() external returns (uint256)
```

#### Return Values

| Name | Type    | Description                     |
| ---- | ------- | ------------------------------- |
| [0]  | uint256 | The total borrows with interest |

---

### borrowBalanceCurrent

Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex

```solidity
function borrowBalanceCurrent(address account) external returns (uint256)
```

#### Parameters

| Name    | Type    | Description                                                               |
| ------- | ------- | ------------------------------------------------------------------------- |
| account | address | The address whose balance should be calculated after updating borrowIndex |

#### Return Values

| Name | Type    | Description            |
| ---- | ------- | ---------------------- |
| [0]  | uint256 | The calculated balance |

---

### seize

Transfers collateral tokens (this market) to the liquidator.

```solidity
function seize(address liquidator, address borrower, uint256 seizeTokens) external returns (uint256)
```

#### Parameters

| Name        | Type    | Description                             |
| ----------- | ------- | --------------------------------------- |
| liquidator  | address | The account receiving seized collateral |
| borrower    | address | The account having collateral seized    |
| seizeTokens | uint256 | The number of vTokens to seize          |

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setPendingAdmin

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```solidity
function _setPendingAdmin(address payable newPendingAdmin) external returns (uint256)
```

#### Parameters

| Name            | Type            | Description        |
| --------------- | --------------- | ------------------ |
| newPendingAdmin | address payable | New pending admin. |

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```solidity
function _acceptAdmin() external returns (uint256)
```

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setReserveFactor

accrues interest and sets a new reserve factor for the protocol using `_setReserveFactorFresh`

```solidity
function _setReserveFactor(uint256 newReserveFactorMantissa_) external returns (uint256)
```

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### setAccessControlManager

Sets the address of the access control manager of this contract

```solidity
function setAccessControlManager(address newAccessControlManagerAddress) external returns (uint256)
```

#### Parameters

| Name                           | Type    | Description                        |
| ------------------------------ | ------- | ---------------------------------- |
| newAccessControlManagerAddress | address | New address for the access control |

#### Return Values

| Name | Type    | Description                           |
| ---- | ------- | ------------------------------------- |
| [0]  | uint256 | uint 0=success, otherwise will revert |

---

### \_reduceReserves

Accrues interest and reduces reserves by transferring to protocol share reserve

```solidity
function _reduceReserves(uint256 reduceAmount_) external returns (uint256)
```

#### Parameters

| Name           | Type    | Description                     |
| -------------- | ------- | ------------------------------- |
| reduceAmount\_ | uint256 | Amount of reduction to reserves |

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### allowance

Get the current allowance from `owner` for `spender`

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

#### Parameters

| Name    | Type    | Description                                                  |
| ------- | ------- | ------------------------------------------------------------ |
| owner   | address | The address of the account which owns the tokens to be spent |
| spender | address | The address of the account which may transfer tokens         |

#### Return Values

| Name | Type    | Description                                                  |
| ---- | ------- | ------------------------------------------------------------ |
| [0]  | uint256 | The number of tokens allowed to be spent (-1 means infinite) |

---

### balanceOf

Get the token balance of the `owner`

```solidity
function balanceOf(address owner) external view returns (uint256)
```

#### Parameters

| Name  | Type    | Description                         |
| ----- | ------- | ----------------------------------- |
| owner | address | The address of the account to query |

#### Return Values

| Name | Type    | Description                           |
| ---- | ------- | ------------------------------------- |
| [0]  | uint256 | The number of tokens owned by `owner` |

---

### getAccountSnapshot

Get a snapshot of the account's balances, and the cached exchange rate

```solidity
function getAccountSnapshot(address account) external view returns (uint256, uint256, uint256, uint256)
```

#### Parameters

| Name    | Type    | Description                        |
| ------- | ------- | ---------------------------------- |
| account | address | Address of the account to snapshot |

#### Return Values

| Name | Type    | Description                                                             |
| ---- | ------- | ----------------------------------------------------------------------- |
| [0]  | uint256 | (possible error, token balance, borrow balance, exchange rate mantissa) |
| [1]  | uint256 |                                                                         |
| [2]  | uint256 |                                                                         |
| [3]  | uint256 |                                                                         |

---

### supplyRatePerBlock

Returns the current per-block supply interest rate for this vToken

```solidity
function supplyRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                        |
| ---- | ------- | -------------------------------------------------- |
| [0]  | uint256 | The supply interest rate per block, scaled by 1e18 |

---

### borrowRatePerBlock

Returns the current per-block borrow interest rate for this vToken

```solidity
function borrowRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                        |
| ---- | ------- | -------------------------------------------------- |
| [0]  | uint256 | The borrow interest rate per block, scaled by 1e18 |

---

### getCash

Get cash balance of this vToken in the underlying asset

```solidity
function getCash() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                             |
| ---- | ------- | ------------------------------------------------------- |
| [0]  | uint256 | The quantity of underlying asset owned by this contract |

---

### setReduceReservesBlockDelta

Governance function to set new threshold of block difference after which funds will be sent to the protocol share reserve

```solidity
function setReduceReservesBlockDelta(uint256 newReduceReservesBlockDelta_) external returns (uint256)
```

#### Parameters

| Name                          | Type    | Description            |
| ----------------------------- | ------- | ---------------------- |
| newReduceReservesBlockDelta\_ | uint256 | block difference value |

---

### setProtocolShareReserve

Sets protocol share reserve contract address

```solidity
function setProtocolShareReserve(address payable protcolShareReserve_) external returns (uint256)
```

#### Parameters

| Name                  | Type            | Description                                    |
| --------------------- | --------------- | ---------------------------------------------- |
| protcolShareReserve\_ | address payable | The address of protocol share reserve contract |

---

### initialize

Initialize the money market

```solidity
function initialize(contract ComptrollerInterface comptroller_, contract InterestRateModel interestRateModel_, uint256 initialExchangeRateMantissa_, string name_, string symbol_, uint8 decimals_) public
```

#### Parameters

| Name                          | Type                          | Description                               |
| ----------------------------- | ----------------------------- | ----------------------------------------- |
| comptroller\_                 | contract ComptrollerInterface | The address of the Comptroller            |
| interestRateModel\_           | contract InterestRateModel    | The address of the interest rate model    |
| initialExchangeRateMantissa\_ | uint256                       | The initial exchange rate, scaled by 1e18 |
| name\_                        | string                        | EIP-20 name of this token                 |
| symbol\_                      | string                        | EIP-20 symbol of this token               |
| decimals\_                    | uint8                         | EIP-20 decimal precision of this token    |

---

### exchangeRateCurrent

Accrue interest then return the up-to-date exchange rate

```solidity
function exchangeRateCurrent() public returns (uint256)
```

#### Return Values

| Name | Type    | Description                             |
| ---- | ------- | --------------------------------------- |
| [0]  | uint256 | Calculated exchange rate scaled by 1e18 |

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

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### \_setInterestRateModel

Accrues interest and updates the interest rate model using \_setInterestRateModelFresh

```solidity
function _setInterestRateModel(contract InterestRateModel newInterestRateModel_) public returns (uint256)
```

#### Parameters

| Name                   | Type                       | Description                        |
| ---------------------- | -------------------------- | ---------------------------------- |
| newInterestRateModel\_ | contract InterestRateModel | The new interest rate model to use |

#### Return Values

| Name | Type    | Description                                                                                      |
| ---- | ------- | ------------------------------------------------------------------------------------------------ |
| [0]  | uint256 | uint Returns 0 on success, otherwise returns a failure code (see ErrorReporter.sol for details). |

---

### exchangeRateStored

Calculates the exchange rate from the underlying to the VToken

```solidity
function exchangeRateStored() public view returns (uint256)
```

#### Return Values

| Name | Type    | Description                             |
| ---- | ------- | --------------------------------------- |
| [0]  | uint256 | Calculated exchange rate scaled by 1e18 |

---

### borrowBalanceStored

Return the borrow balance of account based on stored data

```solidity
function borrowBalanceStored(address account) public view returns (uint256)
```

#### Parameters

| Name    | Type    | Description                                    |
| ------- | ------- | ---------------------------------------------- |
| account | address | The address whose balance should be calculated |

#### Return Values

| Name | Type    | Description            |
| ---- | ------- | ---------------------- |
| [0]  | uint256 | The calculated balance |

---

### transferOutUnderlying

Transfers the underlying tokens to a specified address, exclusively called by the Comptroller and primarily used for flash loans.

```solidity
function transferOutUnderlying(address payable to, uint256 amount)
    external;
```

#### Parameters

| Name     | Type    |Description                                 |
|----------|------------------------------------------------------|
| to | address payable | The address to receive the underlying assets |
| amount   | uint256 | The amount of the underlying assets to transfer  |

#### Return Values

| Name | Type    |Description                                 |
|------|------------------------------------------------------|
| [0]  | uint256 | The cash balance of the vToken after the transfer |

---

### transferInUnderlyingAndVerify

Transfers underlying tokens from a specified address and verifies repayment. Called exclusively by the Comptroller.

```solidity
function transferINUnderlyingAndVerify(address payable from, uint256 amountRepayed)
    external
    returns (uint256);
```

#### Parameters

| Name     | Type    |Description                                 |
|----------|------------------------------------------------------|
| from | address payable | The address from which underlying assets are transferred |
| amountRepayed   | uint256 | The amount of the underlying assets to transfer  |

---

### executeFlashLoan

Executes a flash loan operation, providing uncollateralized assets to a receiver contract that must be repaid within the same transaction. The receiver contract must implement the required interface to handle the borrowed funds and return the principal plus applicable fees.

```solidity
function executeFlashLoan(
    address initiator,
    address payable receiver,
    uint256 amount,  
    bytes calldata param
)
    external
    returns (uint256);
```

#### Parameters

| Name      | Type            | Description                                                                 |
|-----------|-----------------|-----------------------------------------------------------------------------|
| initiator | address         | The address initiating the flash loan operation                             |
| receiver  | address payable | The contract address receiving the flash loan assets                        |
| amount    | uint256         | The amount of underlying assets to be loaned                                |
| param     | bytes calldata  | Arbitrary data passed to the receiver contract for custom flash loan logic  |

#### Return Values

| Name | Type    | Description                                 |
|------|---------|---------------------------------------------|
| [0]  | uint256 | Status code (e.g., success/failure)         |

---

### calculateFlashLoanFee

Calculates the total fee and protocol fee for a flash loan amount. Reverts if flash loans are disabled.

```solidity
function calculateFlashLoanFee(uint256 amount)
    public
    view
    returns (uint256, uint256);
```   
#### Parameters

| Name   | Type    | Description                          |
|--------|---------|--------------------------------------|
| amount | uint256 | The amount of the flash loan |

#### Return Values

| Name          | Type     | Description                                 |
|---------------|----------|---------------------------------------------|
| [0] | uint256  | The total fee for the flash loan |
| [1] | uint256  | The portion of the fee allocated to the protocol |

---

### toggleFlashLoan

Enables or disables flash loan functionality for the market. Governance-restricted.

```solidity
function toggleFlashLoan()
    external
    returns (uint256);
```   

#### Parameters
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

#### Return Values
| Name | Type    | Description                                 |
|------|---------|---------------------------------------------|
| [0]  | uint256 | Status code (e.g., success/failure)         |

---

### setFlashLoanFeeMantissa

Updates the flash loan fee parameters. Governance-restricted.

```solidity
function setFlashLoanFeeMantissa(
    uint256 flashLoanFeeMantissa_,
    uint256 flashLoanProtocolShare_
)
    external
    returns (uint256);
```

#### Parameters
| Name                  | Type    | Description                                 |
|-----------------------|---------|---------------------------------------------|
| flashLoanFeeMantissa_  | uint256 | New flash loan fee (scaled by 1e18) |
| flashLoanProtocolShare_  | uint256 | New protocol fee share (scaled by 1e18) |

#### Return Values
| Name | Type    | Description                                 |
|------|---------|---------------------------------------------|
| [0]  | uint256 | Status code (e.g., success/failure)         |

---

