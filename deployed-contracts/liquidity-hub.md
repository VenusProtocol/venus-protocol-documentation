# Liquidity Hub - Deployed Contracts

Contracts for the [Liquidity Hub](../technical-reference/reference-liquidity-hub/README.md) — one per-asset ERC-4626 allocator vault per asset, routing deposits across the Core, Flux and FRV yield families.

The canonical, always-current list of deployed Hubs lives on-chain: query `getHubs()` or `hubForAsset(asset)` on the `HubRegistry` below rather than hard-coding a Hub address. The addresses known at the time of writing are listed here for convenience.

## BNB Chain Mainnet

### Registry

* HubRegistry (proxy): [`0x6D93Fd479f2d37445CFBe132412e316a0364acc2`](https://bscscan.com/address/0x6D93Fd479f2d37445CFBe132412e316a0364acc2)

The registry is a chain-level singleton behind a `TransparentUpgradeableProxy`, administered by Venus's shared `DefaultProxyAdmin` [`0x6beb6D2695B67FEb73ad4f172E8E2975497187e4`](https://bscscan.com/address/0x6beb6D2695B67FEb73ad4f172E8E2975497187e4) — the same one that administers the core pool and isolated pools — so it upgrades independently of the Hubs.

### Hubs

Each Hub is a beacon proxy over `HubBeacon`, holds exactly one asset, and issues a `Venus Hub <asset>` / `vh<asset>` share token.

* Hub USDT (`vhUSDT`): [`0x18AfDACF30F8671021dec4b78297E39d2FE87226`](https://bscscan.com/address/0x18AfDACF30F8671021dec4b78297E39d2FE87226)
* Hub USDC (`vhUSDC`): [`0x9D2D9592cF8DFbf59107fAab703d08494BE14617`](https://bscscan.com/address/0x9D2D9592cF8DFbf59107fAab703d08494BE14617)
* Hub U (`vhU`): [`0x0e5AA174d4F31b757a237eb1999DE151596788B0`](https://bscscan.com/address/0x0e5AA174d4F31b757a237eb1999DE151596788B0)

### Yield Groups

Every Hub owns three YieldGroup proxies — one per yield family. Resolve them from the Hub's `registeredYieldGroups()` rather than hard-coding; the current set is:

USDT Hub

* CoreSource\_USDT: [`0xC9E6ceD9589363f8dC5695Be2C79AB4dDaECC94B`](https://bscscan.com/address/0xC9E6ceD9589363f8dC5695Be2C79AB4dDaECC94B)
* FluxSource\_USDT: [`0xe3df38E12E37ED80E1b3ccf2bdf84F9e1527ce14`](https://bscscan.com/address/0xe3df38E12E37ED80E1b3ccf2bdf84F9e1527ce14)
* FRVSource\_USDT: [`0x621eF38cE0C4e7060fF0bF3D609E3D46EC144bE7`](https://bscscan.com/address/0x621eF38cE0C4e7060fF0bF3D609E3D46EC144bE7)

USDC Hub

* CoreSource\_USDC: [`0x299D9Be7CEfff91c68F13F267d525CFC18e965ef`](https://bscscan.com/address/0x299D9Be7CEfff91c68F13F267d525CFC18e965ef)
* FluxSource\_USDC: [`0xA65bB4b20542268B64CF08871a98D75342AFE927`](https://bscscan.com/address/0xA65bB4b20542268B64CF08871a98D75342AFE927)
* FRVSource\_USDC: [`0x438388847eE16850Ab4f5b82dc7954c0d043B716`](https://bscscan.com/address/0x438388847eE16850Ab4f5b82dc7954c0d043B716)

U Hub

* CoreSource\_U: [`0x8A680F77A5367FA7cD33a02f51896Cb1d55159c3`](https://bscscan.com/address/0x8A680F77A5367FA7cD33a02f51896Cb1d55159c3)
* FluxSource\_U: [`0xe31B8851c3fa9B3dD39a04a2ed9493869A410616`](https://bscscan.com/address/0xe31B8851c3fa9B3dD39a04a2ed9493869A410616)
* FRVSource\_U: [`0x30908eddB9E94add7AC9944a0adda66d80B89143`](https://bscscan.com/address/0x30908eddB9E94add7AC9944a0adda66d80B89143)

#### Wired resources

Each Core YieldGroup routes to the corresponding Core pool vToken (vUSDT, vUSDC, vU) and each Flux YieldGroup to the corresponding Fluid fToken (fUSDT, fUSDC, fU). **The FRV YieldGroups carry no resource**: they are registered on every Hub with their caps set, but no Fixed-Rate Vault instance exists for USDT, USDC or U on BNB Chain yet, so no capital routes to FRV until a follow-up proposal wires a vault. Read the live set with `resources()` on a YieldGroup, and its per-resource adapter with `resourceConfig(resource)`.

### Beacons

One `UpgradeableBeacon` per family; upgrading a beacon upgrades every vault of that family atomically. All four are owned by the [Normal Timelock](governance.md) [`0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396`](https://bscscan.com/address/0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396).

* HubBeacon: [`0x0f20e1004962e2DF16c16FC15460Dc6480626321`](https://bscscan.com/address/0x0f20e1004962e2DF16c16FC15460Dc6480626321)
* CoreBeacon: [`0x195a0F1BCF73C3Beb609a1271E8E08b8E4c098C6`](https://bscscan.com/address/0x195a0F1BCF73C3Beb609a1271E8E08b8E4c098C6)
* FluxBeacon: [`0x9bb6a3Ac5955fA8dc236560CA9D51483d1d79f15`](https://bscscan.com/address/0x9bb6a3Ac5955fA8dc236560CA9D51483d1d79f15)
* FRVBeacon: [`0x8A5EceDD726246682402430b9B24c19bF61B7f1d`](https://bscscan.com/address/0x8A5EceDD726246682402430b9B24c19bF61B7f1d)

### Adapters

Stateless, non-upgradeable singletons shared by every Hub; mutating calls reach them by `delegatecall`, so receipt tokens land on the calling YieldGroup.

* AdapterCoreV1: [`0x4E514a0C7aB9d140eE204dfA0017574270D92944`](https://bscscan.com/address/0x4E514a0C7aB9d140eE204dfA0017574270D92944)
* AdapterFlux: [`0xA81bDf813A428053E764C34Bc679b3E4d0807be3`](https://bscscan.com/address/0xA81bDf813A428053E764C34Bc679b3E4d0807be3)
* AdapterFRV: [`0x1FA0365bDd603452CE96BE3c0e12Db5515a35902`](https://bscscan.com/address/0x1FA0365bDd603452CE96BE3c0e12Db5515a35902) — deployed but not referenced by any resource yet

### Periphery

* Migrator: [`0xfe6b8BEf1215C19Cd247FbF495ef560932F1Eb9B`](https://bscscan.com/address/0xfe6b8BEf1215C19Cd247FbF495ef560932F1Eb9B)

Stateless, permissionless and non-upgradeable; one-click migration of a Venus Core position into a Hub via `migrateFromCore` / `migrateFromCoreBNB` (plus the `*WithConsent` variants).

### Access control

Every gated function on the Hubs and YieldGroups is checked against `AccessControlManagerV8` [`0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555`](https://bscscan.com/address/0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555). Role holders (governance, Operator, Guardian) are granted by proposal rather than baked into the bytecode — see [Permissions](../technical-reference/reference-liquidity-hub/hub.md#permissions).

## BNB Chain Testnet

A parallel deployment exists for integration testing. It is **not a faithful mirror of mainnet** — share-token naming, FRV wiring, caps and the registry's proxy admin all differ; see the [technical reference](../technical-reference/reference-liquidity-hub/README.md#bsc-testnet-chain-id-97) for the full list of differences.

### Registry

* HubRegistry (proxy): [`0x5346f648029d1D1d1034e09e8AD7a115f5D7A159`](https://testnet.bscscan.com/address/0x5346f648029d1D1d1034e09e8AD7a115f5D7A159)
* HubRegistryProxyAdmin: [`0x9f8413eEE33D434F6D4f40C83181f32A831c9ef7`](https://testnet.bscscan.com/address/0x9f8413eEE33D434F6D4f40C83181f32A831c9ef7)

The testnet registry predates the decision to use the shared `DefaultProxyAdmin`, so it still carries a registry-specific `ProxyAdmin`.

### Hubs

The testnet registry lists thirteen Hubs, all over mock assets. The USDT Hub is the reference deployment documented in the technical reference; the rest were stood up for QA scenarios and their wiring varies per Hub — some carry all three families, some only part of them, and one carries none. Read `registeredYieldGroups()` on a Hub, then `resources()` on each group, rather than assuming the mainnet shape.

* Hub USDT (`vSHARE`): [`0x7cE6ADF754D0eC81A6CF8ACd9C7454F45077dc61`](https://testnet.bscscan.com/address/0x7cE6ADF754D0eC81A6CF8ACd9C7454F45077dc61)
* Hub WBNB (`vhBNB`): [`0xAB0E89896740A9ABe3fd7905317adBA9D780F06e`](https://testnet.bscscan.com/address/0xAB0E89896740A9ABe3fd7905317adBA9D780F06e)
* Hub USDC (`vhUSDC`): [`0xCf11a9db610584ee9bD56a271306956d3B0b929F`](https://testnet.bscscan.com/address/0xCf11a9db610584ee9bD56a271306956d3B0b929F)
* Hub FDUSD (`vhFDUSD`): [`0x41F9Cb8431F3EC8fee17DA15Ed919DF29F8A3Efc`](https://testnet.bscscan.com/address/0x41F9Cb8431F3EC8fee17DA15Ed919DF29F8A3Efc)
* Hub BTCB (`vhBTC`): [`0xe0A7F410394fA2A6F5164390C7F25b86Ab9Eda79`](https://testnet.bscscan.com/address/0xe0A7F410394fA2A6F5164390C7F25b86Ab9Eda79)
* Hub ADA (`vhADA`): [`0x56033525a0296b5e0e48F8249d11a20557633166`](https://testnet.bscscan.com/address/0x56033525a0296b5e0e48F8249d11a20557633166)
* Hub AAVE (`vhAAVE`): [`0x37a0Dd95C8BA787CC8E59E5B19EeE6EeF2C24Ca0`](https://testnet.bscscan.com/address/0x37a0Dd95C8BA787CC8E59E5B19EeE6EeF2C24Ca0)
* Hub CAKE (`vhCAKE`): [`0x4756cb4A012F49B5cbEC6E5172F6a642812a934C`](https://testnet.bscscan.com/address/0x4756cb4A012F49B5cbEC6E5172F6a642812a934C)
* Hub ETH (`vhETH`): [`0x202C70cCE84b456F0C16b767Dd946AbA208bD135`](https://testnet.bscscan.com/address/0x202C70cCE84b456F0C16b767Dd946AbA208bD135)
* Hub DOGE (`vhDOGE`): [`0x6f43c6d3531A1c37391578A90764Ed17594da711`](https://testnet.bscscan.com/address/0x6f43c6d3531A1c37391578A90764Ed17594da711)
* Hub LTC (`vhLTC`): [`0x47A932e0e27a8E95a6EE8987D6b3d46C8EFE074d`](https://testnet.bscscan.com/address/0x47A932e0e27a8E95a6EE8987D6b3d46C8EFE074d)
* Hub SOL (`vhSOL`): [`0xf7fa2dCCB4e96a5CEFb595bF2eB4cE764145680e`](https://testnet.bscscan.com/address/0xf7fa2dCCB4e96a5CEFb595bF2eB4cE764145680e)
* Hub SXP (`vhSXP`): [`0x3871d162921C4B707C879461d469a858a64B6D8c`](https://testnet.bscscan.com/address/0x3871d162921C4B707C879461d469a858a64B6D8c)

The USDT Hub's share token is named `Vault Share` / `vSHARE`, a placeholder predating the `Venus Hub <asset>` / `vh<asset>` convention the later Hubs and all of mainnet use.

### Yield Groups (USDT Hub)

* CoreSource\_USDT: [`0x11e39DC7b8b16BBDA8D9C2903dF741Ae9341Ec88`](https://testnet.bscscan.com/address/0x11e39DC7b8b16BBDA8D9C2903dF741Ae9341Ec88)
* FluxSource\_USDT: [`0x044E572144bc08ed2D90E081EeEd7b5b6Cb01016`](https://testnet.bscscan.com/address/0x044E572144bc08ed2D90E081EeEd7b5b6Cb01016)
* FRVSource\_USDT: [`0xA0Fb0fFeBdcB7F45A3Ec841cCE7F78B7CeBD0f82`](https://testnet.bscscan.com/address/0xA0Fb0fFeBdcB7F45A3Ec841cCE7F78B7CeBD0f82)

Unlike mainnet, **FRV is fully wired on testnet**: the FRV YieldGroup has a Fixed-Rate Vault registered as a resource, so all three families route capital.

### Beacons

* HubBeacon: [`0x7cbaC6991aC33DaFDD347e84CFbE2F372b936d92`](https://testnet.bscscan.com/address/0x7cbaC6991aC33DaFDD347e84CFbE2F372b936d92)
* CoreBeacon: [`0xbBEe25aE7d2Db035Afc327fb0096fC88FDfF3170`](https://testnet.bscscan.com/address/0xbBEe25aE7d2Db035Afc327fb0096fC88FDfF3170)
* FluxBeacon: [`0x6b9CA74F82848668EA04D56E0A8396A816ba5330`](https://testnet.bscscan.com/address/0x6b9CA74F82848668EA04D56E0A8396A816ba5330)
* FRVBeacon: [`0x6196Ec22133610132563B03b6Fad5aa766A9C037`](https://testnet.bscscan.com/address/0x6196Ec22133610132563B03b6Fad5aa766A9C037)

### Adapters

* AdapterCoreV1: [`0xDf669957448eCB23309eEFda4de230c62d22AE33`](https://testnet.bscscan.com/address/0xDf669957448eCB23309eEFda4de230c62d22AE33)
* AdapterFlux: [`0x15Dca35ae0b16BeceabAEC9Dea49630e8C601730`](https://testnet.bscscan.com/address/0x15Dca35ae0b16BeceabAEC9Dea49630e8C601730)
* AdapterFRV: [`0xeF0E85ab9A23F50EB4595CF7e2F5461feF7E7fc5`](https://testnet.bscscan.com/address/0xeF0E85ab9A23F50EB4595CF7e2F5461feF7E7fc5)

### Periphery

* Migrator: [`0x343D518d8C89f9B5D770000F1ed80f45bF1419f5`](https://testnet.bscscan.com/address/0x343D518d8C89f9B5D770000F1ed80f45bF1419f5)
