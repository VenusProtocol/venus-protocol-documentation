# FAQ

### **What is Venus Protocol?**

Venus Protocol is a trusted decentralized finance lending and borrowing protocol that's deployed on the BNB Chain. Initially launched in 2020, it combines the stablecoin minting facility of Maker and the algorithmic money markets developed by Compound, providing a simplified user experience and core capabilities in a single application.

### How do I interact with Venus Protocol?

Interacting with Venus V4 is straightforward. Supply your chosen asset and the amount to start earning interest. Additionally, once you supply assets, you can also borrow against them. Any interest earned from supplying assets can help offset the interest you accrue when borrowing.

### Where are my supplied funds stored?

Your supplied funds are stored in a smart contract on the BNB Chain. The contract's code is public, open-source, and has been formally verified and audited by external auditors. You can withdraw your funds on demand or receive Venus Tokens (vTokens) representing your stake. vTokens are as freely tradable as any other cryptographic asset on BNB Chain.

### **What is the cost of interacting with Venus Protocol?**

Transactions on the Venus V4 protocol require BNB Chain fees, which depend on network congestion and the complexity of the transaction.

### **Is there any risk?**

No platform can be considered entirely risk-free. Risks associated with Venus V4 include smart contract risk and liquidation risk. However, every possible step has been taken to minimize these risks, including making the protocol code public and conducting thorough audits.

### **What are the key areas Venus Protocol V4 aims to improve?**

Venus Protocol focuses on improving three main areas:

* **Risk Management:** Venus introduced more sophisticated risk parameters, layered oracle validation, and fine-grained controls.
* **Decentralization:** The governance model has been enhanced by introducing fast-track VIPs, role-based access control, and a fine-grained pause mechanism.
* **User Experience:** The latest version offers an enhanced user interface, a more effective reward system, and Venus Prime, all aimed at providing a smooth user experience.

### **What is the Resilient Price Oracle?**

The Resilient Price Oracle introduced in Venus V4 fetches prices from multiple sources and validates them, providing a more reliable price indicator and protecting against price manipulations. It supports the integration of new price oracles and allows enabling and disabling price oracles per token.

### **What are Isolated Pools?**

Standalone Isolated Pools were separate collections of lending markets with their own risk configurations. This product has since been fully deprecated on BNB Chain, Ethereum, and Arbitrum, and its screens have been removed from the Venus interface. If you still have a position or unclaimed rewards in one of these legacy pools, follow the [exit and rewards guide](../guides/isolated-pools-deprecation.md).

This retirement does not apply to the Core Pool or to [Isolation Mode](../guides/isolated-e-mode.md), which applies borrowing restrictions to selected collateral within the Core Pool.

### **What is the Risk Fund?**

The Risk Fund is a reserve-management component used to hold protocol reserves that can help address bad debt. The original V4 isolated-pool design used per-pool accounting, but that accounting model has since been removed; the `RiskFundV2` contract itself remains active.

### **What changes were made to the governance model in Venus V4?**

Venus V4 features a new governance model that introduces fast-track Venus Improvement Proposals (VIPs), role-based access control, and a fine-grained pause mechanism. This new model allows for more agile and accurate decision-making, ensuring the protocol remains competitive and secure.
