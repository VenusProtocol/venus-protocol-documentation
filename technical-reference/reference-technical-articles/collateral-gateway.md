# Collateral Gateway

The `CollateralGateway` contract turns an underlying balance into collateral in one call. It works on the BNB Chain Core pool, through a [Liquidity Hub](../reference-liquidity-hub/README.md) and its vh market (the Core market that lists the Hub's share token, such as vvhUSDT), and on [hub-funded spoke pools](../reference-isolated-pools/spoke/README.md). It also withdraws a Hub position back to the wallet in one call.

## Deployment scope

This page matches the [`CollateralGateway` source on `develop`](https://github.com/VenusProtocol/venus-periphery/blob/develop/contracts/CollateralGateway/CollateralGateway.sol). The gateway is deployed without a proxy, at [`0xd0F7B94BF06675D13e8bA9a2546835a1c32a80b8`](https://bscscan.com/address/0xd0F7B94BF06675D13e8bA9a2546835a1c32a80b8) on BNB Chain and [`0x1B6D1ff76beb57CF7C9B2e05BE16cb9529DCa2F9`](https://testnet.bscscan.com/address/0x1B6D1ff76beb57CF7C9B2e05BE16cb9529DCa2F9) on BNB Chain testnet.

The grants the gateway needs are AccessControlManager and Comptroller state, not bytecode: read them at the block an integration uses. On BNB Chain, [VIP-672](https://app.venus.io/#/governance/proposal/672?chainId=56) made the Core pool grants and [VIP-670](https://app.venus.io/#/governance/proposal/670?chainId=56) the spoke pool grant.

## Overview

A Liquidity Hub share token (for example vhUSDT) is listed as its own Core market (vvhUSDT), so a Hub position can also be used as Core collateral. Doing that by hand takes four transactions: approve the Hub, deposit, approve the market, supply. The market then still has to be entered as collateral.

The gateway does all of it in one call, and the market is entered as collateral in the same call. It also covers two cases a user cannot easily do alone:

* **Moving an existing Core position into the Hub.** If redeeming the old collateral leaves no shortfall, the gateway redeems it directly. If it would leave the account in shortfall, the gateway supplies the replacement collateral before the old collateral leaves, so a leveraged position moves in full.
* **Supplying collateral to a spoke pool.** In a spoke pool, entering a market as collateral is a separate transaction. The gateway supplies and enters in one call, across several markets and several pools.

The gateway is a single shared deployment per chain. It holds no funds between calls. The owner (the Normal Timelock on a live network) can only sweep tokens sent to the contract by mistake. The Core Comptroller and the [`SpokePoolRegistry`](../reference-isolated-pools/spoke/README.md#a-registry-of-its-own) are fixed at construction.

## User Journey

Before the first call, the user grants the gateway what that call needs:

| Function | What the user does first |
| --- | --- |
| `supplyFromWallet` | `asset.approve(gateway, assets)` |
| `supplyFromCollateral` | `comptroller.updateDelegate(gateway, true)` |
| `withdrawPosition` | `hub.approve(gateway, shares)` for shares in the wallet, and `comptroller.updateDelegate(gateway, true)` to have any shares come out of the vh market. Without the grant the vh market is left alone and only the wallet shares are paid out; with no wallet shares either, the call reverts `NothingReceived` |
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
  * `vhMarket` is entered as the user's collateral.
  * The underlying is deposited into the Hub, which mints Hub shares.
  * The shares are supplied to `vhMarket`, with the market tokens credited to the user.
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
| **Direct** | `vToken` is not entered as collateral, or removing it leaves no shortfall | enter `vhMarket`, redeem the old position, deposit into the Hub, supply to `vhMarket` |
| **Flash loan** | `vToken` is entered and removing it would leave a shortfall | enter `vhMarket`, borrow the position's value from Core, supply the replacement collateral first, then redeem the old position and repay the loan |

* The flash loan path needs the gateway to be allowlisted for Core flash loans, flash loans not paused system wide, and `vToken` flash-enabled. The flash loan premium is paid by the user: the loan is sized so the redeemed collateral covers principal plus premium, so the user's position moves in slightly smaller than it left.
* `minShares` means slightly different things on the two paths. The direct path deposits the redeem proceeds. The flash loan path deposits a lower bound on them and returns the difference to the user as underlying.

### Withdraw to the wallet (**withdrawPosition**)

```solidity
function withdrawPosition(address vhMarket, uint256 shares, uint256 minAssets) external returns (uint256 assets);
```

* A Hub position can sit in two places: Hub shares in the wallet, and market tokens in `vhMarket`.
* `withdrawPosition` takes one total share amount, and the execution proceeds as follows:
  * Shares in the wallet are used first. A withdraw the wallet covers alone never touches Core, so the user's borrow position is not affected.
  * The rest is freed out of `vhMarket` on the user's behalf, but only when the user holds market tokens there and has granted the delegate. Without either, the Core leg is skipped and the wallet leg alone pays out. When it does run, the Comptroller runs its usual liquidity check against the user, so a withdraw that would leave them in shortfall reverts.
  * All shares are redeemed from the Hub, and the underlying is sent to the user.
* The Core leg frees at most the market tokens the user holds. A market that charges a redeem fee frees fewer shares than asked, and the payout is smaller. A market without enough cash for the redeem reverts `VTokenRedeemFailed`.
* Holding market tokens is not on its own enough to run the Core leg, because `mintBehalf` is permissionless: anyone can mint a dust amount to another account, and that must not be able to force a Core redeem on a user who never granted the delegate.
* `shares = type(uint256).max` redeems the whole wallet balance, plus every `vhMarket` market token when the delegate grant is set. `minAssets` is the floor on the assets the Hub pays out, whichever legs ran.

### Supply to a spoke pool (**supplyAndEnterSpokeMarkets**, **enterSpokeMarkets**)

```solidity
function supplyAndEnterSpokeMarkets(address[] calldata vTokens, uint256[] calldata amounts) external;
function enterSpokeMarkets(address[] calldata vTokens) external;
```

* `supplyAndEnterSpokeMarkets` supplies each amount to the matching spoke market, credits the market tokens to the user, and enters every market as the user's collateral.
* `enterSpokeMarkets` only enters the markets, for a user who already holds the market tokens. Entering a market the user is already in does nothing and does not revert.
* Each market's Comptroller is read from the market itself, so one call can cover several spoke pools. Each market must be the one `SpokePoolRegistry` holds for its pool and underlying, and still listed.
* Every market is supplied and entered, or the whole call reverts.
* The amount supplied is measured from the balance that actually arrived, so a token with a transfer fee supplies only what arrived.

### Sweep tokens sent by mistake (**sweepToken**)

```solidity
function sweepToken(IERC20 token) external;
```

* Owner only. It sends the whole balance of `token` to the owner, and takes no recipient argument.
* No leg of the gateway leaves a balance behind, so this only recovers tokens sent to the contract by mistake. A zero balance reverts `ZeroAmount`.

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
* **Nothing is held between calls.** Market tokens go straight to the user, and each call either completes or reverts in full. On `supplyFromCollateral`, a call that ends with less of the underlying in the gateway than it started with reverts (`BalanceSpent`), so a hostile market or Hub cannot spend a stray balance awaiting a sweep.
* **Amounts are measured, not assumed.** Market tokens credited and shares freed from `vhMarket` are read as balance changes. Shares minted and assets paid out are the return values of `IHub.deposit` and `IHub.redeem`.
* **Markets are checked, not trusted.** Core markets must be listed on the fixed Core Comptroller, and spoke markets must match the `SpokePoolRegistry`.

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
| `MarketNotRegistered(vToken)` | the spoke market is not the one `SpokePoolRegistry` holds for its pool and underlying |
| `AssetMismatch(vTokenUnderlying, hubAsset)` | the source market's underlying is not the Hub's asset |
| `InsufficientShares(shares, minShares)` | the Hub deposit minted fewer shares than `minShares` |
| `InsufficientAssets(assets, minAssets)` | the withdraw paid out less than `minAssets` |
| `InsufficientReceipts(held, requested)` | the user holds fewer market tokens than they asked to move |
| `VTokenMintFailed(market, errorCode)` / `VTokenRedeemFailed(vToken, errorCode)` | a market returned a failure code |
| `EnterMarketFailed(vhMarket, errorCode)` | the Comptroller refused to enter `vhMarket` as collateral |
| `NothingMinted()` | a mint credited no market tokens |
| `NothingReceived()` | a redeem produced no underlying, or a withdraw freed nothing from either leg |
| `LiquidityCheckFailed(errorCode)` | the Comptroller could not price the user's position |
| `UnexpectedCallback()` | the flash loan callback did not match the move in progress, or the callback credited no market tokens |
| `BalanceSpent(balanceBefore, balanceAfter)` | the call ended with less underlying in the gateway than it started with |

## Further reading

* [Hub](../reference-liquidity-hub/hub.md) and [vhToken](../reference-liquidity-hub/vhtoken.md): what the Core functions deposit into and supply.
* [SpokeComptroller](../reference-isolated-pools/spoke/spoke-comptroller.md): the `enterMarketForAccount` the spoke functions depend on.
* [Source code](https://github.com/VenusProtocol/venus-periphery/tree/develop/contracts/CollateralGateway) in the `venus-periphery` repo.
