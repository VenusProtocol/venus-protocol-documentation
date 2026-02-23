# LeverageStrategiesManager

The LeverageStrategiesManager is a Venus periphery contract that enables users to enter and exit leveraged positions atomically using flash loans. It integrates with the Venus Comptroller's flash loan functionality and the SwapHelper contract to execute complex leverage operations in a single transaction.

## Overview

Leverage operations in DeFi typically require multiple transactions: borrowing, swapping, and supplying assets. The LeverageStrategiesManager consolidates these into atomic operations using flash loans, eliminating intermediate exposure and reducing gas costs.

The contract supports five distinct leverage strategies:

| Strategy                   | Description                                                 | Swap Required |
| -------------------------- | ----------------------------------------------------------- | ------------- |
| `enterSingleAssetLeverage` | Amplify exposure to a single asset                          | No            |
| `enterLeverage`            | Enter leverage with collateral seed, borrow different asset | Yes           |
| `enterLeverageFromBorrow`  | Enter leverage using borrowed asset as seed                 | Yes           |
| `exitSingleAssetLeverage`  | Close single-asset leveraged position                       | No            |
| `exitLeverage`             | Close cross-asset leveraged position                        | Yes           |

## Prerequisites

Before using the LeverageStrategiesManager, users must delegate borrowing rights to the contract:

```solidity
// On the Venus Comptroller
comptroller.updateDelegate(leverageStrategiesManagerAddress, true);
```

This delegation allows the contract to:

- Borrow on behalf of the user
- Mint vTokens on behalf of the user
- Redeem vTokens on behalf of the user
- Repay borrows on behalf of the user

## Inheritance

- `Ownable2StepUpgradeable` - Two-step ownership transfer pattern
- `ReentrancyGuardUpgradeable` - Reentrancy protection
- `IFlashLoanReceiver` - Flash loan callback interface
- `ILeverageStrategiesManager` - Contract interface

## Immutable State Variables

| Variable      | Type           | Description                                                        |
| ------------- | -------------- | ------------------------------------------------------------------ |
| `COMPTROLLER` | `IComptroller` | Venus Comptroller for market interactions and flash loan execution |
| `swapHelper`  | `SwapHelper`   | Token swap executor for cross-asset operations                     |
| `vBNB`        | `IVToken`      | vBNB market address (not supported for leverage operations)        |

## Architecture

<figure><img src="../../.gitbook/assets/leverage_position.png" alt="LeverageStrategiesManager Architecture"><figcaption></figcaption></figure>

## Transient Storage (EIP-1153)

The contract uses EIP-1153 transient storage to pass state between entry functions and flash loan callbacks. These values are automatically cleared at transaction end:

| Variable                | Type            | Description                                 |
| ----------------------- | --------------- | ------------------------------------------- |
| `operationType`         | `OperationType` | Current operation being executed            |
| `operationInitiator`    | `address`       | Original `msg.sender` of the entry function |
| `collateralMarket`      | `IVToken`       | Target collateral market                    |
| `collateralAmount`      | `uint256`       | Collateral seed or redeem amount            |
| `borrowedAmountSeed`    | `uint256`       | User-provided borrowed asset seed           |
| `minAmountOutAfterSwap` | `uint256`       | Slippage protection threshold               |

# Solidity API

### enterSingleAssetLeverage

Enters a leveraged position using the same asset for collateral and borrowing. No swap is required.

```solidity
function enterSingleAssetLeverage(
    IVToken _collateralMarket,
    uint256 _collateralAmountSeed,
    uint256 _collateralAmountToFlashLoan
) external
```

#### Parameters

| Name                          | Type    | Description                                                      |
| ----------------------------- | ------- | ---------------------------------------------------------------- |
| \_collateralMarket            | IVToken | The vToken market to use for both collateral and borrowing       |
| \_collateralAmountSeed        | uint256 | Amount of underlying tokens the user provides as initial capital |
| \_collateralAmountToFlashLoan | uint256 | Amount to flash loan for leverage amplification                  |

#### Example

User has 10 ETH and wants 2x exposure:

- Provide 10 ETH as seed
- Flash loan 10 ETH
- Supply 20 ETH as collateral
- Final: 20 ETH collateral, 10 ETH debt (plus fees)

#### Events

- `SingleAssetLeverageEntered` emitted on success
- `DustTransferred` emitted if residual tokens remain

#### Access Requirements

- User must have delegated to this contract via `Comptroller.updateDelegate`

#### Errors

- `ZeroFlashLoanAmount` if `_collateralAmountToFlashLoan` is zero
- `MarketNotListed` if market is not listed in Comptroller
- `VBNBNotSupported` if the market is vBNB
- `NotAnApprovedDelegate` if user has not delegated to this contract
- `AccrueInterestFailed` if interest accrual fails on the market
- `EnterMarketFailed` if entering the market fails
- `OperationCausesLiquidation` if pre/post position is unsafe

---

### enterLeverage

Enters a leveraged position by providing collateral seed and borrowing a different asset. The borrowed asset is swapped to collateral.

```solidity
function enterLeverage(
    IVToken _collateralMarket,
    uint256 _collateralAmountSeed,
    IVToken _borrowedMarket,
    uint256 _borrowedAmountToFlashLoan,
    uint256 _minAmountOutAfterSwap,
    bytes calldata _swapData
) external
```

#### Parameters

| Name                        | Type    | Description                                                        |
| --------------------------- | ------- | ------------------------------------------------------------------ |
| \_collateralMarket          | IVToken | The vToken market to supply collateral to                          |
| \_collateralAmountSeed      | uint256 | Amount of collateral underlying the user provides                  |
| \_borrowedMarket            | IVToken | The vToken market to borrow from                                   |
| \_borrowedAmountToFlashLoan | uint256 | Amount of borrowed asset to flash loan                             |
| \_minAmountOutAfterSwap     | uint256 | Minimum collateral tokens expected from swap (slippage protection) |
| \_swapData                  | bytes   | Encoded swap data from Venus Swap API                              |

#### Example

User has 1,000 USDC and wants 3x USDC exposure:

- Provide 1,000 USDC as collateral seed
- Flash loan 2,000 USDT
- Swap 2,000 USDT → ~2,000 USDC
- Supply 3,000 USDC as collateral
- Final: 3,000 USDC collateral, 2,000 USDT debt (plus fees)

#### Events

- `LeverageEntered` emitted on success
- `DustTransferred` emitted for residual collateral and borrowed tokens

#### Access Requirements

- User must have delegated to this contract via `Comptroller.updateDelegate`

#### Errors

- `ZeroFlashLoanAmount` if `_borrowedAmountToFlashLoan` is zero
- `IdenticalMarkets` if collateral and borrowed markets are the same
- `MarketNotListed` if either market is not listed in Comptroller
- `VBNBNotSupported` if either market is vBNB
- `NotAnApprovedDelegate` if user has not delegated to this contract
- `AccrueInterestFailed` if interest accrual fails on either market
- `EnterMarketFailed` if entering either market fails
- `SlippageExceeded` if swap output is below `_minAmountOutAfterSwap`
- `TokenSwapCallFailed` if swap execution reverts
- `OperationCausesLiquidation` if position becomes unsafe

---

### enterLeverageFromBorrow

Enters a leveraged position by providing the borrowed asset as seed. Both seed and flash loan are swapped to collateral.

```solidity
function enterLeverageFromBorrow(
    IVToken _collateralMarket,
    IVToken _borrowedMarket,
    uint256 _borrowedAmountSeed,
    uint256 _borrowedAmountToFlashLoan,
    uint256 _minAmountOutAfterSwap,
    bytes calldata _swapData
) external
```

#### Parameters

| Name                        | Type    | Description                                                   |
| --------------------------- | ------- | ------------------------------------------------------------- |
| \_collateralMarket          | IVToken | The vToken market to supply collateral to                     |
| \_borrowedMarket            | IVToken | The vToken market providing the seed and flash loan           |
| \_borrowedAmountSeed        | uint256 | Amount of borrowed asset the user provides as seed            |
| \_borrowedAmountToFlashLoan | uint256 | Amount of borrowed asset to flash loan                        |
| \_minAmountOutAfterSwap     | uint256 | Minimum collateral tokens expected from swap                  |
| \_swapData                  | bytes   | Encoded swap data (must account for seed + flash loan amount) |

#### Example

User has 1 ETH and wants leveraged USDC exposure:

- Provide 1 ETH as seed
- Flash loan 2 ETH
- Swap 3 ETH → ~6,000 USDC
- Supply 6,000 USDC as collateral
- Final: 6,000 USDC collateral, 2 ETH debt (plus fees)

#### Events

- `LeverageEnteredFromBorrow` emitted on success
- `DustTransferred` emitted for residual tokens

#### Access Requirements

- User must have delegated to this contract

#### Errors

- `ZeroFlashLoanAmount` if `_borrowedAmountToFlashLoan` is zero
- `MarketNotListed` if either market is not listed in Comptroller
- `VBNBNotSupported` if either market is vBNB
- `NotAnApprovedDelegate` if user has not delegated to this contract
- `AccrueInterestFailed` if interest accrual fails on either market
- `EnterMarketFailed` if entering either market fails
- `SlippageExceeded` if swap output is below `_minAmountOutAfterSwap`
- `TokenSwapCallFailed` if swap execution reverts
- `OperationCausesLiquidation` if position becomes unsafe

---

### exitSingleAssetLeverage

Closes or reduces a single-asset leveraged position. Flash loans the asset to repay debt, then redeems collateral to cover the flash loan.

```solidity
function exitSingleAssetLeverage(
    IVToken _collateralMarket,
    uint256 _collateralAmountToFlashLoan
) external
```

#### Parameters

| Name                          | Type    | Description                                    |
| ----------------------------- | ------- | ---------------------------------------------- |
| \_collateralMarket            | IVToken | The vToken market for both collateral and debt |
| \_collateralAmountToFlashLoan | uint256 | Amount to flash loan for debt repayment        |

#### Example

User has 20 ETH collateral and 10 ETH debt:

- Flash loan 10 ETH
- Repay 10 ETH debt
- Redeem ~10 ETH (plus fees) from collateral
- Final: ~10 ETH collateral, 0 debt

#### Events

- `SingleAssetLeverageExited` emitted on success
- `DustTransferred` emitted for residual tokens

#### Access Requirements

- User must have delegated to this contract

#### Errors

- `ZeroFlashLoanAmount` if flash loan amount is zero
- `MarketNotListed` if market is not listed in Comptroller
- `VBNBNotSupported` if the market is vBNB
- `NotAnApprovedDelegate` if user has not delegated to this contract
- `AccrueInterestFailed` if interest accrual fails on the market
- `InsufficientFundsToRepayFlashloan` if redemption insufficient for repayment
- `OperationCausesLiquidation` if final position is unsafe

---

### exitLeverage

Closes or reduces a cross-asset leveraged position. Flash loans borrowed asset to repay debt, redeems collateral, and swaps to cover the flash loan.

```solidity
function exitLeverage(
    IVToken _collateralMarket,
    uint256 _collateralAmountToRedeemForSwap,
    IVToken _borrowedMarket,
    uint256 _borrowedAmountToFlashLoan,
    uint256 _minAmountOutAfterSwap,
    bytes calldata _swapData
) external
```

#### Parameters

| Name                              | Type    | Description                                 |
| --------------------------------- | ------- | ------------------------------------------- |
| \_collateralMarket                | IVToken | The vToken market holding user's collateral |
| \_collateralAmountToRedeemForSwap | uint256 | Amount of collateral to redeem and swap     |
| \_borrowedMarket                  | IVToken | The vToken market where user has debt       |
| \_borrowedAmountToFlashLoan       | uint256 | Amount to flash loan for debt repayment     |
| \_minAmountOutAfterSwap           | uint256 | Minimum borrowed tokens expected from swap  |
| \_swapData                        | bytes   | Encoded swap data                           |

#### Example

User has 3,000 USDC collateral and 1 ETH debt:

- Flash loan 1 ETH
- Repay 1 ETH debt
- Redeem 2,000 USDC from collateral
- Swap 2,000 USDC → ~1 ETH (plus fees)
- Final: ~1,000 USDC collateral, 0 ETH debt

#### Events

- `LeverageExited` emitted on success
- `DustTransferred` emitted for residual tokens

#### Access Requirements

- User must have delegated to this contract

#### Errors

- `ZeroFlashLoanAmount` if flash loan amount is zero
- `IdenticalMarkets` if collateral and borrowed markets are the same
- `MarketNotListed` if either market is not listed in Comptroller
- `VBNBNotSupported` if either market is vBNB
- `NotAnApprovedDelegate` if user has not delegated to this contract
- `AccrueInterestFailed` if interest accrual fails on either market
- `SlippageExceeded` if swap output is below minimum
- `InsufficientFundsToRepayFlashloan` if swap output insufficient for repayment
- `OperationCausesLiquidation` if final position is unsafe

---

### executeOperation

Flash loan callback invoked by the Comptroller. Routes execution to the appropriate handler based on `operationType`.

```solidity
function executeOperation(
    IVToken[] calldata vTokens,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    address onBehalf,
    bytes calldata param
) external override nonReentrant returns (bool success, uint256[] memory repayAmounts)
```

#### Parameters

| Name      | Type      | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| vTokens   | IVToken[] | Array with the borrowed vToken market (single element)        |
| amounts   | uint256[] | Array with the borrowed underlying amount (single element)    |
| premiums  | uint256[] | Array with the flash loan fee amount (single element)         |
| initiator | address   | Address that initiated the flash loan (must be this contract) |
| onBehalf  | address   | User for whom debt will be opened                             |
| param     | bytes     | Encoded auxiliary data for the operation                      |

#### Access Requirements

- Only callable by the Comptroller

#### Errors

- `UnauthorizedExecutor` if caller is not Comptroller
- `InitiatorMismatch` if initiator is not this contract
- `OnBehalfMismatch` if onBehalf does not match operationInitiator
- `FlashLoanAssetOrAmountMismatch` if arrays length is not 1
- `InvalidExecuteOperation` if operation type is unknown

## Events

| Event                        | Parameters                                                                                         | Description                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `SingleAssetLeverageEntered` | user, collateralMarket, collateralAmountSeed, collateralAmountToFlashLoan                          | Single-asset leverage position opened                     |
| `LeverageEntered`            | user, collateralMarket, collateralAmountSeed, borrowedMarket, borrowedAmountToFlashLoan            | Cross-asset leverage position opened with collateral seed |
| `LeverageEnteredFromBorrow`  | user, collateralMarket, borrowedMarket, borrowedAmountSeed, borrowedAmountToFlashLoan              | Cross-asset leverage position opened with borrowed seed   |
| `LeverageExited`             | user, collateralMarket, collateralAmountToRedeemForSwap, borrowedMarket, borrowedAmountToFlashLoan | Cross-asset leverage position closed                      |
| `SingleAssetLeverageExited`  | user, collateralMarket, collateralAmountToFlashLoan                                                | Single-asset leverage position closed                     |
| `DustTransferred`            | recipient, token, amount                                                                           | Residual tokens transferred after operation               |

## Security Considerations

### Access Control

- **Delegate Requirement**: All operations verify the user has delegated to this contract via `Comptroller.updateDelegate()`
- **Flash Loan Callback**: `executeOperation` validates `msg.sender` is the Comptroller
- **Initiator Validation**: Callback verifies `initiator == address(this)` to prevent unauthorized triggers
- **OnBehalf Validation**: Callback verifies `onBehalf == operationInitiator` for user consistency

### Reentrancy Protection

The `executeOperation` function is protected by OpenZeppelin's `nonReentrant` modifier, preventing reentrant calls during flash loan callback execution.

### Slippage Protection

All swap operations accept a `minAmountOutAfterSwap` parameter. The transaction reverts with `SlippageExceeded` if the swap output falls below this threshold.

### Account Safety

- Enter operations perform pre-checks to ensure the user is not already at liquidation risk
- All operations perform post-checks to verify the final position is healthy
- Exit operations skip pre-checks since reducing debt can only improve health

### Dust Handling

After every operation, any residual token balances are transferred back to the user:

- Collateral dust → User
- Borrowed dust (all operations) → User

## Deployment

See [Deployed Contracts](../../deployed-contracts/periphery.md) for current addresses.

## Integration

### For Users

1. **Enable Delegation**: Call `Comptroller.updateDelegate(leverageStrategiesManagerAddress, true)` to authorize the contract
2. **Approve Tokens**: Grant token spending approval to LeverageStrategiesManager for collateral tokens
3. **Execute Operations**: Call the appropriate entry function with parameters

### For Developers

LeverageStrategiesManager exposes a clear interface for integration:

```solidity
interface ILeverageStrategiesManager {
    function enterSingleAssetLeverage(
        IVToken _collateralMarket,
        uint256 _collateralAmountSeed,
        uint256 _collateralAmountToFlashLoan
    ) external;

    function enterLeverage(
        IVToken _collateralMarket,
        uint256 _collateralAmountSeed,
        IVToken _borrowedMarket,
        uint256 _borrowedAmountToFlashLoan,
        uint256 _minAmountOutAfterSwap,
        bytes calldata _swapData
    ) external;

    function exitSingleAssetLeverage(
        IVToken _collateralMarket,
        uint256 _collateralAmountToFlashLoan
    ) external;

    function exitLeverage(
        IVToken _collateralMarket,
        uint256 _collateralAmountToRedeemForSwap,
        IVToken _borrowedMarket,
        uint256 _borrowedAmountToFlashLoan,
        uint256 _minAmountOutAfterSwap,
        bytes calldata _swapData
    ) external;
}
```

### Swap API Integration

Cross-asset operations (enterLeverage, enterLeverageFromBorrow, exitLeverage) require signed swap data from the Venus Swap API:

1. Request a swap quote from the API with source and destination tokens
2. Receive encoded `multicall` parameters with backend signature
3. Pass the signed `_swapData` to the entry function

## Audits

LeverageStrategiesManager undergoes security audits before mainnet deployment. Audit reports are available in the [venus-periphery repository](https://github.com/VenusProtocol/venus-periphery/tree/main/audits).
