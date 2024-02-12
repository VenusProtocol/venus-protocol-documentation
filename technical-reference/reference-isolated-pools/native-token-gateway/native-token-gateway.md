# NativeTokenGateway
NativeTokenGateway contract facilitates interactions with a vToken market for native tokens (Native or wrappedNativeToken)

# Solidity API

### wrappedNativeToken

Address of wrapped ether token contract

```solidity
contract IWrappedNative wrappedNativeToken
```

- - -

### constructor

Constructor for NativeTokenGateway

```solidity
constructor(contract IWrappedNative wrappedNativeToken_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| wrappedNativeToken_ | contract IWrappedNative | Address of wrapped ether token contract |

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

Wrap Native, get wrappedNativeToken, mint vWETH, and supply to the market.

```solidity
function wrapAndSupply(contract IVToken vToken, address minter) external payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract IVToken | The vToken market to interact with. |
| minter | address | The address on behalf of whom the supply is performed. |

#### 📅 Events
* TokensWrappedAndSupplied is emitted when assets are supplied to the market

#### ❌ Errors
* ZeroAddressNotAllowed is thrown if either vToken or minter address is zero address
* ZeroValueNotAllowed is thrown if mintAmount is zero

- - -

### redeemUnderlyingAndUnwrap

Redeem vWETH, unwrap to ETH, and send to the user

```solidity
function redeemUnderlyingAndUnwrap(contract IVToken vToken, uint256 redeemAmount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract IVToken | The vToken market to interact with |
| redeemAmount | uint256 | The amount of underlying tokens to redeem |

#### 📅 Events
* TokensRedeemedAndUnwrapped is emitted when assets are redeemed from a market and unwrapped

- - -

### wrapAndRepay

Wrap Native, repay borrow in the market, and send remaining Native to the user

```solidity
function wrapAndRepay(contract IVToken vToken) external payable
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract IVToken | The vToken market to interact with |

#### 📅 Events
* TokensWrappedAndRepaid is emitted when assets are repaid to a market and unwrapped

#### ❌ Errors
* ZeroAddressNotAllowed is thrown if vToken address is zero address
* ZeroValueNotAllowed is thrown if repayAmount is zero

- - -

### sweepNative

Sweeps native assets (Native) from the contract and sends them to the owner

```solidity
function sweepNative() external payable
```

#### 📅 Events
* SweepNative is emitted when assets are swept from the contract

#### ⛔️ Access Requirements
* Controlled by Governance

- - -

### sweepToken

Sweeps wrappedNativeToken tokens from the contract and sends them to the owner

```solidity
function sweepToken() external
```

#### 📅 Events
* SweepToken emits on success

#### ⛔️ Access Requirements
* Controlled by Governance

- - -

