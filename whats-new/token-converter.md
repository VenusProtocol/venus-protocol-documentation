# TokenBuyback Contract

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
- Enforces a rolling 24h USD cap on per-token consumption (`executeBuyback` reverts past the cap) to bound blast radius if the operator key is compromised
- Uses `ResilientOracle` to USD-price `tokenIn` and `BASE_ASSET` for the cap and for an event-only abnormal-slippage signal

No community. No premium. Conversions happen on a defined schedule at market rate using off-chain-built DEX calldata. Oracle is used only for safety rails (cap + slippage signal), not for swap pricing.

### Key Design Decisions

| Aspect | Detail |
|---|---|
| `DESTINATION` & `BASE_ASSET` | Constructor immutables — changing either requires a new deployment |
| Swap routing | Off-chain (cron builds DEX calldata); router must be on the on-chain allowlist |
| `updateAssetsState` caller | Pinned to `PROTOCOL_SHARE_RESERVE` immutable — prevents spoofed `AssetsReceived` events |
| Pool attribution | No per-pool accounting on-chain; `comptroller` is echoed in events for off-chain attribution |
| Upgradeability | Transparent Proxy — upgradeable without migrating accumulated funds |
| Daily USD cap | Rolling 24h leaky bucket (`dailyCapUsd`); linear decay rate `dailyCapUsd / 24h`; `executeBuyback` reverts with `DailyCapExceeded` past the cap. Default `$30,000`. |
| Abnormal slippage detection | Event-only — `executeBuyback` emits `AbnormalSlippage` when `usdIn − usdOut > slippageEventUsd` (default `$500`). Does not revert. |
| Oracle dependency | `RESILIENT_ORACLE` constructor immutable — used only to USD-price the cap and the slippage signal, not for swap pricing. `executeBuyback` calls `updateAssetPrice(tokenIn)` and `updateAssetPrice(BASE_ASSET)` before reading prices, so the cap and slippage check use a freshly pushed oracle snapshot rather than a stale value. |

### Contract Architecture

`PSR` requires no contract changes — `TokenBuyback` implements `IIncomeDestination`, the same interface used by the original converters. The migration is a governance VIP that rewires PSR's `distributionTargets` rows to point to the new instances.

### Key Functions

**`updateAssetsState(address comptroller, address asset)`**

Called by PSR after transferring tokens. Records the balance delta and emits `AssetsReceived` for off-chain tracking. Only callable by `PROTOCOL_SHARE_RESERVE`. `AssetsReceived` is only emitted when the balance delta is non-zero. The reported amount is the observed `balanceOf(this)` delta against the previous watermark — tokens transferred directly to the contract outside the PSR flow are merged into the next event under whatever comptroller PSR is processing at the time.

**`executeBuyback(address tokenIn, uint256 amountIn, uint256 minAmountOut, uint256 deadline, address router, bytes calldata routerCalldata, address comptroller)`**

ACM-restricted. Swaps `amountIn` of `tokenIn` to `BASE_ASSET` via the specified router (must be allowlisted). Validates slippage against `minAmountOut`. Forwards the output directly to `DESTINATION`. Emits `BuybackExecuted`. The reported `amountIn` in `BuybackExecuted` is the actual on-chain `tokenIn` delta consumed by the router (`balanceBefore − balanceAfter`), not the caller-supplied `amountIn` parameter, so the event is honest about what the router actually pulled. After the swap settles, the call pushes a fresh oracle price for both `tokenIn` and `BASE_ASSET` (`updateAssetPrice`), then enforces the rolling 24h USD cap on `tokenIn` consumption (reverts with `DailyCapExceeded` if exceeded) and emits `AbnormalSlippage` if `usdIn − usdOut` exceeds `slippageEventUsd`.

**`forwardBaseAsset(address comptroller, uint256 amount)`**

ACM-restricted. Forwards a caller-specified `amount` of accumulated `BASE_ASSET` to `DESTINATION` without a swap. The `amount` parameter lets the operator partition multi-pool `BASE_ASSET` inflows so each portion is attributed separately via `BaseAssetForwarded` events.

**`setAllowedRouter(address router, bool allowed)`**

Governance-only. Adds or removes a DEX router from the allowlist.

**`setDailyCapUsd(uint256 newCap)`**

ACM-restricted. Updates the rolling 24h USD cap on `tokenIn` consumption (1e18-scaled). Reverts with `ZeroValueNotAllowed` if `newCap` is zero (the cap cannot be used to fully disable buybacks — use ACM revocation for that). Emits `DailyCapUpdated`.

**`setSlippageEventUsd(uint256 newThreshold)`**

ACM-restricted. Updates the absolute USD threshold above which `AbnormalSlippage` fires (1e18-scaled). Reverts with `ZeroValueNotAllowed` if `newThreshold` is zero. Emits `SlippageEventUsdUpdated`.

**`sweepToken(address token, address to, uint256 amount)`**

Governance-only. Emergency token recovery from the contract. Also the canonical recovery path for tokens transferred directly to the contract outside the PSR flow.

### Events

| Event | When emitted |
|---|---|
| `AssetsReceived(comptroller, asset, amount)` | PSR deposits tokens |
| `BuybackExecuted(tokenIn, amountIn, amountOut, router, comptroller)` | Successful DEX swap |
| `BaseAssetForwarded(comptroller, amount)` | `BASE_ASSET` forwarded without swap |
| `RouterAllowlisted(router, allowed)` | Router added/removed from allowlist |
| `SweepToken(token, to, amount)` | Emergency token sweep |
| `AbnormalSlippage(tokenIn, actualAmountIn, amountOut, usdIn, usdOut)` | Swap returned less USD value than input by more than `slippageEventUsd` |
| `DailyCapUpdated(oldCap, newCap)` | `setDailyCapUsd` succeeds |
| `SlippageEventUsdUpdated(oldThreshold, newThreshold)` | `setSlippageEventUsd` succeeds |

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

**After (10 TokenBuyback instances, deployed on BSC mainnet)**

| Instance | Base Asset | Destination | Proxy address |
|---|---|---|---|
| `UTreasuryBuyback` | U | `VTreasury` | [`0xec63411423D03327De19135446dDdA3055D2feA8`](https://bscscan.com/address/0xec63411423D03327De19135446dDdA3055D2feA8) |
| `BTCBTreasuryBuyback` | BTCB | `VTreasury` | [`0x1F306a0d929a7098a0A0b12248Ba97600AB79026`](https://bscscan.com/address/0x1F306a0d929a7098a0A0b12248Ba97600AB79026) |
| `ETHTreasuryBuyback` | ETH | `VTreasury` | [`0x41954F0bf26959dF2e1B8302DEBf736B5b154B64`](https://bscscan.com/address/0x41954F0bf26959dF2e1B8302DEBf736B5b154B64) |
| `USDTTreasuryBuyback` | USDT | `VTreasury` | [`0xB3dDf13E8B6b8dE10F5826087C202b80F1D1b490`](https://bscscan.com/address/0xB3dDf13E8B6b8dE10F5826087C202b80F1D1b490) |
| `USDCTreasuryBuyback` | USDC | `VTreasury` | [`0xd7aC40f9bd9A1beb8E2d121b4446CF90417cf169`](https://bscscan.com/address/0xd7aC40f9bd9A1beb8E2d121b4446CF90417cf169) |
| `XVSTreasuryBuyback` | XVS | `VTreasury` | [`0x6D2d239c16453062cF145A7a5128A6a60710d236`](https://bscscan.com/address/0x6D2d239c16453062cF145A7a5128A6a60710d236) |
| `USDTPrimeBuyback` | USDT | `PrimeLiquidityProvider` | [`0xD721932C7CA41Eb5305867287010587a266346a8`](https://bscscan.com/address/0xD721932C7CA41Eb5305867287010587a266346a8) |
| `UPrimeBuyback` | U | `PrimeLiquidityProvider` | [`0xBC9fFBfb799B2d189669D3816E2B7273c69041bd`](https://bscscan.com/address/0xBC9fFBfb799B2d189669D3816E2B7273c69041bd) |
| `RiskFundBuyback` | USDT | `RiskFundV2` | [`0x0c71EFabD00329E839745ef23aB946d3ed24A805`](https://bscscan.com/address/0x0c71EFabD00329E839745ef23aB946d3ed24A805) |
| `XVSBuyback` | XVS | `XVSVaultTreasury` | [`0x637E6246BBb0F9aBae9d764F5e1bB6347f028C12`](https://bscscan.com/address/0x637E6246BBb0F9aBae9d764F5e1bB6347f028C12) |

`WBNBBurnConverter` and `ConverterNetwork` are retired. The 6 `TreasuryBuyback` instances are new — treasury previously accepted arbitrary tokens without conversion.

### RiskFundV2 Changes

`RiskFundV2` is upgraded as part of this migration:

- `poolAssetsFunds` mapping removed — per-pool accounting deprecated (isolated pools wound down; core pool does not auction via Shortfall)
- `preSweepToken` simplified — plain balance check replaces the `getPools()` proportional loop
- `transferReserveForAuction` draws against contract balance; `comptroller` retained only for ABI parity and event attribution
- `getPoolsBaseAssetReserves` returns 0 for ABI parity with `Shortfall.sol`

### Migration

BSC mainnet migration executed across two governance proposals — [VIP-620](https://app.venus.io/#/governance/proposal/620?chainId=56) and [VIP-621](https://app.venus.io/#/governance/proposal/621?chainId=56) ([vips PR #708](https://github.com/VenusProtocol/vips/pull/708)). The work was originally proposed as a single transaction in [VIP-618](https://app.venus.io/#/governance/proposal/618?chainId=56), which became unexecutable when BSC's Osaka hardfork enforced a hard per-tx gas cap of 2^24 = 16,777,216: the single-call `helper.execute()` required ~17.5M gas, driven primarily by the converter drain (6 converters × 47 core-pool tokens) and the router allowlist (10 buybacks × 9 routers). Splitting the drain + router allowlist into a separate `execute2()` entrypoint drops both halves comfortably under the cap.

**Pre-VIP** (deploy-script setup):

- 10 new `TokenBuyback` proxies redeployed (the proxies originally deployed for VIP-618 are abandoned), each initialized with its `(DESTINATION, BASE_ASSET, PROTOCOL_SHARE_RESERVE, RESILIENT_ORACLE)` immutables and `pendingOwner = TokenBuybackMigrationHelper`
- New `RiskFundV2` implementation deployed (see *RiskFundV2 Changes* above)
- `TokenBuybackMigrationHelper` redeployed with three one-shot entrypoints — `execute1()`, `executeSwap()` and `execute2()` — each gated to `NormalTimelock`

**VIP-620 (Part 1)** — non-drain, non-allowlist phase plus the May 2026 Prime Rewards Allocation:

1. Grant `DEFAULT_ADMIN_ROLE` on ACM to the helper (renounced inside `execute1()` so the helper retains no residual ACM privilege between the two VIPs)
2. Transfer ownership of the 6 timelock-owned legacy converters to the helper
3. `helper.execute1()` accepts all 16 ownerships, pauses every timelock-owned converter and `Shortfall` auctions, repoints PSR's `distributionTargets` to the new buybacks (18 rows added, 12 stale rows zeroed, in a sequence that respects PSR's `maxLoopsLimit` and the per-schema percentage invariant at every checkpoint), grants the cron operator persistent `executeBuyback` + `forwardBaseAsset` ACM permissions on every buyback, and renounces `DEFAULT_ADMIN_ROLE`. The helper retains ownership of all 16 contracts across the gap between the two VIPs but holds no ACM privileges.
4. May 2026 Prime Rewards Allocation, driven directly from `NormalTimelock` (the helper only wraps the swap leg): `Prime.addMarket(coreComptroller, vU, ...)`, `PrimeLiquidityProvider.initializeTokens([U])`, `PrimeLiquidityProvider.setMaxTokensDistributionSpeed([U], [1e18])`, `PrimeLiquidityProvider.sweepToken(USDC, helper, 10_000e18)`, `helper.executeSwap()` (single soft-failing USDC → USDT → U multihop on PancakeSwap V3 with a 1% slippage floor; the deep USDT/U pool is required because the direct USDC/U pool is too thin), `PrimeLiquidityProvider.setTokensDistributionSpeed([USDT, U], [...])`.
5. Upgrade `RiskFundV2` to the new implementation. Safe because `RiskFundConverter` was paused inside `execute1()`, so no in-flight `convertExactTokens` callback can reach the removed `updatePoolState` selector.

**Between Part 1 and Part 2**: the 6 legacy converters are paused, PSR no longer routes revenue to them, and `Shortfall` auctions are paused — so converter balances are frozen and there is no economic surface from them while the helper still holds ownership.

**VIP-621 (Part 2)** — router allowlist, converter drain, ownership handback:

1. `helper.execute2()` allowlists 9 swap routers on every buyback (PancakeSwap V2 / V3 / Smart / Universal, Uniswap V2 SwapRouter02 / V3 SwapRouter02 / V4 / Universal, 1inch v5), drains every non-zero core-pool ERC20 balance off each timelock-owned converter into its replacement buyback, and transfers ownership of all 16 contracts (10 buybacks + 6 converters) back to `NormalTimelock`.
2. `NormalTimelock` accepts ownership of all 16 contracts.

**Post-VIP**:

- The 6 timelock-owned legacy converters (`RiskFundConverter`, `USDTPrimeConverter`, `USDCPrimeConverter`, `BTCBPrimeConverter`, `ETHPrimeConverter`, `XVSVaultConverter`) remain deployed but are paused and empty
- `WBNBBurnConverter` is Guardian-owned and was not handed to the helper; its sub-dollar residual is drained in a separate multisig transaction, and its PSR distribution row was already removed inside `execute1()`
- `ConverterNetwork` is unreferenced — no contract changes were needed to it
- All 10 new buybacks are owned by `NormalTimelock` and ready to receive PSR distributions
- The finance-team cron operator can now call `executeBuyback` and `forwardBaseAsset` on each buyback via its ACM permissions
- The migration helper holds no privileges, no balances, and no ownership over any contract; all three entrypoints revert `AlreadyExecuted` on any subsequent call
- Pre-existing ACM grants on legacy converter functions are not explicitly revoked; conversions are paused, which renders those permissions inert

### Impact Summary

| Metric | Before | After |
|---|---|---|
| Solidity lines | ~2,160 across 5 contracts | ~425 lines, single contract class |
| Deployed instances (BSC) | 8 | 10 (all `TokenBuyback`) |
| Conversion trigger | External community (voluntary) | Finance cron (scheduled) |
| Pricing | Oracle + up to 50% premium | DEX market rate |
| Community dependency | Required | None |
