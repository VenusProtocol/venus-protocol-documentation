# BNB Core Pool Diamond

The Diamond is the BNB Core Pool Unitroller's implementation. It routes application selectors to independently upgradeable facets while preserving state in the Unitroller.

* [Diamond selector management and inspection](diamond.md)
* [DiamondConsolidated build-time ABI](diamond-consolidated.md)
* [Facet version map and API pages](facets/README.md)

The live component addresses and snapshot block are recorded in the [BNB Core Pool Comptroller version map](../README.md).

{% hint style="warning" %}
Call application functions through the Unitroller. Calling a facet directly does not operate on the Unitroller's storage and is not a supported integration path.
{% endhint %}
