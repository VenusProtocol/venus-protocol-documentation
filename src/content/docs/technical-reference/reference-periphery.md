---
title: "Periphery"
---

Venus Protocol periphery contracts extend the lending markets with product workflows, swap execution, price-deviation monitoring, and emergency controls. They are separate contracts with their own upgrade, ownership, signer, or Access Control Manager (ACM) trust boundaries.

> **Version scope:** These references follow the stable [`venus-periphery` v1.2.0 release](https://github.com/VenusProtocol/venus-periphery/tree/v1.2.0), except [EBrake](/technical-reference/reference-periphery/ebrake), which follows v1.3.0. Most deployed components are upgradeable proxies, while `SwapHelper` and PositionAccount implementations use different deployment patterns. Use the [deployed-contract registry](/deployed-contracts/periphery) to find an address, then verify its current implementation and configuration on the relevant explorer before integrating or granting approvals.

## Overview

The public references cover the following systems:

- **[RelativePositionManager](/technical-reference/reference-periphery/relative-position-manager)** — orchestrates Venus Trade positions and deterministic PositionAccount clones on BNB Chain.
- **[LeverageStrategiesManager](/technical-reference/reference-periphery/leverage-strategies-manager)** — enters and exits leveraged positions using Core Pool flash loans on BNB Chain.
- **[SwapHelper](/technical-reference/reference-periphery/swap-helper)** — executes backend-signed batches of approvals, arbitrary calls, and token sweeps for BNB trading flows.
- **[SwapRouter](/technical-reference/reference-periphery/swap-router)** — swaps an input token and supplies or repays through BNB Core Pool markets.
- **[DeviationSentinel](/technical-reference/reference-periphery/deviation-sentinel)** — compares configured oracle and DEX prices and routes qualifying incidents to EBrake on the networks listed in the registry.
- **[EBrake](/technical-reference/reference-periphery/ebrake)** — exposes selected tighten-only Comptroller actions, and from v1.3.0 Liquidity Hub pauses, to explicitly authorized incident-response callers.

## Key Features

- Flash-loan-based atomic leverage execution
- EIP-712 authorization for SwapHelper call batches
- EIP-1153 transient callback state in LeverageStrategiesManager
- Post-operation account-liquidity validation
- Caller-selected output floors for quoted swap paths; full-repayment SwapRouter paths instead bound token input with `maxAmountIn` or `msg.value`
- On-chain deviation checks and restricted emergency parameter tightening

## Deployment

The trading contracts are deployed on BNB Chain. DeviationSentinel and EBrake also have deployments on selected additional networks. See [Deployed Contracts](/deployed-contracts/periphery) for the current published network and address list; a contract's presence in source does not establish that it is deployed on every Venus network.
