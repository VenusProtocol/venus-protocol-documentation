# Collateral Gateway

The `CollateralGateway` contract turns an underlying balance into collateral in one call. It works on the BNB Chain Core pool, through a [Liquidity Hub](../reference-liquidity-hub/README.md) and its vh market, and on [hub-funded spoke pools](../reference-isolated-pools/spoke/README.md). It also withdraws a Hub position back to the wallet in one call.

{% hint style="info" %}
**Not deployed yet.** The contract is written, reviewed and tested, but it has no deployment on any network, and the governance grants it needs have not been made. Nothing on this page is live.
{% endhint %}

## Overview

A Liquidity Hub share token (for example vhUSDT) is listed as its own Core market (vvhUSDT), so a Hub position can also be used as Core collateral. Doing that by hand takes four transactions: approve the Hub, deposit, approve the market, supply. The market then still has to be entered as collateral.

The gateway does all of it in one call, and the market is entered as collateral in the same call. It also covers two cases a user cannot easily do alone:

* **Moving an existing Core position into the Hub.** A position with borrows against it cannot simply be redeemed, because removing the collateral first would leave the account in shortfall. The gateway supplies the replacement collateral before the old collateral leaves, so a leveraged position moves in full.
* **Supplying collateral to a spoke pool.** In a spoke pool, entering a market as collateral is a separate transaction. The gateway supplies and enters in one call, across several markets and several pools.

The gateway is a single shared deployment per chain, with no proxy. It holds no funds between calls. The owner (the Normal Timelock on a live network) can only sweep tokens sent to the contract by mistake. The Core Comptroller and the Isolated Pools `PoolRegistry` are fixed at construction.

## User Journey

Before the first call, the user grants the gateway what that call needs:

| Function | What the user does first |
| --- | --- |
| `supplyFromWallet` | `asset.approve(gateway, assets)` |
| `supplyFromCollateral` | `comptroller.updateDelegate(gateway, true)` |
| `withdrawPosition` | `hub.approve(gateway, shares)` for shares in the wallet, and `comptroller.updateDelegate(gateway, true)` if some shares have to come out of the vh market |
| `supplyAndEnterSpokeMarkets` | `underlying.approve(gateway, amount)` for each market |

{% hint style="warning" %}
The delegate grant covers the whole Core pool. It lets the gateway redeem and borrow against every Core position the user holds, not only the markets named in the call. The gateway only ever acts for its own caller, but the grant stays after the call. The user removes it with `comptroller.updateDelegate(gateway, false)`.
{% endhint %}

## Interaction with the CollateralGateway contract

### Supply from the wallet (**supplyFromWallet**)

```solidity
function supplyFromWallet(uint256 assets, address vhMarket, uint256 minShares) external returns (uint256 shares);
```

* The user approves the gateway for `assets` of the Hub's underlying.
* `supplyFromWallet` is called, and the execution proceeds as follows:
  * The Hub is read from `vhMarket.underlying()`, and `vhMarket` must be listed on the Core Comptroller.
  * The underlying is deposited into the Hub, which mints Hub shares.
  * The shares are supplied to `vhMarket`, with the market tokens credited to the user.
  * `vhMarket` is entered as the user's collateral.
* `minShares` is the slippage guard on the Hub deposit. A full supply cap on `vhMarket` reverts the whole call, and the user keeps their underlying.

### Move a Core position into the Hub (**supplyFromCollateral**)

```solidity
function supplyFromCollateral(address vToken, uint256 vTokenAmount, address vhMarket, uint256 minShares)
    external returns (uint256 shares);
```

* The user grants the gateway delegate rights with `updateDelegate`.
* `supplyFromCollateral` is called with the Core market to move out of (`vToken`), the amount of market tokens to move, and the vh market to move into. `vTokenAmount = type(uint256).max` moves the whole balance.
* `vToken.underlying()` must be the Hub's asset, and both markets must be listed on the Core Comptroller.
* The gateway picks one of two paths:

| Path | When | What happens |
| --- | --- | --- |
| **Direct** | `vToken` is not entered as collateral, or removing it leaves no shortfall | redeem the old position, deposit into the Hub, supply to `vhMarket`, enter it |
| **Flash loan** | `vToken` is entered and removing it would leave a shortfall | borrow the position's value from Core, supply the replacement collateral first, then redeem the old position and repay the loan |

* The flash loan path needs the gateway to be allow-listed for Core flash loans.
* `minShares` means slightly different things on the two paths. The direct path deposits the redeem proceeds. The flash loan path deposits a lower bound on them and returns the difference to the user as underlying.

### Withdraw to the wallet (**withdrawPosition**)

```solidity
function withdrawPosition(address vhMarket, uint256 shares, uint256 minAssets) external returns (uint256 assets);
```

* A Hub position can sit in two places: Hub shares in the wallet, and market tokens in `vhMarket`.
* `withdrawPosition` takes one total share amount, and the execution proceeds as follows:
  * Shares in the wallet are used first. A withdraw the wallet covers alone never touches Core, so the user's borrow position is not affected.
  * The rest is freed out of `vhMarket` on the user's behalf. The Comptroller runs its usual liquidity check against the user, so a withdraw that would leave them in shortfall reverts.
  * All shares are redeemed from the Hub, and the underlying is sent to the user.
* `shares = type(uint256).max` withdraws the whole position. `minAssets` is the slippage guard on the payout.

### Supply to a spoke pool (**supplyAndEnterSpokeMarkets**, **enterSpokeMarkets**)

```solidity
function supplyAndEnterSpokeMarkets(address[] calldata vTokens, uint256[] calldata amounts) external;
function enterSpokeMarkets(address[] calldata vTokens) external;
```

* `supplyAndEnterSpokeMarkets` supplies each amount to the matching spoke market, credits the market tokens to the user, and enters every market as the user's collateral.
* `enterSpokeMarkets` only enters the markets, for a user who already holds the market tokens. Entering a market the user is already in does nothing and does not revert.
* Each market's Comptroller is read from the market itself, so one call can cover several spoke pools. Each market must be the one `PoolRegistry` holds for its pool and underlying, and still listed.
* Every market is supplied and entered, or the whole call reverts.
* The amount supplied is measured from the balance that actually arrived, so a token with a transfer fee supplies only what arrived.

## Governance setup

Each function reverts until the grant it needs has been made.

| Needed for | Action | Target |
| --- | --- | --- |
| every Core supply | the `MarketFacet` with `enterMarketForAccount(address,address)` is added to the Core Comptroller | Core Comptroller |
| every Core supply | `giveCallPermission(comptroller, "enterMarketForAccount(address,address)", gateway)` | AccessControlManager |
| `supplyFromCollateral`, flash loan path | `setWhiteListFlashLoanAccount(gateway, true)` | Core Comptroller |
| spoke functions, once per spoke pool | `giveCallPermission(spokeComptroller, "enterMarketForAccount(address,address)", gateway)` | AccessControlManager |

## Safety model

* **The gateway only acts for its caller.** Every `mintBehalf` and `enterMarketForAccount` is passed `msg.sender`. Holding the `enterMarketForAccount` role does not let the gateway enter a market for anyone else.
* **Nothing is held between calls.** Market tokens go straight to the user, and each call either completes or reverts in full. A call that ends with less of the underlying in the gateway than it started with reverts (`BalanceSpent`).
* **Amounts are measured, not assumed.** Shares minted and market tokens credited are read as balance changes.
* **Markets are checked, not trusted.** Core markets must be listed on the fixed Core Comptroller, and spoke markets must match `PoolRegistry`.

## Events

| Event | Emitted when |
| --- | --- |
| `SuppliedFromWallet(user, hub, vhMarket, assets, shares, vTokens)` | a wallet balance is deposited and supplied |
| `SuppliedFromCollateral(user, vToken, hub, vhMarket, vTokenAmount, shares, vTokens)` | a Core position is moved into the Hub |
| `PositionWithdrawn(user, hub, vhMarket, walletShares, freedShares, assets)` | a Hub position is withdrawn to the wallet |
| `SuppliedToSpoke(user, vToken, assets, vTokens)` | a spoke market is supplied and entered |
| `TokenSwept(token, recipient, amount)` | the owner sweeps tokens sent to the contract by mistake |

## Errors

| Error | Meaning |
| --- | --- |
| `ZeroAddress()` / `ZeroAmount()` | a required address or amount was zero |
| `InvalidArrayLength()` | an empty market list, or `vTokens` and `amounts` of different lengths |
| `MarketNotListed(market)` | the market is not listed on its Comptroller |
| `MarketNotRegistered(vToken)` | the spoke market is not the one `PoolRegistry` holds for its pool and underlying |
| `AssetMismatch(vTokenUnderlying, hubAsset)` | the source market's underlying is not the Hub's asset |
| `InsufficientShares(shares, minShares)` | the Hub deposit minted fewer shares than `minShares` |
| `InsufficientAssets(assets, minAssets)` | the withdraw paid out less than `minAssets` |
| `InsufficientReceipts(held, requested)` | the user holds fewer market tokens than they asked to move |
| `VTokenMintFailed(market, errorCode)` / `VTokenRedeemFailed(vToken, errorCode)` | a market returned a failure code |
| `EnterMarketFailed(vhMarket, errorCode)` | the Comptroller refused to enter `vhMarket` as collateral |
| `NothingMinted()` / `NothingReceived()` | a step completed but credited nothing |
| `LiquidityCheckFailed(errorCode)` | the Comptroller could not price the user's position |
| `UnexpectedCallback()` | the flash loan callback did not match the move in progress |
| `BalanceSpent(balanceBefore, balanceAfter)` | the call ended with less underlying in the gateway than it started with |

## Further reading

* [Hub](../reference-liquidity-hub/hub.md) and [vhToken](../reference-liquidity-hub/vhtoken.md): what the Core functions deposit into and supply.
* [SpokeComptroller](../reference-isolated-pools/spoke/spoke-comptroller.md): the `enterMarketForAccount` the spoke functions depend on.
* [Source code](https://github.com/VenusProtocol/venus-periphery/tree/feat/VPD-1982/contracts/CollateralGateway) in the `venus-periphery` repo.
