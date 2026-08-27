# Prime Contract Versions

Venus Prime has two deployed contract generations. BNB Chain uses PrimeV2 with a leaderboard; the other current mainnet rows still use Prime V1.

## Mainnet version map

The following state was read on 2026-08-27:

| Network | Prime consumer | Generation | PLP mode | PLP paused |
| --- | --- | --- | --- | --- |
| BNB Chain | `0x059EabA8676b03e4e8f009eFb7F587C28450F50f` | PrimeV2 | block, 70,080,000/year | No |
| Ethereum | `0x14C4525f47A7f7C984474979c57a2Dccb8EACB39` | Prime V1 | block, 2,628,000/year | No |
| Arbitrum | `0xFE69720424C954A2da05648a0FAC84f9bf11Ef49` | Prime V1 | second, 31,536,000/year | Yes |
| ZKsync | `0xdFe62Dcba3Ce0A827439390d7d45Af8baE599978` | Prime V1 | second, 31,536,000/year | Yes |
| Optimism | `0xE76d2173546Be97Fa6E18358027BdE9742a649f7` | Prime V1 | second, 31,536,000/year | Yes |
| Base | `0xD2e84244f1e9Fca03Ff024af35b8f9612D5d7a30` | Prime V1 | second, 31,536,000/year | Yes |
| Unichain | `0x600aFf613d40D87C8Fe90Cb2e78e8e6667c0C872` | Prime V1 | second, 31,536,000/year | Yes |

PLP means PrimeLiquidityProvider. A paused PLP does not by itself prove that the Prime deployment is deprecated; it proves only that PLP transfers were paused at the observed block. Check current product support, the Prime contract, and all funding paths before assigning a lifecycle state.

{% hint style="danger" %}
The child PrimeV2 and PrimeLeaderboard pages apply only to BNB Chain. Do not use their ABI, leaderboard eligibility, or permissionless minting model for a Prime V1 deployment.
{% endhint %}

## BNB PrimeV2 components

At BNB Chain block `118,364,540`, PrimeV2 was unpaused and resolved to:

| Component | Proxy or address | Implementation |
| --- | --- | --- |
| [PrimeV2](prime.md) | `0x059EabA8676b03e4e8f009eFb7F587C28450F50f` | `0x18cb7198cbb6d6e94001458cf3cf47c106d83a1b` |
| [PrimeLeaderboard](prime-leaderboard.md) | `0x55e2ccF68B7A276dc28AfA107997b8B1Be932c0b` | `0xd80de9ecb6596df95dd67af73b67122054c2d1a1` |
| [PrimeLiquidityProvider](prime-liquidity-provider.md) | `0x23c4F844ffDdC6161174eB32c770D4D8C07833F2` | `0x46bed43b29d73835ff075bba1a0002a1ed1e4de8` |
| [PrimeLens](prime-lens.md) | `0x2f8c5e4562E22DB7908C56Bf99961C053436473c` | Non-proxy lens |

Storage references: [PrimeV2Storage](prime-storage.md) and [PrimeLeaderboardStorage](prime-leaderboard-storage.md). See the [Venus Prime technical article](../../reference-technical-articles/prime.md) for the BNB V2 flow.

Current addresses are listed in [Deployed Funds](../../../deployed-contracts/funds.md).
