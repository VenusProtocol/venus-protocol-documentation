# Hub-Funded Spoke Pools

A **spoke pool** is an isolated pool whose Comptroller is `SpokeComptroller` instead of the shared [`Comptroller`](../comptroller/comptroller.md), listed in a [`PoolRegistry`](../pool-registry/pool-registry.md) instance of its own. The rest of the machinery is unchanged: the same [`VToken`](../vtoken/vtoken.md) markets behind the same `VTokenBeacon`, the same [`RewardsDistributor`](../rewards/rewards-distributor.md), the same [Shortfall](../risk-fund-and-shortfall/shortfall.md) and [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md) plumbing.

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

## A registry of its own

A spoke pool is **not** registered in the isolated-pools [`PoolRegistry`](../pool-registry/pool-registry.md). It gets a second, dedicated instance of the same contract, deployed under the name `SpokePoolRegistry`.

The registry is the directory every consumer reads to answer which pools exist: `getAllPools` drives the indexer, the frontend pool list and the risk tooling, and `getVTokenForAsset` is what [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md) uses as a membership check. Putting a pool whose supply, borrow and liquidation sides are all restricted to known accounts into that directory would hand it to every one of those consumers, each of which would then need a special case keyed on its address. A separate registry gives them the separation for free.

It also separates permissions. An [AccessControlManager](../../reference-governance/access-control-manager.md) role is `keccak256(contractAddress, roleString)`, so a grant on one registry cannot reach the other's pools, and the two products stay independently upgradeable.

> **ProtocolShareReserve holds a single `poolRegistry` address.** It rejects any non-core pool whose vToken that one registry does not know, so pointing it at the spoke registry would break `reduceReserves` and every liquidation in the existing isolated pools, while leaving it where it is starves the spoke pool of income routing. Multi-registry support ships from the `protocol-reserve` repo and has to be live before the spoke registry is wired in. This is a hard prerequisite for listing, not a follow-up.

## Deployment shape

Two deploy scripts run, in order.

**`SpokePoolRegistry`** deploys a `PoolRegistry` behind the chain's existing `DefaultProxyAdmin`, initializes it with the AccessControlManager, and *nominates* the Normal Timelock as owner. It is `Ownable2Step`, so the deployer stays the live owner until the VIP accepts. The script refuses to hand over a registry that is not empty or whose ACM address does not read back as expected.

**`SpokeComptroller`** then:

1. Deploys `SpokeComptrollerImpl` with that registry's address as a constructor argument. It is an immutable, so a wrong value can only be fixed by redeploying the implementation and re-pointing the beacon; the script asserts it did not resolve to the isolated-pools registry.
2. Deploys `SpokeComptrollerBeacon` pointing at that implementation. It is **separate from the shared `ComptrollerBeacon`**, so upgrading one family never touches the other.
3. Deploys and initializes a `BeaconProxy` against it, transfers the beacon to the Normal Timelock, and nominates the Timelock as the Comptroller's owner.

Everything else is governance action, and the order matters:

1. `acceptOwnership()` on both the registry and the Comptroller — before any owner-gated setter.
2. `setPriceOracle` and `setDeviationBoundedOracle` on the Comptroller. The bounded oracle is dereferenced without a zero check, so borrowing and redeeming fail closed until it is set — see [Bounded collateral pricing](spoke-comptroller.md#bounded-collateral-pricing).
3. `SpokePoolRegistry.addPool`, which requires a non-zero oracle and is also what sets the pool-wide liquidation incentive for the first time.
4. `SpokePoolRegistry.addMarket` per market, then the per-market configuration: caps, collateral factor, liquidation threshold, IRM, liquidation incentive, and the allowlists.

### Roles the VIP has to grant

None of the isolated pools' existing grants carry over, because each names the isolated-pools registry as the account.

| On | Role string | Granted to |
| --- | --- | --- |
| `SpokePoolRegistry` | `addPool(string,address,uint256,uint256,uint256)` | governance |
| `SpokePoolRegistry` | `addMarket(AddMarketInput)` | governance |
| `SpokePoolRegistry` | `setPoolName(address,string)` | governance |
| `SpokePoolRegistry` | `updatePoolMetadata(address,VenusPoolMetaData)` | governance |
| `SpokeComptroller` | `setCloseFactor(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setLiquidationIncentive(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMinLiquidatableCollateral(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setCollateralFactor(address,uint256,uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMarketSupplyCaps(address[],uint256[])` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMarketBorrowCaps(address[],uint256[])` | `SpokePoolRegistry` |

The bottom six are the setters `addPool` and `addMarket` drive with the registry as the caller; without them `addPool` reverts at execution. The pool's own policy setters (the allowlists, the per-market incentive) and `enterMarketBehalf` are separate grants on top of these — see [SpokeComptroller](spoke-comptroller.md#solidity-api).

## Integration notes

* **Reading the pool through the lens.** [`PoolLens`](../lens/pool-lens.md) reports the spoke-only state alongside everything else, so a consumer does not need a separate code path. `PoolData` gains `deviationBoundedOracle` and `liquidationAllowlistEnabled`; `VTokenMetadata` gains `supplyAllowlistEnabled` and a `liquidationIncentiveMantissa` that is **per market**. Each is read with a `staticcall`, so an ordinary isolated pool reports absence (`address(0)` / `false`) rather than reverting the whole read, and the per-market incentive falls back to the pool-wide value there. The fields are appended rather than reordered, so a decoder built against the older shape still reads the fields it knows. `PoolData.minLiquidatableCollateral` remains pool-wide; the per-market discount is the one on `VTokenMetadata`.
* **Reading the pool directly.** `SpokeComptrollerViewInterface` collects the getters an integrator needs — the two allowlists, the effective liquidation incentive, the bounded oracle, plus `supplyCaps` and `actionPaused` repeated so that consuming a spoke pool takes one import rather than three. `actionPaused` is declared there with a `uint8` action so a consumer does not have to import this repo's `Action` enum; the encoding is identical.
* **Reading events and errors.** `SpokeComptrollerInterface` declares the full observable surface. Where an error means the same thing as in the shared `Comptroller`, it keeps the same name, arguments and selector; where the meaning changed, it was given a new name deliberately so the two do not collide. See [Errors](spoke-comptroller.md#errors).
* **The Liquidity Hub** supplies the liquidity side through `AdapterSpokeV1` and the Spoke YieldGroup — see [Adapters](../../reference-liquidity-hub/adapters.md#adapterspokev1).
* **Liquidating tokenized-stock collateral** in a spoke pool is covered by [`BStockLiquidator`](../../reference-core-pool/bstock-liquidator.md), which serves both the Core pool and allowlisted spoke pools from the same entry points.
