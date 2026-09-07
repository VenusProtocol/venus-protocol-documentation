# SFrxETHOracle

`SFrxETHOracle` is a special transparent-proxy oracle and does not inherit `CorrelatedTokenOracle`.

| Checked block | Proxy | Implementation |
|---:|---|---|
| `25845949` | `0x5E06A5f48692E4Fff376fDfCA9E4C0183AAADCD1` | `0x93e19584359C6c5844f1f7E1621983418b5A892F` |

The [`v2.16.0 source`](https://github.com/VenusProtocol/oracle/blob/v2.16.0/contracts/oracles/SFrxETHOracle.sol) fixes the Frax oracle and sfrxETH token in the implementation constructor:

```solidity
constructor(address sfrxEthFraxOracle, address sfrxETH)
```

Proxy initialization and configuration are:

```solidity
function initialize(
    address accessControlManager,
    uint256 maxAllowedPriceDifference
) external;

function setMaxAllowedPriceDifference(
    uint256 maxAllowedPriceDifference
) external;
```

The setter is ACM-controlled. At the checked block, `maxAllowedPriceDifference()` was `1.14e18` and `accessControlManager()` was `0x230058da2D23eb8836EC5DB7037ef7250c56E25E`.

`SFRXETH()` and `SFRXETH_FRAX_ORACLE()` expose the implementation immutables. The proxy also exposes inherited `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership`, `renounceOwnership`, and owner-only `setAccessControlManager` functions.

`getPrice(asset)` accepts only the configured sfrxETH address. It obtains Frax's low/high price pair, rejects bad or zero data, converts both values to USD, enforces the maximum high/low ratio, and returns their average.
