# Governance - Deployed Contracts

## BNB Chain Mainnet

* Governor Bravo Delegate: [`0x360ac19648efc29d2b7b70bac227c35e909272fd`](https://bscscan.com/address/0x360ac19648efc29d2b7b70bac227c35e909272fd)
* Governor Bravo Delegator: [`0x2d56dc077072b53571b8252008c60e945108c75a`](https://bscscan.com/address/0x2d56dc077072b53571b8252008c60e945108c75a)
* Access Control Manager: [`0x4788629abc6cfca10f9f969efdeaa1cf70c23555`](https://bscscan.com/address/0x4788629abc6cfca10f9f969efdeaa1cf70c23555)
* Normal Timelock: [`0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396`](https://bscscan.com/address/0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396)
* FastTrack Timelock: [`0x555ba73dB1b006F3f2C7dB7126d6e4343aDBce02`](https://bscscan.com/address/0x555ba73dB1b006F3f2C7dB7126d6e4343aDBce02)
* Critical Timelock: [`0x213c446ec11e45b15a6E29C1C1b402B8897f606d`](https://bscscan.com/address/0x213c446ec11e45b15a6E29C1C1b402B8897f606d)
* Guardians:
  * Guardian 1: [`0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9`](https://bscscan.com/address/0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9) - critical risk parameters
  * Guardian 2: [`0x1C2CAc6ec528c20800B2fe734820D87b581eAA6B`](https://bscscan.com/address/0x1C2CAc6ec528c20800B2fe734820D87b581eAA6B) - pause and resume features
  * Guardian 3: [`0x3a3284dC0FaFfb0b5F0d074c4C704D14326C98cF`](https://bscscan.com/address/0x3a3284dC0FaFfb0b5F0d074c4C704D14326C98cF) - oracles

<!---
Specific functions that can be invoked by the guardians

<details>
<summary>Guardian 1</summary>

* Core pool Comptroller
  * `_setCollateralFactor`
  * `_setMarketBorrowCaps`
  * `_setMarketSupplyCaps`

* Isolated pools Comptrollers
  * `setCollateralFactor`
  * `setMarketBorrowCaps`
  * `setMarketSupplyCaps`

</details>

<details>
<summary>Guardian 2</summary>

* Core pool Comptroller
  * `_setProtocolPaused`
  * `_setActionsPaused`

* Isolated pools Comptrollers
  * `setActionsPaused`

* Shortfall
  * `pauseAuctions`
  * `resumeAuctions`

* PegStability
  * `pause`
  * `resume`

* PrimeLiquidityProvider
  * `pauseFundsTransfer`
  * `resumeFundsTransfer`

* XVSBridgeAdmin
  * `pause`
  * `unpause`

</details>

<details>
<summary>Guardian 3</summary>

* ResilientOracle
  * `pause`
  * `unpause`
  * `setTokenConfig`

* ChainlinkOracle
  * `setDirectPrice`
  * `setTokenConfig`

* PythOracle
  * `setTokenConfig`
</details>
-->

## BNB Chain Testnet

* Governor Bravo Delegate: [`0x4baf88aba7f86f6540728bef454b224c5d2215e7`](https://testnet.bscscan.com/address/0x4baf88aba7f86f6540728bef454b224c5d2215e7)
* Governor Bravo Delegator: [`0x5573422a1a59385c247ec3a66b93b7c08ec2f8f2`](https://testnet.bscscan.com/address/0x5573422a1a59385c247ec3a66b93b7c08ec2f8f2)
* Access Control Manager: [`0x45f8a08F534f34A97187626E05d4b6648Eeaa9AA`](https://testnet.bscscan.com/address/0x45f8a08F534f34A97187626E05d4b6648Eeaa9AA)
* Normal Timelock: [`0xce10739590001705F7FF231611ba4A48B2820327`](https://testnet.bscscan.com/address/0xce10739590001705F7FF231611ba4A48B2820327)
* FastTrack Timelock: [`0x3CFf21b7AF8390fE68799D58727d3b4C25a83cb6`](https://testnet.bscscan.com/address/0x3CFf21b7AF8390fE68799D58727d3b4C25a83cb6)
* Critical Timelock: [`0x23B893a7C45a5Eb8c8C062b9F32d0D2e43eD286D`](https://testnet.bscscan.com/address/0x23B893a7C45a5Eb8c8C062b9F32d0D2e43eD286D)
* Omnichain Proposal Sender: [`0xCfD34AEB46b1CB4779c945854d405E91D27A1899`](https://testnet.bscscan.com/address/0xCfD34AEB46b1CB4779c945854d405E91D27A1899)


## Ethereum mainnet

* Access Control Manager: [`0x230058da2D23eb8836EC5DB7037ef7250c56E25E`](https://etherscan.io/address/0x230058da2D23eb8836EC5DB7037ef7250c56E25E)
* Guardian: [`0x285960C5B22fD66A736C7136967A3eB15e93CC67`](https://etherscan.io/address/0x285960C5B22fD66A736C7136967A3eB15e93CC67)

## Sepolia (Ethereum testnet)

* Access Control Manager: [`0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96`](https://sepolia.etherscan.io/address/0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96)
* Guardian: [`0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb`](https://sepolia.etherscan.io/address/0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb)
* Normal Timelock: [`0xc332F7D8D5eA72cf760ED0E1c0485c8891C6E0cF`](https://sepolia.etherscan.io/address/0xc332F7D8D5eA72cf760ED0E1c0485c8891C6E0cF)
* FastTrack Timelock: [`0x7F043F43Adb392072a3Ba0cC9c96e894C6f7e182`](https://sepolia.etherscan.io/address/0x7F043F43Adb392072a3Ba0cC9c96e894C6f7e182)
* Critical Timelock: [`0xA24A7A65b8968a749841988Bd7d05F6a94329fDe`](https://sepolia.etherscan.io/address/0xA24A7A65b8968a749841988Bd7d05F6a94329fDe)
* Omnichain Governance Executor: [`0xD9B18a43Ee9964061c1A1925Aa907462F0249109`](https://sepolia.etherscan.io/address/0xD9B18a43Ee9964061c1A1925Aa907462F0249109)
* Omnichain Executor Owner Proxy: [`0xf964158C67439D01e5f17F0A3F39DfF46823F27A`](https://sepolia.etherscan.io/address/0xf964158C67439D01e5f17F0A3F39DfF46823F27A)
* Omnichain Executor Owner Implementation: [`0x553f01f2c693Cf9B81cC77BACc59dD71E7a14740`](https://sepolia.etherscan.io/address/0x553f01f2c693Cf9B81cC77BACc59dD71E7a14740)


## opBNB mainnet

* Access Control Manager: [`0xA60Deae5344F1152426cA440fb6552eA0e3005D6`](https://opbnbscan.com/address/0xA60Deae5344F1152426cA440fb6552eA0e3005D6)
* Guardian: [`0xC46796a21a3A9FAB6546aF3434F2eBfFd0604207`](https://opbnbscan.com/address/0xC46796a21a3A9FAB6546aF3434F2eBfFd0604207)

## opBNB testnet

* Access Control Manager: [`0x049f77F7046266d27C3bC96376f53C17Ef09c986`](https://testnet.opbnbscan.com/address/0x049f77F7046266d27C3bC96376f53C17Ef09c986)
* Guardian: [`0xb15f6EfEbC276A3b9805df81b5FB3D50C2A62BDf`](https://testnet.opbnbscan.com/address/0xb15f6EfEbC276A3b9805df81b5FB3D50C2A62BDf)
* Normal Timelock: [`0x1c4e015Bd435Efcf4f58D82B0d0fBa8fC4F81120`](https://testnet.opbnbscan.com/address/0x1c4e015Bd435Efcf4f58D82B0d0fBa8fC4F81120)
* FastTrack Timelock: [`0xB2E6268085E75817669479b22c73C2AfEaADF7A6`](https://testnet.opbnbscan.com/address/0xB2E6268085E75817669479b22c73C2AfEaADF7A6)
* Critical Timelock: [`0xBd06aCDEF38230F4EdA0c6FD392905Ad463e42E3`](https://testnet.opbnbscan.com/address/0xBd06aCDEF38230F4EdA0c6FD392905Ad463e42E3)
* Omnichain Governance Executor: [`0x0aa644c4408268E9fED5089A113470B6e706bc0C`](https://testnet.opbnbscan.com/address/0x0aa644c4408268E9fED5089A113470B6e706bc0C)
* Omnichain Executor Owner Proxy: [`0x4F570240FF6265Fbb1C79cE824De6408F1948913`](https://testnet.opbnbscan.com/address/0x4F570240FF6265Fbb1C79cE824De6408F1948913)
* Omnichain Executor Owner Implementation: [`0x8900AEC43bdf3615fe41e6D7280073A986e89Df6`](https://testnet.opbnbscan.com/address/0x8900AEC43bdf3615fe41e6D7280073A986e89Df6)

## Arbitrum One

* Guardian: [`0x14e0E151b33f9802b3e75b621c1457afc44DcAA0`](https://arbiscan.io/address/0x14e0e151b33f9802b3e75b621c1457afc44dcaa0)

## Arbitrum Sepolia

* Guardian: [`0x1426A5Ae009c4443188DA8793751024E358A61C2`](https://sepolia.arbiscan.io/address/0x1426A5Ae009c4443188DA8793751024E358A61C2)
