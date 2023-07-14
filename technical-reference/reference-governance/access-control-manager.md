# AccessControlManager

## AccessControlManager

Access control plays a crucial role in the Venus governance model. It is used to restrict functions so that they can only be called from one account or list of accounts (EOA or Contract Accounts).

The implementation of `AccessControlManager`(https://github.com/VenusProtocol/governance-contracts/blob/main/contracts/Governance/AccessControlManager.sol) inherits the [Open Zeppelin AccessControl](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) contract as a base for role management logic. There are two role types: admin and granular permissions.

### Granular Roles

Granular roles are built by hashing the contract address and its function signature. For example, given contract `Foo` with function `Foo.bar()` which is guarded by ACM, calling `giveRolePermission` for account B do the following:

1. Compute `keccak256(contractFooAddress,functionSignatureBar)`
2. Add the computed role to the roles of account B
3. Account B now can call `ContractFoo.bar()`

### Admin Roles

Admin roles allow for an address to call a function signature on any contract guarded by the `AccessControlManager`. This is particularly useful for contracts created by factories.

For Admin roles a null address is hashed in place of the contract address (`keccak256(0x0000000000000000000000000000000000000000,functionSignatureBar)`.

In the previous example, giving account B the admin role, account B will have permissions to call the `bar()` function on any contract that is guarded by ACM, not only contract A.

### Protocol Integration

All restricted functions in Venus Protocol use a hook to ACM in order to check if the caller has the right permission to call the guarded function. `AccessControlledV5` and `AccessControlledV8` abstract contract makes this integration easier. They call ACM's external method `isAllowedToCall(address caller, string functionSig)`. Here is an example of how `setCollateralFactor` function in `Comptroller` is integrated with ACM:

```solidity
    contract Comptroller is [...] AccessControlledV8 {
        [...]
        function setCollateralFactor(VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external {
            _checkAccessAllowed("setCollateralFactor(address,uint256,uint256)");
            [...]
        }
    }
```

## Solidity API

#### giveCallPermission

Gives a function call permission to one single account

```solidity
function giveCallPermission(address contractAddress, string functionSig, address accountToPermit) public
```

**Parameters**

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be granted |
| functionSig     | string  | signature e.g. "functionName(uint256,bool)"                    |
| accountToPermit | address | account that will be given access to the contract function     |

**📅 Events**

* Emits a {RoleGranted} and {PermissionGranted} events.



#### revokeCallPermission

Revokes an account's permission to a particular function call

```solidity
function revokeCallPermission(address contractAddress, string functionSig, address accountToRevoke) public
```

**Parameters**

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be revoked |
| functionSig     | string  | signature e.g. "functionName(uint256,bool)"                    |
| accountToRevoke | address |                                                                |

**📅 Events**

* Emits {RoleRevoked} and {PermissionRevoked} events.



#### isAllowedToCall

Verifies if the given account can call a contract's guarded function

```solidity
function isAllowedToCall(address account, string functionSig) public view returns (bool)
```

**Parameters**

| Name        | Type    | Description                                                     |
| ----------- | ------- | --------------------------------------------------------------- |
| account     | address | for which call permissions will be checked                      |
| functionSig | string  | restricted function signature e.g. "functionName(uint256,bool)" |

**Return Values**

| Name | Type | Description                                                            |
| ---- | ---- | ---------------------------------------------------------------------- |
| \[0] | bool | false if the user account cannot call the particular contract function |



#### hasPermission

Verifies if the given account can call a contract's guarded function

```solidity
function hasPermission(address account, address contractAddress, string functionSig) public view returns (bool)
```

**Parameters**

| Name            | Type    | Description                                                            |
| --------------- | ------- | ---------------------------------------------------------------------- |
| account         | address | for which call permissions will be checked against                     |
| contractAddress | address | address of the restricted contract                                     |
| functionSig     | string  | signature of the restricted function e.g. "functionName(uint256,bool)" |

**Return Values**

| Name | Type | Description                                                            |
| ---- | ---- | ---------------------------------------------------------------------- |
| \[0] | bool | false if the user account cannot call the particular contract function |

