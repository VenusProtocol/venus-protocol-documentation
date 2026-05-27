# Fixed Rate Vaults

**Fixed Rate Vaults** are a new lending product on Venus Protocol. Institutions borrow stablecoins for a fixed term at a fixed interest rate, backing the loan with on-chain collateral. Suppliers fund the loan during a fundraising window and earn the headline APY at maturity.

## What's New

| Component | Description |
| --- | --- |
| **BaseVault** | Abstract ERC-4626 base providing shared fundraising, interest computation, state machine, and settlement logic |
| **InstitutionalLoanVault** | Concrete vault deployed as an EIP-1167 clone per institution. Adds collateral management, fund claim, repayment, and liquidation hooks |
| **InstitutionalVaultController** | Central orchestrator. Deploys vault clones, mints position NFTs, and proxies governance operations |
| **InstitutionPositionToken** | Singleton ERC-721 representing institution ownership of a vault. One token per vault, transfer-gated by governance approval |
| **LiquidationAdapter** | Routes both health-based and overdue liquidations. Holds liquidator/settler whitelists, the global close factor, and the protocol liquidation share |

## For Institutions

* **Predictable borrowing cost.** The APY is fixed at vault creation. There are no variable-rate surprises over the loan term.
* **Retain collateral exposure.** You borrow against the asset without selling it, keeping your position intact if it appreciates during the loan term.
* **Known repayment from day one.** The total amount owed is calculable at lock entry, making debt service straightforward to plan.

## For Suppliers

* **Fixed, known yield.** The APY and lock duration are set upfront — you know exactly what you'll earn before you deposit.
* **Isolated risk.** Each vault is independent. A default in one vault has no impact on any other vault or the Venus core markets.
* **Liquid position.** Share tokens are freely transferable ERC-20s. You can transfer or sell your shares to another party.

## How It Works

Each vault is an independent ERC-4626 contract, deployed as a clone of the `InstitutionalLoanVault` implementation. Collateral, supplier deposits, debt, and settlement are scoped to the single vault.

Venus deploys the vault and mints a position NFT to the institution's nominated operator. The NFT is the credential for all institution-side actions: posting collateral, claiming the raised funds, repaying, and withdrawing collateral at the end. Suppliers interact via the standard ERC-4626 interface: deposit during fundraising, then redeem once the vault reaches a terminal state.

The lifecycle is one-shot. A vault advances monotonically through fundraising, lock, settlement, and a terminal state (matured, failed, or liquidated). There is no re-entry and no second fundraise.

## Failure Modes

Two paths can lead to a failed vault during fundraising:

* **Raise shortfall.** Fundraising never crosses the minimum threshold. Suppliers receive full principal back, with no interest. The institution recovers all collateral including the margin.
* **Collateral underdelivery.** The raise succeeded but the institution didn't top up collateral in time. The margin is confiscated and distributed to suppliers as compensation.

If the institution misses the settlement deadline after the lock period, the vault becomes liquidatable at the late-penalty rate regardless of collateral health.

## Documentation

* [Institution Guide](../guides/fixed-rate-vaults/institution-guide.md): walkthrough for borrowers.
* [Supplier Guide](../guides/fixed-rate-vaults/supplier-guide.md): walkthrough for lenders.
* [Fixed Rate Vaults Technical Reference](../technical-reference/reference-technical-articles/fixed-rate-vaults.md): contract architecture, math, and liquidation paths.
