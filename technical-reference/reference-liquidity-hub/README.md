# Liquidity Hub

The **Venus Liquidity Hub** is a per-asset ERC-4626 allocator vault. A lender deposits a single asset, the Hub routes it across Venus yield families (**Core**, **Flux**, **FRV**) under a governance-set policy, and returns a yield-bearing share token. Yield accrues through a **rising exchange rate** (one share = X underlying), never by rebasing. There is one Hub per asset, with no cross-asset coupling.

For the user-facing introduction, see [Liquidity Hub](../../whats-new/liquidity-hub.md) under *What's New*.

## Architecture

Routing is three-tiered. The Hub depends only on the `IYieldGroupBase` interface and never reaches past a Source into the underlying market.

<figure><img src="../../.gitbook/assets/liquidity-hub-architecture.svg" alt="Liquidity Hub architecture: the Hub routes through Core, Flux, and FRV YieldGroups (Sources) via stateless delegatecall adapters into the underlying vToken, fToken, and FRV-vault resources"><figcaption></figcaption></figure>

* **Hub** — the ERC-4626 entry point (one beacon proxy per asset). Holds the Source registry, the two outer routing queues, dual caps, the per-transaction withdrawal cap, the fee parameters, and the multi-level pause flags. It exposes **no APY view** — spot APY is read per-Source from `YieldGroup.spotAPYBps()` and must be aggregated off-chain.
* **YieldGroup (Source)** — aggregates one or more *resources* of a single protocol family behind the uniform `IYieldGroupBase` boundary, and owns its own inner deposit / withdraw queues and per-resource registry.
* **Adapter** — a stateless singleton translating between a YieldGroup and one protocol ABI. Mutating calls run via **delegatecall** so receipt tokens land on the YieldGroup; one deployment per ABI family serves every YieldGroup.
* **Resource** — the underlying market or vault that holds the capital (a Venus Core vToken, a Fluid fToken, or a Fixed-Rate Vault share).

> **Terminology.** The PRD calls the grouping layer a *Source*; the code names the contract a *YieldGroup* and the Hub-facing interface `IYieldGroupBase`. There is no `ISource` type in the Solidity — "Source" survives only in deployment-artifact aliases (`CoreSource_USDT`, `FluxSource_USDC`, `FRVSource_U`). PRD *Product / Vault* = code *Resource*.

## The three yield families

|                          | **Core**                            | **Flux**                              | **FRV**                                |
| ------------------------ | ----------------------------------- | ------------------------------------- | -------------------------------------- |
| Underlying protocol      | Venus Core lending                  | Fluid Lending                         | Venus Fixed-Rate Vaults                |
| Resource / receipt token | vToken (Compound-style)             | fToken (ERC-4626 share)               | FRV vault share (ERC-4626)             |
| Deposit / withdraw call  | `mint` / `redeemUnderlying`         | `deposit` / `withdraw`                | `deposit` / `withdraw`                 |
| Spot APY source          | `supplyRatePerBlock` × `blocksPerYear` | Fluid `LendingResolver`            | vault `fixedAPY` (Fundraising / Lock)  |
| Lifecycle constraint     | none                                | none                                  | 11-state machine                       |

## Contracts

* [**Hub**](hub.md) — the ERC-4626 entry point: routing flows, dual caps, per-tx withdrawal cap, fees, multi-level pause, Operator reallocation, and the full Solidity API.
* [**Yield Groups**](yield-groups.md) — `YieldGroup` (the generic router, deployed twice: once as the Core family, once as Flux) and `YieldGroupFRV`: the `IYieldGroupBase` implementations, per-resource registry / queues / caps, and the FRV lifecycle.
* [**Adapters**](adapters.md) — `AdapterCoreV1`, `AdapterFlux`, `AdapterFRV`: the stateless, delegatecall-dispatched protocol translators.
* [**Interfaces**](interfaces.md) — `IYieldGroupBase` (with its family extensions `IYieldGroup` and `IYieldGroupFRV`) and `IResourceAdapter`, the boundary contracts.
* **`Migrator`** — a stateless, permissionless, non-upgradeable helper for one-click migration of a Venus Core position into a Hub (`migrateFromCore` / `migrateFromCoreBNB`).

**`HubRegistry`** — one per chain, the canonical directory of deployed Hubs. Governance calls `addHub(address)` / `removeHub(address)` (both ACM-gated); everyone else reads `hubForAsset(address)`, `assetForHub(address)`, `isHub(address)`, `getHubs()` and `getHubsCount()`. It emits `HubAdded` / `HubRemoved`, and an indexer should seed from state on `HubAdded` rather than relying on log ordering. Each asset may have at most one Hub (`AssetAlreadyHasHub`).

## Key features

* **Atomic-or-revert** deposits, withdrawals, and reallocations — no partial fills.
* **Dual caps per Source** (absolute amount and percentage of Hub TVL; the stricter binds) plus an optional per-resource cap and a per-transaction withdrawal cap.
* **Multi-level pause** — Hub, Source, or single resource, each independent.
* **Reentrancy-guarded value paths** — every entry point that moves assets is `nonReentrant`: `deposit` / `mint` / `withdraw` / `redeem` / `reallocate` / `emergencyReallocate` / `accrueFees` / `sweep` on the Hub, and `deposit` / `withdraw` / `depositResource` / `withdrawResource` / `sweep` on each YieldGroup. The ACM-gated admin setters are not individually guarded; they rely on ACM gating instead.
* **Asymmetric permissions** — tightening (pause, lower a cap) is Operator-accessible, while most loosening (unpause, register a route, raise the withdrawal cap) requires governance. The one exception is `raiseYieldGroupCap`, which the Operator also holds so it can open headroom ahead of a rebalance. All gated by `AccessControlManagerV8`.
* **Stateless shared adapters** — zero storage, delegatecall dispatch; a new protocol family needs only a new adapter, not a Hub change.
* **Fees off at launch** — management and performance fee machinery exists but ships at `0/0`.

## Deployment

The Hub uses a **beacon-proxy model**: one `UpgradeableBeacon` per family per chain (Hub, Core, FRV, Flux), each owned by governance — upgrading a beacon upgrades every vault of that family atomically; per-asset instances are beacon proxies. Deploy scripts only deploy and initialize the proxies; **ACM wiring, `addYieldGroup` / `addResource`, and queue configuration are separate governance (ACM-gated) actions**.

v1 targets **BNB Chain**, launching with three assets: **USDT**, **USDC** and **U**.

The contracts are **deployed on BNB Chain mainnet**. Deployment only creates and initializes the proxies — the governance proposal that onboards them grants the ACM roles, registers each Hub with the [HubRegistry](#contracts), wires the resources and queues, and seeds each Hub with a bootstrap deposit. Until that proposal executes, the Hubs are deployed but unwired.

#### BNB Chain mainnet (chain ID 56)

| Asset | Hub |
| ----- | --- |
| USDT  | `0x18AfDACF30F8671021dec4b78297E39d2FE87226` |
| USDC  | `0x9D2D9592cF8DFbf59107fAab703d08494BE14617` |
| U     | `0x0e5AA174d4F31b757a237eb1999DE151596788B0` |

`HubRegistry` is deployed at `0x4196932b0c76A114178236C00A5e140f27866790`. Prefer resolving Hub addresses through it rather than hard-coding them.

Supporting contracts:

| Contract | Address | Notes |
| -------- | ------- | ----- |
| `Migrator` | `0xfe6b8BEf1215C19Cd247FbF495ef560932F1Eb9B` | Stateless, permissionless, non-upgradeable. One-click migration of a Venus Core position into a Hub via `migrateFromCore` / `migrateFromCoreBNB` (plus `*WithConsent` variants) |
| `HubBeacon` | `0x0f20e1004962e2DF16c16FC15460Dc6480626321` | Upgrades every Hub atomically |
| `CoreBeacon` | `0x195a0F1BCF73C3Beb609a1271E8E08b8E4c098C6` | Core-family YieldGroups |
| `FluxBeacon` | `0x9bb6a3Ac5955fA8dc236560CA9D51483d1d79f15` | Flux-family YieldGroups |
| `FRVBeacon` | `0x8A5EceDD726246682402430b9B24c19bF61B7f1d` | FRV-family YieldGroups |
| `AdapterCoreV1` | `0x4E514a0C7aB9d140eE204dfA0017574270D92944` | Shared singleton |
| `AdapterFlux` | `0xA81bDf813A428053E764C34Bc679b3E4d0807be3` | Shared singleton |
| `AdapterFRV` | `0x1FA0365bDd603452CE96BE3c0e12Db5515a35902` | Shared singleton |

Each asset also has three YieldGroup proxies (`CoreSource_*`, `FluxSource_*`, `FRVSource_*`); resolve them from the Hub's `registeredYieldGroups()` rather than hard-coding.

#### BSC testnet (chain ID 97)

A parallel deployment exists for integration testing. It ships **USDT only** — not the three assets mainnet carries — so a harness written against the mainnet asset list will not map cleanly.

| Contract | Address |
| -------- | ------- |
| `Hub_USDT` | `0x7cE6ADF754D0eC81A6CF8ACd9C7454F45077dc61` |
| `HubRegistry` | `0x5346f648029d1D1d1034e09e8AD7a115f5D7A159` |
| `Migrator` | `0x343D518d8C89f9B5D770000F1ed80f45bF1419f5` |

## Audits

The Liquidity Hub contracts undergo independent security audits before mainnet deployment. Audit reports will be published in the [venus-liquidity-hub repository](https://github.com/VenusProtocol/venus-liquidity-hub/tree/main/audits) and indexed on the [Security & Audits](../../security-and-audits.md) page.
