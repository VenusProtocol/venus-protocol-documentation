# TokenController
[`TokenController` at token-bridge v2.7.0](https://github.com/VenusProtocol/token-bridge/blob/v2.7.0/contracts/Bridge/token/TokenController.sol) is inherited by the destination-chain XVS token; it is not deployed separately. Its mint accounting is per authorized minter. `minterToMintedAmount` increases when that minter mints and decreases when it burns.

TokenController contract acts as a governance and access control mechanism,
allowing the owner to manage minting restrictions and blacklist certain addresses to maintain control and security within the token ecosystem.
It provides a flexible framework for token-related operations.

# Solidity API

### accessControlManager

Access control manager contract address.

```solidity
address accessControlManager
```

- - -

### minterToCap

A mapping is used to keep track of the maximum amount a minter is permitted to mint.

```solidity
mapping(address => uint256) minterToCap
```

- - -

### minterToMintedAmount

A Mapping used to keep track of the amount i.e already minted by minter.

```solidity
mapping(address => uint256) minterToMintedAmount
```

- - -

### pause

Pauses Token

```solidity
function pause() external
```

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### unpause

Resumes Token

```solidity
function unpause() external
```

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### updateBlacklist

Function to update blacklist.

```solidity
function updateBlacklist(address user_, bool value_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user_ | address | User address to be affected. |
| value_ | bool | Boolean to toggle value. |

#### 📅 Events
* Emits BlacklistUpdated event.

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### setMintCap

Sets the minting cap for minter.

```solidity
function setMintCap(address minter_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| minter_ | address | Minter address. |
| amount_ | uint256 | Cap for the minter. |

#### 📅 Events
* Emits MintCapChanged.

#### ⛔️ Access Requirements
* Controlled by AccessControlManager.

- - -

### setAccessControlManager

Sets the address of the access control manager of this contract.

```solidity
function setAccessControlManager(address newAccessControlAddress_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| newAccessControlAddress_ | address | New address for the access control. |

#### 📅 Events
* Emits NewAccessControlManager.

#### ⛔️ Access Requirements
* Only owner.

#### ❌ Errors
* ZeroAddressNotAllowed is thrown when newAccessControlAddress_ contract address is zero.

- - -

### migrateMinterTokens

Moves the full recorded minted amount from one minter's accounting bucket to another. The destination minter must already have enough cap, the addresses must differ, and the operation does not move ERC-20 balances.

```solidity
function migrateMinterTokens(address source_, address destination_) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| source\_ | address | Minter whose recorded minted amount is cleared |
| destination\_ | address | Minter that receives the recorded minted amount |

#### Access requirements

* Controlled by AccessControlManager using `migrateMinterTokens(address,address)`.

- - -

### isBlackListed

Returns the blacklist status of the address.

```solidity
function isBlackListed(address user_) external view returns (bool)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| user_ | address | Address of user to check blacklist status. |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | bool status of blacklist. |

- - -
