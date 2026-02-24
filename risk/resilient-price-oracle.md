# Resilient Price Oracle

### Overview

In its previous version, Venus was fully reliant on the Chainlink price oracle for fetching prices. This dependence, while generally reliable, created a single point of failure. An erroneous or stale price could, without a secondary mechanism for validation, pose threats such as unwarranted liquidations or inflated borrowing.

In light of these risks, Venus V4 introduces the Resilient Price Oracle, a more robust system capable of pulling data from multiple sources for cross-validation. The Resilient Oracle is equipped with an algorithm to verify prices between two or more sources, providing a safeguard in cases where the primary source proves unreliable or fails.

Furthermore, the improved oracle infrastructure supports the integration of new price oracles in real-time and permits the enabling and disabling of price oracles per token.

### Key Features

#### Resilient Price Feeds

The Resilient Price Feeds replace the single source price provider used in the Comptroller contract with a more robust and reliable solution. This new component not only fetches asset prices from various on-chain sources but also includes a fallback mechanism to protect the protocol from oracle failures. Presently, this feature incorporates Chainlink, RedStone, Pyth Network and Binance oracles, with the possibility of adding more in the future.

#### Governance Configurations

The Resilient Price Feeds system can be configured by the Venus governance via Venus Improvement Proposals (VIPs). These configurations include pause and resume functionalities for the oracle, price feed configurations, and fixed price settings, among others.

### Safety Measures

In implementing the Resilient Price Oracle, several safety measures have been adopted to ensure the security and continuity of the Venus Protocol:

* **Price Continuity:** Asset prices pre and post upgrade were validated in a simulated environment to ensure consistency.
* **Testnet Deployment:** The oracles have been deployed and tested in the Venus Protocol testnet environment.
* **Auditing:** The code has been audited by OpenZeppelin, Peckshield, Certik, and Hacken.

<figure><img src="../.gitbook/assets/17b75928-d6a2-4207-9a0b-89d1d41690d4.png" alt=""><figcaption></figcaption></figure>

### Correlated Token Oracles

For correlated tokens, like Liquid Staked Tokens (LST), best practice suggests oracles quote first smart contracts to get the exchange rate between the correlated assets, and then multiply that by the USD market price of the second token to complete the calculation.

In Venus we use dedicated oracles for each LST asset in order to calculate the price as follows:

* convert the LST to the underlying tokens (using the exchange rate provided by the LST contracts)
* convert the underlying token calculated in the previous step to USD, using a “traditional” oracle based on market price

The current list of correlated token oracles in Venus is:

* `AnkrBNBOracle`. It returns the USD price of the [ankrBNB](https://bscscan.com/address/0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827) token, converting on-chain from ankrBNB to BNB using the exchange rate from the ankrBNB contract.
* `BNBxOracle`. It returns the USD price of the [BNBx](https://bscscan.com/address/0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275) token, converting on-chain from BNBx to BNB using the exchange rate from the [stake manager](https://bscscan.com/address/0x3b961e83400D51e6E1AF5c450d3C7d7b80588d28) contract.
* `eBTCAccountantOracle` (instance of `EtherfiAccountantOracle`). It returns the USD price of the [eBTC](https://etherscan.io/token/0x657e8C867D8B37dCC18fA4Caead9C45EB088C642) token, converting on-chain from eBTC to WBTC using the exchange rate from the [Accountant](https://etherscan.io/address/0x1b293DC39F94157fA0D1D36d7e0090C8B8B8c13F) contract.
* `PendleOracle`. It returns the USD price of the PT Pendle token, converting on-chain from the PT token to the underlying token using a Pendle market contract.
* `SFraxOracle`. It returns the USD price of the [sFRAX](https://etherscan.io/token/0xa663b02cf0a4b149d2ad41910cb81e23e1c41c32) token, converting on-chain from sFRAX to FRAX using the exchange rate from the sFRAX contract.
* `SlisBNBOracle`. It returns the USD price of the [slisBNB](https://bscscan.com/address/0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B) token, converting on-chain from slisBNB to BNB using the exchange rate from the [stake manager](https://bscscan.com/address/0x1adB950d8bB3dA4bE104211D5AB038628e477fE6) contract.
* `AsBNBOracle`. It returns the USD price of the [asBNB](https://bscscan.com/address/0x77734e70b6E88b4d82fE632a168EDf6e700912b6) token, converting on-chain from asBNB to slisBNB using the exchange rate from the [asBNB minter](https://bscscan.com/address/0x2F31ab8950c50080E77999fa456372f276952fD8) contract.
* `StkBNBOracle`. It returns the USD price of the [stkBNB](https://bscscan.com/address/0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16) token, converting on-chain from stkBNB to BNB using the exchange rate from the [stake pool](https://bscscan.com/address/0xC228CefDF841dEfDbD5B3a18dFD414cC0dbfa0D8) contract.
* `WBETHOracle`. It returns the USD price of the [WBETH](https://bscscan.com/address/0xa2e3356610840701bdf5611a53974510ae27e2e1) token, converting on-chain from WBETH to BNB using the exchange rate from the WBETH contract.
* `WeETHOracle`. It returns the USD price of the [weETH](https://etherscan.io/token/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee) token, converting on-chain from weETH to eETH using the exchange rate from the [liquidity pool](https://etherscan.io/address/0x308861A430be4cce5502d0A12724771Fc6DaF216) contract, and assumming 1 eETH = 1 ETH.
* `WeETHsOracle` (instance of `WeETHAccountantOracle`). It returns the USD price of the [weETHs](https://etherscan.io/token/0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88) token, converting on-chain from weETHs to WETH using the exchange rate from the [Accountant](https://etherscan.io/address/0xbe16605B22a7faCEf247363312121670DFe5afBE) contract.
* `WstETHOracle`. It returns the USD price of the [wstETH](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0) token, converting on-chain from wstETH to stETH using the exchange rate from the [stETH](https://etherscan.io/token/0xae7ab96520de3a18e5e111b5eaab095312d7fe84) contract, and assumming 1 stETH = 1 ETH.

{% hint style="warning" %}

**Assumption on Liquid Staked Tokens**

`WeETHOracle` and `WstETHOracle` assume a 1:1 price ratio between the LST and the underlying asset (e.g. 1 ETH = 1 stETH). The primary risks associated with this approach involve smart contract vulnerabilities and counterparty risks that could impact the redemption processes of the LSTs. In cases of substantial counterparty risk, particularly if the underlying tokens are not redeemable against the LSTs, the direct smart contract pricing might become unreliable. Here's our plan to mitigate such situations:

* We will deploy two on-chain oracles for each LST token:
  * The first oracle will return the price based on the assumption of a 1:1 ratio between the LST token and the underlying asset.
  * The second oracle will return the price based on a secondary market feed (using Chainlink, for instance).
* By default, the `ResilientOracle` will be configured to use only the oracle assuming a 1:1 ratio between the LST asset and the underlying, serving as the primary oracle.
* The second oracle, which derives price from the market price feed without assuming a 1:1 ratio, will not be initially configured in our `ResilientOracle`.
* We have implemented an off-chain monitoring system to track the prices returned by both oracles. In the event of a significant deviation over an extended period, the situation will be reviewed. It will be determined whether to switch the primary oracle from the one assuming a 1:1 ratio to the one that does not, or whether to temporarily include the latter as a pivot oracle in the `ResilientOracle` configuration.

{% endhint %}

### Current configuration

#### BNB chain

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | AAVE | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | ADA | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | asBNB | [AsBNBOracle](https://bscscan.com/address/0x52375ACab348Fa3979503EB9ADB11D74560dEe99) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | BCH | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | BETH (Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | - |
| Core | BNB | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | BTCB | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | BUSD (Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | - | [Price fixed to $1](https://app.venus.io/#/governance/proposal/226?chainId=56) |
| Core | CAKE | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | DAI | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | DOGE | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | DOT | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | ETH | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | FDUSD | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | FIL | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | LINK | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | lisUSD | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | - | |
| Core | LTC | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | MATIC (Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | - | Price feed from [$POL](https://data.chain.link/feeds/bsc/mainnet/pol-usd) |
| Core | PT-sUSDE-26JUN2025 (Paused) | [PendleOracle-PT-sUSDe-26JUN2025](https://bscscan.com/address/0x176ca46D7DcB4e001b8ee5F12d0fcd6D279214f4) | - | - | |
| Core | SOL | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | SolvBTC | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | sUSDe | [sUSDeOneJumpRedstoneOracle](https://bscscan.com/address/0x2B2895104f958E1EC042E6Ba5cbfeCbAD3C5beDb) | [sUSDeOneJumpChainlinkOracle](https://bscscan.com/address/0xA67F01322AF8EBa444D788Ee398775b446de51a0) | [sUSDeOneJumpChainlinkOracle](https://bscscan.com/address/0xA67F01322AF8EBa444D788Ee398775b446de51a0) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | SXP(Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | - | |
| Core | THE | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | TRX | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | - | Upper bound: 1.01. Lower bound: 0.99 |
| Core | TRXOLD(Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | - | Upper bound: 1.01. Lower bound: 0.99 |
| Core | TUSD | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | TUSDOLD (Paused) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | - | |
| Core | TWT | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | UNI | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | USDC | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | USDe | [USDTChainlinkOracle](https://bscscan.com/address/0x22Dc2BAEa32E95AB07C2F5B8F63336CbF61aB6b8) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | Upper bound: 1.06. Lower bound: 0.94 |
| Core | USDT | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | USD1 | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | |
| Core | VAI | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | WBETH | [WBETHOracle](https://bscscan.com/address/0x49938fc72262c126eb5D4BdF6430C55189AEB2BA) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | XRP | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | - | Upper bound: 1.05. Lower bound: 0.95 |
| Core | xSolvBTC | [xSolvBTCOneJumpRedstoneOracle](https://bscscan.com/address/0xf5534f78Df9b610B19A63956d498d00CFaD8B9D3) | - | - | |
| Core | XVS | [RedStone](https://bscscan.com/address/0x8455EFA4D7Ff63b8BFD96AdD889483Ea7d39B70a) | [Chainlink](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | [Binance](https://bscscan.com/address/0x594810b741d136f1960141C0d8Fb4a91bE78A820) | Upper bound: 1.05. Lower bound: 0.95 |
| Core | U | [USDTChainlink (USDT feed, capped)](https://bscscan.com/address/0x22Dc2BAEa32E95AB07C2F5B8F63336CbF61aB6b8) | [Chainlink (USD1 feed)](https://bscscan.com/address/0x1B2103441A0A108daD8848D8F5d790e4D402921F) | - | Upper bound: 1.01. Lower bound: 0.99 |
| Core | PT-clisBNB-25JUN2026 | [PendleOracle-PT-clisBNB-25JUN2026](https://bscscan.com/address/0x0FfFBb55d51cD46cD10C7dc865Dc73BD76201310) | - | - | |

#### Ethereum

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | crvUSD | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | DAI | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | TUSD | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | USDC | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | USDT | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | WBTC | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | WETH | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | FRAX | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | LBTC | [LBTCOneJumpRedStoneOracle](https://etherscan.io/address/0x54B033D102db7DD734E0Ad649463E90fFA78D853) | - | - | |
| Core | EIGEN | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | sFRAX | [SFraxOracle](https://etherscan.io/address/0x1aDCE75BB3164bBf6060a4f44262df5414473110) | - | - | |
| Core | eBTC | [eBTCAccountantOracle](https://etherscan.io/address/0x04d6096A6F089047C7af6E4644D18fB766B8d4cE) | - | - | |
| Core | USDS | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | sUSDS | [sUSDS-ERC4646Oracle](https://etherscan.io/address/0xEC3865a8a5DCb8C507781DA17A38b754E3d01C50) | - | - | |
| Core | BAL | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |
| Core | yvUSDC-1 | [yvUSDC-1-ERC4646Oracle](https://etherscan.io/address/0x49C6858B3ce4F3829b716fD3FafCa6Cb4Ccb7843) | - | - | |
| Core | yvUSDS-1 | [yvUSDS-1-ERC4646Oracle](https://etherscan.io/address/0x50f97063b4097D4e81C4DD9c3278258A04DF15aA) | - | - | |
| Core | yvUSDT-1 | [yvUSDT-1-ERC4646Oracle](https://etherscan.io/address/0xE113AE8D80Fb6dfB3221e0A396e297Aa42813d0A) | - | - | |
| Core | yvWETH-1 | [yvWETH-1-ERC4646Oracle](https://etherscan.io/address/0x641817dE6c0E4f763C393AaD182E6C946e1a2e2b) | - | - | |
| Core | sUSDe | [sUSDe-ERC4626Oracle](https://etherscan.io/address/0xaE847E81ff6dD2bdFB1fD563ccB4f848c74D2B70) | - | - | |
| Core | USDe | [RedStone](https://etherscan.io/address/0x0FC8001B2c9Ec90352A46093130e284de5889C86) | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | tBTC | [Chainlink](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2) | - | - | |

#### opBNB mainnet

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | BTCB | [Binance](https://opbnbscan.com/address/0xB09EC9B628d04E1287216Aa3e2432291f50F9588) | - | - | |
| Core | ETH | [Binance](https://opbnbscan.com/address/0xB09EC9B628d04E1287216Aa3e2432291f50F9588) | - | - | |
| Core | FDUSD | [Binance](https://opbnbscan.com/address/0xB09EC9B628d04E1287216Aa3e2432291f50F9588) | - | - | |
| Core | USDT | [Binance](https://opbnbscan.com/address/0xB09EC9B628d04E1287216Aa3e2432291f50F9588) | - | - | |
| Core | WBNB | [Binance](https://opbnbscan.com/address/0xB09EC9B628d04E1287216Aa3e2432291f50F9588) | - | - | |

#### Arbitrum One

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | WBTC | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | WETH | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | USDC | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | USDT | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | gmWETH-USDC | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | gmBTC-USDC | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |
| Core | ARB | [SequencerChainlinkOracle](https://arbiscan.io/address/0x9cd9fcc7e3deda360de7c080590aad377ac9f113) | - | - | |

#### ZKsync Mainnet

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | WBTC | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | - | - | |
| Core | WETH | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | - | - | |
| Core | USDC | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | - | - | |
| Core | USDC\_E | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | - | - | |
| Core | USDT | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | - | - | |
| Core | ZK | [RedStoneOracle](https://explorer.zksync.io/address/0xFa1e65e714CDfefDC9729130496AB5b5f3708fdA) | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | [ChainlinkOracle](https://explorer.zksync.io/address/0x4FC29E1d3fFFbDfbf822F09d20A5BE97e59F66E5) | Upper bound: 1.01. Lower bound: 0.99 |
| Core | wstETH | [wstETHOneJumpChainlinkOracle](https://explorer.zksync.io/address/0x2DAaeb94E19145BA7633cAB2C38c76fD8c493198) | - | - | |
| Core | wUSDM | [wUSDM-ERC4626Oracle](https://explorer.zksync.io/address/0x22cE94e302c8C80a6C2dCfa9Da6c5286e9f28692) | - | - | |
| Core | zkETH | [ZkETHOracle](https://explorer.zksync.io/address/0x407dE1229BCBD2Ec876d063F3F93c4D8a38bd81a) | - | - | Assume 1:1 for WETH:rzkETH |

#### Optimism Mainnet

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | WBTC | [SequencerChainlinkOracle](https://optimistic.etherscan.io/address/0x1076e5A60F1aC98e6f361813138275F1179BEb52) | - | - | |
| Core | WETH | [SequencerChainlinkOracle](https://optimistic.etherscan.io/address/0x1076e5A60F1aC98e6f361813138275F1179BEb52) | - | - | |
| Core | USDC | [SequencerChainlinkOracle](https://optimistic.etherscan.io/address/0x1076e5A60F1aC98e6f361813138275F1179BEb52) | - | - | |
| Core | USDT | [SequencerChainlinkOracle](https://optimistic.etherscan.io/address/0x1076e5A60F1aC98e6f361813138275F1179BEb52) | - | - | |
| Core | OP | [SequencerChainlinkOracle](https://optimistic.etherscan.io/address/0x1076e5A60F1aC98e6f361813138275F1179BEb52) | - | - | |

#### Base Mainnet

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | cbBTC | [ChainlinkOracle](https://basescan.org/address/0x6F2eA73597955DB37d7C06e1319F0dC7C7455dEb) | - | - | |
| Core | WETH | [ChainlinkOracle](https://basescan.org/address/0x6F2eA73597955DB37d7C06e1319F0dC7C7455dEb) | - | - | |
| Core | USDC | [ChainlinkOracle](https://basescan.org/address/0x6F2eA73597955DB37d7C06e1319F0dC7C7455dEb) | - | - | |
| Core | wsuperOETHb | [wsuperOETHb-ERC4626Oracle](https://basescan.org/address/0xcd1d2C99642165440c2CC023AFa2092b487f033e) | - | - | |
| Core | wstETH | [wstETHOneJumpChainlinkOracle](https://basescan.org/address/0xDDD4F0836c8016E11fC6741A4886E97B3c3d20C1) | - | - | |

#### Unichain Mainnet

| Pool | Market | MAIN oracle | PIVOT oracle | FALLBACK oracle | Notes |
|---|---|---|---|---|---|
| Core | WBTC | [RedStone](https://uniscan.xyz/address/0x4d41a36D04D97785bcEA57b057C412b278e6Edcc) | - | - | |
| Core | WETH | [RedStone](https://uniscan.xyz/address/0x4d41a36D04D97785bcEA57b057C412b278e6Edcc) | - | - | |
| Core | USDC | [RedStone](https://uniscan.xyz/address/0x4d41a36D04D97785bcEA57b057C412b278e6Edcc) | - | - | |
| Core | USD₮0 | [RedStone](https://uniscan.xyz/address/0x4d41a36D04D97785bcEA57b057C412b278e6Edcc) | - | - | |
| Core | UNI | [RedStone](https://uniscan.xyz/address/0x4d41a36D04D97785bcEA57b057C412b278e6Edcc) | - | - | |
| Core | weETH | [weETHOneJumpOracle](https://uniscan.xyz/address/0xF9ECA470E2458Fe2B6FcAe660bEd1e2C0FB87E01) | - | - | |
| Core | wstETH | [wstETHOneJumpOracle](https://uniscan.xyz/address/0x3938D6414c261C6F450f1bD059DF9af2BBfb603D) | - | - | |

### Further Reading

For more detailed information, refer to the following resources:

#### Audit reports

* [Resilient Price Oracle](../security-and-audits.md#oracles)
* [Resilient Price Oracle upgrade](../security-and-audits.md#oracles-upgrade-2023-07-24)
* [WstETH oracle](../security-and-audits.md#oracle-for-wsteth)
* [Correlated token oracles](../security-and-audits.md#correlated-token-oracles)

#### References

* [Repository](https://github.com/VenusProtocol/oracle)
* [Community post about Venus V4, introducing Resilient Price Feeds](https://community.venus.io/t/proposing-venus-v4/3188#price-feed-redundancy-6)
* [Venus Stars blog post about Binance Oracle](https://venusstars.io/community/index.php/2023/05/09/venus-enhances-resilience-binance-oracle-feeds/)
