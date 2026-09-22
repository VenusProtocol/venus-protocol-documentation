# Tokenomics

Venus Protocol revenue distribution is configured by governance. [Tokenomics version 4.1](https://snapshot.box/#/s:venus-xvs.eth/proposal/0xb8f03ad2dd2988a6d2e89a1adbebc52c7a62b284ea493008752c71b7f00b3386) established the model, [VIP-585](https://venus.io/governance/proposal/585?chainId=56) ended the BNB Burn allocation and introduced chain-revenue eligibility rules, [VIP-620](https://venus.io/governance/proposal/620?chainId=56) (May 2026) replaced the token converters with single-purpose TokenBuyback contracts, and [VIP-638](https://venus.io/governance/proposal/638?chainId=56) (executed 1 July 2026) implemented [Tokenomics Phase II](https://community.venus.io/t/venus-tokenomics-phase-ii-prime-rewards-redesign/5774): the share previously routed to XVS Vault rewards now goes to Venus Prime.

{% hint style="warning" %}
The percentages and reward speeds below are a governance-policy snapshot, not immutable token properties. Check recent VIPs and the live Protocol Share Reserve and XVS Vault configuration before using them in financial models.
{% endhint %}

## Protocol reserve revenue

Protocol reserves are primarily generated from interest paid by borrowers. For an eligible deployment, the configured allocation is:

| Destination | Share |
| --- | ---: |
| Treasury | 40% |
| Venus Prime | 40% |
| Risk Fund | 20% |

XVS Vault rewards no longer receive a share of protocol revenue on BNB Chain; since VIP-638 that 20% is allocated to Venus Prime. The Prime allocation supplies eligible markets with protocol-funded rewards. The Risk Fund helps cover protocol shortfalls.

Each share is delivered through a TokenBuyback contract rather than a direct transfer: the Prime share is bought into USDT and U and sent to the PrimeLiquidityProvider, the Risk Fund share is bought into USDT and sent to RiskFundV2, and the Treasury share is bought into U, BTCB, ETH, USDT, USDC and XVS and sent to the VTreasury. An off-chain operator executes the buybacks. The live rows can be read with `totalDistributions()` and `distributionTargets(i)` on the [Protocol Share Reserve](../deployed-contracts/funds.md).

## Other revenue

Revenue streams such as liquidation income use this allocation:

| Destination | Share |
| --- | ---: |
| Treasury | 60% |
| Venus Prime | 20% |
| Risk Fund | 20% |

New products or revenue sources may use a different governance-approved configuration.

## Chain eligibility

A deployment is eligible to allocate revenue to Venus Prime and the Risk Fund when it generates at least $50,000 in average monthly revenue over the preceding six months. An ineligible deployment routes 100% of its revenue to the Treasury; at the time of writing Ethereum and Arbitrum One route 100% of both revenue types to their VTreasury. Governance periodically evaluates eligibility, so it can change as the rolling revenue window changes.

## XVS Vault rewards

Vault reward speed is governance-configured. Since VIP-638 the vault is not a Protocol Share Reserve destination; its rewards are funded by governance proposals, which can combine a base allocation with XVS bought back into the Treasury. It is not a guaranteed yield or a permanent emission rate.

[VIP-641](https://venus.io/governance/proposal/641?chainId=56) retained a base allocation equivalent to 308.7 XVS per day and, together with buybacks, configured a total BNB Chain vault speed equivalent to 535 XVS per day for Q3 2026. At BNB Chain block `118,362,254`, the XVS Vault reported `0.002786458333333333` XVS per block, equivalent to the same nominal daily rate at 192,000 blocks per day.

Future VIPs can fund the vault and change the speed at any time. Read `rewardTokenAmountsPerBlockOrSecond(XVS)` on the live XVS Vault and review its funding balance before quoting a current reward rate.

<figure><img src="../.gitbook/assets/tokenomics.svg" alt="Venus Protocol revenue distribution between the Treasury, Venus Prime, and Risk Fund"><figcaption><p><em>Governance-configured revenue distribution</em></p></figcaption></figure>
