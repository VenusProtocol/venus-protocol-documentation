# Comptroller State and Storage

This page describes the state exposed by the [`ComptrollerStorage` v4.4.0 source](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/ComptrollerStorage.sol). It is **not** a slot-by-slot storage layout.

For an upgrade review, resolve the current Comptroller beacon implementation from the [engine version map](../README.md#mainnet-implementation-map) and use the compiler-generated storage layout for that exact build. The complete layout includes inherited upgradeable contracts, internal mappings and arrays, and reserved gaps that public getters do not reveal.

## Structures

```solidity
struct LiquidationOrder {
    VToken vTokenCollateral;
    VToken vTokenBorrowed;
    uint256 repayAmount;
}

struct AccountLiquiditySnapshot {
    uint256 totalCollateral;
    uint256 weightedCollateral;
    uint256 borrows;
    uint256 effects;
    uint256 liquidity;
    uint256 shortfall;
}

struct RewardSpeeds {
    address rewardToken;
    uint256 supplySpeed;
    uint256 borrowSpeed;
}

struct Market {
    bool isListed;
    uint256 collateralFactorMantissa;
    uint256 liquidationThresholdMantissa;
    mapping(address => bool) accountMembership;
}
```

## Public state getters

| Getter | Meaning |
|---|---|
| `oracle()` | ResilientOracle used for pool liquidity and liquidation checks |
| `closeFactorMantissa()` | maximum regular-liquidation repayment fraction, scaled by `1e18` |
| `liquidationIncentiveMantissa()` | gross collateral seizure multiplier, scaled by `1e18` |
| `accountAssets(account, index)` | markets entered by an account |
| `markets(vToken)` | listing, collateral factor, and liquidation threshold; the nested membership mapping is not returned |
| `allMarkets(index)` | historical market array; use `isMarketListed` to distinguish current listing |
| `borrowCaps(vToken)` / `supplyCaps(vToken)` | current market caps |
| `minLiquidatableCollateral()` | threshold separating regular and batch liquidation paths |
| `isForcedLiquidationEnabled(vToken)` | whether liquidity checks can be skipped for forced liquidation of that borrowed market |
| `prime()` | Prime contract used by borrow policy, or zero where not configured |
| `approvedDelegates(user, delegate)` | permission for delegated borrow and redeem flows |

The implementation also exposes immutable `poolRegistry()` and inherited `maxLoopsLimit()` configuration outside `ComptrollerStorage` itself.

## Internal state that a getter-only list misses

- `_actionPaused[market][action]`, exposed through `actionPaused`;
- `rewardsDistributors` and `rewardsDistributorExists`, exposed through reward getters;
- constants that constrain close and collateral factors;
- the v4.4.0 `uint256[47] __gap`;
- inherited `Ownable2StepUpgradeable`, `AccessControlledV8`, max-loop, reentrancy, and other parent storage.

Never infer storage slots from the order of the table above. Beacon upgrades affect every Comptroller proxy using that beacon, while each proxy retains its own storage.
