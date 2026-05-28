# LiquidationAdapter

**Inherits:** Initializable, AccessControlledV8, ReentrancyGuardUpgradeable

**Title:** LiquidationAdapter

Manages whitelisted liquidators/settlers, routes liquidation calls to Institutional Vault vaults,
receives seized collateral, and splits incentive between protocol and caller.

Deployed as a transparent proxy (upgradeable). Holds ACM for whitelist and config management.

## Solidity API

## State Variables

### MANTISSA_ONE

```solidity
uint256 public constant MANTISSA_ONE = 1e18
```

### vaultController

InstitutionalVaultController address (vaults are validated via controller).

```solidity
address public vaultController
```

### isWhitelistedLiquidator

HF-based liquidators — can call liquidate() when LT shortfall > 0.

```solidity
mapping(address => bool) public isWhitelistedLiquidator
```

### isWhitelistedSettler

Deadline-based settlers — can call liquidateOverdueVault() in SettlementDeadlineExceeded.

```solidity
mapping(address => bool) public isWhitelistedSettler
```

### protocolLiquidationShare

Fraction of incentive portion to protocol (mantissa).

```solidity
uint256 public protocolLiquidationShare
```

### closeFactor

Max fraction of debt repayable per liquidation (mantissa). Global for all vaults.

```solidity
uint256 public closeFactor
```

### protocolShareAccrued

Accrued protocol share per collateral token. Swept to PSR via governance.

```solidity
mapping(address => uint256) public protocolShareAccrued
```

## Functions

### constructor

**Note:** oz-upgrades-unsafe-allow: constructor

```solidity
constructor();
```

### initialize

Initializes the adapter proxy.

```solidity
function initialize(
    address vaultController_,
    uint256 protocolLiquidationShare_,
    uint256 closeFactor_,
    address acm_
) external initializer;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vaultController_` | `address` | VaultController address. |
| `protocolLiquidationShare_` | `uint256` | Initial protocol share of incentive (mantissa). |
| `closeFactor_` | `uint256` | Initial close factor (mantissa). |
| `acm_` | `address` | Venus AccessControlManager address. |

### setLiquidatorWhitelist

Add or remove a liquidator from the whitelist.

**Note:** event: LiquidatorWhitelistUpdated

```solidity
function setLiquidatorWhitelist(address liquidator, bool approved) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `liquidator` | `address` | Address to update. |
| `approved` | `bool` | Whether to approve or remove. |

### setSettlerWhitelist

Add or remove a settler from the whitelist.

**Note:** event: SettlerWhitelistUpdated

```solidity
function setSettlerWhitelist(address settler, bool approved) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `settler` | `address` | Address to update. |
| `approved` | `bool` | Whether to approve or remove. |

### setProtocolLiquidationShare

Set the protocol share of the liquidation incentive (mantissa).

**Notes:**
- error: InvalidShare if share > 1e18.
- event: ProtocolLiquidationShareUpdated

```solidity
function setProtocolLiquidationShare(uint256 share) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `share` | `uint256` | New share (0 <= share <= 1e18). |

### setCloseFactor

Set max fraction of debt repayable per liquidation.

**Notes:**
- error: InvalidCloseFactor if zero or > 1e18.
- event: CloseFactorUpdated

```solidity
function setCloseFactor(uint256 newCF) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newCF` | `uint256` | New close factor (0 < newCF <= 1e18). |

### sweepProtocolShareToReserve

Transfer accrued protocol share for the given collateral token to PSR.

**Note:** event: ProtocolShareSweptToReserve

```solidity
function sweepProtocolShareToReserve(address collateral) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `collateral` | `address` | Collateral token address. |

### liquidate

HF-based liquidation. Whitelisted liquidator only.

```solidity
function liquidate(
    address vault,
    uint256 repayAmount
) external onlyWhitelistedLiquidator nonReentrant;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address to liquidate. |
| `repayAmount` | `uint256` | Amount of supply asset to repay. |

### liquidateOverdueVault

Deadline-based liquidation. Whitelisted settler only.

```solidity
function liquidateOverdueVault(
    address vault,
    uint256 repayAmount
) external onlyWhitelistedSettler nonReentrant;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address to liquidate. |
| `repayAmount` | `uint256` | Amount of supply asset to repay. |

### renounceOwnership

Disabled — renouncing ownership would permanently brick ACM-gated liquidation governance.

**Note:** error: OwnershipCannotBeRenounced Always reverts.

```solidity
function renounceOwnership() public pure override;
```

## Events

### LiquidatorWhitelistUpdated

```solidity
event LiquidatorWhitelistUpdated(address indexed liquidator, bool approved);
```

### SettlerWhitelistUpdated

```solidity
event SettlerWhitelistUpdated(address indexed settler, bool approved);
```

### ProtocolLiquidationShareUpdated

```solidity
event ProtocolLiquidationShareUpdated(uint256 oldShare, uint256 newShare);
```

### CloseFactorUpdated

```solidity
event CloseFactorUpdated(uint256 oldCloseFactor, uint256 newCloseFactor);
```

### LiquidationCollateralSplit

```solidity
event LiquidationCollateralSplit(uint256 totalSeized, uint256 protocolAmount, uint256 callerAmount);
```

### ProtocolShareSweptToReserve

```solidity
event ProtocolShareSweptToReserve(address indexed collateral, uint256 amount);
```

## Errors

### NotWhitelistedLiquidator

```solidity
error NotWhitelistedLiquidator();
```

### NotWhitelistedSettler

```solidity
error NotWhitelistedSettler();
```

### VaultNotRegistered

```solidity
error VaultNotRegistered();
```

### InvalidShare

```solidity
error InvalidShare();
```

### InvalidCloseFactor

```solidity
error InvalidCloseFactor();
```

### InvalidAddress

```solidity
error InvalidAddress();
```

### ZeroRepayAmount

```solidity
error ZeroRepayAmount();
```

### OwnershipCannotBeRenounced

```solidity
error OwnershipCannotBeRenounced();
```
