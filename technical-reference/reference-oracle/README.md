# Oracle

Venus markets obtain USD prices through a chain-specific `ResilientOracle`. Each underlying asset has a configurable main source and may also have pivot and fallback sources. Source roles, enable flags, validation bounds, proxy implementations, and market lifecycle state can change through governance.

{% hint style="warning" %}
Documentation tables are snapshots, not live configuration. Resolve the oracle used by the relevant Comptroller and read its per-asset configuration on-chain before using a price or source address in an integration.
{% endhint %}

## Architecture and risk

* [Resilient Price Oracle](../../risk/resilient-price-oracle.md) — role model, correlated-asset assumptions, and configuration snapshot
* [ResilientOracle contract](resilient-oracle.md) — current contract behavior and API
* [DeviationBoundedOracle](deviation-bounded-oracle.md) — bounded borrow-power prices for configured assets

## Source adapters

* [Source adapter overview](oracles/README.md)
* [Correlated token oracles](correlated-token-oracles/README.md)

## Deployment references

* [Deployed oracle addresses](../../deployed-contracts/oracles.md)
* [Oracle repository](https://github.com/VenusProtocol/oracle)
