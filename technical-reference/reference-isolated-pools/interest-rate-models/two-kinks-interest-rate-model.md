# TwoKinksInterestRateModel

[`TwoKinksInterestRateModel`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/TwoKinksInterestRateModel.sol) has three utilization segments separated by `KINK_1` and `KINK_2`. Signed slope inputs allow a segment to rise or fall, while the returned borrow rate is floored at zero.

## Constructor

```solidity
constructor(
    int256 baseRatePerYear,
    int256 multiplierPerYear,
    int256 kink1,
    int256 multiplier2PerYear,
    int256 baseRate2PerYear,
    int256 kink2,
    int256 jumpMultiplierPerYear,
    bool timeBased,
    uint256 blocksPerYear
)
```

`baseRatePerYear` and `baseRate2PerYear` cannot be negative, and the kinks must satisfy `0 < kink1 < kink2`. Annual rates are divided by the implementation's slots/year value and stored in immutable per-block-or-second fields. A time-based deployment requires `blocksPerYear = 0`; a block-based deployment requires a nonzero value.

## Public parameters

- `BASE_RATE_PER_BLOCK_OR_SECOND`, `MULTIPLIER_PER_BLOCK_OR_SECOND`, and `KINK_1`
- `BASE_RATE_2_PER_BLOCK_OR_SECOND`, `MULTIPLIER_2_PER_BLOCK_OR_SECOND`, and `RATE_1`
- `KINK_2`, `JUMP_MULTIPLIER_PER_BLOCK_OR_SECOND`, and `RATE_2`
- inherited `isTimeBased()` and `blocksOrSecondsPerYear()`

All rate and utilization values use `1e18` mantissa scaling. `RATE_1` and `RATE_2` are precomputed constructor values used to keep the three curve segments continuous.

## Rate functions

```solidity
function getBorrowRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 badDebt
) external view returns (uint256);

function getSupplyRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 reserveFactorMantissa,
    uint256 badDebt
) public view returns (uint256);

function utilizationRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 badDebt
) public pure returns (uint256);
```

The model is immutable. Identify the exact deployed address and constructor values returned by a market's `interestRateModel()`; a model family name is not enough to reproduce the curve.
