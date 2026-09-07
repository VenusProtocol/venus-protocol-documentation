# XVSVaultTreasury

`XVSVaultTreasury` receives XVS allocated by the protocol-reserve conversion flow and funds the XVSStore used by an XVS Vault.

## BNB deployment

At BNB Chain block `118,364,540`:

| Field | Value |
| --- | --- |
| Proxy | `0x269ff7818DB317f60E386D2be0B259e1a324a40a` |
| Implementation | `0xA95a4f34337d8fAC283c3e3D2A605b95dA916cD6` |
| Owner | `0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396` |
| Access Control Manager | `0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555` |
| XVS Vault | `0x051100480289e704d20e9DB4804837068f3f9204` |
| XVS | `0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63` |

Other network deployments can use different proxies, implementations, owners, and vaults.

## API and permissions

```solidity
constructor(address xvsAddress_)
function initialize(address accessControlManager_, address xvsVault_) public
function setXVSVault(address xvsVault_) external
function fundXVSVault(uint256 amountMantissa) external
function sweepToken(address tokenAddress, address to, uint256 amount) external
```

* `setXVSVault` is `onlyOwner`.
* `fundXVSVault` checks `fundXVSVault(uint256)` through the Access Control Manager and sends XVS directly to the vault's current XVSStore.
* `sweepToken` is `onlyOwner`; it is **not** gated by the Access Control Manager.

Because this contract holds funds and can change its destination vault, resolve the live proxy implementation, owner, ACM permissions, and `xvsVault()` value before an operator transaction.

Source: [XVSVaultTreasury.sol](https://github.com/VenusProtocol/protocol-reserve/blob/main/contracts/ProtocolReserve/XVSVaultTreasury.sol).
