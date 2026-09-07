# Vault Technical Reference

Venus has two distinct vault families:

| Vault | Network scope | Proxy model | Purpose |
| --- | --- | --- | --- |
| [VAI Vault](vai/README.md) | BNB Chain only | Custom `VAIVaultProxy` delegate proxy | Stake VAI and claim XVS rewards |
| [XVS Vault](xvs/README.md) | BNB, Ethereum, opBNB, Arbitrum, ZKsync, Optimism, Base, Unichain | Custom `XVSVaultProxy` delegate proxy plus XVSStore | Stake XVS, earn configured rewards, and delegate governance votes |

The proxy address is the public entry point. Resolve the custom proxy's implementation getter at the relevant block before choosing an ABI. Vault reward speed, pause state, time basis, pools, permissions, and funding are all configurable.

Current proxy and store addresses are listed in [Deployed Funds](../../../deployed-contracts/funds.md).
