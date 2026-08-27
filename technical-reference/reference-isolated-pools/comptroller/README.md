# Comptroller

The Comptroller applies pool-wide policy: collateral membership, liquidity checks, market caps, liquidation rules, pause state, rewards distributors, and privileged risk configuration.

Each pool uses a Comptroller beacon proxy registered in [`PoolRegistry`](../pool-registry/pool-registry.md). The beacon implementation is shared by the pools on that network, but each proxy keeps independent configuration and state.

- [Comptroller API](comptroller.md)
- [State and storage guidance](comptroller-storage.md)
- [Engine scope and live implementation map](../README.md)

An unlisted or paused market can still have supply, debt, or exit duties. Do not infer lifecycle from `PoolRegistry` membership or `isMarketListed` alone.
