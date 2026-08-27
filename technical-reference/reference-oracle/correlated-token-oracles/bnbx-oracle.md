# BNBxOracle

[`BNBxOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/BNBxOracle.sol) calls the immutable Stader StakeManager to convert one BNBx into BNB, then applies the ResilientOracle BNB price. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address stakeManager,
    address bnbx,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The BNB mainnet v2.16.0 artifact is the non-proxy contract `0xC2E2b6f9CdE2BFA5Ba5fda2Dd113CAcD781bdb31`. At block `118367342`, its snapshot interval was `2,592,000` seconds, its growth rate was `2,387,747,336` per second, its gap was `6,956,741,073,522,234`, and `isCapped()` returned false.

`STAKE_MANAGER()` exposes the immutable Stader dependency, and `NATIVE_TOKEN_ADDR()` exposes the BNB pricing sentinel. These values, token addresses, and cap configuration are instance-specific; do not reuse them from another BNB-correlated oracle.
