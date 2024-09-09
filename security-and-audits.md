# Security & Audits

At Venus, our utmost dedication lies in ensuring the highest levels of security for our users. Throughout the entire Smart Contract development lifecycle, we strictly adhere to industry best practices to uphold the integrity of our platform. To further fortify our security measures, we collaborate with renowned auditing firms in the field. These partnerships enable us to conduct comprehensive security assessments of our protocol, thereby safeguarding our users' funds effectively.

The security of the Venus Protocol stands as our highest priority. Our development team, in conjunction with third-party auditors and consultants, has invested substantial efforts to create a protocol that we confidently deem safe and dependable. We prioritize transparency by making all contract code and balances publicly verifiable. Moreover, we offer a bug bounty program to security researchers who report undiscovered vulnerabilities, encouraging continuous improvement and vigilance.

We firmly believe that the true test of a smart contract's security lies in its size, visibility, and time. Consequently, we urge users to exercise caution and make independent assessments of the security and suitability of our protocol.

## Audits

### Unlist markets

**Scope**: Changes in the [isolated pools](https://github.com/VenusProtocol/isolated-pools) and [core](https://github.com/VenusProtocol/venus-protocol) contracts to support unlisting markets. Fix in the core pool the behaviour of borrow caps set to zero. Enabled in [VIP-361](https://app-alt.venus.io/#/governance/proposal/361).

- [Certik audit audit report (2024/04/09)](https://github.com/VenusProtocol/venus-protocol/blob/e4c4dfe1b78945ea87dca5b7e0c724b6bd317359/audits/099_unlistMarkets_certik_20240409.pdf)
- [Fairyproof audit report (2024/03/28)](https://github.com/VenusProtocol/venus-protocol/blob/e4c4dfe1b78945ea87dca5b7e0c724b6bd317359/audits/102_unlistMarkets_fairyproof_20240328.pdf)

<details>
<summary>Detailed scope</summary>

Unlist markets

- Pull request [#429](https://github.com/VenusProtocol/venus-protocol/pull/429) in the `venus-protocol` repo:
    - Change: allow Governance the logical deletion of markets from the Comptroller contract
        - contracts/Comptroller/Diamond/facets/MarketFacet.sol
        - contracts/Comptroller/Diamond/facets/PolicyFacet.sol
- Pull request [#349](https://github.com/VenusProtocol/isolated-pools/pull/349) in the `isolated-pools` repo:
    - Change: allow Governance the logical deletion of markets from the Comptroller contract
    - Files: contracts/Comptroller.sol

Fix Borrow Cap 0 Logic

- Pull request [#438](https://github.com/VenusProtocol/venus-protocol/pull/438) in the `venus-protocol` repo:
    - Change: previously, a borrow cap of 0 meant no-caps. That is error-prone. With the new logic, a borrow cap of 0 won't allow new borrows
        - contracts/Comptroller/ComptrollerStorage.sol
        - contracts/Comptroller/Diamond/facets/PolicyFacet.sol
        - contracts/Comptroller/Diamond/facets/SetterFacet.sol

</details>

### Oracle for Ether.fi LRT tokens (weETHs and weETHk) on Ethereum

**Scope**: specific oracle for the tokens [weETHs](https://etherscan.io/token/0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88) and [weETHk](https://etherscan.io/address/0x7223442cad8e9cA474fC40109ab981608F8c4273) on Ethereum, using an `Accountant` contract under the hood, provided by the [Ether.fi](https://www.ether.fi/) project. Enabled in [VIP-355](https://app-alt.venus.io/#/governance/proposal/355).

- [Certik audit audit report (2024/08/23)](https://github.com/VenusProtocol/oracle/blob/93a79c97e867f61652fc063abb5df323acc9bed4/audits/116_WeETHAccountantOracle_certik_20240823.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#213](https://github.com/VenusProtocol/oracle/pull/213)
    - contracts/oracles/WeETHAccountantOracle.sol
    - contracts/interfaces/IAccountant.sol

</details>

### VBNBAdmin: new function setInterestRateModel

**Scope**: Update of the VBNBAdmin contract to integrate the AccessControlManager within the `setInterestRateModel` function. This will allow to authorize more timelocks (not only the Normal timelock) to execute this function, so Fast-track and Critical VIP's will be able to update the interest rate model on the VBNB market. Enabled in [VIP-343](https://app-alt.venus.io/#/governance/proposal/343).

- [Certik audit audit report (2024/07/17)](https://github.com/VenusProtocol/venus-protocol/blob/5e4563ab0f2f98a04659e065b6c49acebf00df3b/audits/112_VBNBAdmin_certik_20240717.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#487](https://github.com/VenusProtocol/venus-protocol/pull/487)
    - contracts/Admin/VBNBAdmin.sol
    - contracts/Admin/VBNBAdminStorage.sol

</details>

### Oracle for sfrxETH on Ethereum

**Scope**: specific oracle for the token [sfrxETH](https://etherscan.io/token/0xac3e018457b222d93114458476f3e3416abbe38f) on Ethereum, using the `SfrxEthFraxOracle` oracle under the hood, provided by the [FRAX project](https://docs.frax.finance/frax-oracle/advanced-concepts#frax-oracles). Enabled in [VIP-329](https://app.venus.io/#/governance/proposal/329).

- [Certik audit audit report (2024/05/17)](https://github.com/VenusProtocol/oracle/blob/0b221a7bb7d8e04fd8b013806facb93bcb4038b9/audits/110_sfrxETHOracle_certik_20240517.pdf)
- [Quantstamp audit audit report (2024/05/20)](https://github.com/VenusProtocol/oracle/blob/0b221a7bb7d8e04fd8b013806facb93bcb4038b9/audits/111_sfrxETHOracle_quantstamp_20240530.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#191](https://github.com/VenusProtocol/oracle/pull/191)
    - contracts/oracles/SFrxETHOracle.sol

</details>

### Multichain Governance

**Scope**: Cross chain messaging, execution of VIP on non-BNB chains. Integration of [Multichain Governance](https://github.com/VenusProtocol/governance-contracts/pull/21) in Venus. Enabled in [VIP-330](https://app.venus.io/#/governance/proposal/330) and [VIP-331](https://app.venus.io/#/governance/proposal/331).

* [Openzepplin audit report - 2024/01/19](https://github.com/VenusProtocol/governance-contracts/blob/2915ea772d86d9cc63f88fb6e804eaae53193879/audits/084_multichainGovernance_openzeppelin_20240119.pdf)
* [Certik audit report - 2024/02/26](https://github.com/VenusProtocol/governance-contracts/blob/2915ea772d86d9cc63f88fb6e804eaae53193879/audits/085_multichainGovernance_certik_20240226.pdf)
* [Cantina audit report - 2024/04/25](https://github.com/VenusProtocol/governance-contracts/blob/2915ea772d86d9cc63f88fb6e804eaae53193879/audits/105_multichainGovernance_cantina_20240425.pdf)
* [Quantstamp audit report - 2024/04/29](https://github.com/VenusProtocol/governance-contracts/blob/2915ea772d86d9cc63f88fb6e804eaae53193879/audits/106_multichainGovernance_quantstamp_20240429.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#21](https://github.com/VenusProtocol/governance-contracts/pull/21)
    - contracts/Cross-chain/BaseOmnichainControllerDest.sol
    - contracts/Cross-chain/BaseOmnichainControllerSrc.sol
    - contracts/Cross-chain/OmnichainExecutorOwner.sol
    - contracts/Cross-chain/OmnichainGovernanceExecutor.sol
    - contracts/Cross-chain/OmnichainProposalSender.sol
    - contracts/Cross-chain/interfaces/IGovernananceBravoDelegate.sol
    - contracts/Cross-chain/interfaces/ITimelock.sol
    - contracts/Governance/TimelockV8.sol
>>>>>>> main

</details>

### Time-based contracts and seize XVS rewards

**Scope**: Changes in the [isolated pools](https://github.com/VenusProtocol/isolated-pools), [core](https://github.com/VenusProtocol/venus-protocol) and [oracle](https://github.com/VenusProtocol/oracle) contracts to support blockchains where the block rate is not constant (i.e. Arbitrum). Add to the Core pool the feature to seize XVS rewards via VIP.

- [Certik audit audit report (2024/01/17)](https://github.com/VenusProtocol/isolated-pools/blob/aa1f7ae61b07839231ec16e9c4143905785d7aae/audits/088_timeBased_certik_20240117.pdf)
- [Quantstamp audit audit report (2024/03/19)](https://github.com/VenusProtocol/isolated-pools/blob/470416836922656783eab52ded54744489e8c345/audits/089_timeBased_quantstamp_20240319.pdf)
- [Fairyproof audit report (2024/03/04)](https://github.com/VenusProtocol/isolated-pools/blob/aa1f7ae61b07839231ec16e9c4143905785d7aae/audits/094_timeBased_fairyproof_20240304.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#324](https://github.com/VenusProtocol/isolated-pools/pull/324) in the `isolated-pools` repo
- Change: Timestamp-based Isolated lending contracts
    - contracts/JumpRateModelV2.sol
    - contracts/Lens/PoolLens.sol
    - contracts/Rewards/RewardsDistributor.sol
    - contracts/Rewards/RewardsDistributorStorage.sol
    - contracts/Shortfall/Shortfall.sol
    - contracts/Shortfall/ShortfallStorage.sol
    - contracts/VToken.sol
    - contracts/VTokenInterfaces.sol
    - contracts/WhitePaperInterestRateModel.sol
    - contracts/lib/constants.sol

- Pull request [#418](https://github.com/VenusProtocol/venus-protocol/pull/418) in the `venus-protocol` repo
- Change: Time-based XVSVault
    - contracts/XVSVault/TimeManagerV5.sol
    - contracts/XVSVault/XVSVault.sol
    - contracts/XVSVault/XVSVaultStorage.sol

- Pull request [#128](https://github.com/VenusProtocol/oracle/pull/128) in the `oracle` repo
- Change: Add Arbitrum sequencer downtime validation for Chainlink Oracle
    - contracts/oracles/SequencerChainlinkOracle.sol
    - contracts/oracles/ChainlinkOracle.sol

- Change: Reduce reserves with available cash
  - Pull request [#414](https://github.com/VenusProtocol/venus-protocol/pull/414) in the `venus-protocol` repo
      - contracts/Tokens/VTokens/VToken.sol
  - Pull request [#337](https://github.com/VenusProtocol/isolated-pools/pull/337)
      - contracts/VToken.sol

- Pull request [#417](https://github.com/VenusProtocol/venus-protocol/pull/417) in the `venus-protocol` repo
- Change: Seize XVS rewards
    - contracts/Comptroller/Diamond/facets/RewardFacet.sol

- Pull request [#410] https://github.com/VenusProtocol/venus-protocol/pull/410 in the `venus-protocol` repo
- Change: Dynamically Set Addresses for XVS and XVSVToken
    - contracts/Comptroller/ComptrollerStorage.sol
    - contracts/Comptroller/Diamond/Diamond.sol
    - contracts/Comptroller/Diamond/facets/FacetBase.sol
    - contracts/Comptroller/Diamond/facets/RewardFacet.sol
    - contracts/Comptroller/Diamond/facets/SetterFacet.sol

</details>

### VAI Controller

**Scope**: `VAIController` contract, fixing how the seized amounts during a VAI liquidations are calculated, considering the original VAI debt plus the interests generated. Enabled in [VIP-299](https://app.venus.io/#/governance/proposal/299).

- [Certik audit audit report (2024/04/26)](https://github.com/VenusProtocol/venus-protocol/blob/0000b6b7bb9eaf1d6827993c306b776c371d41b7/audits/107_vaiController_certik_20240426.pdf)
- [Pessimistic audit audit report (2024/05/02)](https://github.com/VenusProtocol/venus-protocol/blob/c01162eac8a911cd3a45c3d55b91e418e5ec2e6a/audits/109_vaiController_pessimistic_20240502.pdf)
- [Fairyproof audit audit report (2024/04/18)](https://github.com/VenusProtocol/venus-protocol/blob/0000b6b7bb9eaf1d6827993c306b776c371d41b7/audits/108_vaiController_fairyproof_20240418.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#467](https://github.com/VenusProtocol/venus-protocol/pull/467)
    - contracts/Tokens/VAI/VAIController.sol

</details>

### XVS bridge - Mesh architecture

**Scope**: enable XVS transfers between networks different to the BNB Chain, for example, between Ethereum mainnet and opBNB mainnet. [Detailed scope](https://github.com/VenusProtocol/vips/pull/255). Enabled in [VIP-292](https://app.venus.io/#/governance/proposal/292).

- [Certik audit audit report (2024/04/19)](https://github.com/VenusProtocol/token-bridge/blob/7e13d370fbb8e9fcd6c8e0fde5943e44e0b64bfa/audits/104_mesh_architecture_certik_20240419.pdf)

### Correlated token oracles

**Scope**: set of oracles for tokens whose price is highly correlated with the price of another token. This definition includes Liquid Staked Tokens (like [wsETH](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0), [weETH](https://etherscan.io/token/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee), [WBETH](https://bscscan.com/address/0xa2e3356610840701bdf5611a53974510ae27e2e1), [ankrBNB](https://bscscan.com/address/0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827), [BNBx](https://bscscan.com/address/0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275), [slisBNB](https://bscscan.com/address/0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B), [stkBNB](https://bscscan.com/address/0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16)), [ERC-4226 tokens](https://eips.ethereum.org/EIPS/eip-4626) (like [sFRAX](https://etherscan.io/token/0xa663b02cf0a4b149d2ad41910cb81e23e1c41c32), [sfrxETH](https://etherscan.io/token/0xac3e018457b222d93114458476f3e3416abbe38f)) and any token covertible to other token onchain (like the [Pendle](https://www.pendle.finance) PT tokens). `WeETHOracle` enabled in [VIP-290](https://app.venus.io/#/governance/proposal/290?chainId=56). `AnkrBNBOracle`, `BNBxOracle`, `SlisBNBOracle` and `StkBNBOracle` enabled in [VIP-293](https://app.venus.io/#/governance/proposal/293?chainId=56).

- [Certik audit audit report (2024/04/12)](https://github.com/VenusProtocol/oracle/blob/5cd52976a4c4d24e11ab34ca3aa5f99837eef593/audits/098_correlated_token_oracles_certik_20240412.pdf)
- [Quantstamp audit audit report (2024/04/12)](https://github.com/VenusProtocol/oracle/blob/5cd52976a4c4d24e11ab34ca3aa5f99837eef593/audits/100_correlated_token_oracles_quantstamp_20240412.pdf)
- [Fairyproof audit audit report (2024/03/28)](https://github.com/VenusProtocol/oracle/blob/5cd52976a4c4d24e11ab34ca3aa5f99837eef593/audits/101_correlated_token_oracles_fairyproof_20240328.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#165](https://github.com/VenusProtocol/oracle/pull/165)
    - contracts/oracles/AnkrBNBOracle.sol
    - contracts/oracles/BNBxOracle.sol
    - contracts/oracles/OneJumpOracle.sol
    - contracts/oracles/PendleOracle.sol
    - contracts/oracles/SFraxOracle.sol
    - contracts/oracles/SFrxETHOracle.sol
    - contracts/oracles/SlisBNBOracle.sol
    - contracts/oracles/StkBNBOracle.sol
    - contracts/oracles/WBETHOracle.sol
    - contracts/oracles/WeETHOracle.sol
    - contracts/oracles/WstETHOracle.sol
    - contracts/oracles/common/CorrelatedTokenOracle.sol

</details>

### Native token gateway

**Scope**: [NativeTokenGateway contract](https://github.com/VenusProtocol/isolated-pools//blob/develop/contracts/Gateway/NativeTokenGateway.sol), that facilitates the interaction (borrow, supply, repay and redeem) with markets where the underlying token is a wrapped version of the native token (for example WETH on Ethereum, or BNB on BNB chain). Enabled in [VIP-276](https://app.venus.io/#/governance/proposal/276).

- [Certik audit audit report (2024/02/26)](https://github.com/VenusProtocol/isolated-pools/blob/652459fed7269dab84628f70c44d8fa56b34203e/audits/092_nativeTokenGateway_certik_20240226.pdf)
- [Pessimistic audit audit report (2024/02/29)](https://github.com/VenusProtocol/isolated-pools/blob/652459fed7269dab84628f70c44d8fa56b34203e/audits/095_nativeTokenGateway_pessimistic_20240229.pdf)
- [Quantstamp audit audit report (2024/03/01)](https://github.com/VenusProtocol/isolated-pools/blob/0ec94f4636e51d68197fe6918df096864acd0a23/audits/096_nativeTokenGateway_quantstamp_20240301.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#361](https://github.com/VenusProtocol/isolated-pools/pull/361)
    - contracts/Comptroller.sol
    - contracts/ComptrollerStorage.sol
    - contracts/Gateway/Interfaces/IVtoken.sol
    - contracts/Gateway/Interfaces/IWrappedNative.sol
    - contracts/Gateway/NativeTokenGateway.sol
    - contracts/VToken.sol
    - contracts/VTokenInterfaces.sol
- Pull request [#442](https://github.com/VenusProtocol/venus-protocol/pull/442)
    - contracts/Tokens/VTokens/VBep20.sol
    - contracts/Tokens/VTokens/VToken.sol
    - contracts/Comptroller/Diamond/facets/MarketFacet.sol

</details>

### Oracle for wstETH

**Scope**: [Oracle for wstETH](https://github.com/VenusProtocol/oracle/blob/develop/contracts/oracles/WstETHOracle.sol), using the exchange rate `wstETH/stETH` from the `stETH` contract on Ethereum, assuming 1:1 for the conversion rate `stETH:ETH`, and converting `ETH` to `USD` using the Resilient Oracles.

- [Certik audit audit report (2024/01/26)](https://github.com/VenusProtocol/oracle/blob/e99feb67f4677168632f5bedd70034fba8dc55db/audits/090_wstETHOracle_certik_20240126.pdf)
- [Quantstamp audit audit report (2024/02/20)](https://github.com/VenusProtocol/oracle/blob/f34d3114267929bbba26743f0a8591c1b016fb94/audits/093_wstETHOracle_quantstamp_20240220.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#155](https://github.com/VenusProtocol/oracle/pull/155) in the `oracle` repo
    - contracts/oracles/WstETHOracle.sol

</details>

### Token converters

**Scope**: [Token converter contracts](https://github.com/VenusProtocol/protocol-reserve/pull/9). These contracts will allow the protocol to convert the income generated to the needed tokens, following the [Tokenomics](https://snapshot.org/#/venus-xvs.eth/proposal/0xc9d270ccecb7b91c75b95b8d9af24fc7c20cd38c0c0c44888ed4e7724f4e7ce9). Enabled in [VIP-245](https://app.venus.io/#/governance/proposal/245) and [VIP-248](https://app.venus.io/#/governance/proposal/248).

- Token converters
    - [OpenZeppelin audit report (2023/10/10)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/066_tokenConverter_openzeppelin_20231010.pdf)
    - [Certik audit audit report (2023/11/07)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/074_tokenConverter_certik_20231107.pdf)
    - [Peckshield audit report (2023/09/27)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/068_tokenConverter_peckshield_20230927.pdf)
    - [Fairyproof audit report (2023/08/28)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/067_tokenConverter_fairyproof_20230828.pdf)
- Private conversions (optimization to avoid the payment of incentives to third parties when the conversion can be completed internally)
    - [Certik audit report (2023/11/27)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/081_privateConversions_certik_20231127.pdf)
    - [Certik audit addendum (2024/02/15)](https://github.com/VenusProtocol/protocol-reserve/blob/ba39ce060d0716be1131913e4dd6e93c1444e0c3/audits/081_privateConversions_certik_20240215.pdf)
    - [OpenZeppelin report (2024/01/09)](https://github.com/VenusProtocol/protocol-reserve/blob/f31dc8bb433f1cff6c2124d27742004d82b24c32/audits/082_privateConversions_openzeppelin_20240109.pdf)
    - [OpenZeppelin addendum (2024/02/20)](https://github.com/VenusProtocol/protocol-reserve/blob/ba39ce060d0716be1131913e4dd6e93c1444e0c3/audits/082_privateConversions_openzeppelin_20240220.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#9](https://github.com/VenusProtocol/protocol-reserve/pull/9) in the `protocol-reserve` repo.
  - contracts/TokenConverter/AbstractTokenConverter.sol
  - contracts/TokenConverter/IAbstractTokenConverter.sol
  - contracts/TokenConverter/RiskFundConverter.sol
  - contracts/TokenConverter/XVSVaultConverter.sol
  - contracts/ProtocolReserve/RiskFundStorage.sol
  - contracts/ProtocolReserve/RiskFundV2.sol
  - contracts/ProtocolReserve/XVSVaultTreasury.sol
  - contracts/Utils/Constants.sol
  - contracts/Utils/Validators.sol

- Pull request [#35](https://github.com/VenusProtocol/protocol-reserve/pull/35) in the `protocol-reserve` repo.
  - contracts/Interfaces/IConverterNetwork.sol
  - contracts/TokenConverter/AbstractTokenConverter.sol
  - contracts/TokenConverter/ConverterNetwork.sol
  - contracts/TokenConverter/IAbstractTokenConverter.sol
  - contracts/TokenConverter/RiskFundConverter.sol
  - contracts/TokenConverter/SingleTokenConverter.sol
  - contracts/Utils/ArrayHelpers.sol

</details>

### XVS bridge and multichain deployment

**Scope**: [token-bridge](https://github.com/VenusProtocol/token-bridge) repository, with contracts to allow the bridge of XVS tokens from/to BNB to/from other EVM compatible networks, like Ethereum. Extend the OFTV2 LayerZero contracts, adding custom security rules. XVS and TokenController contract, to be used on the destination chains (initially Ethereum mainnet, Arbitrum one, Polygon zkEVM and opBNB). Moreover, the audit scope included: a new [`VTreasuryV8`](https://github.com/VenusProtocol/venus-protocol/pull/345) contract, and changes in the [Resilient Oracle](https://github.com/VenusProtocol/oracle/pull/124) and Isolated pools](https://github.com/VenusProtocol/isolated-pools/pull/294) to make them compatible with other networks. Enabled in [VIP-232](https://app.venus.io/#/governance/proposal/232).

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

Enabled in [VIP-201](https://app.venus.io/#/governance/proposal/201), [VIP-202](https://app.venus.io/#/governance/proposal/202), [VIP-203](https://app.venus.io/#/governance/proposal/203), [VIP-206](https://app.venus.io/#/governance/proposal/206) and [VIP-210](https://app.venus.io/#/governance/proposal/210). Updated in [VIP-225](https://app.venus.io/#/governance/proposal/225).

- [OpenZeppelin audit report (2023/10/03)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/065_prime_openzeppelin_20231003.pdf)
- [Certik audit audit report (2023/11/13)](https://github.com/VenusProtocol/venus-protocol/blob/2425501070d28c36a73861d9cf6970f641403735/audits/060_prime_certik_20231113.pdf)
- [Peckshield audit report (2023/08/26)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/055_prime_peckshield_20230826.pdf)
- [Fairyproof audit report (2023/09/10)](https://github.com/VenusProtocol/venus-protocol/blob/e02832bb2716bc0a178d910f6698877bf1b191e1/audits/056_prime_fairyproof_20230910.pdf)
- [Code4rena contest (2023/09/28)](https://code4rena.com/contests/2023-09-venus-prime)
- [Certik audit audit report (2023/12/19) - Venus Prime update](https://github.com/VenusProtocol/venus-protocol/blob/9afe804f18cd02318626aea46686522542aa5e4d/audits/087_prime_certik_20231219.pdf)
  - Allow mint VAI only to Prime holder
  - Support for Isolated pools
  - Support for networks without a constant block rate (for example, Arbitrum)

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

- Venus Prime update. Enabled in [VIP-225](https://app.venus.io/#/governance/proposal/225).

  - Pull request [#407](https://github.com/VenusProtocol/venus-protocol/pull/407)
    - contracts/Tokens/Prime/IPrime.sol
    - contracts/Tokens/Prime/Interfaces/IPrime.sol
    - contracts/Tokens/Prime/Prime.sol
    - contracts/Tokens/Prime/PrimeLiquidityProvider.sol
    - contracts/Tokens/Prime/PrimeStorage.sol
    - contracts/Utils/TimeManager.sol
    - contracts/Tokens/VAI/VAIController.sol
    - contracts/Tokens/VAI/VAIControllerStorage.sol
  - Pull request [#327](https://github.com/VenusProtocol/isolated-pools/pull/327)
    - contracts/Comptroller.sol
    - contracts/ComptrollerStorage.sol
    - contracts/VToken.sol

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
* [HashEx vulnerability report - 2024/02/01](https://github.com/VenusProtocol/oracle/blob/567b057fd010a0359651db5604defec35a378cf1/audits/097_twap_hashex_20240201.pdf). No risks, because the TWAP oracle is not used at all by the Venus Protocol. The `TwapOracle` is [removed from the repository](https://github.com/VenusProtocol/oracle/pull/167) to avoid any confusion.

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

### Automatic Income Allocation in the Liquidator contract

**Scope**: Integration of the [Automatic Income Allocation](./whats-new/automatic-income-allocation.md) into the [Liquidator contract](https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/Liquidator/Liquidator.sol) used in the Core pool on BNB chain.

* [OpenZeppelin audit report (2023/July/20)](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/048_liquidator_openzeppelin_20230720.pdf)
* [Quantstamp audit report (2023/July/17)](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/046_liquidator_quantstamp_20230717.pdf)
* [Certik audit report (2023/July/4)](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/041_liquidator_certik_20230704.pdf)
* [Peckshield audit report (2023/July/5)](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/039_liquidator_peckshield_20230705.pdf)

<details>
<summary>Detailed scope</summary>

- Pull request [#241](https://github.com/VenusProtocol/venus-protocol/pull/241) in the `venus-protocol` repo.
  - contracts/Liquidator/Liquidator.sol
  - contracts/Liquidator/LiquidatorStorage.sol

</details>

### Swap router

**Scope**: SwapRouter contract, enabled on [VIP-131](https://app.venus.io/governance/proposal/131).

* [OpenZeppelin audit report - 2023/06/16](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/027_swapRouter_openzeppelin_20230616.pdf)
* [Certik audit report - 2023/05/30](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/030_swapRouter_certik_20230530.pdf)
* [Peckshield audit report - 2023/04/19](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/014_swapRouter_peckshield_20230419.pdf)
* [Hacken audit report - 2023/06/28](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/029_swapRouter_hacken_20230628.pdf)

### VToken

**Scope**: Delegate Borrowing in Venus. Upgrade of BUSD, USDC, USDT, BTCB and ETH markets, to reduce the risks on Venus that resulted from the September 2022 BNB Bridge incident. Executed on [VIP-99](https://app.venus.io/governance/proposal/99).

* [Peckshield audit report - 2023/02/27](https://github.com/VenusProtocol/venus-protocol/blob/develop/audits/009_vtoken_peckshield_20230227.pdf)
