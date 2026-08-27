# Comptroller API

The [`Comptroller` v4.4.0 source](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/Comptroller.sol) applies pool policy and risk checks. Each pool is a beacon proxy; resolve its current beacon implementation from the [engine version map](../README.md#mainnet-implementation-map) before relying on this ABI.

## Initialization

```solidity
function initialize(
    uint256 loopLimit,
    address accessControlManager
) external;
```

The initializer configures ownership, AccessControlManager, and the maximum loop count. It is called once through each Comptroller proxy.

## User and delegate operations

| Function | Purpose |
|---|---|
| `enterMarkets(address[])` | opt into markets so supplied assets can count as collateral |
| `exitMarket(address)` | remove a market from the caller's collateral set when debt and liquidity checks allow it |
| `updateDelegate(address,bool)` | allow or revoke delegated borrow/redeem for the caller |
| `healAccount(address)` | settle an insolvent small account, seize all collateral, and record the unpaid remainder as bad debt |
| `liquidateAccount(address,LiquidationOrder[])` | batch-liquidate a small account when collateral can cover all debt |

`healAccount` and `liquidateAccount` are permissionless but condition-bound. They are only for accounts at or below `minLiquidatableCollateral`; regular `VToken.liquidateBorrow` is used above that threshold. Recording bad debt does not itself trigger automatic fund coverage: that balance historically fed Shortfall auctions, but on BNB Chain mainnet new auction starts and restarts are paused and RiskFundV2 no longer maintains the per-pool reserve ledger.

## VToken policy hooks

The following hooks are called by a VToken. They validate the calling market, listing, pause state, caps, account membership, prices, liquidity, and Prime rules as applicable:

```solidity
preMintHook(address vToken, address minter, uint256 mintAmount)
preRedeemHook(address vToken, address redeemer, uint256 redeemTokens)
preBorrowHook(address vToken, address borrower, uint256 borrowAmount)
preRepayHook(address vToken, address borrower)
preLiquidateHook(address vTokenBorrowed, address vTokenCollateral, address borrower, uint256 repayAmount, bool skipLiquidityCheck)
preSeizeHook(address vTokenCollateral, address vTokenBorrowed, address liquidator, address borrower)
preTransferHook(address vToken, address src, address dst, uint256 transferTokens)
```

The current ABI also retains the compatibility verification callbacks `mintVerify`, `redeemVerify`, `borrowVerify`, `repayBorrowVerify`, `liquidateBorrowVerify`, `seizeVerify`, and `transferVerify`.

## Market retirement

```solidity
function unlistMarket(address market) external returns (uint256);
```

`unlistMarket` is controlled by AccessControlManager. Before a market can be unlisted, all nine actions must be paused, borrow and supply caps must be zero, and the collateral factor must be zero. Unlisting changes `markets[market].isListed`; it does not erase the VToken, balances, debt, or its entry in the historical `allMarkets` array.

## Privileged configuration

### AccessControlManager

| Function | Authorization signature |
|---|---|
| `unlistMarket(address)` | `unlistMarket(address)` |
| `setCloseFactor(uint256)` | `setCloseFactor(uint256)` |
| `setCollateralFactor(address,uint256,uint256)` | `setCollateralFactor(address,uint256,uint256)` |
| `setLiquidationIncentive(uint256)` | `setLiquidationIncentive(uint256)` |
| `setMarketBorrowCaps(address[],uint256[])` | `setMarketBorrowCaps(address[],uint256[])` |
| `setMarketSupplyCaps(address[],uint256[])` | `setMarketSupplyCaps(address[],uint256[])` |
| `setActionsPaused(address[],Action[],bool)` | `setActionsPaused(address[],uint256[],bool)` |
| `setMinLiquidatableCollateral(uint256)` | `setMinLiquidatableCollateral(uint256)` |
| `setForcedLiquidation(address,bool)` | `setForcedLiquidation(address,bool)` |

The ACM signature for `setActionsPaused` intentionally uses `uint256[]` in the source authorization check even though the ABI exposes an enum array.

### Owner and fixed callers

| Function | Caller |
|---|---|
| `addRewardsDistributor(address)` | Comptroller owner |
| `setPriceOracle(address)` | Comptroller owner |
| `setMaxLoopsLimit(uint256)` | Comptroller owner |
| `setPrimeToken(address)` | Comptroller owner |
| `supportMarket(address)` | the configured PoolRegistry only |

Ownership and ACM authorization are different mechanisms. Check both at the same block as the action being prepared.

The implementation also exposes immutable `poolRegistry`, inherited `maxLoopsLimit`, `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, `accessControlManager`, and owner-only `setAccessControlManager`.

## Read API

```solidity
getAccountLiquidity(address)
getBorrowingPower(address)
getHypotheticalAccountLiquidity(address,address,uint256,uint256)
getAllMarkets()
isMarketListed(address)
getAssetsIn(address)
checkMembership(address,address)
liquidateCalculateSeizeTokens(address,address,uint256)
getRewardsByMarket(address)
getRewardDistributors()
isComptroller()
actionPaused(address,Action)
```

`updatePrices(address)` refreshes oracle prices for the account's entered markets and is state-changing. A true `isMarketListed` value means the market is currently accepted by policy; it does not by itself mean that all actions are unpaused or that the product is open for new use.
