---
title: "Hub-Funded Spoke Pools"
---

Contracts for [hub-funded spoke pools](/technical-reference/reference-isolated-pools/spoke). Spoke pools have their own registry, so they are not listed in the Isolated Pools `PoolRegistry`. Query `getAllPools()` on the `SpokePoolRegistry` below for the current list.

## BNB Chain Mainnet

### Registry

* SpokePoolRegistry (proxy): [`0x372D0eE44993B5c6eb641364BAB939311e8e5B4c`](https://bscscan.com/address/0x372D0eE44993B5c6eb641364BAB939311e8e5B4c)

### Pools

The registry holds three pools.

* bStock index (`SpokeComptroller`): [`0x1e75332a3e2CC8e5ee9055aF4c737DA34Cb7cEDf`](https://bscscan.com/address/0x1e75332a3e2CC8e5ee9055aF4c737DA34Cb7cEDf)
* bStock mainstream (`SpokeComptroller`): [`0xE14175059adc1B3C533184710425805A3063455B`](https://bscscan.com/address/0xE14175059adc1B3C533184710425805A3063455B)
* BPN Loan (`SpokeComptroller`): [`0xA73D31939c936d07fA0FD15b3d86C0fe2a72c282`](https://bscscan.com/address/0xA73D31939c936d07fA0FD15b3d86C0fe2a72c282)

### Markets

#### bStock index

USDT, USDC and U are the liquidity side, with collateral factor `0` and a supply cap and borrow cap of 5,000,000 each. QQQB and SPYB are the collateral side, at a `0.8` collateral factor, a `0.85` liquidation threshold, a supply cap of 10,000 and a borrow cap of `0`, with `BORROW` also paused on both. The pool's liquidation incentive is `1.1` and its close factor `0.5`. QQQB and SPYB each carry a liquidation incentive of their own, also `1.1`, set by [VIP-670](https://app.venus.io/#/governance/proposal/670?chainId=56): it equals the pool value today, but neither market follows a later pool-wide `setLiquidationIncentive`. These are live values on 2026-10-29; read `supplyCaps`, `borrowCaps`, `actionPaused`, `liquidationIncentives`, `effectiveLiquidationIncentive` and `closeFactorMantissa` on the `SpokeComptroller` for current ones.

Both collateral markets are priced through the `ResilientOracle`. QQQB has a main oracle checked against a pivot oracle. **SPYB has a main oracle only**, with no pivot or fallback, so no second source cross-checks its price. Read `getTokenConfig(underlying)` on the oracle for the current setup.

* vUSDT_bStockIndex: [`0xEA0096142fBB56AAc0F594ED1D4de3E4De638f22`](https://bscscan.com/address/0xEA0096142fBB56AAc0F594ED1D4de3E4De638f22)
* vUSDC_bStockIndex: [`0x6adb5e462ac6eA880246F24E3C47D23f70FCCbF6`](https://bscscan.com/address/0x6adb5e462ac6eA880246F24E3C47D23f70FCCbF6)
* vU_bStockIndex: [`0x713bBaA44Dc99e691F1F9fE8086FC328E94B6f27`](https://bscscan.com/address/0x713bBaA44Dc99e691F1F9fE8086FC328E94B6f27)
* vQQQB_bStockIndex: [`0xeA32B70f4106d9ef6f0fF95f7422Fa679494c362`](https://bscscan.com/address/0xeA32B70f4106d9ef6f0fF95f7422Fa679494c362)
* vSPYB_bStockIndex: [`0x259311A868B49CdA457C1843F89D4dDA33be0390`](https://bscscan.com/address/0x259311A868B49CdA457C1843F89D4dDA33be0390)

#### bStock mainstream

Created by [VIP-675](https://app.venus.io/#/governance/proposal/675?chainId=56), which also listed its first bStocks; [VIP-677](https://app.venus.io/#/governance/proposal/677?chainId=56) and [VIP-678](https://app.venus.io/#/governance/proposal/678?chainId=56) listed the rest. USDT, USDC and U are the liquidity side, with collateral factor `0` and a supply cap and borrow cap of 5,000,000 each, and only the Spoke Source of the same asset's Liquidity Hub may supply them. Twenty bStocks are the collateral side, each with a borrow cap of `0` and `BORROW` paused. The pool's liquidation incentive is `1.1` and its close factor `0.5`, but every bStock carries a liquidation incentive of its own, so the pool value applies only to the liquidity markets. These are live values on 2026-11-10; read them on the `SpokeComptroller` for current ones.

* vUSDT_bStockMainstream: [`0x2b12bC29044CE8f018Ae0aF5929450a8A6259Ed8`](https://bscscan.com/address/0x2b12bC29044CE8f018Ae0aF5929450a8A6259Ed8)
* vUSDC_bStockMainstream: [`0xD7608E9dFe6CB4b527d41abF40d0f46D917c9EeA`](https://bscscan.com/address/0xD7608E9dFe6CB4b527d41abF40d0f46D917c9EeA)
* vU_bStockMainstream: [`0x24Ee5A3F631f9c2FAf8a730d43F059D3eA9566AD`](https://bscscan.com/address/0x24Ee5A3F631f9c2FAf8a730d43F059D3eA9566AD)

| Market | Address | Collateral factor | Liquidation threshold | Liquidation incentive | Supply cap |
| --- | --- | --- | --- | --- | --- |
| vNVDAB\_bStockMainstream | [`0x7f47B2B501Faf33cbE38435C4aEf3Da023340586`](https://bscscan.com/address/0x7f47B2B501Faf33cbE38435C4aEf3Da023340586) | `0.75` | `0.8` | `1.08` | 4,580 |
| vTSLAB\_bStockMainstream | [`0xeC2476Fcc45AC88b0D2E2B977Fee19768e130a06`](https://bscscan.com/address/0xeC2476Fcc45AC88b0D2E2B977Fee19768e130a06) | `0.75` | `0.8` | `1.08` | 2,460 |
| vSPCXB\_bStockMainstream | [`0x4fbF32E1ED761A98747b8f4870E8ccAC6052eEF0`](https://bscscan.com/address/0x4fbF32E1ED761A98747b8f4870E8ccAC6052eEF0) | `0.5` | `0.6` | `1.15` | 6,700 |
| vSKHYB\_bStockMainstream | [`0x31884079bCbE980d38DD48a32F62B46Abd177632`](https://bscscan.com/address/0x31884079bCbE980d38DD48a32F62B46Abd177632) | `0.55` | `0.65` | `1.15` | 6,480 |
| vCRCLB\_bStockMainstream | [`0x47F80e9D3727F2297268fe6b2a861DCe3e6a4488`](https://bscscan.com/address/0x47F80e9D3727F2297268fe6b2a861DCe3e6a4488) | `0.6` | `0.7` | `1.125` | 12,340 |
| vGOOGLB\_bStockMainstream | [`0x56009e54E2Aa6C36f3777f07DC7ec945b0b11BA6`](https://bscscan.com/address/0x56009e54E2Aa6C36f3777f07DC7ec945b0b11BA6) | `0.7` | `0.75` | `1.1` | 3,060 |
| vAAPLB\_bStockMainstream | [`0xD77456aa785E4B0FF998dc626781C60e3E281dBB`](https://bscscan.com/address/0xD77456aa785E4B0FF998dc626781C60e3E281dBB) | `0.7` | `0.75` | `1.1` | 2,330 |
| vMSTRB\_bStockMainstream | [`0x7b809DE9D18dBdab00f04506c7F82F253fc8d904`](https://bscscan.com/address/0x7b809DE9D18dBdab00f04506c7F82F253fc8d904) | `0.6` | `0.7` | `1.125` | 2,120 |
| vSNDKB\_bStockMainstream | [`0x410b649F5B29F8344Bf84a999778aeA2C9bab13c`](https://bscscan.com/address/0x410b649F5B29F8344Bf84a999778aeA2C9bab13c) | `0.5` | `0.6` | `1.15` | 220 |
| vMETAB\_bStockMainstream | [`0x44E91730193Ee0Ab539904bC24FC65A47c04d3d5`](https://bscscan.com/address/0x44E91730193Ee0Ab539904bC24FC65A47c04d3d5) | `0.7` | `0.75` | `1.1` | 480 |
| vMSFTB\_bStockMainstream | [`0xb4CCfb60A9F20E37205AB60A0D2335BaCdd42Be6`](https://bscscan.com/address/0xb4CCfb60A9F20E37205AB60A0D2335BaCdd42Be6) | `0.75` | `0.8` | `1.08` | 560 |
| vNBISB\_bStockMainstream | [`0x8D36c5645185989edDaA37952C23e7360B544153`](https://bscscan.com/address/0x8D36c5645185989edDaA37952C23e7360B544153) | `0.5` | `0.6` | `1.15` | 580 |
| vBEB\_bStockMainstream | [`0x8DEA78aC2A09b11Bf8732c5041a0F1CC28daeD31`](https://bscscan.com/address/0x8DEA78aC2A09b11Bf8732c5041a0F1CC28daeD31) | `0.5` | `0.6` | `1.15` | 450 |
| vAMDB\_bStockMainstream | [`0x23d96082D85562bC757194c045263778f8C1EFf7`](https://bscscan.com/address/0x23d96082D85562bC757194c045263778f8C1EFf7) | `0.65` | `0.75` | `1.125` | 180 |
| vMRNAB\_bStockMainstream | [`0xb074a42fc36998B47F126F49d1c134B8e891894c`](https://bscscan.com/address/0xb074a42fc36998B47F126F49d1c134B8e891894c) | `0.5` | `0.6` | `1.15` | 490 |
| vMUB\_bStockMainstream | [`0x7318C484C6F51315F963279ef056F22740346e2A`](https://bscscan.com/address/0x7318C484C6F51315F963279ef056F22740346e2A) | `0.65` | `0.75` | `1.125` | 100 |
| vINTCB\_bStockMainstream | [`0x188B98fc54fB5343AbB38fa657826EbC1eD42953`](https://bscscan.com/address/0x188B98fc54fB5343AbB38fa657826EbC1eD42953) | `0.65` | `0.75` | `1.125` | 1,060 |
| vDRAMB\_bStockMainstream | [`0x7C790b26128112516f4beA9FCE763b2623023E0E`](https://bscscan.com/address/0x7C790b26128112516f4beA9FCE763b2623023E0E) | `0.55` | `0.65` | `1.15` | 1,920 |
| vTSMB\_bStockMainstream | [`0x28e19e1edD491F01BcFD13f96D99b5c04E176428`](https://bscscan.com/address/0x28e19e1edD491F01BcFD13f96D99b5c04E176428) | `0.65` | `0.75` | `1.125` | 230 |
| vCOINB\_bStockMainstream | [`0x04B9F583e59673c11Fa8603ea019C5B24644acc6`](https://bscscan.com/address/0x04B9F583e59673c11Fa8603ea019C5B24644acc6) | `0.5` | `0.6` | `1.15` | 630 |

#### BPN Loan

Created by [VIP-676](https://app.venus.io/#/governance/proposal/676?chainId=56) as a loan to Better Payment Network (BPN). The collateral side is BPNC (BPN Credit Token) [`0x6d7C501cF2603d8A3d9aE10Fee8809fd4EA9D689`](https://bscscan.com/address/0x6d7C501cF2603d8A3d9aE10Fee8809fd4EA9D689), a token governed by Venus and priced at a fixed $1, at a `0.9` collateral factor, a `0.95` liquidation threshold, a supply cap of 10,000,000 and a borrow cap of `0`, with `BORROW` paused. **The fixed price does not move with BPN's credit**, so what can be borrowed against BPNC is bounded only by its supply allowlist and its supply cap. USDT, USDC and U are the liquidity side, with collateral factor `0`, a supply cap and borrow cap of 8,000,000 each, and a flat 6% borrow APY; only the Spoke Source of the same asset's Liquidity Hub may supply them. Every market carries a liquidation incentive of `1`, overriding the pool's `1.05`, so a liquidator receives exactly the value it repays, and the pool's liquidation allowlist holds only the Operator. The close factor is `0.5`. These are live values on 2026-11-10.

* vBPNC_BPNLoan: [`0x7aC71651fC58214A26df172289899f6F52E227ef`](https://bscscan.com/address/0x7aC71651fC58214A26df172289899f6F52E227ef)
* vUSDT_BPNLoan: [`0x722997e2211a224Ac98Cc55D8C1C973D63623a0b`](https://bscscan.com/address/0x722997e2211a224Ac98Cc55D8C1C973D63623a0b)
* vUSDC_BPNLoan: [`0xd43e18D5568E544aA98b2EB1f3039f4a24267B7c`](https://bscscan.com/address/0xd43e18D5568E544aA98b2EB1f3039f4a24267B7c)
* vU_BPNLoan: [`0x60d7BFd15B2414e9a29DEB04b84F1AD8c9868E44`](https://bscscan.com/address/0x60d7BFd15B2414e9a29DEB04b84F1AD8c9868E44)

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
