# Isolated Pools

### Overview

Isolated Pools are made up of separate collections of assets with tailored risk management configurations. This design offers users broader opportunities to manage risk and allocate assets to earn yield. Moreover, it prevents hypothetical failures from affecting the liquidity of the entire protocol as they are confined to isolated markets.

Isolated Pools also offer custom rewards for each market in the pool, incentivizing users accordingly.

### Isolated Pools Architecture

The Isolated Pools system is based on the _PoolRegistry_ contract. It maintains a directory of isolated lending pools, allows the creation and registration of new pools, and offers getter methods to fetch pool details.

To add a new market to an existing lending pool, the PoolRegistry deploys a JumpRateModelV2 or a WhitePaperInterestRateModel contract, deploying the upgradable VToken for the market before gaining the approval of the market's Comptroller.

<figure><img src="../.gitbook/assets/image (1).png" alt="" width="563"><figcaption></figcaption></figure>

### User Actions

Users can perform the following actions on any market in a pool:

1. **Deposit**: Users can deposit an asset, receiving vTokens that correspond to the liquidity deposited. These vTokens accrue interest until they are burned on redeem or liquidated.
2. **Borrow**: Users can borrow assets, in exchange for locked collateral.
3. **Redeem**: Users can redeem vTokens for the underlying asset based on the exchange rate.
4. **Repay Borrow**: Users can repay the borrowed asset and accrued interest.
