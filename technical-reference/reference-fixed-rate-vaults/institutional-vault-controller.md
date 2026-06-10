# InstitutionalVaultController

**Inherits:** Initializable, AccessControlledV8

**Title:** InstitutionalVaultController

Central orchestrator for the Institutional Vault system. Deploys vault clones, maintains the registry,
holds the Venus ACM reference, and proxies governance operations to vaults.

Deployed as a transparent proxy (upgradeable via ProxyAdmin).

## Solidity API

## State Variables

### MANTISSA_ONE

```solidity
uint256 public constant MANTISSA_ONE = 1e18
```

### MANTISSA_ONE_AND_HALF

Maximum allowed multiplier for rate parameters (LI, LP). Caps bonus/penalty at 50% above mantissa.

```solidity
uint256 public constant MANTISSA_ONE_AND_HALF = 1.5e18
```

### MAX_APY_BPS

Maximum allowed fixed APY in basis points (100% = 10 000 bps).
Interest is calculated as: totalRaised * fixedAPY * lockDuration / (BPS * YEAR).

```solidity
uint256 public constant MAX_APY_BPS = 10_000
```

### vaultImplementation

InstitutionalLoanVault implementation address for cloning.

```solidity
address public vaultImplementation
```

### liquidationAdapter

LiquidationAdapter contract address.

```solidity
address public liquidationAdapter
```

### oracle

Venus ResilientOracle address.

```solidity
address public oracle
```

### protocolShareReserve

Venus ProtocolShareReserve (PSR) address.

```solidity
address public protocolShareReserve
```

### comptroller

Comptroller address for PSR integration.

```solidity
address public comptroller
```

### treasury

Treasury address — recipient for swept tokens.

```solidity
address public treasury
```

### positionToken

InstitutionPositionToken contract address.

```solidity
IInstitutionPositionToken public positionToken
```

### allVaults

Array of all deployed vault addresses.

```solidity
address[] public allVaults
```

### isRegistered

Whether a vault is registered.

```solidity
mapping(address => bool) public isRegistered
```

### institutionNonce

Per-institution deploy counter (for CREATE2 salt).

```solidity
mapping(address => uint256) public institutionNonce
```

## Functions

### constructor

**Note:** oz-upgrades-unsafe-allow: constructor

```solidity
constructor();
```

### initialize

Initializes the controller proxy.

```solidity
function initialize(
    address vaultImplementation_,
    address oracle_,
    address protocolShareReserve_,
    address comptroller_,
    address treasury_,
    address positionToken_,
    address acm_
) external initializer;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vaultImplementation_` | `address` | InstitutionalLoanVault implementation for cloning. |
| `oracle_` | `address` | Venus ResilientOracle address. |
| `protocolShareReserve_` | `address` | PSR address. |
| `comptroller_` | `address` | Comptroller address for PSR. |
| `treasury_` | `address` | Treasury address — recipient for swept tokens. |
| `positionToken_` | `address` | InstitutionPositionToken address. |
| `acm_` | `address` | Venus AccessControlManager address. |

### acceptPositionTokenOwnership

Accepts pending ownership of the InstitutionPositionToken.
Required because PositionToken uses Ownable2Step. Call after transferOwnership.

```solidity
function acceptPositionTokenOwnership() external;
```

### createVault

Deploys a new vault clone via deterministic CREATE2.

**Note:** event: VaultCreated

```solidity
function createVault(
    VaultConfig calldata _vaultConfig,
    InstitutionalConfig calldata _instConfig,
    RiskConfig calldata _riskConfig,
    string calldata _name,
    string calldata _symbol
) external returns (address vault);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_vaultConfig` | `VaultConfig` | Shared vault configuration (asset, rates, caps, timing). |
| `_instConfig` | `InstitutionalConfig` | Institutional-specific configuration (collateral, sizing, position identity). |
| `_riskConfig` | `RiskConfig` | Risk parameters. |
| `_name` | `string` | ERC-20 share token name for the deployed vault. |
| `_symbol` | `string` | ERC-20 share token symbol for the deployed vault. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Deployed vault address. |

### openVault

Transitions MarginDeposited -> Fundraising on a vault.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function openVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### cancelVault

Cancels a pre-launch vault and refunds any deposited collateral to the NFT position holder.
Callable only on a vault still in WaitingForMargin or MarginDeposited.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function cancelVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### partialPauseVault

Partial pause — blocks general operations; repay and liquidation remain available.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function partialPauseVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### completePauseVault

Complete pause — blocks all operations including repay and liquidation.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function completePauseVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### unpauseVault

Unpause vault — removes all pause restrictions.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function unpauseVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### closeVault

Transitions vault to Closed state. All operations are blocked after this point.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function closeVault(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### sweep

Recovers stuck tokens from a vault to treasury.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function sweep(address vault, address token) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |
| `token` | `address` | Token address to sweep. |

### approvePositionTransfer

Approves transfer of the vault's position token to a specific recipient.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function approvePositionTransfer(address vault, address recipient) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |
| `recipient` | `address` | The address that must be the destination of the next transfer. |

### revokePositionTransfer

Revokes a previously granted approval.

**Note:** error: VaultNotRegistered If vault is not in the registry.

```solidity
function revokePositionTransfer(address vault) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |

### setLiquidationThreshold

Updates liquidation threshold on a vault.

**Notes:**
- error: VaultNotRegistered If vault is not in the registry.
- error: InvalidLiquidationThreshold If newLT == 0 or newLT > MANTISSA_ONE.
- event: LiquidationThresholdUpdated

```solidity
function setLiquidationThreshold(address vault, uint256 newLT) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |
| `newLT` | `uint256` | New liquidation threshold (mantissa). |

### setLiquidationIncentive

Updates liquidation incentive on a vault.

**Notes:**
- error: VaultNotRegistered If vault is not in the registry.
- error: InvalidLiquidationIncentive If newLI <= MANTISSA_ONE or newLI > MANTISSA_ONE_AND_HALF.
- event: LiquidationIncentiveUpdated

```solidity
function setLiquidationIncentive(address vault, uint256 newLI) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |
| `newLI` | `uint256` | New liquidation incentive (mantissa). Must be in range (MANTISSA_ONE, MANTISSA_ONE_AND_HALF]. |

### setLatePenaltyRate

Updates late penalty rate on a vault.

**Notes:**
- error: VaultNotRegistered If vault is not in the registry.
- error: InvalidLatePenaltyRate If newRate <= MANTISSA_ONE or newRate > MANTISSA_ONE_AND_HALF.
- event: LatePenaltyRateUpdated

```solidity
function setLatePenaltyRate(address vault, uint256 newRate) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `vault` | `address` | Vault address. |
| `newRate` | `uint256` | New late penalty rate (mantissa). Must be in range (MANTISSA_ONE, MANTISSA_ONE_AND_HALF]. |

### setVaultImplementation

Update clone source. Only affects future vaults.

**Notes:**
- error: InvalidAddress if zero address.
- event: VaultImplementationUpdated

```solidity
function setVaultImplementation(address impl) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `impl` | `address` | New implementation address. |

### setLiquidationAdapter

Update LiquidationAdapter address.

**Notes:**
- error: InvalidAddress if zero address.
- event: LiquidationAdapterUpdated

```solidity
function setLiquidationAdapter(address adapter) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `adapter` | `address` | New adapter address. |

### setOracle

Update ResilientOracle reference.

**Notes:**
- error: InvalidAddress if zero address.
- event: OracleUpdated

```solidity
function setOracle(address oracle_) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `oracle_` | `address` | New oracle address. |

### setProtocolShareReserve

Update ProtocolShareReserve address.

**Notes:**
- error: InvalidAddress if zero address.
- event: ProtocolShareReserveUpdated

```solidity
function setProtocolShareReserve(address psr) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `psr` | `address` | New PSR address. |

### setComptroller

Update comptroller address for PSR.

**Notes:**
- error: InvalidAddress if zero address.
- event: ComptrollerUpdated

```solidity
function setComptroller(address comptroller_) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `comptroller_` | `address` | New comptroller address. |

### setTreasury

Update treasury address for swept tokens.

**Notes:**
- error: InvalidAddress if zero address.
- event: TreasuryUpdated

```solidity
function setTreasury(address treasury_) external;
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `treasury_` | `address` | New treasury address. |

### predictVaultAddress

Predicts the next vault address for a given institution.

```solidity
function predictVaultAddress(address institution) external view returns (address);
```

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `institution` | `address` | Institution operator address. |

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `address` | Predicted vault address. |

### getAggregatedVaultStates

Returns state summary for all registered vaults.

```solidity
function getAggregatedVaultStates() external view returns (VaultStateInfo[] memory);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `VaultStateInfo[]` | Array of VaultStateInfo structs. |

### allVaultsLength

Returns total number of deployed vaults.

```solidity
function allVaultsLength() external view returns (uint256);
```

**Returns**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `<none>` | `uint256` | Number of vaults in registry. |

### renounceOwnership

Disabled — renouncing ownership would permanently brick ACM-gated vault governance.

**Note:** error: OwnershipCannotBeRenounced Always reverts.

```solidity
function renounceOwnership() public pure override;
```

## Events

### VaultCreated

```solidity
event VaultCreated(address indexed vault, address indexed institution);
```

### VaultImplementationUpdated

```solidity
event VaultImplementationUpdated(address indexed oldImpl, address indexed newImpl);
```

### LiquidationAdapterUpdated

```solidity
event LiquidationAdapterUpdated(address indexed oldAdapter, address indexed newAdapter);
```

### OracleUpdated

```solidity
event OracleUpdated(address indexed oldOracle, address indexed newOracle);
```

### ProtocolShareReserveUpdated

```solidity
event ProtocolShareReserveUpdated(address indexed oldPSR, address indexed newPSR);
```

### ComptrollerUpdated

```solidity
event ComptrollerUpdated(address indexed oldComptroller, address indexed newComptroller);
```

### TreasuryUpdated

```solidity
event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
```

### LiquidationThresholdUpdated

```solidity
event LiquidationThresholdUpdated(address indexed vault, uint256 newLT);
```

### LiquidationIncentiveUpdated

```solidity
event LiquidationIncentiveUpdated(address indexed vault, uint256 newLI);
```

### LatePenaltyRateUpdated

```solidity
event LatePenaltyRateUpdated(address indexed vault, uint256 newRate);
```

## Errors

### VaultNotRegistered

```solidity
error VaultNotRegistered();
```

### InvalidConfig

```solidity
error InvalidConfig();
```

### InvalidLiquidationThreshold

```solidity
error InvalidLiquidationThreshold();
```

### InvalidLiquidationIncentive

```solidity
error InvalidLiquidationIncentive();
```

### InvalidLatePenaltyRate

```solidity
error InvalidLatePenaltyRate();
```

### InvalidAddress

```solidity
error InvalidAddress();
```

### OwnershipCannotBeRenounced

```solidity
error OwnershipCannotBeRenounced();
```
