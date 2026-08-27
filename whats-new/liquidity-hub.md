# Liquidity Hub

### Overview

The **Venus Liquidity Hub** is a per-asset *allocator vault*. A lender deposits a single asset (USDT, for example) and receives a yield-bearing share token. Under a governance-set policy, the Hub automatically spreads that capital across the yield families it is wired to — **Core** (Venus Core lending), **Flux** (Fluid Lending, a third-party protocol), **FRV** (Venus Fixed-Rate Vaults) and new yield sources as they come online — blending the underlying returns into a single yield, removing the need for lenders to pick a product, allocate across it, and assess each one's risk on their own. Capital routed to Flux is exposed to Fluid's contracts, not only to Venus's.

There is **one Hub per asset**, with no cross-asset coupling: a USDT Hub only ever holds and routes USDT. Each Hub is a standard [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) vault, so any wallet, aggregator, or partner that already speaks ERC-4626 can integrate it once and automatically benefit as Venus adds new yield products behind it.

Yield accrues through a **rising exchange rate** — one share becomes redeemable for more underlying over time — never by rebasing. The number of shares in a wallet does not change; their redemption value does.

### Why a Liquidity Hub

Today a lender has to choose between independent products — Venus Core lending, Fluid-backed Flux markets, and Venus Fixed-Rate Vaults — allocate manually, and monitor each separately. Large and institutional lenders especially want a single, transparent entry point rather than onboarding to each vault individually. The Liquidity Hub shifts the lender experience from *"pick a vault per product"* to *"one-click deposit per asset,"* while giving governance a curated, transparent allocation layer on top of products it already runs.

The Hub is purely a routing layer. It does **not** modify the parameters or governance of the underlying Core / Flux / FRV products — it only moves capital into and out of them.

### The yield families (Sources)

A **Source** groups downstream products of the same kind behind one uniform interface. v1 ships three, with a fourth built:

| Source    | Underlying protocol         | What the Hub holds                      |
| --------- | --------------------------- | --------------------------------------- |
| **Core**  | Venus Core lending          | vTokens (Compound-style receipt tokens) |
| **Flux**  | Fluid Lending (third-party) | fTokens (ERC-4626 shares)               |
| **FRV**   | Venus Fixed-Rate Vaults     | Fixed-Rate Vault shares (ERC-4626)      |
| **Spoke** | Venus [hub-funded spoke pools](hub-funded-spoke-pools.md) | vTokens of the pool's liquidity side |

The **Spoke** Source is what makes the Hub the funder of a hub-funded spoke pool: it supplies the borrowable side of an isolated pool that only the Hub is allowed to supply. It is written and tested but **not deployed** — no spoke pool exists yet for it to route into.

At launch only **Core** and **Flux** hold a live product. The FRV Source is registered on every Hub with its caps set, but no Fixed-Rate Vault instance exists for these assets on BNB Chain yet, so it is wired to nothing and receives no capital until a follow-up proposal adds one.

The Source set is **governance-extensible**: new yield families can be added later without changing the Hub or the share token, because every Source is reached through the same interface.

### How deposits and withdrawals are routed

The Hub holds two independent, governance-configured ordered queues — a **deposit queue** and a **withdraw queue**. Neither is derived from the other.

* **Deposit** — capital cascades down the deposit queue. Each Source absorbs up to its available capacity (bounded by its cap), and any remainder overflows to the next Source. If the total deposit is larger than the combined free capacity of every Source, the **entire transaction reverts** — there is no partial fill.
* **Withdraw** — the Hub serves the request from its own idle balance first, then walks the withdraw queue, pulling liquidity in order until the request is filled. If the request exceeds total available liquidity, or exceeds the per-transaction withdrawal cap, the **entire transaction reverts**.

At launch the queues are configured **Core-first in, Flux-first out** — deposit `[Core, Flux]`, withdraw `[Flux, Core, FRV]`. Core absorbs everyday inflows, so new capital lands in the deepest and most liquid market first; withdrawals are served from Flux ahead of Core, which keeps Core's balance intact as a buffer. FRV is out of the deposit queue entirely (nothing to route into) and sits last on the withdraw side, where an empty Source costs nothing to walk past. The two orders are set independently and governance can reorder either.

### Operator rebalancing

Beyond user-driven flow, a privileged **Operator** can proactively rebalance capital between *already-registered* Sources and products — for example, pulling funds back to Core when general-market utilization tightens, or seeding a newly onboarded product. Rebalancing is **net-zero** (the amount pulled equals the amount pushed; nothing enters or leaves the Hub) and is bounded by the same caps governance sets. The Operator can never create a new route or move funds outside the registered set.

### Safety envelope

* **Atomic-or-revert** — deposits, withdrawals, and rebalances either complete in full or revert. No partial fills, no stranded remainder.
* **Dual caps per Source** — each Source carries both an absolute cap and a percentage-of-Hub cap; the stricter one binds. A large Source can never quietly exceed its share of the Hub.
* **Per-transaction withdrawal cap** — bounds any single withdrawal so one transaction cannot drain a downstream product's liquidity.
* **Multi-level pause** — the Hub, an individual Source, or a single product can each be paused independently. A broader pause blocks everything beneath it; unaffected siblings keep operating, and the underlying products themselves keep running normally even while the Hub is paused.
* **Asymmetric permissions** — every privileged function is a separate role, and the split governs who holds it *besides* governance. *Loosening* — unpausing at any level, registering a new route, raising the per-transaction withdrawal cap, setting fees — is governance-only, behind a VIP. *Tightening* — lowering a cap, pausing — governance holds as well, but it is additionally delegated to the **Operator**, and pausing is delegated further to a **Guardian** multisig that acts with no timelock delay so it can contain an incident immediately. The Guardian is granted containment only: it can pause at every level but holds no unpause, so it can never undo a governance-ordered pause. The one deliberate exception to the pattern is raising a Source's cap, which the Operator also holds so it can open headroom immediately before a rebalance; it remains bounded by everything else governance set.

### Fees

The Hub supports three governance-controlled fees:

* **Management fee** — a time-based fee on assets under management, minted as dilution shares to a fee recipient.
* **Performance fee** — charged only on gains above a high-water mark, so a fee can never be claimed twice on the same gain. The mark ratchets upward on every accrual and is re-anchored to the entry price only when the vault is refilled after emptying completely, so a new cohort is neither shielded by nor charged for a prior cohort's high. Also minted as dilution shares.
* **Redeem fee** — an exit fee applied when a lender withdraws or redeems. Unlike the other two it is **not protocol revenue** and is never paid to the fee recipient: it stays in the vault and is socialised to the remaining lenders as a price-per-share uplift. Its purpose is anti-sandwich friction — it discourages racing out ahead of a downward repricing at a Fixed-Rate Vault settlement.

At launch all three are set to **0%**. The machinery exists for governance to enable them later; the management and performance fees are capped at 50%, and the redeem fee at 5%.

### Status

The Liquidity Hub launches on **BNB Chain** with three supported assets — **USDT**, **USDC** and **U** — and more to follow. All fees are set to `0` at launch, the Operator role is held by a Venus operations multisig (the routine keeper), and a separate Guardian multisig holds pause rights with no timelock delay. Only **Core** and **Flux** carry a live product at launch: an FRV Source is registered on every Hub, but no Fixed-Rate Vault exists for these assets yet, so no capital routes to it until a follow-up proposal wires one. Contract addresses are listed in the [technical reference](../technical-reference/reference-liquidity-hub/README.md#deployment).

For the contract-level architecture, flows, and full API, see the [Liquidity Hub technical reference](../technical-reference/reference-liquidity-hub/README.md).
