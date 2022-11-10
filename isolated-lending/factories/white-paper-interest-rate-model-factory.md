# White Paper Interest Rate Model Factory

A factory for White Paper Interest Rate Model, a simple model where the borrow rate depends linearly on the utilization:

$borrow\_rate(u) = a \cdot u + b$

The parameters of this interest rate model can not be updated after deployment. Pool risk managers need to deploy another interest rate model to change the curve.

## deploy

```solidity
function deploy(
    uint256 baseRatePerYear,
    uint256 multiplierPerYear
) external returns (WhitePaperInterestRateModel)
```



#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `baseRatePerYear` | uint256 | $b$, the base interest rate which is the y-intercept when utilization rate is 0 |
| `multiplierPerYear` | uint256 | $a_1$, the multiplier of utilization rate that gives the slope of the interest rate |
| `jumpMultiplierPerYear` | uint256 | $a_2$, the multiplier of utilization rate after hitting a specified utilization point |
| `kink_` | uint256 | $kink$, the utilization point at which the jump multiplier is applied |
| `owner_` | address | the address that can adjust the interest rate model parameters |
