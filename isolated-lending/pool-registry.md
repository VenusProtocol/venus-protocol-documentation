# Isolated Lending

## Introduction
Isolated lending creates collections of assets which users can supply and borrow in closed liquidity pools. This allows for more tokens with a wider variety of risk paramters to be made available to users without risking the liquidity of the entire protocol.

![Isolated Pools Diagram](<../.gitbook/assets/isolated-pools.png>)

## Details

Isolated lending has three main components the PoolRegistry, Pools, and Markets. The PoolRegistry is responsible for managing pools. It can create new pools, update pool metadata and manage markets within pools.

To create a new custom lending pool, the PoolRegistry deploys the unitroller and sets the comptroller implementation address to the unitroller. After setting up the comptroller, it adds the pool to the directory, and the Shortfall contract.

### Markets

To add a new market to a lending pool, the PoolRegistry deploys the JumpRate or WhitePaperInterestRate factory as interest rate model and then deploys the upgradable vToken for the market, before getting the support of the particular pool’s comptroller.
You can read more about interest rate models under [Protocol Math](/)
