# AbstractTokenConverter

This contract provides every feature to configure and convert the desired assets. 

# Solidity API

### MAX_INCENTIVE

Maximum incentive could be

```solidity
uint256 MAX_INCENTIVE
```

- - -

### minAmountToConvert

Min amount to convert for private conversions. Defined in USD, with 18 decimals

```solidity
uint256 minAmountToConvert
```

- - -

### priceOracle

Venus price oracle contract

```solidity
contract ResilientOracle priceOracle
```

- - -

### conversionConfigurations

conversion configurations for the existing pairs

```solidity
mapping(address => mapping(address => struct IAbstractTokenConverter.ConversionConfig)) conversionConfigurations
```

- - -

### destinationAddress

Address that all incoming tokens are transferred to

```solidity
address destinationAddress
```

- - -

### conversionPaused

Boolean for if conversion is paused

```solidity
bool conversionPaused
```

- - -

### converterNetwork

Address of the converterNetwork contract

```solidity
contract IConverterNetwork converterNetwork
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
* ConversionTokensPaused thrown when conversion is already paused

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
* ConversionTokensActive thrown when conversion is already active

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
| destinationAddress_ | address | The new destination address to be set |

#### ⛔️ Access Requirements
* Only Governance

- - -

### setConverterNetwork

Sets a converter network contract address

```solidity
function setConverterNetwork(contract IConverterNetwork converterNetwork_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| converterNetwork_ | contract IConverterNetwork | The converterNetwork address to be set |

#### ⛔️ Access Requirements
* Only Governance

- - -

### setMinAmountToConvert

Min amount to convert setter

```solidity
function setMinAmountToConvert(uint256 minAmountToConvert_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| minAmountToConvert_ | uint256 | Min amount to convert |

#### ⛔️ Access Requirements
* Only Governance

- - -

### setConversionConfigs

Batch sets the conversion configurations

```solidity
function setConversionConfigs(address tokenAddressIn, address[] tokenAddressesOut, struct IAbstractTokenConverter.ConversionConfig[] conversionConfigs) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddressIn | address | Address of tokenIn |
| tokenAddressesOut | address[] | Array of addresses of tokenOut |
| conversionConfigs | struct IAbstractTokenConverter.ConversionConfig[] | Array of conversionConfig config details to update |

#### ❌ Errors
* InputLengthMisMatch is thrown when tokenAddressesOut and conversionConfigs array length mismatches

- - -

### convertExactTokens

Converts exact amount of tokenAddressIn for tokenAddressOut if there is enough tokens held by the contract

```solidity
function convertExactTokens(uint256 amountInMantissa, uint256 amountOutMinMantissa, address tokenAddressIn, address tokenAddressOut, address to) external returns (uint256 actualAmountIn, uint256 actualAmountOut)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| amountOutMinMantissa | uint256 | Min amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |
| to | address | Address of the tokenAddressOut receiver |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| actualAmountIn | uint256 | Actual amount transferred to destination |
| actualAmountOut | uint256 | Actual amount transferred to user |

#### 📅 Events
* Emits ConvertedExactTokens event on success

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when to address is zero
* InvalidToAddress error is thrown when address(to) is same as tokenAddressIn or tokenAddressOut
* AmountOutLowerThanMinRequired error is thrown when amount of output tokenAddressOut is less than amountOutMinMantissa
* AmountInMismatched error is thrown when amount of output tokenAddressOut is less than amountOutMinMantissa

- - -

### convertForExactTokens

Converts tokens for tokenAddressIn for exact amount of tokenAddressOut if there is enough tokens held by the contract,
otherwise the amount is adjusted

```solidity
function convertForExactTokens(uint256 amountInMaxMantissa, uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut, address to) external returns (uint256 actualAmountIn, uint256 actualAmountOut)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMaxMantissa | uint256 | Max amount of tokenAddressIn |
| amountOutMantissa | uint256 | Amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |
| to | address | Address of the tokenAddressOut receiver |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| actualAmountIn | uint256 | Actual amount transferred to destination |
| actualAmountOut | uint256 | Actual amount transferred to user |

#### 📅 Events
* Emits ConvertedForExactTokens event on success

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when to address is zero
* InvalidToAddress error is thrown when address(to) is same as tokenAddressIn or tokenAddressOut
* AmountInHigherThanMax error is thrown when amount of tokenAddressIn is higher than amountInMaxMantissa
* AmountOutMismatched error is thrown when actualAmountOut is does not match amountOutMantissa

- - -

### convertExactTokensSupportingFeeOnTransferTokens

Converts exact amount of tokenAddressIn for tokenAddressOut if there is enough tokens held by the contract

```solidity
function convertExactTokensSupportingFeeOnTransferTokens(uint256 amountInMantissa, uint256 amountOutMinMantissa, address tokenAddressIn, address tokenAddressOut, address to) external returns (uint256 actualAmountIn, uint256 actualAmountOut)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| amountOutMinMantissa | uint256 | Min amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |
| to | address | Address of the tokenAddressOut receiver |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| actualAmountIn | uint256 | Actual amount transferred to destination |
| actualAmountOut | uint256 | Actual amount transferred to user |

#### 📅 Events
* Emits ConvertedExactTokensSupportingFeeOnTransferTokens event on success

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when to address is zero
* InvalidToAddress error is thrown when address(to) is same as tokenAddressIn or tokenAddressOut
* AmountOutLowerThanMinRequired error is thrown when amount of output tokenAddressOut is less than amountOutMinMantissa

- - -

### convertForExactTokensSupportingFeeOnTransferTokens

Converts tokens for tokenAddressIn for amount of tokenAddressOut calculated on the basis of amount of
tokenAddressIn received by the contract, if there is enough tokens held by the contract, otherwise the amount is adjusted.
The user will be responsible for bearing any fees associated with token transfers, whether pulling in or pushing out tokens

```solidity
function convertForExactTokensSupportingFeeOnTransferTokens(uint256 amountInMaxMantissa, uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut, address to) external returns (uint256 actualAmountIn, uint256 actualAmountOut)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMaxMantissa | uint256 | Max amount of tokenAddressIn |
| amountOutMantissa | uint256 | Amount of tokenAddressOut required as output |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |
| to | address | Address of the tokenAddressOut receiver |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| actualAmountIn | uint256 | Actual amount transferred to destination |
| actualAmountOut | uint256 | Actual amount transferred to user |

#### 📅 Events
* Emits ConvertedForExactTokensSupportingFeeOnTransferTokens event on success

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when to address is zero
* InvalidToAddress error is thrown when address(to) is same as tokenAddressIn or tokenAddressOut
* AmountInHigherThanMax error is thrown when amount of tokenAddressIn is higher than amountInMaxMantissa

- - -

### sweepToken

To sweep ERC20 tokens and transfer them to user(to address)

```solidity
function sweepToken(address tokenAddress, address to, uint256 amount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | The address of the ERC-20 token to sweep |
| to | address | The address to which tokens will be transferred |
| amount | uint256 | The amount to transfer |

#### 📅 Events
* Emits SweepToken event on success

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when tokenAddress/to address is zero

- - -

### getAmountOut

To get the amount of tokenAddressOut tokens sender could receive on providing amountInMantissa tokens of tokenAddressIn.
This function does not account for potential token transfer fees(in case of deflationary tokens)

```solidity
function getAmountOut(uint256 amountInMantissa, address tokenAddressIn, address tokenAddressOut) external view returns (uint256 amountConvertedMantissa, uint256 amountOutMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressIn should be transferred after conversion |
| amountOutMantissa | uint256 | Amount of the tokenAddressOut sender should receive after conversion |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when conversion is disabled or config does not exist for given pair
* ConversionEnabledOnlyForPrivateConversions is thrown when conversion is only enabled for private conversion

- - -

### getAmountIn

To get the amount of tokenAddressIn tokens sender would send on receiving amountOutMantissa tokens of tokenAddressOut.
This function does not account for potential token transfer fees(in case of deflationary tokens)

```solidity
function getAmountIn(uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut) external view returns (uint256 amountConvertedMantissa, uint256 amountInMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOutMantissa | uint256 | Amount of tokenAddressOut user wants to receive |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressOut should be transferred after conversion |
| amountInMantissa | uint256 | Amount of the tokenAddressIn sender would send to contract before conversion |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when conversion is disabled or config does not exist for given pair
* ConversionEnabledOnlyForPrivateConversions is thrown when conversion is only enabled for private conversion

- - -

### getUpdatedAmountOut

To get the amount of tokenAddressOut tokens sender could receive on providing amountInMantissa tokens of tokenAddressIn

```solidity
function getUpdatedAmountOut(uint256 amountInMantissa, address tokenAddressIn, address tokenAddressOut) public returns (uint256 amountConvertedMantissa, uint256 amountOutMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountInMantissa | uint256 | Amount of tokenAddressIn |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressIn should be transferred after conversion |
| amountOutMantissa | uint256 | Amount of the tokenAddressOut sender should receive after conversion |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when conversion is disabled or config does not exist for given pair

- - -

### getUpdatedAmountIn

To get the amount of tokenAddressIn tokens sender would send on receiving amountOutMantissa tokens of tokenAddressOut

```solidity
function getUpdatedAmountIn(uint256 amountOutMantissa, address tokenAddressIn, address tokenAddressOut) public returns (uint256 amountConvertedMantissa, uint256 amountInMantissa)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOutMantissa | uint256 | Amount of tokenAddressOut user wants to receive |
| tokenAddressIn | address | Address of the token to convert |
| tokenAddressOut | address | Address of the token to get after conversion |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| amountConvertedMantissa | uint256 | Amount of tokenAddressOut should be transferred after conversion |
| amountInMantissa | uint256 | Amount of the tokenAddressIn sender would send to contract before conversion |

#### ❌ Errors
* InsufficientInputAmount error is thrown when given input amount is zero
* ConversionConfigNotEnabled is thrown when conversion is disabled or config does not exist for given pair

- - -

### updateAssetsState

This method updated the states of this contract after getting funds from PSR
after settling the amount(if any) through privateConversion between converters

```solidity
function updateAssetsState(address comptroller, address asset) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Comptroller address (pool) |
| asset | address | Asset address |

- - -

### setConversionConfig

Set the configuration for new or existing conversion pair

```solidity
function setConversionConfig(address tokenAddressIn, address tokenAddressOut, struct IAbstractTokenConverter.ConversionConfig conversionConfig) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddressIn | address | Address of tokenIn |
| tokenAddressOut | address | Address of tokenOut |
| conversionConfig | struct IAbstractTokenConverter.ConversionConfig | ConversionConfig config details to update |

#### 📅 Events
* Emits ConversionConfigUpdated event on success

#### ⛔️ Access Requirements
* Controlled by AccessControlManager

#### ❌ Errors
* Unauthorized error is thrown when the call is not authorized by AccessControlManager
* ZeroAddressNotAllowed is thrown when pool registry address is zero
* NonZeroIncentiveForPrivateConversion is thrown when incentive is non zero for private conversion

- - -

### balanceOf

Get the balance for specific token

```solidity
function balanceOf(address token) public view virtual returns (uint256 tokenBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | Address of the token |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenBalance | uint256 | Balance of the token the contract has |

- - -

