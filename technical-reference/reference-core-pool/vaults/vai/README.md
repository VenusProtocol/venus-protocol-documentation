# VAI Vault

The VAI Vault exists only on BNB Chain. Its public entry point is the custom proxy at [`0x0667Eed0a0aAb930af74a3dfeDD263A73994f216`](https://bscscan.com/address/0x0667Eed0a0aAb930af74a3dfeDD263A73994f216).

At BNB Chain block `118,364,540`, the proxy was unpaused, used implementation `0xA52f2a56aBb7cbDD378bC36c6088fAfEaf9AC423`, and was administered by the Normal Timelock `0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396`.

The vault still holds user VAI and reward XVS, so its user and recovery reference must remain available regardless of whether new deposits are promoted in the interface.

* [VAIVaultProxy administration](vai-vault-proxy.md)
* [VAI Vault user and operator API](vai-vault.md)
* [Deployed Funds](../../../../deployed-contracts/funds.md)
