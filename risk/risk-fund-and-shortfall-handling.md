# Risk Fund and Shortfall Handling

{% hint style="warning" %}
**To be released**
{% endhint %}

### **Overview**

Venus Protocol manages risks of high volatility tokens with isolated pools. Each pool has an associated risk fund receiving 40% of the pool's income (interest and liquidation bonus) in USDT to prevent insolvency. The risk fund also covers bad debt in case of bankruptcy without a liquidator.

### **Protocol Share Reserve**

The Protocol Share Reserve is a common treasury for all isolated pools, collecting income from accrued interest and the liquidation of accounts.

### **Bad Debt and Shortfall Handling**

When a borrower's shortfall is detected, Venus halts the interest accrual, writes off the borrower's balance, and tracks the bad debt.

Once the bad debt reaches a threshold, the risk fund reserve is auctioned. Auction participants can receive up to a 10% incentive for covering the bad debt.
