# Stable Rate Borrowing

{% hint style="warning" %}
**To be released**
{% endhint %}

### Overview:

Stable Rate Borrowing is a distinctive feature of the Venus Protocol that provides an alternative to variable interest rate loans. Stable-rate loans set their interest rates at issuance until a rebalancing event occurs. This approach shields users who borrow at a stable rate from being affected by individual actions of other users and large fluctuations in the market.

### Rate Determination:

The interest rates for stable and variable rate borrowing are determined based on several calculations involving parameters such as utilization rate, stable loan adoption rate, and total supply. For instance, the stable interest rate will include a base premium plus an additional premium that depends on the stable loan adoption rate.

### Model Parameters:

The model parameters involved in the calculations include slopes for the variable interest rate, a base rate per block, the optimal utilization rate (kink), a reserve factor, base premium, and other parameters related to stable loan borrowing.

### Rebalancing Conditions:

The fixed rate of a stable loan persists until certain rebalancing conditions are met. These conditions involve the utilization rate and the comparison between the market average borrow rate and the variable borrow rate. The stable rate provides predictability for the borrower but may come at a cost of higher interest rates compared to the variable rate.
