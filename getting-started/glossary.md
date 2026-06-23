# Glossary

A quick reference to the core terms a new user meets when getting started with Venus Protocol.

## vToken

An interest-bearing token minted when an asset is supplied to a Venus market. It represents the depositor's share of that market and accrues value as interest accumulates, and can be redeemed for the underlying asset on demand.

## Comptroller

The risk-management contract that enforces borrowing limits, collateral requirements, and market configurations for a pool. Each [Core Pool](#core-pool) and [Isolated Pool](../whats-new/isolated-pools.md) has its own Comptroller.

## Core Pool

Venus's original unified lending market, supporting a broad set of assets under shared risk parameters. It is also the only pool that supports [VAI](../tokens/vai.md) minting.

## Isolated Pools

Independent lending markets, each with its own asset listing, risk configuration, and risk fund, so that problems in one pool cannot propagate across the protocol. See [Isolated Pools](../whats-new/isolated-pools.md).

## Collateral Factor

The percentage of a supplied asset's value that can back a loan. For example, a 75% collateral factor means $100 of supplied collateral supports up to $75 of borrowing.

## Liquidation

The process by which a liquidator repays part of an under-collateralized borrower's debt and receives the borrower's collateral at a discount in return, protecting the solvency of the protocol. See [Liquidations](../guides/market-interaction/liquidation.md).

## Supply APY / Borrow APY

The annualised interest rates for depositors (earned) and borrowers (paid). Both are adjusted algorithmically based on a market's utilisation ratio — the share of supplied funds that is currently borrowed.

## XVS

Venus Protocol's native governance and utility token. Staked XVS earns yield and grants voting power over Venus Improvement Proposals (VIPs). See [XVS](../tokens/xvs.md).

## VAI

Venus's native USD-pegged stablecoin, minted against [Core Pool](#core-pool) collateral. A dynamic stability-fee mechanism helps keep VAI pegged to the US dollar. See [VAI](../tokens/vai.md).

## Venus Prime

An incentive program that rewards long-term XVS stakers with a non-transferable Soulbound Token, boosting their yield in selected markets and funded by protocol revenue. See [Venus Prime](../whats-new/prime-yield.md).
