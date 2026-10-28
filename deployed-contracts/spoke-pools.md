# Hub-Funded Spoke Pools - Deployed Contracts

Contracts for [hub-funded spoke pools](../technical-reference/reference-isolated-pools/spoke/README.md). Spoke pools have their own registry, so they are not listed in the Isolated Pools `PoolRegistry`. Query `getAllPools()` on the `SpokePoolRegistry` below for the current list.

## BNB Chain Mainnet

### Registry

* SpokePoolRegistry (proxy): [`0x372D0eE44993B5c6eb641364BAB939311e8e5B4c`](https://bscscan.com/address/0x372D0eE44993B5c6eb641364BAB939311e8e5B4c)

### Pools

The registry holds one pool, named `bStock index`.

* bStock index (`SpokeComptroller`): [`0x1e75332a3e2CC8e5ee9055aF4c737DA34Cb7cEDf`](https://bscscan.com/address/0x1e75332a3e2CC8e5ee9055aF4c737DA34Cb7cEDf)

### Markets

USDT, USDC and U are the liquidity side, with collateral factor `0` and a supply cap and borrow cap of 5,000,000 each. QQQB and SPYB are the collateral side, at a `0.8` collateral factor, a `0.85` liquidation threshold, a supply cap of 10,000 and a borrow cap of `0`. The pool's liquidation incentive is `1.1` and its close factor `0.5`; both collateral markets use the pool value. These are live values on 2026-10-28; read `supplyCaps`, `borrowCaps`, `effectiveLiquidationIncentive` and `closeFactorMantissa` on the `SpokeComptroller` for current ones.

* vUSDT_bStockIndex: [`0xEA0096142fBB56AAc0F594ED1D4de3E4De638f22`](https://bscscan.com/address/0xEA0096142fBB56AAc0F594ED1D4de3E4De638f22)
* vUSDC_bStockIndex: [`0x6adb5e462ac6eA880246F24E3C47D23f70FCCbF6`](https://bscscan.com/address/0x6adb5e462ac6eA880246F24E3C47D23f70FCCbF6)
* vU_bStockIndex: [`0x713bBaA44Dc99e691F1F9fE8086FC328E94B6f27`](https://bscscan.com/address/0x713bBaA44Dc99e691F1F9fE8086FC328E94B6f27)
* vQQQB_bStockIndex: [`0xeA32B70f4106d9ef6f0fF95f7422Fa679494c362`](https://bscscan.com/address/0xeA32B70f4106d9ef6f0fF95f7422Fa679494c362)
* vSPYB_bStockIndex: [`0x259311A868B49CdA457C1843F89D4dDA33be0390`](https://bscscan.com/address/0x259311A868B49CdA457C1843F89D4dDA33be0390)

### Beacons

* SpokeComptrollerBeacon: [`0xDE74d82bF2379DD75FbBF753fcc9141cA83Ba1f3`](https://bscscan.com/address/0xDE74d82bF2379DD75FbBF753fcc9141cA83Ba1f3)
* SpokeVTokenBeacon: [`0xd8BC6C3624187649A222eacE8eF2eA13fF3B0D48`](https://bscscan.com/address/0xd8BC6C3624187649A222eacE8eF2eA13fF3B0D48)

### Lens

* SpokePoolLens: [`0x475f6A963BDE18fD579F50598c514aE082405A9b`](https://bscscan.com/address/0x475f6A963BDE18fD579F50598c514aE082405A9b)

## BNB Chain Testnet (Test-only)

A parallel deployment exists for integration testing. It is **not a faithful mirror of mainnet**: the pool names, the market set and the collateral configuration all differ. Query `getAllPools()` on the registry rather than assuming the mainnet shape.

### Registry

* SpokePoolRegistry (proxy): [`0xeAA45288d804971e5a76f33559e629F5b2b1Cb8B`](https://testnet.bscscan.com/address/0xeAA45288d804971e5a76f33559e629F5b2b1Cb8B)

### Pools

* Hub-funded spoke (`SpokeComptroller`): [`0x11960c84d6c4F2a978a12372721C3A6A88C78f4c`](https://testnet.bscscan.com/address/0x11960c84d6c4F2a978a12372721C3A6A88C78f4c)
* QA multi-pool spoke (`SpokeComptroller`): [`0xb084B5af4a040933790Cdc1b2d15ac7BB3514E50`](https://testnet.bscscan.com/address/0xb084B5af4a040933790Cdc1b2d15ac7BB3514E50)

The second pool was stood up for QA scenarios and has no deployment artifact in the repo. Its markets are vUSDT_QASpoke, vSKHYB_QASpoke, vTSLAB_QASpoke and vNVDAB_QASpoke; read their addresses from `getAllMarkets()` on that Comptroller.

### Markets

The markets below belong to the hub-funded spoke pool. Only vUSDT\_HubSpoke and vUSDC\_HubSpoke have a deployment artifact in the repo; vTSLAB\_HubSpoke, vSPCXB\_HubSpoke and vNVDAB\_HubSpoke do not, so their addresses come from the chain.

* vUSDT_HubSpoke: [`0xC88bAF0bA49a98F15A00182752f6d10bd3932F6a`](https://testnet.bscscan.com/address/0xC88bAF0bA49a98F15A00182752f6d10bd3932F6a)
* vUSDC_HubSpoke: [`0xD05514217FD359659aE7da7740e79C11947eBB32`](https://testnet.bscscan.com/address/0xD05514217FD359659aE7da7740e79C11947eBB32)
* vTSLAB_HubSpoke: [`0x301d27Fa22FE4d2e7397550ACa825140EB7Bff3a`](https://testnet.bscscan.com/address/0x301d27Fa22FE4d2e7397550ACa825140EB7Bff3a)
* vSPCXB_HubSpoke: [`0x7157241D1eaA53C823f292b605522B2B3adC1496`](https://testnet.bscscan.com/address/0x7157241D1eaA53C823f292b605522B2B3adC1496)
* vNVDAB_HubSpoke: [`0x41A860F11Ddb71ed7d3063aE43dF0e9741B4eed3`](https://testnet.bscscan.com/address/0x41A860F11Ddb71ed7d3063aE43dF0e9741B4eed3)

### Beacons

* SpokeComptrollerBeacon: [`0x076f3fb34C8937a62aD562c33249798367542d75`](https://testnet.bscscan.com/address/0x076f3fb34C8937a62aD562c33249798367542d75)
* SpokeVTokenBeacon: [`0xB9c3b5A6f13FD5BEF51eE8B62ED3EA384a9d1B45`](https://testnet.bscscan.com/address/0xB9c3b5A6f13FD5BEF51eE8B62ED3EA384a9d1B45)

### Lens

* SpokePoolLens: [`0x128EF4460b8649a42Bc86d014f4e5f23E78CE9B2`](https://testnet.bscscan.com/address/0x128EF4460b8649a42Bc86d014f4e5f23E78CE9B2)
