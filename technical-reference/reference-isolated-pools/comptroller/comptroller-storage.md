# ComptrollerStorage

## ComptrollerStorage

Storage layout for the `Comptroller` contract.

## Solidity API

```solidity
struct LiquidationOrder {
  contract VToken vTokenCollateral;
  contract VToken vTokenBorrowed;
  uint256 repayAmount;
}
```

```solidity
struct AccountLiquiditySnapshot {
  uint256 totalCollateral;
  uint256 weightedCollateral;
  uint256 borrows;
  uint256 effects;
  uint256 liquidity;
  uint256 shortfall;
}

```

```solidity
struct RewardSpeeds {
  address rewardToken;
  uint256 supplySpeed;
  uint256 borrowSpeed;
}

```

```solidity
struct Market {
  bool isListed;
  uint256 collateralFactorMantissa;
  uint256 liquidationThresholdMantissa;
  mapping(address => bool) accountMembership;
}

```

```solidity
enum Action {
  MINT,
  REDEEM,
  BORROW,
  REPAY,
  SEIZE,
  LIQUIDATE,
  TRANSFER,
  ENTER_MARKET,
  EXIT_MARKET
}

```

#### oracle

Oracle which gives the price of any given asset

```solidity
contract ResilientOracleInterface oracle
```



#### closeFactorMantissa

Multiplier used to calculate the maximum repayAmount when liquidating a borrow

```solidity
uint256 closeFactorMantissa
```



#### liquidationIncentiveMantissa

Multiplier representing the discount on collateral that a liquidator receives

```solidity
uint256 liquidationIncentiveMantissa
```



#### accountAssets

Per-account mapping of "assets you are in"

```solidity
mapping(address => contract VToken[]) accountAssets
```



#### markets

Official mapping of vTokens -> Market metadata

```solidity
mapping(address => struct ComptrollerStorage.Market) markets
```



#### allMarkets

A list of all markets

```solidity
contract VToken[] allMarkets
```



#### borrowCaps

Borrow caps enforced by borrowAllowed for each vToken address. Defaults to zero which restricts borrowing.

```solidity
mapping(address => uint256) borrowCaps
```



#### minLiquidatableCollateral

Minimal collateral required for regular (non-batch) liquidations

```solidity
uint256 minLiquidatableCollateral
```



#### supplyCaps

Supply caps enforced by mintAllowed for each vToken address. Defaults to zero which corresponds to minting not allowed

```solidity
mapping(address => uint256) supplyCaps
```

