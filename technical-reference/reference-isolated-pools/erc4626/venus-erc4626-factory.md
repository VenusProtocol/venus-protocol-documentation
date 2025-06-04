# VenusERC4626Factory

### Overview

`VenusERC4626Factory` is a factory contract for deploying upgradeable VenusERC4626 vaults as BeaconProxy instances. It manages the deployment, registry, and configuration of vaults, and controls access to sensitive operations via AccessControlManager (ACM).

# Solidity API

### State Variables

- **`SALT`** (`bytes32`, public constant):  
   A constant salt value used for deterministic contract deployment.

- **`beacon`** (`UpgradeableBeacon`, public):  
   The beacon contract for VenusERC4626 proxies.

- **`poolRegistry`** (`PoolRegistryInterface`, public):  
   The Pool Registry contract.

- **`rewardRecipient`** (`address`, public):  
   The address that will receive the liquidity mining rewards.

- **`createdVaults`** (`mapping(address vToken => ERC4626Upgradeable vault)`, public):  
   Map of vaults created by this factory.

---

### Events

- **`CreateERC4626(VTokenInterface indexed vToken, ERC4626Upgradeable indexed vault)`**  
   Emitted when a new ERC4626 vault has been created.

  - `vToken`: The vToken used by the vault.
  - `vault`: The vault that was created.

- **`RewardRecipientUpdated(address indexed oldRecipient, address indexed newRecipient)`**  
   Emitted when the reward recipient address is updated.
  - `oldRecipient`: The previous reward recipient address.
  - `newRecipient`: The new reward recipient address.

---

### Errors

- **`VenusERC4626Factory__InvalidVToken()`**  
   Thrown when the provided vToken is not registered in PoolRegistry.

- **`VenusERC4626Factory__ERC4626AlreadyExists()`**  
   Thrown when a VenusERC4626 vault already exists for the provided vToken.

---

#### constructor

**@custom:oz-upgrades-unsafe-allow constructor**  
Disables initializers for upgradeable contract pattern.

---

### Functions

### initialize

Initializes the VenusERC4626Factory contract with required configuration parameters.

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
| rewardRecipientAddress     | address | Address that will receive liquidity mining rewards.       |
| venusERC4626Implementation | address | Address of the VenusERC4626 implementation contract.      |
| loopsLimitNumber           | uint256 | The maximum number of loops for the MaxLoopsLimit helper. |

#### Notes

- Can only be called once.
- Disables initializers for upgradeable contract pattern.

---

### setRewardRecipient

Sets a new reward recipient address.

```solidity
function setRewardRecipient(address newRecipient) external
```

#### Parameters

| Name         | Type    | Description                              |
| ------------ | ------- | ---------------------------------------- |
| newRecipient | address | The address of the new reward recipient. |

#### Notes

- Controlled by ACM.
- Throws `ZeroAddressNotAllowed` if the new recipient address is zero.
- Emits `RewardRecipientUpdated` event on update.

---

### setMaxLoopsLimit

Sets a new maximum loops limit for internal operations.

```solidity
function setMaxLoopsLimit(uint256 loopsLimit) external
```

#### Parameters

| Name       | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| loopsLimit | uint256 | The new maximum number of loops allowed. |

#### Notes

- Controlled by ACM.
- Emits `MaxLoopsLimitUpdated` event on success.

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

- Throws `ZeroAddressNotAllowed` if the vToken address is zero.
- Throws `VenusERC4626Factory__InvalidVToken` if the vToken is not valid.
- Throws `VenusERC4626Factory__ERC4626AlreadyExists` if the vault already exists.
- Emits `CreateERC4626` event on successful creation.

---

### computeVaultAddress

Computes the deterministic address of the vault for a given vToken.

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
