# Institution Guide

This guide walks through the institution's lifecycle in a Fixed Rate Vault. It covers getting allocated a vault by Venus, depositing the margin, topping up collateral during fundraising, claiming the raised funds, repaying the loan, and recovering any remaining collateral.

## Getting a Vault

To get started, reach out to the Venus team. Once the terms are agreed upon off-chain, Venus will deploy a vault for you.

After deployment, you receive two things:

* The **vault address** — the target of every later action.
* A **position NFT** minted to the operator address you nominated. The NFT is the credential for all institution-side actions. Whoever holds it controls the vault.

NFT transfers are blocked unless Venus approves a specific recipient. The vault is now ready for your first action.

## Step 1: Deposit the Margin

Deposit the margin into the vault in a single transaction. Partial deposits below the required threshold are rejected.

The margin is a fixed percentage of the ideal collateral amount set at vault deployment.
If you never deposit the margin, the vault simply sits idle. Venus can cancel and clean it up.

## Step 2: Wait for the Vault to Open

After the margin lands, Venus opens the vault and starts the fundraising window. Suppliers can now deposit the loan asset. No action is required from you in this step.

## Step 3: Top Up Collateral During Fundraising

While fundraising is open, bring the collateral balance up from the margin to the full ideal collateral amount.

The full amount must be in place **before the fundraising window closes**. If it isn't, the vault fails, and the outcome depends on the raise:

* **The raise also fell short of the minimum** — you recover all deposited collateral, including the margin.
* **The raise succeeded but collateral was underdelivered** — the margin is confiscated and distributed to suppliers. You recover only the remaining non-margin collateral.

{% hint style="warning" %}
If fundraising succeeds but you don't top up the collateral in time, the margin is confiscated. There is no recovery path once that happens.
{% endhint %}

## Step 4: Claim the Raised Funds

Once fundraising closes successfully, the vault enters the lock period and the raised funds become available.

**During the lock period**, you can add collateral at any time to defend the position's health if the collateral price drops. You can also withdraw any collateral above the minimum floor, as long as the position stays within the liquidation threshold. If either constraint is breached, the withdrawal is rejected.

If you don't claim before the lock period ends, the funds stay in the vault. Interest is still owed at maturity either way, so claiming late means paying interest on capital you never used.

## Step 5: Repay Before the Settlement Deadline

When the lock period ends, repayment is due. You have until the settlement deadline to repay in full.

Repayments can be partial, and any wallet can repay on your behalf. Once the debt clears, the vault matures and suppliers can begin redeeming.

{% hint style="warning" %}
Missing the settlement deadline makes the vault liquidatable at the late-penalty rate, even if your collateral is healthy.
{% endhint %}

## Key Risks You Must Understand

A Fixed Rate Vault is a fixed-term commitment with a few timing-sensitive obligations. Be aware of the following before participating:

1. **Margin confiscation**

   If fundraising clears the minimum but you don't top up the collateral to the ideal amount before the fundraising window closes, the margin is permanently confiscated and distributed to suppliers.

2. **Overdue liquidation**

   Missing the settlement deadline makes the vault liquidatable at the late-penalty rate, even if your collateral is healthy.

3. **Health-based liquidation**

   If the collateral price drops during the lock period and pushes the position below the liquidation threshold, the vault is liquidatable at the standard incentive rate.

4. **No early changes to terms**

   Fixed APY, lock duration, settlement window, and the borrow caps are all set at deployment and cannot be renegotiated on-chain. Confirm the terms with Venus off-chain before the vault is created.

## Best Practices

* **Monitor collateral price during the lock period.** Top up early when the price moves against you. Once the funds are claimed, that is the only way to defend the position.

* **Repay as soon as you can.** Interest is fixed for the full lock duration regardless of when you repay, but repaying early frees up your collateral and removes the late-payment risk.

* **Keep the position NFT in a wallet you control.** Whoever holds the NFT controls the vault. If you delegate it to an operator, treat that wallet with the same security as a treasury wallet.

For the on-chain details, including the full state machine, function signatures, math, and liquidation paths, see the [Fixed Rate Vaults Technical Reference](../../technical-reference/reference-technical-articles/fixed-rate-vaults.md).
