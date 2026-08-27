# Fixed Term Vaults

Fixed Term Vaults facilitate fixed-term loans between an institution and on-chain suppliers. The institution borrows a configured supply asset against collateral at a scheduled rate and duration. Suppliers receive transferable vault shares representing a claim on the assets available when that vault reaches a terminal state.

{% hint style="warning" %}
**Principal and target return are not guaranteed.** A target APR is a scheduled display value, not a promise of payment. Counterparty performance, collateral value, liquidation, pause state, token behavior, shared system dependencies, administrative actions, and the assets actually available at settlement can affect when and how much a supplier can redeem.
{% endhint %}

Each loan uses a separate vault clone with its own assets, debt accounting, configuration, and supplier shares. It does not share liquidity with Venus Core Pool or another vault clone, but its on-chain behavior relies on shared controller, oracle, liquidation, ProtocolShareReserve, and access-control components. Users also depend operationally on the interface and its indexed data.

The product has two sides:

* **Institution** (borrower) — deposits collateral and may claim raised funds, repay debt, and recover collateral subject to the vault state and health checks.
* **Supplier** — supplies the loan asset during fundraising and later redeems a pro-rata share of the assets available in a terminal state.

Current published production deployments are on BNB Chain. Deployment addresses, vault registry entries, implementations, state, terms, risk parameters, pause level, and permissions are live data. A vault card or documentation page does not prove that a vault is currently open for supply: an instance can be pre-fundraising, locked, settling, terminal, or closed. Verify the selected vault before signing.

## Pick Your Guide

| Role | Guide |
| --- | --- |
| **Institution** — you want to borrow against collateral at a fixed rate and need to get a vault from Venus and walk through the full lifecycle | [Institution Guide](institution-guide.md) |
| **Supplier** — you want to supply during fundraising and understand the lock, settlement, and recovery paths | [Supplier Guide](supplier-guide.md) |

For contract behavior, see the [Fixed Term Vaults Technical Reference](../../technical-reference/reference-technical-articles/fixed-rate-vaults.md). For address discovery, start with [Deployed Contracts](../../deployed-contracts/fixed-rate-vaults.md) and then confirm the controller registry and chain explorer at a recorded block.
