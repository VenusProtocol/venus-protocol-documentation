# Hub-Funded Spoke Pools

A **spoke pool** is an isolated pool whose Comptroller is `SpokeComptroller` instead of the shared [`Comptroller`](../comptroller/comptroller.md). Everything else is unchanged: the same [`PoolRegistry`](../pool-registry/pool-registry.md), the same [`VToken`](../vtoken/vtoken.md) markets behind the same `VTokenBeacon`, the same [`RewardsDistributor`](../rewards/rewards-distributor.md), the same [Shortfall](../risk-fund-and-shortfall/shortfall.md) and [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md) plumbing.

What the fork adds is policy that only makes sense for a pool the protocol funds itself:

* a **per-market supply allowlist**, so the liquidity side of the pool is supplied only by the [Liquidity Hub](../../reference-liquidity-hub/README.md) (or whichever accounts governance names),
* an optional **pool-wide liquidation allowlist**,
* a **per-market liquidation incentive**, keyed on the collateral being seized rather than one value for the whole pool,
* **deviation-bounded collateral pricing** on the borrow-power path, using the [`DeviationBoundedOracle`](../../reference-oracle/deviation-bounded-oracle.md).

For the product-level introduction — why the pool is shaped this way, and the retail / bulk scenarios it serves — see [Hub-Funded Spoke Pools](../../../whats-new/hub-funded-spoke-pools.md) under *What's New*.

> **Not deployed.** At the time of writing `SpokeComptroller` is not deployed on any network and no spoke pool has been listed. There are no addresses to publish, and no VIP has wired the Liquidity Hub to a spoke market.

## The two sides of a spoke pool

A spoke pool separates the asset that gets borrowed from the assets that back the borrow. Both are ordinary markets in the same pool; the split is entirely a matter of configuration.

| | **Liquidity side** | **Collateral side** |
| --- | --- | --- |
| Example asset | USDT, USDC, U | tokenized stock (bStock), trending or exotic assets |
| Who may supply | allowlisted accounts only — the Hub's Spoke YieldGroup | anyone (an allowlist is available but off by default) |
| Collateral factor | `0` — not usable as collateral | non-zero |
| Borrowable | yes | no (borrow cap `0`) |
| Interest rate model | its own IRM per market | not applicable |
| Caps | own supply cap and borrow cap | own supply cap |
| Liquidation incentive | never read (never seized) | its own, per market |

Nothing in the contract labels a market as one side or the other. A market is on the liquidity side because its supply allowlist is enabled and its collateral factor is zero; it is on the collateral side because its borrow cap is zero and its collateral factor is not. Both are governance settings, and a market can carry a mix.

Because each pool has its own Comptroller, a spoke pool is isolated from the Core pool and from every other isolated pool: no shared collateral, no cross-margin, and no path by which bad debt in a spoke pool reaches the Core pool. A borrower's health factor is shared across all of their collateral and all of their debt **within one spoke pool**, exactly as in any other isolated pool.

## Why a fork rather than a change to `Comptroller`

`contracts/Comptroller.sol` is the implementation every isolated pool in the repo shares, on BNB Chain and on every other chain isolated pools are deployed to. Adding allowlist code there would ship it to every core-pool-adjacent market at its next beacon upgrade. Inheritance is not an option either — no function in `Comptroller` is `virtual`, so the hooks cannot be overridden.

`SpokeComptroller` is therefore a hand-maintained fork behind **its own beacon**. Existing pools and chains are untouched, and the two implementations drift independently: a change to `Comptroller` has to be reviewed and re-applied by hand. `diff contracts/Comptroller.sol contracts/Spoke/SpokeComptroller.sol` is the canonical statement of what the fork currently changes.

**Prime is dropped.** Prime is a Core-pool rewards program and a hub-funded pool has no Prime users, so the fork removes the `prime` storage variable and `setPrimeToken`, and reduces the seven `*Verify` post-action hooks to no-ops. They cannot be deleted — `ComptrollerInterface` declares all seven and the `VToken` calls each of them with a plain external call — but they now do nothing. This also buys bytecode headroom: the shared `Comptroller` sits roughly 700 bytes under the 24,576-byte EIP-170 limit, and the allowlists had to fit somewhere.

## Contracts

* [**SpokeComptroller**](spoke-comptroller.md) — the fork: what it adds on top of `Comptroller`, the new setters and getters, the liquidation routing math, and the bounded-pricing path.
* [**SpokeComptrollerStorage**](spoke-comptroller-storage.md) — the storage layout, including where it deliberately diverges from `ComptrollerStorage`.

## Deployment shape

A spoke pool is created the same way as any other isolated pool, with one difference in the Comptroller it points at. The deploy script does three things:

1. Deploys `SpokeComptrollerImpl` with the `PoolRegistry` address as a constructor argument. It is an immutable, so a wrong value can only be fixed by redeploying the implementation and re-pointing the beacon.
2. Deploys `SpokeComptrollerBeacon` pointing at that implementation. It is **separate from the shared `ComptrollerBeacon`**, so upgrading one family never touches the other.
3. Deploys and initializes a `BeaconProxy` against it, transfers the beacon to the Normal Timelock, and *nominates* the Timelock as the Comptroller's owner. The Comptroller is `Ownable2Step`, so the deployer stays the live owner until the listing VIP accepts.

Everything else is governance action, and the order matters:

1. `acceptOwnership()` on the Comptroller — it has to come first, before any owner-gated setter.
2. `setPriceOracle` and `setDeviationBoundedOracle`. The bounded oracle is dereferenced without a zero check, so borrowing and redeeming fail closed until it is set — see [Bounded collateral pricing](spoke-comptroller.md#bounded-collateral-pricing).
3. `PoolRegistry.addPool`, which requires a non-zero oracle and is also what sets the pool-wide liquidation incentive for the first time.
4. `PoolRegistry.addMarket` per market, then the per-market configuration: caps, collateral factor, liquidation threshold, IRM, liquidation incentive, and the allowlists.

Every policy setter is gated by the [AccessControlManager](../../reference-governance/access-control-manager.md), so the roles have to be granted in the same VIP.

## Integration notes

* **Reading the pool.** `SpokeComptrollerViewInterface` collects the getters an integrator needs — the two allowlists, the effective liquidation incentive, the bounded oracle, plus `supplyCaps` and `actionPaused` repeated so that consuming a spoke pool takes one import rather than three. `actionPaused` is declared there with a `uint8` action so a consumer does not have to import this repo's `Action` enum; the encoding is identical.
* **Reading events and errors.** `SpokeComptrollerInterface` declares the full observable surface. Where an error means the same thing as in the shared `Comptroller`, it keeps the same name, arguments and selector; where the meaning changed, it was given a new name deliberately so the two do not collide. See [Errors](spoke-comptroller.md#errors).
* **The Liquidity Hub** supplies the liquidity side through `AdapterSpokeV1` and the Spoke YieldGroup — see [Adapters](../../reference-liquidity-hub/adapters.md#adapterspokev1).
* **Liquidating tokenized-stock collateral** in a spoke pool is covered by [`BStockLiquidator`](../../reference-core-pool/bstock-liquidator.md), which serves both the Core pool and allowlisted spoke pools from the same entry points.
