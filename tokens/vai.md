# VAI

### Overview

VAI is the stablecoin of Venus Protocol. To ensure its stability and peg to 1 USD, Venus V4 introduces several mechanisms to maintain its value at $1.

### Stability Fee and Optimised Minting

VAI’s value is maintained via a stability fee. Users pay this fee when repaying minted VAI. It gets added continuously to the user's VAI minted balance every block. The fee encourages users to mint or burn VAI according to its price, helping to maintain the stable value.

### VAI Minting Rate and Minting Cap

Venus V4 modifies how much VAI a user can mint, taking into account their weighted supply. This change protects users from potential liquidation due to minting excessive VAI.

A global cap on total VAI minting is also introduced, controlling how much total VAI can be minted across the platform, providing another layer of stability.

### Peg Stability Module (PSM)

The Peg Stability Module (PSM) allows users to swap VAI and other stablecoins (USDT or USDC) at a 1:1 conversion rate. This helps in maintaining the peg of VAI to $1.

The PSM has configurable fees and limits, providing additional control over the swapping process. Collected fees are sent to the Venus Treasury, benefiting the entire ecosystem.

### Integration of the Oracle Price

The VAI value is pegged to the USD value of the stable coin used, not assuming the value of the stable coin is always $1. Depending on the current market value of the stable coin, different rules apply to ensure the stable value of VAI.

### VAI Savings Rate (VSR) Contract

The VAI Savings Rate (VSR) contract allows users to deposit VAI and earn interest. This provides additional utility for VAI within the Venus ecosystem. Deposited VAI are transformed into SavingsVAI tokens, which can be redeemed at any time, receiving VAI in return. The amount of VAI received will be equal to or greater than the initial deposit.
