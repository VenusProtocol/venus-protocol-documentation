# Jump Rate Model Factory

A factory for Jump Rate Model, an interest rate model with a steep increase after a certain utilization threshold called `kink` is reached. This rate model uses the following formula for the borrow rate:

* $borrow\_rate(u)=a_1 \cdot u + b$, when $u<kink$
* $borrow\_rate(u)=a_1 \cdot kink + a_2  \cdot (u-kink) + b$, otherwise

The parameters of this interest rate model can be adjusted by the owner.

## deploy

```solidity
function deploy(
    uint256 baseRatePerYear,
    uint256 multiplierPerYear,
    uint256 jumpMultiplierPerYear,
    uint256 kink_,
    address owner_
) external returns (JumpRateModelV2)
```

Deploys a new Jump Rate Model.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `baseRatePerYear` | uint256 | $b$, the base interest rate which is the y-intercept when utilization rate is 0 |
| `multiplierPerYear` | uint256 | $a_1$, the multiplier of utilization rate that gives the slope of the interest rate |
| `jumpMultiplierPerYear` | uint256 | $a_2$, the multiplier of utilization rate after hitting a specified utilization point |
| `kink_` | uint256 | $kink$, the utilization point at which the jump multiplier is applied |
| `owner_` | address | the address that can adjust the interest rate model parameters |
