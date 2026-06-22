# Glossary

A quick reference to the core terms a new user meets when getting started with Venus Protocol.

### vToken

An ERC-20 token you receive when you supply an asset to a Venus market; it accrues interest over time and can be redeemed for the underlying asset plus the yield it has earned. [Read more →](../guides/market-interaction/supply-borrow.md)

### Comptroller

The risk-management smart contract for a pool that enforces collateral factors, liquidation thresholds, and borrowing limits across all of the markets in that pool. [Read more →](../technical-reference/contracts-overview.md)

### Core Pool

The original, single lending pool on Venus containing the main BNB Chain assets; all of its markets share one Comptroller, and it is the only pool where VAI can be minted. [Read more →](../README.md)

### Isolated Pools

Independent lending pools that each carry their own assets and risk parameters, so a problem in one pool cannot affect the liquidity of the others. [Read more →](../whats-new/isolated-pools.md)

### Collateral Factor

The percentage of a supplied asset's value that can be borrowed against; for example, a collateral factor of 70% means you may borrow up to 70% of that deposit's USD value. [Read more →](../guides/market-interaction/liquidation.md)

### Liquidation

The process by which a third party repays part of an under-collateralized borrower's debt in exchange for a portion of their collateral at a discount, restoring the pool's solvency. [Read more →](../guides/market-interaction/liquidation.md)

### Supply APY

The annualized yield you earn for depositing (supplying) an asset into a Venus market, paid by the borrowers of that asset. [Read more →](../risk/interest-rate-model.md)

### Borrow APY

The annualized interest rate charged when you borrow an asset from a Venus market, accruing on top of your outstanding loan balance. [Read more →](../risk/interest-rate-model.md)

### XVS

The native governance and utility token of Venus Protocol; XVS holders stake in the vault to earn yield and vote on Venus Improvement Proposals (VIPs). [Read more →](../tokens/xvs.md)

### VAI

Venus Protocol's native stablecoin, soft-pegged to 1 USD, which users can mint by depositing collateral in the Core Pool. [Read more →](../tokens/vai.md)

### Venus Prime

A loyalty incentive program that issues a non-transferable Soulbound Token to eligible XVS stakers, boosting their earnings across selected markets using protocol revenue rather than token emissions. [Read more →](../whats-new/prime-yield.md)
