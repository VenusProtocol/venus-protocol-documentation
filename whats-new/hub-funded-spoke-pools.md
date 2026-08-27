# Hub-Funded Spoke Pools

### Overview

A **hub-funded spoke pool** is an isolated lending market that splits the *liquidity side* — what gets borrowed — from the *collateral side* — what backs the borrow.

* The **liquidity side** is supplied only by an allowlist, by default the [Liquidity Hub](liquidity-hub.md). Because the protocol is the sole lender, it controls exactly how much liquidity a market holds and therefore where its utilization and rate sit.
* The **collateral side** is permissionless by default. Anyone can deposit a listed asset, use it as collateral, and borrow the liquidity asset against it.

Borrowing is **open-term and variable-rate**: there is no maturity, and every market plugs in its own interest rate model, so the rate curve is customizable per asset.

Every market is capped and every pool is isolated. A depeg, an oracle problem, or bad debt on an exotic collateral asset is contained inside that pool's capped exposure and cannot reach the Core pool.

> **Not live yet.** The contracts are written and tested; no spoke pool has been deployed, listed, or wired to a Liquidity Hub. This page describes the design, not something you can use on-chain today.

### Why

Venus has two products for a borrower today: the Core pool, which is shared, mainstream and deliberately conservative, and [Fixed Term Vaults](fixed-rate-vaults.md), which are fixed-rate and fixed-term. Between them there is a gap: **flexible, open-term borrowing in a special scenario, with real customization and bounded exposure**.

Listing a trending or exotic asset in the Core pool means putting the whole shared pool behind it, so listings are slow and conservative. A large counterparty that wants a market shaped around the collateral it actually holds cannot get one. Spoke pools close both gaps by making the blast radius of a listing equal to that one pool's caps.

The Liquidity Hub is what makes it work: it gives Venus a metered, protocol-controlled source of liquidity to fund the borrowable side, instead of waiting for third-party suppliers to show up.

### How a pool is shaped

| | Liquidity side | Collateral side |
| --- | --- | --- |
| Typical asset | USDT, USDC, U | tokenized stock, trending or exotic assets |
| Who may supply | allowlist only (default: the Liquidity Hub) | anyone — an allowlist exists but is off by default |
| Borrowable | yes | no |
| Usable as collateral | no | yes |
| Interest rate model | its own, per asset | not applicable |
| Caps | own supply cap and borrow cap | own supply cap |

Both sides are ordinary markets in the same pool; which side a market is on is a governance setting, not a contract type.

A pool can carry **more than one liquidity asset**. Borrow power is a single shared USD budget across all of them: borrowing USDT and borrowing U draw on the same capacity, and one health factor covers all of an account's collateral and all of its debt within the pool.

### Access and permissions

| Action | Who | Default | Optional |
| --- | --- | --- | --- |
| Supply the liquidity asset | allowlist (default: the Hub) | allowlist on | can be turned off |
| Deposit / enable collateral | anyone | permissionless | per-market allowlist (off) |
| Borrow the liquidity asset | anyone with collateral | permissionless | — |
| Repay / redeem / withdraw / transfer | position owner | **never gated** | — (governance can still pause a market) |
| Liquidate | anyone | permissionless | pool-wide allowlist (off) |

**Exit is never restricted.** No allowlist gates repaying, redeeming, withdrawing or transferring, and an account removed from an allowlist keeps the position it already holds and can still leave. Governance retains the same market-level pause it has everywhere else.

There is no on-chain KYC and no external list sync. Any allowlist is written on-chain by governance, through a VIP.

### Two go-to-market shapes

The same primitive expresses both — they are ends of a spectrum, not separate products.

| | **Retail** | **Bulk** |
| --- | --- | --- |
| Goal | list trending assets quickly and competitively | tailored borrowing for a large or institutional counterparty |
| Collateral side | trending / exotic assets, permissionless | the specific collateral the counterparty posts |
| Liquidity side | Hub-funded blue-chip or stable | Hub-funded, sized to the deal |
| Exposure | many small, tightly capped markets | sized per deal, ring-fenced |
| Rate model | standard IRM | custom IRM curve |

### Worked example

A pool with USDT on the liquidity side and five tokenized-stock markets on the collateral side.

**Liquidity side**

| Asset | Supplied | Available | Utilization | Borrow APY | Collateral factor |
| --- | --- | --- | --- | --- | --- |
| USDT | 10M | 3M | 70% | 5.6% | 0 |

**Collateral side**

| Asset | LTV | Liquidation threshold | Price |
| --- | --- | --- | --- |
| SPCXB | 70% | 75% | $200 |
| NVDAB | 75% | 80% | $210 |
| MUB | 75% | 80% | $1,000 |
| SNDKB | 70% | 75% | $1,900 |
| TSLAB | 75% | 80% | $375 |

**A position**

| Collateral | Amount | Value | Borrow power | Value at liquidation threshold |
| --- | --- | --- | --- | --- |
| SPCXB | 10 | $2,000 | $1,400 | $1,500 |
| NVDAB | 20 | $4,200 | $3,150 | $3,360 |
| MUB | 5 | $5,000 | $3,750 | $4,000 |
| SNDKB | 5 | $9,500 | $6,650 | $7,125 |
| TSLAB | 10 | $3,750 | $2,812.50 | $3,000 |
| **Total** | | **$24,450** | **$17,762.50** | **$18,985** |

With $24,450 of collateral the account can borrow up to **17,762.50 USDT** — bounded by borrow power, far below the 3M of available liquidity — and becomes liquidatable once its debt reaches the $18,985 liquidation-threshold value.

Add a second liquidity asset, U, and the picture does not change: the same $17,762.50 of borrow power is shared across USDT and U, and each borrow consumes it.

### Risk controls

* **Isolation.** Each pool has its own Comptroller. No shared collateral with the Core pool, no cross-margin, and no path by which a loss here reaches Core.
* **Per-market caps.** Supply cap, borrow cap, collateral factor and liquidation threshold are set per market, so exposure to any one asset is bounded before it is listed.
* **Per-market liquidation incentive.** The discount a liquidator earns is set per *collateral* market rather than once for the pool. Setting a higher incentive on more volatile collateral steers liquidators to seize the riskiest assets first, which de-risks an account faster.
* **Bounded collateral pricing.** Borrowing capacity is priced through the [DeviationBoundedOracle](../risk/protection-mode.md), the same mechanism [Protection Mode](../risk/protection-mode.md) uses in the Core pool: while an asset's price is deviating from its recent window, collateral is valued at the low end of that window and debt at the high end. A pumped print can only shrink an account's borrowing capacity, never inflate it. Liquidations themselves stay on live spot prices.
* **Oracle quality is part of the listing decision.** Every listed asset — exotic collateral above all — needs a reliable feed, and that review is part of per-market risk sign-off.
* **Governance owns every setting.** Listing, caps, risk parameters, allowlists and interest rate models are all set through a VIP, gated by the [AccessControlManager](../technical-reference/reference-governance/access-control-manager.md).

### Where bad debt lands

The Liquidity Hub is the lender, so a loss in a spoke pool lands on the Hub.

An isolated-pools market keeps written-off debt inside its exchange rate — when an account is healed, the shortfall moves from `totalBorrows` into `badDebt` and the numerator does not change — so the rate does not fall when a loss is booked, and the loss would otherwise surface only as redemptions failing for lack of cash. Inside the Hub that would mean the loss lands by exit order: early lenders redeem at the pre-loss share price and whoever is last out absorbs everything.

The Hub's Spoke adapter therefore values a spoke position with written-off debt **excluded**, so the loss hits every Hub lender at the same instant instead of becoming a race for the exit. If a [Shortfall](../technical-reference/reference-isolated-pools/risk-fund-and-shortfall/shortfall.md) auction later recovers the debt, the mark recovers on its own.

### Learn more

* [Hub-Funded Spoke Pools technical reference](../technical-reference/reference-isolated-pools/spoke/README.md) — the `SpokeComptroller` fork, its allowlists, liquidation routing and bounded pricing.
* [Liquidity Hub](liquidity-hub.md) — the vault that funds the liquidity side.
* [DeviationBoundedOracle](../technical-reference/reference-technical-articles/deviation-bounded-oracle.md) — how bounded pricing works.
