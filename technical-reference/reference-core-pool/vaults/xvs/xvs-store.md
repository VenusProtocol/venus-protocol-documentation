# XVSStore

XVSStore holds reward tokens and transfers them on behalf of its configured owner, normally an XVS Vault. It is a non-proxy contract with separate `admin` and `owner` roles.

{% hint style="warning" %}
Every network has its own store, roles, balances, and active reward-token list. Read those values from the exact address in [Deployed Funds](../../../../deployed-contracts/funds.md).
{% endhint %}

## Roles and API

| Function | Caller requirement | Effect |
| --- | --- | --- |
| `safeRewardTransfer(address,address,uint256)` | Owner | Transfers an active reward token, capped by the store's available balance |
| `setPendingAdmin(address)` | Admin | Starts an admin transfer |
| `acceptAdmin()` | Pending admin | Accepts the admin role |
| `setNewOwner(address)` | Admin | Replaces the owner that can distribute or withdraw rewards |
| `setRewardToken(address,bool)` | Admin **or owner** | Enables or disables a reward token |
| `emergencyRewardWithdraw(address,uint256)` | Owner | Withdraws a reward token from the store |

The owner can therefore both distribute active rewards and change which tokens are active. The admin can replace the owner. Permission reviews must account for both roles rather than treating the vault as the only privileged actor.

Source: [XVSStore.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/XVSVault/XVSStore.sol).
