# Venus Protocol Subgraphs

Venus Protocol official supports a few subgraphs for querying protocol activity and data using GraphQl. The subgraphs are currently deployed in the [The Graph](https://thegraph.com/hosted-service) hosted service.

## Isolated Pools
The Isolated Pools subgraphs provides endpoints for querying data related to Isolated Pools and lending activities.

[Code](https://github.com/VenusProtocol/subgraphs/tree/master/subgraphs/isolated-pools)

### Explorers
[Mainnet](https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools/graphql?query=query+Markets+%7B%0A++markets+%7B%0A++++accounts+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

[Chapel Testnet](https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel/graphql?query=query+Markets+%7B%0A++markets+%7B%0A++++accounts+%7B%0A++++++id%0A++++%7D%0A++%7D%0A%7D)

[Sepolia](https://thegraph.com/hosted-service/subgraph/venusprotocol/venus-isolated-pools-sepolia)


## Core Pool
The Core Pool subgraph is responsible for indexing and aggregating events related to market and lending activities in the Core Pool

[Code](https://github.com/VenusProtocol/subgraphs/tree/master/subgraphs/venus)

### Explorers
[Mainnet](https://api.thegraph.com/subgraphs/name/venusprotocol/venus-subgraph/graphql?query=query+TotalSupplyAndBorrows+%7B%0A++markets+%7B%0A++++id%0A++++totalSupply%0A++++totalBorrows%0A++%7D%0A%7D)

## Governance
The Governance subgraph will index events related to Governance including proposals and voting activity.

[Code](https://github.com/VenusProtocol/subgraphs/tree/master/subgraphs/venus-governance)

