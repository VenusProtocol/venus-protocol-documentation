# WBETHOracle

[`WBETHOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/WBETHOracle.sol) obtains BETH per WBETH from `WBETH.exchangeRate()`, then uses the configured ETH price from the ResilientOracle. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address wbeth,
    address eth,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The BNB mainnet v2.16.0 artifact is the non-proxy contract `0x49938fc72262c126eb5D4BdF6430C55189AEB2BA`. At block `118367342`, its snapshot interval was `2,592,000` seconds, its growth rate was `1,471,334,348` per second, its gap was `4,215,128,607,557,400`, and `isCapped()` returned false.

BNB testnet deployment artifacts include an older proxy shape. Select ABI by address and environment rather than applying this mainnet V2 constructor globally.
