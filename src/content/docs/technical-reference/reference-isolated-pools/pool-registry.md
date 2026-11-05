---
title: "Pool Registry"
---

`PoolRegistry` is the discovery and administration directory for pools built with the modern lending market engine. It is an upgradeable transparent proxy; its entries point to pool Comptroller proxy addresses.

- [Current interface](/technical-reference/reference-isolated-pools/pool-registry/pool-registry-interface)
- [Administration and full API](/technical-reference/reference-isolated-pools/pool-registry/pool-registry)
- [Mainnet proxy and implementation map](/technical-reference/reference-isolated-pools#mainnet-implementation-map)

Registry presence is not a lifecycle guarantee. The same registry can contain an active Core Pool and an old non-Core pool that is retained only for exits or recovery work. Check the [deployed markets registry](/deployed-contracts/markets) and current onchain state before directing users to a pool.
