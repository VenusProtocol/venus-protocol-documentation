# InstitutionPositionToken

**Inherits:** ERC721, Ownable2Step

**Title:** InstitutionPositionToken

Singleton ERC-721 representing institution positions in Institutional Vaults.
One token per vault. Holder = institution operator. Governance-gated transfers.

Owner is VaultController (sole minter, transfer governance gateway).
Not upgradeable — logic is minimal and immutable.
Deployed with msg.sender as owner, then ownership transferred to VaultController.

## Solidity API

## State Variables

### nextTokenId

Auto-incrementing token ID counter (starts at 1).

```solidity
uint256 public nextTokenId
```

### tokenIdToVault

Maps token ID to its vault address.

```solidity
mapping(uint256 => address) public tokenIdToVault
```

### vaultToTokenId

Maps vault address to its token ID.

```solidity
mapping(address => uint256) public vaultToTokenId
```

### approvedRecipient

Recipient governance has approved to receive a specific token (one-shot).
Cleared back to address(0) once the matching transfer is consumed.

```solidity
mapping(uint256 => address) public approvedRecipient
```

## Functions

### constructor

```solidity
constructor() ERC721("Venus Institution Position", "vINST");
```

### renounceOwnership

Disabled — renouncing ownership would permanently brick minting and transfer governance.

**Note:** error: OwnershipCannotBeRenounced Always reverts.

```solidity
function renounceOwnership() public pure override;
```

### mint

Mints a new token to `to` for the given vault.

**Note:** event: PositionTokenMinted

```solidity
function mint(address to, address vault) external onlyOwner returns (uint256 tokenId);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `to` | `address` | The initial institution operator address. |
| `vault` | `address` | The vault address this token represents. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tokenId` | `uint256` | The minted token ID. |

### approveTransfer

Approves `recipient` to receive `tokenId` on the next transfer. One-shot — cleared after use.

**Notes:**
- error: ZeroAddress If recipient is address(0).
- event: PositionTransferApproved

```solidity
function approveTransfer(uint256 tokenId, address recipient) external onlyOwner;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tokenId` | `uint256` | The token ID to approve for transfer. |
| `recipient` | `address` | The address that must be the destination of the next transfer. |

### revokeTransferApproval

Revokes a previously granted transfer approval.

**Note:** event: PositionTransferRevoked

```solidity
function revokeTransferApproval(uint256 tokenId) external onlyOwner;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `tokenId` | `uint256` | The token ID to revoke approval for. |

## Events

### PositionTokenMinted

```solidity
event PositionTokenMinted(address indexed vault, uint256 indexed tokenId, address indexed institution);
```

### PositionTransferApproved

```solidity
event PositionTransferApproved(uint256 indexed tokenId, address indexed recipient);
```

### PositionTransferRevoked

```solidity
event PositionTransferRevoked(uint256 indexed tokenId);
```

## Errors

### TransferNotApproved

```solidity
error TransferNotApproved(uint256 tokenId);
```

### OwnershipCannotBeRenounced

```solidity
error OwnershipCannotBeRenounced();
```

### ZeroAddress

```solidity
error ZeroAddress();
```
