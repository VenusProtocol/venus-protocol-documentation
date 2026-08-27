# vhToken

## What is a vhToken

`vhToken` is the shorthand for the ERC-4626 share token a Liquidity Hub issues. It is not a contract name. Each Hub issues its own, named `Venus Hub <asset>` with symbol `vh<asset>`:

| Deposit into | You receive |
| ------------ | ----------- |
| USDT Hub | `vhUSDT` |
| USDC Hub | `vhUSDC` |
| U Hub | `vhU` |

**The share token is the Hub.** The `Hub` contract inherits `ERC4626Upgradeable`, so it is itself the ERC-20. There is no separate token contract to look up: the `vhUSDT` address and the USDT Hub address are the same address. Resolve it from `HubRegistry.hubForAsset(asset)` rather than hard-coding.

A vhToken is a claim on a share of the Hub's whole portfolio, not on any one yield source. The capital behind it sits wherever the Hub's policy and queues placed it. At launch on BNB Chain that means Core and Flux only: an FRV Source is registered on every Hub with its caps set, but no Fixed-Rate Vault exists for USDT, USDC or U yet, so no capital routes there until a follow-up proposal wires one.

On BSC testnet the USDT Hub's share token is still named `Vault Share` / `vSHARE`, a placeholder that predates the `vh<asset>` convention. See [Deployed Contracts](../../deployed-contracts/liquidity-hub.md).

## Rate

One vhToken is redeemable for a growing amount of the underlying asset. Yield arrives as a **rising exchange rate**, never as a rebase: the balance in a wallet never changes on its own, its redemption value does.

The rate is `totalAssets() / totalSupply()`, and `totalAssets()` is the sum of every Source's holdings plus the Hub's idle balance. Read it through the standard ERC-4626 views:

* `convertToAssets(shares)` — what a share amount is currently worth in underlying.
* `convertToShares(assets)` — how many shares an asset amount currently buys.
* `previewRedeem` / `previewWithdraw` — same, but net of the redeem (exit) fee.

`convertToAssets` and `convertToShares` are pure share math. They reflect no caps, no liquidity, no pause state and no fees, so a value they return is not a promise that the corresponding deposit or withdrawal will succeed.

Each Hub launched with a `decimalsOffset` of 6, the standard ERC-4626 inflation defence. The three mainnet assets are 18-decimal, so their vhTokens carry **24 decimals**, and the raw share-to-asset ratio is not 1:1. Always convert through the views instead of assuming a ratio. Each Hub was also seeded with a bootstrap deposit whose shares were minted to the burn address, so `totalSupply` is never zero.

Every deposit, withdrawal and reallocation accrues fees before pricing, so the rate a caller transacts at is current. All three fees (management, performance and redeem) launched at `0`.

## What you can do with a vhToken

### Redeem it

`redeem(shares, receiver, owner)` burns an exact share amount and returns the underlying. `withdraw(assets, receiver, owner)` does the reverse: it names the asset amount and burns whatever shares that costs. Both are permissionless and atomic — they complete in full or revert.

Size the call against `maxRedeem(owner)` or `maxWithdraw(owner)`. Those views are overridden to account for the owner's balance, the Hub's aggregate liquidity, the per-transaction withdrawal cap (10,000,000 asset units at launch) and the redeem fee.

An oversized request does not fail with a Hub error. Because `maxWithdraw` is already clamped, it trips the inherited OpenZeppelin guard first and reverts with the string `"ERC4626: withdraw more than max"`, not `HubWithdrawCapExceeded` or `HubInsufficientLiquidity`. Those two named errors stay reachable on the routing path, so do not key error handling on them alone. All four `max*` views return `0` while the Hub is paused.

### Transfer it

A vhToken is a plain ERC-20: `transfer`, `transferFrom` and `approve` behave normally, and the recipient can redeem it. Value follows the token, so transferring shares transfers the position and the yield it is still earning.

### Supply it to the Core pool as collateral

Each mainnet vhToken has a deployed Venus Core pool market. Once the listing VIP executes, a holder can supply it, use it as collateral, and borrow other assets against it while the shares keep earning Hub yield underneath.

| vhToken | Core market | Collateral factor | Liquidation threshold |
| ------- | ----------- | ----------------- | --------------------- |
| `vhUSDT` | `vvhUSDT` | 80% | 80% |
| `vhUSDC` | `vvhUSDC` | 82.5% | 82.5% |
| `vhU` | `vvhU` | 75% | 75% |

The collateral factor equals the liquidation threshold on all three markets. A position opened at the maximum LTV therefore sits on the liquidation boundary, so borrowers should leave a safety buffer.

All three launch with a liquidation incentive of 10%, a reserve factor of 10%, a supply cap of 10,000,000 and a **borrow cap of `0`** — the vhToken itself is never borrowable. The market exists to let the shares back a loan, not to create a market in the shares.

The Core pool does not value this collateral at the Hub's uncapped redemption rate. Its price source is a [capped oracle](../reference-technical-articles/capped-oracles.md) that multiplies the underlying asset's Resilient Oracle price by a capped `convertToAssets(1 share)` rate. At launch the maximum rate grows at 5% per year, with a 30-day snapshot interval and a 41-basis-point snapshot gap. If the Hub's raw exchange rate outruns that allowance, the collateral price can temporarily trail the value redeemable from the Hub.

Each market also opts into [Protection Mode](../../risk/protection-mode.md), configured with a 5% deviation trigger, a 2% reset threshold and a one-hour cooldown. When protection is active it can reduce the price used for new borrow-capacity checks; liquidation eligibility and seize amounts continue to use the Resilient Oracle spot price.

**Mainnet status:** the market and capped-oracle contracts are deployed, but [VIP-664](https://github.com/VenusProtocol/vips/pull/754) has not executed. Until it does, the three mainnet vhTokens have no Core pool collateral value. On BSC testnet, the equivalent `vSHARE` / `vvSHARE` market is already live following [proposal 713](https://venus-testnet.vercel.app/#/governance/proposal/713?chainId=97).

The Migrator runs the other direction: `migrateFromCore` / `migrateFromCoreBNB` convert an existing Venus Core supply position into Hub shares in one transaction. It is stateless, permissionless and non-upgradeable, deployed at `0xfe6b8BEf1215C19Cd247FbF495ef560932F1Eb9B`.

### Mint it directly

`mint(shares, receiver)` mints an exact share amount, pulling whatever assets that costs, as the counterpart to `deposit(assets, receiver)`.

`depositWithConsent` and `mintWithConsent` take an extra `bytes32 consentHash` and emit `ConsentRecorded` alongside the deposit, so an integrator can prove a supplier acknowledged a specific set of terms. Passing `bytes32(0)` skips the emit and behaves exactly like the plain `deposit` / `mint`. The hash is event-only: nothing is stored and there is no getter, so proving acknowledgement means querying the log.

## Related

* [Hub](hub.md) — the contract that issues and prices the share token.
* [Liquidity Hub](../../whats-new/liquidity-hub.md) — the user-facing introduction.
* [Deployed Contracts](../../deployed-contracts/liquidity-hub.md) — addresses on both networks.
* [Core pool markets](../../deployed-contracts/markets.md#core-pool) and [oracles](../../deployed-contracts/oracles.md#bnb-chain-mainnet) — collateral-market and price-source addresses.
