# Lending Market Engine

This section documents the `PoolRegistry` → `Comptroller` → `VToken` architecture from the [`isolated-pools`](https://github.com/VenusProtocol/isolated-pools) repository. Despite the historical directory name, this architecture is not deprecated: it powers the Core Pool on every supported mainnet except the legacy BNB Chain Core Pool.

Do not confuse these two lifecycle decisions:

- the old, separately promoted **Isolated Pools product** on BNB Chain, Ethereum, and Arbitrum is retired; use the [exit guide](../../guides/isolated-pools-deprecation.md) for positions that still need to be closed;
- the **lending market engine** remains active for modern Core Pools and for any retired pool that still has balances, debt, rewards, or recovery duties.

BNB Chain's legacy Core Pool uses the [Unitroller/Diamond Comptroller and legacy VTokens](../reference-core-pool/README.md), not the contracts in this section.

## Runtime topology

```text
PoolRegistry transparent proxy
  └─ registered Comptroller beacon proxies (one per pool)
       └─ VToken beacon proxies (one per market)
            └─ an interest-rate-model contract per market
```

`PoolLens` is a separate read helper. It is not a proxy, and old Lens deployments can coexist with newer ones. Resolve the exact address and tuple ABI before decoding its output.

## Mainnet implementation map

The following proxy and beacon state was read directly from each chain on August 27, 2026. Addresses in a deployment artifact are not a substitute for these indirections: governance can upgrade a proxy or beacon without changing the user-facing proxy address.

| Network | Checked block | PoolRegistry proxy | Implementation |
|---|---:|---|---|
| BNB Chain | `118365741` | `0x9F7b01A536aFA00EF10310A162877fd792cD0666` | `0xc4953e157D057941A9a71273B0aF4d4477ED2770` |
| Ethereum | `25845889` | `0x61CAff113CCaf05FFc6540302c37adcf077C5179` | `0x08A2577611Ae63d1ba40188035eD6Ad21F8502A9` |
| Arbitrum One | `498885126` | `0x382238f07Bc4Fe4aA99e561adE8A4164b5f815DA` | `0xc9A9594e774F9454e4665126C72Eb62643253aB0` |
| Optimism | `156113433` | `0x147780799840d541C1d7c998F0cbA996d11D62bb` | `0x6a166fcd39BA9c4ACc1b98eC45Adcdc4926E7967` |
| Base | `50518148` | `0xeef902918DdeCD773D4B422aa1C6e1673EB9136F` | `0x88eF9Fd7004f81c1B1CA59375178425C97A7eE68` |
| opBNB | `178834850` | `0x345a030Ad22e2317ac52811AC41C1A63cfa13aEe` | `0xc5A64235ff4aad92b71eC69a925224b60aede1aa` |
| zkSync Era | `71738270` | `0xFD96B926298034aed9bBe0Cca4b651E41eB87Bc4` | `0x204Dfdbb0F066dAfaD8C7fc07B04751A973ADCFb` |
| Unichain | `57077285` | `0x0C52403E16BcB8007C1e54887E1dFC1eC9765D7C` | `0xBAb8c229B6C19c443b942F228B076Ca0d4f2260E` |

| Network | Comptroller beacon → implementation | VToken beacon → implementation | VToken clock |
|---|---|---|---|
| BNB Chain | `0x38B4Efab9ea1bAcD19dC81f19c4D1C2F9DeAe1B2` → `0x7B586Aed00C85d7E32B463DCE094B1faCA7e7e7c` | `0x2b8A1C539ABaC89CbF7E2Bc6987A0A38A5e660D4` → `0x228Ea224d62D14a2e2cb9B43083aE43954C39B67` | block, `42,048,000`/year |
| Ethereum | `0xAE2C3F21896c02510aA187BdA0791cDA77083708` → `0xC910F2B196C516253e88b2097ba5D7d5fC9fa84e` | `0xfc08aADC7a1A93857f6296C3fb78aBA1d286533a` → `0x33bE30B31f07c8a2bfb705FBcE55E983c47ba864` | block, `2,628,000`/year |
| Arbitrum One | `0x8b6c2E8672504523Ca3a29a5527EcF47fC7d43FC` → `0x4b256a7836415e09DabA40541eE78602Bc6B24bF` | `0xE9381D8CA7006c12Ae9eB97890575E705996fa66` → `0x1986Fb53535953711265d5fD329cd7A690411669` | second, `31,536,000`/year |
| Optimism | `0x64f9306496ccF7b7369d02d68D6abcA2Edfb871d` → `0x4D3f690A33A365Fc131777ea6e0f5B8821eb755b` | `0xd550Bdfa9402e215De0BabCb99F7294BE0268367` → `0xBEB9eE824a0096c0FB606b070c028cB55b6f21e7` | second, `31,536,000`/year |
| Base | `0x1b6dE1C670db291bcbF793320a42dbBD858E67aC` → `0x93177BFDBc5dAf7B0fF4A09478eF90FF6e28E04A` | `0x87a6476510368c4Bfb70d04A3B0e5a881eC7f0d1` → `0x107bA74c87e75b6cc291510D3A85D0c8EAa73e82` | second, `31,536,000`/year |
| opBNB | `0x11C3e19236ce17729FC66b74B537de00C54d44e7` → `0xD3b2431c186A2bDEB61b86D9B042B75C954004F6` | `0xfeD1d3a13597c5aBc893Af41ED5cb17e64c847c7` → `0x7AA7EB7553DE5f221C06595f3b4021363279e9Fe` | block, `126,144,000`/year |
| zkSync Era | `0x0221415aF47FD261dD39B72018423dADe5d937c5` → `0xB2B58B15667e39dc09A0e29f1863eee7FD495541` | `0x53523537aa330640B80400EB8B309fF5896E7eb5` → `0x3e9cf1eBe018610585D0B519A9956C950E079591` | second, `31,536,000`/year |
| Unichain | `0xE57824ffF03fB19D7f93139A017a7E70f6F25166` → `0xDa42d85AE7625eBDD3b5967F44c263565BD8fA40` | `0x42c1Efb9Dd9424c5ac8e6EcEa4eb03940c4a15Fc` → `0x256E61f4056EC9eaB8c56E3aFa217a12c33b8893` | second, `31,536,000`/year |

One important exception to the [v4.4.0 deployment artifacts](https://github.com/VenusProtocol/isolated-pools/tree/v4.4.0/deployments) is BNB Chain: its VToken beacon currently points to the implementation installed by [VIP-524](https://github.com/VenusProtocol/vips/blob/main/vips/vip-524/bscmainnet.ts), not to the BNB artifact committed in the repository release.

## How to use this reference

- Treat a registry entry as discovery data, not proof that a pool is open for new use.
- Resolve the current proxy or beacon implementation at the block used by your integration.
- Use “slot” for rate and accrual units until `isTimeBased()` establishes whether a slot is a block or a second.
- Use the [deployed markets registry](../../deployed-contracts/markets.md) for market addresses, then confirm listing, pause, caps, balances, and debt onchain.
- Use compiler build information for storage-layout review. A list of public getters is not a safe upgrade layout.

The stable API descriptions in this section are aligned with the [`isolated-pools` v4.4.0 source](https://github.com/VenusProtocol/isolated-pools/tree/v4.4.0). Pages call out deployment exceptions where the live implementation differs.
