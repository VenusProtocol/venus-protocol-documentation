# FacetBase

This facet contract contains functions related to access and checks

# Solidity API

### venusInitialIndex

The initial Venus index for a market

```solidity
uint224 venusInitialIndex
```

---

### actionPaused

Checks if a certain action is paused on a market

```solidity
function actionPaused(address market, enum Action action) public view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | vToken address |
| action | enum Action | Action id |

---

### getXVSAddress

Returns the XVS address

```solidity
function getXVSAddress() external view returns (address)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | address | The address of XVS token |

---

### getPoolMarketIndex

Returns the unique market index for the given poolId and vToken pair

```solidity
function getPoolMarketIndex(uint96 poolId, address vToken) public pure returns (PoolMarketId)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool |
| vToken | address | The address of the market (vToken) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | PoolMarketId | PoolMarketId The `bytes32` key that uniquely represents the (poolId, vToken) pair |

---
