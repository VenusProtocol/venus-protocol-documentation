# PoolLens

[`PoolLens`](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/Lens/PoolLens.sol) aggregates pool, market, account, reward, price, and bad-debt reads for offchain consumers.

PoolLens is a standalone immutable deployment, not a proxy. Multiple generations can remain deployed on the same network, including historical `PoolLensR1` and `PoolLensR2` instances. Match the bytecode or verified source before decoding tuples; the structs below describe the v4.4.0 source family only.

## Clock

```solidity
constructor(bool timeBased, uint256 blocksPerYear)
```

The constructor selects a block or second clock. When `timeBased` is true, `blocksPerYear` must be zero; otherwise it must be nonzero. `isTimeBased()`, `blocksOrSecondsPerYear()`, and `getBlockNumberOrTimestamp()` expose the effective basis and current slot. The Lens clock must match the reward distributors whose pending rewards it calculates.

## Current return structures

```solidity
struct PoolData {
    string name;
    address creator;
    address comptroller;
    uint256 blockPosted;
    uint256 timestampPosted;
    string category;
    string logoURL;
    string description;
    address priceOracle;
    uint256 closeFactor;
    uint256 liquidationIncentive;
    uint256 minLiquidatableCollateral;
    VTokenMetadata[] vTokens;
}

struct VTokenMetadata {
    address vToken;
    uint256 exchangeRateCurrent;
    uint256 supplyRatePerBlockOrTimestamp;
    uint256 borrowRatePerBlockOrTimestamp;
    uint256 reserveFactorMantissa;
    uint256 supplyCaps;
    uint256 borrowCaps;
    uint256 totalBorrows;
    uint256 totalReserves;
    uint256 totalSupply;
    uint256 totalCash;
    bool isListed;
    uint256 collateralFactorMantissa;
    address underlyingAssetAddress;
    uint256 vTokenDecimals;
    uint256 underlyingDecimals;
    uint256 pausedActions;
}
```

`VTokenMetadata` has 17 fields in v4.4.0. In particular, the rate fields use block-or-timestamp names and `pausedActions` is appended to older tuple generations. `pausedActions` is a bitset whose bit position is the numeric `Action` enum value.

Despite its name, `exchangeRateCurrent` is populated with `VToken.exchangeRateStored()` and does not accrue interest. The supply-rate field is returned as zero when `totalSupply()` is zero.

```solidity
struct VTokenBalances {
    address vToken;
    uint256 balanceOf;
    uint256 borrowBalanceCurrent;
    uint256 balanceOfUnderlying;
    uint256 tokenBalance;
    uint256 tokenAllowance;
}

struct VTokenUnderlyingPrice {
    address vToken;
    uint256 underlyingPrice;
}

struct PendingReward {
    address vTokenAddress;
    uint256 amount;
}

struct RewardSummary {
    address distributorAddress;
    address rewardTokenAddress;
    uint256 totalRewards;
    PendingReward[] pendingRewards;
}

struct RewardTokenState {
    uint224 index;
    uint256 blockOrTimestamp;
    uint256 lastRewardingBlockOrTimestamp;
}

struct BadDebt {
    address vTokenAddress;
    uint256 badDebtUsd;
}

struct BadDebtSummary {
    address comptroller;
    uint256 totalBadDebtUsd;
    BadDebt[] badDebts;
}
```

The two reward-state clock fields are `uint256`. Older Lens tuple definitions that use `uint32` block fields are not ABI-compatible with this generation.

## Read and aggregation API

| Function | Result |
|---|---|
| `getAllPools(poolRegistry)` | all registered pools enriched with Comptroller and VToken data |
| `getPoolByComptroller(poolRegistry, comptroller)` | one pool selected by its Comptroller **proxy** address |
| `getVTokenForAsset(poolRegistry, comptroller, asset)` | VToken for an underlying within a pool |
| `getPoolsSupportedByAsset(poolRegistry, asset)` | Comptroller proxies registered for an asset |
| `getPendingRewards(account, comptroller)` | accrued and simulated pending rewards by distributor |
| `getPoolBadDebt(comptroller)` | pool and per-market bad debt valued through the pool oracle |
| `vTokenMetadata(vToken)` / `vTokenMetadataAll(vTokens)` | current market metadata and pause bitset |
| `vTokenUnderlyingPrice(vToken)` / `vTokenUnderlyingPriceAll(vTokens)` | oracle price data |
| `getPoolDataFromVenusPool(poolRegistry, venusPool)` | enrich a registry `VenusPool` structure |

`vTokenBalances` and `vTokenBalancesAll` are non-view because they call interest-accruing VToken functions. Use `eth_call` for offchain simulation; do not invoke the large aggregation functions from another transaction.

Registry membership and Lens output do not establish product lifecycle. A returned pool or market can still be paused, unlisted, or retained only for exit and bad-debt duties.
