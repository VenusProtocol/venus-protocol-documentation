# Reward Distributor

### Overview

The Venus Reward Distributor allows for the configuration and management of rewards for lenders and borrowers, dependent on the user's activity within the associated markets. The addition of one or more reward distributors to a pool is facilitated through the addRewardsDistributor feature, enhancing the protocol's capability to customize distribution rates on a per-market basis.

In the Venus Protocol V4, the reward system has been upgraded to allow for rewards per market and lending activity, as well as the support for multiple reward tokens. This revamp serves to provide further incentives and yield opportunities for users.

### Reward Distributor Architecture

The Rewards Distributor system is centered around the `RewardsDistributor` contract. This contract maintains the functionality to configure, track and distribute rewards to users based on their borrow and supply activities within the protocol. Upon initialization, each `RewardsDistributor` proxy is associated with a specific reward token and Comptroller, from which point the reward token can be disseminated to users that supply or borrow in the corresponding pool.

### User Interactions

Users have a range of possible interactions with the Reward Distributor:

* **Supply:** Users can supply assets and earn rewards based on the supply speeds set for the reward token.
* **Borrow:** Users can borrow assets and earn rewards according to the configured borrow speed of the reward token.
* **Claim Rewards:** Users can claim their accrued reward tokens for individual markets, a feature that significantly reduces gas fees and streamlines the reward claiming process.
