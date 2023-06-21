TODO: REVIEW! (links and content)

# Contracts Overview

## Contracts Overview

Venus Protocol contracts are divided in three repositories:

- [isolated-pools](https://github.com/VenusProtocol/isolated-pools): Contains core contracts for isolated lending, including logic for suppling, borrowing, liquidations, pool and market deployments, and interest rate models.
- [oracle](https://github.com/VenusProtocol/oracle): This repo has contracts for oracles that we support as well as logic for validating prices returned from those oracles.
- [venus-protocol](https://github.com/VenusProtocol/venus-protocol): The core protocol is located in this repo. It contains logic central to lending and borrowing of the core pool as well as governance.

## Isolated Pools Contracts

There are 3 categories of isolated pools contracts:

- Governance
- Pool
- Risk Management

### Governance

#### [AccessControlManager](../governance-1/access-control-manager.md)

To enhance security of the protocol, Venus Protocol uses the [AccessControlManager](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Governance/AccessControlManager.sol) which grants accounts access to call specific functions on contracts. This contract is responsible for granting and revoking those permissions. It also provides a getter to check if an address is allowed to call a specific function.

### Pool

Pool contracts can be divided into 4 categories:

- Configuration
- Logic
- Misc

Configuration contracts are used to deploy, configure, and manage pools.

#### [PoolRegistry](../isolated-lending/pool-registry.md)

Creating and managing pools is done by the [PoolRegistry](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Pool/PoolRegistry.sol). It can add markets to pools, update pool metadata, and return pool information.

#### [VTokenProxyFactory](../isolated-lending/factories/VBep20-mmutable-proxy-factory.md)

When adding a markets to pools, the [VTokenProxyFactory](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Factories/VTokenProxyFactory.sol) is deployed for each market. It is the token that represents the underlying supplied asset.

#### [JumpRateModelFactory](../isolated-lending/factories/jump-rate-model.md)

In addition to a vToken, an interest rate model is also deployed when a market is launched. [JumpRateModelFactory](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Factories/JumpRateModelFactory.sol) is a factory to deploy the jump rate interest rate model. When using this modle interest follows a linear curve until supply or demand reaches the kink after which there is a steep increase in interest rates.

#### [WhitePaperInterestRateModelFactory](../isolated-lending/factories/white-paper-interest-rate-model-factory.md)

[WhitePaperInterestRateModelFactory](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Factories/WhitePaperInterestRateModelFactory.sol) is another interest rate model that can be deployed with a market. It is similar to the jump rate model but uses a base rate and doesn't include a kink.

Logic contracts

#### [Comptroller](../isolated-lending/pool.md)

The [Comptroller](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Comptroller.sol) contract is the central contract for each lending pool. It contains functinality central to borrowing activity in the pool such as supplying and borrowing assets and liquidations. Configuration values for the pool such as the liquidation incentive, close factor, and collateral factor can also be set and retrieved from the comptroller. Accout liquidity and positions can also be retrived from the comptroller.

#### [vToken](core-pool/vtokens.md)

[vTokens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/VToken.sol) in isolated lending play an identical role as vTokens in the Core Pool. They represent a users supplied tokens to the protocol and can be redeemed (burned) for those tokens.

Miscellaneous contracts include lenses, rewards, ect.

#### [RewardsDistributor](../isolated-lending/rewards-distributor.md)

Users are rewarded for borrowing and lending activities with a rewards token. The [RewardsDistributor](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Rewards/RewardsDistributor.sol) manages these distributions using a configurable rate.

#### [PoolLens](../isolated-lending/lens.md)

To make querying pool data easier, Isolated Pools contains a [lens](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Lens/PoolLens.sol) that queries and formats pool data. These calls can be gas intensive so the general rule of thumb is that this contract should not be used in transactions.

### Risk Mangement

#### [RiskFund](../isolated-lending/risk-fund/)

Lending comes with the inherint risk that borrows will not be able to repay their loan, which is a threat to the protocol's insolvency. Venus looks to mitigate this risk with a [RiskFund](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/RiskFund/RiskFund.sol). A percentage of protocol revenus is transfered to the RiskFund. When bad debt is detected, this fund can be auctioned off and used to cover the bad debt.

#### [Shortfall](../isolated-lending/risk-fund/shortfall.md)

When bad deb is auctioned off the [Shortfall](https://github.com/VenusProtocol/isolated-pools/tree/main/contracts/Shortfall.sol) contract is responsibile for running the action and paying the winner.

#### [ProtocolShareReserve](../isolated-lending/risk-fund/protocol-share-reserve.md)

The [ProtocolShareReserve](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/RiskFund/ProtocolShareReserve.sol) acts as a treasury where each isolated pool can transfer their revenue.

## Oracle Contracts

#### [ResilientOracle](../oracles/resilient-oracle.md)

Venus Protocol implements secondary, primary and pivot oracles to create a strategy that avoid creating a single point of a failure by relying on a single source for prices. The [ReslientOracle contract](https://github.com/VenusProtocol/oracle/blob/main/contracts/ResilientOracle.sol) is responsible for managing which the oracles that support a given token and fetching and validating prices for that token using its active oracles.

### Oracles

#### [ChainlinkOracle](../oracles/chainlink.md)

[ChainLinkOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/ChainlinkOracle.sol) is the primary oracle. If a token isn't support by Chainlink then prices will be fetched from a secondary oracle.

#### [BinanceOracle](../oracles/binance.md)

[BinanceOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/BinanceOracle.sol) contract is responsible for fetching token prices from the Binance oracle. It is used as a secondary oracle.

#### [TWAPOracle](../oracles/twap.md)

The [TWAP (Time Weighted Average Price) Oracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/TwapOracle.sol) is mainly used as a pivot oracle for validation but can also be used as a primary source if a token isn't supported by the primary and secondary oracles. This oracle also has a [pivot contract](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/PivotTwapOracle.sol).

#### [PythOracle](../oracles/pyth.md)

[PythOracle](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/PythOracle.sol) is used as a pivot oracle to validate prices returned by primary and secondary oracles. This oracle also has a [pivot contract](https://github.com/VenusProtocol/oracle/blob/main/contracts/oracles/PivotPythOracle.sol).

### Venus Protocol

Venus Protocol contracts can be grouped as follows:

- Governance
- Lending
- Tokens
- Vault
- Lens

**Governance Contracts**

#### [GovernorBravoDelegate](../governance-1/bravo/)

The core logic for governance proposals is in the [GovernorBraveDelegate](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Governance/GovernorBravoDelegate.sol) contract. It enables submitting proposals, moving proposals through time-gated stages, canceling and executing proposals as well as voting logic. The voting threshold as well as timelocks are set on this contract.

**Lending Contracts**

#### [Comptroller](../core-pool/comptroller.md)

At the heart of the Core Pool is the comptroller. The latever version is [Comptroller](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Comptroller.sol). Previous versions are also kept in the repo. The comptroller is responsibile for listing markets, managing user's positions in markets, liquidations, and emitting rewards. It contains setters and getters for market configuration variables such as collateral factor, close factor, and liquidation incentive. Lending actions can be be paused globally or per market from the comptroller.

#### [JumpRateModel](../core-pool/jump-model.md)

Each market gets deployed with an interest rate model. The [JumpRateModel](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/JumpRateModel.sol) uses a linear curve to determine interest rates based on supply and demand of the asset until it reaches the kink after which there is a sharp increase in rates.

#### [WhitePaperInterestRateModel](../core-pool/interest-rate-model.md)

Another interest rate model that can be deployed with markets is the [WhitePaperInterestRateModel](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/WhitePaperInterestRateModel.sol). It is similar to the JumpRateModel except it doesn't include a kink. Instead it contains a fixed base rate.

#### [Liquidator](../core-pool/liquidator.md)

When a borrow becomes insolvent it maybe liquidated. The [Liquidator](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Liquidator.sol) handles this process. When a borrow is liquidated the seized amount is split between the liquidator and the [treasury](../core-pool/vtreasury.md)

#### [Maximillion](../core-pool/maximillion.md)

The [Maximillion](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Maximillion.sol) is a special contract for repaying debt owed in BNB.

#### [VTreasury](../core-pool/vtreasury.md)

Revenue earned by the protocol is kept in the [VTreasury](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/VTreasury.sol).

**Token Contracts**

#### [XVS](../tokens/xvs.md)

XVS is an important token in the Venus ecosystem because it powers Venus governance. The [XVS](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/XVS/XVS.sol) token contract defines a lockable BEP20 token with additional methods that enable voting and vote delegation. To vote, a user must first lock their XVS in the vault. The [XVSVesting](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/XVS/XVS.sol) controls XVS emissions when converting VRT to XVS.

#### [VAI](../tokens/vai.md)

[VAI](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VAI/VAI.sol) is the Venus stable coin that can be minted against collateral. Users who mint VAI are charged a fee based on the outstanding supply and price of VAI to keep its value pegged at $1. The [VAIController](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VAI/VAIController.sol) controls the amount of VAI a user is allowed to mint which is determined by the collateral a user has provided and their liquidity.

#### [VRT](broken-reference)

The Venus Rewareds Token (VRT) is composed two contracts - the token contract and the converter contract. The [VRT](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VRT/VRT.sol) token contract defines a lockable BEP20 token, which allows the token to be staked in order to earn additional VRT tokens. The [VRTConverter](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VRT/VRTConverter.sol) allows VRT to be converted to XVS

#### [vTokens](../core-pool/vtokens.md)

When a user supplies a token to the protocol, they are minted vTokens to represent their supply. The [VToken](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Tokens/VTokens/VBep20.sol) contract contains methods that support lending activities for the asset including lending, borrowing and liquidating

**Vault Contracts**

#### XVS Vault

XVS can be locked in the [XVSVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Vault/XVSVault.sol) to earn XVS and enable voting. Each XVS locked gives the locking address one vote to use or delegate.

#### VAI Vault

VAI staked in the [VAIVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Vault/VAIVault.sol) earns XVS. Staking rewards are accumilated daily.

#### VRT Vault

The [VRTVault](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Vault/VRTVault.sol) allows users to stake VRT and earn VRT daily. Rewards are accrued daily similar to the other vaults.

**Misc Contracts**

#### ComptrollerLens

The [ComptrollerLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/ComptrollerLens.sol) contains methods for fetching the liquidity of an account and the amount of tokens that can be seized for a repayable amount

#### InterestRateModelLens

The [InterestRateModelLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/InterestRateModelLens.sol) contains a method for simulating interest rate curves.

#### SnapshotLens

The [SnapshotLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/SnapshotLens.sol) contains methods for getting the details of account for a specific market or all markets where an account is active.

#### VenusLens

Protocol level data is made available through the [VenusLens](https://github.com/VenusProtocol/venus-protocol/blob/main/contracts/Lens/VenusLens.sol). It contains getters related to XVS distribution, governance, and markets.
