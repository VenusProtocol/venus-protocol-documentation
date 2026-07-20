# Token Converters - Deployed Contracts

## BNB Chain Mainnet

Phase 2 [TokenBuyback](../whats-new/token-converter.md) instances replaced the original community-driven Token Converters via [VIP-620](https://app.venus.io/#/governance/proposal/620?chainId=56) and [VIP-621](https://app.venus.io/#/governance/proposal/621?chainId=56). The migration was originally proposed as [VIP-618](https://app.venus.io/#/governance/proposal/618?chainId=56), which became unexecutable when BSC's Osaka hardfork enforced a hard per-tx gas cap of 2^24 = 16,777,216 (the single-call `helper.execute()` required ~17.5M gas). VIP-620 + VIP-621 split the work across two transactions and use a redeployed set of buyback proxies. The six timelock-owned legacy converters remain deployed for reference but are no longer operational — conversion is paused on each and balances have been drained into the corresponding new buyback. `WBNBBurnConverter` (Guardian-owned) is wound down via a separate multisig transaction; `ConverterNetwork` is unreferenced. Pre-existing ACM grants on the legacy converters are not explicitly revoked, but the paused state renders them inert.

### TokenBuyback (Phase 2 — active)

| Instance | Base Asset | Destination | Proxy address |
|---|---|---|---|
| `UTreasuryBuyback` | U | `VTreasury` | [`0xec63411423D03327De19135446dDdA3055D2feA8`](https://bscscan.com/address/0xec63411423D03327De19135446dDdA3055D2feA8) |
| `BTCBTreasuryBuyback` | BTCB | `VTreasury` | [`0x1F306a0d929a7098a0A0b12248Ba97600AB79026`](https://bscscan.com/address/0x1F306a0d929a7098a0A0b12248Ba97600AB79026) |
| `ETHTreasuryBuyback` | ETH | `VTreasury` | [`0x41954F0bf26959dF2e1B8302DEBf736B5b154B64`](https://bscscan.com/address/0x41954F0bf26959dF2e1B8302DEBf736B5b154B64) |
| `USDTTreasuryBuyback` | USDT | `VTreasury` | [`0xB3dDf13E8B6b8dE10F5826087C202b80F1D1b490`](https://bscscan.com/address/0xB3dDf13E8B6b8dE10F5826087C202b80F1D1b490) |
| `USDCTreasuryBuyback` | USDC | `VTreasury` | [`0xd7aC40f9bd9A1beb8E2d121b4446CF90417cf169`](https://bscscan.com/address/0xd7aC40f9bd9A1beb8E2d121b4446CF90417cf169) |
| `XVSTreasuryBuyback` | XVS | `VTreasury` | [`0x6D2d239c16453062cF145A7a5128A6a60710d236`](https://bscscan.com/address/0x6D2d239c16453062cF145A7a5128A6a60710d236) |
| `USDTPrimeBuyback` | USDT | `PrimeLiquidityProvider` | [`0xD721932C7CA41Eb5305867287010587a266346a8`](https://bscscan.com/address/0xD721932C7CA41Eb5305867287010587a266346a8) |
| `UPrimeBuyback` | U | `PrimeLiquidityProvider` | [`0xBC9fFBfb799B2d189669D3816E2B7273c69041bd`](https://bscscan.com/address/0xBC9fFBfb799B2d189669D3816E2B7273c69041bd) |
| `RiskFundBuyback` | USDT | `RiskFundV2` | [`0x0c71EFabD00329E839745ef23aB946d3ed24A805`](https://bscscan.com/address/0x0c71EFabD00329E839745ef23aB946d3ed24A805) |
| `XVSBuyback` | XVS | `XVSVaultTreasury` | [`0x637E6246BBb0F9aBae9d764F5e1bB6347f028C12`](https://bscscan.com/address/0x637E6246BBb0F9aBae9d764F5e1bB6347f028C12) |

### Retired converters (Phase 1 — non-operational post VIP-620 / VIP-621)

* RiskFundConverter: [`0xA5622D276CcbB8d9BBE3D1ffd1BB11a0032E53F0`](https://bscscan.com/address/0xA5622D276CcbB8d9BBE3D1ffd1BB11a0032E53F0)
* SingleTokenConverterBeacon: [`0x4c9D57b05B245c40235D720A5f3A592f3DfF11ca`](https://bscscan.com/address/0x4c9D57b05B245c40235D720A5f3A592f3DfF11ca)
* USDTPrimeConverter: [`0xD9f101AA67F3D72662609a2703387242452078C3`](https://bscscan.com/address/0xD9f101AA67F3D72662609a2703387242452078C3)
* USDCPrimeConverter: [`0xa758c9C215B6c4198F0a0e3FA46395Fa15Db691b`](https://bscscan.com/address/0xa758c9C215B6c4198F0a0e3FA46395Fa15Db691b)
* BTCBPrimeConverter: [`0xE8CeAa79f082768f99266dFd208d665d2Dd18f53`](https://bscscan.com/address/0xE8CeAa79f082768f99266dFd208d665d2Dd18f53)
* ETHPrimeConverter: [`0xca430B8A97Ea918fF634162acb0b731445B8195E`](https://bscscan.com/address/0xca430B8A97Ea918fF634162acb0b731445B8195E)
* XVSVaultConverter: [`0xd5b9AE835F4C59272032B3B954417179573331E0`](https://bscscan.com/address/0xd5b9AE835F4C59272032B3B954417179573331E0)
* WBNBBurnConverter: [`0x9eF79830e626C8ccA7e46DCEd1F90e51E7cFCeBE`](https://bscscan.com/address/0x9eF79830e626C8ccA7e46DCEd1F90e51E7cFCeBE)
* ConverterNetwork: [`0xF7Caad5CeB0209165f2dFE71c92aDe14d0F15995`](https://bscscan.com/address/0xF7Caad5CeB0209165f2dFE71c92aDe14d0F15995)

## Ethereum

* XVSVaultTreasury: [`0xaE39C38AF957338b3cEE2b3E5d825ea88df02EfE`](https://etherscan.io/address/0xaE39C38AF957338b3cEE2b3E5d825ea88df02EfE)
* SingleTokenConverterBeacon: [`0x5C0b5D09388F2BA6441E74D40666C4d96e4527D1`](https://etherscan.io/address/0x5C0b5D09388F2BA6441E74D40666C4d96e4527D1)
* USDTPrimeConverter: [`0x4f55cb0a24D5542a3478B0E284259A6B850B06BD`](https://etherscan.io/address/0x4f55cb0a24D5542a3478B0E284259A6B850B06BD)
* USDCPrimeConverter: [`0xcEB9503f10B781E30213c0b320bCf3b3cE54216E`](https://etherscan.io/address/0xcEB9503f10B781E30213c0b320bCf3b3cE54216E)
* WBTCPrimeConverter: [`0xDcCDE673Cd8988745dA384A7083B0bd22085dEA0`](https://etherscan.io/address/0xDcCDE673Cd8988745dA384A7083B0bd22085dEA0)
* WETHPrimeConverter: [`0xb8fD67f215117FADeF06447Af31590309750529D`](https://etherscan.io/address/0xb8fD67f215117FADeF06447Af31590309750529D)
* XVSVaultConverter: [`0x1FD30e761C3296fE36D9067b1e398FD97B4C0407`](https://etherscan.io/address/0x1FD30e761C3296fE36D9067b1e398FD97B4C0407)
* ConverterNetwork: [`0x232CC47AECCC55C2CAcE4372f5B268b27ef7cac8`](https://etherscan.io/address/0x232CC47AECCC55C2CAcE4372f5B268b27ef7cac8)

## Arbitrum One

* XVSVaultTreasury: [`0xb076D4f15c08D7A7B89466327Ba71bc7e1311b58`](https://arbiscan.io/address/0xb076D4f15c08D7A7B89466327Ba71bc7e1311b58)
* SingleTokenConverterBeacon: [`0x993900Ab4ef4092e5B76d4781D09A2732086F0F0`](https://arbiscan.io/address/0x993900Ab4ef4092e5B76d4781D09A2732086F0F0)
* USDTPrimeConverter: [`0x435Fac1B002d5D31f374E07c0177A1D709d5DC2D`](https://arbiscan.io/address/0x435Fac1B002d5D31f374E07c0177A1D709d5DC2D)
* USDCPrimeConverter: [`0x6553C9f9E131191d4fECb6F0E73bE13E229065C6`](https://arbiscan.io/address/0x6553C9f9E131191d4fECb6F0E73bE13E229065C6)
* WBTCPrimeConverter: [`0xF91369009c37f029aa28AF89709a352375E5A162`](https://arbiscan.io/address/0xF91369009c37f029aa28AF89709a352375E5A162)
* WETHPrimeConverter: [`0x4aCB90ddD6df24dC6b0D50df84C94e72012026d0`](https://arbiscan.io/address/0x4aCB90ddD6df24dC6b0D50df84C94e72012026d0)
* XVSVaultConverter: [`0x9c5A7aB705EA40876c1B292630a3ff2e0c213DB1`](https://arbiscan.io/address/0x9c5A7aB705EA40876c1B292630a3ff2e0c213DB1)
* ConverterNetwork: [`0x2F6672C9A0988748b0172D97961BecfD9DC6D6d5`](https://arbiscan.io/address/0x2F6672C9A0988748b0172D97961BecfD9DC6D6d5)

## BNB Chain Testnet

* RiskFundConverter: [`0x32Fbf7bBbd79355B86741E3181ef8c1D9bD309Bb`](https://testnet.bscscan.com/address/0x32Fbf7bBbd79355B86741E3181ef8c1D9bD309Bb)
* XVSVaultTreasury: [`0x317c6C4c9AA7F87170754DB08b4804dD689B68bF`](https://testnet.bscscan.com/address/0x317c6C4c9AA7F87170754DB08b4804dD689B68bF)
* SingleTokenConverterBeacon: [`0xD2410D8B581D37c5B474CD9Ee0C15F02138AC028`](https://testnet.bscscan.com/address/0xD2410D8B581D37c5B474CD9Ee0C15F02138AC028)
* USDTPrimeConverter: [`0xf1FA230D25fC5D6CAfe87C5A6F9e1B17Bc6F194E`](https://testnet.bscscan.com/address/0xf1FA230D25fC5D6CAfe87C5A6F9e1B17Bc6F194E)
* USDCPrimeConverter: [`0x2ecEdE6989d8646c992344fF6C97c72a3f811A13`](https://testnet.bscscan.com/address/0x2ecEdE6989d8646c992344fF6C97c72a3f811A13)
* BTCBPrimeConverter: [`0x989A1993C023a45DA141928921C0dE8fD123b7d1`](https://testnet.bscscan.com/address/0x989A1993C023a45DA141928921C0dE8fD123b7d1)
* ETHPrimeConverter: [`0xf358650A007aa12ecC8dac08CF8929Be7f72A4D9`](https://testnet.bscscan.com/address/0xf358650A007aa12ecC8dac08CF8929Be7f72A4D9)
* XVSVaultConverter: [`0x258f49254C758a0E37DAb148ADDAEA851F4b02a2`](https://testnet.bscscan.com/address/0x258f49254C758a0E37DAb148ADDAEA851F4b02a2)
* WBNBBurnConverter: [`0x42DBA48e7cCeB030eC73AaAe29d4A3F0cD4facba`](https://testnet.bscscan.com/address/0x42DBA48e7cCeB030eC73AaAe29d4A3F0cD4facba)
* ConverterNetwork: [`0xC8f2B705d5A2474B390f735A5aFb570e1ce0b2cf`](https://testnet.bscscan.com/address/0xC8f2B705d5A2474B390f735A5aFb570e1ce0b2cf)
* TreasuryTokenBuybackDistributor: [`0xfd45810d4c669e59510A096fc4cFA2233e5e20FD`](https://testnet.bscscan.com/address/0xfd45810d4c669e59510A096fc4cFA2233e5e20FD)

## Sepolia

* XVSVaultTreasury: [`0xCCB08e5107b406E67Ad8356023dd489CEbc79B40`](https://sepolia.etherscan.io/address/0xCCB08e5107b406E67Ad8356023dd489CEbc79B40)
* SingleTokenConverterBeacon: [`0xb86e532a5333d413A1c35d86cCdF1484B40219eF`](https://sepolia.etherscan.io/address/0xb86e532a5333d413A1c35d86cCdF1484B40219eF)
* USDTPrimeConverter: [`0x3716C24EA86A67cAf890d7C9e4C4505cDDC2F8A2`](https://sepolia.etherscan.io/address/0x3716C24EA86A67cAf890d7C9e4C4505cDDC2F8A2)
* USDCPrimeConverter: [`0x511a559a699cBd665546a1F75908f7E9454Bfc67`](https://sepolia.etherscan.io/address/0x511a559a699cBd665546a1F75908f7E9454Bfc67)
* WBTCPrimeConverter: [`0x8a3937F27921e859db3FDA05729CbCea8cfd82AE`](https://sepolia.etherscan.io/address/0x8a3937F27921e859db3FDA05729CbCea8cfd82AE)
* WETHPrimeConverter: [`0x274a834eFFA8D5479502dD6e78925Bc04ae82B46`](https://sepolia.etherscan.io/address/0x274a834eFFA8D5479502dD6e78925Bc04ae82B46)
* XVSVaultConverter: [`0xc203bfA9dCB0B5fEC510Db644A494Ff7f4968ed2`](https://sepolia.etherscan.io/address/0xc203bfA9dCB0B5fEC510Db644A494Ff7f4968ed2)
* ConverterNetwork: [`0xB5A4208bFC4cC2C4670744849B8fC35B21A690Fa`](https://sepolia.etherscan.io/address/0xB5A4208bFC4cC2C4670744849B8fC35B21A690Fa)

## Arbitrum Sepolia

* XVSVaultTreasury: [`0x309b71a417dA9CfA8aC47e6038000B1739d9A3A6`](https://sepolia.arbiscan.io/address/0x309b71a417dA9CfA8aC47e6038000B1739d9A3A6)
* SingleTokenConverterBeacon: [`0xC77D0F75f1e4e3720DA1D2F5D809F439125a2Fd4`](https://sepolia.arbiscan.io/address/0xC77D0F75f1e4e3720DA1D2F5D809F439125a2Fd4)
* USDTPrimeConverter: [`0xFC0ec257d3ec4D673cB4e2CD3827C202e75fd0be`](https://sepolia.arbiscan.io/address/0xFC0ec257d3ec4D673cB4e2CD3827C202e75fd0be)
* USDCPrimeConverter: [`0xE88ed530597bc8D50e8CfC0EecAAFf6A93248C74`](https://sepolia.arbiscan.io/address/0xE88ed530597bc8D50e8CfC0EecAAFf6A93248C74)
* WBTCPrimeConverter: [`0x3089F46caf6611806caA39Ffaf672097156b893a`](https://sepolia.arbiscan.io/address/0x3089F46caf6611806caA39Ffaf672097156b893a)
* WETHPrimeConverter: [`0x0d1e90c1F86CD1c1dF514B493c5985B3FD9CD6C8`](https://sepolia.arbiscan.io/address/0x0d1e90c1F86CD1c1dF514B493c5985B3FD9CD6C8)
* XVSVaultConverter: [`0x99942a033454Cef6Ffb2843886C8b2E658E7D5fd`](https://sepolia.arbiscan.io/address/0x99942a033454Cef6Ffb2843886C8b2E658E7D5fd)
* ConverterNetwork: [`0x9dD63dC8DADf90B67511939C00607484567B0D7A`](https://sepolia.arbiscan.io/address/0x9dD63dC8DADf90B67511939C00607484567B0D7A)
