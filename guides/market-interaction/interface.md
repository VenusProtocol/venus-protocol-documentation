# Venus interface

Let's take a quick look at the Venus interface and the features available in each menu of the navigation bar.

{% hint style="info" %}
Screenshots in this guide are illustrative. The live app at [app.venus.io](https://app.venus.io) is the authoritative source of truth and may look different as the UI continues to evolve.
{% endhint %}

### Dashboard

In the center of the Dashboard interface, you will find the Supply and Borrow markets. You'll also notice a new column called 'Pool' which identifies the pool to which each market belongs. The Supply market allows you to lend your cryptocurrency assets and earn interest on them. You can choose which assets to supply and specify the amount you want to lend. On the other hand, the Borrow market allows you to borrow cryptocurrency assets by using your supplied assets as collateral. You can select the assets you want to borrow and specify the amount you need.

From the market interaction modal on the Dashboard, you can also access **Boost** (Leveraged Positions) — a feature that lets you open leveraged supply or borrow positions using your existing collateral. See the [Boost and Repay with Collateral guide](../leveraged-positions.md) for details.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.35.46 AM.png" alt="Venus Dashboard showing Supply and Borrow markets with Pool column"><figcaption>Venus Dashboard — Supply and Borrow markets, with a Pool column identifying each market's pool</figcaption></figure>

### Account

The Account interface provides an overview of your supplied and borrowed assets. Here, you can keep track of your balances and monitor the status of your transactions.

<figure><img src="../../.gitbook/assets/Venus_account.png" alt="Venus Account interface showing supplied and borrowed asset balances"><figcaption>Account overview — track your supplied assets, borrowed assets, and transaction history</figcaption></figure>

### Core Pool

The Core Pool interface is your hub for exploring all primary markets available. It allows you to click on each market to examine essential metrics such as 'Supply APY', 'Borrow APY', and 'Total Liquidity', among others. This interface centralizes all your lending and borrowing activities within the main markets.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 10.01.29 AM.png" alt="Core Pool market list showing Supply APY, Borrow APY, and Total Liquidity columns"><figcaption>Core Pool — browse all primary markets and their key metrics</figcaption></figure>

### Pools

The Pools interface allows you to explore all isolated pools available. You can click on each pool to view all the markets within it. In the markets, you can see various metrics such as 'Supply APY', 'Borrow APY', 'Total Liquidity', and more.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.33.46 AM.png" alt="Isolated Pools list showing available pools and their aggregate metrics"><figcaption>Isolated Pools — each pool has its own set of markets and independent risk parameters</figcaption></figure>

### Vaults

The Vaults interface allows you to access and manage the vaults associated with Venus Protocol. Vaults are designed to provide users with automated strategies for optimizing their yields and managing their assets more efficiently.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.33.54 AM.png" alt="Vaults interface showing available vault strategies and APY rates"><figcaption>Vaults — stake XVS or VAI to earn rewards and access automated yield strategies</figcaption></figure>

### Swap

The Swap feature enables you to swap one cryptocurrency for another within Venus Protocol. Swapping is now integrated into the **Trade** interface — see the [Trade](#trade) section below for more details.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.38.18 AM.png" alt="Swap interface for exchanging one cryptocurrency for another"><figcaption>Swap — quickly exchange assets; this feature is now part of the unified Trade interface</figcaption></figure>

### History

In the History interface, you can review transaction history and track your previous activities on the Protocol.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.38.32 AM (1).png" alt="Transaction History interface listing past protocol interactions with date and amount"><figcaption>History — review all your past supply, borrow, repay, and withdrawal transactions</figcaption></figure>

### Governance

The Governance interface provides access to Venus Protocol's governance features. Here, users can participate in voting and contribute to decision-making processes that shape the future of the protocol.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.38.48 AM.png" alt="Governance interface showing active and past VIPs with voting status"><figcaption>Governance — vote on Venus Improvement Proposals (VIPs) and shape protocol decisions</figcaption></figure>

### XVS

The XVS interface displays the current daily reward distribution rate for each of the protocol markets.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.39.02 AM.png" alt="XVS rewards interface showing daily XVS distribution rate per market"><figcaption>XVS — see how XVS rewards are distributed across protocol markets</figcaption></figure>

### VAI

The VAI interface is where you can mint and manage the VAI stablecoin. VAI is created on Venus Protocol and is pegged to the value of one USD.

<figure><img src="../../.gitbook/assets/Screenshot 2023-08-02 at 9.39.11 AM.png" alt="VAI interface showing minting controls and current VAI balance"><figcaption>VAI — mint and manage the Venus USD-pegged stablecoin</figcaption></figure>

### Trade

The Trade interface provides a unified swap and leverage experience within Venus Protocol. You can swap assets at competitive rates and — for supported markets — open leveraged supply positions directly from this screen. See the [Trade guide](../trade.md) and the [Trade announcement](../../whats-new/trade.md) for a full walkthrough.

### E-Mode

E-Mode (Efficiency Mode) lets you maximize capital efficiency when borrowing assets that are closely correlated with your collateral — for example, borrowing USDC against USDT. In E-Mode, the protocol applies higher collateral factors and lower liquidation thresholds for correlated asset pairs. See the [Enable E-Mode guide](../enable-e-mode.md) and the [E-Mode announcement](../../whats-new/e-mode.md) for setup instructions.

### Prime

Venus Prime is a protocol incentive program that rewards committed XVS stakers with boosted APY on selected markets. Eligible users receive a non-transferable Prime token that automatically applies the boost. See the [Venus Prime announcement](../../whats-new/prime-yield.md) for eligibility criteria and market coverage.
