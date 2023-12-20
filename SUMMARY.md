# Table of contents

## Getting Started

* [Overview](README.md)
* [Whitepaper V4](https://github.com/VenusProtocol/venus-protocol-documentation/blob/main/whitepapers/Venus-whitepaper-v4.pdf)
* [FAQ](getting-started/faq.md)

## What's New?

* [Isolated Pools](whats-new/isolated-pools.md)
* [Reward Distributor](whats-new/reward-distributor.md)
* [Peg Stability Module](whats-new/psm.md)
* [Automatic Income Allocation](whats-new/automatic-income-allocation.md)
* [Token Converter](whats-new/token-converter.md)
* [Venus Prime](whats-new/prime-yield.md)
* [Stable Rate Borrowing](whats-new/stable-rate-borrowing.md)

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
* [Technical articles](technical-reference/reference-technical-articles/README.md)
  * [Automatic income allocation](technical-reference/reference-technical-articles/automatic-income-allocation.md)
  * [Shortfall and auctions](technical-reference/reference-technical-articles/shortfall-and-auctions.md)
  * [Diamond Comptroller in the Core pool](technical-reference/reference-technical-articles/diamond-comptroller.md)
  * [Prime tokens](technical-reference/reference-technical-articles/prime.md)
  * [XVS Bridge](technical-reference/reference-technical-articles/technical-doc-xvs-bridge.md)
* [Core Pool](technical-reference/reference-core-pool/README.md)
  * [Comptroller](technical-reference/reference-core-pool/comptroller/README.md)
    * [ComptrollerLens](technical-reference/reference-core-pool/comptroller/comptroller-lens.md)
    * [Diamond](technical-reference/reference-core-pool/comptroller/diamond/README.md)
      * [Diamond](technical-reference/reference-core-pool/comptroller/diamond/diamond.md)
      * [DiamondConsolidated](technical-reference/reference-core-pool/comptroller/diamond/diamond-consolidated.md)
      * [Facets](technical-reference/reference-core-pool/comptroller/diamond/facets/README.md)
        * [MarketFacet](technical-reference/reference-core-pool/comptroller/diamond/facets/market-facet.md)
        * [PolicyFacet](technical-reference/reference-core-pool/comptroller/diamond/facets/policy-facet.md)
        * [RewardFacet](technical-reference/reference-core-pool/comptroller/diamond/facets/reward-facet.md)
        * [SetterFacet](technical-reference/reference-core-pool/comptroller/diamond/facets/setter-facet.md)
  * [VToken](technical-reference/reference-core-pool/vtoken.md)
  * [Prime](technical-reference/reference-core-pool/prime/README.md)
    * [Prime token](technical-reference/reference-core-pool/prime/prime.md)
    * [Prime liquidity provider](technical-reference/reference-core-pool/prime/prime-liquidity-provider.md)
    * [Prime storage](technical-reference/reference-core-pool/prime/prime-storage.md)
  * [Vaults](technical-reference/reference-core-pool/vaults/README.md)
    * [XVS](technical-reference/reference-core-pool/vaults/xvs/README.md)
      * [XVSVault](technical-reference/reference-core-pool/vaults/xvs/xvs-vault.md)
      * [XVSVaultProxy](technical-reference/reference-core-pool/vaults/xvs/xvs-vault-proxy.md)
      * [XVSStore](technical-reference/reference-core-pool/vaults/xvs/xvs-store.md)
    * [VAI](technical-reference/reference-core-pool/vaults/vai/README.md)
      * [VAIVault](technical-reference/reference-core-pool/vaults/xvs/vai-vault.md)
      * [VAIVaultProxy](technical-reference/reference-core-pool/vaults/xvs/vai-vault-proxy.md)
  * [InterestRateModels](technical-reference/reference-core-pool/interestratemodels/README.md)
    * [JumpModel](technical-reference/reference-core-pool/interestratemodels/jump-model.md)
    * [WhitePaperModel](technical-reference/reference-core-pool/interestratemodels/white-paper-interest-rate-model.md)
    * [InterestRateModelLens](technical-reference/reference-core-pool/interestratemodels/interest-rate-model-lens.md)
  * [Liquidator](technical-reference/reference-core-pool/liquidator.md)
  * [VTreasury](technical-reference/reference-core-pool/vtreasury.md)
  * [VenusLens](technical-reference/reference-core-pool/venus-lens.md)
  * [PSM](technical-reference/reference-core-pool/psm/peg-stability.md)
  * [VBNBAdmin](technical-reference/reference-core-pool/vbnbadmin.md)
* [Isolated Pools](technical-reference/reference-isolated-pools/README.md)
  * [Comptroller](technical-reference/reference-isolated-pools/comptroller/README.md)
    * [Comptroller](technical-reference/reference-isolated-pools/comptroller/comptroller.md)
    * [ComptrollerStorage](technical-reference/reference-isolated-pools/comptroller/comptroller-storage.md)
  * [VToken](technical-reference/reference-isolated-pools/vtoken/README.md)
    * [VToken](technical-reference/reference-isolated-pools/vtoken/vtoken.md)
    * [VTokenInterfaces](technical-reference/reference-isolated-pools/vtoken/vtoken-interfaces.md)
  * [Pool Registry](technical-reference/reference-isolated-pools/pool-registry/README.md)
    * [PoolRegistry](technical-reference/reference-isolated-pools/pool-registry/pool-registry.md)
    * [PoolRegistryInterface](technical-reference/reference-isolated-pools/pool-registry/pool-registry-interface.md)
  * [RewardsDistributor](technical-reference/reference-isolated-pools/rewards/rewards-distributor.md)
  * [PoolLens](technical-reference/reference-isolated-pools/lens/pool-lens.md)
  * [Interest Rate Models](technical-reference/reference-isolated-pools/interest-rate-models/README.md)
    * [InterestRateModel](technical-reference/reference-isolated-pools/interest-rate-models/interest-rate-model.md)
    * [BaseJumpRateModelV2](technical-reference/reference-isolated-pools/interest-rate-models/base-jump-rate-model-v2.md)
    * [JumpRateModelV2](technical-reference/reference-isolated-pools/interest-rate-models/jump-rate-model-v2.md)
    * [WhitePaperInterestRateModel](technical-reference/reference-isolated-pools/interest-rate-models/white-paper-interest-rate-model.md)
  * [Risk Fund and Shortfall](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/README.md)
    * [Shortfall](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/shortfall.md)
    * [ProtocolShareReserve](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/protocol-share-reserve.md)
    * [RiskFund](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/risk-fund.md)
    * [ReserveHelpers](technical-reference/reference-isolated-pools/risk-fund-and-shortfall/reserve-helpers.md)
  * [Utility](technical-reference/reference-isolated-pools/utility/README.md)
    * [MaxLoopsLimitHelper](technical-reference/reference-isolated-pools/utility/max-loops-limit-helper.md)
    * [ErrorReporter](technical-reference/reference-isolated-pools/utility/error-reporter.md)
    * [ExponentialNoError](technical-reference/reference-isolated-pools/utility/exponential-no-error.md)
* [Oracle](technical-reference/reference-oracle/README.md)
  * [ResilientOracle](technical-reference/reference-oracle/ResilientOracle.md)
  * [BoundValidator](technical-reference/reference-oracle/oracles/BoundValidator.md)
  * [Sources](technical-reference/reference-oracle/oracles/README.md)
    * [ChainlinkOracle](technical-reference/reference-oracle/oracles/ChainlinkOracle.md)
    * [BinanceOracle](technical-reference/reference-oracle/oracles/BinanceOracle.md)
    * [TwapOracle](technical-reference/reference-oracle/oracles/TwapOracle.md)
    * [PythOracle](technical-reference/reference-oracle/oracles/PythOracle.md)
* [Governance](technical-reference/reference-governance/README.md)
  * [AccessControlManager](technical-reference/reference-governance/access-control-manager.md)
  * [GovernorBravoDelegate](technical-reference/reference-governance/governor-bravo-delegate.md)
  * [AccessControlledV5](technical-reference/reference-governance/access-controlled-v5.md)
  * [GovernorBravoDelegator](technical-reference/reference-governance/governor-bravo-delegator.md)
  * [Timelock](technical-reference/reference-governance/timelock.md)
  * [GovernorBravoInterfaces](technical-reference/reference-governance/governor-bravo-interfaces.md)
  * [AccessControlledV8](technical-reference/reference-governance/access-controlled-v8.md)
* [XVS Bridge](technical-reference/reference-xvs-bridge/README.md)
  * [BaseXVSProxyOFT](technical-reference/reference-xvs-bridge/BaseXVSProxyOFT.md)
  * [XVSProxyOFTSrc](technical-reference/reference-xvs-bridge/XVSProxyOFTSrc.md)
  * [XVSProxyOFTDest](technical-reference/reference-xvs-bridge/XVSProxyOFTDest.md)
  * [XVSBridgeAdmin](technical-reference/reference-xvs-bridge/XVSBridgeAdmin.md)
  * [XVS](technical-reference/reference-xvs-bridge/XVS.md)
  * [TokenController](technical-reference/reference-xvs-bridge/TokenController.md)


## Deployed Contracts

* [Isolated Pool](deployed-contracts/isolated-pools.md)
* [Oracles](deployed-contracts/oracles.md)
* [Core Pool](deployed-contracts/core-pool.md)
* [Governance](deployed-contracts/governance.md)
* [XVS Multichain](deployed-contracts/xvs-multichain.md)

***

* [API](api-beta.md)

## Links

* [Security & Audits](security-and-audits.md)
* [Resources](resources.md)
