# BaseVault

**Inherits:** ERC4626Upgradeable, ReentrancyGuardUpgradeable

**Title:** BaseVault

Abstract base ERC-4626 vault providing shared mechanics for all Venus fixed-term vault types:
fundraising (time-bounded deposit window), interest computation, settlement (protocol fee waterfall),
and core state machine transitions.

Subcontracts ([InstitutionalLoanVault](institutional-loan-vault.md)) inherit this and add type-specific logic.
Deployed as EIP-1167 minimal proxy clones by the respective VaultController.

## Solidity API

## State Variables

### BPS

```solidity
uint256 public constant BPS = 10_000
```

### MANTISSA_ONE

```solidity
uint256 public constant MANTISSA_ONE = 1e18
```

### YEAR

```solidity
uint256 public constant YEAR = 365 days
```

### _config

Immutable vault configuration set at initialization.

```solidity
VaultConfig internal _config
```

### _runtime

Runtime state that changes during the vault lifecycle.

```solidity
VaultRuntime internal _runtime
```

### vaultController

VaultController address — set to msg.sender during initialize.

```solidity
address public vaultController
```

### pauseLevel

Current pause level (Unpaused, Partial, Complete).

```solidity
PauseLevel public pauseLevel
```

## Functions

### onlyController

Reverts if caller is not the VaultController.

```solidity
modifier onlyController();
```

### whenNotPaused

Reverts on any pause level (Partial or Complete). Used for general operations.

```solidity
modifier whenNotPaused();
```

### whenNotCompletelyPaused

Reverts only on Complete pause. Repay and liquidation remain available during Partial pause.

```solidity
modifier whenNotCompletelyPaused();
```

### closeVault

Transitions vault to Closed state. All operations are blocked after this point.
Governance should only call this once all suppliers have withdrawn their funds.

**Notes:**
- error: InvalidState If vault is not in a terminal state (Matured/Failed/Liquidated).
- event: StateTransition Emitted for the terminal state -> Closed transition.
- event: VaultClosed Emitted with the previous terminal state.

```solidity
function closeVault() external onlyController;
```

### partialPause

Partial pause — blocks general operations (deposits, collateral, borrowing).
Repay and liquidation remain available so positions can still be defended/resolved.

**Note:** event: PauseLevelSet

```solidity
function partialPause() external onlyController;
```

### completePause

Complete pause — blocks all operations including repay and liquidation.

**Note:** event: PauseLevelSet

```solidity
function completePause() external onlyController;
```

### unpause

Removes all pause restrictions.

**Note:** event: PauseLevelSet

```solidity
function unpause() external onlyController;
```

### sweep

Recovers any tokens stuck in the vault. Full balance is transferred.

**Notes:**
- error: NothingToSweep If the token balance is zero.
- event: TokensSwept

```solidity
function sweep(address token) external onlyController;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `token` | `address` | Token address to sweep. |

### updateVaultState

Permissionless vault finalizer. Triggers state transitions and settlement.

```solidity
function updateVaultState() external;
```

### outstandingDebt

Total remaining debt. Decremented by repayments; zero when fully repaid.

```solidity
function outstandingDebt() external view returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Outstanding debt in supply asset units. |

### config

Returns the vault configuration.

```solidity
function config() external view returns (VaultConfig memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `VaultConfig` | Immutable VaultConfig struct set at initialization. |

### runtime

Returns the runtime state.

```solidity
function runtime() external view returns (VaultRuntime memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `VaultRuntime` | Mutable VaultRuntime struct tracking lifecycle progress. |

### state

Current vault lifecycle state.

```solidity
function state() external view returns (VaultState);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `VaultState` | Current VaultState enum value. |

### deposit

Deposits supply assets during the Fundraising window.
Clamps to remaining capacity instead of reverting on excess.

**Notes:**
- error: InvalidState If vault is not in Fundraising state.
- error: ExceedsMaxCap If clamped deposit amount is zero (vault at capacity).

```solidity
function deposit(uint256 assets, address receiver) public override returns (uint256 shares);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `assets` | `uint256` | Requested deposit amount in supply asset units. |
| `receiver` | `address` | Address to receive minted shares. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `shares` | `uint256` | Actual shares minted (may be less than requested if cap approached). |

### mint

Mints shares during the Fundraising window.
Clamps to remaining capacity instead of reverting on excess.

**Notes:**
- error: InvalidState If vault is not in Fundraising state.
- error: ExceedsMaxCap If clamped share amount is zero (vault at capacity).

```solidity
function mint(uint256 shares, address receiver) public override returns (uint256 assets);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `shares` | `uint256` | Requested shares to mint. |
| `receiver` | `address` | Address to receive minted shares. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `assets` | `uint256` | Actual supply assets pulled (may be less than requested if cap approached). |

### withdraw

Withdraws supply assets in terminal states.
Advances state before checking max, enabling single-tx withdrawals
when the vault is ready to transition (e.g. PendingSettlement -> Matured).

**Notes:**
- error: InvalidState If vault is not in a terminal state (Matured/Failed/Liquidated).
- error: ExceedsMaxCap If requested assets exceed the caller's withdrawable balance.

```solidity
function withdraw(
    uint256 assets,
    address receiver,
    address owner
) public override returns (uint256 shares);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `assets` | `uint256` | Amount of supply assets to withdraw. |
| `receiver` | `address` | Address to receive the assets. |
| `owner` | `address` | Share holder address. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `shares` | `uint256` | Shares burned. |

### redeem

Redeems shares for supply assets in terminal states.
Advances state before checking max, enabling single-tx redemptions
when the vault is ready to transition (e.g. PendingSettlement -> Matured).

**Notes:**
- error: InvalidState If vault is not in a terminal state (Matured/Failed/Liquidated).
- error: ExceedsMaxCap If requested shares exceed the caller's redeemable balance.

```solidity
function redeem(
    uint256 shares,
    address receiver,
    address owner
) public override returns (uint256 assets);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `shares` | `uint256` | Shares to redeem. |
| `receiver` | `address` | Address to receive the assets. |
| `owner` | `address` | Share holder address. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `assets` | `uint256` | Supply assets returned. |

### totalAssets

State-dependent total assets backing outstanding shares.

Matured/Failed/Liquidated: settlementAmount (decremented on each withdrawal). All other states: totalRaised.

```solidity
function totalAssets() public view override returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Total assets in supply asset units. |

### maxDeposit

Remaining deposit capacity in supply asset units. Zero outside Fundraising state.

```solidity
function maxDeposit(address /* receiver */) public view override returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Maximum depositable amount. |

### maxMint

Share equivalent of maxDeposit.

```solidity
function maxMint(address receiver) public view override returns (uint256);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `receiver` | `address` | Receiver address (passed through to maxDeposit). |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Maximum mintable shares. |

### maxWithdraw

Withdrawable supply asset amount for a supplier. Zero outside terminal states.

```solidity
function maxWithdraw(address owner) public view override returns (uint256);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `owner` | `address` | Share holder address. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Maximum withdrawable supply asset amount. |

### maxRedeem

Redeemable share amount for a supplier. Zero outside terminal states.

```solidity
function maxRedeem(address owner) public view override returns (uint256);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `owner` | `address` | Share holder address. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Maximum redeemable share amount. |

## Events

### StateTransition

```solidity
event StateTransition(VaultState indexed from, VaultState indexed to, uint256 timestamp);
```

### VaultClosed

```solidity
event VaultClosed(VaultState state);
```

### SettlementConfirmed

```solidity
event SettlementConfirmed(uint256 settlementAmount, uint256 protocolFee, uint256 surplus);
```

### ShortfallDetected

```solidity
event ShortfallDetected(uint256 totalOwed, uint256 available);
```

### PSRNotificationFailed

```solidity
event PSRNotificationFailed(address indexed psr, bytes reason);
```

### RaisedFundsClaimed

```solidity
event RaisedFundsClaimed(uint256 amount);
```

### Repaid

```solidity
event Repaid(uint256 amount, uint256 remainingDebt);
```

### PauseLevelSet

```solidity
event PauseLevelSet(PauseLevel oldLevel, PauseLevel newLevel);
```

### TokensSwept

```solidity
event TokensSwept(address indexed token, address indexed recipient, uint256 amount);
```

## Errors

### InvalidState

```solidity
error InvalidState();
```

### SameStateTransition

```solidity
error SameStateTransition();
```

### BelowMinimumDepositAmount

```solidity
error BelowMinimumDepositAmount();
```

### ExceedsMaxCap

```solidity
error ExceedsMaxCap();
```

### Unauthorized

```solidity
error Unauthorized();
```

### AlreadyWithdrawn

```solidity
error AlreadyWithdrawn();
```

### NoOutstandingDebt

```solidity
error NoOutstandingDebt();
```

### ZeroRepayAmount

```solidity
error ZeroRepayAmount();
```

### NothingToSweep

```solidity
error NothingToSweep();
```

### PartiallyPaused

```solidity
error PartiallyPaused();
```

### CompletelyPaused

```solidity
error CompletelyPaused();
```
