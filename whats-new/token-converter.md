# Token Converter

### Overview

Token Converter Phase 2 replaces the original community-driven Token Converter system with a single, lightweight contract class — `TokenBuyback` — deployed as one instance per (destination, base asset) pair. Conversions are now executed by an ACM-authorized finance-team cron job using DEX aggregators at market rate, eliminating the dependency on external community participation entirely.

Protocol revenues, sourced from reserve interests and liquidations, are processed through the [Automatic Income Allocation](automatic-income-allocation.md) module. Once allocated, these underlying tokens are sent to the appropriate `TokenBuyback` instances, which swap them on a defined schedule and forward the output to the configured destination.

### Problem with the Original System

The original Token Converter relied on external community members to manually trigger token swaps. In practice:

- Tokens sat idle for hours or days waiting for someone to act
- When conversions did happen, the protocol paid up to 50% above market price as an incentive to attract participants
- The system spanned 5 contract classes across 8 deployed instances (~2,000+ lines of Solidity), making it expensive to audit and slow to iterate on
- No guaranteed conversion cadence — protocol income accumulation was unpredictable

### Solution: TokenBuyback

A single upgradeable contract (`TokenBuyback`) is deployed as a Transparent Proxy per (destination, base asset) pair. Each instance:

- Passively accumulates any token sent by `ProtocolShareReserve` (PSR)
- Swaps on demand via `executeBuyback`, which is ACM-restricted to the finance-team cron job
- Forwards the `BASE_ASSET` directly to its `DESTINATION` after each swap

No oracle. No community. No premium. Conversions happen on a defined schedule at market rate using off-chain-built DEX calldata.

### Key Design Decisions

| Aspect | Detail |
|---|---|
| `DESTINATION` & `BASE_ASSET` | Constructor immutables — changing either requires a new deployment |
| Swap routing | Off-chain (cron builds DEX calldata); router must be on the on-chain allowlist |
| `updateAssetsState` caller | Pinned to `PROTOCOL_SHARE_RESERVE` immutable — prevents spoofed `AssetsReceived` events |
| Pool attribution | No per-pool accounting on-chain; `comptroller` is echoed in events for off-chain attribution |
| Upgradeability | Transparent Proxy — upgradeable without migrating accumulated funds |

### Contract Architecture

`PSR` requires no contract changes — `TokenBuyback` implements `IIncomeDestination`, the same interface used by the original converters. The migration is a governance VIP that rewires PSR's `distributionTargets` rows to point to the new instances.

### Key Functions

**`updateAssetsState(address comptroller, address asset)`**

Called by PSR after transferring tokens. Records the balance delta and emits `AssetsReceived` for off-chain tracking. Only callable by `PROTOCOL_SHARE_RESERVE`.

**`executeBuyback(address tokenIn, uint256 amountIn, uint256 minAmountOut, uint256 deadline, address router, bytes calldata routerCalldata, address comptroller)`**

ACM-restricted. Swaps `amountIn` of `tokenIn` to `BASE_ASSET` via the specified router (must be allowlisted). Validates slippage against `minAmountOut`. Forwards the output directly to `DESTINATION`. Emits `BuybackExecuted`.

**`forwardBaseAsset(address comptroller, uint256 amount)`**

ACM-restricted. Forwards a caller-specified `amount` of accumulated `BASE_ASSET` to `DESTINATION` without a swap. The `amount` parameter lets the operator partition multi-pool `BASE_ASSET` inflows so each portion is attributed separately via `BaseAssetForwarded` events.

**`setAllowedRouter(address router, bool allowed)`**

Governance-only. Adds or removes a DEX router from the allowlist.

**`sweepToken(address token, address to, uint256 amount)`**

Governance-only. Emergency token recovery from the contract.

### Events

| Event | When emitted |
|---|---|
| `AssetsReceived(comptroller, asset, amount)` | PSR deposits tokens |
| `BuybackExecuted(tokenIn, amountIn, amountOut, router, comptroller)` | Successful DEX swap |
| `BaseAssetForwarded(comptroller, amount)` | `BASE_ASSET` forwarded without swap |
| `RouterAllowlisted(router, allowed)` | Router added/removed from allowlist |
| `SweepToken(token, to, amount)` | Emergency token sweep |

### BSC: Before & After

**Before (8 contracts)**

| Contract | Destination |
|---|---|
| `RiskFundConverter` | `RiskFundV2` |
| `USDTPrimeConverter` | `PrimeLiquidityProvider` |
| `USDCPrimeConverter` | `PrimeLiquidityProvider` |
| `BTCBPrimeConverter` | `PrimeLiquidityProvider` |
| `ETHPrimeConverter` | `PrimeLiquidityProvider` |
| `XVSVaultConverter` | `XVSVaultTreasury` |
| `WBNBBurnConverter` | Retired (was burn path) |
| `ConverterNetwork` | Retired (registry) |

**After (10 TokenBuyback instances)**

| Instance | Base Asset | Destination |
|---|---|---|
| `UTreasuryBuyback` | U | `VTreasury` |
| `BTCBTreasuryBuyback` | BTCB | `VTreasury` |
| `ETHTreasuryBuyback` | ETH | `VTreasury` |
| `USDTTreasuryBuyback` | USDT | `VTreasury` |
| `USDCTreasuryBuyback` | USDC | `VTreasury` |
| `XVSTreasuryBuyback` | XVS | `VTreasury` |
| `USDTPrimeBuyback` | USDT | `PrimeLiquidityProvider` |
| `UPrimeBuyback` | U | `PrimeLiquidityProvider` |
| `RiskFundBuyback` | USDT | `RiskFundV2` |
| `XVSBuyback` | XVS | `XVSVaultTreasury` |

`WBNBBurnConverter` and `ConverterNetwork` are retired. The 6 `TreasuryBuyback` instances are new — treasury previously accepted arbitrary tokens without conversion.

### RiskFundV2 Changes

`RiskFundV2` is upgraded as part of this migration:

- `poolAssetsFunds` mapping removed — per-pool accounting deprecated (isolated pools wound down; core pool does not auction via Shortfall)
- `preSweepToken` simplified — plain balance check replaces the `getPools()` proportional loop
- `transferReserveForAuction` draws against contract balance; `comptroller` retained only for ABI parity and event attribution
- `getPoolsBaseAssetReserves` returns 0 for ABI parity with `Shortfall.sol`

### Migration

A single VIP per chain handles the full migration:

- **Pre-VIP** — Guardian pauses all existing converters; finance team snapshots balances and validates new contracts on testnet
- **VIP**:
  1. Grant ACM permissions to all 10 buyback instances
  2. Drain old converters into new instances (routed per target `BASE_ASSET`)
  3. Replace PSR `distributionTargets` with 10 new rows summing to `MAX_PERCENT` (10000) per schema
  4. Revoke old ACM permissions
  5. Configure DEX router allowlist on each buyback instance
- **Post-VIP** — Finance team monitors first buyback calls manually before handing off to automated cron

Old converter proxies remain deployed but empty and un-permissioned.

### Impact Summary

| Metric | Before | After |
|---|---|---|
| Solidity lines | ~2,160 across 5 contracts | ~275 lines, single contract class |
| Deployed instances (BSC) | 8 | 10 (all `TokenBuyback`) |
| Conversion trigger | External community (voluntary) | Finance cron (scheduled) |
| Pricing | Oracle + up to 50% premium | DEX market rate |
| Community dependency | Required | None |
