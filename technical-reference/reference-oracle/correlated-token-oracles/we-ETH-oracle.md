# WeETHOracle

Ethereum uses two different V2 source families for weETH routes. They share the [capped base API](common/correlated-token-oracle.md) but not the same derived constructor or exchange-rate source.

| Route | Address | Derived source | Checked state at block `25845949` |
|---|---|---|---|
| equivalence | `0xaB663D4a701229DFF407Eb4B45007921029072e9` | `WeETHOracle` | interval `2,592,000`, growth/second `1,680,618,975`, gap `4,704,509,580,349,536`, not capped |
| non-equivalence | `0x92469958A4C00101F9F290cc3AC32959Af497EAf` | `OneJumpOracle` | cap disabled: interval, growth, and gap all zero |

The [`WeETHOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/WeETHOracle.sol) uses:

```solidity
constructor(
    address liquidityPool,
    address weETH,
    address eETH,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

It obtains the underlying amount through `liquidityPool.amountForShare(1e18)`. The non-equivalence instance instead uses the ten-argument [`OneJumpOracle`](one-jump-oracle.md) constructor with an immutable intermediate oracle.

The equivalence implementation exposes its immutable dependency through `LIQUIDITY_POOL()`.

Select the instance from the live ResilientOracle token config. “Equivalence” is deployment configuration, not a boolean getter shared by both addresses.
