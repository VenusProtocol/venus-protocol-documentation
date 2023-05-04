# Factories

Factories are the contracts that deploy interest rate models and VToken proxies. [PoolRegistry](../pool-registry.md) uses these factories to create the necessary contracts when a new market is added to a pool.

There are two contracts for interest rate models:

- [WhitePaperInterestRateModelFactory](./white-paper-interest-rate-model-factory.md) deploys a linear interest rate model
- [JumpRateModelFactory](./jump-rate-model-factory.md) deploys a piecewise linear interest rate model with a steep increase when the utilization is high

[VTokenProxyFactory](./vtoken-proxy-factory.md) deploys an upgradeable proxy for the market itself. Contrary to the Core Pool, Isolated Pools uses a standard OpenZeppelin proxy for all contracts including VToken. All markets are upgradeable in Venus Isolated Pools.
