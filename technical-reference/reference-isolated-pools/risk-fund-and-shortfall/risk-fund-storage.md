# RiskFundV2 storage layout

This page records the linearized storage layout compiled for the BNB Chain mainnet RiskFundV2 implementation [`0x01BE9c56A0844040b2c1a684B1a72cE88489486a`](https://bscscan.com/address/0x01BE9c56A0844040b2c1a684B1a72cE88489486a). It includes inherited OpenZeppelin and AccessControlled storage, active RiskFundV2 fields, deprecated legacy positions, and reserved gaps.

Source and compiler artifact: [`protocol-reserve@eaed4e3`](https://github.com/VenusProtocol/protocol-reserve/blob/eaed4e323edd44bf87b5be1e56522fc772cb5990/deployments/bscmainnet/RiskFundV2_Implementation.json).

{% hint style="danger" %}
Deprecated fields and gaps are part of the proxy's storage compatibility. They must not be deleted, compressed, reordered, or reused without a storage-safe upgrade analysis. Source declaration order alone is not sufficient to infer physical slots; use the exact compiler storage layout for the implementation being reviewed.
{% endhint %}

## Linearized slots

| Slot or range | Field | Status and origin |
|---:|---|---|
| 0 | `_initialized`, `_initializing` | OpenZeppelin `Initializable`; packed in one slot. |
| 1–50 | `__gap[50]` | `ContextUpgradeable` compatibility gap. |
| 51 | `_owner` | Active `OwnableUpgradeable` owner. |
| 52–100 | `__gap[49]` | Ownable compatibility gap. |
| 101 | `_pendingOwner` | Active `Ownable2StepUpgradeable` pending owner. |
| 102–150 | `__gap[49]` | Ownable2Step compatibility gap. |
| 151 | `_accessControlManager` | Active `AccessControlledV8` ACM address. |
| 152–200 | `__gap[49]` | AccessControlled compatibility gap. |
| 201 | `__deprecatedSlot1` | Former asset-reserve accounting slot; deprecated. |
| 202 | `__deprecatedSlotPoolAssetsFunds` | Former per-pool fund ledger; deprecated in the VIP-620/VIP-621 migration. |
| 203 | `__deprecatedSlot2` | Former PoolRegistry slot; deprecated. |
| 204 | `__deprecatedSlot3` | Former status slot; deprecated. |
| 205–250 | `ReserveHelpersStorage.__gap[46]` | Reserved compatibility gap. |
| 251 | `maxLoopsLimit` | Deprecated value retained for storage compatibility. |
| 252–300 | `MaxLoopsLimitHelpersStorage.__gap[49]` | Reserved compatibility gap. |
| 301 | `convertibleBaseAsset` | Active base-asset address. |
| 302 | `shortfall` | Active configured Shortfall caller. |
| 303 | `pancakeSwapRouter` | Former in-contract conversion setting; deprecated/private. |
| 304 | `minAmountToConvert` | Former conversion threshold; deprecated/private. |
| 305 | `_status` | Active `ReentrancyGuardUpgradeable` state. |
| 306–354 | `ReentrancyGuardUpgradeable.__gap[49]` | Reserved compatibility gap. |
| 355 | `__deprecatedSlotRiskFundConverter` | Former converter callback address; deprecated after the callback path was removed. |

## RiskFund-specific project storage

Excluding the OpenZeppelin base contracts shown separately in the slot table, the RiskFund-specific storage inheritance is:

```text
ReserveHelpersStorage ─────────┐
                              ├─ RiskFundV1Storage ─ RiskFundV2Storage
MaxLoopsLimitHelpersStorage ───┘
```

Only `convertibleBaseAsset` and `shortfall` are active RiskFund-specific configuration fields in the current logic. `maxLoopsLimit` remains publicly readable but is no longer consumed by current RiskFundV2 functions. The old asset-reserve, per-pool, PoolRegistry, status, router, minimum-conversion, and converter-callback positions are deliberately retained as deprecated storage.

For callable behavior, see [RiskFundV2](risk-fund-v2.md). Do not use this page as a substitute for comparing storage layouts before a future proxy upgrade.
