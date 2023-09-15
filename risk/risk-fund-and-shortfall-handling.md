# Risk Fund and Shortfall Handling

{% hint style="warning" %}
**To be released**
{% endhint %}

### **Overview**

Venus Protocol manages risks of high volatility tokens with isolated pools. Each pool (Isolated Pools and the Core pool) has an associated risk fund receiving a percentage of the pool's income (interest and liquidation bonus) in USDT to prevent insolvency. The specific percentage is defined by the [tokenomics](../governance/tokenomics.md) of the project. The risk fund also covers bad debt in case of bankruptcy without a liquidator.

### Risk fund

The risk fund concerns three main contracts:

* `ProtocolShareReserve`
* `RiskFund`
* `ReserveHelpers`

These three contracts are designed to hold funds that have been accumulated from interest reserves and liquidation incentives, send a portion to the protocol treasury, and send the remainder to the `RiskFund` contract. When `reduceReserves()` is called in a vToken contract, all accumulated liquidation fees and interests reserves are sent to the `ProtocolShareReserve` contract. Once funds are transferred to the `ProtocolShareReserve`, anyone can call `releaseFunds()` to transfer 50% to the `protocolIncome` address and the other 50% to the `riskFund` contract. Once in the `riskFund` contract, the tokens can be swapped via PancakeSwap pairs to the convertible base asset, which can be updated by the authorized accounts. When tokens are converted to the `convertibleBaseAsset`, they can be used in the `Shortfall` contract to auction off the pool's bad debt. Note that just as each pool is isolated, the risk funds for each pool are also isolated: only the associated risk fund for a pool can be used when auctioning off the bad debt of the pool.

### Shortfall

When a borrower's shortfall (total borrowed amount converted to USD is greater than the total supplied amount converted to USD) is detected in a market in the Isolated Pools, Venus halts the interest accrual, writes off the borrower's balance, and tracks the bad debt.

`Shortfall` is an auction contract designed to auction off the `convertibleBaseAsset` accumulated in `RiskFund`. The `convertibleBaseAsset` is auctioned in exchange for users paying off the pool's bad debt. An auction can be started by anyone once a pool's bad debt has reached a minimum value (see `Shortfall.minimumPoolBadDebt()`). This value is set and can be changed by the authorized accounts. If the pool’s bad debt exceeds the risk fund plus a 10% incentive, then the auction winner is determined by who will pay off the largest percentage of the pool's bad debt. The auction winner repays the bid percentage of the bad debt in exchange for the entire risk fund. Otherwise, if the risk fund covers the pool's bad debt plus the 10% incentive, then the auction winner is determined by who will take the smallest percentage of the risk fund in exchange for paying off all the pool's bad debt.

The main configurable (via VIP) parameters in the `Shortfall` contract , and their initial values, are:

* `minimumPoolBadDebt` - Minimum USD bad debt in the pool to allow the initiation of an auction. Initial value set to 1,000 USD
* `waitForFirstBidder` - Blocks to wait for first bidder. Initial value sets to 100 blocks
* `nextBidderBlockLimit` - Time to wait for next bidder. Initial value set to 100 blocks
* `incentiveBps` - Incentive to auction participants. Initial value set to 1000 bps or 10%

{% hint style="info" %}
**Availability**:

* `Shortfall` contract will be used only for the markets in the Isolated Pools.
* The markets in the Core pool don't track the bad debt at the moment, so it cannot be reduced automatically.
* The funds generated in the Core pool, that should be allocated to the risk fund, are temporarily sent to the [Venus Treasury](https://bscscan.com/address/0xf322942f644a996a617bd29c16bd7d231d9f35e9) contract. With the relase of the [Automatic income allocation](../whats-new/automatic-income-allocation.md) feature, this income will be sent to the `ProtocolShareReserve` contract, where there will be distributed following the [tokenomics](../governance/tokenomics.md) of the project.
* The funds associated with the Core pool, accumulated in the `RiskFund` contract, will be used to repay the bad debt of the Core pool via VIP.
{% endhint %}
