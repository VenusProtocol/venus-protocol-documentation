# Venus Liquidation Guide

This guide provides step-by-step instructions on how to perform liquidations on the Venus protocol. Liquidations involve seizing collateral from under-collateralized accounts to repay outstanding debts. The instructions are targeted towards developers or bots that aim to automate the liquidation process.

## Account Liquidity Calculations

Venus protocol differentiates between two types of account liquidity calculations: Collateral Factor (CF) and Liquidation Threshold (LT).

### Collateral Factor (CF)

Collateral Factor is the percentage of the supplied funds that can be used to cover the loan. The `Comptroller.getBorrowingPower` function provides this information. Relying on `getBorrowingPower` is not sufficient for identifying accounts in need of liquidation.

### Liquidation Threshold (LT)

The Liquidation Threshold represents the point at which an account becomes under-collateralized, triggering the possibility of liquidation. The `Comptroller.getAccountLiquidity` function provides this information. Liquidators often need to use external monitoring systems or explore other strategies to identify under-collateralized accounts accurately.


It's worth to say that iterating over all accounts and calling these functions for every account is inefficient. Instead, liquidators should rely on off-chain computations and maintain an off-chain mapping for accounts and balances. Using functions like `vTokenBalancesAll` and `vTokenUnderlyingPriceAll` from PoolLens can help retrieve balances and prices efficiently for multiple vTokens associated with an account.

By combining the information obtained from these functions, one can accurately identify under-collateralized accounts that are suitable for liquidation.

### Minimum Liquidatable Collateral
The `Comptroller.minLiquidatableCollateral` variable represents the minimal collateral in USD required for regular (non-batch) liquidations. Accounts with collateral below this threshold may not be eligible for liquidation. It's defined in atoms of USD (18 decimals).

## Finding Under-Collateralized Accounts

Before performing a liquidation, it is crucial to identify under-collateralized accounts.
Here's a suggested approach to finding under-collateralized accounts:
1. To identify under-collateralized accounts efficiently, liquidators must maintains an off-chain mapping for accounts and balances by indexing market events to detect new positions or update existing ones:

   - `Mint`: Event emitted when tokens are minted.
	Redeem: Event emitted when tokens are redeemed.
   - `Borrow`: Event emitted when underlying is borrowed.
   - `RepayBorrow`: Event emitted when a borrow is repaid.By listening to these events, liquidators can track changes in positions and update the balances of users accordingly.

2. Use the `vTokenBalancesAll` function: The `vTokenBalancesAll` function provided by PoolLens supports retrieving supply and borrow balances for multiple vTokens associated with an account. This function requires an array of vTokens and the account address as parameters.

3. Use the `vTokenUnderlyingPriceAll` function: The `vTokenUnderlyingPriceAll` function provided by PoolLens retrieves the underlying asset prices for multiple vTokens. This function also requires an array of vTokens as a parameter.

4. Calculate liquidity shortfall: With the supply and borrow balances obtained from step 1 and the underlying asset prices from step 2, calculate the liquidity shortfall for each account. This can be done by taking the scalar product of the balances and prices and comparing them against the LT values.

By following this approach, you can efficiently identify under-collateralized accounts based on the CF and LT calculations.

Please note that the functions mentioned above are provided by PoolLens and may require integration and usage within your liquidation bot. Additionally, it's important to stay updated with any changes or updates to Venus protocol that may impact the process of finding under-collateralized accounts.

## Performing the Liquidation

Once an under-collateralized account has been identified, the liquidation process can be initiated using the `liquidateBorrow` function provided by the relevant vToken contract. Here's an overview of the steps involved:

1. Calculate the liquidation amount: Determine the amount of debt to be repaid and the collateral to be seized. This is typically calculated by examining the borrower's debt balance, the market's collateral factor, and any discounts or liquidation incentives offered.

2. Invoke the `liquidateBorrow` function: Call the `liquidateBorrow` function on the relevant vToken contract. This function requires several parameters, including the borrower's address, the liquidator's address, the amount of debt to be repaid, and the collateral to be seized. Refer to the vToken contract documentation for specific details on the function's required parameters.

3. Handle liquidation results: After invoking `liquidateBorrow`, monitor the transaction's success and handle any resulting events or errors. Successful liquidations will transfer the seized collateral to the liquidator's address and repay the debt from the borrower's account.

Please note that the liquidation process involves complex calculations and requires a deep understanding of Venus protocol. It's essential to thoroughly test and validate your liquidation bot before deploying it in a production environment. Additionally, keep track of any changes or updates to the Venus protocol that may impact the liquidation process.