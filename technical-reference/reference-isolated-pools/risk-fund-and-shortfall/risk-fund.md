# RiskFund

Contract with basic features to track/hold different assets for different Comptrollers.

# Solidity API

### swapPoolsAssets

Swap array of pool assets into base asset's tokens of at least a minimum amount

```solidity
function swapPoolsAssets(address[] markets, uint256[] amountsOutMin, address[][] paths) external returns (uint256)
```

#### Parameters

| Name          | Type        | Description                                          |
| ------------- | ----------- | ---------------------------------------------------- |
| markets       | address\[]   | Array of vTokens whose assets to swap for base asset |
| amountsOutMin | uint256\[]   | Minimum amount to receive for swap                   |
| paths         | address\[]\[] | A path conststing of PCS token pairs for each swap   |

#### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| \[0]  | uint256 | Number of swapped tokens |

#### ❌ Errors

* ZeroAddressNotAllowed is thrown if PoolRegistry contract address is not configured

---

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 limit) external
```

#### Parameters

| Name  | Type    | Description                                   |
| ----- | ------- | --------------------------------------------- |
| limit | uint256 | Limit for the max loops can execute at a time |

---
