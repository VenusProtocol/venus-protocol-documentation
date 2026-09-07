---
description: The Venus Protocol API providing access to indexed protocol data.
---

API
===

The Venus Protocol API exposes indexed lending-market, pool, and governance data. The OpenAPI specification embedded below currently documents two endpoint families:

* **Market and pool data** — listed markets, pool configuration, historical market snapshots, and aggregate TVL
* **Governance data** — proposals, votes, and voter activity

{% hint style="warning" %}
API responses are derived from indexed data and can lag the chain, omit a recent event, or temporarily fail. Do not treat them as authoritative for transaction simulation, balances, permissions, market pause state, prices, or liquidation safety. Read the relevant contracts through an RPC endpoint at a recorded block when correctness depends on live state.
{% endhint %}

The live [Swagger playground](https://api.venus.io/docs/playground) and [OpenAPI JSON](https://api.venus.io/docs/swagger.json) are the source of truth for the currently published request parameters and response schemas. The checked-in specification rendered on this page is a snapshot and should be resynchronized when the live JSON changes.

Base URL
---

The documented read endpoints are available without authentication at these origins. Endpoint paths are appended directly to the origin; there is no `/api` prefix.

```text
mainnet: https://api.venus.io
testnet: https://testnetapi.venus.io
```

For example, a BNB Chain mainnet request to the default `stable` pools route is:

```bash
curl --get 'https://api.venus.io/pools' \
  --data-urlencode 'chainId=56'
```

Versioning
---

Routes that declare the `accept-version` request header support `stable` and `next`. Omitting the header selects `stable`; an unsupported value is rejected. Do not assume every API route is versioned—check the OpenAPI entry for the specific path.

`stable` and `next` can have different required query parameters and response shapes. In the published specification, this is material for `/markets` and `/pools`; read the schema for the selected version instead of deserializing both as the same object.

The current `stable` responses for those routes include an HTTP `Warning: 299` header instructing clients to migrate to `accept-version: next`. Test the `next` schema before switching and monitor response warnings during every rollout:

```bash
curl --get 'https://api.venus.io/markets' \
  --header 'accept-version: next' \
  --data-urlencode 'chainId=56' \
  --data-urlencode 'limit=1'
```

When `next` is promoted, the server can make both header values resolve to the newly stable implementation and warn clients to remove `accept-version: next`. Removing that opt-in after promotion avoids silently receiving a later preview. Pin client expectations with contract tests; the header name is not a permanent schema version identifier.

This page was checked against the live v1.73.0 specification. Live service behavior and the live OpenAPI document take precedence over the checked-in snapshot rendered below.

### Pool Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/pools" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}





### Market Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/markets" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/markets/history" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/markets/tvl" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}



### Governance Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/{proposalId}/voteSummary" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/voters/{address}/summary" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/voters/{address}/history" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/voters" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/votes" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/{proposalId}" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}
