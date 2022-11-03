# Access Control

Access control play a crucial role in our Governance model. We use it to restrict certain functions to be called only from one account or list of accounts (EOA or Contract Accounts).




# Access Control Manager
The implementation of our AC Management we implemented [**AccessControlManager.sol**](https://github.com/VenusProtocol/isolated-pools/blob/main/contracts/Governance/AccessControlManager.sol)  which is a contract that inherits  [**@openzeppelin/contracts/access/AccessControl.sol**](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) as a base of our role management logic.
Roles are built by hashing the contract address and its function signature.
E.g We have a Contract A with function A.try() which is guarded by ACM.
Calling giveRolePermission for account B will basically do:
1. compute keccak256({addrress-of-a},{function-sig-of-try()})
2. add the computed role to the roles of account B
3. Account B now can call try() of Contract A

**NOTE:** because of the existence of factory contracts, in some cases we don't need that granular permissions (e.g in PoolRegistry). So we introduced **DEFAULT_ADMIN_FUNCTION_ROLE**.
This role is computed the same way, but instead of computing `keccak256({addrress-of-a},{function-sig-of-try()})`, we do `keccak256({zero-address},{function-sig-of-try()})`. 
If we consider the same case above and give account B the **DEFAULT_ADMIN_FUNCTION_ROLE** , account B will have permissions to call try() function on any contract that is guarded by ACM, not only contract A.
Lets' take a look at each interface function of the contract:

# Solidity API

  

## AccessControlManager

  

This contract is a wrapper of OpenZeppelin AccessControl

extending it in a way to standardise access control

within Venus Smart Contract Ecosystem_

  

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

  

| Name | Type | Description |

| ---- | ---- | ----------- |

| caller | address | contract for which call permissions will be checked |

| functionSig | string | signature e.g. "functionName(uint,bool)" |

  

#### Return Values

  

| Name | Type | Description |

| ---- | ---- | ----------- |

| [0] | bool | false if the user account cannot call the particular contract function |

  

### giveCallPermission

  

```solidity

function giveCallPermission(address contractAddress, string functionSig, address accountToPermit) public

```

  

Gives a function call permission to one single account

  

_this function can be called only from Role Admin or DEFAULT_ADMIN_ROLE

May emit a {RoleGranted} event._

  

#### Parameters

  

| Name | Type | Description |

| ---- | ---- | ----------- |

| contractAddress | address | address of contract for which call permissions will be granted NOTE: if contractAddress is zero address, we give the account DEFAULT_ADMIN_ROLE, meaning that this account can access the certain function on ANY contract managed by this ACL |

| functionSig | string | signature e.g. "functionName(uint,bool)" |

| accountToPermit | address | account that will be given access to the contract function |

  

### revokeCallPermission

  

```solidity

function revokeCallPermission(address contractAddress, string functionSig, address accountToRevoke) public

```

  

Revokes an account's permission to a particular function call

  

_this function can be called only from Role Admin or DEFAULT_ADMIN_ROLE

May emit a {RoleRevoked} event._

  

#### Parameters

  

| Name | Type | Description |

| ---- | ---- | ----------- |

| contractAddress | address | address of contract for which call permissions will be revoked |

| functionSig | string | signature e.g. "functionName(uint,bool)" |

| accountToRevoke | address | |