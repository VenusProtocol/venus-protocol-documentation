# SFraxOracle

[`SFraxOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/SFraxOracle.sol) converts one sFRAX to FRAX with `convertToAssets(1e18)`, then applies the ResilientOracle FRAX price. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address sFrax,
    address frax,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The Ethereum v2.16.0 artifact is the non-proxy contract `0x1aDCE75BB3164bBf6060a4f44262df5414473110`. At block `25845949`, its interval was `2,592,000` seconds, growth rate was `17,135,971,588` per second, gap was `50,823,525,555,757,553`, and `isCapped()` returned false.

These values and the consuming ResilientOracle role are dynamic; re-read them at the integration block.
