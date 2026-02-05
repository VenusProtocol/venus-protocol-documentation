# Inroduction to Isolated E-mode

**Introduction**

**Isolation Mode** in Venus Protocol is a safeguard mechanism designed to securely onboard high-volatility or newly listed assets—such as RWAs—by limiting their exposure to other assets within the protocol. Assets classified as **“Isolated Collateral Assets”** can only be used to borrow specific assets, such as BNB and stablecoins, as determined through our risk management framework and Venus Protocol Governance. This structure effectively mitigates the risks associated with such assets. Within the Venus Protocol user interface, assets restricted to supply in Isolated E-Mode are clearly marked with the label **“Isolated.”**

# E-mode vs Isolation Mode

**What are the key differences between E-mode and Isolated asset?** 

E-Mode refers to Efficiency Mode. It enables users to maximize the potential of their collateral, allowing them to pursue various yield strategies on Venus by offering a higher Loan-to-Value (LTV) ratio for correlated assets within the same E-Mode group.
<p align="center">
  <img
    width="591"
    height="322"
    alt="image"
    src="https://github.com/user-attachments/assets/940cb81f-9ae3-4315-ad7e-927470fb567e"
  />
</p>


Assets in the Isolation Mode feature more conservative parameters and supply caps than standard core pool assets. However, users can still utilize them as collateral without exposing the protocol to widespread risk.
<p align="center">
  <img
    width="587"
    height="273"
    alt="image"
    src="https://github.com/user-attachments/assets/70fdf0c8-1171-4c93-b2bc-a19510ff5184"
  />
</p>


# Supplying an Isolated Asset

**Supplying an Isolated Asset**

Before using an isolated asset as a collateral, users must ensure that their account is debt-free. Once this condition is met, they can navigate to the user interface and enable the Isolated E-mode group. When supplying an isolated asset in Isolation mode, users gain access to the core pool's stablecoin liquidity and other designated assets.

# Borrowing in Isolation Mode

**Borrowing in Isolation Mode**

When using an Isolated Asset as collateral, you are limited to borrowing only the stablecoins and other designated assets (i,e BNB) that are approved for the Isolation E-Mode group via Venus risk management process and governance. This restriction helps manage the risk associated with these assets. Additionally, while in Isolation Mode, you cannot use any other assets as collateral,though users may still earn interest on their other supplied assets on the core pool.

# Use-case for users

**Example use-case for users**

Isolated assets listed on Venus offer significant upside potential for both asset holders and the protocol itself—particularly for real-world asset (RWA) tokenizations, such as tokenized stocks. For example, listing $AAPL as an isolated asset with the ability to borrow stablecoins or BNB unlocks powerful use cases for users, including:

* **Instant Borrowing Against AAPL Shares**: Users can borrow funds against their tokenized $AAPL holdings, gaining immediate liquidity without bank visits, paperwork, or approval delays. On Venus, this process is fully permissionless and completes in seconds.  
* **Earning Annual Yield Through Smart Strategies**: Users deposit $AAPL, borrow $BNB against it, then stake the $BNB on Aster to earn asBNB—typically yielding 10–13% annually.  
* **Shorting $AAPL on Venus**: Users borrow $AAPL using stablecoins, sell it on the open market, and later repurchase $AAPL to repay the loan and close the position.

# Exiting Isolation Mode

**Exiting Isolation Mode**

If users choose to exit the Isolation Mode group, they must first repay all outstanding debt linked to the Isolated group. Once the debt is fully settled, they may disable the Isolated asset, enabling them to return to the standard mode.

