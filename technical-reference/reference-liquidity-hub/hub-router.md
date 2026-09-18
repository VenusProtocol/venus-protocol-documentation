# HubRouter

`HubRouter` turns an underlying balance into collateral in one call. It is periphery: permissionless, immutable, with no proxy and no admin, and it holds no funds and no authority between calls.

It serves two different pools, and the reason it exists is different in each:

* **Core pool** — deposit into a [Hub](hub.md) and land the resulting [vhToken](vhtoken.md) in that Hub's Core market, either from a wallet balance or by migrating an existing Core position. This is a convenience: it collapses `approve → deposit → approve → mint` into one transaction, and in the migration case it does something a user cannot do by hand at all.
* **Spoke pool** — supply collateral and enable it as collateral in the same call. This one is not just convenience; without it the flow is impossible to batch, for the reason below.

> **Not deployed.** The contract is written and tested but has no deployment script yet, and its spoke paths additionally need a governance grant that no VIP has made. Nothing on this page is live.

## Why the spoke half needs a contract change

`Comptroller.enterMarkets` reads `msg.sender`. A router that supplies through `VToken.mintBehalf` credits the receipts to the user but enters *itself* into the market, which leaves the user supplied and not collateralised. No router, VToken hook or `Multicall` batch can close that gap, because every one of them is still the `msg.sender` the Comptroller sees.

[`SpokeComptroller.enterMarketBehalf`](../reference-isolated-pools/spoke/spoke-comptroller.md#entermarketbehalf) takes the account as an argument instead. It is gated by the [AccessControlManager](../reference-governance/access-control-manager.md), and this router is the intended holder of the role.

**Both spoke functions revert until the listing VIP grants this router `enterMarketBehalf(address,address)` on each spoke pool's Comptroller.** Until then users supply and enter in two transactions of their own, which still works — `enterMarkets` is untouched and stays permissionless.

The Core pool has an `enterMarketBehalf` of its own, but it is gated on delegate approval rather than ACM, so using it would cost the user an `updateDelegate` transaction and grant the router borrow- and redeem-on-behalf rights it does not need. The Core paths therefore **do not** auto-enter: receipts from `supplyFromWallet` earn Hub yield immediately but are not collateral until the caller runs `enterMarkets` themselves.

## Core: `supplyFromWallet`

```solidity
function supplyFromWallet(address hub, uint256 assets, address vhMarket, uint256 minShares)
    external returns (uint256 shares);
```

Pulls `assets` of `IHub(hub).asset()` from the caller, deposits into the Hub, and supplies the minted shares to `vhMarket` with the receipts credited to the caller. `minShares` is the slippage guard on the deposit leg.

`vhMarket.underlying()` must equal `hub` — a Hub share token is exactly what its Core market wraps, so the pair is validated against each other rather than trusted. A full supply cap reverts inside the Comptroller, so a capped market fails the whole call and the caller keeps their underlying.

## Core: `supplyFromCollateral`

```solidity
function supplyFromCollateral(
    address vToken,
    uint256 vTokenAmount,
    address hub,
    address vhMarket,
    uint256 minShares
) external returns (uint256 shares);
```

Migrates an existing Core position into the Hub: redeem `vTokenAmount`, deposit the underlying, supply the shares. `vToken.underlying()` must equal the Hub's asset.

Which route it takes is decided by `getHypotheticalAccountLiquidity`, the same question the redeem itself will ask:

| | Condition | What happens |
| --- | --- | --- |
| Direct | removing the collateral leaves no shortfall | redeem, deposit, supply |
| Flash-loan | it would leave the caller under water | borrow the position's worth from Core, supply the replacement collateral **first**, then redeem the old one and repay |

The flash-loan route is what lets a **leveraged** position migrate in full rather than in slices — the replacement collateral exists before the old collateral leaves, so borrow power never dips. It additionally requires the caller to have already entered `vhMarket` (`MarketNotEntered`) and this router to be allow-listed for Core flash loans.

The two routes deposit slightly different amounts, so **`minShares` is not directly comparable between them**. The direct route deposits the redeem proceeds. The flash route deposits the position's value at the market's last accrual net of any redeem fee, which is a floor on those proceeds; the difference is returned to the caller as underlying rather than migrated.

## Spoke: `supplyAndEnterSpokeMarkets` and `enterSpokeMarkets`

```solidity
function supplyAndEnterSpokeMarkets(address[] calldata vTokens, uint256[] calldata amounts) external;
function enterSpokeMarkets(address[] calldata vTokens) external;
```

The first supplies each amount into the matching market and enables every one of them as the caller's collateral. The second is for a caller who already holds the receipts and only needs the membership; entering a market the caller is already in changes nothing rather than reverting.

Both take lists and read each market's Comptroller **from the market itself**, so a single call may span several spoke pools. Every market is supplied and entered or the whole call reverts.

The supplied amount is measured as a balance delta rather than taken from the argument. The router is a hop the market does not know about, so a fee-on-transfer collateral arrives short and only what actually landed is supplied.

## Safety model

* **The router never names anyone but its caller.** Every `mintBehalf` and `enterMarketBehalf` is passed `msg.sender`, so holding the ACM role does not let it enter a market for a third party. This is the property that makes the grant safe to make, and it is what a reviewer should check first.
* **Nothing is held between calls.** Receipts go straight to the user through `mintBehalf` rather than sitting in the router, and each call is atomic — if any leg fails the whole thing reverts and the caller keeps their underlying.
* **Amounts are read back, never assumed.** `mintBehalf` and `redeem` report only an error code, so shares minted and receipts credited are both measured as balance deltas.
* **The flash-loan callback is gated on a migration being in flight** and validates the caller, the initiator, and the markets and amounts against what the router recorded before the external call. It is deliberately not `nonReentrant`: `supplyFromCollateral` already holds that guard when the Comptroller calls back.

## Events

| Event | Emitted when |
| --- | --- |
| `SuppliedFromWallet(address indexed user, address indexed hub, address indexed vhMarket, uint256 assets, uint256 shares, uint256 vTokens)` | a wallet balance is deposited and supplied |
| `SuppliedFromCollateral(address indexed user, address indexed vToken, address indexed hub, address vhMarket, uint256 vTokenAmount, uint256 shares, uint256 vTokens)` | a Core position is migrated into the Hub |
| `SuppliedToSpoke(address indexed user, address indexed vToken, uint256 assets, uint256 vTokens)` | a spoke market is supplied and entered |

## Errors

| Error | Meaning |
| --- | --- |
| `ZeroAddress()` / `ZeroAmount()` | a required address or amount was zero |
| `InvalidArrayLength()` | an empty list, or `vTokens` and `amounts` of different lengths |
| `MarketMismatch(address marketUnderlying, address hub)` | `vhMarket` does not wrap the given Hub |
| `AssetMismatch(address vTokenUnderlying, address hubAsset)` | the source market's underlying is not the Hub's asset |
| `InsufficientShares(uint256 shares, uint256 minShares)` | the deposit yielded fewer shares than `minShares` |
| `VTokenMintFailed(address vhMarket, uint256 errorCode)` | the Core market returned a failure code on mint |
| `VTokenRedeemFailed(address vToken, uint256 errorCode)` | the Core market returned a failure code on redeem |
| `NothingMinted()` / `NothingReceived()` | a leg completed but credited nothing |
| `MarketNotEntered(address vhMarket)` | the flash-loan migration route needs the caller already in `vhMarket` |
| `LiquidityCheckFailed(uint256 errorCode)` | the Comptroller could not answer the hypothetical-liquidity question |
| `UnexpectedCallback()` | the flash-loan callback did not match the migration in flight |

## Further reading

* [Hub](hub.md) and [vhToken](vhtoken.md) — what the Core paths deposit into and supply.
* [SpokeComptroller](../reference-isolated-pools/spoke/spoke-comptroller.md#entering-a-market-for-a-supplier) — the `enterMarketBehalf` the spoke paths depend on.
* [Hub-Funded Spoke Pools](../reference-isolated-pools/spoke/README.md) — the pool shape the spoke paths serve.
