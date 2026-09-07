# Fixed Term Vaults

Core contracts for the Fixed Term Vaults system. Each institution's vault is deployed as an EIP-1167 clone by governance via `createVault(...)` on `InstitutionalVaultController`. The canonical, always-current list of deployed vaults lives on-chain — query the controller's `allVaults` array (or the `VaultCreated` event log). The vaults known at the time of writing are listed below for convenience.

The stable implementation and deployment baseline is [`fixed-rate-vaults` v1.0.0](https://github.com/VenusProtocol/fixed-rate-vaults/tree/v1.0.0). Proxy implementations, vault state, terms, balances, pause levels, owners, permissions, and liquidation whitelists can change. Verify the live controller, vault, and adapter before interacting.

{% hint style="warning" %}
The mainnet vault list and states below are a checkpoint at BNB block `118374393` (August 27, 2026), not an offer. `allVaultsLength()` returned three. State `Matured` means the original term has ended; state `Fundraising` can change as time and governance actions advance the state machine. The testnet section is **Test-only**.
{% endhint %}

## BNB Chain Mainnet

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0x6D9e91cB766259af42619c14c994E694E57e6E85`](https://bscscan.com/address/0x6D9e91cB766259af42619c14c994E694E57e6E85)
* InstitutionPositionToken: [`0x3Ed56f6937fc8549f9325405d1e8E650739647Fa`](https://bscscan.com/address/0x3Ed56f6937fc8549f9325405d1e8E650739647Fa)
* LiquidationAdapter (proxy): [`0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd`](https://bscscan.com/address/0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd)

#### Deployed vaults

* Matrixdock vault, position token ID `1` (**Matured** at the checkpoint): [`0x7D80A10bEdD13638888e7A946B82878E21fbB820`](https://bscscan.com/address/0x7D80A10bEdD13638888e7A946B82878E21fbB820) — its original terms were USDT supplied against XAUM collateral over 30 days at a 6% fixed borrow rate and 10% reserve factor; this is not a current 5.4% supplier offer.
* Asseto vault, position token ID `2` (**Fundraising** at the checkpoint): [`0x41179fc6ff878b7795B900888E0B61fd8029bceA`](https://bscscan.com/address/0x41179fc6ff878b7795B900888E0B61fd8029bceA)
* Solv (Ceffu custody) vault, position token ID `3` (**Fundraising** at the checkpoint): [`0x086fd7972510dF9d9cFdc4efB8677fc72d290103`](https://bscscan.com/address/0x086fd7972510dF9d9cFdc4efB8677fc72d290103)

#### Liquidation whitelist

Liquidation entry points on each vault are reachable only through the `LiquidationAdapter`, which keeps two independent, governance-managed mappings: one for health-based liquidators and one for overdue settlers (set via `setLiquidatorWhitelist` and `setSettlerWhitelist`). At the checkpoint, the Venus Critical Guardian multisig [`0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9`](https://bscscan.com/address/0x7B1AE5Ea599bC56734624b95589e7E8E64C351c9) returned `true` in both mappings. The mappings are not enumerable, so this does not prove it is the only authorized address; reconstruct the update events and re-read the selected caller. The permissionless `repayBadDebt` path on each vault is independent of these mappings.

## BNB Chain Testnet (Test-only)

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0xf77dED2A00F94e33C392126238360D4642c16Ba2`](https://testnet.bscscan.com/address/0xf77dED2A00F94e33C392126238360D4642c16Ba2)
* InstitutionPositionToken: [`0x71dA473257a96e975558C8edD8491AD0880EFCe5`](https://testnet.bscscan.com/address/0x71dA473257a96e975558C8edD8491AD0880EFCe5)
* LiquidationAdapter (proxy): [`0x4b302b56315Ca16A0A4565108e62404496916491`](https://testnet.bscscan.com/address/0x4b302b56315Ca16A0A4565108e62404496916491)
