# JumpRateModelV2

[`JumpRateModelV2`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/JumpRateModelV2.sol) uses one slope up to `kink` and a steeper slope above it. This page consolidates the current contract; there is no separate `BaseJumpRateModelV2` contract in v4.4.0.

## Constructor

```solidity
constructor(
    uint256 baseRatePerYear,
    uint256 multiplierPerYear,
    uint256 jumpMultiplierPerYear,
    uint256 kink,
    IAccessControlManagerV8 accessControlManager,
    bool timeBased,
    uint256 blocksPerYear
)
```

The three annual rate inputs are divided by `blocksOrSecondsPerYear()` and stored per slot. When `timeBased` is `true`, `blocksPerYear` must be zero and the inherited clock uses `31,536,000` seconds/year. When it is false, `blocksPerYear` must be nonzero.

The public storage names `baseRatePerBlock`, `multiplierPerBlock`, and `jumpMultiplierPerBlock` are retained for compatibility. On a time-based deployment they hold per-second values despite those names.

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

For utilization `u ≤ kink`:

```text
borrow rate = baseRatePerBlock + u × multiplierPerBlock
```

Above the kink, the model adds `jumpMultiplierPerBlock × (u - kink)` to the rate at the kink. All values are `1e18` mantissas and the result is per slot.

## Parameter updates

```solidity
function updateJumpRateModel(
    uint256 baseRatePerYear,
    uint256 multiplierPerYear,
    uint256 jumpMultiplierPerYear,
    uint256 kink
) external;
```

The call is authorized by `AccessControlManager` using the signature `updateJumpRateModel(uint256,uint256,uint256,uint256)`. Record the effective block whenever parameters are changed; constructor data alone is not the current configuration.
