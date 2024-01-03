# XVSBridgeAdmin
The XVSBridgeAdmin contract extends a parent contract AccessControlledV8 for access control, and it manages an external contract called XVSProxyOFT.
It maintains a registry of function signatures and names,
allowing for dynamic function handling i.e checking of access control of interaction with only owner functions.

# Solidity API

### functionRegistry

A mapping keeps track of function signature associated with function name string.

```solidity
mapping(bytes4 => string) functionRegistry
```

- - -

### fallback

Invoked when called function does not exist in the contract.

```solidity
fallback(bytes data) external returns (bytes)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes | Response of low level call. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### setTrustedRemoteAddress

Sets trusted remote on particular chain.

```solidity
function setTrustedRemoteAddress(uint16 remoteChainId_, bytes remoteAddress_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| remoteChainId_ | uint16 | Chain Id of the destination chain. |
| remoteAddress_ | bytes | Address of the destination bridge. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when remoteAddress_ contract address is zero.

- - -

### upsertSignature

A setter for the registry of functions that are allowed to be executed from proposals.

```solidity
function upsertSignature(string[] signatures_, bool[] active_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| signatures_ | string[] | Function signature to be added or removed. |
| active_ | bool[] | bool value, should be true to add function. |

#### 📅 Events
* Emits FunctionRegistryChanged if bool value of function changes.

#### ⛔️ Access Requirements
* Only owner.

- - -

### transferBridgeOwnership

This function transfers the ownership of the bridge from this contract to new owner.

```solidity
function transferBridgeOwnership(address newOwner_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newOwner_ | address | New owner of the XVS Bridge. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### isTrustedRemote

Returns true if remote address is trustedRemote corresponds to chainId_.

```solidity
function isTrustedRemote(uint16 remoteChainId_, bytes remoteAddress_) external returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| remoteChainId_ | uint16 | Chain Id of the destination chain. |
| remoteAddress_ | bytes | Address of the destination bridge. |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Bool indicating whether the remote chain is trusted or not. |

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when remoteAddress_ contract address is zero.

- - -

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishappening.

```solidity
function renounceOwnership() public
```

- - -

