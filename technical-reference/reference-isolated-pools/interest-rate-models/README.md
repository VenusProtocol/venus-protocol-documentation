# Interest Rate Models

Every VToken stores its own `interestRateModel()` address. Markets on the same network or in the same pool can use different model families and parameters, so never select a model from the network name alone.

The v4.4.0 engine source contains three implementations:

| Model | Curve | Parameters mutable after deployment? |
|---|---|---|
| [`JumpRateModelV2`](jump-rate-model-v2.md) | one kink | yes, through AccessControlManager |
| [`TwoKinksInterestRateModel`](two-kinks-interest-rate-model.md) | two kinks, signed slopes | no; constructor immutables |
| [`WhitePaperInterestRateModel`](white-paper-interest-rate-model.md) | one linear slope | no; constructor immutables |

`BaseJumpRateModelV2` is not a separate contract in the current source. The old page is retained only to route existing links to `JumpRateModelV2`.

## Units and annualization

The shared interface returns a mantissa-scaled rate **per slot**. A slot is either a block or one second, according to the deployed model's `isTimeBased()` value. Read `blocksOrSecondsPerYear()` from that same model before annualizing.

```text
nominal annual rate = rate per slot × blocksOrSecondsPerYear
```

Do not assume `2,628,000` blocks/year or `31,536,000` seconds/year globally. In particular, the live BNB Chain and opBNB VToken implementations use different block constants; the [engine version map](../README.md) records their current values.

## Selecting the model for a market

1. Start from the market's VToken address in the [deployed markets registry](../../../deployed-contracts/markets.md).
2. Read `interestRateModel()` from the VToken at the block used by your calculation.
3. Identify the model bytecode or verified source, then read its clock mode and parameters.
4. Preserve the effective block when recording a mutable `JumpRateModelV2` parameter set.

The formulas and current ABI below follow the [`isolated-pools` v4.4.0 source](https://github.com/VenusProtocol/isolated-pools/tree/v4.4.0/contracts).
