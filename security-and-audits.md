# Security & Audits

At Venus, our utmost dedication lies in ensuring the highest levels of security for our users. Throughout the entire Smart Contract development lifecycle, we strictly adhere to industry best practices to uphold the integrity of our platform. To further fortify our security measures, we collaborate with renowned auditing firms in the field. These partnerships enable us to conduct comprehensive security assessments of our protocol, thereby safeguarding our users' funds effectively.

The security of the Venus Protocol stands as our highest priority. Our development team, in conjunction with third-party auditors and consultants, has invested substantial efforts to create a protocol that we confidently deem safe and dependable. We prioritize transparency by making all contract code and balances publicly verifiable. Moreover, we offer a bug bounty program to security researchers who report undiscovered vulnerabilities, encouraging continuous improvement and vigilance.

We firmly believe that the true test of a smart contract's security lies in its size, visibility, and time. Consequently, we urge users to exercise caution and make independent assessments of the security and suitability of our protocol.

## Audits

### XVS bridge and multichain deployment

**Scope**: [token-bridge](https://github.com/VenusProtocol/token-bridge) repository, with contracts to allow the bridge of XVS tokens from/to BNB to/from other EVM compatible networks, like Ethereum. Extend the OFTV2 LayerZero contracts, adding custom security rules. XVS and TokenController contract, to be used on the destination chains (initially Ethereum mainnet, Arbitrum one, Polygon zkEVM and opBNB). Moreover, the audit scope included: a new [`VTreasuryV8`](https://github.com/VenusProtocol/venus-protocol/pull/345) contract, and changes in the [Resilient Oracle](https://github.com/VenusProtocol/oracle/pull/124) and Isolated pools](https://github.com/VenusProtocol/isolated-pools/pull/294) to make them compatible with other networks.

- [Certik audit report (2023/12/26)](https://github.com/VenusProtocol/token-bridge/blob/323e95fa3c0167cca2fc1d2807e911e0bae54de9/audits/083_multichain_token_bridge_certik_20231226.pdf)

- [Quantstamp audit report (2023/12/19)](https://github.com/VenusProtocol/token-bridge/blob/323e95fa3c0167cca2fc1d2807e911e0bae54de9/audits/064_multichain_token_bridge_quantstamp_20231219.pdf)

- [Peckshield audit report (2023/10/20)](https://github.com/VenusProtocol/token-bridge/blob/04b0a8526bb2fa916785c41eefd94b4f84c12819/audits/079_multichain_token_bridge_peckshield_20231020.pdf)

<details>
<summary>Detailed scope</summary>

- Certik, Quantstamp and Peckshield audited:
  - [token-bridge](https://github.com/VenusProtocol/token-bridge) repository
  - Branch: `develop`
  - Last commit: `91b640fffb0c374bdb63a0f6e8e756793e892ad6`
  - List of files in the scope:
      - contracts/Bridge/BaseXVSProxyOFT.sol
      - contracts/Bridge/XVSBridgeAdmin.sol
      - contracts/Bridge/XVSProxyOFTDest.sol
      - contracts/Bridge/XVSProxyOFTSrc.sol
      - contracts/Bridge/token/TokenController.sol
      - contracts/Bridge/token/XVS.sol
      - contracts/Bridge/interfaces/IXVSProxyOFT.sol
      - contracts/Bridge/interfaces/IXVS.sol

- Moreover, Peckshield audited this:
  - [https://github.com/VenusProtocol/venus-protocol/pull/345](https://github.com/VenusProtocol/venus-protocol/pull/345)
      - This is the treasury contract used in the different networks
      - Inspired by the VTreasury contract deployed to BNB chain (solidity 0.5.16, [here](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Governance/VTreasury.sol))
      - Main chain: adapted to solidity 0.8.20
      - Last commit: 0a058575a48b3b1d55cf257f2ade768b749f0fc6
  - Resilient Oracles change
    - [https://github.com/VenusProtocol/oracle/pull/124](https://github.com/VenusProtocol/oracle/pull/124)
        - Rename variables related to the native token on each chain and the VAI token
    - Last commit: a0a36bcd94e5acd41e137e3cef711484f86eb397

- Apart from the previous scopes, Quantstamp also audited:
  - Isolated pools change
    - [https://github.com/VenusProtocol/isolated-pools/pull/294](https://github.com/VenusProtocol/isolated-pools/pull/294)
        - Convert into immutable the number of blocks per year, so it can be configured per chain during the deployment
    - Last commit: 5e660bffec987b3d31aba3f11b5c4e35f689f646
  - XVSVault
    - [https://github.com/VenusProtocol/venus-protocol/tree/develop/contracts/XVSVault](https://github.com/VenusProtocol/venus-protocol/tree/develop/contracts/XVSVault)
    - Last commit: a158f8c335d0cfad71f1d2c27af6b0d92f4abe41
  - Protocol Share Reserve
    - [https://github.com/VenusProtocol/protocol-reserve/blob/develop/contracts/ProtocolReserve/ProtocolShareReserve.sol](https://github.com/VenusProtocol/protocol-reserve/blob/develop/contracts/ProtocolReserve/ProtocolShareReserve.sol)
    - Last commit: e396119c4442b7811fbeb14ad0851afec1a9d0fa
  - Access Control Manager
    - [https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/AccessControlManager.sol](https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/AccessControlManager.sol)
    - Last commit: 358bed476af7d7d871bf59e77c9daba22a7c2339

</details>

### Venus Prime

**Scope**: `Prime` and `PrimeLiquidityProvider` contracts, to manage the eligibility of Prime tokens and the rewards distributions.

- [OpenZeppelin audit report (2023/10/03)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/065_prime_openzeppelin_20231003.pdf)
- [Certik audit audit report (2023/11/13)](https://github.com/VenusProtocol/venus-protocol/blob/2425501070d28c36a73861d9cf6970f641403735/audits/060_prime_certik_20231113.pdf)
- [Peckshield audit report (2023/08/26)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/055_prime_peckshield_20230826.pdf)
- [Fairyproof audit report (2023/09/10)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/056_prime_fairyproof_20230910.pdf)
- [Code4rena contest (2023/09/28)](https://code4rena.com/contests/2023-09-venus-prime)

<details>
<summary>Detailed scope</summary>

- Pull request [#196](https://github.com/VenusProtocol/venus-protocol/pull/196/) in the core pool repo.
    - Prime feature:
        - contracts/Tokens/Prime/IPrime.sol
        - contracts/Tokens/Prime/Prime.sol
        - contracts/Tokens/Prime/PrimeStorage.sol
        - contracts/Tokens/Prime/PrimeLiquidityProvider.sol
    - Comptroller integration:
        - contracts/Comptroller/ComptrollerStorage.sol
        - contracts/Comptroller/Diamond/facets/PolicyFacet.sol
        - contracts/Comptroller/Diamond/facets/SetterFacet.sol
    - XVSVault integration:
        - contracts/XVSVault/XVSVault.sol
        - contracts/XVSVault/XVSVaultStorage.sol
    - Libs:
        - contracts/Tokens/Prime/libs/Scores.sol
        - contracts/Tokens/Prime/libs/FixedMath.sol
        - contracts/Tokens/Prime/libs/FixedMath0x.sol

</details>


### Automatic income allocation

**Scope**: Changes in the VToken contracts of the Core and IL pools (including the VBNB market), to send automatically the interest reserves to the new ProtocolShareReserve contract, where configured rules will distribute the income following the tokenomics of the project. Enabled in [VIP-189](https://app.venus.io/#/governance/proposal/189), [VIP-192](https://app.venus.io/#/governance/proposal/192), [VIP-193](https://app.venus.io/#/governance/proposal/193) and [VIP-194](https://app.venus.io/#/governance/proposal/194).

- [Quantstamp audit report (2023/09/13)](https://github.com/VenusProtocol/venus-protocol/blob/9ef8901dfef84a11338751881fd10a2d36c576ad/audits/058_automatic_income_allocation_quantstamp_20230913.pdf)
- [Certik audit audit report (2023/09/12)](https://github.com/VenusProtocol/venus-protocol/blob/90f913fd345c24c60efa613ab5ab7e633b7aa07a/audits/059_automatic_income_allocation_certik_20230912.pdf)
- [Peckshield audit report (2023/08/12)](https://github.com/VenusProtocol/venus-protocol/blob/90f913fd345c24c60efa613ab5ab7e633b7aa07a/audits/054_automatic_income_allocation_peckshield_20230812.pdf)
- [Fairyproof audit report (2023/08/03)](https://github.com/VenusProtocol/venus-protocol/blob/90f913fd345c24c60efa613ab5ab7e633b7aa07a/audits/050_automatic_income_allocation_fairyproof_20230803.pdf)

<details>
<summary>Detailed scope</summary>

- Core pool - interest reserves: 
  - Pull request: https://github.com/VenusProtocol/venus-protocol/pull/262
  - Files:
    - contracts/Tokens/VTokens/VToken.sol
    - contracts/Tokens/VTokens/VTokenInterfaces.sol
    - contracts/Utils/ErrorReporter.sol
- Harvesting BNB income:
  - Pull request: https://github.com/VenusProtocol/venus-protocol/pull/289
  - Files:
    - contracts/Admin/VBNBAdmin.sol
    - contracts/Admin/VBNBAdminStorage.sol
- Isolated pools - Liquidations & interest reserves:
  - Pull request: https://github.com/VenusProtocol/isolated-pools/pull/207
  - Files:
    - contracts/VToken.sol
    - contracts/VTokenInterfaces.sol
- Distribute the collected incomes - `ProtocolShareReserve` contract
  - Branch `develop` in the repo https://github.com/VenusProtocol/protocol-reserve. Last commit to consider: dfb653d2e3fe163a248bbd9f8951cd6b96b06390
  - Files:
    - contracts/ProtocolReserve/ProtocolShareReserve.sol
    - contracts/Interfaces/IIncomeDestination.sol
    - contracts/Interfaces/IPrime.sol
    - contracts/Interfaces/IProtocolShareReserve.sol
    - contracts/Interfaces/IVToken.sol
    - contracts/Interfaces/ComptrollerInterface.sol
    - contracts/Interfaces/PoolRegistryInterface.sol

</details>

### Diamond Comptroller

**Scope**: Upgrade of the Comptroller contract in the Core pool, implementing the Diamond pattern. Enabled in the [VIP-174](https://app.venus.io/#/governance/proposal/174).

- [Fairyproof audit report (2023/06/25)](https://github.com/VenusProtocol/venus-protocol/blob/8553387f2277be152883b4ee22211b77a8cbe5f6/audits/040_diamondComptroller_fairyproof_20230625.pdf)
- [Peckshield audit report (2023/07/28)](https://github.com/VenusProtocol/venus-protocol/blob/8553387f2277be152883b4ee22211b77a8cbe5f6/audits/042_diamondComptroller_peckshield_20230718.pdf)
- [Certik audit audit report (2023/08/03)](https://github.com/VenusProtocol/venus-protocol/blob/8553387f2277be152883b4ee22211b77a8cbe5f6/audits/044_diamondComptroller_certik_20230803.pdf)
- [OpenZeppelin audit report (2023/08/17)](https://github.com/VenusProtocol/venus-protocol/blob/8553387f2277be152883b4ee22211b77a8cbe5f6/audits/049_diamondComptroller_openzeppelin_20230817.pdf)
- [Quantstamp audit audit report (2023/09/20)](https://github.com/VenusProtocol/venus-protocol/blob/8553387f2277be152883b4ee22211b77a8cbe5f6/audits/047_diamondComptroller_quantstamp_20230919.pdf)

<details>
<summary>Detailed scope</summary>

**Code to be audited**: https://github.com/VenusProtocol/venus-protocol/pull/224
**Last commit**: 331394866b0b78ea3b65efe03931acd582d0382e
Files in the scope of the audit:

- `contracts/Comptroller/ComptrollerStorage.sol`
- `contracts/Comptroller/Diamond/Diamond.sol`
- `contracts/Comptroller/Diamond/facets/FacetBase.sol`
- `contracts/Comptroller/Diamond/facets/MarketFacet.sol`
- `contracts/Comptroller/Diamond/facets/PolicyFacet.sol`
- `contracts/Comptroller/Diamond/facets/RewardFacet.sol`
- `contracts/Comptroller/Diamond/facets/SetterFacet.sol`
- `contracts/Comptroller/Diamond/facets/XVSRewardsHelper.sol`
- `contracts/Comptroller/Diamond/interfaces/IDiamondCut.sol`
- `contracts/Comptroller/Diamond/interfaces/IMarketFacet.sol`
- `contracts/Comptroller/Diamond/interfaces/IPolicyFacet.sol`
- `contracts/Comptroller/Diamond/interfaces/IRewardFacet.sol`
- `contracts/Comptroller/Diamond/interfaces/ISetterFacet.sol`
- `contracts/Lens/ComptrollerLens.sol`
- `contracts/Lens/SnapshotLens.sol`

</details>

### BUSDLiquidator

**Scope**: Contract to forcibly liquidate BUSD positions after enabling the ["forced liquidations" feature](./guides/market-interaction/liquidation.md#forced-liquidations) in the BUSD market, in the [VIP-191](https://app.venus.io/#/governance/proposal/191)

* [Peckshield audit report (2023/10/20)](https://github.com/VenusProtocol/venus-protocol/blob/b9dff61b16c4002db4cc01d3f25db160209a3d8d/audits/077_busdLiquidator_peckshield_20231020.pdf)

<details>
<summary>Detailed scope</summary>

**Code to be audited**: https://github.com/VenusProtocol/venus-protocol/pull/362
**Last commit**: 592b022723740c6b7b066445f407f12253d85637

</details>

### Forced liquidations in the Isolated pools

**Scope**: Upgrade of the Comptroller contract in the Isolated pools, adding the ["forced liquidations" feature](./guides/market-interaction/liquidation.md#forced-liquidations), enabled on [VIP-186](https://app.venus.io/#/governance/proposal/186)

* [Certik audit report (2023/10/16)](https://github.com/VenusProtocol/isolated-pools/blob/41a96ca24b0e32b8087ea7b916ae2864cbf1a05f/audits/078_forcedLiquidations_certik_20231016.pdf)

### Forced liquidations in the Core pool

**Scope**: Upgrade of the Comptroller contract in the Core pool, adding the ["forced liquidations" feature](./guides/market-interaction/liquidation.md#forced-liquidations), enabled on [VIP-172](https://app.venus.io/#/governance/proposal/172)

* [Certik audit report (2023/09/16)](https://github.com/VenusProtocol/venus-protocol/blob/80cf9b36ea900d71c5e97a5b1d5e2706ecefb9c3/audits/072_forcedLiquidations_certik_20230916.pdf)
* [Peckshield audit report (2023/09/16)](https://github.com/VenusProtocol/venus-protocol/blob/80cf9b36ea900d71c5e97a5b1d5e2706ecefb9c3/audits/073_forcedLiquidations_peckshield_20230916.pdf)

### RiskFund and Shortfall handling

**Scope**: `RiskFund`, `Shortfall` and `ProtocolShareReserve` contracts in the [isolated-pools repo](https://github.com/VenusProtocol/isolated-pools), enabled on [VIP-170](https://app.venus.io/#/governance/proposal/170)

These contracts were in the scope of the audits done before the launch of Isolated Pools in the [VIP-134](https://app.venus.io/#/governance/proposal/134). Some upgrades were done on these contracts, and a new round of audits were done focused on these changes.

* [Certik audit report - 2023/08/24](https://github.com/VenusProtocol/isolated-pools/blob/1116c02c253e82cb0483afc47fb1fa104152601e/audits/061_riskFundShortfall_certik_20230824.pdf)
* [Peckshield audit report - 2023/08/25](https://github.com/VenusProtocol/isolated-pools/blob/1116c02c253e82cb0483afc47fb1fa104152601e/audits/062_riskFundShortfall_peckshield_20230825.pdf)

### Peg Stability Module (PSM)

**Scope**: Peg Stability Module [contract](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/PegStability/PegStability.sol) for VAI/USDT, enabled on [VIP-157](https://app.venus.io/#/governance/proposal/157)

* [Quantstamp audit report - 2023/08/07](https://github.com/VenusProtocol/venus-protocol/blob/90dfde3af29470938032c88ad7f9b31b3a4c503b/audits/057_psm_quantstamp_20230807.pdf)
* [Certik audit report - 2023/05/24](https://github.com/VenusProtocol/venus-protocol/blob/90dfde3af29470938032c88ad7f9b31b3a4c503b/audits/021_psm_certik_20230524.pdf)
* [Peckshield audit report - 2023/04/26](https://github.com/VenusProtocol/venus-protocol/blob/90dfde3af29470938032c88ad7f9b31b3a4c503b/audits/022_psm_peckshield_20230426.pdf)
* [Hacken audit report - 2023/06/26](https://github.com/VenusProtocol/venus-protocol/blob/90dfde3af29470938032c88ad7f9b31b3a4c503b/audits/028_psm_hacken_20230626.pdf)

### Oracles upgrade (2023/07/24)

**Scope**: Upgrade of the Resilient Price Feeds, enabled on [VIP-145](https://app.venus.io/governance/proposal/145).

* [Peckshield audit report - 2023/07/12](https://github.com/VenusProtocol/oracle/blob/fb02cdd3865fb5c34e0cd65cbeda02f87841371a/audits/045_getPrice_peckshield_20230712.pdf)
* [Certik audit report - 2023/07/17](https://github.com/VenusProtocol/oracle/blob/fb02cdd3865fb5c34e0cd65cbeda02f87841371a/audits/043_getPrice_certik_20230717.pdf)

### Oracles

**Scope**: New Resilient Price Feeds, enabled on [VIP-123](https://app.venus.io/governance/proposal/123).

* [OpenZeppeling audit report - 2023/06/06](https://github.com/VenusProtocol/oracle/blob/6f7a3d8769c28881661953e7ee3299b1d5b31e17/audits/026_oracles_openzeppelin_20230606.pdf)
* [Peckshield audit report - 2023/04/24](https://github.com/VenusProtocol/oracle/blob/6f7a3d8769c28881661953e7ee3299b1d5b31e17/audits/013_oracles_peckshield_20230424.pdf)
* [Certik audit report - 2023/05/22](https://github.com/VenusProtocol/oracle/blob/6f7a3d8769c28881661953e7ee3299b1d5b31e17/audits/024_oracles_certik_20230522.pdf)
* [Hacken audit report - 2023/04/26](https://github.com/VenusProtocol/oracle/blob/6f7a3d8769c28881661953e7ee3299b1d5b31e17/audits/016_oracles_hacken_20230426.pdf)

### Vaults

**Scope**: Upgrade of the XVSVault, VAIVault and VRTVault, enabled on [VIP-127](https://app.venus.io/governance/proposal/127).

* [Quantstamp audit report - 2023/05/19](https://github.com/VenusProtocol/venus-protocol/blob/cb91c322f9d267cac11f532924b07a4b1991be64/audits/031_vaults_quantstamp_20230519.pdf)
* [Peckshield audit report 1 - 2023/03/22](https://github.com/VenusProtocol/venus-protocol/blob/cb91c322f9d267cac11f532924b07a4b1991be64/audits/012_vaults_peckshield_20230322.pdf)
* [Peckshield audit report 2 - 2023/04/19](https://github.com/VenusProtocol/venus-protocol/blob/cb91c322f9d267cac11f532924b07a4b1991be64/audits/018_vaults_peckshield_20230419.pdf)
* [Fairyproof audit report - 2023/05/17](https://github.com/VenusProtocol/venus-protocol/blob/cb91c322f9d267cac11f532924b07a4b1991be64/audits/025_vaults_fairyproof_20230517.pdf)
* [Certik audit report - 2023/06/04](https://github.com/VenusProtocol/venus-protocol/blob/f01158edba6ecade4d8bf72d109d80e1f0c8f792/audits/038_vaults_certik_20230604.pdf)

### Isolated pools

**Scope**: Isolated pools, first enabled on [VIP-134](https://app.venus.io/governance/proposal/134).

* [Certik audit report](https://github.com/VenusProtocol/isolated-pools/blob/1d60500e28d4912601bac461870c754dd9e72341/audits/036_isolatedPools_certik_20230619.pdf)
* [Certik audit report (RewardsDistributor)](https://github.com/VenusProtocol/isolated-pools/blob/95b1c8906774e5d849dd1e00ba7c608c679f8977/audits/051_rewardsDistributor_certik_20230610.pdf)
* [Peckshield audit report 1](https://github.com/VenusProtocol/isolated-pools/blob/c801e898e034e313e885c5d486ed27c15e7e2abf/audits/003_isolatedPools_peckshield_20230112.pdf)
* [Peckshield audit report 2](https://github.com/VenusProtocol/isolated-pools/blob/1d60500e28d4912601bac461870c754dd9e72341/audits/037_isolatedPools_peckshield_20230625.pdf)
* [Hacken audit report](https://github.com/VenusProtocol/isolated-pools/blob/c801e898e034e313e885c5d486ed27c15e7e2abf/audits/016_isolatedPools_hacken_20230426.pdf)
* [Code4rena contest - 2023/05/15](https://code4rena.com/contests/2023-05-venus-protocol-isolated-pools)

### Swap router

**Scope**: SwapRouter contract, enabled on [VIP-131](https://app.venus.io/governance/proposal/131).

* [OpenZeppelin audit report - 2023/06/16](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/027_swapRouter_openzeppelin_20230616.pdf)
* [Certik audit report - 2023/05/30](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/030_swapRouter_certik_20230530.pdf)
* [Peckshield audit report - 2023/04/19](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/014_swapRouter_peckshield_20230419.pdf)
* [Hacken audit report - 2023/06/28](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/029_swapRouter_hacken_20230628.pdf)

### VToken

**Scope**: Delegate Borrowing in Venus. Upgrade of BUSD, USDC, USDT, BTCB and ETH markets, to reduce the risks on Venus that resulted from the September 2022 BNB Bridge incident. Executed on [VIP-99](https://app.venus.io/governance/proposal/99).

* [Peckshield audit report - 2023/02/27](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/009_vtoken_peckshield_20230227.pdf)
