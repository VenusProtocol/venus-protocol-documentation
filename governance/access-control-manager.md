# Access Control

Access control plays a crucial role in the Venus governance model. It is used to restrict functions so that they can only be called from one account or list of accounts (EOA or Contract Accounts).

# Access Control Manager

The implementation of [AccessControlManager](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Governance/AccessControlManager.sol) inherits the [Open Zeppelin AccessControl](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) contract as a base for role management logic. There are two role types: admin and granular permissions.

### Granular Roles

Granular roles are built by hashing the contract address and its function signature.
For example, Given Contract Foo with function Foo.bar() which is guarded by ACM,
calling `giveRolePermission` for account B do the following:

1. Compute `keccak256(contractFooAddress,functionSignatureBar)`
2. Add the computed role to the roles of account B
3. Account B now can call `ContractFoo.bar()`

### Admin Roles

Admin roles allow for an address to call a function signature on any contract guarded by the AccessControlManager. This is particularly useful for contracts created by factories.

For Admin roles a null address is hashed in place of the contract address (`keccak256(0x0000000000000000000000000000000000000000,functionSignatureBar)`.

In the previous example, giving account B the admin role, account B will have permissions to call the bar() function on any contract that is guarded by ACM, not only contract A.

### Protocol Integration

All restricted functions in Venus Protocol use a hook to ACM in order to check if the caller has the right permission to call the guarded function. They call ACM's external method `isAllowedToCall(address caller, string functionSig)`.
Here is an example of how `_setCollateralFactor` function in `Comptroller` is integrated with ACM:

```
	bool isAllowedToCall = AccessControlManager(accessControl)
	.isAllowedToCall(
		msg.sender,
		"_setCollateralFactor(VToken,uint256,uint256)"
	);

	if (!isAllowedToCall) {
		revert Unauthorized();
	}
```

# Solidity API

## AccessControlManager

This contract is a wrapper of OpenZeppelin AccessControl extending it in a way to standardise access control within Venus Smart Contract Ecosystem.

### constructor

```solidity

constructor() public

```

### isAllowedToCall

```solidity

function isAllowedToCall(address caller, string functionSig) public view returns (bool)

```

Verifies if the given account can call a praticular contract's function

_Since the contract is calling itself this function, we can get contracts address with msg.sender_

#### Parameters

| Name        | Type    | Description                                         |
| ----------- | ------- | --------------------------------------------------- |
| caller      | address | contract for which call permissions will be checked |
| functionSig | string  | signature e.g. "functionName(uint,bool)"            |

#### Return Values

| Name | Type | Description                                                            |
| ---- | ---- | ---------------------------------------------------------------------- |
| [0]  | bool | false if the user account cannot call the particular contract function |

### giveCallPermission

```solidity

function giveCallPermission(address contractAddress, string functionSig, address accountToPermit) public

```

Gives a function call permission to one single account

\_this function can be called only from Role Admin or DEFAULT_ADMIN_ROLE

May emit a {RoleGranted} event.\_

#### Parameters

| Name            | Type    | Description                                                                                                                                                                                                                                    |
| --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be granted NOTE: if contractAddress is zero address, we give the account DEFAULT_ADMIN_ROLE, meaning that this account can access the certain function on ANY contract managed by this ACL |
| functionSig     | string  | signature e.g. "functionName(uint,bool)"                                                                                                                                                                                                       |
| accountToPermit | address | account that will be given access to the contract function                                                                                                                                                                                     |

### revokeCallPermission

```solidity

function revokeCallPermission(address contractAddress, string functionSig, address accountToRevoke) public

```

Revokes an account's permission to a particular function call

\_this function can be called only from Role Admin or DEFAULT_ADMIN_ROLE

May emit a {RoleRevoked} event.\_

#### Parameters

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be revoked |
| functionSig     | string  | signature e.g. "functionName(uint,bool)"                       |
| accountToRevoke | address |                                                                |
