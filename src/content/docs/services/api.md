---
title: "API"
description: "The Venus Protocol API providing access to indexed protocol data."
---
The Venus Protocol API exposes indexed lending-market, pool, and governance data. The OpenAPI specification embedded below currently documents two endpoint families:

* **Market and pool data** — listed markets, pool configuration, historical market snapshots, and aggregate TVL
* **Governance data** — proposals, votes, and voter activity

:::caution
API responses are derived from indexed data and can lag the chain, omit a recent event, or temporarily fail. Do not treat them as authoritative for transaction simulation, balances, permissions, market pause state, prices, or liquidation safety. Read the relevant contracts through an RPC endpoint at a recorded block when correctness depends on live state.
:::

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

#### `GET /pools`

Returns pool data for all listed pools, optionally filterable by the pool's comptroller address.

**Versioning** (controlled via `accept-version` header):
- `stable` (default): `chainId` is **required**. Returns a paginated list of pools with embedded markets (filtered to `isListed: true`) and a top-level `tokens` array of `TokenMetadata`.
- `next`: `chainId` is optional; accepts a JSON array string for multi-chain queries (e.g. `["56","1"]`). Returns pools grouped by chainId alongside a separately paginated markets list with `underlyingTokenMetadata` embedded in each market. No top-level `tokens` field.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `accept-version` | header | `stable` \\| `next` | no | Selects the API version. `stable` (default) requires `chainId` and returns a paginated list with embedded markets and a top-level `tokens` array. `next` supports multi-chain queries and returns pools grouped by chainId with markets in a separate paginated block. |
| `address` | query | string | no | [both] Filter by pool comptroller address. |
| `name` | query | string | no | [both] Filter by pool name. |
| `priceOracleAddress` | query | string | no | [both] Filter by price oracle address. |
| `chainId` | query | string | no | [stable] **Required.** [next] Optional; accepts a JSON array string for multi-chain queries (e.g. `["56","1"]`). |
| `order` | query | string | no | [both] Columns to sort by. Default is descending. Prepend `+` for ascending (e.g. `+name`). |
| `limit` | query | integer | no | [both] Maximum number of results to return. |
| `page` | query | integer | no | [both] Page number for pagination. |

**Responses:** `200` Returns Pool data for all listed pools. · `400` Malformed Query






### Market Endpoints

#### `GET /markets`

Returns market data for listed markets, optionally filterable by asset address, name, symbol, underlying address, underlying name or underlying symbol.

**Versioning** (controlled via `accept-version` header):
- `stable` (default): `chainId` is **required**. Response includes a top-level `tokens` array of `TokenMetadata` objects. Markets include `rewardsDistributors` and `pointsDistributions`.
- `next`: `chainId` is optional for cross-chain queries. Token metadata is embedded inside each market as `underlyingTokenMetadata` with nested `tokenPrices`. Supports `accountAddress` for Prime APY data. No top-level `tokens` field.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `accept-version` | header | `stable` \\| `next` | no | Selects the API version. `stable` (default) requires `chainId` and returns a top-level `tokens` array. `next` supports cross-chain queries and embeds token data inside each market as `underlyingTokenMetadata`. |
| `chainId` | query | string | no | [stable] **Required.** [next] Optional. Blockchain chain ID to filter results. |
| `address` | query | string | no | [both] Filter by vToken address. |
| `symbol` | query | string | no | [both] Filter by asset symbol. |
| `name` | query | string | no | [both] Filter by asset name. |
| `underlyingAddress` | query | string | no | [both] Filter by underlying token address. |
| `underlyingName` | query | string | no | [both] Filter by underlying token name. |
| `underlyingSymbol` | query | string | no | [both] Filter by underlying token symbol. |
| `order` | query | string | no | [both] Columns to sort by. Default is descending. Prepend `+` for ascending (e.g. `+underlyingName`). |
| `limit` | query | integer | no | [both] Maximum number of results to return. |
| `page` | query | integer | no | [both] Page number for pagination. |
| `accountAddress` | query | string | no | [next only] Account address to embed personalised Prime APY boosts into each market. |

**Responses:** `200` Returns Market data for all listed markets. · `400` Malformed Query


#### `GET /markets/history`

Fetch an array of daily snapshots of supply and borrow totals and supply and borrow apy over the previous 365 days for a given asset.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `asset` | query | string | yes | vToken address to fetch history for. |
| `chainId` | query | string | yes | Chain ID of the network to query history for. |
| `period` | query | `year` \\| `month` \\| `halfyear` | no |  |

**Responses:** `200` Returns historical data for the requested asset. · `400` Unexpected error


#### `GET /markets/tvl`

Returns the total value locked by all markets in the requested chains.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `chainId` | query | string | no | Comma-separated list of chain IDs to filter results. If omitted, all chains are included. |

**Responses:** `200` Returns the TVL data for the requested chains. · `400` Unexpected error




### Governance Endpoints

#### `GET /governance/proposals/{proposalId}/voteSummary`

Get vote summary for a given proposal, includes sums of for, against, abstain and total votes.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `proposalId` | path | integer | yes | Proposal Id for fetching a detailed proposal |

**Responses:** `200` Proposal vote summary · `400` Unexpected error


#### `GET /governance/voters/{address}/summary`

Retrieve a summary of an account's voter profile.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `address` | path | string | yes | Account address |

**Responses:** `200` A summary of an account's voter profile including latest governance transactions. · `400` Unexpected error


#### `GET /governance/voters/{address}/history`

Retrieve the history of proposals a given account has voted on

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `address` | path | string | yes | Account address |

**Responses:** `200` Array of proposals in which the given account has voted · `400` Unexpected error


#### `GET /governance/voters`

Query voter accounts ordered by votes.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | no | Limit used for pagination |
| `page` | query | integer | no | Page number to fetch |

**Responses:** `200` Returns an array of voter accounts ordered by votes · `400` Unexpected error


#### `GET /governance/proposals`

Returns paginated array of proposals.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `proposalId` | query | integer | no | Filter by proposal ID |
| `state` | query | `0` \\| `1` \\| `2` \\| `3` \\| `4` \\| `5` \\| `6` \\| `7` | no | Filter by proposal state |
| `order` | query | string | no | Array of columns to order results. Default sort is descending. If '+' is prepended to a column it will be sorted ascending. |
| `limit` | query | integer | no | Limit used for pagination |
| `page` | query | integer | no | Page number to fetch |

**Responses:** `200` Returns an array of proposals. · `400` Unexpected error


#### `GET /governance/proposals/votes`

Get voter details for a given proposal.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `proposalId` | query | integer | no | Filter by proposal ID |
| `address` | query | string | no | Account address |
| `order` | query | string | no | Array of columns to order results. Default sort is descending. If '+' is prepended to a column it will be sorted ascending. |
| `limit` | query | integer | no | Limit used for pagination |
| `page` | query | integer | no | Page number to fetch |

**Responses:** `200` Pagination object with paginated voter activity and a summary of proposal votes. · `400` Unexpected error


#### `GET /governance/proposals/{proposalId}`

Returns paginated array of proposals. It takes an optional array of proposal ids to filter by.

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `proposalId` | path | integer | yes | Proposal Id for fetching a detailed proposal |

**Responses:** `200` Returns an array of proposals. · `400` Unexpected error

