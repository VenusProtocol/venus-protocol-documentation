# OneJumpOracle

`OneJumpOracle` derives a correlated token's USD price through an intermediate oracle and then the ResilientOracle price of an underlying token. Both uncapped V1 proxies and capped V2 immutable deployments exist; one constructor cannot describe every address.

## V1 proxy generation

Sampled V1 implementations use:

```solidity
constructor(
    address correlatedToken,
    address underlyingToken,
    address resilientOracle,
    address intermediateOracle
)
```

For example, BNB Chain proxy `0x3b3241698692906310A65ACA199701843404E175` pointed to V1 implementation `0x157fb3dFe0Bd5569cC25DC79Ae195E82A3EB6855` at block `118367342`.

## V2 capped generation

The [`OneJumpOracle` v2.16.0 source](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/OneJumpOracle.sol) uses:

```solidity
constructor(
    address correlatedToken,
    address underlyingToken,
    address resilientOracle,
    address intermediateOracle,
    uint256 annualGrowthRate,
    uint256 snapshotInterval,
    uint256 initialSnapshotMaxExchangeRate,
    uint256 initialSnapshotTimestamp,
    address accessControlManager,
    uint256 snapshotGap
)
```

It inherits the [V2 snapshot and growth-cap API](common/correlated-token-oracle.md). BNB Chain `SolvBTCOneJumpChainlinkOracle` at `0x3f4bC081E749032cffF29dcA2E8408Ec375e745A` is one non-proxy V2 example; code was present at block `118367342`.

`INTERMEDIATE_ORACLE` is an immutable, instance-specific dependency. Identify its exact return scaling and the correlated/underlying token decimals before reproducing `getUnderlyingAmount()`. A name containing “Chainlink” or “RedStone” is not an ABI guarantee.
