# VAI

### Overview

VAI is the primary stablecoin of the Venus Protocol. It is carefully designed and integrated with a series of stability mechanisms to maintain its peg to 1 USD.&#x20;

### Stability Fee and Optimised Minting

VAI sustains its value via a stability fee system. This fee is a charge that users incur when they repay their minted VAI. Calculated on a block-by-block basis, this fee gets added to the user's minted VAI balance. This fee system encourages users to either mint or burn VAI in response to its price fluctuations, thereby contributing to its stability.

The stability fee is determined through the following formula:

$$
\text{{stabilityFee}}(\%) = \text{{baseRate}}(\%) + \max(0, (1 - \text{{currentPriceOfVAI}})) \times \text{{floatingRate}}(\%)
$$

The `baseRate` is a fixed rate that users must always pay, while `max(0, (1 - currentPriceOfVAI)) * floatingRate` is a variable rate that users pay based on outstanding VAI. This incentivizes users to burn or mint VAI according to its price. The variable rate will always be greater or equal to zero, meaning the minimum stability fee will be the base rate.

Revenue generated from the stability fee serves as a financial cushion during extreme market conditions, such as bad debt scenarios.
