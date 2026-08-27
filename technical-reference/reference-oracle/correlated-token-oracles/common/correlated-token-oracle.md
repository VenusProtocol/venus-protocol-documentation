# CorrelatedTokenOracle

[`CorrelatedTokenOracle` in oracle v2.16.0](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/common/CorrelatedTokenOracle.sol) is the abstract base for current capped correlated-token oracles.

This is the V2 API. Older proxy implementations can use an uncapped V1 base with only the token, underlying, ResilientOracle, and price functions. Do not apply V2 selectors or storage assumptions until the exact deployed implementation has been identified.

## Constructor and state

```solidity
constructor(
    address correlatedToken,
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

The V2 base exposes:

- immutable `CORRELATED_TOKEN`, `UNDERLYING_TOKEN`, `RESILIENT_ORACLE`, and `ACCESS_CONTROL_MANAGER`;
- mutable `growthRatePerSecond`, `snapshotInterval`, `snapshotMaxExchangeRate`, `snapshotTimestamp`, and `snapshotGap`.

`annualGrowthRate` is divided by `31,536,000` and uses `1e18` scaling. Growth and interval must either both be enabled or both be zero. When the interval is enabled, the initial maximum exchange rate and timestamp must be nonzero.

## Pricing

```solidity
function getUnderlyingAmount() public view virtual returns (uint256);
function getMaxAllowedExchangeRate() public view returns (uint256);
function getPrice(address asset) public view returns (uint256);
function isCapped() external view returns (bool);
```

Each derived oracle supplies the live amount of `UNDERLYING_TOKEN` for one `CORRELATED_TOKEN`. The base then multiplies that exchange rate by `RESILIENT_ORACLE.getPrice(UNDERLYING_TOKEN)` and normalizes by the correlated token's decimals.

When the cap is enabled:

```text
maximum rate = snapshot rate
             + snapshot rate × growth per second × elapsed seconds

priced rate = min(live exchange rate, maximum rate)
```

`isCapped()` reports whether the live exchange rate currently exceeds that maximum. When `snapshotInterval == 0`, capping is disabled.

## Snapshot and growth controls

```solidity
function setSnapshot(
    uint256 snapshotMaxExchangeRate,
    uint256 snapshotTimestamp
) external;

function setGrowthRate(
    uint256 annualGrowthRate,
    uint256 snapshotInterval
) external;

function setSnapshotGap(uint256 snapshotGap) external;
```

These three setters are authorized by `ACCESS_CONTROL_MANAGER` using their exact function signatures.

```solidity
function updateSnapshot() public;
```

`updateSnapshot` is permissionless. It is a no-op until the interval has elapsed or when capping is disabled. On update, it stores `min(live rate, current maximum) + snapshotGap`, advances the timestamp, and asks the ResilientOracle to update the underlying asset price.

The cap limits exchange-rate growth; it does not validate the underlying USD oracle. Both the derived exchange-rate source and the configured underlying price route remain security dependencies.
