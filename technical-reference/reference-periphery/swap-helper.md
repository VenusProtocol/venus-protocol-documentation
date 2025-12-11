# SwapHelper

The SwapHelper is a Venus periphery contract that enables secure, backend-authorized token swaps. It provides an atomic multicall interface with EIP-712 signature verification, allowing the Venus backend to authorize specific swap operations while preventing arbitrary execution.

## Overview

Token swaps in leverage operations require interaction with external DEX protocols. The SwapHelper provides a controlled execution environment where:

1. **Backend Authorization**: All swap operations must be signed by the authorized backend signer
2. **Atomic Execution**: Multiple operations execute atomically via multicall
3. **Replay Protection**: Each signed payload is single-use via salt tracking
4. **Time-Bounded**: Signatures include a deadline to prevent stale quote execution

The contract is designed to be called by the LeverageStrategiesManager during flash loan callbacks, though it can also be used independently for authorized token operations.

## Architecture

```
┌─────────────────────────┐
│   Venus Swap API        │
│   (Backend Service)     │
└───────────┬─────────────┘
            │ Signs multicall payload
            ▼
┌─────────────────────────┐
│   Frontend / User       │
│                         │
└───────────┬─────────────┘
            │ Passes signed data to LSM
            ▼
┌─────────────────────────┐
│ LeverageStrategiesManager│
│   (Flash Loan Callback) │
└───────────┬─────────────┘
            │ Calls multicall
            ▼
┌─────────────────────────┐
│      SwapHelper         │
│  - Verifies signature   │
│  - Executes calls       │
└───────────┬─────────────┘
            │ genericCall
            ▼
┌─────────────────────────┐
│    DEX Router           │
│  (Uniswap, 1inch, etc.) │
└─────────────────────────┘
```

## Inheritance

- `EIP712` - EIP-712 typed data hashing for signature verification
- `Ownable` - Access control for admin functions
- `ReentrancyGuard` - Reentrancy protection

## State Variables

| Variable        | Type                       | Description                                     |
| --------------- | -------------------------- | ----------------------------------------------- |
| `backendSigner` | `address`                  | Address authorized to sign multicall operations |
| `usedSalts`     | `mapping(bytes32 => bool)` | Tracks used salts for replay protection         |

## Constants

```solidity
bytes32 internal constant MULTICALL_TYPEHASH =
    keccak256("Multicall(address caller,bytes[] calls,uint256 deadline,bytes32 salt)");
```

# Solidity API

### multicall

Executes multiple calls atomically with backend signature verification.

```solidity
function multicall(
    bytes[] calldata calls,
    uint256 deadline,
    bytes32 salt,
    bytes calldata signature
) external nonReentrant
```

#### Parameters

| Name      | Type    | Description                                                    |
| --------- | ------- | -------------------------------------------------------------- |
| calls     | bytes[] | Array of encoded function calls to execute on this contract    |
| deadline  | uint256 | Unix timestamp after which the transaction will revert         |
| salt      | bytes32 | Unique value ensuring this multicall can only be executed once |
| signature | bytes   | EIP-712 signature from the backend signer                      |

#### Execution Flow

1. Validate `calls` array is not empty
2. Check `block.timestamp <= deadline`
3. Verify signature is provided
4. Check salt has not been used
5. Mark salt as used
6. Recover signer from EIP-712 digest (including caller address) and verify against `backendSigner`
7. Execute each call atomically
8. Emit `MulticallExecuted` event

#### Typical Call Structure

A multicall for a swap operation typically contains:

```solidity
calls = [
    abi.encodeCall(SwapHelper.approveMax, (tokenIn, dexRouter)),
    abi.encodeCall(SwapHelper.genericCall, (dexRouter, swapCalldata)),
    abi.encodeCall(SwapHelper.sweep, (tokenOut, recipient))
]
```

#### Events

- `MulticallExecuted(caller, callsCount, deadline, salt)` on success

#### Errors

- `NoCallsProvided` if calls array is empty
- `DeadlineReached` if `block.timestamp > deadline`
- `MissingSignature` if signature length is zero
- `SaltAlreadyUsed` if salt has been used before
- `Unauthorized` if recovered signer does not match `backendSigner`

---

### genericCall

Executes an arbitrary call to an external contract. Only callable via multicall or by the owner.

```solidity
function genericCall(address target, bytes calldata data) external onlyOwnerOrSelf
```

#### Parameters

| Name   | Type    | Description                     |
| ------ | ------- | ------------------------------- |
| target | address | Address of the contract to call |
| data   | bytes   | Encoded function call data      |

#### Events

- `GenericCallExecuted(target, data)` on success

#### Access Requirements

- Only callable by owner or contract itself (via multicall)

#### Errors

- `CallerNotAuthorized` if caller is not owner or contract itself

---

### sweep

Transfers the entire balance of an ERC-20 token to a specified recipient.

```solidity
function sweep(IERC20Upgradeable token, address to) external onlyOwnerOrSelf
```

#### Parameters

| Name  | Type              | Description                            |
| ----- | ----------------- | -------------------------------------- |
| token | IERC20Upgradeable | ERC-20 token contract to sweep         |
| to    | address           | Recipient address for the swept tokens |

#### Events

- `Swept(token, to, amount)` on execution (emits even if amount is 0)

#### Access Requirements

- Only callable by owner or contract itself (via multicall)

#### Errors

- `CallerNotAuthorized` if caller is not authorized

---

### approveMax

Grants maximum approval of an ERC-20 token to a spender.

```solidity
function approveMax(IERC20Upgradeable token, address spender) external onlyOwnerOrSelf
```

#### Parameters

| Name    | Type              | Description                      |
| ------- | ----------------- | -------------------------------- |
| token   | IERC20Upgradeable | ERC-20 token contract to approve |
| spender | address           | Address to grant approval to     |

#### Events

- `ApprovedMax(token, spender)` on success

#### Access Requirements

- Only callable by owner or contract itself (via multicall)

#### Errors

- `CallerNotAuthorized` if caller is not authorized

---

### setBackendSigner

Updates the authorized backend signer address.

```solidity
function setBackendSigner(address newSigner) external onlyOwner
```

#### Parameters

| Name      | Type    | Description                |
| --------- | ------- | -------------------------- |
| newSigner | address | New backend signer address |

#### Events

- `BackendSignerUpdated(oldSigner, newSigner)` on success

#### Access Requirements

- Only callable by contract owner

#### Errors

- `ZeroAddress` if newSigner is address(0)

## Events

| Event                  | Parameters                         | Description                        |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| `BackendSignerUpdated` | oldSigner, newSigner               | Backend signer address changed     |
| `MulticallExecuted`    | caller, callsCount, deadline, salt | Multicall successfully executed    |
| `Swept`                | token, to, amount                  | Tokens transferred out of contract |
| `ApprovedMax`          | token, spender                     | Maximum approval granted           |
| `GenericCallExecuted`  | target, data                       | External call executed             |

## Custom Errors

| Error                 | Description                                    |
| --------------------- | ---------------------------------------------- |
| `DeadlineReached`     | Transaction deadline has passed                |
| `Unauthorized`        | Signature verification failed                  |
| `ZeroAddress`         | Zero address provided as parameter             |
| `SaltAlreadyUsed`     | Salt has already been used (replay protection) |
| `CallerNotAuthorized` | Caller is not owner or contract itself         |
| `NoCallsProvided`     | Empty calls array in multicall                 |
| `MissingSignature`    | Signature is required but empty                |

## Security Considerations

### Signature Verification

All multicall operations require a valid EIP-712 signature from the `backendSigner`. The signature covers:

- The caller address (prevents cross-address replay)
- The encoded calls array
- The deadline timestamp
- A unique salt

This prevents:

- Unauthorized swap execution
- Cross-address signature replay attacks
- Replay attacks (via salt tracking)
- Stale quote execution (via deadline)

### Access Control

Functions that interact with external contracts (`genericCall`, `sweep`, `approveMax`) are protected by `onlyOwnerOrSelf`:

- Direct calls require owner privileges
- Calls within `multicall` are authorized via backend signature

### Reentrancy Protection

The `multicall` function is protected by OpenZeppelin's `nonReentrant` modifier, preventing reentrant calls during execution.

### EIP-712 Domain

The contract initializes with:

- Name: `"VenusSwap"`
- Version: `"1"`

This domain separation ensures signatures are specific to this contract and version.

## Deployment

SwapHelper is currently deployed on BNB Chain Mainnet. See [Deployed Contracts](../deployed-contracts/periphery.md) for current addresses.

Deployments on additional networks are planned. The contract is designed to be deployed on any EVM-compatible network where Venus Protocol operates.

## Integration

### With LeverageStrategiesManager

The SwapHelper is the designated swap executor for the LeverageStrategiesManager. During leverage operations:

1. Frontend obtains signed `swapData` from Venus Swap API
2. User calls LeverageStrategiesManager entry function with `swapData`
3. LSM transfers tokens to SwapHelper during flash loan callback
4. LSM calls `swapHelper.call(swapData)` which invokes `multicall`
5. SwapHelper executes the swap and sweeps output tokens back to LSM
6. LSM validates received amount against slippage protection

### For Developers

SwapHelper exposes a clear interface for integration:

```solidity
interface ISwapHelper {
    function multicall(
        bytes[] calldata calls,
        uint256 deadline,
        bytes32 salt,
        bytes calldata signature
    ) external;

    function genericCall(address target, bytes calldata data) external;

    function sweep(IERC20Upgradeable token, address to) external;

    function approveMax(IERC20Upgradeable token, address spender) external;

    function setBackendSigner(address newSigner) external;
}
```

#### Signature Generation

When generating signatures for the `multicall` function, the backend must include the caller address in the EIP-712 digest:

```solidity
bytes32 digest = keccak256(abi.encode(
    MULTICALL_TYPEHASH,
    callerAddress,        // Address that will call multicall
    keccak256(abi.encodePacked(callHashes)),
    deadline,
    salt
));
```

This ensures signatures are specific to the address calling `multicall` and cannot be replayed from a different address.

### Swap API Request

When integrating with the Venus Swap API, include:

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `tokenIn`   | Source token address              |
| `tokenOut`  | Destination token address         |
| `amountIn`  | Exact input amount                |
| `recipient` | LeverageStrategiesManager address |
| `deadline`  | Unix timestamp for expiry         |
| `caller`    | Address that will call multicall  |

The API returns encoded `multicall` parameters with the backend signature that includes the caller address.

## Audits

SwapHelper undergoes security audits before mainnet deployment. Audit reports are available in the [venus-periphery repository](https://github.com/VenusProtocol/venus-periphery/tree/main/audits).
