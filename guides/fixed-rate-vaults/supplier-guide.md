# Supplier Guide

This guide walks through how to participate in a Fixed Term Vault as a supplier. You supply the loan asset during the fundraising window, hold through the lock period, and redeem principal plus the target yield at maturity.

{% hint style="warning" %}
**Capital is at risk.** The target APR is set at vault deployment and is not a guaranteed return. Actual proceeds at settlement depend on counterparty performance and may be less than the amount supplied. This product is not available to retail investors or persons in restricted jurisdictions (US, UK, Canada, mainland China, or OFAC-sanctioned countries).
{% endhint %}

## Before You Supply

Each vault has a published set of terms set at deployment. Before committing funds, review:

* **Target APR** — the annualized target rate this vault aims to deliver. Actual return is variable and depends on counterparty performance; capital is at risk.
* **Lock duration** — how long your funds are locked after fundraising closes.
* **Minimum and maximum raise** — the minimum needed to actually fund the loan, and the ceiling above which the vault stops accepting supplies.
* **Minimum supply** — the floor for a single supply.
* **Supply asset** — the asset you supply.
* **Fundraising window** — when supplying closes.


## Step 1: Supply During Fundraising

While fundraising is open, supply your assets into the vault. You receive vault share tokens representing your claim. The shares are freely transferable, so you can hold them in any wallet.

**Minimum supply floor** applies unless you're filling the final residual capacity, in which case the floor is waived so the cap can actually be reached.


## Step 2: Hold Through the Lock Period

When the fundraising window closes with the raise above the minimum, the vault enters the lock period. At this point:

* **Supplying and withdrawing are blocked.** There is no early exit.
* **The yield amount is fixed.** Interest is calculated upfront on the full raise for the entire lock duration.
* **Shares remain transferable.** You can move or sell them at any time, even while funds are locked.


## Step 3: Wait for Settlement

When the lock duration elapses, the loan is due and the institution has until the settlement deadline to repay in full. Suppliers cannot withdraw during this window.

Either the institution repays in full and the vault matures, or the settlement deadline passes with debt outstanding and the vault becomes eligible for overdue liquidation at the late-penalty rate. Either way, no action is required from the supplier.


## Step 4: Redeem at Maturity

Once the institution has repaid the full debt, the vault matures. Burn your shares to receive principal plus your share of the interest.

Redeem as soon as possible. If funds remain unclaimed for too long, Venus may sweep the remaining assets and close the vault.

### Worked Example

A vault raises 100,000 USDC at an 8% target APR for a 90-day lock. You supply 10,000 USDC and receive shares representing 10% of the vault.

* Total interest at maturity: $$100{,}000 \times 0.08 \times 90/365 \approx 1{,}972.60 \text{ USDC}$$
* Assume a 10% protocol fee on interest: $$1{,}972.60 \times 0.10 \approx 197.26 \text{ USDC}$$
* Net interest paid to suppliers: $$1{,}972.60 - 197.26 \approx 1{,}775.34 \text{ USDC}$$
* Settlement pool: $$100{,}000 + 1{,}775.34 = 101{,}775.34 \text{ USDC}$$
* Your share (10%): **~10,177.53 USDC**. That's a return of ~1.78% over the 90-day term on your 10,000 USDC principal.

## Key Risks You Must Understand

A Fixed Term Vault is a fixed-term commitment. Be aware of the following before participating:

* **No early exit during the lock period.** Funds are locked until maturity.
* **Fundraising shortfall.** If the raise falls short of the minimum, the vault fails and you get your principal back with no interest.
* **Collateral underdelivery.** If the institution doesn't top up collateral in time, you get your principal back plus a pro-rata share of the confiscated margin in the collateral asset.
* **Overdue liquidation.** If the institution misses the settlement deadline, the vault is liquidated at the late-penalty rate, which can reduce the amount available for suppliers.
* **Liquidation may reduce recovery.** If collateral didn't fully cover the debt, your payout may be less than the headline yield.

## Best Practices

* **Read the vault terms carefully.** Target APR, lock duration, and the minimum-raise threshold determine your worst-case outcome.
* **Track the settlement deadline.** Once it approaches, watch for repayment activity. If the institution misses it, you'll need to wait for either a catch-up repayment or a liquidation to settle the vault.

## Recovering Your Funds

When the vault reaches a terminal state, redemption is available. Burn your shares to claim your portion of the remaining balance.

| Outcome | What you receive |
| --- | --- |
| **Loan matured** | Principal + your share of the interest |
| **Vault failed — raise short** | Full principal, no interest |
| **Vault failed — collateral underdelivered** | Full principal + pro-rata share of the confiscated margin |
| **Vault liquidated** | Pro-rata share of the remaining supply asset; may be less than full principal if collateral didn't cover the debt |

---

For the on-chain details, including the full state machine, function signatures, math, and liquidation paths, see the [Fixed Term Vaults Technical Reference](../../technical-reference/reference-technical-articles/fixed-rate-vaults.md).
