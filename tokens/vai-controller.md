# VAI Comptroller
This is the implementation contract for the VAIUnitroller proxy

# Solidity API

```solidity
struct MintLocalVars {
  uint256 oErr;
  enum CarefulMath.MathError mathErr;
  uint256 mintAmount;
  uint256 accountMintVAINew;
  uint256 accountMintableVAI;
}
```

### repayVAI

Repay VAI

```solidity
function repayVAI(uint256 repayVAIAmount) external returns (uint256, uint256)
```

- - -

### liquidateVAI

The sender liquidates the vai minters collateral.
 The collateral seized is transferred to the liquidator.

```solidity
function liquidateVAI(address borrower, uint256 repayAmount, contract VTokenInterface vTokenCollateral) external returns (uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The borrower of vai to be liquidated |
| repayAmount | uint256 | The amount of the underlying borrowed asset to repay |
| vTokenCollateral | contract VTokenInterface | The market in which to seize collateral from the borrower |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (uint, uint) An error code (0=success, otherwise a failure, see ErrorReporter.sol), and the actual repayment amount. |
| [1] | uint256 |  |

- - -

### _setComptroller

Sets a new comptroller

```solidity
function _setComptroller(contract Comptroller comptroller_) external returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

- - -

```solidity
struct AccountAmountLocalVars {
  uint256 oErr;
  enum CarefulMath.MathError mErr;
  uint256 sumSupply;
  uint256 marketSupply;
  uint256 sumBorrowPlusEffects;
  uint256 vTokenBalance;
  uint256 borrowBalance;
  uint256 exchangeRateMantissa;
  uint256 oraclePriceMantissa;
  struct ExponentialNoError.Exp exchangeRate;
  struct ExponentialNoError.Exp oraclePrice;
  struct ExponentialNoError.Exp tokensToDenom;
}
```

### getVAIRepayAmount

Get the current total VAI a user needs to repay

```solidity
function getVAIRepayAmount(address account) public view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the VAI borrower |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (uint) The total amount of VAI the user needs to repay |

- - -

### getVAICalculateRepayAmount

Calculate how much VAI the user needs to repay

```solidity
function getVAICalculateRepayAmount(address borrower, uint256 repayAmount) public view returns (uint256, uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the VAI borrower |
| repayAmount | uint256 | The amount of VAI being returned |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (uint, uint, uint) Amount of VAI to be burned, amount of VAI the user needs to pay in current interest and amount of VAI the user needs to pay in past interest |
| [1] | uint256 |  |
| [2] | uint256 |  |

- - -

### setAccessControl

Sets the address of the access control of this contract

```solidity
function setAccessControl(address newAccessControlAddress) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newAccessControlAddress | address | New address for the access control |

- - -

### setBaseRate

Set VAI borrow base rate

```solidity
function setBaseRate(uint256 newBaseRateMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newBaseRateMantissa | uint256 | the base rate multiplied by 10**18 |

- - -

### setFloatRate

Set VAI borrow float rate

```solidity
function setFloatRate(uint256 newFloatRateMantissa) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newFloatRateMantissa | uint256 | the VAI float rate multiplied by 10**18 |

- - -

### setReceiver

Set VAI stability fee receiver address

```solidity
function setReceiver(address newReceiver) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newReceiver | address | the address of the VAI fee receiver |

- - -

### setMintCap

Set VAI mint cap

```solidity
function setMintCap(uint256 _mintCap) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _mintCap | uint256 | the amount of VAI that can be minted |

- - -

### getVAIAddress

Return the address of the VAI token

```solidity
function getVAIAddress() public view returns (address)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of VAI |

- - -

