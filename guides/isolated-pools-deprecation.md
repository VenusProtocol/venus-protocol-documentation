# Withdrawing from deprecated isolated pools

Venus isolated pools have been fully deprecated. The isolated pools page and all isolated pool market screens have been removed from the Venus app, so positions can no longer be managed through the interface. If you still hold a position — supplied assets, an outstanding borrow, or both — you can still exit it by interacting directly with the market contracts through a block explorer. This guide explains how.

Isolated pools are only affected on the chains where they were deployed: **BNB Chain**, **Ethereum**, and **Arbitrum**. Your positions on the Core pool and every other Venus product are unchanged.

## Before you begin

* You will interact with the Venus market contracts directly through a block explorer's **Read/Write Contract** tabs, connecting the same wallet that holds the position:
  * BNB Chain — [BscScan](https://bscscan.com)
  * Ethereum — [Etherscan](https://etherscan.io)
  * Arbitrum — [Arbiscan](https://arbiscan.io)
* Keep a small amount of the network's native token (BNB on BNB Chain, ETH on Ethereum and Arbitrum) in your wallet to pay for gas.
* All Venus contract addresses are published in the Venus documentation under **Deployed Contracts → Markets**, and the authoritative source is the [`isolated-pools` deployment artifacts on GitHub](https://github.com/VenusProtocol/isolated-pools/tree/main/deployments). You can also find your isolated pool markets in the token-holdings list of your wallet address on the block explorer (they appear as `Venus <asset>` tokens) or in your Venus transaction history.

Each isolated pool market is a **vToken** contract. Supplying an asset mints you vTokens (an ERC-20 balance held in your wallet); borrowing creates a debt tracked by that same vToken contract. Withdrawing and repaying are done on the vToken contract; approvals are done on the underlying asset's own token contract.

## Step 1 — Identify your positions

For each isolated pool vToken you interacted with, open its contract on the relevant block explorer and use the **Read Contract** tab to check your balances:

* `balanceOf(<your address>)` — your vToken balance. A non-zero value means you have a **supplied** position to withdraw.
* `borrowBalanceStored(<your address>)` — your outstanding **borrow** in units of the underlying asset. A non-zero value means you have a borrow to repay. (This is the last stored value; the live amount including freshly accrued interest is returned by `borrowBalanceCurrent` on the **Write Contract** tab.)
* `underlying()` — the address of the underlying asset for that market, which you will need for the repay approval in Step 2.

Note the vTokens where either balance is non-zero — those are the positions you need to close.

## Step 2 — Repay your borrows

Do this only for markets where `borrowBalanceStored` is non-zero. If you have no borrows, skip to Step 3.

1. Open the **underlying asset's** token contract on the block explorer (the address returned by `underlying()` in Step 1) and, on the **Write Contract** tab, call `approve(spender, amount)` where:
   * `spender` is the **vToken** contract address for that market.
   * `amount` is at least your outstanding borrow. To avoid a shortfall from interest accruing between transactions, approve a comfortable margin above `borrowBalanceCurrent`.
2. Open the **vToken** contract on the **Write Contract** tab and call `repayBorrow(repayAmount)`. Pass `repayAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935` (this is `type(uint256).max`); the contract automatically caps the repayment at your full outstanding balance, so this repays the borrow in full including accrued interest.

Repeat for every market where you have an outstanding borrow, on every affected chain.

## Step 3 — Withdraw your supplied assets

For each market where `balanceOf` is non-zero, open the **vToken** contract on the **Write Contract** tab and withdraw using either of:

* `redeem(redeemTokens)` — burns `redeemTokens` vTokens and returns the underlying. To withdraw your entire supplied balance, pass the value returned by `balanceOf(<your address>)` in Step 1.
* `redeemUnderlying(redeemAmount)` — withdraws a specific amount of the underlying asset (in the underlying's own decimals).

Repeat for every market where you have a supplied balance, on every affected chain.

**A note on borrows and withdrawals:** you do not necessarily have to repay *every* borrow before withdrawing collateral. A withdrawal only reverts if it would leave your account with a shortfall (undercollateralized), and if the supplied asset was never enabled as collateral the check is skipped entirely. In practice, the simplest and safest way to fully exit is to repay all borrows first (Step 2) and then withdraw everything (Step 3) — that guarantees no withdrawal is blocked.

## Reward claims

Isolated pool rewards are no longer surfaced in the app's **Rewards** section. Any pending rewards you have accrued in an isolated pool remain claimable on-chain: open that pool's **RewardsDistributor** contract on the block explorer (its address is listed in the [`isolated-pools` deployment artifacts](https://github.com/VenusProtocol/isolated-pools/tree/main/deployments)) and call `claimRewardToken(<your address>)` on the **Write Contract** tab. Claiming rewards is optional and independent of repaying and withdrawing your positions.
