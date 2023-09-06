# AbstractTokenConverter

This contract provides every feature to configure and convert the desired assets. 

# Solidity API

### MAX_INCENTIVE

Maximum incentive could be

```solidity
uint256 MAX_INCENTIVE
```

- - -

### priceOracle

Venus price oracle contract

```solidity
contract ResilientOracle priceOracle
```

- - -

### convertConfigurations

conversion configurations for the existing pairs

```solidity
mapping(address => mapping(address => struct IAbstractTokenConverter.ConversionConfig)) convertConfigurations
```

- - -

### destinationAddress

Address at all incoming tokens are transferred to

```solidity
address destinationAddress
```

- - -

### conversionPaused

Boolean of if convert is paused

```solidity
bool conversionPaused
```

- - -

### pauseConversion

Pause conversion of tokens

```solidity
function pauseConversion() external
```

#### 📅 Events
* Emits ConversionPaused on success

#### ⛔️ Access Requirements
* Restricted by ACM

#### ❌ Errors
* ConversionTokensPaused thrown when convert is already paused

- - -

### resumeConversion

Resume conversion of tokens.

```solidity
function resumeConversion() external
```

#### 📅 Events
* Emits ConversionResumed on success

#### ⛔️ Access Requirements
* Restricted by ACM

#### ❌ Errors
* ConversionTokensActive thrown when convert is already active

- - -

### setPriceOracle

Sets a new price oracle

```solidity
function setPriceOracle(contract ResilientOracle priceOracle_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| priceOracle_ | contract ResilientOracle | Address of the new price oracle to set |

#### ⛔️ Access Requirements
* Only Governance

- - -

### setDestination

Sets a new destination address

```solidity
function setDestination(address destinationAddress_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| destinationAddress_ | address | Address of the new price oracle to set |

#### ⛔️ Access Requirements
* Only Governance

- - -

### setConversionConfig

Set the configuration for new or existing convert pair

```solidity
function setConversionConfig(struct IAbstractTokenConverter.ConversionConfig conversionConfig) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| conversionConfig | struct IAbstractTokenConverter.ConversionConfig | ConversionConfig config details to update |

#### 📅 Events
* Emits ConversionConfigUpdated event on success

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Unauthorized error is thrown when the call is not authorized by AccessControlManager
* ZeroAddressNotAllowed is thrown when pool registry address is zero

- - -

### convertExactTokens

Convert exact amount of tokenAddressIn for tokenAddressOut

```solidity
function convertExactTokens(uint256 amountInMantissa, uint256 amountOutMinMantissa, address tokenAddressIn, address tokenAddressOut, address to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| amountOutMinMantissa | uint256 | Min amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |
| to | address | Address of the tokenAddressOut receiver |

#### 📅 Events
* Emits ConvertExactTokens event on success

#### ❌ Errors
* AmountOutLowerThanMinRequired error is thrown when amount of output tokenAddressOut is less than amountOutMinMantissa
* AmountInOrAmountOutMismatched error is thrown when Amount of tokenAddressIn or tokenAddressOut is lower than expected fater transfer

- - -

### convertForExactTokens

Convert tokens for tokenAddressIn for exact amount of tokenAddressOut

```solidity
function convertForExactTokens(uint256 amountInMaxMantissa, uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut, address to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMaxMantissa | uint256 | Max amount of tokenAddressIn |
| amountOutMantissa | uint256 | Amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |
| to | address | Address of the tokenAddressOut receiver |

#### 📅 Events
* Emits ConvertForExactTokens event on success

#### ❌ Errors
* AmountInHigherThanMax error is thrown when amount of tokenAddressIn is higher than amountInMaxMantissa
* AmountInOrAmountOutMismatched error is thrown when Amount of tokenAddressIn or tokenAddressOut is lower than expected fater transfer

- - -

### convertExactTokensSupportingFeeOnTransferTokens

Convert exact amount of tokenAddressIn for tokenAddressOut

```solidity
function convertExactTokensSupportingFeeOnTransferTokens(uint256 amountInMantissa, uint256 amountOutMinMantissa, address tokenAddressIn, address tokenAddressOut, address to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| amountOutMinMantissa | uint256 | Min amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |
| to | address | Address of the tokenAddressOut receiver |

#### 📅 Events
* Emits ConvertExactTokensSupportingFeeOnTransferTokens event on success

#### ❌ Errors
* AmountOutLowerThanMinRequired error is thrown when amount of output tokenAddressOut is less than amountOutMinMantissa

- - -

### convertForExactTokensSupportingFeeOnTransferTokens

Convert tokens for tokenAddressIn for exact amount of tokenAddressOut

```solidity
function convertForExactTokensSupportingFeeOnTransferTokens(uint256 amountInMaxMantissa, uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut, address to) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMaxMantissa | uint256 | Max amount of tokenAddressIn |
| amountOutMantissa | uint256 | Amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |
| to | address | Address of the tokenAddressOut receiver |

#### 📅 Events
* Emits ConvertForExactTokensSupportingFeeOnTransferTokens event on success

#### ❌ Errors
* AmountInHigherThanMax error is thrown when amount of tokenAddressIn is higher than amountInMaxMantissa

- - -

### sweepToken

A public function to sweep ERC20 tokens and transfer them to user(to address)

```solidity
function sweepToken(address tokenAddress, address to, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | The address of the ERC-20 token to sweep |
| to | address |  |
| amount | uint256 |  |

#### 📅 Events
* Emits SweepToken event on success

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when tokenAddress/to address is zero

- - -

### balanceOf

Get the balance for specific token

```solidity
function balanceOf(address token) public virtual returns (uint256 tokenBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | Address of the token |

- - -

### getAmountOut

To get the amount of tokenAddressOut tokens sender could receive on providing amountInMantissa tokens of tokenAddressIn

```solidity
function getAmountOut(uint256 amountInMantissa, address tokenAddressIn, address tokenAddressOut) public returns (uint256 amountConvertedMantissa, uint256 amountOutMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressIn should be transferred after convert |
| amountOutMantissa | uint256 | Amount of the tokenAddressOut sender should receive after convert |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when convert is disabled or config does not exist for given pair

- - -

### getAmountIn

To get the amount of tokenAddressIn tokens sender would send on receiving amountOutMantissa tokens of tokenAddressOut

```solidity
function getAmountIn(uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut) public returns (uint256 amountConvertedMantissa, uint256 amountInMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOutMantissa | uint256 | Amount of tokenAddressOut user wants to receive |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after convert |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressOut should be transferred after convert |
| amountInMantissa | uint256 | Amount of the tokenAddressIn sender would send to contract before convert |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when convert is disabled or config does not exist for given pair

- - -

