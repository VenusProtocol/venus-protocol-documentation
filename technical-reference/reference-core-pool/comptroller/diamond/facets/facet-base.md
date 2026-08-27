# FacetBase

`FacetBase` is shared inherited code for the BNB Core Pool facets, not a separately deployed runtime facet. The public getters below are reached through whichever installed facet exposes their selectors. Resolve each selector through the live Diamond before calling it.

# Solidity API

### venusInitialIndex

The initial Venus index for a market

```solidity
uint224 venusInitialIndex
```

---

### corePoolId

Returns the Core Pool identifier used by the shared facet storage.

```solidity
function corePoolId() external pure returns (uint96)
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
