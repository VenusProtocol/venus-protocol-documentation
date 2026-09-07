# WhitePaperInterestRateModel

[`WhitePaperInterestRateModel`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/WhitePaperInterestRateModel.sol) implements a single linear borrow-rate curve. The source remains supported, but this page does not claim that every current market—or any particular market—uses it. Resolve `VToken.interestRateModel()` before applying this API.

## Constructor

```solidity
constructor(
    uint256 baseRatePerYear,
    uint256 multiplierPerYear,
    bool timeBased,
    uint256 blocksPerYear
)
```

The two annual rate inputs are divided by the inherited slots/year value. A time-based deployment requires `blocksPerYear = 0`; a block-based deployment requires a nonzero value. The resulting immutable fields are named `baseRatePerBlock` and `multiplierPerBlock`; on time-based networks those fields hold per-second values.

## Rate functions

```solidity
function getBorrowRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 badDebt
) public view returns (uint256);

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

The borrow-rate formula is:

```text
borrow rate per slot = baseRatePerBlock + utilization × multiplierPerBlock
```

All rate and utilization values are `1e18` mantissas. Read `isTimeBased()` and `blocksOrSecondsPerYear()` from the deployed model before annualizing.
