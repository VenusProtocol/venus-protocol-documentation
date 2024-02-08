# 

# Solidity API

### vBnb

Address of vBNB contract.

```solidity
contract IVBNB vBnb
```

- - -

### comptroller

Address of Venus Unitroller contract.

```solidity
contract IComptroller comptroller
```

- - -

### vaiController

Address of VAIUnitroller contract.

```solidity
contract IVAIController vaiController
```

- - -

### wBNB

Address of wBNB contract

```solidity
address wBNB
```

- - -

### constructor

Constructor for the implementation contract. Sets immutable variables.

```solidity
constructor(address comptroller_, address payable vBnb_, address wBNB_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller_ | address | The address of the Comptroller contract |
| vBnb_ | address payable | The address of the VBNB |
| wBNB_ | address | The address of wBNB |

- - -

### initialize

Initializer for the implementation contract.

```solidity
function initialize(uint256 treasuryPercentMantissa_, address accessControlManager_, address protocolShareReserve_) external virtual
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| treasuryPercentMantissa_ | uint256 | Treasury share, scaled by 1e18 (e.g. 0.2 * 1e18 for 20%) |
| accessControlManager_ | address | address of access control manager |
| protocolShareReserve_ | address | The address of the protocol share reserve contract |

- - -

### restrictLiquidation

An admin function to restrict liquidations to allowed addresses only.

```solidity
function restrictLiquidation(address borrower) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |

- - -

### unrestrictLiquidation

An admin function to remove restrictions for liquidations.

```solidity
function unrestrictLiquidation(address borrower) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |

- - -

### addToAllowlist

An admin function to add the liquidator to the allowedLiquidatorsByAccount mapping for a certain
        borrower. If the liquidations are restricted, only liquidators from the
        allowedLiquidatorsByAccount mapping can participate in liquidating the positions of this borrower.

```solidity
function addToAllowlist(address borrower, address liquidator) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |
| liquidator | address |  |

- - -

### removeFromAllowlist

An admin function to remove the liquidator from the allowedLiquidatorsByAccount mapping of a certain
        borrower. If the liquidations are restricted, this liquidator will not be
        able to liquidate the positions of this borrower.

```solidity
function removeFromAllowlist(address borrower, address liquidator) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |
| liquidator | address |  |

- - -

### liquidateBorrow

Liquidates a borrow and splits the seized amount between protocol share reserve and
        liquidator. The liquidators should use this interface instead of calling
        vToken.liquidateBorrow(...) directly.
Checks force VAI liquidation first; vToken should be address of vaiController if vaiDebt is greater than threshold
For BNB borrows msg.value should be equal to repayAmount; otherwise msg.value
     should be zero.

```solidity
function liquidateBorrow(address vToken, address borrower, uint256 repayAmount, contract IVToken vTokenCollateral) external payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Borrowed vToken |
| borrower | address | The address of the borrower |
| repayAmount | uint256 | The amount to repay on behalf of the borrower |
| vTokenCollateral | contract IVToken | The collateral to seize |

- - -

### setTreasuryPercent

Sets the new percent of the seized amount that goes to treasury. Should
        be less than or equal to comptroller.liquidationIncentiveMantissa().sub(1e18).

```solidity
function setTreasuryPercent(uint256 newTreasuryPercentMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newTreasuryPercentMantissa | uint256 | New treasury percent (scaled by 10^18). |

- - -

### setProtocolShareReserve

Sets protocol share reserve contract address

```solidity
function setProtocolShareReserve(address payable protocolShareReserve_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| protocolShareReserve_ | address payable | The address of the protocol share reserve contract |

- - -

### reduceReserves

Reduce the reserves of the pending accumulated reserves

```solidity
function reduceReserves() external
```

- - -

### setMinLiquidatableVAI

Sets the threshold for minimum amount of vaiLiquidate

```solidity
function setMinLiquidatableVAI(uint256 minLiquidatableVAI_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| minLiquidatableVAI_ | uint256 | New address for the access control |

- - -

### setPendingRedeemChunkLength

Length of the pendingRedeem array to be consider while redeeming in Liquidation transaction

```solidity
function setPendingRedeemChunkLength(uint256 newLength_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newLength_ | uint256 | Length of the chunk |

- - -

### pauseForceVAILiquidate

Pause Force Liquidation of VAI

```solidity
function pauseForceVAILiquidate() external
```

- - -

### resumeForceVAILiquidate

Resume Force Liquidation of VAI

```solidity
function resumeForceVAILiquidate() external
```

- - -

