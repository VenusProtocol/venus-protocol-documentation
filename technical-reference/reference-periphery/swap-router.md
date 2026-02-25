## Overview

The `SwapRouter` is a Venus periphery contract that enables users to swap tokens and interact with Venus markets in a single transaction. It supports both ERC-20 and native tokens (e.g., BNB), allowing users to supply or repay Venus markets seamlessly after a swap. This contract is designed for composability, security, and gas efficiency.

## Prerequisites

Before using the SwapRouter, users should:

1. Approve the SwapRouter to spend their tokens (for ERC-20 operations).
2. Ensure the target vToken market is listed in the Venus Comptroller.
3. For native token operations, send the appropriate value with the transaction.

## Inheritance

- `Ownable2StepUpgradeable` — Two-step ownership transfer pattern
- `ReentrancyGuardUpgradeable` — Reentrancy protection

## Immutable State Variables

- `NATIVE_TOKEN_ADDR`: Address representing the native token (e.g., BNB)
- `COMPTROLLER`: Venus Comptroller contract for market validation
- `SWAP_HELPER`: SwapHelper contract for executing swaps
- `WRAPPED_NATIVE`: Wrapped native token contract (e.g., WBNB)
- `NATIVE_VTOKEN`: vToken contract for the native token (e.g., vBNB)

## Architecture

```
┌───────────────────────────────────────────────┐
│                Venus Core Protocol           │
│  ┌───────────┐  ┌──────────┐                │
│  │Comptroller│  │  vTokens │                │
│  └─────┬─────┘  └────┬─────┘                │
└────────┼─────────────┼───────────────────────┘
         │             │
         ▼             ▼
┌───────────────────────────────────────────────┐
│                SwapRouter                    │
│  - Swaps tokens via SwapHelper               │
│  - Supplies or repays Venus markets          │
│  - Handles native and ERC-20 tokens          │
└───────────────┬──────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────┐
│                SwapHelper                     │
│  - Executes authorized swaps                  │
│  - Interacts with DEX protocols               │
└───────────────────────────────────────────────┘
```

## Solidity API

### swapAndSupply

Swaps an input token for the underlying asset of a Venus market and supplies it on behalf of the user.

```solidity
function swapAndSupply(
    address vToken,
    address tokenIn,
    uint256 amountIn,
    uint256 minAmountOut,
    bytes calldata swapCallData
) external
```

**Parameters:**

- `vToken`: The vToken market to supply to
- `tokenIn`: The input token to swap from
- `amountIn`: The amount of input tokens to swap
- `minAmountOut`: The minimum amount of output tokens expected
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**
User wants to supply 1,000 USDC to a Venus market using DAI:

1. User holds 1,000 DAI.
2. Calls `swapAndSupply` with vUSDC, DAI, 1,000 DAI, minAmountOut = 995 USDC, and swapCallData for DAI→USDC swap.
3. SwapRouter swaps 1,000 DAI → ~998 USDC.
4. Supplies ~998 USDC to vUSDC market.
5. Final: User has ~998 USDC supplied, 0 DAI, receives vUSDC tokens.

**Events:**

- `SwapAndSupply`

**Errors:**

- `ZeroAmount`: Thrown if `amountIn` is zero.
- `ZeroAddress`: Thrown if `vToken` or `tokenIn` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `InsufficientBalance`: Thrown if user has insufficient balance for swap.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than `minAmountOut`.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `SupplyFailed`: Thrown if supply to Venus market fails (returns error code).

### swapNativeAndSupply

Swaps native tokens (e.g., BNB) for the underlying asset and supplies it to a Venus market.

```solidity
function swapNativeAndSupply(
    address vToken,
    uint256 minAmountOut,
    bytes calldata swapCallData
) external payable
```

**Parameters:**

- `vToken`: The vToken market to supply to
- `minAmountOut`: The minimum amount of output tokens expected
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**

User wants to supply 2 BNB to a Venus market using native BNB:

1. User holds 2 BNB.
2. Calls `swapNativeAndSupply` with vUSDT, minAmountOut = 600 USDT, and swapCallData for BNB→USDT swap, sending 2 BNB.
3. SwapRouter wraps 2 BNB to WBNB, swaps WBNB → ~610 USDT.
4. Supplies ~610 USDT to vUSDT market.
5. Final: User has ~610 USDT supplied, 0 BNB, receives vUSDT tokens.

**Events:**

- `SwapAndSupply`

**Errors:**

- `ZeroAmount`: Thrown if `msg.value` is zero.
- `ZeroAddress`: Thrown if `vToken` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than `minAmountOut`.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `SupplyFailed`: Thrown if supply to Venus market fails.

### swapAndRepay

Swaps an input token and repays the user's debt in a Venus market.

```solidity
function swapAndRepay(
    address vToken,
    address tokenIn,
    uint256 amountIn,
    uint256 minAmountOut,
    bytes calldata swapCallData
) external
```

**Parameters:**

- `vToken`: The vToken market to repay debt to
- `tokenIn`: The input token to swap from
- `amountIn`: The amount of input tokens to swap
- `minAmountOut`: The minimum amount of output tokens expected
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**
User has 500 USDT debt in a Venus market and wants to repay using USDC:

1. User holds 510 USDC.
2. Calls `swapAndRepay` with vUSDT, USDC, 510 USDC, minAmountOut = 500 USDT, and swapCallData for USDC→USDT swap.
3. SwapRouter swaps 510 USDC → ~505 USDT.
4. Repays 500 USDT debt in vUSDT market.
5. Final: User has 0 USDT debt, 5 USDT returned as excess, 0 USDC.

**Events:**

- `SwapAndRepay`

**Errors:**

- `ZeroAmount`: Thrown if `amountIn` or user debt is zero.
- `ZeroAddress`: Thrown if `vToken` or `tokenIn` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `InsufficientBalance`: Thrown if user has insufficient balance for swap.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than `minAmountOut`.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `RepayFailed`: Thrown if repay to Venus market fails (returns error code).

### swapNativeAndRepay

Swaps native tokens and repays the user's debt in a Venus market.

```solidity
function swapNativeAndRepay(
    address vToken,
    uint256 minAmountOut,
    bytes calldata swapCallData
) external payable
```

**Parameters:**

- `vToken`: The vToken market to repay debt to
- `minAmountOut`: The minimum amount of output tokens expected
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**
User has 0.5 BNB debt in a Venus market and wants to repay using native BNB:

1. User holds 0.5 BNB.
2. Calls `swapNativeAndRepay` with vDAI, minAmountOut = 1,000 DAI, and swapCallData for BNB→DAI swap, sending 0.5 BNB.
3. SwapRouter wraps 0.5 BNB to WBNB, swaps WBNB. → ~1,010 DAI.
4. Repays 1,000 DAI debt in vDAI market.
5. Final: User has 0 DAI debt, 10 DAI returned as excess, 0 ETH.

**Events:**

- `SwapAndRepay`

**Errors:**

- `ZeroAmount`: Thrown if `msg.value` or user debt is zero.
- `ZeroAddress`: Thrown if `vToken` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than `minAmountOut`.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `RepayFailed`: Thrown if repay to Venus market fails.

### swapAndRepayFull

Swaps tokens to repay the user's full debt in a Venus market.

```solidity
function swapAndRepayFull(
    address vToken,
    address tokenIn,
    uint256 maxAmountIn,
    bytes calldata swapCallData
) external
```

**Parameters:**

- `vToken`: The vToken market to repay full debt to
- `tokenIn`: The input token to swap from
- `maxAmountIn`: The maximum amount of input tokens to use
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**
User has 1,200 USDC debt in a Venus market and wants to repay full debt using DAI:

1. User holds 1,250 DAI.
2. Calls `swapAndRepayFull` with vUSDC, DAI, 1,250 DAI, and swapCallData for DAI→USDC swap.
3. SwapRouter swaps 1,250 DAI → ~1,210 USDC.
4. Repays 1,200 USDC debt in vUSDC market.
5. Final: User has 0 USDC debt, 10 USDC returned as excess, 0 DAI.

**Events:**

- `SwapAndRepay`

**Errors:**

- `ZeroAmount`: Thrown if `maxAmountIn` or user debt is zero.
- `ZeroAddress`: Thrown if `vToken` or `tokenIn` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `InsufficientBalance`: Thrown if user has insufficient balance for swap.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than debt amount.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `RepayFailed`: Thrown if repay to Venus market fails.

### swapNativeAndRepayFull

Swaps native tokens to repay the user's full debt in a Venus market.

```solidity
function swapNativeAndRepayFull(
    address vToken,
    bytes calldata swapCallData
) external payable
```

**Parameters:**

- `vToken`: The vToken market to repay full debt to
- `swapCallData`: Encoded swap instructions for SwapHelper

**Scenario Example:**
User has 0.8 BNB debt in a Venus market and wants to repay full debt using native BNB:

1. User holds 0.85 BNB.
2. Calls `swapNativeAndRepayFull` with vUSDT and swapCallData for BNB→USDT swap, sending 0.85 BNB.
3. SwapRouter wraps 0.85 BNB to WBNB, swaps WBNB → ~260 USDT.
4. Repays 250 USDT debt in vUSDT market.
5. Final: User has 0 USDT debt, 10 USDT returned as excess, 0 BNB.

**Events:**

- `SwapAndRepay`

**Errors:**

- `ZeroAmount`: Thrown if `msg.value` or user debt is zero.
- `ZeroAddress`: Thrown if `vToken` is zero address.
- `MarketNotListed`: Thrown if `vToken` is not listed in Comptroller.
- `SwapFailed`: Thrown if swap operation fails.
- `InsufficientAmountOut`: Thrown if received amount is less than debt amount.
- `NoTokensReceived`: Thrown if no tokens are received from swap.
- `RepayFailed`: Thrown if repay to Venus market fails.

### sweepToken

Allows the contract owner to recover leftover ERC-20 tokens from the contract.

```solidity
function sweepToken(IERC20Upgradeable token) external onlyOwner
```

**Example:**

```solidity
swapRouter.sweepToken(tokenAddress);
```

### sweepNative

Allows the contract owner to recover leftover native tokens from the contract.

```solidity
function sweepNative() external onlyOwner
```

**Example:**

```solidity
swapRouter.sweepNative();
```

## Error Definitions

- `ZeroAddress()`: Thrown when a zero address is provided for required parameters.
- `ZeroAmount()`: Thrown when a zero amount is provided for required parameters or user debt is zero.
- `SupplyFailed(uint256 errorCode)`: Thrown when supply operation to Venus market fails. Returns the error code from the vToken.
- `RepayFailed(uint256 errorCode)`: Thrown when repay operation to Venus market fails. Returns the error code from the vToken.
- `SwapFailed()`: Thrown when the swap operation fails (e.g., SwapHelper call reverts).
- `NoTokensReceived()`: Thrown when no tokens are received from the swap operation.
- `NativeTransferFailed()`: Thrown when native token transfer fails (e.g., sweepNative fails to send ETH/BNB).
- `InsufficientBalance()`: Thrown when the user has insufficient balance for the swap or supply/repay operation.
- `MarketNotListed(address vToken)`: Thrown when the vToken market is not listed in the Comptroller.
- `InsufficientAmountOut(uint256 amountOut, uint256 minAmountOut)`: Thrown when the swap output is less than the minimum required amount (slippage protection).
- `UnauthorizedNativeSender(address sender)`: Thrown when an unauthorized sender tries to send native tokens to the contract.

## Security Considerations

### Access Control

- Only the contract owner can sweep tokens or native currency.
- All swap/supply/repay functions are open to users, but require proper approvals and market listing.

### Reentrancy Protection

- All external functions are protected by the `nonReentrant` modifier.

### Slippage Protection

- All swap functions require a `minAmountOut` parameter. The transaction reverts if the swap output is below this threshold.

### Market Validation

- The contract checks that the vToken market is listed in the Comptroller before proceeding.

### Account Safety

- The contract validates user balances and market status before executing operations.

### Dust Handling

- Any excess tokens after repay operations are returned to the user.

## Integration

### For Users

1. Approve the SwapRouter to spend your tokens (for ERC-20 operations):
   ```solidity
   IERC20(tokenIn).approve(swapRouterAddress, amount);
   ```
2. Call the desired function (`swapAndSupply`, `swapAndRepay`, etc.) with the appropriate parameters and swapCallData.
3. For native token operations, send the required value with your transaction.
4. Monitor events (`SwapAndSupply`, `SwapAndRepay`) for transaction status.

### For Developers

### Swap API Integration

Cross-asset operations require signed swap data from the Venus Swap API:

1. Request a swap quote from the API with source and destination tokens
2. Receive encoded `multicall` parameters with backend signature
3. Pass the signed `_swapData` to the entry function

## Audits

SwapRouter undergoes security audits before mainnet deployment. Audit reports are available in the [venus-periphery repository](https://github.com/VenusProtocol/venus-periphery/tree/main/audits).

## Deployment

See [Deployed Contracts](../deployed-contracts/periphery.md) for current addresses.
