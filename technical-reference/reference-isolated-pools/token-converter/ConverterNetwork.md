# ConverterNetwork

Keeps track of all the converters and is used to fetch valid converters which provide conversions according to token addresses provided

# Solidity API

### allConverters

Array holding all the converters

```solidity
contract IAbstractTokenConverter[] allConverters
```

- - -

### initialize

ConverterNetwork initializer

```solidity
function initialize(address _accessControlManager, uint256 _loopsLimit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _accessControlManager | address | The address of ACM contract |
| _loopsLimit | uint256 | Limit for the loops in the contract to avoid DOS |

#### 📅 Events
* ConverterAdded is emitted for each converter added on success

#### ❌ Errors
* InvalidMaxLoopsLimit is thrown when when loops limit is invalid

- - -

### setMaxLoopsLimit

Set the limit for the loops can iterate to avoid the DOS

```solidity
function setMaxLoopsLimit(uint256 limit) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| limit | uint256 | Limit for the max loops can execute at a time |

#### ⛔️ Access Requirements
* Only owner

#### ❌ Errors
* InvalidMaxLoopsLimit is thrown when when loops limit is invalid

- - -

### addTokenConverter

Adds new converter to the array

```solidity
function addTokenConverter(contract IAbstractTokenConverter _tokenConverter) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenConverter | contract IAbstractTokenConverter | Address of the token converter |

#### 📅 Events
* ConverterAdded is emitted on success

#### ⛔️ Access Requirements
* Only Governance

- - -

### removeTokenConverter

Removes converter from the array

```solidity
function removeTokenConverter(contract IAbstractTokenConverter _tokenConverter) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenConverter | contract IAbstractTokenConverter | Address of the token converter |

#### 📅 Events
* ConverterRemoved is emitted on success

#### ⛔️ Access Requirements
* Only Governance

#### ❌ Errors
* ConverterDoesNotExist is thrown when converter to remove does not exist

- - -

### findTokenConverters

Used to get the array of converters supporting conversions, arranged in descending order based on token balances
It will return the converters which are open to users for conversion

```solidity
function findTokenConverters(address _tokenAddressIn, address _tokenAddressOut) external returns (address[] converters, uint256[] convertersBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenAddressIn | address | Address of tokenIn |
| _tokenAddressOut | address | Address of tokenOut |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| converters | address[] | Array of the conveters on the basis of the tokens pair |
| convertersBalance | uint256[] | Array of balances with respect to token out |

- - -

### findTokenConvertersForConverters

Used to get the array of converters supporting conversions, arranged in descending order based on token balances
It will return the converters which are open to converters for conversion.

```solidity
function findTokenConvertersForConverters(address _tokenAddressIn, address _tokenAddressOut) external returns (address[] converters, uint256[] convertersBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenAddressIn | address | Address of tokenIn |
| _tokenAddressOut | address | Address of tokenOut |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| converters | address[] | Array of the conveters on the basis of the tokens pair |
| convertersBalance | uint256[] | Array of balances with respect to token out |

- - -

### getAllConverters

This function returns the array containing all the converters addresses

```solidity
function getAllConverters() external view returns (contract IAbstractTokenConverter[] converters)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| converters | contract IAbstractTokenConverter[] | Array containing all the converters addresses |

- - -

### isTokenConverter

This function checks if the given address is a converter or not

```solidity
function isTokenConverter(address _tokenConverter) external view returns (bool isConverter)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenConverter | address | Address of the token converter |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| isConverter | bool | true if given address is converter otherwise false |

- - -

