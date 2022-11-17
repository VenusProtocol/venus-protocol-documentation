# vtoken

## Introduction

vTokens are the primary means of interacting with the Venus Protocol; when a user mints, redeems, borrows, repays a borrow, liquidates a borrow, or transfers vTokens, she will do so using the vToken contract.

There are currently two types of vTokens: 
1. VBep20
2. VBnb

- Both types expose the EIP-20 interface
- VBep20 wraps an underlying BEP-20 asset
- VBnb simply wraps BNB itself

The implementation of [VBep20](https://github.com/VenusProtocol/venus-protocol/blob/master/contracts/VBep20.sol) inherits the [VToken](https://github.com/VenusProtocol/venus-protocol/blob/master/contracts/VToken.sol) contract as a base. 

The implementation of [VBnb](https://github.com/VenusProtocol/venus-protocol/blob/master/contracts/VBNB.sol) inherits the [VToken](https://github.com/VenusProtocol/venus-protocol/blob/master/contracts/VToken.sol) contract as a base. 


Core functions which involve transferring an asset into the protocol have slightly different interfaces depending on the type which are listed below.


## Details

- VToken actions:

1. Mint
2. Redeem
3. Redeem Underlying
4. Borrow
5. Repay Borrow
6. Repay Borrow Behalf
7. Liquidate Borrow

- View functions and storage values:

1. ExchangeRate
2. Cash
3. Total Borrows
4. Borrow Balance
5. Borrow Rate
6. Total Supply
7. UnderlyingBalance
8. Supply Rate
9. Total Reserves
10. Reserve Factor

# Solidity API

### Mint VToken

The mint function transfers an asset into the protocol, which begins accumulating interest based on the current Supply Rate for The user receives a quantity of vTokens equal to the underlying tokens tokens supplied, divided by the current Exchange Rate.

```solidity
function mint(uint mintAmount) returns (uint)
```
#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| mintAmount | uint | The amount of the asset to be supplied, in units of the underlying asset. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success |


### Mint VToken on-behalf

- The mint-Behalf function is same as mint function but this requires the recipient of the minted vTokens
- Sender supplies assets into the market and receiver receives vTokens in exchange

```solidity
function mintBehalf(address receiver, uint mintAmount) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | receiver the account which is receiving the vTokens |
| mintAmount | uint | The amount of the asset to be supplied, in units of the underlying asset. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Redeem

The redeem function converts a specified quantity of vTokens into the underlying asset, and returns them to the user. The amount of underlying tokens received is equal to the quantity of vTokens redeemed, multiplied by the current Exchange Rate. The amount redeemed must be less than the user's Account Liquidity and the market's available liquidity.

```solidity
function redeem(uint redeemTokens) returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| redeemTokens | uint | The number of vTokens to redeem into underlying |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Redeem Underlying

The redeem underlying function converts vTokens into a specified quantity of the underlying asset, and returns them to the user. The amount of vTokens redeemed is equal to the quantity of underlying tokens received, divided by the current Exchange Rate. The amount redeemed must be less than the user's Account Liquidity and the market's available liquidity.


```solidity
function redeemUnderlying(uint redeemAmount) returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| redeemAmount | uint | The number of vTokens to redeem into underlying |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Borrow

Sender borrows assets from the protocol to their own address
The borrow function transfers an asset from the protocol to the user, and creates a borrow balance which begins accumulating interest based on the Borrow Rate for the asset. The amount borrowed must be less than the user's Account Liquidity and the market's available liquidity.

```solidity
function borrow(uint borrowAmount) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrowAmount | uint |  The amount of the underlying asset to borrow |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |



### Repay Borrow

The repay function transfers an asset into the protocol, reducing the user's borrow balance.
Sender repays a borrow belonging to borrower

```solidity
function repayBorrow(uint repayAmount) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| repayAmount | uint |  The amount of the underlying borrowed asset to be repaid. A value of -1 (i.e. 2^256 - 1) can be used to repay the full amount. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Repay Borrow Behalf

The repay function transfers an asset into the protocol, reducing the user's borrow balance.

- The repay-Behalf function is same as repay function but this requires the borrower address who has borrowed underlying.
- Sender repays a borrow belonging to borrower


```solidity
function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address |  address of the borrower whose borrow-amount is being repaid by sender |
| repayAmount | uint |  The amount of the underlying borrowed asset to be repaid. A value of -1 (i.e. 2^256 - 1) can be used to repay the full amount. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Liquidate Borrow

- A user who has negative account liquidity is subject to liquidation by other users of the protocol to return his/her account liquidity back to positive (i.e. above the collateral requirement). When a liquidation occurs, a liquidator may repay some or all of an outstanding borrow on behalf of a borrower and in return receive a discounted amount of collateral held by the borrower; this discount is defined as the liquidation incentive.

- A liquidator may close up to a certain fixed percentage (i.e. close factor) of any individual outstanding borrow of the underwater account. Unlike in v1, liquidators must interact with each vToken contract in which they wish to repay a borrow and seize another asset as collateral. When collateral is seized, the liquidator is transferred vTokens, which they may redeem the same as if they had supplied the asset themselves. Users must approve each vToken contract before calling liquidate (i.e. on the borrowed asset which they are repaying), as they are transferring funds into the contract.

```solidity
    function liquidateBorrow(address borrower, uint repayAmount, address vTokenCollateral) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address |  address of the borrower whose borrow-amount is being repaid by sender |
| repayAmount | uint |  The amount of the underlying borrowed asset to be repaid. A value of -1 (i.e. 2^256 - 1) can be used to repay the full amount. |
| vTokenCollateral | address | The address of collateral, in which to be seized from the borrower |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |


### Add Reserves

Adds collateral to the reserves.
This function is called when sender want to add underlying or collateral tokens to the reserve of vToken.


```solidity
    function _addReserves(uint addAmount) external returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| addAmount | address | The amount fo underlying token to add as reserves |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | success indicator - 0 on Success otherwise a failure (see ErrorReporter.sol for details) |

### total borrows

Total Borrows is the amount of underlying currently loaned out by the market, and the amount upon which interest is accumulated to suppliers of the market.

```solidity
function totalBorrowsCurrent() external nonReentrant returns (uint)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint |  The total borrows with interest |

### borrow Balance Current

A user who borrows assets from the protocol is subject to accumulated interest based on the current borrow rate. Interest is accumulated every block and integrations may use this function to obtain the current value of a user's borrow balance with interest.


```solidity
function borrowBalanceCurrent(address account) external nonReentrant returns (uint)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address whose balance should be calculated after updating borrowIndex |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint |  The user's current borrow balance (with interest) in units of the underlying asset. |


### Exchange Rate

Each vToken is convertible into an ever increasing quantity of the underlying asset, as interest accrues in the market. The exchange rate between a vToken and the underlying asset is equal to:

```
exchangeRate = (getCash() + totalBorrows() - totalReserves()) / totalSupply()
```

```solidity
function exchangeRateCurrent() public nonReentrant returns (uint)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint |  Calculated exchange rate scaled by 1e18 |


### Get Cash

Cash is the amount of underlying balance owned by this vToken contract. One may query the total amount of cash currently available to this market.

```solidity
function getCash() external view returns (uint)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint |  The quantity of underlying asset owned by this contract |


### Seize Collateral

Transfers collateral tokens (this market) to the liquidator.
Will fail unless called by another vToken during the process of liquidation.
Its absolutely critical to use msg.sender as the borrowed vToken and not a parameter.


```solidity
    function seize(address liquidator, address borrower, uint seizeTokens) external nonReentrant returns (uint)    
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidator | address | The account receiving seized collateral |
| borrower | address | The account having collateral seized |
| seizeTokens | uint | The number of vTokens to seize |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |


### Borrow Rate

At any point in time one may query the contract to get the current borrow rate per block.


```solidity
    function borrowRatePerBlock() external view returns (uint)   
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | The borrow interest rate per block, scaled by 1e18 |

### Supply Rate

At any point in time one may query the contract to get the current supply rate per block. The supply rate is derived from the borrow rate, reserve factor and the amount of total borrows.


```solidity
  function supplyRatePerBlock() external view returns (uint)  
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | The supply interest rate per block, scaled by 1e18 |


### Total Reserves

Reserves are an accounting entry in each vToken contract that represents a portion of historical interest set aside as cash which can be withdrawn or transferred through the protocol's governance. A small portion of borrower interest accrues into the protocol, determined by the reserve factor.

```solidity
function totalReserves() returns (uint)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | The total amount of reserves held in the market. |


### Reserve Factor

The reserve factor defines the portion of borrower interest that is converted into reserves.

```solidity
function reserveFactorMantissa() returns (uint)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint | The current reserve factor as an unsigned integer, scaled by 1e18. |

