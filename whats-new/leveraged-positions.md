### **Leveraged Positions (Boost & Repay with Collateral)**

The Leveraged Positions feature allows users to significantly amplify their exposure in the protocol using a single-click workflow powered by flash loans. Instead of manually looping borrow → swap → supply multiple times, users can instantly achieve their desired leverage level in one atomic transaction, while maintaining full control and precision.

The feature consists of two complementary tools:

#### **1\. Boost**

The Boost tab enables users to open a leveraged position by fully utilizing their available (unused) borrowing power.

**How it works**

* Users must first supply assets to the protocol and enable them as collateral.  
* The interface displays the maximum “available to boost” amount, which is derived from the user’s remaining borrowing power.  
* When a Boost is executed, the protocol uses a flash loan to temporarily borrow a larger amount, swaps it into the chosen collateral asset, and supplies it — all in a single transaction.  
* This results in a leveraged position consisting of a larger supplied (collateral) amount and a corresponding borrowed amount.  
* Upon execution, the user's health factor will be greater than 1, which avoids immediate liquidation. Thereafter, the user must continue monitoring their health factor, as the protocol is not responsible for any subsequent liquidations that may occur.

**Key benefit**

With only a modest amount of unused borrowing power, users can open positions that are multiple times larger than what would be possible through ordinary borrowing — achieving high leverage efficiently and effortlessly.

#### **2\. Repay with Collateral**

Repaying debt or reducing a leveraged position is equally straightforward.

Instead of needing to hold the borrowed asset in their wallet to repay debt, users can directly repay any outstanding borrow using their supplied collateral in one click.

This is particularly convenient for deleveraging or fully closing leveraged positions, as it eliminates the need for additional swaps or external funds.

Together, Boost and Repay with Collateral provide a seamless, user-friendly way to enter and exit highly leveraged positions while keeping the process safe, fast, and capital-efficient.

