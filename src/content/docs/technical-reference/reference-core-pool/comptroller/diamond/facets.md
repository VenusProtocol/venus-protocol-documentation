---
title: "Facets"
---

Facets contain the BNB Core Pool Comptroller's application logic. They are reached through chained delegate calls from the Unitroller and Diamond.

At BNB Chain block `132,749,058`, the selector map was as follows. [VIP-640](https://venus.io/governance/proposal/640?chainId=56) installed the PolicyFacet, RewardFacet, SetterFacet and FlashLoanFacet; [VIP-672](https://venus.io/governance/proposal/672?chainId=56) replaced the MarketFacet.

| Facet | Responsibility | Live address | Reference |
| --- | --- | --- | --- |
| MarketFacet | Market membership, account delegation, liquidity and pool views | `0x935905A58E91a406eead60cd9AAbC7a64EDAe264` | [API](/technical-reference/reference-core-pool/comptroller/diamond/facets/market-facet) |
| PolicyFacet | vToken policy hooks and liquidity checks | `0x8930B02c69EDd37464B50991680D306Bb9B8FDBD` | [API](/technical-reference/reference-core-pool/comptroller/diamond/facets/policy-facet) |
| RewardFacet | XVS accrual, claim and seizure flows | `0x9e0CCD70b5E0030472D5013bbBd37B6E868d416f` | [API](/technical-reference/reference-core-pool/comptroller/diamond/facets/reward-facet) |
| SetterFacet | Risk, oracle, pause, cap, pool and feature configuration | `0xbc4885e5A27050E321d094503597aC6734AB1871` | [API](/technical-reference/reference-core-pool/comptroller/diamond/facets/setter-facet) |
| FlashLoanFacet | Multi-market flash-loan execution | `0xAC54A4D148690b7FDA22B1D29c4439aCBF668fb2` | [API](/technical-reference/reference-core-pool/comptroller/diamond/facets/flashloan-facet) |

`FacetBase` is inherited shared logic and storage, not a separate runtime facet. It defines `ComptrollerV19Storage` access helpers such as admin-only, admin-or-guardian, and signature-specific Access Control Manager checks.

:::danger
Always call facet selectors through the Unitroller. Never send an application call directly to a facet address. Query `facetAddress(bytes4)` before relying on a selector, because governance can replace or remove individual assignments.
:::
