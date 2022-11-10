# Factories

Factories are the contracts that deploy interest rate models and VToken proxies. [Pool Registry](../pool-registry.md) uses these factories to create the necessary contracts when a new market is added to a pool.

There are two contracts for interest rate models:
* [White Paper Interest Rate Model Factory](./white-paper-interest-rate-model-factory.md) deploys a linear interest rate model
* [Jump Rate Model Factory](./jump-rate-model-factory.md) deploys a piecewise linear interest rate model with a steep increase when the utilization is high

[VToken Proxy Factory](./vtoken-proxy-factory.md) deploys an upgradeable proxy for the market itself. Contrary to the Core Pool, Isolated Lending uses a standart OpenZeppelin proxy for all contracts including VTokens. All markets are upgradeable in Venus Isolated Lending.
