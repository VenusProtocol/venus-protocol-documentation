# Governance contract families

These references cover several deployed generations. They are not one interchangeable ABI. The source baseline for this section is the stable [`governance-contracts` v2.15.0 tag](https://github.com/VenusProtocol/governance-contracts/tree/v2.15.0).

| Family | Production role | Version boundary |
| --- | --- | --- |
| Governor Bravo | Proposes, votes, queues, and executes BNB Chain VIPs through three route-specific timelocks | Upgradeable Solidity 0.5 governor. Its V1 scalar `votingDelay`, `votingPeriod`, and `proposalThreshold` slots are deprecated; current rules are stored per proposal type in `proposalConfigs` |
| Omnichain governance | Sends approved BNB Chain commands to executors and TimelockV8 contracts on destination networks | LayerZero V1-style messaging with `uint16` endpoint IDs (called chain IDs in the ABI). Do not substitute EVM chain IDs or LayerZero V2 EIDs/OApp APIs |
| Risk Steward V2 | Publishes and validates bounded risk-parameter updates | Current stable source, but rollout is not uniform: v2.15.0 artifacts contain the BNB mainnet origin stack and destination receivers/stewards on testnets, not on every destination mainnet |
| Access control | Resolves exact-contract and wildcard function-signature permissions | The BNB mainnet AccessControlManager has the older ABI without `hasPermission`; the seven destination-mainnet artifacts include it |

`AccessControlledV5` remains relevant to live legacy contracts. `AccessControlledV8` is the current Solidity 0.8 base, but inherited owner, proxy, and access-control selectors depend on the exact deployed implementation.

LayerZero labels V1 deprecated for new integrations in its [V1 deployment reference](https://docs.layerzero.network/v1/deployments/deployed-contracts). That upstream lifecycle label does not mean the active Venus Omnichain Governance contracts have been retired; it means new code must not silently substitute V2 APIs for this legacy transport.

Addresses and lifecycle labels belong in the [deployed governance registry](../../deployed-contracts/governance.md). Use this section for ABI and version selection, and identify a proxy's implementation before encoding administrative calls.
