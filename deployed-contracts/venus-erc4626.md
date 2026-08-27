# VenusERC4626 - Deployed Contracts

Each factory owns an `UpgradeableBeacon` and creates a `BeaconProxy` vault for a vToken. The factory address, beacon address, and current beacon implementation are distinct; a historical implementation address is not enough to determine the code used by created vaults. Enumerate actual wrappers with `createdVaults(vToken)` or `CreateERC4626` events.

{% hint style="warning" %}
The beacon and implementation rows below were read on August 27, 2026 at the block shown in each implementation label. They can change through governance. Factory configuration, owner/ACM, reward recipient, created vaults, balances, and integration support are not certified by this address list. Every testnet section is **Test-only**.
{% endhint %}

## Ethereum Mainnet

* VenusERC4626Factory: [`0x39cb747453Be3416E659dAeA169540b6F000c885`](https://etherscan.io/address/0x39cb747453Be3416E659dAeA169540b6F000c885)
* Factory beacon: [`0x402a1798E09F8895b0A347A5cD5934fBd6b5449d`](https://etherscan.io/address/0x402a1798E09F8895b0A347A5cD5934fBd6b5449d)
* Current beacon implementation at block `25846206`: [`0x6F0AB9E23f66ceB2b1BA0BB23C0e1f5f089a3cA1`](https://etherscan.io/address/0x6F0AB9E23f66ceB2b1BA0BB23C0e1f5f089a3cA1)

## Sepolia (Ethereum Testnet; Test-only)

* VenusERC4626Factory: [`0xbf76e9429BA565220d77831A9eC3606434e2106e`](https://sepolia.etherscan.io/address/0xbf76e9429BA565220d77831A9eC3606434e2106e)
* Factory beacon: [`0x996c65EceF9f1456fB6206e7bd621cEbaFA1153e`](https://sepolia.etherscan.io/address/0x996c65EceF9f1456fB6206e7bd621cEbaFA1153e)
* Current beacon implementation at block `11577515`: [`0xd1B290832F3094647a063db7C293cD5DF2843255`](https://sepolia.etherscan.io/address/0xd1B290832F3094647a063db7C293cD5DF2843255)

## opBNB Mainnet

* VenusERC4626Factory: [`0x89A5Ce0A6db7e66E53F148B50D879b700dEB81C8`](https://opbnbscan.com/address/0x89A5Ce0A6db7e66E53F148B50D879b700dEB81C8)
* Factory beacon: [`0xeBF538fA3dDB199c5AC9816Ea7101ddbc47d0D7f`](https://opbnbscan.com/address/0xeBF538fA3dDB199c5AC9816Ea7101ddbc47d0D7f)
* Current beacon implementation at block `178850100`: [`0x2C0E328c118d22A549C8CB758C46775b9560A026`](https://opbnbscan.com/address/0x2C0E328c118d22A549C8CB758C46775b9560A026)

## opBNB Testnet (Test-only)

* VenusERC4626Factory: [`0x3dEDBD90EFC6E2257887FF36842337dF0739B8A1`](https://testnet.opbnbscan.com/address/0x3dEDBD90EFC6E2257887FF36842337dF0739B8A1)
* Factory beacon: [`0x904C9935fE85135d3169A41beACcc87F28a7e1a8`](https://testnet.opbnbscan.com/address/0x904C9935fE85135d3169A41beACcc87F28a7e1a8)
* Current beacon implementation at block `196080622`: [`0x5b97A053a8c153f5BE27b84370FecD3959D8898f`](https://testnet.opbnbscan.com/address/0x5b97A053a8c153f5BE27b84370FecD3959D8898f)

## Arbitrum One

* VenusERC4626Factory: [`0xC1422B928cb6FC9BA52880892078578a93aa5Cc7`](https://arbiscan.io/address/0xC1422B928cb6FC9BA52880892078578a93aa5Cc7)
* Factory beacon: [`0xe87D357Fa78e961CbB12647012Bab418288B47f2`](https://arbiscan.io/address/0xe87D357Fa78e961CbB12647012Bab418288B47f2)
* Current beacon implementation at block `498900326`: [`0xff2C112F0FC927E89eA1f7ec56D0c76263708Bcb`](https://arbiscan.io/address/0xff2C112F0FC927E89eA1f7ec56D0c76263708Bcb)

## Arbitrum Sepolia (Test-only)

* VenusERC4626Factory: [`0xC6C8249a0B44973673f3Af673e530B85038a0480`](https://sepolia.arbiscan.io/address/0xC6C8249a0B44973673f3Af673e530B85038a0480)
* Factory beacon: [`0xf443c323d2e7685231E8a9FB1052427B441C9ee4`](https://sepolia.arbiscan.io/address/0xf443c323d2e7685231E8a9FB1052427B441C9ee4)
* Current beacon implementation at block `302536698`: [`0x3442ACDbCc927cC401236C69a14ca909fC5B14ba`](https://sepolia.arbiscan.io/address/0x3442ACDbCc927cC401236C69a14ca909fC5B14ba)

## ZKSync Mainnet

* VenusERC4626Factory: [`0xDC59Dd76Dd7A64d743C764a9aa8C96Ff2Ea8BAc3`](https://explorer.zksync.io/address/0xDC59Dd76Dd7A64d743C764a9aa8C96Ff2Ea8BAc3)
* Factory beacon: [`0x7C973844F97D7C6Dc994145B9F283081876DF6Df`](https://explorer.zksync.io/address/0x7C973844F97D7C6Dc994145B9F283081876DF6Df)
* Current beacon implementation at block `71738908`: [`0xBd86974B3a7348AC153aEFEe5Dc5111246a99c11`](https://explorer.zksync.io/address/0xBd86974B3a7348AC153aEFEe5Dc5111246a99c11)

## ZKSync Sepolia (Test-only)

* VenusERC4626Factory: [`0xa30dcc21B8393A4031cD6364829CDfE2b6D7B283`](https://sepolia.explorer.zksync.io/address/0xa30dcc21B8393A4031cD6364829CDfE2b6D7B283)
* Factory beacon: [`0x832Db8eEB5f9502E49b9699f33B593A47603fDfC`](https://sepolia.explorer.zksync.io/address/0x832Db8eEB5f9502E49b9699f33B593A47603fDfC)
* Current beacon implementation at block `8260606`: [`0x97ab473c81C5E654B71690e3B4225180C687E3eB`](https://sepolia.explorer.zksync.io/address/0x97ab473c81C5E654B71690e3B4225180C687E3eB)

## Optimism Mainnet

* VenusERC4626Factory: [`0xc801B471F00Dc22B9a7d7b839CBE87E46d70946F`](https://optimistic.etherscan.io/address/0xc801B471F00Dc22B9a7d7b839CBE87E46d70946F)
* Factory beacon: [`0x18ed0A737DAa5ade55Cb66bcAcEEF59b3E5B07C1`](https://optimistic.etherscan.io/address/0x18ed0A737DAa5ade55Cb66bcAcEEF59b3E5B07C1)
* Current beacon implementation at block `156115339`: [`0x28d408ad7E66c8de66FBf8D6724747250C8B349E`](https://optimistic.etherscan.io/address/0x28d408ad7E66c8de66FBf8D6724747250C8B349E)

## Optimism Sepolia (Test-only)

* VenusERC4626Factory: [`0xc66c4058A8524253C22a9461Df6769CE09F7d61e`](https://sepolia-optimism.etherscan.io/address/0xc66c4058A8524253C22a9461Df6769CE09F7d61e)
* Factory beacon: [`0x625fa924ABf377F53deeb9735f985FD66526426E`](https://sepolia-optimism.etherscan.io/address/0x625fa924ABf377F53deeb9735f985FD66526426E)
* Current beacon implementation at block `48013471`: [`0x057E95A55E93DB89610AE2d64653b6384dFE7c0d`](https://sepolia-optimism.etherscan.io/address/0x057E95A55E93DB89610AE2d64653b6384dFE7c0d)

## Base Mainnet

* VenusERC4626Factory: [`0x1A430825B31DdA074751D6731Ce7Dca38D012D13`](https://basescan.org/address/0x1A430825B31DdA074751D6731Ce7Dca38D012D13)
* Factory beacon: [`0x2fe39Fa6F7723c4CAF1457D5Dca59b373A641812`](https://basescan.org/address/0x2fe39Fa6F7723c4CAF1457D5Dca59b373A641812)
* Current beacon implementation at block `50520054`: [`0x1062F74081026eE4777981B75D8DA7e6a5640010`](https://basescan.org/address/0x1062F74081026eE4777981B75D8DA7e6a5640010)

## Base Sepolia (Test-only)

* VenusERC4626Factory: [`0xD13c5527d1a2a8c2cC9c9eb260AC4D9D811a02a4`](https://sepolia.basescan.org/address/0xD13c5527d1a2a8c2cC9c9eb260AC4D9D811a02a4)
* Factory beacon: [`0xaB28af647BF5c2cDF5ca6Da11531b1A9ccB3CEda`](https://sepolia.basescan.org/address/0xaB28af647BF5c2cDF5ca6Da11531b1A9ccB3CEda)
* Current beacon implementation at block `46030597`: [`0x66A2cC7c0ca012DfBfd7BDC5DC06A315A0269b20`](https://sepolia.basescan.org/address/0x66A2cC7c0ca012DfBfd7BDC5DC06A315A0269b20)

## Unichain Mainnet

* VenusERC4626Factory: [`0x102fEb723C25c67dbdfDccCa3B1c1a6e1a662D2f`](https://uniscan.xyz/address/0x102fEb723C25c67dbdfDccCa3B1c1a6e1a662D2f)
* Factory beacon: [`0xEad5cc78de66E96E2285304Ba51FE75A7E29B33C`](https://uniscan.xyz/address/0xEad5cc78de66E96E2285304Ba51FE75A7E29B33C)
* Current beacon implementation at block `57081097`: [`0xE5b7978b0DB9e6d6026d1C79B8174D47295f8117`](https://uniscan.xyz/address/0xE5b7978b0DB9e6d6026d1C79B8174D47295f8117)

## Unichain Sepolia (Test-only)

* VenusERC4626Factory: [`0x1365820B9ba3B1b5601208437a5A24192a12C1fB`](https://sepolia.uniscan.xyz/address/0x1365820B9ba3B1b5601208437a5A24192a12C1fB)
* Factory beacon: [`0x676e182AD866f84a6bEE29a83FC316332821959a`](https://sepolia.uniscan.xyz/address/0x676e182AD866f84a6bEE29a83FC316332821959a)
* Current beacon implementation at block `60977075`: [`0x7c0160E6638df7e7E6132Da4B60F210c38655D6e`](https://sepolia.uniscan.xyz/address/0x7c0160E6638df7e7E6132Da4B60F210c38655D6e)
