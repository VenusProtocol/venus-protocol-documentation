# Overview

The **Venus** **Protocol** generates income in various underlying tokens that subsequently conveyed to the ProtocolShareReserve contract. The **ProtocolShareReserve** contract disburses these earnings to number of destinations, including the following:

- **RiskFundConverter**
- **SingleTokenConverters** including the following:
  - **USDTPrimeConverter**
  - **USDCPrimeConverter**
  - **BTCBPrimeConverter**
  - **ETHPrimeConverter**
  - **XVSVaultConverter**
- **VTreasury**

**RiskFundConverter** and **SingleTokenConverters** convert the incoming earnings into specific tokens, with **RiskFundConverter** converting them into RiskFund's convertible base asset and **SingleTokenConverters** converting them into their **BaseAsset**. Each time a conversion gets complete, the resulting tokens are sent to their destination addresses, respectively.

The following diagram illustrates the flow of funds between contracts and the architecture it has:

<figure><img src="../../.gitbook/assets/token_converter_funds.svg" alt=""><figcaption></figcaption></figure>

**RiskFundConverter** and **SingleTokenConverters** possess the ability to "facilitate" token conversions for the income they receive, obtaining the desired tokens(base asset) by relying on oracle prices as reference points to accept conversions that external agents will carry out.

Venus encourages these conversions by providing incentives that create arbitrage opportunities in the market, with the expectation that external agents will seize upon these opportunities.

The diagram below illustrates the connection between income harvesting (the process by which Venus transfers income from its sources to the ProtocolShareReserve), distribution (application of the protocol's Tokenomics-defined rules), and conversion (acquiring the required base assets).

<figure><img src="../../.gitbook/assets/Screenshot from 2023-09-05 11-45-26.png" alt=""><figcaption></figcaption></figure>

## What is the need for a converter?

Previously, Venus relied on **PancakeSwap** for asset conversions but encountered issues related to exchange fees and significant fluctuations in exchange rates and slippage when dealing with large token amounts. Due to this Venus developed its token converter.

# AbstractTokenConverter

**AbstractTokenConverter** contract provides every feature to configure and convert the desired assets. This way, the **RiskFundConverter** and the **SingleTokenConverters** extend this abstract contract (that could also be extended by any other contract in the future because it provides their features in an agnostic way).


## Configuration of conversions

There will be one configuration per pair **tokenAddressIn-tokenAddressOut** to execute the conversion successfully.

## Incentives

To incentivize conversions we allow an increase in the final amount sent out from the converter contract. Example:

- Given:
    - Conversion rate provided by the oracle: 1 XVS = 5 USDC
    - Incentive: 10%
- If the user sends 1 XVS to the contract, they will receive 5.5 USDC (5 USDC base + 0.5 USDC applying the incentive).

The incentive is applied on the base out amount calculated using the conversion rate, calculated with the oracle prices.

## Private Conversion
Private conversion aims to maximize the conversion of tokens received from PSR (to any converter) among existing converters. This is done to preserve incentives and reduce user dependence on conversion. Converters will autonomously carry out Private Conversion whenever funds are received from ProtocolShareReserve, and no incentives will be provided during this process.

The following diagram illustrates the flow of private conversion.

<figure><img src="../../.gitbook/assets/Screenshot from 2023-12-21 15-24-18.png" alt=""><figcaption></figcaption></figure>

# RiskFundConverter

The **RiskFundConverter** contract extends the **AbtractTokenConverter** contract. It maintains a distribution of assets per comptroller and assets. **ProtocolShareReserve** sends the **RiskFund's** share of income to this contract which will convert the assets and send them to RiskFund.


# SingleTokenConverter

The **SingleTokenConverter** contract extends the **AbtractTokenConverter** contract. ProtocolShareReserve distributes the income share among various SingleTokenConverter contracts, such as the USDTPrimeConverter contract. This particular contract facilitates the conversion of assets to its base asset and subsequently sends them to their designated destination address.

Users can convert tokens through these contracts(**RiskFundConverter** and **SingleTokenConverters**) and receive the converted tokens along with an incentive. A conversion config for the **tokenAddressIn-tokenAddressOut** pair is necessary for a successful conversion; otherwise, the conversion will revert.

# XVSVaultTreasury

One instance of XVSVaultTreasury is configured as the destination address in the XVSVaultConverter.
This treasury is used to fund the XVSVault.

# ConverterNetwork
This contract contains the list of all the converters and will provide valid converters which can perform Conversions.
Converters will interact with this contract to get the list of other converters open for **Private conversion**.