# Admins and ownership

Most of our contracts have a dedicated admin. The admin of most of the contracts is Governance. The admin can be changed with a two-step procedure that guarantees there's no error during transferring the rights.

The interface is similar but for historical reasons some of the contracts do not revert in case of failure. These contracts return 0 if the transaction was successful and an error code otherwise.

## _setPendingAdmin

```
function _setPendingAdmin(
    address newPendingAdmin
) external [returns (uint256 error)];
```

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer. The function is only callable by admin.

## _acceptAdmin

```solidity
function _acceptAdmin() external [returns (uint256)];
```

Accepts transfer of admin rights. The function is only callable by pendingAdmin.
