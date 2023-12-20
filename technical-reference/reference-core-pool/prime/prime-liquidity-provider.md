# PrimeLiquidityProvider
PrimeLiquidityProvider is used to fund Prime

# Solidity API

### DEFAULT_MAX_DISTRIBUTION_SPEED

The default max token distribution speed

```solidity
uint256 DEFAULT_MAX_DISTRIBUTION_SPEED
```

- - -

### prime

Address of the Prime contract

```solidity
address prime
```

- - -

### tokenDistributionSpeeds

The rate at which token is distributed (per block)

```solidity
mapping(address => uint256) tokenDistributionSpeeds
```

- - -

### maxTokenDistributionSpeeds

The max token distribution speed for token

```solidity
mapping(address => uint256) maxTokenDistributionSpeeds
```

- - -

### lastAccruedBlock

The rate at which token is distributed to the Prime contract

```solidity
mapping(address => uint256) lastAccruedBlock
```

- - -

### tokenAmountAccrued

The token accrued but not yet transferred to prime contract

```solidity
mapping(address => uint256) tokenAmountAccrued
```

- - -

### initialize

PrimeLiquidityProvider initializer

```solidity
function initialize(address accessControlManager_, address[] tokens_, uint256[] distributionSpeeds_, uint256[] maxDistributionSpeeds_, uint256 loopsLimit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| accessControlManager_ | address | AccessControlManager contract address |
| tokens_ | address[] | Array of addresses of the tokens |
| distributionSpeeds_ | uint256[] | New distribution speeds for tokens |
| maxDistributionSpeeds_ | uint256[] |  |
| loopsLimit_ | uint256 | Maximum number of loops allowed in a single transaction |

#### ❌ Errors
* Throw InvalidArguments on different length of tokens and speeds array

- - -

### initializeTokens

Initialize the distribution of the token

```solidity
function initializeTokens(address[] tokens_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokens_ | address[] | Array of addresses of the tokens to be intialized |

#### ⛔️ Access Requirements
* Only Governance

- - -

### pauseFundsTransfer

Pause fund transfer of tokens to Prime contract

```solidity
function pauseFundsTransfer() external
```

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### resumeFundsTransfer

Resume fund transfer of tokens to Prime contract

```solidity
function resumeFundsTransfer() external
```

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### setTokensDistributionSpeed

Set distribution speed (amount of token distribute per block)

```solidity
function setTokensDistributionSpeed(address[] tokens_, uint256[] distributionSpeeds_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokens_ | address[] | Array of addresses of the tokens |
| distributionSpeeds_ | uint256[] | New distribution speeds for tokens |

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidArguments on different length of tokens and speeds array

- - -

### setMaxTokensDistributionSpeed

Set max distribution speed for token (amount of maximum token distribute per block)

```solidity
function setMaxTokensDistributionSpeed(address[] tokens_, uint256[] maxDistributionSpeeds_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokens_ | address[] | Array of addresses of the tokens |
| maxDistributionSpeeds_ | uint256[] | New distribution speeds for tokens |

#### ⛔️ Access Requirements
* Controlled by ACM

#### ❌ Errors
* Throw InvalidArguments on different length of tokens and speeds array

- - -

### setPrimeToken

Set the prime token contract address

```solidity
function setPrimeToken(address prime_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| prime_ | address | The new address of the prime token contract |

#### 📅 Events
* Emits PrimeTokenUpdated event

#### ⛔️ Access Requirements
* Only owner

- - -

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| loopsLimit | uint256 | Limit for the max loops can execute at a time |

#### 📅 Events
* Emits MaxLoopsLimitUpdated event on success

#### ⛔️ Access Requirements
* Controlled by ACM

- - -

### releaseFunds

Claim all the token accrued till last block

```solidity
function releaseFunds(address token_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | address | The token to release to the Prime contract |

#### 📅 Events
* Emits TokenTransferredToPrime event

#### ❌ Errors
* Throw InvalidArguments on Zero address(token)
* Throw FundsTransferIsPaused is paused
* Throw InvalidCaller if the sender is not the Prime contract

- - -

### sweepToken

A public function to sweep accidental ERC-20 transfers to this contract. Tokens are sent to user

```solidity
function sweepToken(contract IERC20Upgradeable token_, address to_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | contract IERC20Upgradeable | The address of the ERC-20 token to sweep |
| to_ | address | The address of the recipient |
| amount_ | uint256 | The amount of tokens needs to transfer |

#### 📅 Events
* Emits SweepToken event

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* Throw InsufficientBalance if amount_ is greater than the available balance of the token in the contract

- - -

### getEffectiveDistributionSpeed

Get rewards per block for token

```solidity
function getEffectiveDistributionSpeed(address token_) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | address | Address of the token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | speed returns the per block reward |

- - -

### accrueTokens

Accrue token by updating the distribution state

```solidity
function accrueTokens(address token_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | address | Address of the token |

#### 📅 Events
* Emits TokensAccrued event

- - -

### getBlockNumber

Get the latest block number

```solidity
function getBlockNumber() public view virtual returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | blockNumber returns the block number |

- - -

