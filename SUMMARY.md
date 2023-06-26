# Table of contents

## Getting Started

* [Overview](README.md)
* [V4 Whitepaper](getting-started/v4-whitepaper.md)
* [FAQ](getting-started/faq.md)

## What's New?

* [Isolated Pools](whats-new/isolated-pools.md)
* [Prime Yield](whats-new/prime-yield.md)
* [Stable Rate Borrowing](whats-new/stable-rate-borrowing.md)
* [Reward Distributor](whats-new/reward-distributor.md)

## Governance

* [VIPs](governance/decentralization.md)
* [Tokenomics](governance/tokenomics.md)
* [Community Forum](https://community.venus.io/top?period=quarterly)

## Risk

* [Resilient Price Oracle](risk/resilient-price-oracle.md)
* [Interest Rate Model](risk/interest-rate-model.md)
* [Risk Fund and Shortfall Handling](risk/risk-fund-and-shortfall-handling.md)

## Tokens

* [XVS](tokens/xvs.md)
* [VAI](tokens/vai.md)

## Guides

* [Venus interface](guides/market-interaction/interface.md)
* [Supplying and borrowing](guides/market-interaction/supply-borrow.md)
* [Liquidations](guides/market-interaction/liquidation.md)
* [Governance](guides/governance/README.md)
  * [Submitting a VIP](guides/governance-guide/vip.md)
  * [Delegating & Voting](guides/governance-guide/delegating.md)
* [Contributing](guides/contributing.md)
* [Vaults](guides/vaults.md)

## Technical reference

* [Contracts Overview](technical-reference/contracts-overview.md)
* [Isolated Pools](reference-isolated-pools/README.md)
  * [Comptroller](reference-isolated-pools/comptroller/README.md)
    * [Comptroller](reference-isolated-pools/comptroller.md)
    * [ComptrollerStorage](reference-isolated-pools/comptroller-storage.md)
  * [VToken](reference-isolated-pools/vtoken/README.md)
    * [VToken](reference-isolated-pools/vtoken.md)
    * [VTokenInterfaces](reference-isolated-pools/vtoken-interfaces.md)
  * [Pool Registry](reference-isolated-pools/pool-registry/README.md)
    * [PoolRegistry](reference-isolated-pools/pool-registry/pool-registry.md)
    * [PoolRegistryInterface](reference-isolated-pools/pool-registry/pool-registry-interface.md)
  * [RewardsDistributor](reference-isolated-pools/rewards/rewards-distributor.md)
  * [PoolLens](reference-isolated-pools/Lens/pool-lens.md)
  * [Interest Rate Models](reference-isolated-pools/interest-rate-models/README.md)
    * [InterestRateModel](reference-isolated-pools/interest-rate-model.md)
    * [BaseJumpRateModelV2](reference-isolated-pools/base-jump-rate-model-v2.md)
    * [JumpRateModelV2](reference-isolated-pools/jump-rate-model-v2.md)
    * [WhitePaperInterestRateModel](reference-isolated-pools/-white-paper-interest-rate-model.md)
  * [Risk Fund and Shortfall](reference-isolated-pools/risk-fund-and-shortfall/README.md)
    * [Shortfall](reference-isolated-pools/risk-fund-and-shortfall/shortfall.md)
    * [ProtocolShareReserve](reference-isolated-pools/risk-fund-and-shortfall/protocol-share-reserve.md)
    * [RiskFund](reference-isolated-pools/risk-fund-and-shortfall/risk-fund.md)
    * [ReserveHelpers](reference-isolated-pools/risk-fund-and-shortfall/reserve-helpers.md)
  * [Utility](reference-isolated-pools/utility/README.md)
    * [MaxLoopsLimitHelper](reference-isolated-pools/max-loops-limit-helper.md)
    * [ErrorReporter](reference-isolated-pools/error-reporter.md)
    * [ExponentialNoError](reference-isolated-pools/exponential-no-error.md)
* [Oracle](reference-oracle/README.md)
  * [ResilientOracle](reference-oracle/resilient-oracle.md)
  * [BoundValidator](reference-oracle/oracles/bound-validator.md)
  * [Sources](reference-oracle/oracles/README.md)
    * [ChainlinkOracle](reference-oracle/oracles/chainlink-oracle.md)
    * [BinanceOracle](reference-oracle/oracles/binance-oracle.md)
    * [TwapOracle](reference-oracle/oracles/twap-oracle.md)
    * [PythOracle](reference-oracle/oracles/pyth-oracle.md)
* [Governance](reference-governance/README.md)
  * [AccessControlManager](reference-governance/access-control-manager.md)
  * [GovernorBravoDelegate](reference-governance/governor-bravo-delegate.md)
  * [AccessControlledV5](reference-governance/access-controlled-v5.md)
  * [GovernorBravoDelegator](reference-governance/governor-bravo-delegator.md)
  * [Timelock](reference-governance/timelock.md)
  * [GovernorBravoInterfaces](reference-governance/governor-bravo-interfaces.md)
  * [IAccessControlManagerV5](reference-governance/iaccess-control-manager-v5.md)
  * [IAccessControlManagerV8](reference-governance/iaccess-control-manager-v8.md)
  * [AccessControlledV8](reference-governance/access-controlled-v8.md)

## Deployed Contracts

* [Isolated Pool](deployed-contracts/isolated-pools.md)
* [Oracles](deployed-contracts/oracles.md)
* [Core Pool](deployed-contracts/core-pool.md)
* [Governance](deployed-contracts/governance.md)
* [Peripherial](deployed-contracts/peripherial.md)

## Links

* [Security & Audits](security-and-audits.md)
* [Resources](resources.md)
