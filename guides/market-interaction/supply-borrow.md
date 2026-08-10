# Supplying and borrowing

In this guide, we will focus on using Venus Protocol to earn interest and borrow assets. If you're looking for a more technical understanding of what's happening under the hood, check out [Venus Protocol's whitepaper](https://github.com/VenusProtocol/venus-protocol-documentation/blob/main/whitepapers/Venus-whitepaper-v4.pdf).

{% hint style="info" %}
**Before you start**

* **Supported networks:** Venus is available on BNB Chain, Ethereum, and several additional chains. Each pool specifies which network it runs on.
* **Gas token:** Keep a small balance of the network's native token in your wallet to pay transaction fees (BNB on BNB Chain, ETH on Ethereum, etc.).
* **Wallet:** You will need a compatible Web3 wallet (e.g. MetaMask) connected to the correct network. Open the Venus app at [https://app.venus.io](https://app.venus.io) and connect your wallet to get started.
{% endhint %}

After successfully connecting your wallet, you will gain access to all the features of the Venus Protocol interface. In the Dashboard menu you will find all the markets. Clicking one of the markets a new modal will pop out, enabling you to interact with the selected market. Just make sure you are under the "Supply" or "Borrow" tab, depending on the desired action.

## Supply Assets to Earn Interest

1. Connect your Web3 wallet to the Venus app ([https://app.venus.io](https://app.venus.io)).
2. Navigate to the "Dashboard" menu and choose the asset you want to supply. For example, if you want to supply TRX, click on the TRX market.
3. Enable the asset. This will prompt a transaction confirmation in your wallet. Remember that a small gas fee applies, so ensure some native tokens (BNB for BNB chain, or ETH for Ethereum, for example) are available in your wallet.
4. Specify the amount you want to supply. The selected assets are transferred directly from your wallet to Venus Protocol, earning interest immediately. This interest will be automatically added to your Supply Balance.
5. **Enable as collateral.** After supplying, open the market modal and toggle the asset's collateral switch to the on position if you intend to borrow against it. Collateral is **not** enabled by default — you must turn it on explicitly before your supplied balance counts toward your borrowing limit.

Each market has a **supply cap** — the maximum total amount of that asset the protocol will accept as supply, set by governance to limit risk concentration; once it is reached, no further supply of that asset is possible until the cap is raised.

{% hint style="warning" %}
**Deprecated markets:** Some assets are deprecated and have a collateral factor of 0%, meaning they cannot be used as collateral regardless of the toggle setting. The UI labels deprecated markets clearly. Avoid supplying to a deprecated market if your goal is to borrow against the position.
{% endhint %}

## Manage your Borrowing Limit

Your borrowing limit on Venus Protocol is a function of the assets you have supplied. The following steps guide you to manage it:

1. Navigate to the "Account" section.
2. Here, you'll find your Borrow Limit on each pool, represented as a percentage of the total value of your supplied assets.
3. To adjust this limit, you can either supply more assets or repay some of your outstanding loans.

## Borrow Assets on Venus Protocol

After supplying assets and enabling them as collateral, you can borrow other assets within your borrowing limit.

Venus tracks your borrow risk through two key indicators:

* **Health Factor (HF):** A ratio above 1.0 means your position is healthy. As your borrowed value approaches the liquidation threshold of your collateral value, the HF falls toward 1.0. If it reaches 1.0, your position becomes eligible for liquidation.
* **Borrow Limit Used %:** Shown in the UI as a progress bar; it represents how much of your available borrowing capacity is in use. Aim to keep this well below 100% to give yourself a safety buffer against price swings.

{% hint style="warning" %}
When your Borrow Limit Used approaches 100% (Health Factor approaches 1.0), your account becomes eligible for liquidation. A liquidator can repay part of your debt and claim a portion of your collateral at a discount. To avoid this, repay debt or supply additional collateral before your health factor drops too low. See [Liquidations](liquidation.md) and [Protection Mode](../../risk/protection-mode.md) for more details.
{% endhint %}

To borrow:

1. From the "Dashboard" menu, select the asset you want to borrow.
2. Input the amount you wish to borrow and confirm the transaction.

## Farm $XVS tokens

In addition to earning interest on supplied assets, you can also earn protocol rewards:

* **Venus Prime** is the flagship rewards program — eligible users who stake XVS receive a non-transferable Prime token that boosts their APY on selected markets. See [Venus Prime](../../whats-new/prime-yield.md) for eligibility criteria and how to qualify.
* **XVS and VAI Vaults** let you stake XVS or VAI tokens to earn additional XVS rewards. See the [Vaults guide](../vaults.md) for step-by-step staking instructions.

## Lending and Borrowing Example

Let's assume you supply 1000 TRX to Venus, and the vTRX/TRX rate is 0.0204. You'd receive approximately 49,019 vTRX in return (1000 / 0.0204). If the vTRX/TRX rate increases to 0.0215 after a year, your 49,019 vTRX would be worth 1021.5 TRX (49019 \* 0.0215), an increase of 21.5 TRX.

Remember that these vTokens represent your collateral in Venus Protocol. It's crucial not to trade or transfer them if you have an active loan, as they're required to maintain your borrowing limit.

## Wrapping ETH (WETH)

Venus markets on Ethereum-based networks require WETH (an ERC-20 wrapper for native ETH) rather than ETH itself. See the [Wrapping and Unwrapping ETH guide](weth-wrapping.md) for step-by-step instructions.

## Discover more features

Once you're comfortable with the basics, explore these advanced capabilities:

* [E-Mode (Efficiency Mode)](../enable-e-mode.md) — maximize capital efficiency for correlated asset pairs
* [Boost and Repay with Collateral](../leveraged-positions.md) — open leveraged positions using your existing collateral
* [Venus Prime](../../whats-new/prime-yield.md) — boost your APY by staking XVS and earning a Prime token
* [Vaults](../vaults.md) — stake XVS or VAI to earn additional protocol rewards
