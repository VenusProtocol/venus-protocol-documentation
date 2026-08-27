# Legacy Isolated Pools

## Status

The standalone Isolated Pools product has been fully deprecated on BNB Chain, Ethereum, and Arbitrum. Its navigation and market screens have been removed, and new supply and borrow activity in these pools is no longer available through the Venus interface.

These pools were separate collections of lending markets with their own assets and risk configurations. Their contracts and existing positions remain on-chain. If you still have supplied assets, an outstanding borrow, or unclaimed rewards in one of these pools, follow the [exit and rewards guide](../guides/isolated-pools-deprecation.md).

## Do not confuse Isolated Pools with Isolation Mode

The retirement of standalone Isolated Pools does not affect the Core Pool or [Isolation Mode](isolated-e-mode.md). Isolation Mode applies borrowing restrictions to selected collateral within the Core Pool; it does not move funds into a standalone isolated pool.

## Technical references

The retirement applies to the standalone product and its interface, not to the entire underlying codebase or every shared component. Some components from the Isolated Pools architecture also support active deployments, including Core Pools.

The [Isolated Pools technical reference](../technical-reference/reference-isolated-pools/README.md) documents this architecture, while [deployed market addresses](../deployed-contracts/markets.md) remain available for developers and legacy position holders who need to inspect deployed contracts. Neither reference should be interpreted as making the standalone product available for new activity through the Venus interface.
