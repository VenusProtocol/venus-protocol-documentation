# InterestRateModel Interface

The current [`InterestRateModel`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/InterestRateModel.sol) interface exposes three functions. Rates are mantissas scaled by `1e18` and are returned per slot, where the implementation defines a slot as a block or one second.

## `getBorrowRate`

```solidity
function getBorrowRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 badDebt
) external view returns (uint256);
```

Returns the borrow rate per slot. Current model implementations calculate utilization from `(borrows + badDebt) / (cash + borrows + badDebt - reserves)` and cap utilization at `1e18`.

## `getSupplyRate`

```solidity
function getSupplyRate(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 reserveFactorMantissa,
    uint256 badDebt
) external view returns (uint256);
```

Returns the supplier rate per slot after applying the reserve factor. Supply-rate income is based on performing borrows; bad debt affects utilization and the denominator but is not multiplied into `incomeToDistribute`.

## `isInterestRateModel`

```solidity
function isInterestRateModel() external pure returns (bool);
```

Returns `true` as a compatibility marker.

The interface does not expose the clock. Current implementations inherit `isTimeBased()` and `blocksOrSecondsPerYear()` from `TimeManagerV8`; read those functions from the deployed model before annualizing a rate.
