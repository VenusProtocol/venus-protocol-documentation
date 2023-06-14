# Table of contents

## Getting Started

- [Overview](README.md)
- [Contracts Overview](getting-started/contracts-overview.md)
- [V4 Whitepaper](getting-started/v4-whitepaper.md)
- [FAQ](getting-started/faq.md)

## What's New?

- [Isolated Pools](whats-new/isolated-pools.md)
- [Integrated Swap](whats-new/integrated-swap.md)

## Governance

- [Decentralization](governance/decentralization.md)
- [Tokenomics](governance/tokenomics.md)
- [Governance Community Forum](https://community.venus.io/top?period=quarterly)

## Risk

- [Resilient Price Oracle](risk/resilient-price-oracle.md)
- [VAI Sustainability](risk/vai-sustainability.md)
- [Interest Rate Model](risk/interest-rate-model.md)

## Guides

- [Venus interface](guides/market-interaction/interface.md)
- [Supplying and borrowing](guides/market-interaction/supply-borrow.md)
- [Liquidations](guides/market-interaction/liquidation.md)
- [Governance](guides/governance/README.md)
  - [Venus Improvement Proposal](guides/governance-guide/vip.md)
  - [Voting](guides/governance-guide/voting.md)
  - [Delegating](guides/governance-guide/delegating.md)
- [Contributing](guides/contributing.md)

## Technical reference

- Isolated pools
  - Comptroller
    - [Comptroller](reference-isolated-pools/Comptroller.md)
    - [ComptrollerStorage](reference-isolated-pools/ComptrollerStorage.md)
    - [ComptrollerInterface](reference-isolated-pools/ComptrollerInterface.md)
  - VToken
    - [VToken](reference-isolated-pools/VToken.md)
    - [VTokenInterfaces](reference-isolated-pools/VTokenInterfaces.md)
  - Pool registry
    - [PoolRegistry](reference-isolated-pools/Pool/PoolRegistry.md)
    - [PoolRegistryInterface](reference-isolated-pools/Pool/PoolRegistryInterface.md)
  - [RewardsDistributor](reference-isolated-pools/Rewards/RewardsDistributor.md)
  - [PoolLens](reference-isolated-pools/Lens/PoolLens.md)
  - Interest rate models
    - [InterestRateModel](reference-isolated-pools/InterestRateModel.md)
    - [BaseJumpRateModelV2](reference-isolated-pools/BaseJumpRateModelV2.md)
    - [JumpRateModelV2](reference-isolated-pools/JumpRateModelV2.md)
    - [WhitePaperInterestRateModel](reference-isolated-pools/WhitePaperInterestRateModel.md)
  - Risk fund and shortfall
    - [Shortfall](reference-isolated-pools/Shortfall/Shortfall.md)
    - [IShortfall](reference-isolated-pools/Shortfall/IShortfall.md)
    - [ProtocolShareReserve](reference-isolated-pools/RiskFund/ProtocolShareReserve.md)
    - [IProtocolShareReserve](reference-isolated-pools/RiskFund/IProtocolShareReserve.md)
    - [RiskFund](reference-isolated-pools/RiskFund/RiskFund.md)
    - [IRiskFund](reference-isolated-pools/RiskFund/IRiskFund.md)
    - [ReserveHelpers](reference-isolated-pools/RiskFund/ReserveHelpers.md)
  - Utility
    - [MaxLoopsLimitHelper](reference-isolated-pools/MaxLoopsLimitHelper.md)
    - [ErrorReporter](reference-isolated-pools/ErrorReporter.md)
    - [ExponentialNoError](reference-isolated-pools/ExponentialNoError.md)
- Oracle
  - [ResilientOracle](reference-oracle/ResilientOracle.md)
  - [BoundValidator](reference-oracle/oracles/BoundValidator.md)
  - Sources
    - [ChainlinkOracle](reference-oracle/oracles/ChainlinkOracle.md)
    - [BinanceOracle](reference-oracle/oracles/BinanceOracle.md)
    - [TwapOracle](reference-oracle/oracles/TwapOracle.md)
    - [PythOracle](reference-oracle/oracles/PythOracle.md)
- Governance
  - [AccessControlManager](reference-governance/AccessControlManager.md)
  - [GovernorBravoDelegate](reference-governance/GovernorBravoDelegate.md)
  - [AccessControlledV8](reference-governance/AccessControlledV8.md)
  - [AccessControlledV5](reference-governance/AccessControlledV5.md)
  - [GovernorBravoDelegator](reference-governance/GovernorBravoDelegator.md)
  - [Timelock](reference-governance/Timelock.md)
  - [GovernorBravoInterfaces](reference-governance/GovernorBravoInterfaces.md)
  - [IAccessControlManagerV5](reference-governance/IAccessControlManagerV5.md)
  - [IAccessControlManagerV8](reference-governance/IAccessControlManagerV8.md)

## Vaults

- [XVS Vault](vaults/xvs-vault.md)
- [VAI Vault](vaults/vai-vault.md)
- [VRT Vault](vaults/vrt-vault.md)

## Tokens

- [VAI](tokens/vai.md)
- [XVS](tokens/xvs.md)
- [VRT](tokens/vrt.md)

## Deployed Contracts

- [Isolated pool](deployed-contracts/isolated-pools.md)
- [Oracles](deployed-contracts/oracles.md)
- [Core pool](deployed-contracts/core-pool.md)
- [Governance](deployed-contracts/governance.md)
- [Peripherial](deployed-contracts/peripherial.md)

## Links

- [Security & Audits](security-and-audits.md)
- [FAQ](frequently-asked-questions.md)
- [Contribution](links/contribution.md)
