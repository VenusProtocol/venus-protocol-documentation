# Contracts Overview

Venus Protocol contracts are divided in these repositories:

* [isolated-pools](https://github.com/VenusProtocol/isolated-pools): Contains core contracts for isolated lending, including logic for supplying, borrowing, liquidations, pool and market deployments, and interest rate models.
* [oracle](https://github.com/VenusProtocol/oracle): This repo has contracts for oracles that we support as well as logic for validating prices returned from those oracles.
* [venus-protocol](https://github.com/VenusProtocol/venus-protocol): The core protocol is located in this repo. It contains logic central to lending and borrowing of the core pool.
* [governance-contracts](https://github.com/VenusProtocol/governance-contracts): The contracts used for proposing, voting and executing changes are kept in the \`governance-contracts repo.
* [token-bridge](https://github.com/VenusProtocol/token-bridge): The contracts use to bridge XVS to different networks.

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

[**PoolRegistry**](reference-isolated-pools/pool-registry/pool-registry.md)

Creating and managing pools is done by the [PoolRegistry](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Pool/PoolRegistry.sol). It can add markets to pools, update pool metadata, and return pool information.

#### Logic contracts

[**Comptroller**](reference-isolated-pools/comptroller/comptroller.md)

The [Comptroller](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Comptroller.sol) contract is the central contract for each lending pool. It contains functionality central to borrowing activity in the pool like supplying and borrowing assets and liquidations. Configuration values for the pool such as the liquidation incentive, close factor, and collateral factor can also be set and retrieved from the comptroller. Account liquidity and positions can also be retrieved from the comptroller.

[**vToken**](reference-isolated-pools/vtoken/vtoken.md)

[vTokens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/VToken.sol) in isolated lending play an identical role as vTokens in the Core Pool. They represent a users supplied tokens to the protocol and can be redeemed (burned) for those tokens.

#### Miscellaneous contracts

Isolated Pools use additional contracts such as lenses, rewards, ect.

[**RewardsDistributor**](reference-isolated-pools/rewards/rewards-distributor.md)

Users are rewarded for borrowing and lending activities with a reward tokens. The [RewardsDistributor](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Rewards/RewardsDistributor.sol) manages these distributions using a configurable rate.

[**PoolLens**](reference-isolated-pools/lens/pool-lens.md)

To make querying pool data easier, Isolated Pools contains a [lens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Lens/PoolLens.sol) that queries and formats pool data. These calls can be gas intensive so as a general rule of thumb this contract should not be used in transactions.

#### Risk Management

[**RiskFund**](reference-isolated-pools/risk-fund-and-shortfall/risk-fund.md)

Lending comes with the inherent risk that borrows will not be able to repay their loan, which is a threat to the protocol's insolvency. Venus mitigates this risk with a [RiskFund](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/RiskFund/RiskFund.sol). A percentage of protocol revenues is transferred to the RiskFund as it is accrued. When bad debt is detected, this fund can be auctioned off and used to cover the bad debt.

[**Shortfall**](reference-isolated-pools/risk-fund-and-shortfall/shortfall.md)

When bad deb is auctioned off the [Shortfall](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Shortfall/Shortfall.sol) contract is responsible for running the action and paying the winner.

[**ProtocolShareReserve**](reference-isolated-pools/risk-fund-and-shortfall/protocol-share-reserve.md)

The [ProtocolShareReserve](https://github.com/VenusProtocol/protocol-reserve/blob/main/contracts/ProtocolReserve/ProtocolShareReserve.sol) acts as a treasury where each isolated pool can transfer their revenue.

## Oracle Contracts

[**ResilientOracle**](reference-oracle/resilient-oracle.md)

Venus Protocol implements secondary, primary and pivot oracles to create a validation and fallback strategy that avoids creating a single point of a failure by relying on a single source for prices. The [ResilientOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/ResilientOracle.sol) contract is responsible for fetching and validating prices for a given vToken and managing which oracles are used for a particular vToken.

### Oracles

[**ChainlinkOracle**](reference-oracle/oracles/chainlink-oracle.md)

[ChainLinkOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/ChainlinkOracle.sol) is the primary oracle. If a token isn't support by Chainlink then prices will be fetched from a secondary oracle.

[**RedStoneOracle**](https://redstone.finance/)

[RedstoneOracle](https://docs.redstone.finance/docs/smart-contract-devs/get-started/redstone-classic) is used in the Classic model (Chainlink-compatible interface) as a pivot oracle to validate prices returned by main and fallback oracles.

[**BinanceOracle**](reference-oracle/oracles/binance-oracle.md)

[BinanceOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/BinanceOracle.sol) contract is responsible for fetching token prices from the Binance oracle. It is used as a secondary oracle.

[**PythOracle**](broken-reference)

[PythOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/PythOracle.sol) is used as a pivot oracle to validate prices returned by primary and secondary oracles.

## Venus Protocol

Venus Protocol contracts can be grouped as follows:

* Lending
* Tokens
* Vault
* Lens

### Lending Contracts

[**Comptroller**](reference-core-pool/comptroller/Diamond/Diamond.md)

At the heart of the Core Pool is the comptroller. The latest version is [Comptroller](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Comptroller/Diamond/Diamond.sol). The comptroller is responsible for listing markets, managing user's positions in markets, liquidations, and emitting rewards. It contains setters and getters for market configuration variables such as collateral factor, close factor, and liquidation incentive. Lending actions can be be paused globally or per market from the comptroller.

[**JumpRateModel**](reference-core-pool/interest-rate-models/jump-model.md)

Each market gets deployed with an interest rate model. The [JumpRateModel](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/InterestRateModels/JumpRateModel.sol) uses a linear curve to determine interest rates based on supply and demand of the asset until it reaches the kink after which there is a sharp increase in rates.

[**WhitePaperInterestRateModel**](reference-core-pool/interest-rate-models/white-paper-interest-rate-model.md)

Another interest rate model that can be deployed with markets is the [WhitePaperInterestRateModel](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/InterestRateModels/WhitePaperInterestRateModel.sol). It is similar to the JumpRateModel except it doesn't include a kink. Instead it contains a fixed base rate.

[**Liquidator**](reference-core-pool/liquidator.md)

When a borrow becomes insolvent it may be liquidated. The [Liquidator](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Liquidator/Liquidator.sol) handles this process. When a borrow is liquidated the seized amount is split between the liquidator and the [treasury](reference-core-pool/vtreasury.md)

[**VTreasury**](reference-core-pool/vtreasury.md)

Revenue earned by the protocol is kept in the [VTreasury](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Governance/VTreasury.sol).

### Token Contracts

[**XVS**](../tokens/xvs.md)

XVS is an important token in the Venus ecosystem because it powers Venus governance. The [XVS](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/XVS/XVS.sol) token contract defines a lockable BEP20 token with additional methods that enable voting and vote delegation. To vote, a user must first lock their XVS in the vault. The [XVSVesting](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/XVS/XVSVesting.sol) controlled XVS emissions when converting VRT to XVS. The time period to convert VRT to XVS has expired.

[**VAI**](../tokens/vai.md)

[VAI](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VAI/VAI.sol) is the Venus stable coin that can be minted against collateral. Users who mint VAI are charged a fee based on the outstanding supply and price of VAI to keep its value pegged at $1. The [VAIController](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Tokens/VAI/VAIController.sol) controls the amount of VAI a user is allowed to mint which is determined by the collateral a user has provided and their liquidity.

**VRT**

The Venus Rewards Token (VRT) is composed two contracts - the token contract and the converter contract. The [VRT](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VRT/VRT.sol) token contract defines a lockable BEP20 token, which allows the token to be staked in order to earn additional VRT tokens. The [VRTConverter](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VRT/VRTConverter.sol) allows VRT to be converted to XVS.

[**vTokens**](reference-core-pool/vtoken.md)

When a user supplies a token to the protocol, vTokens are minted to represent their supply. The [VToken](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VTokens/VBep20.sol) contract contains methods that support lending activities for the asset including lending, borrowing and liquidating

### Vault Contracts

**XVS Vault**

XVS can be locked in the [XVSVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/XVSVault/XVSVault.sol) to earn XVS and enable voting. Each XVS locked gives the locking address one vote to use or delegate.

**VAI Vault**

VAI staked in the [VAIVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Vault/VAIVault.sol) earn XVS. Staking rewards are accumulated daily.

**VRT Vault**

The [VRTVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/VRTVault/VRTVault.sol) allows users to stake VRT and earn VRT daily. Rewards are accrued daily similar to the other vaults.

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
