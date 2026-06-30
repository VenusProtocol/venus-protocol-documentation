# Risk Stewards

The Risk Stewards system is a permissioned, automated pipeline for applying a bounded set of risk-parameter changes to Venus markets without a manual governance proposal for each one. Whitelisted risk providers publish recommendations to a Venus-owned on-chain oracle; the protocol validates each one, applies small changes immediately, holds larger ones behind a timelock, and bridges changes destined for other chains over LayerZero. Governance keeps control of everything that matters: who may publish, who may execute held updates, the bounds, and an emergency pause.

It currently supports four update types: `supplyCap`, `borrowCap`, `collateralFactors` (collateral factor and liquidation threshold, set together), and `interestRateModel`. Anything outside this set still requires a full VIP.

This article describes the contracts and the update lifecycle. For function-level signatures, structs, events, and errors, see the reference page linked under each contract.

## Architecture

<figure><img src="../../.gitbook/assets/risk-stewards-architecture.svg" alt="Risk Stewards architecture: providers publish to the Risk Oracle on BNB Chain; the RiskStewardReceiver routes updates to local stewards or forwards them over LayerZero to a Destination Steward Receiver on remote chains; governance configures the whole system"><figcaption><p>Providers publish to the Risk Oracle on BNB Chain; the RiskStewardReceiver applies updates locally or bridges them to a Destination Steward Receiver on remote chains. Governance configures and gates the whole pipeline.</p></figcaption></figure>

BNB Chain is the **source chain**: it hosts the oracle and the source-chain receiver. Every update is published there, even ones destined for another chain. Each supported chain (including BNB Chain itself) hosts the steward contracts that perform the actual change, plus a destination receiver on non-source chains.

**[Risk Oracle](../reference-governance/risk-oracle.md)** is the single source of truth for recommendations. A whitelisted provider calls `publishRiskParameterUpdate(referenceId, newValue, updateType, market, poolId, dstEid, additionalData)`; the oracle assigns a monotonic `updateId`, records the previous value for history, and emits `UpdatePublished`. Senders are added and removed only by governance (`addAuthorizedSender` / `removeAuthorizedSender`), as are the supported update-type strings (`addUpdateType`, `setUpdateTypeActive`). The oracle only stores recommendations; it never touches the protocol itself.

**[RiskStewardReceiver](../reference-governance/risk-steward-receiver.md) (RSR)** on BNB Chain is where updates are processed. `processUpdate(updateId)` is permissionless: anyone can push a published update through the pipeline. The RSR holds a per-type config (`riskParameterConfigs`) mapping each update type to its steward, a `debounce` period, and a `timelock`, all set by governance. It validates the update, decides the execution path, and either applies it locally, registers it behind a timelock, or forwards it cross-chain.

**[DestinationStewardReceiver](../reference-governance/destination-steward-receiver.md) (DSR)** lives on each non-source chain. It receives bridged updates over LayerZero, registers them with status `Pending`, and holds them for a fixed `remoteDelay` (6 hours by default) before a whitelisted executor applies them.

**Risk Stewards** do the actual writing. All three inherit **[BaseRiskSteward](../reference-governance/base-risk-steward.md)**, which holds the `safeDeltaBps` bound and enforces that `applyUpdate` may only be called by the steward's receiver (`OnlyRiskStewardReceiver`). Each steward owns one parameter family:

| Steward | Update type(s) | Encoded `newValue` | Writes via |
| --- | --- | --- | --- |
| [MarketCapsRiskSteward](../reference-governance/market-caps-risk-steward.md) | `supplyCap`, `borrowCap` | one `uint256` | `setMarketSupplyCaps` / `setMarketBorrowCaps` |
| [CollateralFactorsRiskSteward](../reference-governance/collateral-factors-risk-steward.md) | `collateralFactors` | two `uint256` (CF, LT) | `setCollateralFactor` |
| [IRMRiskSteward](../reference-governance/irm-risk-steward.md) | `interestRateModel` | one `address` | `_setInterestRateModel` (core) / `setInterestRateModel` (isolated) |

## Update types and encoding

Each update carries its new value as opaque ABI-encoded `bytes`. Passing it this way is deliberate: one `newValue` field (and so a single `publishRiskParameterUpdate` entry point and one update struct) can express payloads of completely different shapes. A market cap is a single number, collateral factors are a pair (the factor and its liquidation threshold), and an interest rate model is an address; each steward decodes the bytes into the shape it expects and rejects anything of the wrong length. New parameter types can therefore be added later without changing the oracle or receiver interfaces.

The encoding per type (type strings are case-sensitive):

```text
supplyCap / borrowCap   abi.encode(uint256)            // 18-decimal amount
collateralFactors       abi.encode(uint256, uint256)   // collateral factor, liquidation threshold (both required)
interestRateModel       abi.encode(address)            // new IRM contract
```

`poolId` selects the pool: `0` for core-pool and isolated-pool markets, and a non-zero group id for an eMode pool inside the core pool. `dstEid` is `0` (or the source chain's own endpoint id) for a local BNB Chain update, or a LayerZero endpoint id for a remote chain.

## Validation and routing

`processUpdate` is permissionless, and that is safe by design: every safety property lives in the validation below and in the steward bounds, not in gating who may call it; the caller only supplies the gas. Before acting, the RSR validates the update:

* the update type's config is **active**;
* it is the **latest** published update for that market and type: a newer recommendation supersedes an older one, which then reverts as `UpdateIsExpired`, so a provider corrects a mistake simply by publishing again;
* it has **not expired** (updates are valid for `UPDATE_EXPIRATION_TIME`, 2 days, from publication) and has **not already been resolved** (executed, rejected, or expired);
* registering it behind a timelock would not push the unlock time past that 2-day expiry (`UpdateWillExpireBeforeUnlock`), so the system never parks an update that could never be executed in time; and
* for local updates, the **debounce** window since the last applied change for that `(market, updateType)` has passed, and no other non-expired pending update of the same type is already registered.

Debounce and timelock are different levers: **debounce** rate-limits how often a given market/type can change at all; **timelock** delays an individual large change so it can be reviewed. A change can clear debounce yet still be timelocked. Once validated, the RSR asks the steward whether the change is safe for immediate execution and routes it down one of three paths: local-immediate, local-timelocked, or cross-chain.

## Local execution: immediate vs. timelocked

<figure><img src="../../.gitbook/assets/risk-stewards-local-flow.svg" alt="Local update flow on BNB Chain: provider publishes to the Risk Oracle, anyone calls processUpdate on the RiskStewardReceiver, which either applies the change immediately when it is within the safe delta or registers it behind a timelock for an executor to apply"><figcaption><p>A local (BNB Chain) update. Within the safe delta it applies immediately; otherwise it is registered behind a timelock and applied later by a whitelisted executor.</p></figcaption></figure>

The split is decided by the steward's `isSafeForDirectExecution`, which compares the new value against the live on-chain value using `safeDeltaBps`:

* **Market caps** execute immediately when the change is within `±safeDeltaBps` of the current cap, but only if the current cap is non-zero. Setting a cap from zero always takes the timelock, because there is no baseline to bound the change against.
* **Collateral factors** execute immediately only when *both* the collateral factor and the liquidation threshold move within `safeDeltaBps`, and neither current value is zero. **eMode** updates (`poolId != 0`) always take the timelock; eMode runs at higher leverage, so its collateral changes are never auto-applied.
* **Interest rate model** changes *always* take the timelock: an IRM is a contract address, so there is no meaningful "small change" to bound.

A redundant update (new value equal to the current one) reverts with `RedundantValue`.

The bound is symmetric and per-steward. `safeDeltaBps` is applied to the absolute difference (`|new − current| ≤ safeDeltaBps × current`), so a 50% bound permits a move of up to ±50% in either direction. Each steward holds its own bound, set independently by governance: at launch the Market Caps steward uses 50% and the Collateral Factors steward 10%; collateral factors and liquidation thresholds bear directly on account solvency, so they are allowed a far smaller automatic move than caps.

When the change is safe, the RSR applies it in the same `processUpdate` transaction. Otherwise it registers the update with `unlockTime = now + timelock` and status `Pending`; after the timelock a **whitelisted executor** calls `executeRegisteredUpdate(updateId)` to apply it, or `rejectUpdate(updateId)` to discard it. A registered update that is neither executed nor rejected within the 2-day window expires.

## Cross-chain execution

<figure><img src="../../.gitbook/assets/risk-stewards-remote-flow.svg" alt="Remote update flow: provider publishes on BNB Chain, the RiskStewardReceiver forwards the update over LayerZero to the Destination Steward Receiver on the target chain, which holds it for the remote delay before a whitelisted executor applies it through the local steward"><figcaption><p>A remote update is forwarded over LayerZero, registered on the destination chain, held for the remote delay, then applied by a whitelisted executor through the destination-chain steward.</p></figcaption></figure>

When `dstEid` points at another chain, the RSR never executes locally. It registers the update and forwards it over LayerZero with `lzSend`; the local status becomes `SENT_TO_DESTINATION`. If a bridge message fails to deliver, a whitelisted executor can re-send it with `resendRemoteUpdate`.

On the destination chain the DSR receives the message (`_lzReceive`), registers it as `Pending`, and stamps its arrival time. A whitelisted executor on that chain calls `executeUpdate(updateId)` once `remoteDelay` has elapsed and before the 2-day expiry, or `rejectUpdate(updateId)` to discard it. The write is performed by the same kind of steward as on the source chain. Remote updates therefore always pass through a delay and an executor; there is no immediate cross-chain path.

Two design choices make this robust. First, the delay clock lives on the destination, not the source: the RSR is a LayerZero OApp sender and the DSR a receiver, and because bridge latency is unpredictable the DSR measures `remoteDelay` from the message's *arrival* time. Its config carries no timelock field at all (only a steward, a debounce, and the chain-wide `remoteDelay`), so locally the forwarded update is recorded with an immediate unlock and status `SENT_TO_DESTINATION` purely as bookkeeping, while the real wait plays out on the destination. Second, the RSR pays the LayerZero messaging fee from its own native balance (funded through its `receive()` and recoverable by governance with `sweepNative`), so the `processUpdate` caller never pre-pays the bridge, and a message that fails to deliver can be re-sent with `resendRemoteUpdate` rather than re-published.

## Roles and governance

| Role | Capability | Granted by |
| --- | --- | --- |
| Risk parameter providers | Publish recommendations; may also call `processUpdate` for their own | Governance (ACM) |
| Anyone | Call `processUpdate` | Permissionless |
| Whitelisted executors | Execute / reject timelocked and remote updates; resend failed bridges | Governance (ACM) |
| Governance / ACM | Whitelist providers & executors; set debounce, timelock, `safeDeltaBps`, `remoteDelay`; register update types; pause the RSR | DAO (VIP) |

The framework never bypasses governance. Stewards can only touch the four supported parameters, and only within governance-set bounds; larger, IRM, and eMode changes are delayed and vetoable; updates expire and cannot be replayed; and governance can pause processing or remove a provider at any time. The framework was enabled on BNB Chain in [VIP-592](https://app.venus.io/#/governance/proposal/592?chainId=56), which onboarded Allez Labs as the first external risk provider; at launch governance set a 3-day debounce, a 6-hour timelock, a 50% safe delta for market caps, and a 10% safe delta for collateral factors.

## Further reading

* [Risk Oracle & Risk Stewards (overview)](../../risk/risk-oracle-and-risk-stewards.md)
* Contract references: [Risk Oracle](../reference-governance/risk-oracle.md) · [RiskStewardReceiver](../reference-governance/risk-steward-receiver.md) · [DestinationStewardReceiver](../reference-governance/destination-steward-receiver.md) · [BaseRiskSteward](../reference-governance/base-risk-steward.md) · [MarketCapsRiskSteward](../reference-governance/market-caps-risk-steward.md) · [CollateralFactorsRiskSteward](../reference-governance/collateral-factors-risk-steward.md) · [IRMRiskSteward](../reference-governance/irm-risk-steward.md)
* [VIP-592: Risk Stewards Framework Implementation](https://app.venus.io/#/governance/proposal/592?chainId=56)
* [Repository](https://github.com/VenusProtocol/governance-contracts)
