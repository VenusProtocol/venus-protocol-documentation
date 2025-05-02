# Capped Oracles

Some assets, such as Liquid Staking Tokens (LSTs), are closely tied to an underlying asset, often featuring an added growth component.

The exchange rate between an asset and its underlying is typically sourced from an onchain smart contract, which can be susceptible to manipulation. A capped oracle is a design mechanism that mitigates potential losses from such manipulation by limiting the rate at which the exchange rate is allowed to grow.

The capped oracle mechanism should be used for any asset whose price is derived through an intermediary token, where the exchange rate between the source asset and the intermediary is fetched onchain and includes a growth component.

At a high level, the capped oracle determines the maximum allowable exchange rate at the queried block based on a predefined growth rate. It then compares this with the current onchain exchange rate, and if the current rate exceeds the calculated maximum, it caps it to that maximum value.

Typically, the current maximum exchange rate at a given block is calculated by taking a historical exchange rate from a past block and applying a predefined per-second growth rate up to the current block timestamp. However, since the exchange rate may not grow consistently over time, the historical reference rate is periodically updated to ensure a more accurate and reliable maximum exchange rate. 

<figure><img src="../../.gitbook/assets/capped-oracle.svg" alt="Capped Oracle main elements"><figcaption></figcaption></figure>

The historical reference rate is periodically refreshed through a process called snapshotting. During this process, the new reference rate is set to the lower of the current onchain exchange rate or the maximum rate derived from the previous reference rate, helping maintain a more accurate and robust cap. Before querying an asset’s price from the capped oracle, the consumer should trigger the snapshotting process. If the configured interval has elapsed, a new snapshot will be taken.

The capped exchange rate between intervals is constrained by a per-second growth limit. However, since the actual exchange rate may exceed this cap, we inflate the snapshotted exchange rate by a predefined buffer to avoid imposing a hard limit.

## Configuration

The following configuration needs to be defined when configuring the capped oracle for a token:

* Annual Growth Rate: This defines the maximum growth in exchange rate per year. Internally this is converted to growth rate per second.
* Snapshot Interval: After the number of seconds window at which the reference exchange rate is recalculated, 
* Initial Snapshot Exchange Rate and Timestamp: Defines the initial reference exchange rate and the timestamp at which the exchange rate is taken from. 
* Snapshot Gap: Used to define the inflation of the exchange rate at each snapshot. 

Note that all the above variables values can be updated using the governance process after the deployment with the initial values. 

## Example

Let’s walk through an example to understand how the capped oracle functions. Suppose we want to retrieve the exchange rate between wstETH and stETH.

- **Annual Growth Rate:** Assume an annual growth rate of 2.9%, based on Lido’s estimated APY. Taking into account Lido compounding period is daily, the estimated APY would be 2.9423% (compounding should be considered when the caps are defined). So, the associated capped oracle could be configured with a maximum annual growth rate of 5%. Internally, this will be converted into a per-second growth rate.
- **Snapshot Interval:** The snapshot can be updated once per month to refresh the reference exchange rate.
- **Initial Snapshot:** We fetch the current exchange rate and timestamp from the onchain wstETH contract. For instance, the current exchange rate is `1.200101369591475639` and the timestamp is `1744895950`. We apply a buffer on top of the current exchange rate: for example 1% of the maximum annual growth rate, that is `1% * 5% = 0.05%`. So, the initial snapshot value would be `1.200101369591475639 * 1.0005 = 1.20070142027627137681`. This way, the capped oracle won't cap spikes on the wstETH exchange rate just after the initialization.
- **Snapshot Gap:** The same concept of the buffer applied to calculate the initial snapshot in the previous step, but to be considered every time the snapshot is automatically updated. This cap could be set to `1.200101369591475639 * 0.0005 = 0.0006`, and reviewed periodically.

Given this initial setup:

- after 15 days, the maximum exchange rate allowed will be `1.20070142027627137681 * (1 + (0.05 * 15 / 365)) = 1.20316860954764085647`
- after 1 month, the snapshot will be automatically updated. Assuming the exchange rate at that time is `1.20300161856832627043`, after applying the snapshot gap, the new maximum exchange rate will be `1.20360161856832627043` (`1.20300161856832627043 + 0.0006`)
- after 15 days, the maximum exchange rate allowed will be `1.20360161856832627043 * (1 + (0.05 * 15 / 365)) = 1.20607476713814428156`