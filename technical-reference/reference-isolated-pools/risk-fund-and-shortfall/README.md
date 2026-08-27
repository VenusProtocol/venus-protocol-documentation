# Protocol reserves, RiskFundV2, and legacy Shortfall

The contracts in this section do not share one lifecycle. The standalone Isolated Pools product and its new-auction flow are deprecated, but the protocol-reserve contracts remain part of the current income architecture.

| Component | Lifecycle | Scope |
|---|---|---|
| [ProtocolShareReserve](protocol-share-reserve.md) | Current | Records and distributes protocol income for Core and isolated-pool deployments according to on-chain configuration. It is not deprecated with the standalone Isolated Pools interface. |
| [RiskFundV2](risk-fund-v2.md) | Current on BNB Chain mainnet | Holds protocol-controlled raw token balances and receives the output of `RiskFundBuyback`. Per-pool accounting was removed in the VIP-620/VIP-621 migration. |
| [RiskFundV2 storage](risk-fund-storage.md) | Current compatibility reference | Includes active fields and deprecated slots that must remain in place for proxy-upgrade safety. |
| [Shortfall](shortfall.md) | Deployed legacy/recovery | The BNB Chain mainnet auction path is paused and all registered pools were `NOT_STARTED` at the recorded audit block. Historical token-transfer debt can still require recovery. |

For the current conceptual flow, see [Protocol income, RiskFundV2, and bad-debt handling](../../../risk/risk-fund-and-shortfall-handling.md). For the dated auction design and safety boundaries, see [Shortfall and auctions](../../reference-technical-articles/shortfall-and-auctions.md). The BNB converter migration is documented under [TokenBuyback](../../../whats-new/token-converter.md).
