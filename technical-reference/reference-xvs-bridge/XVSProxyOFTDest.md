# XVSProxyOFTDest
[`XVSProxyOFTDest` at token-bridge v2.7.0](https://github.com/VenusProtocol/token-bridge/blob/v2.7.0/contracts/Bridge/XVSProxyOFTDest.sol) is the non-upgradeable bridge used on destination networks. It burns the destination-chain XVS token on outbound transfers and mints it on inbound transfers. Minting is additionally bounded by the token's per-minter cap; this contract does not use the BNB source bridge's locked-supply accounting.

XVSProxyOFTDest contract builds upon the functionality of its parent contract, BaseXVSProxyOFT,
and focuses on managing token transfers to the destination chain.
It provides functions to check eligibility and perform the actual token transfers while maintaining strict access controls and pausing mechanisms.

# Solidity API

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
* Only owner

- - -

### circulatingSupply

Returns the total circulating supply of the token on the destination chain i.e (total supply).

```solidity
function circulatingSupply() public view returns (uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | total circulating supply of the token on the destination chain. |

- - -
