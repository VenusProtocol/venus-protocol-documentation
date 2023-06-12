# Stable Rate Borrowing

### Overview

Venus Protocol introduces Stable Rate Borrowing, a feature that provides predictability in the interest rates akin to traditional finance offerings. This new feature is a departure from the prior model where interest rates were determined by the liquidity and demand for an asset, leading to potentially dramatic fluctuations.

Stable rate borrowing, in contrast to variable rate borrowing, offers more consistency as it's less affected by individual user actions. While it might still adjust based on significant market fluctuations, it generally provides a more stable interest rate environment.

### Stable Rate Calculation

The calculations for stable rate borrowing rely on two primary metrics: the **utilization rate (u)** and the **stable loan adoption rate (stable_loan_wt).** These rates consider several variables, such as total borrow and total supply.

At any given point in time (t), these rates are calculated as follows:

$$
u_t = \frac{{\text{{total\_borrow}}_{t}^{\text{{StableRate}}} + \text{{total\_borrow}}_{t}^{\text{{VariableRate}}}}}{{\text{{total\_supply}}_t}}
$$

$$
\text{{stable\_loan\_wt}}_t = \frac{{\text{{total\_borrow}}_{t}^{\text{{StableRate}}}}}{{\text{{total\_borrow}}_{t}^{\text{{StableRate}}} + \text{{total\_borrow}}_{t}^{\text{{VariableRate}}}}}
$$

### Stable Rate Rebalancing

The stable borrowing rate remains fixed until certain rebalancing conditions are met. These conditions include scenarios when the utilization rate exceeds a certain threshold and the average market borrow rate drops below a calculated variable borrow rate.

For instance, if we set a rebalance threshold of 90% for the utilization rate and a rate fraction threshold of 0.5 for rebalancing, the conditions for rebalancing would be as follows:

- When the utilization rate exceeds 90%, and
- The average market borrow rate drops below half the variable borrow rate at 90% utilization.

It's worth noting that while the stable rate offers predictability, it often comes at a slightly higher interest rate compared to the variable rate. Nevertheless, it provides users with the ability to predict their expenses and hedge their investments with a higher degree of certainty.
