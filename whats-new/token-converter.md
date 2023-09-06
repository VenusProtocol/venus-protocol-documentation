# Token Converter

{% hint style="warning" %}
**To be released**
{% endhint %}

### Overview

Protocol revenues, sourced from reserve interests and liquidations, are processed through the [Automatic Income Allocation](automatic-income-allocation.md) module. Once allocated, these underlying tokens are subsequently sent to various Token Converters, each transforming the received income into specific tokens, automating and optimizing this conversion process.

### Key Aspects of the Token Converter

The Token Converter works on four key principles:

1. **Distributed and Autonomous**: No centralized management or human interactions needed, ensuring a secure and seamless conversion process.
2. **Efficient**: The system is designed to maximize the amount of specific tokens we receive while protecting against potential risks like sandwich attacks.
3. **Streaming**: The conversions occur continually, without waiting for scheduled intervals.
4. **Transparent**: All conversions are publicly recorded in the blockchain, reinforcing our commitment to transparency.

Venus Protocol will offer discounts to incentivize these conversions. This incentive will create arbitrage opportunities in the market, and external agents can potentially gain from these opportunities.

### Rational

Before the Token Converter, token conversions were not as seamless and efficient. Venus Protocol needed a system that could constantly convert the received income into specific tokens, with no room for errors or delays.

The Token Converter streamlines the conversion process by allowing key elements in the Venus Protocol, such as the XVSVaultConverter and RiskFundConverter, to autonomously offer token conversions. This solution follows the rules of distributed and autonomous systems, removing the need for human intervention.

Moreover, the introduction of incentives through discounts encourages external agents to take part in the conversion process, thus creating a win-win situation for all. This is in line with the vision of decentralization, where processes are not only transparent but also rewarding for participants.

### Architecture

<figure><img src="../.gitbook/assets/Group 55072 (1).png" alt=""><figcaption></figcaption></figure>

_The dashed lines represent transactions initiated by external agents (VIP’s, scripts, arbitrage bots, etc.), and the solid lines represent transfers of funds._
