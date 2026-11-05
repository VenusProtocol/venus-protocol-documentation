---
title: "Comptroller"
---

The Comptroller applies pool-wide policy: collateral membership, liquidity checks, market caps, liquidation rules, pause state, rewards distributors, and privileged risk configuration.

Each pool uses a Comptroller beacon proxy registered in [`PoolRegistry`](/technical-reference/reference-isolated-pools/pool-registry/pool-registry). The beacon implementation is shared by the pools on that network, but each proxy keeps independent configuration and state.

- [Comptroller API](/technical-reference/reference-isolated-pools/comptroller/comptroller)
- [State and storage guidance](/technical-reference/reference-isolated-pools/comptroller/comptroller-storage)
- [Engine scope and live implementation map](/technical-reference/reference-isolated-pools)

An unlisted or paused market can still have supply, debt, or exit duties. Do not infer lifecycle from `PoolRegistry` membership or `isMarketListed` alone.
