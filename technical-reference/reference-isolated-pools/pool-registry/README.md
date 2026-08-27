# PoolRegistry

`PoolRegistry` is the discovery and administration directory for pools built with the modern lending market engine. It is an upgradeable transparent proxy; its entries point to pool Comptroller proxy addresses.

- [Current interface](pool-registry-interface.md)
- [Administration and full API](pool-registry.md)
- [Mainnet proxy and implementation map](../README.md#mainnet-implementation-map)

Registry presence is not a lifecycle guarantee. The same registry can contain an active Core Pool and an old non-Core pool that is retained only for exits or recovery work. Check the [deployed markets registry](../../../deployed-contracts/markets.md) and current onchain state before directing users to a pool.
