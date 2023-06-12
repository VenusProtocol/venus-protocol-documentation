# Resilient Price Oracle

### Overview

In its previous version, Venus was fully reliant on the Chainlink price oracle for fetching prices. This dependence, while generally reliable, created a potential single point of failure. An erroneous or stagnant price could, without a secondary mechanism for validation, pose threats such as unwarranted liquidations or inflated borrowing.

In light of these risks, Venus V4 introduces the Resilient Price Oracle, a more robust system capable of pulling data from multiple sources for cross-validation. The Resilient Oracle is equipped with an algorithm to verify prices between two or more sources, providing a safeguard in cases where the primary source proves unreliable or fails.

Furthermore, the improved oracle infrastructure supports the integration of new price oracles in real-time and permits the enabling and disabling of price oracles per token.

### Key Features

#### Resilient Price Feeds

The Resilient Price Feeds replace the single source price provider used in the Comptroller contract with a more robust and reliable solution. This new component not only fetches asset prices from various on-chain sources but also includes a fallback mechanism to protect the protocol from oracle failures. Presently, this feature incorporates Chainlink, Pyth Network, Binance Oracle, and TWAP oracles, with the possibility of adding more in the future.

#### Governance Configurations

The Resilient Price Feeds system can be configured by the Venus governance via Venus Improvement Proposals (VIPs). These configurations include pause and resume functionalities for the oracle, price feed configurations, and fixed price settings, among others.

### Safety Measures

In implementing the Resilient Price Oracle, several safety measures have been adopted to ensure the security and continuity of the Venus Protocol:

- **Price Continuity:** Asset prices pre and post upgrade were validated in a simulated environment to ensure consistency.
- **Testnet Deployment:** The oracles have been deployed and tested in the Venus Protocol testnet environment.
- **Auditing:** The code has been audited by OpenZeppelin, Peckshield, Certik, and Hacken.

### Further Reading

For more detailed information, refer to the following resources:

- [Peckshield Audit Report](https://chat.openai.com/?model=gpt-4)
- [Certik Audit Report](https://chat.openai.com/?model=gpt-4)
- [Hacken Audit Report](https://chat.openai.com/?model=gpt-4)
- [Deployed Contracts on Main Net](https://chat.openai.com/?model=gpt-4)
- [Repository](https://chat.openai.com/?model=gpt-4)
- [Simulation Pre/Post Upgrade](https://chat.openai.com/?model=gpt-4)
- [Deployment on Testnet](https://chat.openai.com/?model=gpt-4)
- [Community Post about Venus V4, introducing Resilient Price Feeds](https://chat.openai.com/?model=gpt-4)
- [Venus Stars Blog Post about Binance Oracle](https://chat.openai.com/?model=gpt-4)
- [Community Discussion about Pyth Oracle](https://chat.openai.com/?model=gpt-4)
