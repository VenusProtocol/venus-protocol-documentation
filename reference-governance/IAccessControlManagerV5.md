# IAccessControlManagerV5

Interface implemented by the `AccessControlManagerV5` contract.

# Solidity API

### giveCallPermission

Gives a function call permission to one single account

```solidity
function giveCallPermission(address contractAddress, string functionSig, address accountToPermit) external
```

#### Parameters

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be granted |
| functionSig     | string  | signature e.g. "functionName(uint,bool)"                       |
| accountToPermit | address |                                                                |

---

### revokeCallPermission

Revokes an account's permission to a particular function call

```solidity
function revokeCallPermission(address contractAddress, string functionSig, address accountToRevoke) external
```

#### Parameters

| Name            | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| contractAddress | address | address of contract for which call permissions will be revoked |
| functionSig     | string  | signature e.g. "functionName(uint,bool)"                       |
| accountToRevoke | address |                                                                |

---

### isAllowedToCall

Verifies if the given account can call a praticular contract's function

```solidity
function isAllowedToCall(address account, string functionSig) external view returns (bool)
```

#### Parameters

| Name        | Type    | Description                                                          |
| ----------- | ------- | -------------------------------------------------------------------- |
| account     | address | address (eoa or contract) for which call permissions will be checked |
| functionSig | string  | signature e.g. "functionName(uint,bool)"                             |

#### Return Values

| Name | Type | Description                                                            |
| ---- | ---- | ---------------------------------------------------------------------- |
| \[0]  | bool | false if the user account cannot call the particular contract function |

---
