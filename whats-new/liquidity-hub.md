# Liquidity Hub

### Overview

The **Venus Liquidity Hub** is a per-asset *allocator vault*. A lender deposits a single asset (USDT, for example) and receives a yield-bearing share token. Under a governance-set policy, the Hub automatically spreads that capital across Venus's yield families — **Core**, **Flux**, and **FRV** — and returns a blended yield, removing the need for lenders to pick a product, allocate across it, and assess each one's risk on their own.

There is **one Hub per asset**, with no cross-asset coupling: a USDT Hub only ever holds and routes USDT. Each Hub is a standard [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) vault, so any wallet, aggregator, or partner that already speaks ERC-4626 can integrate it once and automatically benefit as Venus adds new yield products behind it.

Yield accrues through a **rising exchange rate** — one share becomes redeemable for more underlying over time — never by rebasing. The number of shares in a wallet does not change; their redemption value does.

### Why a Liquidity Hub

Today a Venus lender has to choose between independent products — Core lending, Flux markets, and Fixed-Rate Vaults — allocate manually, and monitor each separately. Large and institutional lenders especially want a single, transparent entry point rather than onboarding to each vault individually. The Liquidity Hub shifts the lender experience from *"pick a vault per product"* to *"one-click deposit per asset,"* while giving governance a curated, transparent allocation layer on top of products it already runs.

The Hub is purely a routing layer. It does **not** modify the parameters or governance of the underlying Core / Flux / FRV products — it only moves capital into and out of them.

### The three yield families (Sources)

A **Source** groups downstream products of the same kind behind one uniform interface. v1 ships three:

| Source   | Underlying protocol      | What the Hub holds                         |
| -------- | ------------------------ | ------------------------------------------ |
| **Core** | Venus Core lending       | vTokens (Compound-style receipt tokens)    |
| **Flux** | Fluid Lending            | fTokens (ERC-4626 shares)                  |
| **FRV**  | Venus Fixed-Rate Vaults  | Fixed-Rate Vault shares (ERC-4626)         |

The Source set is **governance-extensible**: new yield families can be added later without changing the Hub or the share token, because every Source is reached through the same interface.

### How deposits and withdrawals are routed

The Hub holds two independent, governance-configured ordered queues — a **deposit queue** and a **withdraw queue**. Neither is derived from the other.

* **Deposit** — capital cascades down the deposit queue. Each Source absorbs up to its available capacity (bounded by its cap), and any remainder overflows to the next Source. If the total deposit is larger than the combined free capacity of every Source, the **entire transaction reverts** — there is no partial fill.
* **Withdraw** — the Hub serves the request from its own idle balance first, then walks the withdraw queue, pulling liquidity in order until the request is filled. If the request exceeds total available liquidity, or exceeds the per-transaction withdrawal cap, the **entire transaction reverts**.

At launch the queues are configured **Core-first in, Core-first out**, so Core absorbs everyday inflows and outflows and acts as a liquidity buffer, leaving strategy capital in Flux / FRV undisturbed until governance rebalances.

### Operator rebalancing

Beyond user-driven flow, a privileged **Operator** can proactively rebalance capital between *already-registered* Sources and products — for example, pulling funds back to Core when general-market utilization tightens, or seeding a newly onboarded product. Rebalancing is **net-zero** (the amount pulled equals the amount pushed; nothing enters or leaves the Hub) and is bounded by the same caps governance sets. The Operator can never create a new route or move funds outside the registered set.

### Safety envelope

* **Atomic-or-revert** — deposits, withdrawals, and rebalances either complete in full or revert. No partial fills, no stranded remainder.
* **Dual caps per Source** — each Source carries both an absolute cap and a percentage-of-Hub cap; the stricter one binds. A large Source can never quietly exceed its share of the Hub.
* **Per-transaction withdrawal cap** — bounds any single withdrawal so one transaction cannot drain a downstream product's liquidity.
* **Multi-level pause** — the Hub, an individual Source, or a single product can each be paused independently. A broader pause blocks everything beneath it; unaffected siblings keep operating, and the underlying products themselves keep running normally even while the Hub is paused.
* **Asymmetric permissions** — *loosening* any constraint (raising a cap, unpausing, registering a new route) requires a governance VIP; *tightening* (lowering a cap, pausing) can be done by the Operator alone. The Operator can never unilaterally take on more risk than governance approved.

### Fees

The Hub supports two governance-controlled fees, both minted as dilution shares to a fee recipient:

* **Management fee** — a time-based fee on assets under management.
* **Performance fee** — charged only on gains above a monotonic high-water mark, so a fee can never be claimed twice on the same gain.

At launch both fees are set to **0%**. The machinery exists for governance to enable them later; each is capped at 50%.

### Blended APY

Each Hub publishes an EMA-smoothed realized APY, computed as the TVL-weighted average of its Sources' spot APYs. Together with the per-Source allocation breakdown, this lets a lender see — from the interface alone — where their capital is deployed and what blended yield it is earning.

### Status

The Liquidity Hub launches on **BNB Chain**, with **USDT** as the first supported asset and additional assets to follow. At launch, fees are `0/0` and the Operator role is held by the Venus Core multisig. Contract addresses will be published once the contracts are deployed.

For the contract-level architecture, flows, and full API, see the [Liquidity Hub technical reference](../technical-reference/reference-liquidity-hub/README.md).
