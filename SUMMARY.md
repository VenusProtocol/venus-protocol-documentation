# Table of contents

## Getting Started

* [Overview](README.md)
* [FAQ](getting-started/faq.md)

## What's New?

* [Isolated Pools](whats-new/isolated-pools.md)
* [Prime Yield](whats-new/prime-yield.md)
* [Stable Rate Borrowing](whats-new/stable-rate-borrowing.md)
* [Reward Distributor](whats-new/reward-distributor.md)
* [Automatic Income Allocation](whats-new/automatic-income-allocation.md)

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
  * [VAIController](tokens/vai-controller.md)
  * [VAIUnitroller](tokens/vai-unitroller.md)

## Guides

* [Venus interface](guides/market-interaction/interface.md)
* [Supplying and borrowing](guides/market-interaction/supply-borrow.md)
* [Liquidations](guides/market-interaction/liquidation.md)
* [Governance](guides/governance/README.md)
  * [Submitting a VIP](guides/governance-guide/vip.md)
  * [Delegating & Voting](guides/governance-guide/delegating.md)
* [Contributing](guides/contributing.md)
* [Vaults](guides/vaults.md)
* [Protocol Math](guides/protocol-math.md)

## Technical reference

* [Contracts Overview](technical-reference/contracts-overview.md)
* [Core Pool](technical-reference/reference-core-pool/README.md)
  * [Comptroller](technical-reference/reference-core-pool/comptroller/README.md)
    * [Comptroller](technical-reference/reference-core-pool/comptroller/comptroller-lens.md)
  * [VToken](technical-reference/reference-core-pool/vtoken.md)
  * [InterestRateModels](technical-reference/reference-core-pool/interestratemodels/README.md)
    * [JumpModel](technical-reference/reference-core-pool/interestratemodels/jump-model.md)
    * [WhitePaperModel](technical-reference/reference-core-pool/interestratemodels/white-paper-interest-rate-model.md)
    * [InterestRateModelLens](technical-reference/reference-core-pool/interestratemodels/interest-rate-model-lens.md)
  * [Liquidator](technical-reference/reference-core-pool/liquidator.md)
  * [Maximillion](technical-reference/reference-core-pool/maximillion.md)
  * [VTreasury](technical-reference/reference-core-pool/vtreasury.md)
  * [VenusLens](technical-reference/reference-core-pool/venus-lens.md)
* [Isolated Pools](reference-isolated-pools/README.md)
  * [Comptroller](reference-isolated-pools/comptroller/README.md)
    * [Comptroller](technical-reference/reference-isolated-pools/comptroller/comptroller.md)
    * [ComptrollerStorage](reference-isolated-pools/comptroller-storage.md)
  * [VToken](reference-isolated-pools/vtoken/README.md)
    * [VToken](technical-reference/reference-isolated-pools/vtoken/vtoken.md)
    * [VTokenInterfaces](reference-isolated-pools/vtoken-interfaces.md)
  * [Pool Registry](reference-isolated-pools/pool-registry/README.md)
    * [PoolRegistry](technical-reference/reference-isolated-pools/pool-registry/poolregistry.md)
    * [PoolRegistryInterface](technical-reference/reference-isolated-pools/pool-registry/poolregistryinterface.md)
  * [RewardsDistributor](technical-reference/reference-isolated-pools/rewardsdistributor.md)
  * [PoolLens](technical-reference/reference-isolated-pools/poollens.md)
  * [Interest Rate Models](reference-isolated-pools/interest-rate-models/README.md)
    * [InterestRateModel](reference-isolated-pools/interest-rate-model.md)
    * [BaseJumpRateModelV2](reference-isolated-pools/base-jump-rate-model-v2.md)
    * [JumpRateModelV2](technical-reference/reference-isolated-pools/interest-rate-models/jumpratemodelv2.md)
    * [WhitePaperInterestRateModel](technical-reference/reference-isolated-pools/interest-rate-models/whitepaperinterestratemodel.md)
  * [Risk Fund and Shortfall](reference-isolated-pools/risk-fund-and-shortfall/README.md)
    * [Shortfall](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/shortfall.md)
    * [ProtocolShareReserve](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/protocolsharereserve.md)
    * [RiskFund](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/riskfund.md)
    * [ReserveHelpers](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/reservehelpers.md)
  * [Utility](reference-isolated-pools/utility/README.md)
    * [MaxLoopsLimitHelper](reference-isolated-pools/max-loops-limit-helper.md)
    * [ErrorReporter](reference-isolated-pools/error-reporter.md)
    * [ExponentialNoError](reference-isolated-pools/exponential-no-error.md)
* [Oracle](reference-oracle/README.md)
  * [ResilientOracle](reference-oracle/resilient-oracle.md)
  * [BoundValidator](technical-reference/reference-oracle/boundvalidator.md)
  * [Sources](reference-oracle/oracles/README.md)
    * [ChainlinkOracle](technical-reference/reference-oracle/oracles/chainlinkoracle.md)
    * [BinanceOracle](technical-reference/reference-oracle/oracles/binanceoracle.md)
    * [TwapOracle](technical-reference/reference-oracle/oracles/twaporacle.md)
    * [PythOracle](technical-reference/reference-oracle/oracles/pythoracle.md)
* [Governance](reference-governance/README.md)
  * [AccessControlManager](reference-governance/access-control-manager.md)
  * [GovernorBravoDelegate](reference-governance/governor-bravo-delegate.md)
  * [AccessControlledV5](reference-governance/access-controlled-v5.md)
  * [GovernorBravoDelegator](reference-governance/governor-bravo-delegator.md)
  * [Timelock](technical-reference/reference-governance/timelock.md)
  * [GovernorBravoInterfaces](reference-governance/governor-bravo-interfaces.md)
  * [IAccessControlManagerV5](reference-governance/iaccess-control-manager-v5.md)
  * [IAccessControlManagerV8](reference-governance/iaccess-control-manager-v8.md)
  * [AccessControlledV8](reference-governance/access-controlled-v8.md)
* [Contracts Overview](technical-reference/automatic-income-allocation.md)

## Deployed Contracts

* [Isolated Pool](deployed-contracts/isolated-pools.md)
* [Oracles](deployed-contracts/oracles.md)
* [Core Pool](deployed-contracts/core-pool.md)
* [Governance](deployed-contracts/governance.md)

***

* [API (Beta)](api-beta.md)

## Links

* [Security & Audits](security-and-audits.md)
* [Resources](resources.md)
