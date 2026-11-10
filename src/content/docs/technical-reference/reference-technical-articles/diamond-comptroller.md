---
title: "Diamond Comptroller in the Core pool"
---

The BNB Chain Core Pool Comptroller uses a Unitroller proxy followed by a Diamond selector router. This architecture is specific to the BNB Core Pool; Core Pools on other networks use BeaconProxy Comptrollers from the `isolated-pools` repository.

## Why the Diamond was introduced

As the original Comptroller grew, its implementation approached the EVM contract-size limit. Venus split application logic into facets while retaining the existing Unitroller address and storage layout.

The call path is:

```text
user or vToken
    │
    ▼
Unitroller (storage and public entry point)
    │ delegatecall
    ▼
Diamond (selector router)
    │ delegatecall selected by msg.sig
    ▼
Facet (application logic in Unitroller storage context)
```

Users, vTokens, and integrations continue to call the Unitroller. The Diamond and facet addresses are implementation details and must not be called as stateful application contracts.

## Current facet families

The current Diamond routes selectors among five facets:

* [MarketFacet](/technical-reference/reference-core-pool/comptroller/diamond/facets/market-facet) — markets, accounts, delegation, and liquidity views
* [PolicyFacet](/technical-reference/reference-core-pool/comptroller/diamond/facets/policy-facet) — vToken policy hooks and liquidity checks
* [RewardFacet](/technical-reference/reference-core-pool/comptroller/diamond/facets/reward-facet) — XVS accrual, claims, and seizure
* [SetterFacet](/technical-reference/reference-core-pool/comptroller/diamond/facets/setter-facet) — privileged risk and feature configuration
* [FlashLoanFacet](/technical-reference/reference-core-pool/comptroller/diamond/facets/flashloan-facet) — flash-loan execution

The facets inherit shared checks and the current `ComptrollerV19Storage` layout from `FacetBase`. Depending on the function, access may be limited to the Unitroller admin, an admin-or-guardian path, or a signature-specific Access Control Manager permission.

## Upgrades and selector inspection

The Unitroller admin can install a new Diamond implementation through the Unitroller's pending-implementation flow. The admin can also call `diamondCut` through the Unitroller to add, replace, or remove selector assignments.

An integration can inspect the current routing through:

* `facetAddress(bytes4)` for one selector;
* `facetFunctionSelectors(address)` for one facet;
* `facetAddresses()` or `facets()` for the full map.

At BNB Chain block `132,749,058`, the Unitroller used five facets. [VIP-640](https://venus.io/governance/proposal/640?chainId=56) installed the Diamond and the PolicyFacet, RewardFacet, SetterFacet and FlashLoanFacet; [VIP-672](https://venus.io/governance/proposal/672?chainId=56) replaced the MarketFacet. See the [live component map](/technical-reference/reference-core-pool/comptroller) for the snapshot addresses.

:::caution
The repository's `DiamondConsolidated` contract exists only to generate a combined ABI and TypeChain type. It is not deployed, and its inherited functions are not proof that the corresponding selectors are live.
:::
