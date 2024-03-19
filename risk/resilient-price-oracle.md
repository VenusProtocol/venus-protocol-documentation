# Resilient Price Oracle

### Overview

In its previous version, Venus was fully reliant on the Chainlink price oracle for fetching prices. This dependence, while generally reliable, created a single point of failure. An erroneous or stale price could, without a secondary mechanism for validation, pose threats such as unwarranted liquidations or inflated borrowing.

In light of these risks, Venus V4 introduces the Resilient Price Oracle, a more robust system capable of pulling data from multiple sources for cross-validation. The Resilient Oracle is equipped with an algorithm to verify prices between two or more sources, providing a safeguard in cases where the primary source proves unreliable or fails.

Furthermore, the improved oracle infrastructure supports the integration of new price oracles in real-time and permits the enabling and disabling of price oracles per token.

### Key Features

#### Resilient Price Feeds

The Resilient Price Feeds replace the single source price provider used in the Comptroller contract with a more robust and reliable solution. This new component not only fetches asset prices from various on-chain sources but also includes a fallback mechanism to protect the protocol from oracle failures. Presently, this feature incorporates Chainlink, RedStone, Pyth Network and Binance oracles, with the possibility of adding more in the future.

#### Governance Configurations

The Resilient Price Feeds system can be configured by the Venus governance via Venus Improvement Proposals (VIPs). These configurations include pause and resume functionalities for the oracle, price feed configurations, and fixed price settings, among others.

### Safety Measures

In implementing the Resilient Price Oracle, several safety measures have been adopted to ensure the security and continuity of the Venus Protocol:

* **Price Continuity:** Asset prices pre and post upgrade were validated in a simulated environment to ensure consistency.
* **Testnet Deployment:** The oracles have been deployed and tested in the Venus Protocol testnet environment.
* **Auditing:** The code has been audited by OpenZeppelin, Peckshield, Certik, and Hacken.

<figure><img src="../.gitbook/assets/17b75928-d6a2-4207-9a0b-89d1d41690d4.png" alt=""><figcaption></figcaption></figure>


### Pricing for Liquid Staked Tokens
For LSTs (Liquid Staked Tokens) pricing, best practice suggests oracles quote the smart contract of the LST to derive its value in underlying token units and then multiply that by the USD price of the underlying. In Venus we use dedicated oracles for each LST asset in order to calculate the price as follows:
*  convert the LST to the underlying tokens (using the exchange rate provided by the LST contract)
*  convert the underlying token calculated in the previous step to USD, using a “traditional” oracle based on market price

{% hint style="warning" %}
It is worth mentioning that with this approach we assume 1:1 price ratio between the LST and the underlying asset (e.g. 1 ETH = 1 STETH). The primary risks involved with the above approach are related to smart contract vulnerabilities and other counterparty risks that could affect the redemption processes of the LSTs. In scenarios where there is substantial counterparty risk, notably if the underlying tokens are not redeemable against the LSTs, the direct smart contract pricing might become unreliable so here is our plan to mitigate such cases:
* We will deploy two `wstETH` oracles on-chain:
  - The first oracle will return the price based on the assumption of a 1:1 ratio between `stETH/ETH`.
  - The second oracle will return the price based on the `stETH/USD` market price feed.
* By default, the `ResilientOracle` will be configured to use only the oracle assuming a 1:1 ratio between `stETH/ETH` as the primary oracle.
* The second oracle, which derives price from the `stETH/USD` price feed without assuming a 1:1 ratio, will not be initially configured in our `ResilientOracle`.
* We have implemented an off-chain monitoring system to track the prices returned by both oracles. Should there be a significant deviation for a longer period of time, our team will asses the situation and determine whether to switch the primary oracle from the one assuming a 1:1 ratio to the one that does not, or to temporarily include the latter as a pivot oracle in the `ResilientOracle` configuration.
{% endhint %}

### Further Reading

For more detailed information, refer to the following resources:

#### Audit reports

* [Resilient Price Oracle](../security-and-audits.md#oracles)
* [Resilient Price Oracle upgrade](../security-and-audits.md#oracles-upgrade-2023-07-24)
* [WstETH oracle](../security-and-audits.md#oracle-for-wsteth)

#### References

* [Repository](https://github.com/VenusProtocol/oracle)
* [Community post about Venus V4, introducing Resilient Price Feeds](https://community.venus.io/t/proposing-venus-v4/3188#price-feed-redundancy-6)
* [Venus Stars blog post about Binance Oracle](https://venusstars.io/community/index.php/2023/05/09/venus-enhances-resilience-binance-oracle-feeds/)
