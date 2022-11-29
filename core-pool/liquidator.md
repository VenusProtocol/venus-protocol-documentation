# Liquidator

The Liquidator contract is the only publicly accessible interface for liquidations in the core pool and was introduced in [VIP-64](https://app.venus.io/governance/proposal/64) so that the protocol could capture a part of the liquidation revenue. It has a unified interface for VAI, BNB and BEP-20 token liquidations.

# Solidity API

## Storage

### vBnb

```solidity
contract IVBNB vBnb
```

Address of vBNB contract.

### comptroller

```solidity
contract IComptroller comptroller
```

Address of Venus Unitroller contract.

### vaiController

```solidity
contract IVAIController vaiController
```

Address of VAIUnitroller contract.

### treasury

```solidity
address treasury
```

Address of Venus Treasury.

### treasuryPercentMantissa

```solidity
uint256 treasuryPercentMantissa
```

Percent of seized amount that goes to treasury.

### allowedLiquidatorsByAccount

```solidity
mapping(address => mapping(address => bool)) allowedLiquidatorsByAccount
```

Mapping of addresses allowed to liquidate an account if liquidationRestricted[borrower] == true

### liquidationRestricted

```solidity
mapping(address => bool) liquidationRestricted
```

Whether the liquidations are restricted to enabled allowedLiquidatorsByAccount addresses only

### NewLiquidationTreasuryPercent

```solidity
event NewLiquidationTreasuryPercent(uint256 oldPercent, uint256 newPercent)
```

Emitted when the percent of the seized amount that goes to treasury changes.

### LiquidateBorrowedTokens

```solidity
event LiquidateBorrowedTokens(address liquidator, address borrower, uint256 repayAmount, address vTokenBorrowed, address vTokenCollateral, uint256 seizeTokensForTreasury, uint256 seizeTokensForLiquidator)
```

Emitted when a borrow is liquidated

### LiquidationRestricted

```solidity
event LiquidationRestricted(address borrower)
```

Emitted when the liquidation is restricted for a borrower

### LiquidationRestrictionsDisabled

```solidity
event LiquidationRestrictionsDisabled(address borrower)
```

Emitted when the liquidation restrictions are removed for a borrower

### AllowlistEntryAdded

```solidity
event AllowlistEntryAdded(address borrower, address liquidator)
```

Emitted when a liquidator is added to the allowedLiquidatorsByAccount mapping

### AllowlistEntryRemoved

```solidity
event AllowlistEntryRemoved(address borrower, address liquidator)
```

Emitted when a liquidator is removed from the allowedLiquidatorsByAccount mapping

### LiquidationNotAllowed

```solidity
error LiquidationNotAllowed(address borrower, address liquidator)
```

Thrown if the liquidation is restricted and the liquidator is not in the allowedLiquidatorsByAccount mapping

### VTokenTransferFailed

```solidity
error VTokenTransferFailed(address from, address to, uint256 amount)
```

Thrown if VToken transfer fails after the liquidation

### LiquidationFailed

```solidity
error LiquidationFailed(uint256 errorCode)
```

Thrown if the liquidation is not successful (the error code is from TokenErrorReporter)

### AlreadyRestricted

```solidity
error AlreadyRestricted(address borrower)
```

Thrown if trying to restrict liquidations for an already restricted borrower

### NoRestrictionsExist

```solidity
error NoRestrictionsExist(address borrower)
```

Thrown if trying to unrestrict liquidations for a borrower that is not restricted

### AlreadyAllowed

```solidity
error AlreadyAllowed(address borrower, address liquidator)
```

Thrown if the liquidator is already in the allowedLiquidatorsByAccount mapping

### AllowlistEntryNotFound

```solidity
error AllowlistEntryNotFound(address borrower, address liquidator)
```

Thrown if trying to remove a liquidator that is not in the allowedLiquidatorsByAccount mapping

### WrongTransactionAmount

```solidity
error WrongTransactionAmount(uint256 expected, uint256 actual)
```

Thrown if BNB amount sent with the transaction doesn't correspond to the
        intended BNB repayment

### UnexpectedZeroAddress

```solidity
error UnexpectedZeroAddress()
```

Thrown if the argument is a zero address because probably it is a mistake

### TreasuryPercentTooHigh

```solidity
error TreasuryPercentTooHigh(uint256 maxTreasuryPercentMantissa, uint256 treasuryPercentMantissa_)
```

Thrown if trying to set treasury percent larger than the liquidation profit


## Write functions

### constructor

```solidity
constructor(address comptroller_, address payable vBnb_, address treasury_) public
```

Constructor for the implementation contract. Sets immutable variables.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller_ | address | The address of the Comptroller contract |
| vBnb_ | address payable | The address of the VBNB |
| treasury_ | address | The address of Venus treasury |

### initialize

```solidity
function initialize(uint256 treasuryPercentMantissa_) external virtual
```

Initializer for the implementation contract.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| treasuryPercentMantissa_ | uint256 | Treasury share, scaled by 1e18 (e.g. 0.2 * 1e18 for 20%) |

### __Liquidator_init

```solidity
function __Liquidator_init(uint256 treasuryPercentMantissa_) internal
```

{% hint style="info" %}
Liquidator initializer for derived contracts.
{% endhint %}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| treasuryPercentMantissa_ | uint256 | Treasury share, scaled by 1e18 (e.g. 0.2 * 1e18 for 20%) |

### __Liquidator_init_unchained

```solidity
function __Liquidator_init_unchained(uint256 treasuryPercentMantissa_) internal
```

{% hint style="info" %}
Liquidator initializer for derived contracts that doesn't call parent initializers.
{% endhint %}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| treasuryPercentMantissa_ | uint256 | Treasury share, scaled by 1e18 (e.g. 0.2 * 1e18 for 20%) |

### restrictLiquidation

```solidity
function restrictLiquidation(address borrower) external
```

An admin function to restrict liquidations to allowed addresses only.

{% hint style="info" %}
Use {addTo,removeFrom}AllowList to configure the allowed addresses.
{% endhint %}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |

### unrestrictLiquidation

```solidity
function unrestrictLiquidation(address borrower) external
```

An admin function to remove restrictions for liquidations.

{% hint style="info" %}
Does not impact the allowedLiquidatorsByAccount mapping for the borrower, just turns off the check.
{% endhint %}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |

### addToAllowlist

```solidity
function addToAllowlist(address borrower, address liquidator) external
```

An admin function to add the liquidator to the allowedLiquidatorsByAccount mapping for a certain
        borrower. If the liquidations are restricted, only liquidators from the
        allowedLiquidatorsByAccount mapping can participate in liquidating the positions of this borrower.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |
| liquidator | address |  |

### removeFromAllowlist

```solidity
function removeFromAllowlist(address borrower, address liquidator) external
```

An admin function to remove the liquidator from the allowedLiquidatorsByAccount mapping of a certain
        borrower. If the liquidations are restricted, this liquidator will not be
        able to liquidate the positions of this borrower.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |
| liquidator | address |  |

### liquidateBorrow

```solidity
function liquidateBorrow(address vToken, address borrower, uint256 repayAmount, contract IVToken vTokenCollateral) external payable
```

Liquidates a borrow and splits the seized amount between treasury and
        liquidator. The liquidators should use this interface instead of calling
        vToken.liquidateBorrow(...) directly. Reverts on errors.

{% hint style="info" %}
For BNB borrows `msg.value` must be equal to repayAmount. For all other borrows msg.value must be zero.
{% endhint %}

{% hint style="info" %}
To use this function, the liquidating account has to `approve` the underlying asset to Liquidator (unless the underlying asset is BNB).
{% endhint %}


#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Borrowed vToken |
| borrower | address | The address of the borrower |
| repayAmount | uint256 | The amount to repay on behalf of the borrower |
| vTokenCollateral | contract IVToken | The collateral to seize |

### setTreasuryPercent

```solidity
function setTreasuryPercent(uint256 newTreasuryPercentMantissa) external
```

Sets the new percent of the seized amount that goes to treasury. Should
        be less than or equal to comptroller.liquidationIncentiveMantissa().sub(1e18).


{% hint style="info" %}
Only callable by the admin (Governance).
{% endhint %}

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newTreasuryPercentMantissa | uint256 | New treasury percent (scaled by 10^18). |

### _liquidateBep20

```solidity
function _liquidateBep20(contract IVBep20 vToken, address borrower, uint256 repayAmount, contract IVToken vTokenCollateral) internal
```

{% hint style="info" %}
Transfers BEP20 tokens to self, then approves vToken to take these tokens.
{% endhint %}

### _liquidateVAI

```solidity
function _liquidateVAI(address borrower, uint256 repayAmount, contract IVToken vTokenCollateral) internal
```

{% hint style="info" %}
Transfers BEP20 tokens to self, then approves VAI to take these tokens.
{% endhint %}

### _distributeLiquidationIncentive

```solidity
function _distributeLiquidationIncentive(contract IVToken vTokenCollateral, uint256 siezedAmount) internal returns (uint256 ours, uint256 theirs)
```

{% hint style="info" %}
Splits the received vTokens between the liquidator and treasury.
{% endhint %}

### _transferBep20

```solidity
function _transferBep20(contract IERC20Upgradeable token, address from, address to, uint256 amount) internal returns (uint256 actualAmount)
```

{% hint style="info" %}
Transfers tokens and returns the actual transfer amount
{% endhint %}

### _splitLiquidationIncentive

```solidity
function _splitLiquidationIncentive(uint256 seizedAmount) internal view returns (uint256 ours, uint256 theirs)
```

{% hint style="info" %}
Computes the amounts that would go to treasury and to the liquidator.
{% endhint %}

