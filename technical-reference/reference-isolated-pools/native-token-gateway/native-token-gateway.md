# NativeTokenGateway
NativeTokenGateway contract facilitates interactions with a vToken market for native tokens (Native or wNativeToken)

# Solidity API

### wNativeToken

Address of wrapped native token contract

```solidity
contract IWrappedNative wNativeToken
```

- - -

### vWNativeToken

Address of wrapped native token market

```solidity
contract IVToken vWNativeToken
```

- - -

### constructor

Constructor for NativeTokenGateway

```solidity
constructor(contract IVToken vWrappedNativeToken) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vWrappedNativeToken | contract IVToken | Address of wrapped native token market |

- - -

### receive

To receive Native when msg.data is empty

```solidity
receive() external payable
```

- - -

### fallback

To receive Native when msg.data is not empty

```solidity
fallback() external payable
```

- - -

### wrapAndSupply

Wrap Native, get wNativeToken, mint vWNativeToken, and supply to the market.

```solidity
function wrapAndSupply(address minter) external payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| minter | address | The address on behalf of whom the supply is performed. |

#### 📅 Events
* TokensWrappedAndSupplied is emitted when assets are supplied to the market

#### ❌ Errors
* ZeroAddressNotAllowed is thrown if address of minter is zero address
* ZeroValueNotAllowed is thrown if mintAmount is zero

- - -

### redeemUnderlyingAndUnwrap

Redeem vWNativeToken, unwrap to Native Token, and send to the user

```solidity
function redeemUnderlyingAndUnwrap(uint256 redeemAmount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| redeemAmount | uint256 | The amount of underlying tokens to redeem |

#### 📅 Events
* TokensRedeemedAndUnwrapped is emitted when assets are redeemed from a market and unwrapped

#### ❌ Errors
* ZeroValueNotAllowed is thrown if redeemAmount is zero

- - -

### redeemAndUnwrap

Redeem vWNativeToken, unwrap to Native Token, and send to the user

```solidity
function redeemAndUnwrap(uint256 redeemTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| redeemTokens | uint256 | The amount of vWNative tokens to redeem |

#### 📅 Events
* TokensRedeemedAndUnwrapped is emitted when assets are redeemed from a market and unwrapped

#### ❌ Errors
* ZeroValueNotAllowed is thrown if redeemTokens is zero

- - -

### wrapAndRepay

Wrap Native, repay borrow in the market, and send remaining Native to the user

```solidity
function wrapAndRepay() external payable
```

#### 📅 Events
* TokensWrappedAndRepaid is emitted when assets are repaid to a market and unwrapped

#### ❌ Errors
* ZeroValueNotAllowed is thrown if repayAmount is zero

- - -

### sweepNative

Sweeps native assets (Native) from the contract and sends them to the owner

```solidity
function sweepNative() external
```

#### 📅 Events
* SweepNative is emitted when assets are swept from the contract

#### ⛔️ Access Requirements
* Controlled by Governance

- - -

### sweepToken

Sweeps the input token address tokens from the contract and sends them to the owner

```solidity
function sweepToken(contract IERC20 token) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| token | contract IERC20 | Address of the token |

#### 📅 Events
* SweepToken emits on success

#### ⛔️ Access Requirements
* Controlled by Governance

- - -

