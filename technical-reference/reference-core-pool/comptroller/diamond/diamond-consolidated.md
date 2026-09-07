# DiamondConsolidated

`DiamondConsolidated` inherits the Diamond and all five facet contracts to generate a convenient combined ABI and TypeChain type.

It is a build-time artifact and is too large to deploy. It has no runtime address, and it must not be treated as the Unitroller implementation or as evidence that every inherited selector is currently installed.

Use the combined ABI to decode calls only after checking the selector against `facetAddress(bytes4)` or `facets()` on the live Unitroller. See the [BNB Core Pool Comptroller version map](../README.md).

Source: [DiamondConsolidated.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Comptroller/Diamond/DiamondConsolidated.sol).
