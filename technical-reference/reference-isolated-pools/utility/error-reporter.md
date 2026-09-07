# TokenErrorReporter

This reference matches [`TokenErrorReporter` in `isolated-pools` v4.4.0](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/ErrorReporter.sol). It defines the legacy success code and custom errors inherited by that source generation's `VToken` implementation.

{% hint style="warning" %}
Decode a revert with the ABI for the implementation behind the selected VToken beacon or proxy. Error names and selectors can differ across deployed generations; this page does not prove that every listed error is reachable at every market.
{% endhint %}

## Solidity API

### NO_ERROR

Legacy success code retained for compatibility.

```solidity
uint256 public constant NO_ERROR = 0
```

### TransferNotAllowed

```solidity
error TransferNotAllowed()
```

### MintFreshnessCheck

```solidity
error MintFreshnessCheck()
```

### RedeemFreshnessCheck

```solidity
error RedeemFreshnessCheck()
```

### RedeemTransferOutNotPossible

```solidity
error RedeemTransferOutNotPossible()
```

### BorrowFreshnessCheck

```solidity
error BorrowFreshnessCheck()
```

### BorrowCashNotAvailable

```solidity
error BorrowCashNotAvailable()
```

### DelegateNotApproved

```solidity
error DelegateNotApproved()
```

### RepayBorrowFreshnessCheck

```solidity
error RepayBorrowFreshnessCheck()
```

### HealBorrowUnauthorized

```solidity
error HealBorrowUnauthorized()
```

### ForceLiquidateBorrowUnauthorized

```solidity
error ForceLiquidateBorrowUnauthorized()
```

### LiquidateFreshnessCheck

```solidity
error LiquidateFreshnessCheck()
```

### LiquidateCollateralFreshnessCheck

```solidity
error LiquidateCollateralFreshnessCheck()
```

### LiquidateAccrueCollateralInterestFailed

```solidity
error LiquidateAccrueCollateralInterestFailed(uint256 errorCode)
```

### LiquidateLiquidatorIsBorrower

```solidity
error LiquidateLiquidatorIsBorrower()
```

### LiquidateCloseAmountIsZero

```solidity
error LiquidateCloseAmountIsZero()
```

### LiquidateCloseAmountIsUintMax

```solidity
error LiquidateCloseAmountIsUintMax()
```

### LiquidateSeizeLiquidatorIsBorrower

```solidity
error LiquidateSeizeLiquidatorIsBorrower()
```

### ProtocolSeizeShareTooBig

```solidity
error ProtocolSeizeShareTooBig()
```

### SetReserveFactorFreshCheck

```solidity
error SetReserveFactorFreshCheck()
```

### SetReserveFactorBoundsCheck

```solidity
error SetReserveFactorBoundsCheck()
```

### AddReservesFactorFreshCheck

```solidity
error AddReservesFactorFreshCheck(uint256 actualAddAmount)
```

### ReduceReservesFreshCheck

```solidity
error ReduceReservesFreshCheck()
```

### ReduceReservesCashNotAvailable

```solidity
error ReduceReservesCashNotAvailable()
```

### ReduceReservesCashValidation

```solidity
error ReduceReservesCashValidation()
```

### SetInterestRateModelFreshCheck

```solidity
error SetInterestRateModelFreshCheck()
```
