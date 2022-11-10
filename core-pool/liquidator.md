# Liquidator

Liquidator contract is the only publicly accessible interface for liquidations in the core pool.

Liquidator contract was introduced in [VIP-64](https://app.venus.io/governance/proposal/64) so that the protocol could capture a part of the liquidation revenue. It has a unified interface for VAI, BNB and BEP-20 token liquidations.

## liquidateBorrow

```
function liquidateBorrow(
    address vToken,
    address borrower,
    uint256 repayAmount,
    VToken vTokenCollateral
) external payable;
```

Liquidates a borrow and splits the seized amount between treasury and liquidator. The liquidators should use this interface instead of calling `vToken.liquidateBorrow(...)` directly. Reverts on errors.

Note: For BNB borrows `msg.value` must be equal to repayAmount; for all other borrows msg.value must be zero.

To use this function, the liquidator has to `approve` the underlying asset to Liquidator (unless the underlying asset is BNB).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vToken` | address | Borrowed vToken (or VAIUnitroller for VAI) |
| `borrower` | address | The address of the borrower |
| `repayAmount` | uint256 | The amount to repay on behalf of the borrower |
| `vTokenCollateral` | address | The collateral vToken to seize |

## setTreasuryPercent

```
function setTreasuryPercent(
    uint256 newTreasuryPercentMantissa
) external onlyAdmin;
```

Sets the new percent of the seized amount that goes to treasury. Should be less than or equal to `comptroller.liquidationIncentiveMantissa() - 1e18`.

Only callable by the admin (Governance).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newTreasuryPercentMantissa` | uint256 | New treasury percent (scaled by 10^18). |

## _setPendingAdmin, _acceptAdmin

The admin is updated via the regular [two-step procedure](./admins.md). `_setPendingAdmin` and `_acceptAdmin` do not return any value and revert on errors.
