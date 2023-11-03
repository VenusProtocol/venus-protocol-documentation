# VBNBAdmin

This contract is the "admin" of the vBNB market, reducing the reserves of the market, sending them to the `ProtocolShareReserve` contract,
and allowing the executions of the rest of the privileged functions in the vBNB contract (after checking if the sender has the required permissions).

# Solidity API

### vBNB

address of vBNB

```solidity
contract VTokenInterface vBNB
```

---

### WBNB

address of WBNB contract

```solidity
contract IWBNB WBNB
```

---

### initialize

Used to initialize non-immutable variables

```solidity
function initialize(contract IProtocolShareReserve _protocolShareReserve, address accessControlManager) external
```

---

### setProtocolShareReserve

PSR setter.

```solidity
function setProtocolShareReserve(contract IProtocolShareReserve protocolShareReserve_) external
```

#### Parameters

| Name                   | Type                           | Description                 |
| ---------------------- | ------------------------------ | --------------------------- |
| protocolShareReserve\_ | contract IProtocolShareReserve | Address of the PSR contract |

#### 📅 Events

- Emits ProtocolShareReserveUpdated event.

#### ⛔️ Access Requirements

- Only owner (Governance)

---

### reduceReserves

Reduce reserves of vBNB, wrap them and send them to the PSR contract

```solidity
function reduceReserves(uint256 reduceAmount) external
```

#### Parameters

| Name         | Type    | Description                  |
| ------------ | ------- | ---------------------------- |
| reduceAmount | uint256 | amount of reserves to reduce |

#### 📅 Events

- Emits ReservesReduced event.

---

### receive

Invoked when BNB is sent to this contract

```solidity
receive() external payable
```

#### ⛔️ Access Requirements

- Only vBNB is considered a valid sender

---

### fallback

Invoked when called function does not exist in the contract. The function will be executed in the vBNB contract.

```solidity
fallback(bytes data) external payable returns (bytes)
```

#### ⛔️ Access Requirements

- Only owner (Governance)

---
