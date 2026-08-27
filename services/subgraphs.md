# Subgraphs

Venus publishes GraphQL subgraphs that index selected protocol events into queryable entities. Most deployments listed here are on **The Graph Network**, not the retired Hosted Service. The `chain=arbitrum-one` parameter in an Explorer URL identifies the network on which The Graph operates; the Explorer page's **Network** field identifies the blockchain whose Venus events are indexed.

{% hint style="warning" %}
A subgraph is a derived, eventually consistent view. It can lag the chain, stop indexing, encounter a deterministic error, or reflect a different deployment version than a client expects. Do not use subgraph output alone for transaction safety, balances, permissions, prices, pause state, or liquidation decisions. Check the index status and latest indexed block, then confirm critical state through an RPC endpoint.
{% endhint %}

## Querying a Deployment

Open an Explorer link below and verify its title, indexed network, subgraph ID, current version, deployment ID, and index status. For deployments on The Graph Network, create a Graph API key and use the subgraph ID shown by Explorer:

```text
https://gateway.thegraph.com/api/<GRAPH_API_KEY>/subgraphs/id/<SUBGRAPH_ID>
```

See The Graph's [querying documentation](https://thegraph.com/docs/en/subgraphs/querying/introduction/) for the current gateway and key-management flow. Do not embed unrestricted provider keys in public client code. The opBNB links use NodeReal instead and require a NodeReal API key in the `{apikey}` path segment.

Provider availability, routing, rate limits, and deployment versions are external runtime state. Treat the links below as discovery entries rather than uptime guarantees, and keep a direct-chain fallback for production integrations.

## Isolated Pools

Indexes Isolated Pool configuration and lending activity on the listed networks.

[Source](https://github.com/VenusProtocol/subgraphs/tree/main/subgraphs/isolated-pools)

### Deployments

* [BNB Chain](https://thegraph.com/explorer/subgraphs/H2a3D64RV4NNxyJqx9jVFQRBpQRzD6zNZjLDotgdCrTC?view=Query&chain=arbitrum-one)
* [Ethereum](https://thegraph.com/explorer/subgraphs/Htf6Hh1qgkvxQxqbcv4Jp5AatsaiY5dNLVcySkpCaxQ8?view=Query&chain=arbitrum-one)
* [opBNB (NodeReal; API key required)](https://open-platform-ap.nodereal.io/%7Bapikey%7D/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb/graphql)
* [Arbitrum One](https://thegraph.com/explorer/subgraphs/2zqpTYBL3X1E2eb129bKno1pJdx6xBawr8urp61w33Z8?view=Query&chain=arbitrum-one)
* [zkSync Era](https://thegraph.com/explorer/subgraphs/GAGNaWNCDmWvjr217vjtQrh3uSkV2bjXPzJSfnGAuxfz?view=Query&chain=arbitrum-one)
* [Optimism](https://thegraph.com/explorer/subgraphs/6vdC1Qpr5kobLEJCdDVUsGK6yG6aFscaQKvNZt2SspSz?view=Query&chain=arbitrum-one)
* [Base](https://thegraph.com/explorer/subgraphs/7VHvieXwv5SWSmVppmi4QkSCFVxiECgcFdng2er73Q97?view=Query&chain=arbitrum-one)
* [Unichain](https://thegraph.com/explorer/subgraphs/7N1UtVizkc1EbqNvHh8xfKbSanBtksnap1JxVdpogrMJ?view=Query&chain=arbitrum-one)

## Core Pool

Indexes market and lending events for the BNB Chain Core Pool.

[Source](https://github.com/VenusProtocol/subgraphs/tree/main/subgraphs/venus)

### Deployments

* [BNB Chain](https://thegraph.com/explorer/subgraphs/7h65Zf3pXXPmf8g8yZjjj2bqYiypVxems5d8riLK1DyR?view=Query&chain=arbitrum-one)

## Governance

Indexes BNB Chain governance proposals, votes, and related governance activity.

[Source](https://github.com/VenusProtocol/subgraphs/tree/main/subgraphs/venus-governance)

### Deployments

* [BNB Chain](https://thegraph.com/explorer/subgraphs/5ygYHxpnJ7EbQ6LBv39bjc4XmeTH1bQMdXw3uAnFF7iR?view=Query&chain=arbitrum-one)

## Cross-Chain Governance

Indexes governance messages received and proposal executions on remote chains.

[Source](https://github.com/VenusProtocol/subgraphs/tree/main/subgraphs/cross-chain-governance)

### Deployments

* [Ethereum](https://thegraph.com/explorer/subgraphs/33SALoS8mD2PxLR2utd6TXBekhp3Ra3T3uCyHks5wV3W?view=Query&chain=arbitrum-one)
* [Arbitrum One](https://thegraph.com/explorer/subgraphs/4uZXx9tZRbHcSoJp4prF4ankfL1dyTHrm6dNuQp5pdJw?view=Query&chain=arbitrum-one)
* [opBNB (NodeReal; API key required)](https://open-platform-ap.nodereal.io/%7Bapikey%7D/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-governance-opbnb/graphql)
* [zkSync Era](https://thegraph.com/explorer/subgraphs/FGFYdyEMfD3BrXJZFZtNdGdi7RwVahqzxvK1BtDdk8Kb?view=Query&chain=arbitrum-one)
* [Optimism](https://thegraph.com/explorer/subgraphs/4WESjRqo3TcdL3eUCTbbT4h2dLFwn3sKVi4PdWJDC118?view=Query&chain=arbitrum-one)
* [Base](https://thegraph.com/explorer/subgraphs/88XyqtD22FYVzENf3aJhRrtQx7yncfWF22ryMpFNMSNP?view=Query&chain=arbitrum-one)

## Protocol Share Reserve

Indexes selected Protocol Share Reserve and token-converter activity.

[Source](https://github.com/VenusProtocol/subgraphs/tree/main/subgraphs/protocol-reserve)

### Deployments

* [BNB Chain](https://thegraph.com/explorer/subgraphs/2ZCWgaBc8KoWW8kh7MRzf9KPdr7NTZ5cda9bxpFDk4wG?view=Query&chain=arbitrum-one)
* [Ethereum](https://thegraph.com/explorer/subgraphs/bnwTFv6yd4FojhPFf5Hw4pzb8GwW25Du12yrnpD6erw?view=Query&chain=arbitrum-one)

The source-tree boundary checked for this page is [`VenusProtocol/subgraphs@68f1cb9`](https://github.com/VenusProtocol/subgraphs/tree/68f1cb98a719454282277e920fdd67f0af5788a7). The repository defines schemas and mappings; it does not by itself prove that a provider is serving a healthy, fully synced deployment.
