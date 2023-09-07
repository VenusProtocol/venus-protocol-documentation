# RewardFacet
This facet contract provides the external functions related to all claims and rewards of the protocol

# Solidity API

### claimVenus

Claim all the xvs accrued by holder in all markets and VAI

```solidity
function claimVenus(address holder) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |

- - -

### claimVenus

Claim all the xvs accrued by holder in the specified markets

```solidity
function claimVenus(address holder, contract VToken[] vTokens) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |
| vTokens | contract VToken[] | The list of markets to claim XVS in |

- - -

### claimVenus

Claim all xvs accrued by the holders

```solidity
function claimVenus(address[] holders, contract VToken[] vTokens, bool borrowers, bool suppliers) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holders | address[] | The addresses to claim XVS for |
| vTokens | contract VToken[] | The list of markets to claim XVS in |
| borrowers | bool | Whether or not to claim XVS earned by borrowing |
| suppliers | bool | Whether or not to claim XVS earned by supplying |

- - -

### claimVenusAsCollateral

Claim all the xvs accrued by holder in all markets, a shorthand for `claimVenus` with collateral set to `true`

```solidity
function claimVenusAsCollateral(address holder) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |

- - -

### _grantXVS

Transfer XVS to the recipient

```solidity
function _grantXVS(address recipient, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address of the recipient to transfer XVS to |
| amount | uint256 | The amount of XVS to (possibly) transfer |

- - -

### getXVSVTokenAddress

Return the address of the XVS vToken

```solidity
function getXVSVTokenAddress() public pure returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of XVS vToken |

- - -

### claimVenus

Claim all xvs accrued by the holders

```solidity
function claimVenus(address[] holders, contract VToken[] vTokens, bool borrowers, bool suppliers, bool collateral) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| holders | address[] | The addresses to claim XVS for |
| vTokens | contract VToken[] | The list of markets to claim XVS in |
| borrowers | bool | Whether or not to claim XVS earned by borrowing |
| suppliers | bool | Whether or not to claim XVS earned by supplying |
| collateral | bool | Whether or not to use XVS earned as collateral, only takes effect when the holder has a shortfall |

- - -

