# PrimeLens
PrimeLens is a read-only helper contract for off-chain APR queries against PrimeV2. It is kept separate from PrimeV2 to stay within the EVM contract-size limit. It holds an immutable reference to a PrimeV2 instance and derives values from PrimeV2 and PrimeLiquidityProvider state.

# Solidity API

### primeV2

The PrimeV2 instance this lens reads from (set in the constructor)

```solidity
contract IPrimeV2WithStorage primeV2
```

- - -

### constructor

```solidity
constructor(address primeV2_)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| primeV2_ | address | Address of the PrimeV2 contract |

#### ❌ Errors
* Throw InvalidAddress if primeV2_ is the zero address

- - -

### calculateAPR

Returns supply and borrow APR for a user in a given market, based on current state.

```solidity
function calculateAPR(address market, address user) external view returns (struct IPrimeV2.APRInfo aprInfo)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | The market for which to fetch the APR |
| user | address | The account for which to get the APR |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| aprInfo | struct IPrimeV2.APRInfo | APR information for the user in the given market |

The `APRInfo` struct contains:

```solidity
struct APRInfo {
  uint256 supplyAPR;          // supply APR of the user in BPS
  uint256 borrowAPR;          // borrow APR of the user in BPS
  uint256 totalScore;         // total score of the market
  uint256 userScore;          // score of the user
  uint256 xvsBalanceForScore; // XVS balance of the user used for score
  uint256 capital;            // capital of the user
  uint256 cappedSupply;       // capped supply of the user
  uint256 cappedBorrow;       // capped borrow of the user
  uint256 supplyCapUSD;       // supply cap of the user in USD
  uint256 borrowCapUSD;       // borrow cap of the user in USD
}
```

- - -

### estimateAPR

Returns supply and borrow APR for a user in a given market based on hypothetical supply, borrow and XVS staked amounts. The user's score is recomputed from the supplied inputs (subtracting their existing market score and re-adding the estimated one), so the result reflects what the APR would be under the provided position.

```solidity
function estimateAPR(address market, address user, uint256 borrow, uint256 supply, uint256 xvsStaked) external view returns (struct IPrimeV2.APRInfo aprInfo)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | The market for which to fetch the APR |
| user | address | The account for which to get the APR |
| borrow | uint256 | Hypothetical borrow amount |
| supply | uint256 | Hypothetical supply amount |
| xvsStaked | uint256 | Hypothetical staked XVS amount |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| aprInfo | struct IPrimeV2.APRInfo | APR information for the user in the given market (same `APRInfo` struct as `calculateAPR`) |

- - -

### incomeDistributionYearly

The total income that will be distributed to Prime token holders for a market over a year. Computed as the PrimeLiquidityProvider effective distribution speed for the market's underlying multiplied by `blocksOrSecondsPerYear`.

```solidity
function incomeDistributionYearly(address vToken) public view returns (uint256 amount)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market for which to fetch the total income |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | The annualized distribution income |

- - -
