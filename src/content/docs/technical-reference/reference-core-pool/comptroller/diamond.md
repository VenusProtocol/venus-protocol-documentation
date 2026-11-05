---
title: "BNB Core Pool Diamond"
---

The Diamond is the BNB Core Pool Unitroller's implementation. It routes application selectors to independently upgradeable facets while preserving state in the Unitroller.

* [Diamond selector management and inspection](/technical-reference/reference-core-pool/comptroller/diamond/diamond)
* [DiamondConsolidated build-time ABI](/technical-reference/reference-core-pool/comptroller/diamond/diamond-consolidated)
* [Facet version map and API pages](/technical-reference/reference-core-pool/comptroller/diamond/facets)

The live component addresses and snapshot block are recorded in the [BNB Core Pool Comptroller version map](/technical-reference/reference-core-pool/comptroller).

:::caution
Call application functions through the Unitroller. Calling a facet directly does not operate on the Unitroller's storage and is not a supported integration path.
:::
