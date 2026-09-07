# XVS Vault Version Map

The XVS Vault is a multi-chain custom delegate-proxy family. Each deployment has a separate implementation, time basis, pause state, pool configuration, XVSStore, and permission set.

## Mainnet deployments

State observed on 2026-08-27:

| Network | Proxy | Implementation | Reward/vote clock | Paused |
| --- | --- | --- | --- | --- |
| BNB Chain | `0x051100480289e704d20e9DB4804837068f3f9204` | `0x74c8a97BE672db3e9a224648bE566AdA5F43B378` | block, 70,080,000/year | No |
| Ethereum | `0xA0882C2D5DF29233A092d2887A258C2b90e9b994` | `0x437042777255A1f25BE60eD25C814Dea6E43bC28` | block, 2,628,000/year | No |
| opBNB | `0x7dc969122450749A8B0777c0e324522d67737988` | `0x785BEF8B6dB40E86fA3749b44cD67C14945E2a71` | block, 126,144,000/year | Yes |
| Arbitrum | `0x8b79692AAB2822Be30a6382Eb04763A74752d5B4` | `0x4C4BedC003e4E2f3A057DeC35aeF26F64Cb07384` | second, 31,536,000/year | No |
| ZKsync | `0xbbB3C88192a5B0DB759229BeF49DcD1f168F326F` | `0x513323f8bd847Bd4C7C73DD69098B38789Ae0590` | second, 31,536,000/year | No |
| Optimism | `0x133120607C018c949E91AE333785519F6d947e01` | `0x8B8651EEB002a7991F2287500B17a395E8cfe7d9` | second, 31,536,000/year | No |
| Base | `0x708B54F2C3f3606ea48a8d94dab88D9Ab22D7fCd` | `0x322F1a2E03F089F8ce510855e793970D6f0EFcF9` | second, 31,536,000/year | No |
| Unichain | `0x5ECa0FBBc5e7bf49dbFb1953a92784F8e4248eF6` | `0x2ba0F45f7368d2A56d0c9e5a29af363987BE1d02` | second, 31,536,000/year | No |

Observed blocks were BNB `118,364,446`, Ethereum `25,845,840`, opBNB `178,832,524`, Arbitrum `498,882,806`, ZKsync `71,738,207`, Optimism `156,113,142`, Base `50,517,857`, and Unichain `57,076,698`.

{% hint style="warning" %}
A paused vault is not automatically deprecated. Pause status only establishes whether pause-gated actions could execute at the observed block. Check balances, pending withdrawals, claimable rewards, governance duties, and formal support before assigning a lifecycle state.
{% endhint %}

## Components

* [XVSVaultProxy](xvs-vault-proxy.md) — stores state and delegates calls to the current implementation.
* [XVS Vault](xvs-vault.md) — staking, withdrawals, rewards, governance delegation, and Prime callback logic.
* [XVSStore](xvs-store.md) — custody contract from which the vault transfers configured rewards.
* [XVSVaultTreasury](xvs-vault-treasury.md) — funds the store with governance-approved XVS allocations.

Current proxy and store addresses are listed in [Deployed Funds](../../../../deployed-contracts/funds.md).
