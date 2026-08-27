# StkBNBOracle

The currently registered BNB mainnet StkBNBOracle is an **uncapped V1 transparent proxy**, not an instance of the capped repository-main source.

| Checked block | Proxy | Implementation |
|---:|---|---|
| `118367342` | `0xdBAFD16c5eA8C29D1e94a5c26b31bFAC94331Ac6` | `0xA7C432c50D310c805c8342488921A108b585397F` |

The implementation constructor is:

```solidity
constructor(
    address stakePool,
    address stkBNB,
    address resilientOracle
)
```

`getUnderlyingAmount()` reads the StakePool exchange-rate structure, rejects a zero pool-token supply, and returns BNB per stkBNB. `getPrice(stkBNB)` multiplies that amount by the ResilientOracle BNB price.

The V1 implementation exposes immutable `STAKE_POOL`, `CORRELATED_TOKEN`, `UNDERLYING_TOKEN`, `RESILIENT_ORACLE`, and `NATIVE_TOKEN_ADDR` getters. It does not expose the V2 snapshot/growth setters.

The [`StkBNBOracle.sol` file at v2.16.0](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/StkBNBOracle.sol) has the newer nine-argument capped V2 constructor. Do not use that ABI for the proxy above unless a later onchain implementation upgrade proves it applies.
