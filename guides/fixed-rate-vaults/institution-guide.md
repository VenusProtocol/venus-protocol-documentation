# Institution Guide

This guide explains the institution side of a Fixed Term Vault: accepting a vault allocation, posting margin and collateral, claiming the raised supply asset, servicing the debt, and recovering eligible collateral.

{% hint style="danger" %}
A Fixed Term Vault is a time-sensitive, collateralized obligation. Missing a funding, collateral, or repayment deadline can make funds unavailable, forfeit the configured margin, or expose collateral to liquidation. Contract state, permissions, prices, and pause status are authoritative; an interface label or off-chain agreement does not override them.
{% endhint %}

## Before You Operate a Vault

Vault allocation, eligibility, and commercial terms are coordinated off-chain. Before moving funds, obtain the current terms through the official Venus process and independently verify the resulting on-chain vault.

For the specific vault clone, record and check:

* the vault and controller addresses against the controller registry, rather than relying on a screenshot or an address copied from a message;
* the current owner and token ID of the position NFT;
* the supply and collateral token addresses, symbols, and decimals;
* the margin rate, ideal collateral amount, caps, fundraising duration, lock duration, settlement window, and scheduled rate;
* the liquidation threshold, liquidation incentive, late-penalty rate, oracle, stored state, timestamps, outstanding debt, and pause level; and
* the clone implementation and whether it supports the functions described in this guide.

Use [Deployed Contracts](../../deployed-contracts/fixed-rate-vaults.md) as a starting point, then verify the live controller registry and clone at a recorded block. Repository deployments and frontend data are useful references, but neither proves current on-chain state by itself.

The institution-side functions `depositCollateral`, `claimRaisedFunds`, and `withdrawCollateral` require `msg.sender` to be the **current owner** of the vault's position NFT. An ERC-721 approval or delegated operator is not a substitute for ownership in the published implementation. The NFT is therefore the control credential for the position.

Every NFT transfer requires an ACM-authorized controller caller to approve one exact recipient first. That approval is consumed by the matching transfer. After transfer, the new owner immediately controls the institution-side functions and receives any later cancellation refund; the prior owner loses that control.

## Step 1: Deposit the Margin

The vault begins in `WaitingForMargin`. Approve the vault clone—not the controller—to spend the configured collateral asset, then call:

```text
depositCollateral(amount)
```

The first call must make `totalCollateralDeposited` at least:

```text
floor(idealCollateralAmount × marginRate / 1e18)
```

Because a sub-threshold call reverts, post at least the full required margin in one transaction. The function accepts collateral-token base units and does not cap the amount at the threshold, so check the asset address and decimals before approving or submitting. The published implementation does not support fee-on-transfer or rebasing collateral tokens.

On success, the state changes to `MarginDeposited`. Check the receipt, `CollateralDeposited` event, recorded collateral total, and remaining allowance. Reduce or revoke an allowance that is no longer needed.

If the vault is not opened, an ACM-authorized controller caller may cancel it while it is still `WaitingForMargin` or `MarginDeposited`. Cancellation sends the recorded collateral to the current position-NFT owner and moves the vault to `Failed`.

## Step 2: Wait for the Vault to Open

An ACM-authorized caller opens a `MarginDeposited` vault through `InstitutionalVaultController.openVault(vault)`. Opening sets the absolute fundraising end, lock end, and settlement deadline from the clone's configured durations and moves the vault to `Fundraising`.

Do not calculate deadlines from an expected opening time. Read the timestamps emitted and stored by the live vault after `openVault` succeeds.

## Step 3: Complete the Collateral During Fundraising

Before the fundraising end, call `depositCollateral(amount)` as needed to bring `totalCollateralDeposited` to at least `idealCollateralAmount`. Use the vault clone as the collateral-token approval spender for every top-up.

At the fundraising deadline, the vault evaluates both sides:

| Result | Institution outcome |
| --- | --- |
| Raised amount meets `minBorrowCap` and collateral meets `idealCollateralAmount` | The vault can enter `Lock` |
| Raised amount is below `minBorrowCap` | The vault enters `Failed`; the position holder can recover all recorded collateral, including the margin |
| Raise succeeds but collateral is below `idealCollateralAmount` | The vault enters `Failed`; the configured margin is reserved for supplier compensation, and only the remaining collateral is recoverable by the position holder |

The stored state does not advance merely because time passes. Anyone may call `updateVaultState()` to apply a ready transition. However, calling `depositCollateral` after the deadline does not create a grace period. If collateral was below the ideal amount at the boundary, the call evaluates the failure condition and the late top-up cannot rescue it. If both requirements were already met at the boundary, the same selector can instead serve as a `Lock`-state top-up after state advancement.

{% hint style="warning" %}
Partial and complete pause both block collateral deposits. Monitor the pause level and leave operational time before the deadline; a transaction submitted near the boundary may execute too late.
{% endhint %}

## Step 4: Claim During the Lock Window

After a successful fundraise, state advancement enters `Lock`. At that point the vault records the scheduled full-term interest as debt. The current position-NFT owner may make one all-or-nothing claim:

```text
claimRaisedFunds()
```

The call is available only from `lockStartTime` inclusive to `lockEndTime` exclusive, while the effective state is `Lock` and the vault is unpaused. Before transferring the entire raised supply-asset amount, it simulates the post-claim debt—scheduled interest plus principal—against the current collateral and liquidation threshold. It reverts if the claim would create an LT shortfall.

Check `getHypotheticalVaultLiquidity(0, totalRaised)` and current oracle data before claiming, but treat a simulation as a point-in-time estimate. Prices, risk parameters, balances, state, and pause status can change before execution. Adding collateral or repaying existing interest can improve the check; confirm the result again immediately before the claim.

If the lock end passes before the claim succeeds, the principal stays in the vault and can no longer be claimed through this path. The institution still owes the scheduled interest that was recorded at lock entry, but it does **not** owe unclaimed principal. There is no “late claim”: state advancement moves the vault to settlement states and `claimRaisedFunds()` then reverts.

After a successful claim, outstanding debt becomes the raised principal plus the full scheduled interest. Repaying early does not discount that interest.

## Step 5: Manage Health and Repay

During `Lock`, the position-NFT owner can add collateral with `depositCollateral(amount)`. It can withdraw only collateral that remains above both:

1. the minimum collateral floor, scaled to the actual amount raised; and
2. the liquidation-threshold health requirement after the proposed withdrawal.

Use `getVaultLiquidity()` and `getHypotheticalVaultLiquidity(withdrawAmount, 0)` before attempting a withdrawal. Oracle movement between simulation and execution can still cause a revert or create liquidation exposure after the transaction.

Debt service is a separate defense. Any address—not only the NFT owner—may approve the **supply asset** to the vault clone and call:

```text
repay(amount)
```

Repayment is accepted in `Lock`, `PendingSettlement`, and `SettlementDeadlineExceeded`, and an amount above `outstandingDebt()` is clamped to the debt at execution. The published implementation does not support fee-on-transfer or rebasing supply assets.

A partial repayment reduces debt and can improve health, but it does not necessarily unlock collateral below the minimum floor and does not eliminate remaining liquidation or late-payment risk. Only full repayment clears the debt. Even after full early repayment, the vault remains in `Lock` until the lock end; it does not mature early or release the entire collateral immediately.

At the lock end, the vault enters `PendingSettlement`. If the debt is zero, it can advance to `Matured`; otherwise repayment remains available through the settlement window. Once the settlement deadline passes with debt outstanding, whitelisted settlement actors can use the overdue-liquidation path even if the vault has no LT shortfall. Health-based liquidation can also occur in active debt states when an LT shortfall exists.

Partial pause still allows repayment and liquidation. Complete pause blocks both until unpaused. Check the live pause level before relying on a defensive transaction.

## Step 6: Recover Eligible Collateral

The current position-NFT owner can call `withdrawCollateral(amount)`:

* in `Lock`, only for an amount allowed by both the floor and LT checks;
* in `Matured`, up to the remaining recorded collateral; or
* in `Failed`, up to the recoverable balance after any confiscated margin is reserved.

It cannot use `withdrawCollateral` in `PendingSettlement`, `SettlementDeadlineExceeded`, `Liquidated`, or `Closed`. Do not transfer or discard the position NFT before all intended institution-side recovery is complete. Verify the terminal state, recorded collateral, token balance, recipient, and pause level, and avoid assuming that a successful supplier settlement automatically sends collateral back to the institution.

An ACM-authorized controller caller can move a `Matured`, `Failed`, or `Liquidated` vault to `Closed`. The published `closeVault` path does not verify that the institution has recovered its collateral, and `withdrawCollateral` is unavailable after closing. Recover eligible collateral promptly and monitor controller actions.

## Parameters That Can Change

The supply asset, collateral asset, scheduled rate, reserve factor, caps, minimum supplier deposit, lifecycle durations, ideal collateral amount, and margin rate are fixed in an existing clone. A renewed deal requires another clone.

The liquidation threshold, liquidation incentive, late-penalty rate, and institution display name can be changed for an existing vault through ACM-gated controller calls. Shared controller, oracle, LiquidationAdapter, treasury, ProtocolShareReserve, pause, whitelist, and ACM configuration can also change. Monitor the live values throughout the position rather than relying only on the creation terms.

The controller also exposes an ACM-gated `sweep(vault, token)` path that transfers the vault's full balance of the specified ERC-20 to the configured treasury. The published source does not exclude the supply or collateral asset. Treat the live controller implementation, treasury, and effective ACM grants as material administrative authorities.

## Operational Checklist

* Keep the position NFT in a wallet whose transaction process can meet short deadlines; custody transfer changes contract control.
* Verify the exact vault, asset, amount, decimals, spender, state, deadline, pause level, and oracle health before every transaction.
* Leave time for approvals, multisig execution, state finalization, and retries before fundraising and settlement boundaries.
* Monitor both health and debt. Collateral top-ups and repayments affect different sides of the risk calculation.
* Confirm receipts and events, then reduce unnecessary token allowances.
* Escalate a pause, stale oracle, failed health simulation, or unexpected state through official Venus channels before moving more funds.

For the complete state machine, settlement waterfall, rounding, pause rules, liquidation paths, and administrative authorities, see the [Fixed Term Vaults Technical Reference](../../technical-reference/reference-technical-articles/fixed-rate-vaults.md). The current source boundary used for this guide is [`InstitutionalLoanVault.sol@91611be`](https://github.com/VenusProtocol/fixed-rate-vaults/blob/91611be77036e05d16f1ce43890b160cb4bc7228/src/institutional-vault/InstitutionalLoanVault.sol) together with [`BaseVault.sol@91611be`](https://github.com/VenusProtocol/fixed-rate-vaults/blob/91611be77036e05d16f1ce43890b160cb4bc7228/src/BaseVault.sol). Immutable historical clones may use an earlier implementation. Verify the live clone, shared contracts, configuration, state, balances, and permissions at a recorded block before acting.
