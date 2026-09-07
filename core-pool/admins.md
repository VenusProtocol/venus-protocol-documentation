# Legacy two-step admin pattern

This hidden page documents the Compound-style `admin`/`pendingAdmin` transfer used by specific legacy contracts such as Unitroller and older vTokens. It is not a protocol-wide ownership model: other Venus contracts use `Ownable2Step`, proxy admins, AccessControlManager permissions, timelock roles, guardians, or combinations of them.

{% hint style="warning" %}
Governance is not automatically the effective caller for every privileged function. For the exact deployed address, resolve the implementation and read its live admin, pending admin, owner, proxy admin, AccessControlManager, and function permission before preparing a transfer.
{% endhint %}

Some legacy implementations return `0` on success and an error code on failure instead of reverting. Callers must check the returned value as well as transaction status.

## _setPendingAdmin

```solidity
function _setPendingAdmin(
    address newPendingAdmin
) external returns (uint256 errorCode);
```

Begins the legacy two-step transfer. The current admin proposes `newPendingAdmin`; that address must call `_acceptAdmin` to finish.

## _acceptAdmin

```solidity
function _acceptAdmin() external returns (uint256 errorCode);
```

Accepts the legacy transfer. The function is callable only by the recorded pending admin. Read both storage fields after execution instead of assuming the change completed from transaction status alone.
