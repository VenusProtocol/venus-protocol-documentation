---
title: "Contracts Overview"
---

Venus Protocol contracts are divided in these repositories:

* [isolated-pools](https://github.com/VenusProtocol/isolated-pools): Contains core contracts for isolated lending, including logic for supplying, borrowing, liquidations, pool and market deployments, and interest rate models.
* [oracle](https://github.com/VenusProtocol/oracle): This repo has contracts for oracles that we support as well as logic for validating prices returned from those oracles.
* [venus-protocol](https://github.com/VenusProtocol/venus-protocol): The core protocol is located in this repo. It contains logic central to lending and borrowing of the core pool.
* [governance-contracts](https://github.com/VenusProtocol/governance-contracts): The contracts used for proposing, voting and executing changes are kept in the \`governance-contracts repo.
* [token-bridge](https://github.com/VenusProtocol/token-bridge): The contracts use to bridge XVS to different networks.
* [venus-periphery](https://github.com/VenusProtocol/venus-periphery): Auxiliary contracts for advanced DeFi operations including leverage strategies and token swaps.

## Isolated Pools Contracts

There are 2 categories of isolated pools contracts:

* Pool
* Risk Management

### Pool

Pool contracts can be divided into 4 categories:

* Configuration
* Logic
* Miscellaneous

#### Configuration

Configuration contracts are used to deploy, configure, and manage pools.

[**PoolRegistry**](/technical-reference/reference-isolated-pools/pool-registry/pool-registry)

Creating and managing pools is done by the [PoolRegistry](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Pool/PoolRegistry.sol). It can add markets to pools, update pool metadata, and return pool information.

#### Logic contracts

[**Comptroller**](/technical-reference/reference-isolated-pools/comptroller/comptroller)

The [Comptroller](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Comptroller.sol) contract is the central contract for each lending pool. It contains functionality central to borrowing activity in the pool like supplying and borrowing assets and liquidations. Configuration values for the pool such as the liquidation incentive, close factor, and collateral factor can also be set and retrieved from the comptroller. Account liquidity and positions can also be retrieved from the comptroller.

[**vToken**](/technical-reference/reference-isolated-pools/vtoken/vtoken)

[vTokens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/VToken.sol) in isolated lending play an identical role as vTokens in the Core Pool. They represent a users supplied tokens to the protocol and can be redeemed (burned) for those tokens.

#### Miscellaneous contracts

Isolated Pools use additional contracts such as lenses, rewards, ect.

[**RewardsDistributor**](/technical-reference/reference-isolated-pools/rewards-distributor)

Users are rewarded for borrowing and lending activities with a reward tokens. The [RewardsDistributor](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Rewards/RewardsDistributor.sol) manages these distributions using a configurable rate.

[**PoolLens**](/technical-reference/reference-isolated-pools/pool-lens)

To make querying pool data easier, Isolated Pools contains a [lens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Lens/PoolLens.sol) that queries and formats pool data. These calls can be gas intensive so as a general rule of thumb this contract should not be used in transactions.

#### Risk Management

[**RiskFundV2**](/technical-reference/reference-isolated-pools/risk-fund-and-shortfall/risk-fund-v2)

RiskFundV2 is the current BNB Chain mainnet custody contract for the risk-fund share of protocol income. It holds global raw token balances; the former per-pool reserve ledger was removed. Applying those funds to bad debt is not an automatic workflow and requires a scope-specific governance or operational action.

[**Shortfall**](/technical-reference/reference-isolated-pools/risk-fund-and-shortfall/shortfall)

Shortfall is the deployed legacy auction and transfer-debt recovery contract. New auction starts and restarts are paused on BNB Chain mainnet, and RiskFundV2 no longer exposes the per-pool reserve accounting on which that design depended. Keep the interface only for historical analysis and verified `claimTokenDebt` recovery.

[**ProtocolShareReserve**](/technical-reference/reference-isolated-pools/risk-fund-and-shortfall/protocol-share-reserve)

The [ProtocolShareReserve](https://github.com/VenusProtocol/protocol-reserve/blob/main/contracts/ProtocolReserve/ProtocolShareReserve.sol) remains a current, cross-pool income-accounting and distribution contract. Its on-chain configuration determines each schema's destinations and percentages.

## Oracle Contracts

[**ResilientOracle**](/technical-reference/reference-oracle/resilient-oracle)

Venus Protocol supports main, pivot, and fallback roles to create per-asset validation and fallback strategies. The [ResilientOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/ResilientOracle.sol) fetches prices for a vToken's underlying asset and manages the source address and enable flag for each role. Multiple roles are optional, so the live configuration must be checked before assuming that a price is cross-validated.

[**DeviationBoundedOracle**](/technical-reference/reference-oracle/deviation-bounded-oracle)

The [DeviationBoundedOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/DeviationBoundedOracle.sol) wraps the ResilientOracle to provide manipulation-resistant pricing for whitelisted assets on the borrow-power path. It maintains a per-asset rolling spot-price window and, when the spot deviates beyond a configured threshold, switches collateral pricing to `min(spot, windowMin)` and debt pricing to `max(spot, windowMax)`. Liquidations continue to use the spot price from the ResilientOracle. See [Protection Mode](/risk/protection-mode) for the feature-level description.

### Oracles

[**ChainlinkOracle**](/technical-reference/reference-oracle/oracles/chainlink-oracle)

[ChainlinkOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/ChainlinkOracle.sol) reads configured Chainlink feeds and normalizes their prices for the Venus oracle interface. Its role is configured per asset; it is not necessarily the main source for every market.

[**RedStoneOracle**](https://redstone.finance/)

[RedstoneOracle](https://docs.redstone.finance/docs/stage1-market-data/price-feeds/push-model/) is used in the Push model (formerly Classic; Chainlink-compatible interface) as a pivot oracle to validate prices returned by main and fallback oracles.

[**BinanceOracle**](/technical-reference/reference-oracle/oracles/binance-oracle)

The [BinanceOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/BinanceOracle.sol) fetches configured Binance oracle feeds. Like every source adapter, whether it is main, pivot, fallback, disabled, or unused is determined by the live per-asset configuration.

## Venus Protocol

Venus Protocol contracts can be grouped as follows:

* Lending
* Tokens
* Vault
* Lens

### Lending Contracts

[**Comptroller**](/technical-reference/reference-core-pool/comptroller/diamond/diamond)

At the heart of the Core Pool is the comptroller. The latest version is [Comptroller](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Comptroller/Diamond/Diamond.sol). The comptroller is responsible for listing markets, managing user's positions in markets, liquidations, and emitting rewards. It contains setters and getters for market configuration variables such as collateral factor, close factor, and liquidation incentive. Lending actions can be be paused globally or per market from the comptroller.

[**JumpRateModel**](/technical-reference/reference-core-pool/interestratemodels/jumpmodel)

Each market gets deployed with an interest rate model. The [JumpRateModel](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/InterestRateModels/JumpRateModel.sol) uses a linear curve to determine interest rates based on supply and demand of the asset until it reaches the kink after which there is a sharp increase in rates.

[**WhitePaperInterestRateModel**](/technical-reference/reference-core-pool/interestratemodels/whitepapermodel)

Another interest rate model that can be deployed with markets is the [WhitePaperInterestRateModel](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/InterestRateModels/WhitePaperInterestRateModel.sol). It is similar to the JumpRateModel except it doesn't include a kink. Instead it contains a fixed base rate.

[**Liquidator**](/technical-reference/reference-core-pool/liquidator)

When a borrow becomes insolvent it may be liquidated. The [Liquidator](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Liquidator/Liquidator.sol) handles this process. When a borrow is liquidated the seized amount is split between the liquidator and the [treasury](/technical-reference/reference-core-pool/vtreasury)

[**VTreasury**](/technical-reference/reference-core-pool/vtreasury)

Revenue earned by the protocol is kept in the [VTreasury](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Governance/VTreasury.sol).

### Token Contracts

[**XVS**](/tokens/xvs)

XVS is an important token in the Venus ecosystem because it powers Venus governance. The [XVS](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/XVS/XVS.sol) token contract defines a lockable BEP20 token with additional methods that enable voting and vote delegation. To vote, a user must first lock their XVS in the vault.

[**VAI**](/tokens/vai)

[VAI](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VAI/VAI.sol) is the Venus stable coin that can be minted against collateral. Users who mint VAI are charged a fee based on the outstanding supply and price of VAI to keep its value pegged at $1. The [VAIController](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Tokens/VAI/VAIController.sol) controls the amount of VAI a user is allowed to mint which is determined by the collateral a user has provided and their liquidity.

[**vTokens**](/technical-reference/reference-core-pool/vtoken)

When a user supplies a token to the protocol, vTokens are minted to represent their supply. The [VToken](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VTokens/VBep20.sol) contract contains methods that support lending activities for the asset including lending, borrowing and liquidating

### Vault Contracts

**XVS Vault**

XVS can be locked in the [XVSVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/XVSVault/XVSVault.sol) to earn XVS and enable voting. Each XVS locked gives the locking address one vote to use or delegate.

**VAI Vault**

VAI staked in the [VAIVault](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/VAIVault/VAIVault.sol) earned XVS until [VIP-662](https://app.venus.io/#/governance/proposal/662?chainId=56) set the Comptroller's VAI Vault XVS rate to 0 on September 21, 2026. No new XVS accrues to stakers; XVS accrued before that remains claimable.

#### Misc Contracts

**ComptrollerLens**

The [ComptrollerLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/ComptrollerLens.sol) contains methods for fetching the liquidity of an account and the amount of tokens that can be seized for a repayable amount

**SnapshotLens**

The [SnapshotLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/SnapshotLens.sol) contains methods for getting the details of account for a specific market or all markets where an account is active.

**VenusLens**

Protocol level data is made available through the [VenusLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/VenusLens.sol). It contains getters related to XVS distribution, governance, and markets.

### Governance Contracts

There are three main Governance contracts:

* GovernorBravoDelegate
* AccessControlManager
* Timelock

**GovernorBravoDelegate**

The core logic for governance proposals is in the [GovernorBraveDelegate](https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/GovernorBravoDelegate.sol) contract. It enables submitting proposals, moving proposals through time-gated stages, canceling and executing proposals as well as voting logic. The voting threshold as well as timelocks are set on this contract.

**AccessControlManager**

To enhance security of the protocol, Venus Protocol uses the [AccessControlManager](https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/AccessControlManager.sol) to grant accounts access to call specific functions on contracts. This contract is responsible for granting and revoking those permissions. It also provides a getter to check if an address is allowed to call a specific function.

**Timelock** Once a proposal has succeeded its execution is managed by the [Timelock](https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/Timelock.sol) contract. The Timelock can place the proposal in a queue for execution and execute the proposal. It also enables canceling the proposal.

## Periphery Contracts

Periphery contracts extend core protocol functionality with auxiliary features for advanced DeFi operations.

[**LeverageStrategiesManager**](/technical-reference/reference-periphery/leverage-strategies-manager)

The [LeverageStrategiesManager](https://github.com/VenusProtocol/venus-periphery/blob/main/contracts/LeverageManager/LeverageStrategiesManager.sol) enables users to enter and exit leveraged positions atomically using flash loans. It consolidates multiple operations (borrow, swap, supply) into single transactions.

[**SwapHelper**](/technical-reference/reference-periphery/swap-helper)

The [SwapHelper](https://github.com/VenusProtocol/venus-periphery/blob/main/contracts/SwapHelper/SwapHelper.sol) provides a secure multicall interface for token swaps with backend signature verification. It enables authorized interactions with external DEX protocols.
