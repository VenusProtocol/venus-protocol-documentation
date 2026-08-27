# AnkrBNBOracle

[`AnkrBNBOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/AnkrBNBOracle.sol) converts one ankrBNB into BNB through `sharesToBonds(1e18)`, then uses the ResilientOracle's native-token price. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address ankrBNB,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The BNB mainnet v2.16.0 artifact is the non-proxy contract `0x4512e9579734f7B8730f0a05Cd0D92DC33EB2675`. At block `118367342`, its snapshot interval was `2,592,000` seconds, its growth rate was `1,940,639,269` per second (`1e18` scale), its gap was `5,598,278,778,282,316`, and `isCapped()` returned false.

`NATIVE_TOKEN_ADDR()` exposes the sentinel address used to request BNB pricing from the ResilientOracle.

Those values are dynamic ACM-managed configuration. Confirm the current ResilientOracle role and state before using the address.
