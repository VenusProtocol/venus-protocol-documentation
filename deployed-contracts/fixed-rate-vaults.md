# Fixed Term Vaults

Core contracts for the Fixed Term Vaults system. Each institution's vault is deployed as an EIP-1167 clone by governance via `createVault(...)` on `InstitutionalVaultController`, so individual vault instances are not enumerated here — query the controller's `allVaults` array (or the `VaultCreated` event log) to enumerate deployed vaults.

## BNB Chain Mainnet

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0x6D9e91cB766259af42619c14c994E694E57e6E85`](https://bscscan.com/address/0x6D9e91cB766259af42619c14c994E694E57e6E85)
* InstitutionPositionToken: [`0x3Ed56f6937fc8549f9325405d1e8E650739647Fa`](https://bscscan.com/address/0x3Ed56f6937fc8549f9325405d1e8E650739647Fa)
* LiquidationAdapter (proxy): [`0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd`](https://bscscan.com/address/0x17A6222fB8b4b6D852cA54f5bc376a6A2c6224Bd)

## BNB Chain Testnet

### Fixed Term Vaults Contracts

* InstitutionalVaultController (proxy): [`0xf77dED2A00F94e33C392126238360D4642c16Ba2`](https://testnet.bscscan.com/address/0xf77dED2A00F94e33C392126238360D4642c16Ba2)
* InstitutionPositionToken: [`0x71dA473257a96e975558C8edD8491AD0880EFCe5`](https://testnet.bscscan.com/address/0x71dA473257a96e975558C8edD8491AD0880EFCe5)
* LiquidationAdapter (proxy): [`0x4b302b56315Ca16A0A4565108e62404496916491`](https://testnet.bscscan.com/address/0x4b302b56315Ca16A0A4565108e62404496916491)
