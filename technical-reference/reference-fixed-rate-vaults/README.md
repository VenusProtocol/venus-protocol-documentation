# Fixed Term Vaults

Solidity API reference for the Fixed Term Vault system, generated from NatSpec.

The system has three singleton contracts, one vault implementation contract (cloned per loan by the controller), and one abstract base:

| Contract | Description |
| --- | --- |
| [InstitutionalVaultController](institutional-vault-controller.md) | Factory and governance proxy. Deploys vault clones, maintains the registry, and proxies all ACM-gated lifecycle calls. |
| [InstitutionalLoanVault](institutional-loan-vault.md) | Core execution contract for a single loan. Holds collateral and supply assets, enforces the state machine, and exposes ERC-4626 supplier and institution-side entry points. |
| [LiquidationAdapter](liquidation-adapter.md) | The sole address permitted to call `vault.liquidate()`. Manages liquidator/settler whitelists, enforces the close factor, and splits seized collateral between the caller and the protocol. |
| [InstitutionPositionToken](institution-position-token.md) | Singleton ERC-721. One token per vault; the holder controls all institution-side operations on that vault. |
| [BaseVault](base-vault.md) | Abstract base inherited by `InstitutionalLoanVault`. Provides shared ERC-4626 mechanics, fundraising, interest computation, settlement waterfall, and the pause system. |
