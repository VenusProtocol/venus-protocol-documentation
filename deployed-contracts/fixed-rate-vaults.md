# Fixed Term Vaults

Core contracts for the Fixed Term Vaults system. Each institution's vault is deployed as an EIP-1167 clone by governance via `createVault(...)` on `InstitutionalVaultController`. The canonical, always-current list of deployed vaults lives on-chain — query the controller's `allVaults` array (or the `VaultCreated` event log). The vaults known at the time of writing are listed below for convenience.

## BNB Chain Mainnet

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0x6D9e91cB766259af42619c14c994E694E57e6E85`](https://bscscan.com/address/0x6D9e91cB766259af42619c14c994E694E57e6E85)
* InstitutionPositionToken: [`0x3Ed56f6937fc8549f9325405d1e8E650739647Fa`](https://bscscan.com/address/0x3Ed56f6937fc8549f9325405d1e8E650739647Fa)
* LiquidationAdapter (proxy): [`0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd`](https://bscscan.com/address/0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd)

#### Deployed vaults

* Vault, position token ID `1`: [`0x7D80A10bEdD13638888e7A946B82878E21fbB820`](https://bscscan.com/address/0x7D80A10bEdD13638888e7A946B82878E21fbB820) — USDT supplied against XAUM collateral, 6% fixed rate over a 30-day term.

#### Liquidation whitelist

Liquidation entry points on each vault are reachable only through the `LiquidationAdapter`, which keeps two independent, governance-managed lists: one for health-based liquidators and one for overdue settlers (set via `setLiquidatorWhitelist` and `setSettlerWhitelist`). As currently configured on BNB Chain mainnet, both lists contain a single entry — the Venus Critical Guardian multisig [`0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9`](https://bscscan.com/address/0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9) — so it is the only address that can currently perform either a health-based or an overdue liquidation. Governance can add or remove entries on either list at any time. The permissionless `repayBadDebt` path on each vault is independent of these lists and remains open to any address.

## BNB Chain Testnet

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0xf77dED2A00F94e33C392126238360D4642c16Ba2`](https://testnet.bscscan.com/address/0xf77dED2A00F94e33C392126238360D4642c16Ba2)
* InstitutionPositionToken: [`0x71dA473257a96e975558C8edD8491AD0880EFCe5`](https://testnet.bscscan.com/address/0x71dA473257a96e975558C8edD8491AD0880EFCe5)
* LiquidationAdapter (proxy): [`0x4b302b56315Ca16A0A4565108e62404496916491`](https://testnet.bscscan.com/address/0x4b302b56315Ca16A0A4565108e62404496916491)
