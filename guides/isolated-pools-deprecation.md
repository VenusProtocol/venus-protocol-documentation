# Withdrawing from deprecated isolated pools

Isolated pools have been fully deprecated on Venus Protocol. If you still have active positions — supplied assets or outstanding borrows — you should repay any borrows and withdraw your supplied assets as soon as possible.

This guide walks you through both steps using the Venus app ([https://app.venus.io](https://app.venus.io)).

## Before you begin

* Make sure your wallet has a small amount of the network's native token (e.g. BNB on BNB Chain) to cover gas fees.
* **You must repay all borrows before you can withdraw your collateral.** The protocol enforces this — attempting to withdraw collateral while a borrow is outstanding will fail.

## Step 1 — Repay your borrows

1. Open the Venus app at [https://app.venus.io](https://app.venus.io) and connect your wallet.
2. A deprecation notification banner will appear at the top of the page listing every chain where you still have an isolated pool position.
3. Click the chain or market name shown in the banner to navigate to the affected pool.
4. Find the asset you have borrowed and click on it to open the market modal.
5. Switch to the **Repay** tab.
6. Enter the maximum repay amount (use the **MAX** button to repay in full, including accrued interest).
7. Confirm the transaction in your wallet.

Repeat steps 4–7 for every borrowed asset and every affected chain listed in the banner.

## Step 2 — Withdraw your supplied assets

Once all borrows on a given chain are fully repaid:

1. In the same market modal, switch to the **Withdraw** tab.
2. Enter the maximum withdraw amount (use the **MAX** button to withdraw your full balance).
3. Confirm the transaction in your wallet.

Repeat for every asset you have supplied across all affected chains.

## Reward claims

Pending rewards earned in deprecated isolated pools can still be claimed. Navigate to the **Rewards** section in the Venus app to view and claim any outstanding rewards.
