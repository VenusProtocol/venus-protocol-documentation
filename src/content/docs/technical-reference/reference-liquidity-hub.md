---
title: "Liquidity Hub"
---

The **Venus Liquidity Hub** is a per-asset ERC-4626 allocator vault. A lender deposits a single asset, the Hub routes it across Venus yield families (**Core**, **Flux**, **FRV**, **Spoke** and, on the USDT and USDC Hubs, **Centrifuge**) under a governance-set policy, and returns a yield-bearing share token. Yield accrues through a **rising exchange rate** (one share = X underlying), never by rebasing. There is one Hub per asset, with no cross-asset coupling.

For the user-facing introduction, see [Liquidity Hub](/whats-new/liquidity-hub) under *What's New*.

:::note
**Which source this documents.** The source for these contracts, including the Centrifuge and Spoke families, `HubLens` and [receipt tracking](/technical-reference/reference-liquidity-hub/yield-groups#receipt-tracking), is on `develop` of [venus-liquidity-hub](https://github.com/VenusProtocol/venus-liquidity-hub). `main` does not have the Centrifuge or Spoke families or `HubLens` yet. Deployment versions differ: VIP-681 upgrades Core, Flux, FRV and Spoke, but does not upgrade the Centrifuge YieldGroups or replace their adapter. The deployed Centrifuge contracts have neither `syncReceipt` nor `receiptValue`; the implementations on `develop` add those selectors with explicit reverts. The audit reports below are pinned to commits. Match the deployed bytecode or the verified source before decoding anything.
:::

## Architecture

Routing is three-tiered. The Hub depends only on the `IYieldGroupBase` interface and never reaches past a Source into the underlying market.

<figure><img src="/assets/liquidity-hub-architecture.svg" alt="Liquidity Hub architecture: the Hub routes through its YieldGroups (Sources) via stateless delegatecall adapters into the underlying resources"></figure>

* **Hub** — the ERC-4626 entry point (one beacon proxy per asset). Holds the Source registry, the two outer routing queues, dual caps, the per-transaction withdrawal cap, the fee parameters, and the multi-level pause flags. It exposes **no APY view** of its own — spot APY is read per-Source from `YieldGroup.spotAPYBps()`, and `HubLens.spotAPYBps(hub)` is what blends those into one figure.
* **YieldGroup (Source)** — aggregates one or more *resources* of a single protocol family behind the uniform `IYieldGroupBase` boundary, and owns its own inner deposit / withdraw queues and per-resource registry.
* **Adapter** — a stateless singleton translating between a YieldGroup and one protocol ABI. Mutating calls run via **delegatecall** so receipt tokens land on the YieldGroup; one deployment per ABI family serves every YieldGroup.
* **Resource** — the underlying market or vault that holds the capital (a Venus Core vToken, a Fluid fToken, a Fixed-Rate Vault share, a spoke-pool vToken, or a Centrifuge fund vault).

> **Terminology.** These docs call the grouping layer a *Source*; the code names the contract a *YieldGroup* and the Hub-facing interface `IYieldGroupBase`. There is no `ISource` type in the Solidity — "Source" survives only in deployment-artifact aliases (`CoreSource_USDT`, `FluxSource_USDC`, `FRVSource_U`). What a Source holds is a *Resource*.

## The yield families

|                          | **Core**                            | **Flux**                              | **FRV**                                | **Spoke** | **Centrifuge** |
| ------------------------ | ----------------------------------- | ------------------------------------- | -------------------------------------- | ------------------------------------------------ | -------------- |
| Underlying protocol      | Venus Core lending                  | Fluid Lending                         | Venus Fixed-Rate Vaults                | Venus [hub-funded spoke pools](/technical-reference/reference-isolated-pools/spoke) | Centrifuge tokenized funds |
| Resource / receipt token | vToken (Compound-style)             | fToken (ERC-4626 share)               | FRV vault share (ERC-4626)             | vToken (isolated-pools)                          | ERC-7540 vault share (JTRSY, JAAA) |
| Deposit / withdraw call  | `mint` / `redeemUnderlying`         | `deposit` / `withdraw`                | `deposit` / `withdraw`                 | `mint` / `redeem` (by vToken count)              | `requestDeposit` / `requestRedeem`, then claim |
| Spot APY source          | `supplyRatePerBlock` × `blocksPerYear` | Fluid `LendingResolver`            | vault `fixedAPY` net of `reserveFactor` (Fundraising / Lock)| `supplyRatePerBlock` × the market's own `blocksOrSecondsPerYear` | published with `setSpotAPYBps` (governance, the Operator or the Guardian) |
| Who may supply           | anyone                              | anyone                                | anyone                                 | **allowlisted only**: the pool grants the YieldGroup address | only addresses on the fund's own investor list |
| Valuation basis          | balance × exchange rate             | `previewRedeem`                       | lifecycle-aware linear accrual         | balance × exchange rate, `badDebt` included      | held shares and open requests (assets at face, shares at the vault's share price), clamped to its [NAV band](/technical-reference/reference-liquidity-hub/yield-groups#nav-band) |
| Lifecycle constraint     | none                                | none                                  | 11-state machine                       | none                                             | asynchronous requests, settled by the fund manager |
| Hubs                     | USDT, USDC, U                       | USDT, USDC, U                         | USDT, USDC, U                          | USDT, USDC, U                                    | USDT, USDC |

**Spoke.** Each Spoke Source supplies its asset's liquidity market in every hub-funded spoke pool; the markets are listed on the [Deployed Contracts](/deployed-contracts/liquidity-hub#wired-resources) page. Onboarding a further market is a governance action, in this order:

1. `setAllowedSupplier(vToken, <SpokeSource>, true)` on the spoke pool.
2. `addResource(vToken, AdapterSpokeV1)` on the Spoke Source. The adapter rejects a registration the market would not accept, and also rejects a market its own Comptroller does not list.
3. `setInnerDepositQueue` and `setInnerWithdrawQueue` on the Spoke Source, so the new market is routed to.
4. On the Hub, place the Spoke Source in the outer deposit queue if it is not there yet.

On BNB Chain the Spoke Source of every Hub is second in the outer deposit queue, `[Core, Spoke, Flux]`, and last in the outer withdraw queue. See [How deposits and withdrawals are routed](/whats-new/liquidity-hub#how-deposits-and-withdrawals-are-routed) for the full order per Hub.

**FRV.** An FRV Source holds the Fixed Term Vaults governance adds to it, usually in the proposal that creates each vault. The set changes with every new vault, so read it with `resources()` on the Source. FRV is out of the outer deposit queue, so it is filled only by the Operator's `reallocate`, but it sits in the outer withdraw queue: `setOuterWithdrawQueue` rejects a queue that omits a registered Source with non-zero `totalAssets()`, and that total counts idle balance, so leaving FRV out would let a 1-wei donation block the Operator from reordering the queue.

**Centrifuge.** The USDT and USDC Sources each hold the JTRSY and JAAA vaults for their own asset behind `AdapterCentrifuge`, each with a NAV band and a published APY. Like FRV, Centrifuge is out of the outer deposit queue and sits right after FRV in the outer withdraw queue, so it is filled only by `reallocate`. The U Hub has no Centrifuge Source. See [Centrifuge lifecycle](/technical-reference/reference-liquidity-hub/yield-groups#centrifuge-lifecycle).

## Contracts

* [**Hub**](/technical-reference/reference-liquidity-hub/hub) — the ERC-4626 entry point: routing flows, dual caps, per-tx withdrawal cap, fees, multi-level pause, Operator reallocation, and the full Solidity API.
* [**Yield Groups**](/technical-reference/reference-liquidity-hub/yield-groups): `YieldGroup` (the generic router, deployed three times: as the Core, Flux and Spoke families), `YieldGroupFRV` and `YieldGroupCentrifuge`: the `IYieldGroupBase` implementations, per-resource registry / queues / caps, the FRV lifecycle, and the Centrifuge lifecycle and NAV band.
* [**Adapters**](/technical-reference/reference-liquidity-hub/adapters): `AdapterCoreV1`, `AdapterFlux`, `AdapterFRV`, `AdapterSpokeV1`, `AdapterCentrifuge`: the stateless, delegatecall-dispatched protocol translators.
* [**Interfaces**](/technical-reference/reference-liquidity-hub/interfaces) — `IYieldGroupBase` (with its family extensions `IYieldGroup`, `IYieldGroupFRV` and `IYieldGroupCentrifuge`) and `IResourceAdapter`, the boundary contracts, plus where `INavGuard` and `IHubLens` are documented.
* **`Migrator`** — a stateless, permissionless, non-upgradeable helper for one-click migration of a Venus Core position into a Hub (`migrateFromCore` / `migrateFromCoreBNB`).
* **`HubLens`** — a stateless, unowned, non-upgradeable read-only helper. The Hub does not compute a deposit ceiling, so `HubLens` is where a frontend or an integrator reads one: `maxDeposit(hub)`, `maxMint(hub)`, `depositCapacityBreakdown(hub)` and the blended `spotAPYBps(hub)`. Every function takes the Hub as a parameter, so one deployment serves every Hub — see [Sizing a deposit](/technical-reference/reference-liquidity-hub/hub#sizing-a-deposit).

**`HubRegistry`** — one per chain, the canonical directory of deployed Hubs. Governance calls `addHub(address)` / `removeHub(address)` (both ACM-gated); everyone else reads `hubForAsset(address)`, `assetForHub(address)`, `isHub(address)`, `getHubs()` and `getHubsCount()`. It emits `HubAdded` / `HubRemoved`, and an indexer should seed from state on `HubAdded` rather than relying on log ordering. Each asset may have at most one Hub (`AssetAlreadyHasHub`).

## Key features

* **Atomic-or-revert** deposits, withdrawals, and reallocations — no partial fills.
* **Dual caps per Source** (absolute amount and percentage of Hub TVL; the stricter binds) plus an optional per-resource cap and a per-transaction withdrawal cap.
* **Multi-level pause** — Hub, Source, or single resource, each independent.
* **Reentrancy-guarded value paths** — every entry point that moves assets is `nonReentrant`: `deposit` / `mint` / `withdraw` / `redeem` / `reallocate` / `emergencyReallocate` / `accrueFees` / `sweep` on the Hub, and `deposit` / `withdraw` / `depositResource` / `withdrawResource` / `sweep` on each YieldGroup. The ACM-gated admin setters are not individually guarded; they rely on ACM gating instead.
* **Asymmetric permissions** — governance holds every gated function except `reallocate`. The Operator can pause and raise or lower Source and resource caps; the Guardian can also pause, unpause at every level, run `emergencyReallocate` and replace resource adapters. Registering a route, raising the withdrawal cap and setting fees remain governance-only. Every permission is granted through `AccessControlManagerV8`; see [Permissions](/technical-reference/reference-liquidity-hub/hub#permissions).
* **Stateless shared adapters** — zero storage, delegatecall dispatch; a new protocol family needs only a new adapter, not a Hub change.
* **Fees set to zero** — management, performance and redeem fees exist, and all three are `0`.

## Deployment

The Hub uses a **beacon-proxy model**: one `UpgradeableBeacon` per family per chain (Hub, Core, FRV, Flux, Spoke, Centrifuge), each owned by governance — upgrading a beacon upgrades every vault of that family atomically; per-asset instances are beacon proxies. Deploy scripts only deploy and initialize the proxies; **ACM wiring, `addYieldGroup` / `addResource`, and queue configuration are separate governance (ACM-gated) actions**.

`HubRegistry` is the exception: it is a chain-level singleton behind a **`TransparentUpgradeableProxy`**, not a beacon proxy, so it is upgraded independently of every Hub. On BNB Chain mainnet that proxy is administered by Venus's shared `DefaultProxyAdmin`, the same one that administers the core pool and isolated pools; the BSC testnet registry has a `ProxyAdmin` of its own.

The Hubs run on **BNB Chain** for **USDT**, **USDC** and **U**, each registered with the [HubRegistry](#contracts) and seeded with a bootstrap deposit.

#### BNB Chain mainnet (chain ID 56)

| Asset | Hub |
| ----- | --- |
| USDT  | `0x18AfDACF30F8671021dec4b78297E39d2FE87226` |
| USDC  | `0x9D2D9592cF8DFbf59107fAab703d08494BE14617` |
| U     | `0x0e5AA174d4F31b757a237eb1999DE151596788B0` |

`HubRegistry` is deployed at `0x6D93Fd479f2d37445CFBe132412e316a0364acc2`. Prefer resolving Hub addresses through it rather than hard-coding them. The [Deployed Contracts](/deployed-contracts/liquidity-hub) page carries the same addresses as explorer links, including the per-asset YieldGroup proxies.

Supporting contracts:

| Contract | Address | Notes |
| -------- | ------- | ----- |
| `HubLens` | `0xE5d8A002A794CcDba248ba774a359eF2B9E4Ba8B` | Stateless, unowned, non-upgradeable. Deposit sizing and blended APY for every Hub, see [Sizing a deposit](/technical-reference/reference-liquidity-hub/hub#sizing-a-deposit) |
| `Migrator` | `0xfe6b8BEf1215C19Cd247FbF495ef560932F1Eb9B` | Stateless, permissionless, non-upgradeable. One-click migration of a Venus Core position into a Hub via `migrateFromCore` / `migrateFromCoreBNB` (plus `*WithConsent` variants) |
| `HubBeacon` | `0x0f20e1004962e2DF16c16FC15460Dc6480626321` | Upgrades every Hub atomically |
| `CoreBeacon` | `0x195a0F1BCF73C3Beb609a1271E8E08b8E4c098C6` | Core-family YieldGroups |
| `FluxBeacon` | `0x9bb6a3Ac5955fA8dc236560CA9D51483d1d79f15` | Flux-family YieldGroups |
| `FRVBeacon` | `0x8A5EceDD726246682402430b9B24c19bF61B7f1d` | FRV-family YieldGroups |
| `SpokeBeacon` | `0x652AAa1CD21f47a92D04680C1d9Bf99cC1Fb8975` | Spoke-family YieldGroups |
| `CentrifugeBeacon` | `0xAe90Cfb3E2Bc97508F58E7e076Acf38f3bfC820f` | Centrifuge-family YieldGroups |
| `AdapterCoreV1` | `0x0f62927d18Fd35712622C2c6C3F730EB8a18b71B` | Shared singleton |
| `AdapterFlux` | `0x4Afb747ce8dDef689d5484FFdfB69Ac8bC7cAc8B` | Shared singleton |
| `AdapterFRV` | `0x40fDc0fef94D607EE4341230afb09bcDB0B949E2` | Shared singleton |
| `AdapterSpokeV1` | `0xD08596E58325724C824100bA87f2470493Fe342d` | Shared singleton |
| `AdapterCentrifuge` | `0xaa9D52758890997D91950E595886FF9CDEca81ae` | Shared singleton |
| `DefaultProxyAdmin` | `0x6beb6D2695B67FEb73ad4f172E8E2975497187e4` | Venus's shared `ProxyAdmin`, administering the registry's `TransparentUpgradeableProxy`; governance-owned |

Each asset also has one YieldGroup proxy per family it is wired to (`CoreSource_*`, `FluxSource_*`, `FRVSource_*`, `SpokeSource_*`, `CentrifugeSource_*`), and the set differs per Hub; resolve them from the Hub's `registeredYieldGroups()` rather than hard-coding.

**Hub parameters.** Live values; all three assets are 18-decimal. Only the FRV and Spoke caps differ per Hub, and only the USDT and USDC Hubs have a Centrifuge Source:

| Parameter | USDT | USDC | U |
| --------- | ---- | ---- | - |
| Share token name / symbol | `Venus Hub USDT` / `vhUSDT` | `Venus Hub USDC` / `vhUSDC` | `Venus Hub U` / `vhU` |
| `decimalsOffset` | 6 | 6 | 6 |
| `maxWithdrawalSize` (per tx) | 10,000,000 | 10,000,000 | 10,000,000 |
| Core cap (absolute / %) | 2,000,000,000 / disabled | same | same |
| Flux cap (absolute / %) | 7,000,000 / 20% | same | same |
| FRV cap (absolute / %) | 5,000,000 / 50% | 5,000,000 / 30% | 5,000,000 / 90% |
| Spoke cap (absolute / %) | 300,000,000 / 50% | 90,000,000 / 50% | 30,000,000 / 50% |
| Centrifuge cap (absolute / %) | 5,000,000 / 25% | 5,000,000 / 25% | no Centrifuge Source |
| Management / performance / redeem fee | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |

A Spoke Source's capacity for a new deposit is bounded by the room left under its Hub cap and the capacity available through its inner deposit queue. The Hub's effective cap, read with `yieldGroupEffectiveCap(source)`, is the stricter of the absolute and percentage caps; subtract the Source's current value and floor at zero to get the remaining room. Each downstream market is also limited by its own remaining supply capacity (`supplyCaps` on its `SpokeComptroller`, listed on the [spoke pools](/deployed-contracts/spoke-pools) page) and any per-resource cap. These are limits on additional deposits, not on how much the Source already holds. For a deposit the percentage cap is priced against TVL including that deposit, so size deposits with `HubLens` rather than subtracting from the current effective cap alone. Read the limits live, since TVL and governance can change them.

`feeRecipient` is `0xF322942f644A996A617BD29c16bd7d231d9F35E9` on all three. Core's percentage dimension uses the `10_000` BPS sentinel, so only its absolute cap binds; Flux is held to 20% of TVL and sits last in the deposit queue, so deposits reach it only when Core and Spoke cannot absorb them; otherwise it is filled through Operator `reallocate`. Each Hub is seeded with a 10-token bootstrap deposit from the Treasury whose shares are minted to the burn address, so `totalSupply` is never zero and the refill-from-empty branch cannot be re-opened.

**Role holders.** Granted by the onboarding proposal, not baked into the bytecode — see [Permissions](/technical-reference/reference-liquidity-hub/hub#permissions):

| Role | Address |
| ---- | ------- |
| Governance | `0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396` — the [Normal Timelock](/deployed-contracts/governance) |
| Operator | `0x83f426233B358A36953F6951161E76FB7c866a7A` — the routine keeper multisig |
| Guardian | `0x1C2CAc6ec528c20800B2fe734820D87b581eAA6B` — no-delay containment multisig |
| Keeper | `0x194b1F6c57d023Fa59497ee5A7976dB47f183929` — Centrifuge Sources only: `claimDeposit`, `claimRedeem`, `claimCancelDeposit`, `claimCancelRedeem` |

#### BSC testnet (chain ID 97)

A parallel deployment exists for integration testing. The USDT Hub below is the reference deployment, but the testnet registry also lists Hubs over many mock assets, stood up for QA scenarios with per-Hub wiring that does not follow the mainnet shape. The full list is on the [Deployed Contracts](/deployed-contracts/liquidity-hub#bnb-chain-testnet-test-only) page. Either way the mainnet asset trio does not map onto testnet, so a harness written against the mainnet asset list will not carry over.

| Contract | Address |
| -------- | ------- |
| `Hub_USDT` | `0x7cE6ADF754D0eC81A6CF8ACd9C7454F45077dc61` |
| `HubRegistry` | `0x5346f648029d1D1d1034e09e8AD7a115f5D7A159` |
| `Migrator` | `0x343D518d8C89f9B5D770000F1ed80f45bF1419f5` |
| `HubLens` | `0x0D0C640AA4da71cE610EFD6a04acCE6e3Ae419C2` |
| `CoreSource_USDT` | `0x11e39DC7b8b16BBDA8D9C2903dF741Ae9341Ec88` |
| `FluxSource_USDT` | `0x044E572144bc08ed2D90E081EeEd7b5b6Cb01016` |
| `FRVSource_USDT` | `0xA0Fb0fFeBdcB7F45A3Ec841cCE7F78B7CeBD0f82` |
| `SpokeSource_USDT` | `0xb9Bf8232474aF0A18BbA0CbCc3bA10efD51542e2` |
| `CentrifugeSource_USDT` | `0x8DFF12277C44E73cbF551ceB6E5Ae1eD4CC85542` |
| `AdapterCoreV1` | `0x32DfFD70B8E91C20B708d03C8051ad59F2C6391D` |
| `AdapterFlux` | `0xC17f2F74057a6beeeb32F3D1F6c8C6A7067e86f0` |
| `AdapterFRV` | `0x790960cBC0B5A88765cFE89C5bD604163f4E2D9C` |
| `AdapterSpokeV1` | `0xbeAE38F78944F62c00943Fc7e335E0D59c359E98` |
| `AdapterCentrifuge` | `0x63Ce07c3F1500B283B6d3451BdC3E3C6211a6c7F` |
| `HubBeacon` | `0x7cbaC6991aC33DaFDD347e84CFbE2F372b936d92` |
| `CoreBeacon` | `0xbBEe25aE7d2Db035Afc327fb0096fC88FDfF3170` |
| `FluxBeacon` | `0x6b9CA74F82848668EA04D56E0A8396A816ba5330` |
| `FRVBeacon` | `0x6196Ec22133610132563B03b6Fad5aa766A9C037` |
| `SpokeBeacon` | `0x58099BEaa6A00F493eF67fF953866DDA4a502389` |
| `CentrifugeBeacon` | `0x1dcAAB89344eA7F4c2271598e4ED4Fd6a66A451C` |
| `HubRegistryProxyAdmin` | `0x9f8413eEE33D434F6D4f40C83181f32A831c9ef7` |

**Testnet is not a faithful mirror of mainnet.** Four differences will break assumptions carried over from a testnet harness:

* The share token is named `Vault Share` / **`vSHARE`**, a placeholder — not the `Venus Hub <asset>` / `vh<asset>` pair mainnet uses.
* **FRV is fully wired on testnet**: several Fixed-Rate Vaults are registered as resources on the USDT Hub's FRV Source, and the FRV Source sits in both outer queues. On mainnet an FRV Source holds only the vaults governance adds, and it stays out of the deposit queue. Testnet Centrifuge carries one mock vault rather than the two real funds, and like mainnet it sits in the withdraw queue only.
* On the USDT Hub, Core, FRV, Spoke and Centrifuge are effectively uncapped (`type(uint128).max` absolute, percentage dimension disabled) and Flux is capped at about 750 USDT, rather than the tiered mainnet values. The per-transaction withdrawal cap is also lower.
* The registry proxy is administered by a registry-specific `HubRegistryProxyAdmin`, not the shared `DefaultProxyAdmin` mainnet uses.

## Audits

The Liquidity Hub was audited by HashDit (2026/07/07) and Cantina (2026/08/11), the Centrifuge yield group by HashDit (2026/09/04), `HubLens` and the capacity math behind it by HashDit (2026/09/24) and again by Cantina (2026/10/27), and receipt tracking by HashDit (2026/11/06). The reports are in the [venus-liquidity-hub repository](https://github.com/VenusProtocol/venus-liquidity-hub/tree/develop/audits). All are indexed, with their scope, on the [Security & Audits](/links/security-and-audits#liquidity-hub) page.
