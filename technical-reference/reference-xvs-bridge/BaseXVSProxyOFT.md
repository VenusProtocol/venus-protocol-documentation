# BaseXVSProxyOFT
The BaseXVSProxyOFT contract is tailored for facilitating cross-chain transactions with an ERC20 token.
It manages transaction limits of a single and daily transactions.
This contract inherits key functionalities from other contracts, including pausing capabilities and error handling.
It holds state variables for the inner token and maps for tracking transaction limits and statistics across various chains and addresses.
The contract allows the owner to configure limits, set whitelists, and control pausing.
Internal functions conduct eligibility check of transactions, making the contract a fundamental component for cross-chain token management.

# Solidity API

### oracle

The address of ResilientOracle contract wrapped in its interface.

```solidity
contract ResilientOracleInterface oracle
```

- - -

### chainIdToMaxSingleTransactionLimit

Maximum limit for a single transaction in USD(scaled with 18 decimals) from local chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxSingleTransactionLimit
```

- - -

### chainIdToMaxDailyLimit

Maximum daily limit for transactions in USD(scaled with 18 decimals) from local chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxDailyLimit
```

- - -

### chainIdToLast24HourTransferred

Total sent amount in USD(scaled with 18 decimals) within the last 24-hour window from local chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourTransferred
```

- - -

### chainIdToLast24HourWindowStart

Timestamp when the last 24-hour window started from local chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourWindowStart
```

- - -

### chainIdToMaxSingleReceiveTransactionLimit

Maximum limit for a single receive transaction in USD(scaled with 18 decimals) from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxSingleReceiveTransactionLimit
```

- - -

### chainIdToMaxDailyReceiveLimit

Maximum daily limit for receiving transactions in USD(scaled with 18 decimals) from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxDailyReceiveLimit
```

- - -

### chainIdToLast24HourReceived

Total received amount in USD(scaled with 18 decimals) within the last 24-hour window from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourReceived
```

- - -

### chainIdToLast24HourReceiveWindowStart

Timestamp when the last 24-hour window started from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourReceiveWindowStart
```

- - -

### whitelist

Address on which cap check and bound limit is not applicable.

```solidity
mapping(address => bool) whitelist
```

- - -

### setOracle

Set the address of the ResilientOracle contract.

```solidity
function setOracle(address oracleAddress_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| oracleAddress_ | address | The new address of the ResilientOracle contract. |

#### 📅 Events
* Emits OracleChanged with old and new oracle address.

#### ⛔️ Access Requirements
* Only owner.

- - -

### setMaxSingleTransactionLimit

Sets the limit of single transaction amount.

```solidity
function setMaxSingleTransactionLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId_ | uint16 | Destination chain id. |
| limit_ | uint256 | Amount in USD(scaled with 18 decimals). |

#### 📅 Events
* Emits SetMaxSingleTransactionLimit with old and new limit associated with chain id.

#### ⛔️ Access Requirements
* Only owner.

- - -

### setMaxDailyLimit

Sets the limit of daily (24 Hour) transactions amount.

```solidity
function setMaxDailyLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId_ | uint16 | Destination chain id. |
| limit_ | uint256 | Amount in USD(scaled with 18 decimals). |

#### 📅 Events
* Emits setMaxDailyLimit with old and new limit associated with chain id.

#### ⛔️ Access Requirements
* Only owner.

- - -

### setMaxSingleReceiveTransactionLimit

Sets the maximum limit for a single receive transaction.

```solidity
function setMaxSingleReceiveTransactionLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId_ | uint16 | The destination chain ID. |
| limit_ | uint256 | The new maximum limit in USD(scaled with 18 decimals). |

#### 📅 Events
* Emits setMaxSingleReceiveTransactionLimit with old and new limit associated with chain id.

#### ⛔️ Access Requirements
* Only owner.

- - -

### setMaxDailyReceiveLimit

Sets the maximum daily limit for receiving transactions.

```solidity
function setMaxDailyReceiveLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| chainId_ | uint16 | The destination chain ID. |
| limit_ | uint256 | The new maximum daily limit in USD(scaled with 18 decimals). |

#### 📅 Events
* Emits setMaxDailyReceiveLimit with old and new limit associated with chain id.

#### ⛔️ Access Requirements
* Only owner.

- - -

### setWhitelist

Sets the whitelist address to skip checks on transaction limit.

```solidity
function setWhitelist(address user_, bool val_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user_ | address | Address to be add in whitelist. |
| val_ | bool | Boolean to be set (true for user_ address is whitelisted). |

#### 📅 Events
* Emits setWhitelist.

#### ⛔️ Access Requirements
* Only owner.

- - -

### pause

Triggers stopped state of the bridge.

```solidity
function pause() external
```

#### ⛔️ Access Requirements
* Only owner.

- - -

### unpause

Triggers resume state of the bridge.

```solidity
function unpause() external
```

#### ⛔️ Access Requirements
* Only owner.

- - -

### sweepToken

A public function to sweep accidental ERC-20 transfers to this contract. Tokens are sent to user

```solidity
function sweepToken(contract IERC20 token_, address to_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | contract IERC20 | The address of the ERC-20 token to sweep |
| to_ | address | The address of the recipient |
| amount_ | uint256 | The amount of tokens needs to transfer |

#### 📅 Events
* Emits SweepToken event

#### ⛔️ Access Requirements
* Only Owner

#### ❌ Errors
* Throw InsufficientBalance if amount_ is greater than the available balance of the token in the contract

- - -

### removeTrustedRemote

Remove trusted remote from storage.

```solidity
function removeTrustedRemote(uint16 remoteChainId_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| remoteChainId_ | uint16 | The chain's id corresponds to setting the trusted remote to empty. |

#### 📅 Events
* Emits TrustedRemoteRemoved once chain id is removed from trusted remote.

#### ⛔️ Access Requirements
* Only owner.

- - -

### updateSendAndCallEnabled

It enables or disables sendAndCall functionality for the bridge.

```solidity
function updateSendAndCallEnabled(bool enabled_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| enabled_ | bool | Boolean indicating whether the sendAndCall function should be enabled or disabled. |

- - -

### isEligibleToSend

Checks the eligibility of a sender to initiate a cross-chain token transfer.

```solidity
function isEligibleToSend(address from_, uint16 dstChainId_, uint256 amount_) external view returns (bool eligibleToSend, uint256 maxSingleTransactionLimit, uint256 maxDailyLimit, uint256 amountInUsd, uint256 transferredInWindow, uint256 last24HourWindowStart, bool isWhiteListedUser)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| from_ | address | The sender's address initiating the transfer. |
| dstChainId_ | uint16 | Indicates destination chain. |
| amount_ | uint256 | The quantity of tokens to be transferred. |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| eligibleToSend | bool | A boolean indicating whether the sender is eligible to transfer the tokens. |
| maxSingleTransactionLimit | uint256 | The maximum limit for a single transaction. |
| maxDailyLimit | uint256 | The maximum daily limit for transactions. |
| amountInUsd | uint256 | The equivalent amount in USD based on the oracle price. |
| transferredInWindow | uint256 | The total amount transferred in the current 24-hour window. |
| last24HourWindowStart | uint256 | The timestamp when the current 24-hour window started. |
| isWhiteListedUser | bool | A boolean indicating whether the sender is whitelisted. |

- - -

### sendAndCall

Initiates a cross-chain token transfer and triggers a call on the destination chain.

```solidity
function sendAndCall(address from_, uint16 dstChainId_, bytes32 toAddress_, uint256 amount_, bytes payload_, uint64 dstGasForCall_, struct ICommonOFT.LzCallParams callparams_) public payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| from_ | address | Address from which tokens will be debited. |
| dstChainId_ | uint16 | Destination chain id on which tokens will be send. |
| toAddress_ | bytes32 | Address on which tokens will be credited on destination chain. |
| amount_ | uint256 | Amount of tokens that will be transferred. |
| payload_ | bytes | Additional data payload for the call on the destination chain. |
| dstGasForCall_ | uint64 | The amount of gas allocated for the call on the destination chain. |
| callparams_ | struct ICommonOFT.LzCallParams | Additional parameters, including refund address, ZRO payment address,                   and adapter params. |

- - -

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishappening.

```solidity
function renounceOwnership() public
```

- - -

### token

Return's the address of the inner token of this bridge.

```solidity
function token() public view returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | Address of the inner token of this bridge. |

- - -

