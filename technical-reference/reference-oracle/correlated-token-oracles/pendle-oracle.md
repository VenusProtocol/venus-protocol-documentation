# PendleOracle

`PendleOracle` prices a dated Pendle principal token from either a PT-to-asset or PT-to-SY TWAP and the configured underlying USD price. Deployment artifacts contain at least two incompatible generations.

## V1 proxy generation

```solidity
constructor(
    address market,
    address ptOracle,
    uint8 rateKind,
    address ptToken,
    address underlyingToken,
    address resilientOracle,
    uint32 twapDuration
)
```

`rateKind` selects `PT_TO_ASSET` or `PT_TO_SY`. BNB Chain proxy `0xEa7a92D12196A325C76ED26DBd36629d7EC46459` pointed to V1 implementation `0x8A183a0d35290D849e8915710D3aEE7e463705E7` at block `118367342`.

## V2 capped generation

The [`PendleOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/PendleOracle.sol) takes one 13-field structure:

```solidity
struct ConstructorParams {
    address market;
    address ptOracle;
    RateKind rateKind;
    address ptToken;
    address underlyingToken;
    address resilientOracle;
    uint32 twapDuration;
    uint256 annualGrowthRate;
    uint256 snapshotInterval;
    uint256 initialSnapshotMaxExchangeRate;
    uint256 initialSnapshotTimestamp;
    address accessControlManager;
    uint256 snapshotGap;
}
```

It also exposes immutable `MARKET`, `PT_ORACLE`, `RATE_KIND`, `TWAP_DURATION`, and `UNDERLYING_DECIMALS`, plus the [common V2 cap API](common/correlated-token-oracle.md). Construction verifies that the Pendle oracle has sufficient observation history for the requested duration.

BNB Chain `PendleOracle-PT-USDe-30OCT2025` at `0xAa5138e86c078fd2859a929173B3870b5003EC30` is a non-proxy V2 example with code present at block `118367342`.

A maturity date in an artifact name is not enough to delete its reference. Before labeling an instance historical, verify the current ResilientOracle token config, consuming market balances and debt, and any remaining exit or recovery duty.
