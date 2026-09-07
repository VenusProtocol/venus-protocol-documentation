# Periphery Contracts

Venus Protocol periphery contracts extend the lending markets with product workflows, swap execution, price-deviation monitoring, and emergency controls. They are separate contracts with their own upgrade, ownership, signer, or Access Control Manager (ACM) trust boundaries.

> **Version scope:** These references follow the stable [`venus-periphery` v1.2.0 release](https://github.com/VenusProtocol/venus-periphery/tree/v1.2.0). Most deployed components are upgradeable proxies, while `SwapHelper` and PositionAccount implementations use different deployment patterns. Use the [deployed-contract registry](../../deployed-contracts/periphery.md) to find an address, then verify its current implementation and configuration on the relevant explorer before integrating or granting approvals.

## Overview

The public references cover the following systems:

- **[RelativePositionManager](relative-position-manager.md)** — orchestrates Venus Trade positions and deterministic PositionAccount clones on BNB Chain.
- **[LeverageStrategiesManager](leverage-strategies-manager.md)** — enters and exits leveraged positions using Core Pool flash loans on BNB Chain.
- **[SwapHelper](swap-helper.md)** — executes backend-signed batches of approvals, arbitrary calls, and token sweeps for BNB trading flows.
- **[SwapRouter](swap-router.md)** — swaps an input token and supplies or repays through BNB Core Pool markets.
- **[DeviationSentinel](deviation-sentinel.md)** — compares configured oracle and DEX prices and routes qualifying incidents to EBrake on the networks listed in the registry.
- **[EBrake](ebrake.md)** — exposes selected tighten-only Comptroller actions to explicitly authorized incident-response callers.

## Key Features

- Flash-loan-based atomic leverage execution
- EIP-712 authorization for SwapHelper call batches
- EIP-1153 transient callback state in LeverageStrategiesManager
- Post-operation account-liquidity validation
- Caller-selected output floors for quoted swap paths; full-repayment SwapRouter paths instead bound token input with `maxAmountIn` or `msg.value`
- On-chain deviation checks and restricted emergency parameter tightening

## Deployment

The trading contracts are deployed on BNB Chain. DeviationSentinel and EBrake also have deployments on selected additional networks. See [Deployed Contracts](../../deployed-contracts/periphery.md) for the current published network and address list; a contract's presence in source does not establish that it is deployed on every Venus network.
