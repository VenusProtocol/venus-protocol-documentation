# AsBNBOracle

[`AsBNBOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/AsBNBOracle.sol) converts one asBNB into slisBNB through the asBNB minter, then prices slisBNB through the ResilientOracle. It is not `SlisBNBOracle`; the two contracts have separate tokens and exchange-rate sources.

```solidity
constructor(
    address asBNB,
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

The BNB mainnet v2.16.0 artifact is the non-proxy capped V2 contract `0x652B90D1d45a7cD5BE82c5Fb61a4A00bA126dde5`. At block `118367342`, its snapshot interval was `2,592,000` seconds, its growth rate was `1,585,489,599` per second, its gap was `26,066,219,693,591,668`, and `isCapped()` returned false.

See the [common V2 API](common/correlated-token-oracle.md) for mutable snapshot controls and permissions.
