# Supplier Guide

This guide explains how to supply an asset to a Fixed Term Vault and later redeem the resulting vault shares. Supplying funds a single institutional loan; it is not a deposit into Venus Core Pool or shared liquidity.

{% hint style="danger" %}
**Capital and availability are at risk.** The displayed Target APR is not guaranteed, and a supplier can receive less than the amount supplied. There is no contract withdrawal after you deposit during Fundraising or while the loan is active. Redemption depends on the vault reaching a terminal state, its current pause level, and the assets available for settlement.
{% endhint %}

The official interface and deployed state can change after this page is published. Treat screenshots, examples, and static address lists as illustrative only. Verify the selected vault in the live app, controller registry, and chain explorer.

## What the vault shares represent

Each Fixed Term Vault is a separate ERC-4626-based clone with vault-specific overrides. When you supply the configured asset, the vault mints ERC-20 shares representing your pro-rata claim on that clone's settlement assets.

The shares can be transferred, but transferability is not an early redemption mechanism. Venus does not guarantee a buyer, secondary market, price, or liquidity for the shares. A transfer moves the on-chain claim to the recipient and can introduce separate operational, legal, and counterparty risks.

## Before supplying

1. Open the official [Venus Vaults page](https://app.venus.io/#/vaults?chainId=56), select BNB Chain, and identify a card that the current interface labels **Fixed-Term**.
2. Verify the InstitutionalVaultController and candidate vault through [Deployed Contracts](../../deployed-contracts/fixed-rate-vaults.md), the controller's current `allVaults` registry or `VaultCreated` events, and a BNB Chain explorer. A static list may omit vaults created later, while the app's indexed inventory can lag the on-chain registry.
3. Confirm that the exact vault is in **Fundraising**, its pause level is **Unpaused**, the supply deadline has not passed, and `maxDeposit(yourAddress)` is greater than zero.
4. Verify the supply token, collateral token, both token addresses and decimals, vault address, institution, fundraising minimum and maximum, current total raised, lock end, settlement deadline, and risk disclosures.
5. Review the live **Target APR**. The official interface already displays this value net of the vault's reserve factor. Do not deduct the reserve factor a second time.
6. Read the current [Fixed Term Vault Terms of Use](https://app.venus.io/#/fixed-term-vault-terms-of-use) shown by the app and determine whether you are eligible. Do not rely on a jurisdiction list copied into a guide, because the applicable terms can change.

Some commercial configuration, including the supply and collateral assets, scheduled rate, reserve factor, caps, and lifecycle durations, is set when a clone is created. An existing EIP-1167 clone keeps its original implementation; changing the controller's vault template affects future clones, not existing ones. Other state and dependencies remain live: the controller can update per-vault liquidation parameters and institution metadata, controller and shared-component implementations or addresses can change, and authorized callers can pause or administer a vault.

Fee-on-transfer and rebasing tokens are not supported as the supply or collateral asset. Do not infer support from a familiar token symbol; verify the exact address and implementation.

## Supply during Fundraising

1. Connect the intended wallet and open the vault's **Position** tab.
2. Enter an amount. The form limits the input using the wallet balance and remaining vault capacity; a configured minimum supplier amount can also apply. The minimum is waived for a final deposit that fills the residual capacity.
3. Approve the **vault clone** to spend the exact supply token. The controller, LiquidationAdapter, institution, and frontend address are not valid substitutes for this spender.
4. Review the approval separately. Confirm the chain, token, spender, and allowance before signing.
5. Accept the current Fixed Term Vault Terms in the form and submit **Supply**. The cited interface implementation calls `depositWithConsent(assets, yourAddress, consentHash)` for compatible vaults. This emits a `ConsentRecorded` event containing the hash of the displayed consent text before completing the deposit; if the deposit reverts, the event also rolls back. Historical clones can retain an older implementation without this selector, so verify the exact clone's implementation and ABI.
6. Verify the confirmed receipt, actual supply assets transferred, shares minted, vault state, and remaining allowance. Reduce or revoke an allowance you no longer need.

The contract clamps an oversized deposit to the capacity remaining at execution. Another transaction can change capacity before yours is mined, so the assets accepted and shares minted can be lower than the amount first requested. Do not treat wallet confirmation as proof of the final amount; inspect the receipt and balances.

{% hint style="warning" %}
Once a deposit succeeds, `withdraw` and `redeem` are unavailable even if the fundraising window is still open. They become available only in the terminal **Matured**, **Failed**, or **Liquidated** states. Do not supply funds that you may need before the latest plausible settlement or recovery date.
{% endhint %}

## Monitor the lifecycle

Vault states advance in one direction, but time passing alone does not write a new state on-chain. A relevant transaction, including the permissionless `updateVaultState()`, must persist a transition. The app can derive a display status from timestamps, so verify the stored state and the result of your transaction rather than relying only on a badge.

* **Fundraising** — new deposits can be accepted while the deadline, cap, minimum, token approval, and pause checks pass. Existing suppliers cannot withdraw.
* **Lock** — if both the funding and collateral requirements are met, the loan begins. Scheduled interest for the full term is calculated from the actual raise. Suppliers still cannot withdraw.
* **PendingSettlement / SettlementDeadlineExceeded** — debt repayment or liquidation is still pending. Passing the deadline does not itself give suppliers an exit or guarantee liquidation proceeds.
* **Matured / Failed / Liquidated** — supplier `withdraw` and `redeem` paths are enabled, subject to balances and the pause level. A Partial pause does not block terminal supplier exits; a Complete pause does.
* **Closed** — deposits, withdrawals, and redemptions are disabled by the vault state. The published design expects authorized callers to close only after suppliers have exited, but the source does not enforce a zero share supply before closure. Verify your redemption before assuming closure is safe.

You do not service the institution's debt, but you should monitor repayments, collateral and oracle conditions, the settlement deadline, liquidations, pause changes, administrative events, and the amount currently previewed for your shares.

## Redeem or withdraw in a terminal state

When the current interface shows **Claim**, **Refund**, or a liquidated withdrawal state:

1. Confirm the stored state is **Matured**, **Failed**, or **Liquidated**, or simulate that the exit call will advance a stale state to one of them in the same transaction. Confirm the vault is not completely paused.
2. If the stored state is already terminal, read `maxRedeem(yourAddress)`, `maxWithdraw(yourAddress)`, `previewRedeem(shares)`, and `previewWithdraw(assets)` immediately before submission. If the state is stale, simulate the exact exit transaction and read the views again after the state advances. Quotes can change as settlement and other redemptions are processed.
3. In the app, use **Claim** or **Withdraw**. Confirm the vault address, share amount, receiver, and previewed assets in your wallet or transaction simulation.
4. Verify the receipt, shares burned, supply asset received, and any collateral compensation received.

The outcome depends on the terminal path:

| Terminal state | Contract settlement path |
| --- | --- |
| **Matured** | Suppliers redeem a pro-rata share of the supply asset available after settlement and the protocol reserve. With full repayment and no asset shortfall, this targets principal plus the displayed net interest; use the live preview for the actual amount. |
| **Failed — funding below minimum** | No loan is made. Suppliers redeem their pro-rata share of the supply asset held for refunds, with no scheduled interest. |
| **Failed — collateral below requirement** | Suppliers redeem supply assets and receive a pro-rata distribution of the remaining confiscated margin in the collateral token. Each distribution rounds down to token units. |
| **Liquidated** | Suppliers redeem a pro-rata share of the supply asset in `settlementAmount`. In the current published bad-debt path, the principal portion of debt must be covered before the transition, but suppliers still receive only the terminal settlement assets and do not have a guaranteed direct claim on all remaining collateral. Do not convert that source-level condition into an unconditional principal guarantee. |

All outcomes remain contingent on the vault's actual token balances, settlement accounting, pause level, and successful transaction execution. “Principal” in the first two failure descriptions is the intended accounting outcome when the expected assets remain available, not a guarantee by Venus or another party.

## Estimate target interest correctly

Suppose the app displays an **8% Target APR**, the lock duration is 90 days, and you supply 10,000 units of the supply asset. The displayed Target APR is already net of the reserve factor:

$$
\text{target net interest} \approx 10{,}000 \times 0.08 \times \frac{90}{365} \approx 197.26
$$

The corresponding target payout is approximately `10,197.26` supply-asset units. Do **not** subtract the reserve factor again. This estimate assumes full scheduled settlement, unchanged share ownership, and enough vault assets. The contract rounds gross scheduled interest and the protocol fee down in supply-token base units; `previewRedeem` rounds assets down, while `previewWithdraw` rounds shares up. Read `asset()`, token and share decimals, `maxRedeem()`, and the previews from the exact vault; do not assume every stablecoin uses six decimals. The live terminal preview, not this estimate, determines the current on-chain quote.

## Risks and administrative authority

* **Counterparty and settlement risk** — the institution can fail to claim, repay late, or fail to repay enough for the target outcome.
* **Collateral and oracle risk** — price movements, oracle behavior, risk-parameter changes, liquidation timing, incentives, and collateral liquidity can reduce recovery.
* **Lock and market-liquidity risk** — the vault offers no supplier exit before a terminal state, and transferable shares may have no buyer or reliable price.
* **Smart-contract and shared-component risk** — a clone also depends on the controller, oracle, PositionToken, LiquidationAdapter, ProtocolShareReserve, token contracts, permissions, frontend, and network.
* **Pause risk** — Partial pause blocks new deposits; Complete pause also blocks supplier withdrawals, redemptions, repayment, and liquidation until unpaused. The current source does not add the vault pause modifiers to ordinary ERC-20 share transfers.
* **Administrative recovery risk** — the controller exposes an ACM-gated `sweep(vault, token)` path that transfers the vault's full balance of the selected ERC-20 to the configured treasury. The published source does not impose a waiting period or exclude supply and collateral tokens. Verify live permissions and events; do not rely on an assumed grace period.
* **Approval and token risk** — wrong-token approvals, unlimited allowances, nonstandard token behavior, and malicious lookalike vaults or interfaces can cause loss.
* **Terms and eligibility risk** — the current app terms, not a static summary here, govern access to the interface and can change.

For the full state machine, settlement waterfall, rounding, pause system, and liquidation paths, see the [Fixed Term Vaults Technical Reference](../../technical-reference/reference-technical-articles/fixed-rate-vaults.md). Source boundaries for the current consent-enabled flow are [`fixed-rate-vaults@91611be`](https://github.com/VenusProtocol/fixed-rate-vaults/tree/91611be77036e05d16f1ce43890b160cb4bc7228), the official interface's [consent-enabled deposit mutation](https://github.com/VenusProtocol/venus-protocol-interface/blob/c51133cb99c6881b96f9636b9cbec3bcf9c5e572/apps/evm/src/clients/api/mutations/useStakeIntoInstitutionalVault/index.ts), and its [Fixed Term Vault UI](https://github.com/VenusProtocol/venus-protocol-interface/tree/c51133cb99c6881b96f9636b9cbec3bcf9c5e572/apps/evm/src/containers/VaultCard/InstitutionalVaultModal). Source snapshots describe code behavior; immutable historical clones can use an earlier implementation. Verify the live clone, shared contracts, configuration, balances, state, and permissions at a recorded block.
