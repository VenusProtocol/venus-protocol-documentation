# ProtocolShareReserve

## ProtocolShareReserve

Contract used to store and distribute the reserves generated in the markets.

## Solidity API

#### initialize

Initializes the deployer to owner.

```solidity
function initialize(address protocolIncome_, address riskFund_) external
```

**Parameters**

| Name             | Type    | Description                                 |
| ---------------- | ------- | ------------------------------------------- |
| protocolIncome\_ | address | The address protocol income will be sent to |
| riskFund\_       | address | Risk fund address                           |

**❌ Errors**

* ZeroAddressNotAllowed is thrown when protocol income address is zero
* ZeroAddressNotAllowed is thrown when risk fund address is zero

---

#### setPoolRegistry

Pool registry setter.

```solidity
function setPoolRegistry(address poolRegistry_) external
```

**Parameters**

| Name           | Type    | Description                  |
| -------------- | ------- | ---------------------------- |
| poolRegistry\_ | address | Address of the pool registry |

**❌ Errors**

* ZeroAddressNotAllowed is thrown when pool registry address is zero

---

#### releaseFunds

Release funds

```solidity
function releaseFunds(address comptroller, address asset, uint256 amount) external returns (uint256)
```

**Parameters**

| Name        | Type    | Description          |
| ----------- | ------- | -------------------- |
| comptroller | address | Pool's Comptroller   |
| asset       | address | Asset to be released |
| amount      | uint256 | Amount to release    |

**Return Values**

| Name | Type    | Description                     |
| ---- | ------- | ------------------------------- |
| \[0] | uint256 | Number of total released tokens |

**❌ Errors**

* ZeroAddressNotAllowed is thrown when asset address is zero

---

#### updateAssetsState

Update the reserve of the asset for the specific pool after transferring to the protocol share reserve.

```solidity
function updateAssetsState(address comptroller, address asset) public
```

**Parameters**

| Name        | Type    | Description               |
| ----------- | ------- | ------------------------- |
| comptroller | address | Comptroller address(pool) |
| asset       | address | Asset address.            |

---
