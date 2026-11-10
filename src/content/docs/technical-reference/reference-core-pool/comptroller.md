---
title: "Comptroller"
---

This section applies only to the BNB Chain Core Pool Comptroller. The entry point is the Unitroller at [`0xfD36E2c2a6789Db23113685031d7F16329158384`](https://bscscan.com/address/0xfD36E2c2a6789Db23113685031d7F16329158384).

Calls follow this path:

```text
caller → Unitroller → Diamond implementation → facet selected by msg.sig
```

State remains in the Unitroller context throughout the chained delegate calls. Integrations call the Unitroller address, not the Diamond or facet addresses.

## Live version map

At BNB Chain block `132,749,058`, the Unitroller reported:

| Component | Address |
| --- | --- |
| Unitroller entry point | `0xfD36E2c2a6789Db23113685031d7F16329158384` |
| Diamond implementation | `0xA66B2b5D50ce68A125bBad6B2265b637868c6E66` |
| ComptrollerLens | `0x989DaAa33b9557EacB2AF9885d7f3cd28eD52749` |
| Admin | `0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396` |

The live Diamond selector map contained five facets:

| Facet | Address |
| --- | --- |
| MarketFacet | `0x935905A58E91a406eead60cd9AAbC7a64EDAe264` |
| PolicyFacet | `0x8930B02c69EDd37464B50991680D306Bb9B8FDBD` |
| RewardFacet | `0x9e0CCD70b5E0030472D5013bbBd37B6E868d416f` |
| SetterFacet | `0xbc4885e5A27050E321d094503597aC6734AB1871` |
| FlashLoanFacet | `0xAC54A4D148690b7FDA22B1D29c4439aCBF668fb2` |

The Diamond implementation and the PolicyFacet, RewardFacet, SetterFacet and FlashLoanFacet were installed by [VIP-640](https://venus.io/governance/proposal/640?chainId=56); their matching stable repository release is [venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/releases/tag/v10.3.0), which uses `ComptrollerV19Storage`. [VIP-672](https://venus.io/governance/proposal/672?chainId=56) replaced the MarketFacet, adding `enterMarketForAccount(address,address)`, and the ComptrollerLens, which now computes liquidation seize amounts with a single division. The first stable release containing the new MarketFacet code is [venus-protocol v10.4.0](https://github.com/VenusProtocol/venus-protocol/releases/tag/v10.4.0).

:::caution
The addresses and selector routing are upgradeable. Before encoding a call, read `comptrollerImplementation`, `facetAddress(bytes4)`, or `facets()` through the Unitroller. A function present in a repository or generated page is not necessarily installed at the live proxy.
:::

## ABI selection

Use the Unitroller admin ABI for proxy administration and the ABI of the facet currently assigned to each application selector. [DiamondConsolidated](/technical-reference/reference-core-pool/comptroller/diamond/diamond-consolidated) is a build-time ABI aggregate; it is not deployed and does not prove live selector availability.

The [Diamond reference](/technical-reference/reference-core-pool/comptroller/diamond) documents selector inspection and the current facet families. `FacetBase` supplies shared storage and checks to facets; it is not a separate call target.

Core Pools on other networks use a different Comptroller architecture. Start with the [Core Pool architecture map](/technical-reference/reference-core-pool) before choosing an ABI.
