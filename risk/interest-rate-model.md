# Interest Rate Model

### Overview

Venus Protocol offers variable interest rates for markets using two different models: the Jump Rate Model and the Whitepaper Rate Model. Each market operates under one of these models with specifically set risk parameters at the market's inception. Notably, the community can update these parameters through the Governance process. Moreover, some markets feature a stable rate, introduced in Venus V4.

#### **Jump Rate Model**

The Jump Rate Model uses the following formulas to calculate the interest:

For Borrow rate:&#x20;

$$
borrow\_rate (u) = b + a\_1 \cdot kink + a\_1 \cdot \min(0, u-kink) + a\_2 \cdot \max(0,u-kink)
$$

And, for Supply rate:

$$
supply\_rate(u) = borrow\_rate(u) \cdot u\_s \cdot (1 - reserve\_factor)
$$

Where,

$$
u\_s = \frac{borrows}{cash + borrows - reserves + badDebt}
$$

Take note that `a_2 > a_1` and `0 \leq kink \leq 1`.

The borrow rate employs different formulas when the utilization rate falls into two distinct ranges:

If `u < kink`:

$$
borrow\_rate(u) = a\_1 \cdot u + b
$$

If `u > kink`:

$$
borrow\_rate(u) = a\_1 \cdot kink + a\_2 \cdot (u-kink) + b
$$

**Model Parameters**

* `a_1`: Variable interest rate slope1.
* `a_2`: Variable interest rate slope2.
* `b`: Base rate per block (`baseRatePerYear / blocksPerYear`).
* `kink`: Optimal utilization rate, at which the variable interest rate slope shifts from slope1 to slope2.
* `reserve_factor`: Part of interest income withdrawn from the protocol, i.e., not distributed to suppliers.

The utilization rate (`u`) is defined as:

$$
utilization\_rate = \frac{(borrows + bad\_debt)}{(cash + borrows + bad\_debt - reserves)}
$$

Where:

* `borrows`: Amount of borrows in the market, in terms of the underlying asset, excluding bad debt.
* `cash`: Total amount of the underlying asset owned by the market at a specific time.
* `reserves`: Amount of the underlying asset owned by the market but unavailable for borrowers or suppliers, reserved for various uses defined by the protocol's tokenomics.
* `bad_debt`: After liquidators repay as much debt as possible, reducing collateral to a minimal amount, the remaining debt is tagged as bad debt. Bad debt doesn’t accrue interest.

#### Whitepaper Rate Model

The Whitepaper Rate Model is simpler, where the borrow rate depends linearly on the utilization:

For Borrow rate:

$$
borrow\_rate (u) = a \cdot u + b
$$

For Supply rate:

$$
supply\_rate(u) = borrow\_rate(u) \cdot u\_s \cdot (1 - reserve\_factor)
$$

Where,

$$
u\_s = \frac{borrows}{cash + borrows - reserves + badDebt}
$$
