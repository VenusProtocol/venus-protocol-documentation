# Overview

The **Venus** **Protocol** generates income in various underlying tokens, which are subsequently conveyed to the ProtocolShareReserve contract. Subsequently, the **ProtocolShareReserve** contract disburses these earnings to various destinations, including the **RiskFundConverter**, **VTreasury**, **Prime**, and **XVSVaultConverter**.

**XVSVaultConverter** and **RiskFundConverter** convert the incoming earnings into specific tokens, with **XVSVaultConverter** converting them into **XVS** tokens and **RiskFundConverter** converting them into **Stable** tokens. Each time a conversion is completed, the resulting tokens are sent to the **XVSVaultTreasury** and **RiskFund** contracts, respectively. 

The following diagram illustrates the flow of funds between contracts and the architecture it has:

<figure><img src="../../.gitbook/assets/Screenshot from 2023-09-05 11-43-22.png" alt=""><figcaption></figcaption></figure>

**RiskFundConverter** and **XVSVaultConverter** possess the ability to "facilitate" token conversions for the income they receive, obtaining the desired tokens (USDT or XVS) by relying on Oracle prices as reference points to accept conversions that external agents will carry out. Venus contracts do not actively execute token conversions, instead, they merely extend conversion opportunities.

Venus encourages these conversions by providing incentives that create arbitrage opportunities in the market, with the expectation that external agents will seize upon these opportunities.

The diagram below illustrates the connection between income harvesting (the process by which Venus transfers income from its sources to the ProtocolShareReserve), distribution (application of the protocol's Tokenomics-defined rules), and conversion (acquiring the required XVS or USDT tokens).

<figure><img src="../../.gitbook/assets/Screenshot from 2023-09-05 11-45-26.png" alt=""><figcaption></figcaption></figure>

## What is the need of converter?

Previously, Venus relied on **PancakeSwap** for asset conversions, but encountered issues related to exchange fees and significant fluctuations in exchange rates and slippage when dealing with large token amount. Due to this Venus developed it's own token converter.

# AbstractTokenConverter

**AbstractTokenConverter** contract provides every feature to configure and convert the desired assets. This way, the **XVSVaultConverter**, and the **RiskFundConverter** extends this abstract contract (that could also be extended by any other contract in the future because it provides their features in an agnostic way).


## Configuration of conversions

There will be one configuration per pair **tokenAddressIn-tokenAddressOut** to execute the conversion successfully.

# Incentives

To incentive the conversions, we’ll allow increasing the final amount sent out from the converter contract. Example:

- Given:
    - Conversion rate provided by the oracle: 1 XVS = 5 USDC
    - Incentive: 10%
- If the user sends 1 XVS to the contract, they will receive 5.5 USDC (5 USDC base + 0.5 USDC applying the incentive).

The incentive is applied on the base out amount calculated using the conversion rate, calculated with the oracle prices.

# RiskFundConverter

The **RiskFundConverter** contract extends the **AbtractTokenConverter** contract. It maintains a distribution of assets per comptroller and assets. **ProtocolShareReserve** sends the **RiskFund's** share of income to this contract which will convert the assets and send them to RiskFund.

Users can interact with this contract to convert their tokens, users will receive the converted tokens with the incentive.

There should be a conversion config available for the **tokenAddressIn-tokenAddressOut** for a successfull conversion otherwise the conversion will revert.

## XVSVaultConverter

The **XVSVaultConverter** extends the **AbtractTokenConverter** contract. ProtocolShareReserve will send XVSvault’s share of the income to this contract which will help to convert the assets to XVS and send them to XVSVaultTreasury.

Users can interact with this contract to convert their tokens, users will receive the converted tokens with the incentive.

There should be a conversion config available for the **tokenAddressIn-tokenAddressOut** for a successfull conversion otherwise the conversion will revert.

## XVSVaultTreasury

One instance of XVSVaultTreasury is configured as the destination in the XVSVaultConverter.
This treasury is used to fund the XVSVault.

