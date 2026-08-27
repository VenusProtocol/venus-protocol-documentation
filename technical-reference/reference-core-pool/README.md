# Core Pool Technical Reference

“Core Pool” is a product label, not a single contract architecture. Select the reference for the deployment you are integrating with.

## Architecture map

| Deployment | Comptroller architecture | Market architecture | Source repository |
| --- | --- | --- | --- |
| BNB Chain Core Pool | Unitroller proxy → Diamond → selector-routed facets | VBep20Delegator/VBep20Delegate for ERC-20 assets; standalone VBNB for native BNB | [venus-protocol](https://github.com/VenusProtocol/venus-protocol) |
| Ethereum, opBNB, Arbitrum, ZKsync, Optimism, Base, and Unichain Core Pools | BeaconProxy Comptroller | BeaconProxy VToken | [isolated-pools](https://github.com/VenusProtocol/isolated-pools) |

{% hint style="danger" %}
Do not use the BNB Core Pool ABI for a Core Pool on another network. Those deployments use the same architecture as the contracts historically documented under “Isolated Pools,” even when the pool is named Core Pool in the interface.
{% endhint %}

## Choose the correct reference

For the BNB Chain Core Pool, use:

* [BNB Core Comptroller](comptroller/README.md)
* [BNB Core vTokens](vtoken.md)
* [Diamond Comptroller architecture](../reference-technical-articles/diamond-comptroller.md)

For every other Core Pool, use:

* [BeaconProxy Comptroller](../reference-isolated-pools/comptroller/comptroller.md)
* [BeaconProxy VToken](../reference-isolated-pools/vtoken/vtoken.md)

The deployed address determines the runtime version. Resolve the proxy or beacon implementation at the block you are querying, then use an ABI generated from that implementation. Current market and Comptroller addresses are listed in [Deployed Markets](../../deployed-contracts/markets.md).

## Generated API pages

Many child pages are generated from a repository source release. They describe that source contract, but they do not prove that every selector is available at every deployed address. For BNB Diamond functions, query the live selector map. For beacon-based deployments, resolve the live beacon implementation.
