# XVSBridgeAdmin

[`XVSBridgeAdmin` at token-bridge v2.7.0](https://github.com/VenusProtocol/token-bridge/blob/v2.7.0/contracts/Bridge/XVSBridgeAdmin.sol) is the transparent proxy that owns and administers the local source or destination bridge. Its implementation constructor fixes an immutable `XVSBridge`, so each network has a different implementation address even though all eight implementations match the same tagged source.

| Network | Read block | Proxy | Implementation |
| --- | ---: | --- | --- |
| BNB Chain | `118369693` | `0x70d644877b7b73800E9073BCFCE981eAaB6Dbc21` | `0xb085926fa310b4af85B499162B96e30E5c0E6fAC` |
| Ethereum | `25846037` | `0x9C6C95632A8FB3A74f2fB4B7FfC50B003c992b96` | `0x83aBB808bb291FED8593e953c6489d29aFa0c5Ca` |
| Arbitrum | `498892235` | `0xf5d81C6F7DAA3F97A6265C8441f92eFda22Ad784` | `0xC57f35500f4F5B2B31c5250bF8BCcf8058835a9B` |
| opBNB | `178841988` | `0x52fcE05aDbf6103d71ed2BA8Be7A317282731831` | `0x0f0be7BAf4B9E394F91e5B8a17Fc9579f5d3c072` |
| Optimism | `156114325` | `0x3c307DF1Bf3198a2417d9CA86806B307D147Ddf7` | `0xc8A17E5394aeB0A0E227E0f27F922dc60300e80B` |
| Base | `50519042` | `0x6303FEcee7161bF959d65df4Afb9e1ba5701f78e` | `0x358691eB7CC06ac512d9068a71Ea3bc2893F50Ed` |
| Unichain | `57079073` | `0x2EAaa880f97C9B63d37b39b0b316022d93d43604` | `0xc6d8bBC659d0B3Beaca513a20218b1727Ef3DCE4` |
| zkSync Era | `71738687` | `0x2471043F05Cc41A6051dd6714DC967C7BfC8F902` | `0x21f8b24f48a3af53B9B597DbA1D7737e4D7aBa3B` |

The implementation inherits two-step ownership and AccessControlManager selectors. The transparent proxy adds proxy-admin upgrade selectors; those do not imply that a normal caller can upgrade it.

The XVSBridgeAdmin contract extends a parent contract AccessControlledV8 for access control, and it manages an external contract called XVSProxyOFT.
It maintains a registry of function signatures and names,
allowing for dynamic function handling i.e checking of access control of interaction with only owner functions.

# Solidity API

### XVSBridge

Returns the immutable bridge controlled by this implementation.

```solidity
function XVSBridge() external view returns (contract IXVSProxyOFT)
```

---

### initialize

Initializes proxy ownership and the AccessControlManager. The implementation disables initializers in its constructor.

```solidity
function initialize(address accessControlManager_) external
```

---

### functionRegistry

A mapping keeps track of function signature associated with function name string.

```solidity
mapping(bytes4 => string) functionRegistry
```

---

### fallback

Invoked when called function does not exist in the contract.

```solidity
fallback(bytes data) external returns (bytes)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bytes | Response of low level call. |

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

---

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

---

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

---

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

---

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
| \[0] | bool | Bool indicating whether the remote chain is trusted or not. |

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when remoteAddress_ contract address is zero.

---

### renounceOwnership

Empty implementation of renounce ownership to avoid any mishappening.

```solidity
function renounceOwnership() public
```

---
