---
title: "Fixed Term Vaults"
---

Solidity API reference for the Fixed Term Vault system, generated from NatSpec.

The system has three singleton contracts, one vault implementation contract (cloned per loan by the controller), and one abstract base:

| Contract | Description |
| --- | --- |
| [InstitutionalVaultController](/technical-reference/reference-fixed-rate-vaults/institutional-vault-controller) | Factory and governance proxy. Deploys vault clones, maintains the registry, and proxies all ACM-gated lifecycle calls. |
| [InstitutionalLoanVault](/technical-reference/reference-fixed-rate-vaults/institutional-loan-vault) | Core execution contract for a single loan. Holds collateral and supply assets, enforces the state machine, and exposes ERC-4626 supplier and institution-side entry points. |
| [LiquidationAdapter](/technical-reference/reference-fixed-rate-vaults/liquidation-adapter) | The sole address permitted to call `vault.liquidate()`. Manages liquidator/settler whitelists, enforces the close factor, and splits seized collateral between the caller and the protocol. |
| [InstitutionPositionToken](/technical-reference/reference-fixed-rate-vaults/institution-position-token) | Singleton ERC-721. One token per vault; the holder controls all institution-side operations on that vault. |
| [BaseVault](/technical-reference/reference-fixed-rate-vaults/base-vault) | Abstract base inherited by `InstitutionalLoanVault`. Provides shared ERC-4626 mechanics, fundraising, interest computation, settlement waterfall, and the pause system. |
