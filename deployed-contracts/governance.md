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
* Omnichain Proposal Sender: [`0x36a69dE601381be7b0DcAc5D5dD058825505F8f6`](https://bscscan.com/address/0x36a69dE601381be7b0DcAc5D5dD058825505F8f6)

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
* Normal Timelock: [`0xd969E79406c35E80750aAae061D402Aab9325714`](https://etherscan.io/address/0xd969E79406c35E80750aAae061D402Aab9325714)
* FastTrack Timelock: [`0x8764F50616B62a99A997876C2DEAaa04554C5B2E`](https://etherscan.io/address/0x8764F50616B62a99A997876C2DEAaa04554C5B2E)
* Critical Timelock: [`0xeB9b85342c34F65af734C7bd4a149c86c472bC00`](https://etherscan.io/address/0xeB9b85342c34F65af734C7bd4a149c86c472bC00)
* Omnichain Governance Executor: [`0xd70ffB56E4763078b8B814C0B48938F35D83bE0C`](https://etherscan.io/address/0xd70ffB56E4763078b8B814C0B48938F35D83bE0C)
* Omnichain Executor Owner Proxy: [`0x87Ed3Fd3a25d157637b955991fb1B41B566916Ba`](https://etherscan.io/address/0x87Ed3Fd3a25d157637b955991fb1B41B566916Ba)

## Sepolia (Ethereum testnet)

* Access Control Manager: [`0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96`](https://sepolia.etherscan.io/address/0xbf705C00578d43B6147ab4eaE04DBBEd1ccCdc96)
* Guardian: [`0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb`](https://sepolia.etherscan.io/address/0x94fa6078b6b8a26f0b6edffbe6501b22a10470fb)
* Normal Timelock: [`0xc332F7D8D5eA72cf760ED0E1c0485c8891C6E0cF`](https://sepolia.etherscan.io/address/0xc332F7D8D5eA72cf760ED0E1c0485c8891C6E0cF)
* FastTrack Timelock: [`0x7F043F43Adb392072a3Ba0cC9c96e894C6f7e182`](https://sepolia.etherscan.io/address/0x7F043F43Adb392072a3Ba0cC9c96e894C6f7e182)
* Critical Timelock: [`0xA24A7A65b8968a749841988Bd7d05F6a94329fDe`](https://sepolia.etherscan.io/address/0xA24A7A65b8968a749841988Bd7d05F6a94329fDe)
* Omnichain Governance Executor: [`0xD9B18a43Ee9964061c1A1925Aa907462F0249109`](https://sepolia.etherscan.io/address/0xD9B18a43Ee9964061c1A1925Aa907462F0249109)
* Omnichain Executor Owner Proxy: [`0xf964158C67439D01e5f17F0A3F39DfF46823F27A`](https://sepolia.etherscan.io/address/0xf964158C67439D01e5f17F0A3F39DfF46823F27A)

## opBNB mainnet

* Access Control Manager: [`0xA60Deae5344F1152426cA440fb6552eA0e3005D6`](https://opbnbscan.com/address/0xA60Deae5344F1152426cA440fb6552eA0e3005D6)
* Guardian: [`0xC46796a21a3A9FAB6546aF3434F2eBfFd0604207`](https://opbnbscan.com/address/0xC46796a21a3A9FAB6546aF3434F2eBfFd0604207)
* Normal Timelock: [`0x10f504e939b912569Dca611851fDAC9E3Ef86819`](https://opbnbscan.com/address/0x10f504e939b912569Dca611851fDAC9E3Ef86819)
* FastTrack Timelock: [`0xEdD04Ecef0850e834833789576A1d435e7207C0d`](https://opbnbscan.com/address/0xEdD04Ecef0850e834833789576A1d435e7207C0d)
* Critical Timelock: [`0xA7DD2b15B24377296F11c702e758cd9141AB34AA`](https://opbnbscan.com/address/0xA7DD2b15B24377296F11c702e758cd9141AB34AA)
* Omnichain Governance Executor: [`0x82598878Adc43F1013A27484E61ad663c5d50A03`](https://opbnbscan.com/address/0x82598878Adc43F1013A27484E61ad663c5d50A03)
* Omnichain Executor owner proxy: [`0xf7e4c81Cf4A03d52472a4d00c3d9Ef35aF127E45`](https://opbnbscan.com/address/0xf7e4c81Cf4A03d52472a4d00c3d9Ef35aF127E45)

## opBNB testnet

* Access Control Manager: [`0x049f77F7046266d27C3bC96376f53C17Ef09c986`](https://testnet.opbnbscan.com/address/0x049f77F7046266d27C3bC96376f53C17Ef09c986)
* Guardian: [`0xb15f6EfEbC276A3b9805df81b5FB3D50C2A62BDf`](https://testnet.opbnbscan.com/address/0xb15f6EfEbC276A3b9805df81b5FB3D50C2A62BDf)
* Normal Timelock: [`0x1c4e015Bd435Efcf4f58D82B0d0fBa8fC4F81120`](https://testnet.opbnbscan.com/address/0x1c4e015Bd435Efcf4f58D82B0d0fBa8fC4F81120)
* FastTrack Timelock: [`0xB2E6268085E75817669479b22c73C2AfEaADF7A6`](https://testnet.opbnbscan.com/address/0xB2E6268085E75817669479b22c73C2AfEaADF7A6)
* Critical Timelock: [`0xBd06aCDEF38230F4EdA0c6FD392905Ad463e42E3`](https://testnet.opbnbscan.com/address/0xBd06aCDEF38230F4EdA0c6FD392905Ad463e42E3)
* Omnichain Governance Executor: [`0x0aa644c4408268E9fED5089A113470B6e706bc0C`](https://testnet.opbnbscan.com/address/0x0aa644c4408268E9fED5089A113470B6e706bc0C)
* Omnichain Executor Owner Proxy: [`0x4F570240FF6265Fbb1C79cE824De6408F1948913`](https://testnet.opbnbscan.com/address/0x4F570240FF6265Fbb1C79cE824De6408F1948913)

## Arbitrum One

* Access Control Manager: [`0xD9dD18EB0cf10CbA837677f28A8F9Bda4bc2b157`](https://arbiscan.io/address/0xD9dD18EB0cf10CbA837677f28A8F9Bda4bc2b157)
* Guardian: [`0x14e0E151b33f9802b3e75b621c1457afc44DcAA0`](https://arbiscan.io/address/0x14e0e151b33f9802b3e75b621c1457afc44dcaa0)
* Normal Timelock: [`0x4b94589Cc23F618687790036726f744D602c4017`](https://arbiscan.io/address/0x4b94589Cc23F618687790036726f744D602c4017)
* Fasttrack Timelock: [`0x2286a9B2a5246218f2fC1F380383f45BDfCE3E04`](https://arbiscan.io/address/0x2286a9B2a5246218f2fC1F380383f45BDfCE3E04)
* Critical Timelock: [`0x181E4f8F21D087bF02Ea2F64D5e550849FBca674`](https://arbiscan.io/address/0x181E4f8F21D087bF02Ea2F64D5e550849FBca674)
* Omnichain Governance Executor: [`0xc1858cCE6c28295Efd3eE742795bDa316D7c7526`](https://arbiscan.io/address/0xc1858cCE6c28295Efd3eE742795bDa316D7c7526)
* Omnichain Executor Owner Proxy: [`0xf72C1Aa0A1227B4bCcB28E1B1015F0616E2db7fD`](https://arbiscan.io/address/0xf72C1Aa0A1227B4bCcB28E1B1015F0616E2db7fD)

## Arbitrum Sepolia

* Access Control Manager: [`0xa36AD96441cB931D8dFEAAaC97D3FaB4B39E590F`](https://sepolia.arbiscan.io/address/0xa36AD96441cB931D8dFEAAaC97D3FaB4B39E590F)
* Guardian: [`0x1426A5Ae009c4443188DA8793751024E358A61C2`](https://sepolia.arbiscan.io/address/0x1426A5Ae009c4443188DA8793751024E358A61C2)
* Normal Timelock: [`0x794BCA78E606f3a462C31e5Aba98653Efc1322F8`](https://sepolia.arbiscan.io/address/0x794BCA78E606f3a462C31e5Aba98653Efc1322F8)
* Fasttrack Timelock: [`0x14642991184F989F45505585Da52ca6A6a7dD4c8`](https://sepolia.arbiscan.io/address/0x14642991184F989F45505585Da52ca6A6a7dD4c8)
* Critical Timelock: [`0x0b32Be083f7041608E023007e7802430396a2123`](https://sepolia.arbiscan.io/address/0x0b32Be083f7041608E023007e7802430396a2123)
* Omnichain Governance Executor: [`0xcf3e6972a8e9c53D33b642a2592938944956f138`](https://sepolia.arbiscan.io/address/0xcf3e6972a8e9c53D33b642a2592938944956f138)
* Omnichain Executor Owner Proxy: [`0xfCA70dd553b7dF6eB8F813CFEA6a9DD039448878`](https://sepolia.arbiscan.io/address/0xfCA70dd553b7dF6eB8F813CFEA6a9DD039448878)

## ZKsync Mainnet

* Access Control Manager: [`0x526159A92A82afE5327d37Ef446b68FD9a5cA914`](https://explorer.zksync.io/address/0x526159A92A82afE5327d37Ef446b68FD9a5cA914)
* Guardian: [`0x751Aa759cfBB6CE71A43b48e40e1cCcFC66Ba4aa`](https://explorer.zksync.io/address/0x751Aa759cfBB6CE71A43b48e40e1cCcFC66Ba4aa)

## ZKsync Sepolia

* Access Control Manager: [`0xD07f543d47c3a8997D6079958308e981AC14CD01`](https://sepolia.explorer.zksync.io/address/0xD07f543d47c3a8997D6079958308e981AC14CD01)
* Guardian: [`0xa2f83de95E9F28eD443132C331B6a9C9B7a9F866`](https://sepolia.explorer.zksync.io/address/0xa2f83de95E9F28eD443132C331B6a9C9B7a9F866)
* Normal Timelock: [`0x1730527a0f0930269313D77A317361b42971a67E`](https://sepolia.explorer.zksync.io/address/0x1730527a0f0930269313D77A317361b42971a67E)
* Fasttrack Timelock: [`0xb055e028b27d53a455a6c040a6952e44E9E615c4`](https://sepolia.explorer.zksync.io/address/0xb055e028b27d53a455a6c040a6952e44E9E615c4)
* Critical Timelock: [`0x0E6138bE0FA1915efC73670a20A10EFd720a6Cc8`](https://sepolia.explorer.zksync.io/address/0x0E6138bE0FA1915efC73670a20A10EFd720a6Cc8)
* Omnichain Governance Executor: [`0x83F79CfbaEee738173c0dfd866796743F4E25C9e`](https://sepolia.explorer.zksync.io/address/0x83F79CfbaEee738173c0dfd866796743F4E25C9e)
* Omnichain Executor Owner Proxy: [`0xa34607D58146FA02aF5f920f29C3D916acAb0bC5`](https://sepolia.explorer.zksync.io/address/0xa34607D58146FA02aF5f920f29C3D916acAb0bC5)

