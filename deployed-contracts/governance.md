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

* TwapOracle
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

## Ethereum mainnet

* Access Control Manager: [`0x230058da2D23eb8836EC5DB7037ef7250c56E25E`](https://etherscan.io/address/0x230058da2D23eb8836EC5DB7037ef7250c56E25E)
* Guardian: [`0x285960C5B22fD66A736C7136967A3eB15e93CC67`](https://etherscan.io/address/0x285960C5B22fD66A736C7136967A3eB15e93CC67)

## Sepolia (Ethereum testnet)

* Access Control Manager: [`0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96`](https://sepolia.etherscan.io/address/0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96)
* Guardian: [`0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb`](https://sepolia.etherscan.io/address/0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb)