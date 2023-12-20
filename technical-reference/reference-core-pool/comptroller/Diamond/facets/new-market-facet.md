# New Market Facet

This facet contract contains functions regarding markets

# Solidity API

### isComptroller

Indicator that this is a Comptroller contract (for inspection)

```solidity
function isComptroller() public pure returns (bool)
```

- - -

### getAssetsIn

Returns the assets an account has entered

```solidity
function getAssetsIn(address account) external view returns (contract VToken[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to pull assets for |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract VToken[] | A dynamic list with the assets the account has entered |

- - -

### getAllMarkets

Return all of the markets

```solidity
function getAllMarkets() external view returns (contract VToken[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract VToken[] | The list of market addresses |

- - -

### liquidateCalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateCalculateSeizeTokens(address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | The address of the borrowed vToken |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| [1] | uint256 |  |

- - -

### liquidateVAICalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateVAICalculateSeizeTokens(address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| [1] | uint256 |  |

- - -

### checkMembership

Returns whether the given account is entered in the given asset

```solidity
function checkMembership(address account, contract VToken vToken) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to check |
| vToken | contract VToken | The vToken to check |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the account is in the asset, otherwise false |

- - -

### enterMarkets

Add assets to be included in account liquidity calculation

```solidity
function enterMarkets(address[] vTokens) external returns (uint256[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address[] | The list of addresses of the vToken markets to be enabled |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | Success indicator for whether each corresponding market was entered |

- - -

### exitMarket

Removes asset from sender's account liquidity calculation

```solidity
function exitMarket(address vTokenAddress) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenAddress | address | The address of the asset to be removed |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Whether or not the account successfully exited the market |

- - -

### _supportMarket

Add the market to the markets mapping and set it as listed

```solidity
function _supportMarket(contract VToken vToken) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the market (token) to list |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 0=success, otherwise a failure. (See enum Error for details) |

- - -

### updateDelegate

Grants or revokes the borrowing delegate rights to / from an account
 If allowed, the delegate will be able to borrow funds on behalf of the sender
 Upon a delegated borrow, the delegate will receive the funds, and the borrower
 will see the debt on their account

```solidity
function updateDelegate(address delegate, bool allowBorrows) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The address to update the rights for |
| allowBorrows | bool | Whether to grant (true) or revoke (false) the rights |

- - -

