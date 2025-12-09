# Periphery Contracts

Venus Protocol periphery contracts extend core protocol functionality with auxiliary features for advanced DeFi operations. These contracts integrate with the Venus Comptroller and vToken markets to provide atomic, gas-efficient operations.

## Overview

The Venus periphery consists of specialized smart contracts designed to streamline complex DeFi operations:

- **[LeverageStrategiesManager](leverage-strategies-manager.md)** - Enter and exit leveraged positions atomically using flash loans
- **[SwapHelper](swap-helper.md)** - Execute backend-authorized token swaps with signature verification

## Key Features

- Flash loan-based atomic execution
- EIP-712 signature verification for authorized operations
- EIP-1153 transient storage for efficient callback state management
- Comprehensive account safety validation
- Slippage protection on all swap operations

## Deployment

Periphery contracts are currently deployed on BNB Chain Mainnet. See [Deployed Contracts](../../deployed-contracts/periphery.md) for addresses and deployment information.

## Integration

For users looking to leverage their positions or perform advanced trading strategies, start with the [Leverage Positions Guide](../../guides/leverage-positions.md).

Developers integrating with periphery contracts should review the detailed API documentation in the individual contract pages.
