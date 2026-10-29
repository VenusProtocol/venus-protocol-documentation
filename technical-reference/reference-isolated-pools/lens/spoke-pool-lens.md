# SpokePoolLens

[`SpokePoolLens`](https://github.com/VenusProtocol/isolated-pools/blob/develop/contracts/Lens/SpokePoolLens.sol) is the read aggregator for [hub-funded spoke pools](../spoke/README.md). It reports the state those pools add on top of an isolated pool, and mirrors the rest of [`PoolLens`](pool-lens.md) under the same names and struct shapes, so reading a spoke pool takes one lens address rather than two.

Like `PoolLens` it is a standalone immutable deployment, not a proxy, and is versioned by redeployment. It is on `develop` rather than in the `v4.4.0` release, so match the bytecode or verified source before decoding tuples. Deployed addresses are on the [spoke pools](../../../deployed-contracts/spoke-pools.md) page.

## Deployment scope

This page matches the source on `develop`. Which markets a lens call returns, and every value inside the structs, are live pool state: read them at the block an integration uses.

## Clock

```solidity
constructor(bool timeBased_, uint256 blocksPerYear_, uint256 maxBorrowRateMantissa_)
```

Same clock as `PoolLens`: when `timeBased_` is true, `blocksPerYear_` must be zero, otherwise it must be nonzero. The lens clock must match the reward distributors whose pending rewards it calculates. The inherited `isTimeBased`, `blocksOrSecondsPerYear` and `getBlockNumberOrTimestamp` read it back.

`maxBorrowRateMantissa_` is stored as the public immutable `MAX_BORROW_RATE_MANTISSA`. It must equal the borrow rate cap `SpokeVTokenImpl` is deployed with, because `VToken` does not expose its cap and the lens needs it to mirror accrual. It reads `5e12` on BNB Chain and BNB Chain testnet. A beacon upgrade that changes the cap needs a new lens.

## Spoke return structures

```solidity
struct SpokePoolData {
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
    uint256 poolLiquidationIncentiveMantissa;
    uint256 minLiquidatableCollateral;
    address deviationBoundedOracle;
    bool liquidationAllowlistEnabled;
    SpokeVTokenMetadata[] vTokens;
}
```

`SpokePoolData` is `PoolLens.PoolData` with two fields added, one renamed and one retyped. `deviationBoundedOracle` is the oracle that bounds prices on every collateral-factor check (borrow, redeem, transfer, `exitMarket`); it is zero until governance sets it, and while it is zero borrowing reverts, as do redeem, transfer and `exitMarket` for an account that has entered the market and moves a nonzero amount. `liquidationAllowlistEnabled` says whether seizing collateral is restricted to allowlisted accounts. `liquidationIncentive` is renamed `poolLiquidationIncentiveMantissa`, because a spoke market can carry its own incentive instead of the pool-wide one. `vTokens` holds `SpokeVTokenMetadata` instead of `VTokenMetadata`.

```solidity
struct SpokeVTokenMetadata {
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
    uint256 liquidationThresholdMantissa;
    address underlyingAssetAddress;
    uint256 vTokenDecimals;
    uint256 underlyingDecimals;
    uint256 pausedActions;
    uint256 effectiveLiquidationIncentiveMantissa;
    uint256 ownLiquidationIncentiveMantissa;
    bool supplyAllowlistEnabled;
    bool forcedLiquidationEnabled;
    bool boundedPricingEnabled;
}
```

Two differences from `PoolLens.VTokenMetadata` matter to an integrator.

The accrual basis is not the same. `PoolLens` reports the stored figures, so its `exchangeRateCurrent` is really `exchangeRateStored`. Here `exchangeRateCurrent`, `totalBorrows` and `totalReserves` include interest accrued up to the current block or second, with two exceptions. When the borrow rate is above `MAX_BORROW_RATE_MANTISSA`, no interest is added, because the market's own accrual would revert. When `totalSupply` is zero, `exchangeRateCurrent` is the stored rate. Accrual may also move reserves to the [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md), lowering reserves and cash by the same amount; neither `totalReserves` nor `totalCash` shows that move, and the exchange rate does not depend on it.

The added fields are the spoke-only state. `liquidationThresholdMantissa` sits in the middle of the struct, after `collateralFactorMantissa`, so a decoder written for `PoolLens.VTokenMetadata` misreads every field after it. It is the weight applied to collateral when checking liquidation: a position becomes liquidatable once its debt exceeds its collateral weighted by this value. `setCollateralFactor` rejects a threshold below the collateral factor, so it is always at or above `collateralFactorMantissa`. `effectiveLiquidationIncentiveMantissa` is the incentive in force for the market, and `ownLiquidationIncentiveMantissa` is its market-specific value or zero when it uses the pool-wide one. `supplyAllowlistEnabled` and `forcedLiquidationEnabled` are the market's own switches. `boundedPricingEnabled` says whether the bounded oracle has bounded pricing on for this market's underlying asset. When it is false, the oracle returns the spot price, which the prices alone cannot show. It is also false when the pool has no bounded oracle, and then borrowing reverts, as do redeem, transfer and `exitMarket` for an account that has entered the market and moves a nonzero amount.

```solidity
struct SpokeSupplyPermission {
    address vToken;
    bool allowlistEnabled;
    bool accountAllowlisted;
}

struct SpokeVTokenPrices {
    address vToken;
    uint256 spotPrice;
    uint256 boundedCollateralPrice;
    uint256 boundedDebtPrice;
}
```

`SpokeVTokenPrices` reports both pricing paths at once. Collateral-factor checks (borrow, redeem, transfer, `exitMarket`) use the bounded pair; liquidation-threshold checks use spot on both legs. `boundedCollateralPrice` can sit below spot, and `boundedDebtPrice` above it, only while the bounded oracle's protection is active for the asset. Both are zero while the pool has no bounded oracle, which is also the state in which every collateral-factor check reverts. Both are also zero when the bounded oracle's `getBoundedPricesView` reverts for the asset.

## Shared return structures

`VTokenBalances`, `VTokenUnderlyingPrice`, `PendingReward`, `RewardSummary`, `RewardTokenState`, `BadDebt` and `BadDebtSummary` are unchanged from [`PoolLens`](pool-lens.md#current-return-structures), field for field.

## Read and aggregation API

Spoke-specific reads:

| Function | Result |
|---|---|
| `getAllSpokePools(poolRegistry)` | every pool in a `SpokePoolRegistry`, enriched with Comptroller and market data |
| `getSpokePoolByComptroller(poolRegistry, comptroller)` | one spoke pool selected by its Comptroller **proxy** address |
| `getSpokePoolData(poolRegistry, venusPool)` | enrich a registry `VenusPool` structure |
| `spokeVTokenMetadata(vToken)` / `spokeVTokenMetadataAll(vTokens)` | market metadata including the spoke-only fields |
| `spokeVTokenPrices(vToken)` / `spokeVTokenPricesAll(vTokens)` | spot and bounded prices for a market's underlying |
| `spokeSupplyPermissions(comptroller, vTokens, account)` | per market, `allowlistEnabled` and `accountAllowlisted`; the account may supply when `!allowlistEnabled \|\| accountAllowlisted` |
| `spokeLiquidationPermission(comptroller, liquidator)` | `(allowlistEnabled, accountAllowlisted)`; the account may seize when `!allowlistEnabled \|\| accountAllowlisted` |

Reads shared with `PoolLens`, same signatures and results:

| Function | Result |
|---|---|
| `getVTokenForAsset(poolRegistry, comptroller, asset)` | VToken for an underlying within a pool |
| `getPoolsSupportedByAsset(poolRegistry, asset)` | Comptroller proxies registered for an asset |
| `getPendingRewards(account, comptroller)` | accrued and simulated pending rewards by distributor |
| `getPoolBadDebt(comptroller)` | pool and per-market bad debt valued through the pool oracle |
| `vTokenBalances(vToken, account)` / `vTokenBalancesAll(vTokens, account)` | per-account balances and allowances |
| `vTokenUnderlyingPrice(vToken)` / `vTokenUnderlyingPriceAll(vTokens)` | oracle price data |

Pass a `SpokePoolRegistry` to the registry-taking reads. The Isolated Pools `PoolRegistry` does not hold spoke pools, and a call against it reverts rather than returning nothing: `getAllSpokePools` reverts on BNB Chain when given the Isolated Pools registry `0x9F7b01A536aFA00EF10310A162877fd792cD0666`.

`vTokenBalances` and `vTokenBalancesAll` are non-view because they call interest-accruing VToken functions. Use `eth_call` for offchain simulation; do not invoke the large aggregation functions from another contract or in an on-chain transaction.

## What the lens will not tell you

Access-controlled call permissions are deliberately absent. `AccessControlManager` derives the role from its own caller, so asked from a lens it answers `false` for an account that can in fact make the call. Check those against the Comptroller and the ACM directly.

Registry membership and lens output do not establish product lifecycle. A returned pool or market can still be paused, unlisted, or retained only for exit and bad-debt duties.
