# Hub-Funded Spoke Pools

A **spoke pool** is an isolated pool whose Comptroller is `SpokeComptroller` instead of the shared [`Comptroller`](../comptroller/comptroller.md), listed in a [`PoolRegistry`](../pool-registry/pool-registry.md) instance of its own. The rest of the machinery is unchanged: the same [`VToken`](../vtoken/vtoken.md) contract (deployed as its own `SpokeVTokenImpl`, a newer build than the one behind the shared `VTokenBeacon`), the same [`RewardsDistributor`](../rewards/rewards-distributor.md), and the same [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md) plumbing once the spoke registry is added to it. The markets sit behind a `SpokeVTokenBeacon` of their own, so upgrading one family never touches the other. [Shortfall](../risk-fund-and-shortfall/shortfall.md) is the exception: it only finds pools in the registry it is configured with, so it cannot auction a spoke pool's bad debt. Each market's `shortfall` address is set to the Normal Timelock instead, so governance recovers bad debt directly.

What the fork adds is policy that only makes sense for a pool the protocol funds itself:

* a **per-market supply allowlist**, so the liquidity side of the pool is supplied only by the [Liquidity Hub](../../reference-liquidity-hub/README.md) (or whichever accounts governance names),
* an optional **pool-wide liquidation allowlist**,
* a **per-market liquidation incentive**, keyed on the collateral being seized rather than one value for the whole pool,
* **deviation-bounded collateral pricing** on the borrow-power path, using the [`DeviationBoundedOracle`](../../reference-oracle/deviation-bounded-oracle.md).

For the product-level introduction (why the pool is shaped this way, and the retail / bulk scenarios it serves), see [Hub-Funded Spoke Pools](../../../whats-new/hub-funded-spoke-pools.md) under *What's New*.

## The two sides of a spoke pool

A spoke pool separates the asset that gets borrowed from the assets that back the borrow. Both are ordinary markets in the same pool; the split is entirely a matter of configuration.

| | **Liquidity side** | **Collateral side** |
| --- | --- | --- |
| Example asset | USDT, USDC, U | tokenized stock (bStock), trending or exotic assets |
| Who may supply | allowlisted accounts only: the Hub's Spoke YieldGroup | anyone (an allowlist is available but off by default) |
| Collateral factor | `0`, not usable as collateral | non-zero |
| Borrowable | yes | no (borrow cap `0`) |
| Interest rate model | its own IRM per market | not applicable |
| Caps | own supply cap and borrow cap | own supply cap |
| Liquidation incentive | normally unused for the Hub's supply-only position; still applies if balances are seized | its own, per market |

Nothing in the contract labels a market as one side or the other. A market is on the liquidity side because its supply allowlist is enabled and its collateral factor is zero; it is on the collateral side because its borrow cap is zero and its collateral factor is not. Both are governance settings, and a market can carry a mix.

Because each pool has its own Comptroller, a spoke pool is isolated from the Core pool and from every other isolated pool: no shared collateral and no cross-margin. Bad debt in a spoke pool still reaches the Liquidity Hub that funds it, and Hub share tokens are Core pool collateral, so the exposure is bounded by the pool's caps rather than removed. A borrower's health factor is shared across all of their collateral and all of their debt **within one spoke pool**, exactly as in any other isolated pool.

## Why a fork rather than a change to `Comptroller`

`contracts/Comptroller.sol` is the implementation every isolated pool in the repo shares, on BNB Chain and on every other chain isolated pools are deployed to. Adding allowlist code there would ship it to every isolated pool market at its next beacon upgrade. Inheritance is not an option either: no function in `Comptroller` is `virtual`, so the hooks cannot be overridden.

`SpokeComptroller` is therefore a hand-maintained fork behind **its own beacon**. Existing pools and chains are untouched, and the two implementations drift independently: a change to `Comptroller` has to be reviewed and re-applied by hand. `diff contracts/Comptroller.sol contracts/Spoke/SpokeComptroller.sol` is the canonical statement of what the fork currently changes.

**Prime is dropped.** Prime is a Core-pool rewards program and a hub-funded pool has no Prime users, so the fork removes the `prime` storage variable and `setPrimeToken`, and reduces the seven `*Verify` post-action hooks to no-ops. They cannot be deleted, because `ComptrollerInterface` declares all seven and the `VToken` calls each of them with a plain external call, but they now do nothing. This also buys bytecode headroom: the shared `Comptroller` sits roughly 700 bytes under the 24,576-byte EIP-170 limit, and the allowlists had to fit somewhere.

## Contracts

* [**SpokeComptroller**](spoke-comptroller.md): the fork: what it adds on top of `Comptroller`, the new setters and getters, the liquidation routing math, and the bounded-pricing path.
* [**SpokeComptrollerStorage**](spoke-comptroller-storage.md): the storage layout, including where it deliberately diverges from `ComptrollerStorage`.

## A registry of its own

A spoke pool is **not** registered in the Isolated Pools [`PoolRegistry`](../pool-registry/pool-registry.md). It gets a second, dedicated instance of the same contract, deployed under the name `SpokePoolRegistry`.

The registry is the directory every consumer reads to answer which pools exist: `getAllPools` drives the indexer, the frontend pool list and the risk tooling, and `getVTokenForAsset` is what [ProtocolShareReserve](../risk-fund-and-shortfall/protocol-share-reserve.md) uses as a membership check. Putting a pool whose liquidity side only the Hub may supply, and which can restrict liquidation to known accounts, into that directory would hand it to every one of those consumers, each of which would then need a special case keyed on its address. A separate registry gives them the separation for free.

It also separates permissions. An [AccessControlManager](../../reference-governance/access-control-manager.md) role is `keccak256(contractAddress, roleString)`, so a grant on one registry cannot reach the other's pools, and the two products stay independently upgradeable.

> **ProtocolShareReserve now holds more than one registry.** It rejects any non-core pool whose vToken none of its registries knows, so repointing the single `poolRegistry` at the spoke registry would have broken `reduceReserves` and every liquidation in the existing isolated pools. `addPoolRegistry` adds a second registry instead, leaving the first one in place, and the spoke registry was added through it before the pool was listed.

## Deployment shape

Five deploy scripts run, in order: `024` to `028`. The first two are described below; `026` deploys `SpokePoolLens`, `027` deploys `SpokeVTokenImpl` and `SpokeVTokenBeacon`, and `028` deploys each market as a `BeaconProxy` behind that beacon, with its interest rate model.

**`SpokePoolRegistry`** deploys a `PoolRegistry` behind the chain's existing `DefaultProxyAdmin`, initializes it with the AccessControlManager, and *nominates* the Normal Timelock as owner. It is `Ownable2Step`, so the deployer stays the live owner until the VIP accepts. The script refuses to hand over a registry whose ACM address does not read back as expected.

**`SpokeComptroller`** then:

1. Deploys `SpokeComptrollerImpl` with that registry's address as a constructor argument. It is an immutable, so a wrong value can only be fixed by redeploying the implementation and re-pointing the beacon; the script asserts it did not resolve to the Isolated Pools registry.
2. Deploys `SpokeComptrollerBeacon` pointing at that implementation. It is **separate from the shared `ComptrollerBeacon`**, so upgrading one family never touches the other.
3. Deploys and initializes a `BeaconProxy` against it, transfers the beacon to the Normal Timelock, and nominates the Timelock as the Comptroller's owner.

Everything else is governance action, and the order matters:

1. `acceptOwnership()` on both the registry and the Comptroller, before any owner-gated setter.
2. The ACM grants in [Roles the VIP has to grant](#roles-the-vip-has-to-grant). Without them `addPool` reverts.
3. `setPriceOracle` and `setDeviationBoundedOracle` on the Comptroller. The bounded oracle is dereferenced without a zero check, so borrowing, redeeming, transferring and exiting a market fail closed until it is set (the last three only for an account that has entered the market and moves a nonzero amount). See [Bounded collateral pricing](spoke-comptroller.md#bounded-collateral-pricing).
4. `SpokePoolRegistry.addPool`, which requires a non-zero oracle and is also what sets the pool-wide liquidation incentive for the first time.
5. `SpokePoolRegistry.addMarket` per market, which lists the market and sets its collateral factor, liquidation threshold and both caps in the same call. The IRM is set when the market is deployed and can be changed later through the ACM-gated `setInterestRateModel`. The per-market liquidation incentive and the allowlists are separate steps after it.

### Roles the VIP has to grant

The registry's own grants do not carry over from the isolated pools, because each names the Isolated Pools registry as the account. Governance needs nothing new on the registry itself: the Normal Timelock already holds `addPool`, `addMarket`, `setPoolName` and `updatePoolMetadata` as wildcards, and a wildcard reaches any contract that checks the same string, a registry deployed later included.

| On | Role string | Granted to |
| --- | --- | --- |
| `SpokeComptroller` | `setCloseFactor(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setLiquidationIncentive(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMinLiquidatableCollateral(uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setCollateralFactor(address,uint256,uint256)` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMarketSupplyCaps(address[],uint256[])` | `SpokePoolRegistry` |
| `SpokeComptroller` | `setMarketBorrowCaps(address[],uint256[])` | `SpokePoolRegistry` |

These six are the setters `addPool` and `addMarket` drive with the registry as the caller; without them `addPool` reverts at execution. The pool's own policy setters (the allowlists, the per-market incentive) and `enterMarketForAccount` are separate grants on top of these. See [SpokeComptroller](spoke-comptroller.md#solidity-api).

## Integration notes

* **Reading the pool through the lens.** Spoke pools have their own lens, [`SpokePoolLens`](../lens/spoke-pool-lens.md). [`PoolLens`](../lens/pool-lens.md) is unchanged and does not report the spoke-only state. `SpokePoolLens` is not a drop-in `PoolLens`. It keeps the account, price, reward and bad-debt reads under the same names and struct shapes (`vTokenBalances(All)`, `vTokenUnderlyingPrice(All)`, `getPendingRewards`, `getPoolBadDebt`, `getVTokenForAsset`, `getPoolsSupportedByAsset`), but the pool and market reads are replaced, and their structs do not decode as the `PoolLens` ones. Code written against `PoolLens`'s `getAllPools`, `getPoolByComptroller`, `getPoolDataFromVenusPool` or `vTokenMetadata(All)` will revert or misdecode at this address. The spoke reads are:
  * `getAllSpokePools(registry)` and `getSpokePoolByComptroller(registry, comptroller)` (and `getSpokePoolData(registry, venusPool)`) return `SpokePoolData`. It renames `PoolData.liquidationIncentive` to `poolLiquidationIncentiveMantissa` in the same position and appends `deviationBoundedOracle` and `liquidationAllowlistEnabled` before the market list.
  * `spokeVTokenMetadata(vToken)` and `spokeVTokenMetadataAll(vTokens)` return `SpokeVTokenMetadata`. It inserts `liquidationThresholdMantissa` right after `collateralFactorMantissa`, which shifts every later field, and adds `effectiveLiquidationIncentiveMantissa`, `ownLiquidationIncentiveMantissa` (zero when the market uses the pool-wide value), `supplyAllowlistEnabled`, `forcedLiquidationEnabled` and `boundedPricingEnabled`. `boundedPricingEnabled` is read per underlying asset from the bounded oracle; when it is false, the oracle returns the spot price for that asset. It is also false when the pool has no bounded oracle set, and then borrowing reverts, as do redeem, transfer and exit for an account that has entered the market and moves a nonzero amount.
  * `spokeVTokenPrices(vToken)` and `spokeVTokenPricesAll(vTokens)` return the spot and the bounded prices side by side.
  * `spokeSupplyPermissions(comptroller, vTokens, account)` tells whether an account may supply to each market. `spokeLiquidationPermission(comptroller, liquidator)` tells whether an account may seize collateral.

  Access-controlled permissions (for example who holds `enterMarketForAccount`) are not reported. Read them from the `AccessControlManager` directly.
* **Reading the pool directly.** `SpokeComptrollerViewInterface` collects the getters an integrator needs: the two allowlists, the effective liquidation incentive, the bounded oracle and `isForcedLiquidationEnabled`. It also repeats `supplyCaps` and `actionPaused`, so that consuming a spoke pool takes one import rather than three. `actionPaused` is declared there with a `uint8` action so a consumer does not have to import this repo's `Action` enum; the encoding is identical. `markets` is repeated because the shared declaration returns only the first two of its three fields and silently drops `liquidationThresholdMantissa`.
* **Reading events and errors.** `SpokeComptrollerInterface` declares the pool's own events and errors. A few that the documented functions also emit are declared in shared bases instead: `ZeroAddressNotAllowed` (`validators`), `Unauthorized` (`AccessControlledV8`), `MaxLoopsLimitExceeded` and `MaxLoopsLimitUpdated` (`MaxLoopsLimitHelper`), and the OpenZeppelin ownership events, so a decoder needs those ABIs too. Where an error means the same thing as in the shared `Comptroller`, it keeps the same name, arguments and selector; where the meaning changed, it was given a new name deliberately so the two do not collide. See [Errors](spoke-comptroller.md#errors).
* **The Liquidity Hub** supplies the liquidity side through `AdapterSpokeV1` and the Spoke YieldGroup. See [Adapters](../../reference-liquidity-hub/adapters.md#adapterspokev1).
* **Liquidating tokenized-stock collateral** in a spoke pool is covered by [`BStockLiquidator`](../../reference-core-pool/bstock-liquidator.md), which serves both the Core pool and allowlisted spoke pools from the same entry points.
* **Supplying collateral in one call.** The [Collateral Gateway](../../reference-technical-articles/collateral-gateway.md) supplies a market and enables it as collateral in one transaction.
* **Addresses** are in [Spoke pools deployed contracts](../../../deployed-contracts/spoke-pools.md).
