#

# Solidity API

### oracle

The address of ResilientOracle contract wrapped in its interface.

```solidity
contract ResilientOracleInterface oracle
```

---

### chainIdToMaxSingleTransactionLimit

Maximum limit for a single transaction in USD from local chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxSingleTransactionLimit
```

---

### chainIdToMaxDailyLimit

Maximum daily limit for transactions in USD from local chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxDailyLimit
```

---

### chainIdToLast24HourTransferred

Total sent amount in USD within the last 24-hour window from local chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourTransferred
```

---

### chainIdToLast24HourWindowStart

Timestamp when the last 24-hour window started from local chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourWindowStart
```

---

### chainIdToMaxSingleReceiveTransactionLimit

Maximum limit for a single receive transaction in USD from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxSingleReceiveTransactionLimit
```

---

### chainIdToMaxDailyReceiveLimit

Maximum daily limit for receiving transactions in USD from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToMaxDailyReceiveLimit
```

---

### chainIdToLast24HourReceived

Total received amount in USD within the last 24-hour window from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourReceived
```

---

### chainIdToLast24HourReceiveWindowStart

Timestamp when the last 24-hour window started from remote chain.

```solidity
mapping(uint16 => uint256) chainIdToLast24HourReceiveWindowStart
```

---

### whitelist

Address on which cap check and bound limit is not appicable.

```solidity
mapping(address => bool) whitelist
```

---

### setOracle

Set the address of the ResilientOracle contract.

```solidity
function setOracle(address oracleAddress_) external
```

#### Parameters

| Name            | Type    | Description                                      |
| --------------- | ------- | ------------------------------------------------ |
| oracleAddress\_ | address | The new address of the ResilientOracle contract. |

---

### setMaxSingleTransactionLimit

Sets the limit of single transaction amount.

```solidity
function setMaxSingleTransactionLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters

| Name      | Type    | Description           |
| --------- | ------- | --------------------- |
| chainId\_ | uint16  | Destination chain id. |
| limit\_   | uint256 | Amount in USD.        |

---

### setMaxDailyLimit

Sets the limit of daily (24 Hour) transactions amount.

```solidity
function setMaxDailyLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters

| Name      | Type    | Description           |
| --------- | ------- | --------------------- |
| chainId\_ | uint16  | Destination chain id. |
| limit\_   | uint256 | Amount in USD.        |

---

### setMaxSingleReceiveTransactionLimit

Sets the maximum limit for a single receive transaction.

```solidity
function setMaxSingleReceiveTransactionLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters

| Name      | Type    | Description                   |
| --------- | ------- | ----------------------------- |
| chainId\_ | uint16  | The destination chain ID.     |
| limit\_   | uint256 | The new maximum limit in USD. |

---

### setMaxDailyReceiveLimit

Sets the maximum daily limit for receiving transactions.

```solidity
function setMaxDailyReceiveLimit(uint16 chainId_, uint256 limit_) external
```

#### Parameters

| Name      | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| chainId\_ | uint16  | The destination chain ID.           |
| limit\_   | uint256 | The new maximum daily limit in USD. |

---

### setWhitelist

Sets the whitelist address to skip checks on transaction limit.

```solidity
function setWhitelist(address user_, bool val_) external
```

#### Parameters

| Name   | Type    | Description                                        |
| ------ | ------- | -------------------------------------------------- |
| user\_ | address | Adress to be add in whitelist.                     |
| val\_  | bool    | Boolean to be set (true for isWhitelisted address) |

---

### pause

Triggers stopped state of the bridge.

```solidity
function pause() external
```

---

### unpause

Triggers resume state of the bridge.

```solidity
function unpause() external
```

---

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishappening.

```solidity
function renounceOwnership() public
```

---
