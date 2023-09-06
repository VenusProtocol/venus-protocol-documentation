---
layout:
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Prime Yield

{% hint style="warning" %}
**To be released**
{% endhint %}

### **Overview**

Venus Protocol is excited to announce Venus Prime, a revolutionary incentive program aimed to bolster user engagement and growth within the protocol. An integral part of Venus Tokenomics v3.1, Venus Prime aims to enhance yields and promote $XVS staking, focusing on markets including USDT, USDC, BTC and ETH. The launch is targeted for early Q4 2023.

### **Venus Prime Essentials**

Venus Prime's uniqueness lies in its self-sustaining rewards system, instead of external sources, rewards are derived from the protocol's revenue, fostering a sustainable and ever-growing program.

Eligible $XVS holders will receive a unique, non-transferable Soulbound Token, which boosts the annual percentage yields (APYs) across selected markets.&#x20;

**Prime Tokens:**

Venus Prime encourages user commitment through two unique Prime Tokens:

1. **Irrevocable "OG" Prime Token:**
   * Users must keep XVS staked (locked in) for 12 straight months.
   * Users also need to use Venus to supply and borrow at least once every month for a year.
2. **Revocable Prime Token:**
   * Users need to stake at least 1,000 XVS for 90 days in a row.
   * After these 90 days, they can get their Prime Token.
   * If a user decides to withdraw XVS and their balance falls below 1,000, their Prime Token will be revoked.

<figure><img src="../.gitbook/assets/6e01c33d-ac9e-41d6-9542-fc2f3b0ecb90.png" alt=""><figcaption></figcaption></figure>

### **Expected Impact and Launch**

Venus Prime aims to incentivize larger stake sizes and diverse user participation. This is expected to significantly increase the staking of XVS, the Total Value Locked (TVL), and market growth.

Venus Prime intends to promote user loyalty and the overall growth of the protocol. By endorsing long-term staking, discouraging premature withdrawals, and incentivizing larger stakes, Venus Prime sets a new course in user engagement and liquidity, contributing to Venus Protocol's success.

Stake your $XVS tokens today to be eligible for Venus Prime, an exciting new venture in the DeFi landscape.



### Technical Reward Details

**Reward Formula: Cobb-Douglas function**

$$
Rewards_{i,m} = \Gamma_m \times \mu \times \frac{\tau_{i}^\alpha \times \sigma_{i,m}^{1-\alpha}}{\sum_{j,m} \tau_{j}^\alpha \times \sigma_{j,m}^{1-\alpha}}
$$

Where:

* $$Rewards_{i,m}$$ = Rewards for user $$i$$ in market $$m$$&#x20;
* $$\Gamma_m$$ = Protocol Reserve Revenue for market $$m$$
* $$μ$$ = Proportion to be distributed as rewards
* $$α$$ = Protocol stake and supply & borrow amplification weight
* $$τ_{i}​$$ = XVS staked amount for user $$i$$
* $$\sigma_i$$ = Sum of **qualified** supply and borrow balance for user $$i$$
* $$∑_{j,m}​$$ = Sum for all users $$j$$ in markets $$m$$&#x20;

**Qualifiable supply and borrow:**

$$
\begin{align*}
\sigma_{i,m} &= \min(\tau_i \times borrowMultiplier_m, borrowedAmount_{i,m}) \\
&+ \min(\tau_i \times supplyMultiplier_m, suppliedAmount_{i,m})
\end{align*}
$$

### User Reward Example:

**Model Parameters**

* $$α$$ = 0.5
* $${\sum_{j,BTC} \tau_{j}^\alpha \times \sigma_{j,BTC}^{1-\alpha}}$$ = 744,164
* $$\Gamma_{BTC}$$  = 8 BTC
* $$\mu$$ = 0.2
* BTC Supply Multiplier = 2
* XVS Price = $4.0

**User Parameters**

| User Parameters | Token Value | USD Value |
| --------------- | ----------- | --------- |
| Staked XVS      | 1,200       | $4,800    |
| BTC Supply      | 0.097       | $2,500    |

**Reward Calculation:**

Qualifiable supply and borrow:

$$σ_{i,BTC} =min($9600,\text{ } $2500)$$&#x20;

$$σ_{i,BTC}  = $2,500$$

$$Rewards_{i, BTC} = 8\times 0.2\times \dfrac{1,200^{0.5}\times 2,500^{0.5}}{744,164}$$&#x20;

$$Rewards_{i, BTC} = \ 0.00372$$

$$\text{User APY Increase} = \dfrac{0.00372}{0.097} = 3.88\%$$&#x20;
