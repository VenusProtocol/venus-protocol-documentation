# XVSProxyOFTSrc
[`XVSProxyOFTSrc` at token-bridge v2.7.0](https://github.com/VenusProtocol/token-bridge/blob/v2.7.0/contracts/Bridge/XVSProxyOFTSrc.sol) is the non-upgradeable BNB Chain source bridge. It locks native BNB-chain XVS on outbound transfers and releases that same token on inbound transfers. `outboundAmount` tracks the locked supply attributed to remote chains.

XVSProxyOFTSrc contract serves as a crucial component for cross-chain token transactions,
focusing on the source side of these transactions.
It monitors the total amount transferred to other chains, ensuring it complies with defined limits,
and provides functions for transferring tokens while maintaining control over the circulating supply on the source chain.

# Solidity API

### outboundAmount

Total amount that is transferred from this chain to other chains.

```solidity
uint256 outboundAmount
```

- - -

### fallbackWithdraw

Only call it when there is no way to recover the failed message.
`dropFailedMessage` must be called first if transaction is from remote->local chain to avoid double spending.

```solidity
function fallbackWithdraw(address to_, uint256 amount_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| to_ | address | The address to withdraw to |
| amount_ | uint256 | The amount of withdrawal |

#### 📅 Events
* Emits FallbackWithdraw, once done with transfer.

#### ⛔️ Access Requirements
* Only owner.

- - -

### fallbackDeposit

Reconciles an owner-approved amount into bridge custody, increases `outboundAmount`, and transfers the dust-adjusted XVS amount from the depositor. This is an operational recovery function, not a user bridge entry point.

```solidity
function fallbackDeposit(address depositor_, uint256 amount_) external
```

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| depositor\_ | address | Address supplying XVS to bridge custody |
| amount\_ | uint256 | Requested amount before shared-decimal dust removal |

#### Access requirements

* Only the bridge owner.

- - -

### dropFailedMessage

Clear failed messages from the storage.

```solidity
function dropFailedMessage(uint16 srcChainId_, bytes srcAddress_, uint64 nonce_) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| srcChainId_ | uint16 | Chain id of source |
| srcAddress_ | bytes | Address of source followed by current bridge address |
| nonce_ | uint64 | Nonce_ of the transaction |

#### 📅 Events
* Emits DropFailedMessage on clearance of failed message.

#### ⛔️ Access Requirements
* Only owner.

- - -

### circulatingSupply

Returns the total circulating supply of the token on the source chain i.e (total supply - locked in this contract).

```solidity
function circulatingSupply() public view returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Returns difference in total supply and the outbound amount. |

- - -
