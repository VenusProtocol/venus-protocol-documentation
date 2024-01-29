# VToken

Each asset that is supported by a pool is integrated through an instance of the `VToken` contract. As outlined in the protocol overview,
each isolated pool creates its own `vToken` corresponding to an asset. Within a given pool, each included `vToken` is referred to as a market of
the pool. The main actions a user regularly interacts with in a market are:

- mint/redeem of vTokens;
- transfer of vTokens;
- borrow/repay a loan on an underlying asset;
- liquidate a borrow or liquidate/heal an account.

A user supplies the underlying asset to a pool by minting `vTokens`, where the corresponding `vToken` amount is determined by the `exchangeRate`.
The `exchangeRate` will change over time, dependent on a number of factors, some of which accrue interest. Additionally, once users have minted
`vToken` in a pool, they can borrow any asset in the isolated pool by using their `vToken` as collateral. In order to borrow an asset or use a `vToken`
as collateral, the user must be entered into each corresponding market (else, the `vToken` will not be considered collateral for a borrow). Note that
a user may borrow up to a portion of their collateral determined by the market’s collateral factor. However, if their borrowed amount exceeds an amount
calculated using the market’s corresponding liquidation threshold, the borrow is eligible for liquidation. When a user repays a borrow, they must also
pay off interest accrued on the borrow.

The Venus Protocol includes unique mechanisms for healing an account and liquidating an account. These actions are performed in the `Comptroller`
and consider all borrows and collateral for which a given account is entered within a market. These functions may only be called on an account with a
total collateral amount that is no larger than a universal `minLiquidatableCollateral` value, which is used for all markets within a `Comptroller`.
Both functions settle all of an account’s borrows, but `healAccount()` may add `badDebt` to a vToken. For more detail, see the description of
`healAccount()` and `liquidateAccount()` in the `Comptroller` summary section below.

# Solidity API

### initialize

Construct a new money market

```solidity
function initialize(address underlying_, contract ComptrollerInterface comptroller_, contract InterestRateModel interestRateModel_, uint256 initialExchangeRateMantissa_, string name_, string symbol_, uint8 decimals_, address admin_, address accessControlManager_, struct VTokenInterface.RiskManagementInit riskManagement, uint256 reserveFactorMantissa_) external
```

#### Parameters

| Name                          | Type                                      | Description                                                          |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| underlying\_                  | address                                   | The address of the underlying asset                                  |
| comptroller\_                 | contract ComptrollerInterface             | The address of the Comptroller                                       |
| interestRateModel\_           | contract InterestRateModel                | The address of the interest rate model                               |
| initialExchangeRateMantissa\_ | uint256                                   | The initial exchange rate, scaled by 1e18                            |
| name\_                        | string                                    | ERC-20 name of this token                                            |
| symbol\_                      | string                                    | ERC-20 symbol of this token                                          |
| decimals\_                    | uint8                                     | ERC-20 decimal precision of this token                               |
| admin\_                       | address                                   | Address of the administrator of this token                           |
| accessControlManager\_        | address                                   | AccessControlManager contract address                                |
| riskManagement                | struct VTokenInterface.RiskManagementInit | Addresses of risk & income related contracts                         |
| reserveFactorMantissa\_       | uint256                                   | Percentage of borrow interest that goes to reserves (from 0 to 1e18) |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when admin address is zero
- ZeroAddressNotAllowed is thrown when shortfall contract address is zero
- ZeroAddressNotAllowed is thrown when protocol share reserve address is zero

---

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

| Name | Type | Description                                               |
| ---- | ---- | --------------------------------------------------------- |
| [0]  | bool | success True if the transfer succeeded, reverts otherwise |

#### 📅 Events

- Emits Transfer event on success

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- TransferNotAllowed is thrown if trying to transfer to self

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

| Name | Type | Description                                               |
| ---- | ---- | --------------------------------------------------------- |
| [0]  | bool | success True if the transfer succeeded, reverts otherwise |

#### 📅 Events

- Emits Transfer event on success

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- TransferNotAllowed is thrown if trying to transfer to self

---

### approve

Approve `spender` to transfer up to `amount` from `src`

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

#### Parameters

| Name    | Type    | Description                                                         |
| ------- | ------- | ------------------------------------------------------------------- |
| spender | address | The address of the account which may transfer tokens                |
| amount  | uint256 | The number of tokens that are approved (uint256.max means infinite) |

#### Return Values

| Name | Type | Description                                   |
| ---- | ---- | --------------------------------------------- |
| [0]  | bool | success Whether or not the approval succeeded |

#### 📅 Events

- Emits Approval event

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when spender address is zero

---

### increaseAllowance

Increase approval for `spender`

```solidity
function increaseAllowance(address spender, uint256 addedValue) external returns (bool)
```

#### Parameters

| Name       | Type    | Description                                          |
| ---------- | ------- | ---------------------------------------------------- |
| spender    | address | The address of the account which may transfer tokens |
| addedValue | uint256 | The number of additional tokens spender can transfer |

#### Return Values

| Name | Type | Description                                   |
| ---- | ---- | --------------------------------------------- |
| [0]  | bool | success Whether or not the approval succeeded |

#### 📅 Events

- Emits Approval event

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when spender address is zero

---

### decreaseAllowance

Decreases approval for `spender`

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool)
```

#### Parameters

| Name            | Type    | Description                                          |
| --------------- | ------- | ---------------------------------------------------- |
| spender         | address | The address of the account which may transfer tokens |
| subtractedValue | uint256 | The number of tokens to remove from total approval   |

#### Return Values

| Name | Type | Description                                   |
| ---- | ---- | --------------------------------------------- |
| [0]  | bool | success Whether or not the approval succeeded |

#### 📅 Events

- Emits Approval event

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when spender address is zero

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

| Name | Type    | Description                                      |
| ---- | ------- | ------------------------------------------------ |
| [0]  | uint256 | amount The amount of underlying owned by `owner` |

---

### totalBorrowsCurrent

Returns the current total borrows plus accrued interest

```solidity
function totalBorrowsCurrent() external returns (uint256)
```

#### Return Values

| Name | Type    | Description                                  |
| ---- | ------- | -------------------------------------------- |
| [0]  | uint256 | totalBorrows The total borrows with interest |

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

| Name | Type    | Description                          |
| ---- | ------- | ------------------------------------ |
| [0]  | uint256 | borrowBalance The calculated balance |

---

### mint

Sender supplies assets into the market and receives vTokens in exchange

```solidity
function mint(uint256 mintAmount) external returns (uint256)
```

#### Parameters

| Name       | Type    | Description                                  |
| ---------- | ------- | -------------------------------------------- |
| mintAmount | uint256 | The amount of the underlying asset to supply |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits Mint and Transfer events; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

---

### mintBehalf

Sender calls on-behalf of minter. minter supplies assets into the market and receives vTokens in exchange

```solidity
function mintBehalf(address minter, uint256 mintAmount) external returns (uint256)
```

#### Parameters

| Name       | Type    | Description                                  |
| ---------- | ------- | -------------------------------------------- |
| minter     | address | User whom the supply will be attributed to   |
| mintAmount | uint256 | The amount of the underlying asset to supply |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits Mint and Transfer events; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when minter address is zero

---

### redeem

Sender redeems vTokens in exchange for the underlying asset

```solidity
function redeem(uint256 redeemTokens) external returns (uint256)
```

#### Parameters

| Name         | Type    | Description                                     |
| ------------ | ------- | ----------------------------------------------- |
| redeemTokens | uint256 | The number of vTokens to redeem into underlying |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits Redeem and Transfer events; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- RedeemTransferOutNotPossible is thrown when the protocol has insufficient cash

---

### redeemUnderlying

Sender redeems vTokens in exchange for a specified amount of underlying asset

```solidity
function redeemUnderlying(uint256 redeemAmount) external returns (uint256)
```

#### Parameters

| Name         | Type    | Description                                                |
| ------------ | ------- | ---------------------------------------------------------- |
| redeemAmount | uint256 | The amount of underlying to receive from redeeming vTokens |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

---

### borrow

Sender borrows assets from the protocol to their own address

```solidity
function borrow(uint256 borrowAmount) external returns (uint256)
```

#### Parameters

| Name         | Type    | Description                                  |
| ------------ | ------- | -------------------------------------------- |
| borrowAmount | uint256 | The amount of the underlying asset to borrow |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits Borrow event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- BorrowCashNotAvailable is thrown when the protocol has insufficient cash

---

### repayBorrow

Sender repays their own borrow

```solidity
function repayBorrow(uint256 repayAmount) external returns (uint256)
```

#### Parameters

| Name        | Type    | Description                                                               |
| ----------- | ------- | ------------------------------------------------------------------------- |
| repayAmount | uint256 | The amount to repay, or type(uint256).max for the full outstanding amount |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits RepayBorrow event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

---

### repayBorrowBehalf

Sender repays a borrow belonging to borrower

```solidity
function repayBorrowBehalf(address borrower, uint256 repayAmount) external returns (uint256)
```

#### Parameters

| Name        | Type    | Description                                                               |
| ----------- | ------- | ------------------------------------------------------------------------- |
| borrower    | address | the account with the debt being payed off                                 |
| repayAmount | uint256 | The amount to repay, or type(uint256).max for the full outstanding amount |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits RepayBorrow event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

---

### liquidateBorrow

The sender liquidates the borrowers collateral.
The collateral seized is transferred to the liquidator.

```solidity
function liquidateBorrow(address borrower, uint256 repayAmount, contract VTokenInterface vTokenCollateral) external returns (uint256)
```

#### Parameters

| Name             | Type                     | Description                                               |
| ---------------- | ------------------------ | --------------------------------------------------------- |
| borrower         | address                  | The borrower of this vToken to be liquidated              |
| repayAmount      | uint256                  | The amount of the underlying borrowed asset to repay      |
| vTokenCollateral | contract VTokenInterface | The market in which to seize collateral from the borrower |

#### Return Values

| Name | Type    | Description                                                     |
| ---- | ------- | --------------------------------------------------------------- |
| [0]  | uint256 | error Always NO_ERROR for compatibility with Venus core tooling |

#### 📅 Events

- Emits LiquidateBorrow event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- LiquidateAccrueCollateralInterestFailed is thrown when it is not possible to accrue interest on the collateral vToken
- LiquidateCollateralFreshnessCheck is thrown when interest has not been accrued on the collateral vToken
- LiquidateLiquidatorIsBorrower is thrown when trying to liquidate self
- LiquidateCloseAmountIsZero is thrown when repayment amount is zero
- LiquidateCloseAmountIsUintMax is thrown when repayment amount is UINT_MAX

---

### setProtocolSeizeShare

sets protocol share accumulated from liquidations

```solidity
function setProtocolSeizeShare(uint256 newProtocolSeizeShareMantissa_) external
```

#### Parameters

| Name                            | Type    | Description                 |
| ------------------------------- | ------- | --------------------------- |
| newProtocolSeizeShareMantissa\_ | uint256 | new protocol share mantissa |

#### 📅 Events

- Emits NewProtocolSeizeShare event on success

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

#### ❌ Errors

- Unauthorized error is thrown when the call is not authorized by AccessControlManager
- ProtocolSeizeShareTooBig is thrown when the new seize share is too high

---

### setReserveFactor

accrues interest and sets a new reserve factor for the protocol using \_setReserveFactorFresh

```solidity
function setReserveFactor(uint256 newReserveFactorMantissa) external
```

#### Parameters

| Name                     | Type    | Description                         |
| ------------------------ | ------- | ----------------------------------- |
| newReserveFactorMantissa | uint256 | New reserve factor (from 0 to 1e18) |

#### 📅 Events

- Emits NewReserveFactor event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

#### ❌ Errors

- Unauthorized error is thrown when the call is not authorized by AccessControlManager
- SetReserveFactorBoundsCheck is thrown when the new reserve factor is too high

---

### reduceReserves

Accrues interest and reduces reserves by transferring to the protocol reserve contract

```solidity
function reduceReserves(uint256 reduceAmount) external
```

#### Parameters

| Name         | Type    | Description                     |
| ------------ | ------- | ------------------------------- |
| reduceAmount | uint256 | Amount of reduction to reserves |

#### 📅 Events

- Emits ReservesReduced event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- ReduceReservesCashNotAvailable is thrown when the vToken does not have sufficient cash
- ReduceReservesCashValidation is thrown when trying to withdraw more cash than the reserves have

---

### addReserves

The sender adds to reserves.

```solidity
function addReserves(uint256 addAmount) external
```

#### Parameters

| Name      | Type    | Description                                       |
| --------- | ------- | ------------------------------------------------- |
| addAmount | uint256 | The amount of underlying token to add as reserves |

#### 📅 Events

- Emits ReservesAdded event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Not restricted

---

### setInterestRateModel

accrues interest and updates the interest rate model using \_setInterestRateModelFresh

```solidity
function setInterestRateModel(contract InterestRateModel newInterestRateModel) external
```

#### Parameters

| Name                 | Type                       | Description                        |
| -------------------- | -------------------------- | ---------------------------------- |
| newInterestRateModel | contract InterestRateModel | the new interest rate model to use |

#### 📅 Events

- Emits NewMarketInterestRateModel event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Controlled by AccessControlManager

#### ❌ Errors

- Unauthorized error is thrown when the call is not authorized by AccessControlManager

---

### healBorrow

Repays a certain amount of debt, treats the rest of the borrow as bad debt, essentially
"forgiving" the borrower. Healing is a situation that should rarely happen. However, some pools
may list risky assets or be configured improperly – we want to still handle such cases gracefully.
We assume that Comptroller does the seizing, so this function is only available to Comptroller.

```solidity
function healBorrow(address payer, address borrower, uint256 repayAmount) external
```

#### Parameters

| Name        | Type    | Description                 |
| ----------- | ------- | --------------------------- |
| payer       | address | account who repays the debt |
| borrower    | address | account to heal             |
| repayAmount | uint256 | amount to repay             |

#### 📅 Events

- Emits RepayBorrow, BadDebtIncreased events; may emit AccrueInterest

#### ⛔️ Access Requirements

- Only Comptroller

#### ❌ Errors

- HealBorrowUnauthorized is thrown when the request does not come from Comptroller

---

### forceLiquidateBorrow

The extended version of liquidations, callable only by Comptroller. May skip
the close factor check. The collateral seized is transferred to the liquidator.

```solidity
function forceLiquidateBorrow(address liquidator, address borrower, uint256 repayAmount, contract VTokenInterface vTokenCollateral, bool skipLiquidityCheck) external
```

#### Parameters

| Name               | Type                     | Description                                                                                      |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------ |
| liquidator         | address                  | The address repaying the borrow and seizing collateral                                           |
| borrower           | address                  | The borrower of this vToken to be liquidated                                                     |
| repayAmount        | uint256                  | The amount of the underlying borrowed asset to repay                                             |
| vTokenCollateral   | contract VTokenInterface | The market in which to seize collateral from the borrower                                        |
| skipLiquidityCheck | bool                     | If set to true, allows to liquidate up to 100% of the borrow regardless of the account liquidity |

#### 📅 Events

- Emits LiquidateBorrow event; may emit AccrueInterest

#### ⛔️ Access Requirements

- Only Comptroller

#### ❌ Errors

- ForceLiquidateBorrowUnauthorized is thrown when the request does not come from Comptroller
- LiquidateAccrueCollateralInterestFailed is thrown when it is not possible to accrue interest on the collateral vToken
- LiquidateCollateralFreshnessCheck is thrown when interest has not been accrued on the collateral vToken
- LiquidateLiquidatorIsBorrower is thrown when trying to liquidate self
- LiquidateCloseAmountIsZero is thrown when repayment amount is zero
- LiquidateCloseAmountIsUintMax is thrown when repayment amount is UINT_MAX

---

### seize

Transfers collateral tokens (this market) to the liquidator.

```solidity
function seize(address liquidator, address borrower, uint256 seizeTokens) external
```

#### Parameters

| Name        | Type    | Description                             |
| ----------- | ------- | --------------------------------------- |
| liquidator  | address | The account receiving seized collateral |
| borrower    | address | The account having collateral seized    |
| seizeTokens | uint256 | The number of vTokens to seize          |

#### 📅 Events

- Emits Transfer, ReservesAdded events

#### ⛔️ Access Requirements

- Not restricted

#### ❌ Errors

- LiquidateSeizeLiquidatorIsBorrower is thrown when trying to liquidate self

---

### badDebtRecovered

Updates bad debt

```solidity
function badDebtRecovered(uint256 recoveredAmount_) external
```

#### Parameters

| Name              | Type    | Description                      |
| ----------------- | ------- | -------------------------------- |
| recoveredAmount\_ | uint256 | The amount of bad debt recovered |

#### 📅 Events

- Emits BadDebtRecovered event

#### ⛔️ Access Requirements

- Only Shortfall contract

---

### setProtocolShareReserve

Sets protocol share reserve contract address

```solidity
function setProtocolShareReserve(address payable protocolShareReserve_) external
```

#### Parameters

| Name                   | Type            | Description                                        |
| ---------------------- | --------------- | -------------------------------------------------- |
| protocolShareReserve\_ | address payable | The address of the protocol share reserve contract |

#### ⛔️ Access Requirements

- Only Governance

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when protocol share reserve address is zero

---

### setShortfallContract

Sets shortfall contract address

```solidity
function setShortfallContract(address shortfall_) external
```

#### Parameters

| Name        | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| shortfall\_ | address | The address of the shortfall contract |

#### ⛔️ Access Requirements

- Only Governance

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when shortfall contract address is zero

---

### sweepToken

A public function to sweep accidental ERC-20 transfers to this contract. Tokens are sent to admin (timelock)

```solidity
function sweepToken(contract IERC20Upgradeable token) external
```

#### Parameters

| Name  | Type                       | Description                              |
| ----- | -------------------------- | ---------------------------------------- |
| token | contract IERC20Upgradeable | The address of the ERC-20 token to sweep |

#### ⛔️ Access Requirements

- Only Governance

---

### setReduceReservesBlockDelta

A public function to set new threshold of block difference after which funds will be sent to the protocol share reserve

```solidity
function setReduceReservesBlockDelta(uint256 _newReduceReservesBlockDelta) external
```

#### Parameters

| Name                          | Type    | Description            |
| ----------------------------- | ------- | ---------------------- |
| \_newReduceReservesBlockDelta | uint256 | block difference value |

#### ⛔️ Access Requirements

- Only Governance

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

| Name | Type    | Description                                                                        |
| ---- | ------- | ---------------------------------------------------------------------------------- |
| [0]  | uint256 | amount The number of tokens allowed to be spent (type(uint256).max means infinite) |

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

| Name | Type    | Description                                  |
| ---- | ------- | -------------------------------------------- |
| [0]  | uint256 | amount The number of tokens owned by `owner` |

---

### getAccountSnapshot

Get a snapshot of the account's balances, and the cached exchange rate

```solidity
function getAccountSnapshot(address account) external view returns (uint256 error, uint256 vTokenBalance, uint256 borrowBalance, uint256 exchangeRate)
```

#### Parameters

| Name    | Type    | Description                        |
| ------- | ------- | ---------------------------------- |
| account | address | Address of the account to snapshot |

#### Return Values

| Name          | Type    | Description                                               |
| ------------- | ------- | --------------------------------------------------------- |
| error         | uint256 | Always NO_ERROR for compatibility with Venus core tooling |
| vTokenBalance | uint256 | User's balance of vTokens                                 |
| borrowBalance | uint256 | Amount owed in terms of underlying                        |
| exchangeRate  | uint256 | Stored exchange rate                                      |

---

### getCash

Get cash balance of this vToken in the underlying asset

```solidity
function getCash() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                                  |
| ---- | ------- | ------------------------------------------------------------ |
| [0]  | uint256 | cash The quantity of underlying asset owned by this contract |

---

### borrowRatePerBlock

Returns the current per-block borrow interest rate for this vToken

```solidity
function borrowRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                             |
| ---- | ------- | ------------------------------------------------------- |
| [0]  | uint256 | rate The borrow interest rate per block, scaled by 1e18 |

---

### supplyRatePerBlock

Returns the current per-block supply interest rate for this v

```solidity
function supplyRatePerBlock() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                             |
| ---- | ------- | ------------------------------------------------------- |
| [0]  | uint256 | rate The supply interest rate per block, scaled by 1e18 |

---

### borrowBalanceStored

Return the borrow balance of account based on stored data

```solidity
function borrowBalanceStored(address account) external view returns (uint256)
```

#### Parameters

| Name    | Type    | Description                                    |
| ------- | ------- | ---------------------------------------------- |
| account | address | The address whose balance should be calculated |

#### Return Values

| Name | Type    | Description                          |
| ---- | ------- | ------------------------------------ |
| [0]  | uint256 | borrowBalance The calculated balance |

---

### exchangeRateStored

Calculates the exchange rate from the underlying to the VToken

```solidity
function exchangeRateStored() external view returns (uint256)
```

#### Return Values

| Name | Type    | Description                                          |
| ---- | ------- | ---------------------------------------------------- |
| [0]  | uint256 | exchangeRate Calculated exchange rate scaled by 1e18 |

---

### exchangeRateCurrent

Accrue interest then return the up-to-date exchange rate

```solidity
function exchangeRateCurrent() public returns (uint256)
```

#### Return Values

| Name | Type    | Description                                          |
| ---- | ------- | ---------------------------------------------------- |
| [0]  | uint256 | exchangeRate Calculated exchange rate scaled by 1e18 |

---

### accrueInterest

Applies accrued interest to total borrows and reserves

```solidity
function accrueInterest() public virtual returns (uint256)
```

#### Return Values

| Name | Type    | Description     |
| ---- | ------- | --------------- |
| [0]  | uint256 | Always NO_ERROR |

#### 📅 Events

- Emits AccrueInterest event on success

#### ⛔️ Access Requirements

- Not restricted

---
