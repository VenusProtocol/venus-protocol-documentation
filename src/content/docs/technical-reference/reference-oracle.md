---
title: "Oracle"
---

Venus markets obtain USD prices through a chain-specific `ResilientOracle`. Each underlying asset has a configurable main source and may also have pivot and fallback sources. Source roles, enable flags, validation bounds, proxy implementations, and market lifecycle state can change through governance.

:::caution
Documentation tables are snapshots, not live configuration. Resolve the oracle used by the relevant Comptroller and read its per-asset configuration on-chain before using a price or source address in an integration.
:::

## Architecture and risk

* [Resilient Price Oracle](/risk/resilient-price-oracle) — role model, correlated-asset assumptions, and configuration snapshot
* [ResilientOracle contract](/technical-reference/reference-oracle/resilient-oracle) — current contract behavior and API
* [DeviationBoundedOracle](/technical-reference/reference-oracle/deviation-bounded-oracle) — bounded borrow-power prices for configured assets

## Source adapters

* [Source adapter overview](/technical-reference/reference-oracle/oracles)
* [Correlated token oracles](/technical-reference/reference-oracle/correlated-token-oracles)

## Deployment references

* [Deployed oracle addresses](/deployed-contracts/oracles)
* [Oracle repository](https://github.com/VenusProtocol/oracle)
