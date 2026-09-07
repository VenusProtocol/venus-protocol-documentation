# WstETHOracle and WstETHOracleV2

The repository contains two incompatible wstETH oracle families. Current Ethereum deployment artifacts use `WstETHOracleV2`; the older `WstETHOracle` API is retained below only for exact legacy deployments.

## V2 deployed family

The [`WstETHOracleV2` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/WstETHOracleV2.sol) inherits the [capped base](common/correlated-token-oracle.md):

```solidity
constructor(
    address stETH,
    address wstETH,
    address underlyingToken,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

It obtains stETH per wstETH from `getPooledEthByShares(1e18)` and assumes the configured underlying token is equivalent to stETH for that conversion.

`STETH()` exposes the immutable stETH contract used for that conversion.

| Route | Address | Underlying route | State at block `25845949` |
|---|---|---|---|
| equivalence | `0x6b51Ee3aF70b350AaADc05f418502b330c5Aad7c` | WETH | interval `2,592,000`, growth/second `2,124,556,062`, gap `6,637,568,880,406,786`, not capped |
| non-equivalence | `0x6ecf38558B0D1fFc6Ea28bEC6BD39F9F0Fdd6631` | stETH | same cap parameters, not capped |

## Legacy V1 source

[`WstETHOracle.sol`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/WstETHOracle.sol) is a separate, uncapped five-argument implementation:

```solidity
constructor(
    address wstETH,
    address weth,
    address stETH,
    address resilientOracle,
    bool assumeStETHETHEquivalence
)
```

Do not infer that V1 is active from the continued source file, and do not decode the V2 addresses with the V1 boolean constructor. Identify any legacy consumer by its exact deployed bytecode before retaining or retiring it.
