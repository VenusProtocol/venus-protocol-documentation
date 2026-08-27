# Correlated Token Oracles

Correlated-token oracles price a receipt, staking, or yield-bearing token from an exchange rate and the USD price of a related underlying asset. The directory contains more than one deployed generation; constructor and permission models must be selected per address.

## Version families

| Family | Deployment shape | Pricing and control model |
|---|---|---|
| V1 uncapped | usually a transparent proxy with constructor immutables in the implementation | live exchange rate × underlying USD price; no snapshot-growth cap |
| V2 capped | non-proxy immutable deployment in current artifacts | optional exchange-rate growth cap, AccessControlManager setters, and permissionless interval-based snapshot updates |
| Special implementations | proxy or non-proxy | purpose-built logic such as `SFrxETHOracle`; do not assume the common-base ABI |

The current [`CorrelatedTokenOracle`](common/correlated-token-oracle.md) source is V2. It is not ABI-compatible with every older proxy implementation that remains deployed.

## Mainnet examples

The addresses below come from the [`oracle` v2.16.0 deployment artifacts](https://github.com/VenusProtocol/oracle/tree/v2.16.0/deployments). Code was also present at BNB Chain block `118367342` and Ethereum block `25845949` on August 27, 2026. This is version evidence, not proof that a ResilientOracle currently consumes an instance.

| Network | Instance | Address | Version |
|---|---|---|---|
| BNB Chain | AnkrBNBOracle | `0x4512e9579734f7B8730f0a05Cd0D92DC33EB2675` | V2 non-proxy |
| BNB Chain | AsBNBOracle | `0x652B90D1d45a7cD5BE82c5Fb61a4A00bA126dde5` | V2 non-proxy |
| BNB Chain | BNBxOracle | `0xC2E2b6f9CdE2BFA5Ba5fda2Dd113CAcD781bdb31` | V2 non-proxy |
| BNB Chain | SlisBNBOracle | `0xDDE6446E66c786afF4cd3D183a908bCDa57DF9c1` | V2 non-proxy |
| BNB Chain | WBETHOracle | `0x49938fc72262c126eb5D4BdF6430C55189AEB2BA` | V2 non-proxy |
| BNB Chain | StkBNBOracle | `0xdBAFD16c5eA8C29D1e94a5c26b31bFAC94331Ac6` | V1 transparent proxy |
| Ethereum | SFraxOracle | `0x1aDCE75BB3164bBf6060a4f44262df5414473110` | V2 non-proxy |
| Ethereum | SFrxETHOracle | `0x5E06A5f48692E4Fff376fDfCA9E4C0183AAADCD1` | special transparent proxy |
| Ethereum | WeETHAccountantOracle (weETHs) | `0x47F7A7f3486b08A019E0c10Af969ADC4B6E415Cd` | V2 non-proxy |
| Ethereum | WeETHOracle, equivalence route | `0xaB663D4a701229DFF407Eb4B45007921029072e9` | V2 non-proxy |
| Ethereum | weETH, non-equivalence route | `0x92469958A4C00101F9F290cc3AC32959Af497EAf` | V2 `OneJumpOracle` |
| Ethereum | WstETHOracleV2, equivalence route | `0x6b51Ee3aF70b350AaADc05f418502b330c5Aad7c` | V2 non-proxy |
| Ethereum | WstETHOracleV2, non-equivalence route | `0x6ecf38558B0D1fFc6Ea28bEC6BD39F9F0Fdd6631` | V2 non-proxy |

`OneJumpOracle` and `PendleOracle` have both V1 and V2 deployments across several networks and maturities. Their pages describe the two ABIs explicitly.

## Integration checklist

1. Read the asset's current `ResilientOracle.getTokenConfig` and identify the enabled role and oracle address.
2. Determine whether the address is a proxy, and resolve its implementation if it is.
3. Match that exact bytecode to V1, V2, or a special implementation.
4. For V2, read snapshot, growth, gap, and ACM configuration at the same block.
5. Treat a dated or still-deployed address as lifecycle evidence only after checking consumers and outstanding market duties.

See the [deployed oracle registry](../../../deployed-contracts/oracles.md) for address discovery, then confirm all dynamic configuration onchain.
