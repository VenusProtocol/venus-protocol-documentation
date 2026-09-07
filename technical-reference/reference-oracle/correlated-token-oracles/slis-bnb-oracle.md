# SlisBNBOracle

[`SlisBNBOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/SlisBNBOracle.sol) calls Synclub's StakeManager to convert one slisBNB into BNB, then applies the ResilientOracle native-token price. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address stakeManager,
    address slisBNB,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The BNB mainnet v2.16.0 artifact is the non-proxy contract `0xDDE6446E66c786afF4cd3D183a908bCDa57DF9c1`. At block `118367342`, its snapshot interval was `2,592,000` seconds, its growth rate was `1,585,489,599` per second, its gap was `3,605,309,800,137,118`, and `isCapped()` returned false.

`STAKE_MANAGER()` exposes the immutable Synclub dependency, and `NATIVE_TOKEN_ADDR()` exposes the BNB pricing sentinel.

This contract is separate from `AsBNBOracle`, even though asBNB uses slisBNB as its underlying price route.
