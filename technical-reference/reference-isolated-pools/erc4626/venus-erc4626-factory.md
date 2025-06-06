# VenusERC4626Factory

### Overview

`VenusERC4626Factory` is a factory contract for deploying upgradeable VenusERC4626 vaults as BeaconProxy instances. It manages the deployment, registry, and configuration of vaults, and controls access to sensitive operations via the AccessControlManager (ACM).

# Solidity API

### State Variables

- **`SALT`** (`bytes32`, public constant):  
   A constant salt value used for deterministic contract deployment.

- **`beacon`** (`UpgradeableBeacon`, public):  
   The beacon contract for VenusERC4626 proxies.

- **`poolRegistry`** (`PoolRegistryInterface`, public):  
   The Pool Registry contract.

- **`rewardRecipient`** (`address`, public):  
   The address that receives the liquidity mining rewards.

- **`createdVaults`** (`mapping(address vToken => ERC4626Upgradeable vault)`, public):  
   Mapping of vaults created by this factory.

---

### Events

- **`CreateERC4626(VTokenInterface indexed vToken, ERC4626Upgradeable indexed vault)`**  
   Emitted when a new ERC4626 vault is created.

  - `vToken`: The vToken used by the vault.
  - `vault`: The vault that was created.

- **`RewardRecipientUpdated(address indexed oldRecipient, address indexed newRecipient)`**  
   Emitted when the reward recipient address is updated.
  - `oldRecipient`: The previous reward recipient address.
  - `newRecipient`: The new reward recipient address.

---

### Errors

- **`VenusERC4626Factory__InvalidVToken()`**  
   Thrown when the provided vToken is not registered in the PoolRegistry.

- **`VenusERC4626Factory__ERC4626AlreadyExists()`**  
   Thrown when a VenusERC4626 vault already exists for the specified vToken.

---

#### Constructor

**@custom:oz-upgrades-unsafe-allow constructor**  
Disables initializers for the upgradeable contract pattern.

---

### Functions

### initialize

Initializes the VenusERC4626Factory contract with the required configuration parameters.

```solidity
function initialize(
    address accessControlManager,
    address poolRegistryAddress,
    address rewardRecipientAddress,
    address venusERC4626Implementation,
    uint256 loopsLimitNumber
) external initializer
```

#### Parameters

| Name                       | Type    | Description                                               |
| -------------------------- | ------- | --------------------------------------------------------- |
| accessControlManager       | address | Address of the Access Control Manager (ACM) contract.     |
| poolRegistryAddress        | address | Address of the Pool Registry contract.                    |
| rewardRecipientAddress     | address | Address that receives liquidity mining rewards.           |
| venusERC4626Implementation | address | Address of the VenusERC4626 implementation contract.      |
| loopsLimitNumber           | uint256 | The maximum number of loops for the MaxLoopsLimit helper. |

#### Notes

- Can only be called once.
- Disables initializers for the upgradeable contract pattern.

---

### setRewardRecipient

Sets the reward recipient address.

```solidity
function setRewardRecipient(address newRecipient) external
```

#### Parameters

| Name         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| newRecipient | address | The address of the new reward recipient. |

#### Notes

- Controlled by the ACM.
- Reverts with `ZeroAddressNotAllowed` if the new recipient address is zero.
- Emits the `RewardRecipientUpdated` event on update.

---

### setMaxLoopsLimit

Sets the maximum loops limit for internal operations.

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters

| Name       | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| loopsLimit | uint256 | The new maximum number of loops allowed. |

#### Notes

- Controlled by the ACM.
- Emits the `MaxLoopsLimitUpdated` event on success.

---

### createERC4626

Creates a new ERC4626 vault for the specified vToken.

```solidity
function createERC4626(address vToken) external returns (ERC4626Upgradeable vault)
```

#### Parameters

| Name   | Type    | Description                                |
| ------ | ------- | ------------------------------------------ |
| vToken | address | The vToken for which the vault is created. |

#### Returns

| Name  | Type               | Description                      |
| ----- | ------------------ | -------------------------------- |
| vault | ERC4626Upgradeable | The deployed VenusERC4626 vault. |

#### Notes

- Reverts with `ZeroAddressNotAllowed` if the vToken address is zero.
- Reverts with `VenusERC4626Factory__InvalidVToken` if the vToken is not valid.
- Reverts with `VenusERC4626Factory__ERC4626AlreadyExists` if the vault already exists.
- Emits the `CreateERC4626` event on successful creation.

---

### computeVaultAddress

Computes the deterministic address of the vault for a specified vToken.

```solidity
function computeVaultAddress(address vToken) public view returns (address)
```

#### Parameters

| Name   | Type    | Description                                  |
| ------ | ------- | -------------------------------------------- |
| vToken | address | The vToken for which to compute the address. |

#### Returns

| Name    | Type    | Description                 |
| ------- | ------- | --------------------------- |
| address | address | The computed vault address. |