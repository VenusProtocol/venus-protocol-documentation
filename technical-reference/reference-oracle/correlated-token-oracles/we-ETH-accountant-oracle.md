# WeETHAccountantOracle

[`WeETHAccountantOracle`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/WeETHAccountantOracle.sol) prices an Ether.fi LRT from an immutable Accountant's `getRateSafe()` result and the ResilientOracle WETH price. It inherits the [capped V2 base](common/correlated-token-oracle.md).

```solidity
constructor(
    address accountant,
    address weethLRT,
    address weth,
    address resilientOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

The Ethereum weETHs artifact is the non-proxy contract `0x47F7A7f3486b08A019E0c10Af969ADC4B6E415Cd`. At block `25845949`, its interval was `2,592,000` seconds, growth rate was `1,433,282,597` per second, gap was `3,904,016,098,263,516`, and `isCapped()` returned false.

`ACCOUNTANT()` exposes the immutable rate-provider address.

The constructor is token-instance-specific; do not assume the weETHs address also covers weETHk or another Accountant deployment.
