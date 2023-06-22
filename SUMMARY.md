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
* [Isolated pools](reference-isolated-pools/README.md)
  * [Comptroller](reference-isolated-pools/comptroller/README.md)
    * [Comptroller](reference-isolated-pools/Comptroller.md)
    * [ComptrollerStorage](reference-isolated-pools/ComptrollerStorage.md)
  * [VToken](reference-isolated-pools/vtoken/README.md)
    * [VToken](reference-isolated-pools/VToken.md)
    * [VTokenInterfaces](reference-isolated-pools/VTokenInterfaces.md)
  * [Pool registry](reference-isolated-pools/pool-registry/README.md)
    * [PoolRegistry](reference-isolated-pools/Pool/PoolRegistry.md)
    * [PoolRegistryInterface](reference-isolated-pools/Pool/PoolRegistryInterface.md)
  * [RewardsDistributor](reference-isolated-pools/Rewards/RewardsDistributor.md)
  * [PoolLens](reference-isolated-pools/Lens/PoolLens.md)
  * [Interest Rate Models](reference-isolated-pools/interest-rate-models/README.md)
    * [InterestRateModel](reference-isolated-pools/InterestRateModel.md)
    * [BaseJumpRateModelV2](reference-isolated-pools/BaseJumpRateModelV2.md)
    * [JumpRateModelV2](reference-isolated-pools/JumpRateModelV2.md)
    * [WhitePaperInterestRateModel](reference-isolated-pools/WhitePaperInterestRateModel.md)
  * [Risk Fund and Shortfall](reference-isolated-pools/risk-fund-and-shortfall/README.md)
    * [Shortfall](reference-isolated-pools/Shortfall/Shortfall.md)
    * [ProtocolShareReserve](reference-isolated-pools/RiskFund/ProtocolShareReserve.md)
    * [RiskFund](reference-isolated-pools/RiskFund/RiskFund.md)
    * [ReserveHelpers](reference-isolated-pools/RiskFund/ReserveHelpers.md)
  * [Utility](reference-isolated-pools/utility/README.md)
    * [MaxLoopsLimitHelper](reference-isolated-pools/MaxLoopsLimitHelper.md)
    * [ErrorReporter](reference-isolated-pools/ErrorReporter.md)
    * [ExponentialNoError](reference-isolated-pools/ExponentialNoError.md)
* [Oracle](reference-oracle/README.md)
  * [ResilientOracle](reference-oracle/ResilientOracle.md)
  * [BoundValidator](reference-oracle/oracles/BoundValidator.md)
  * [Sources](reference-oracle/oracles/README.md)
    * [ChainlinkOracle](reference-oracle/oracles/ChainlinkOracle.md)
    * [BinanceOracle](reference-oracle/oracles/BinanceOracle.md)
    * [TwapOracle](reference-oracle/oracles/TwapOracle.md)
    * [PythOracle](reference-oracle/oracles/PythOracle.md)
* [Governance](reference-governance/README.md)
  * [AccessControlManager](reference-governance/AccessControlManager.md)
  * [GovernorBravoDelegate](reference-governance/GovernorBravoDelegate.md)
  * [AccessControlledV5](reference-governance/AccessControlledV5.md)
  * [GovernorBravoDelegator](reference-governance/GovernorBravoDelegator.md)
  * [Timelock](reference-governance/Timelock.md)
  * [GovernorBravoInterfaces](reference-governance/GovernorBravoInterfaces.md)
  * [IAccessControlManagerV5](reference-governance/IAccessControlManagerV5.md)
  * [IAccessControlManagerV8](reference-governance/IAccessControlManagerV8.md)
  * [AccessControlledV8](reference-governance/AccessControlledV8.md)

## Deployed Contracts

* [Isolated pool](deployed-contracts/isolated-pools.md)
* [Oracles](deployed-contracts/oracles.md)
* [Core pool](deployed-contracts/core-pool.md)
* [Governance](deployed-contracts/governance.md)
* [Peripherial](deployed-contracts/peripherial.md)

## Links

* [Security & Audits](security-and-audits.md)
* [Resources](resources.md)
