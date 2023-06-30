# Venus Liquidation Guide

This is a step-by-step guide on how to perform liquidations on the Venus protocol. Liquidations involve seizing collateral from under-collateralized accounts to repay outstanding debts. The instructions are targeted towards developers or bots that aim to automate the liquidation process.

## Account Liquidity Calculations

Venus Protocol uses two calculations to determine account liquidity: Collateral Factor (CF) and Liquidation Threshold (LT).

### Collateral Factor (CF)

Collateral Factor is the percentage of the supplied funds that can be used to cover a loan. `Comptroller.getAccountLiquidity` in the Core Pool and `Comptroller.getBorrowingPower` in Isolated Pools return the liquidity or an account. They use the Resilient Oracle to retrieve the value of the asset and the collateral factor for the market to determine the percentage of supply can be used as collateral. Relying on `getBorrowingPower` is not sufficient for identifying accounts in need of liquidation on Isolated Pools.

### Liquidation Threshold (LT)

The Liquidation Threshold represents the point at which an account becomes under-collateralized, triggering the possibility of liquidation. In the Core Pool this is the same as the collateral factor. In Isolated Pools, the LT can be retrieved with `Comptroller.getAccountLiquidity`.

Liquidators often use external monitoring systems or other strategies to accurately identify under-collateralized accounts.

{% hint style="info" %}
**Iterating over all accounts and checking the CF and LT for every account is extremely inefficient.**

Instead, liquidators should rely on off-chain computations and maintain an off-chain mapping for accounts and balances. Using functions like `vTokenBalancesAll` and `vTokenUnderlyingPriceAll` from PoolLens can help retrieve balances and prices efficiently for multiple vTokens associated with an account.
{% endhint %}

By combining the information obtained from these functions, one can accurately identify under-collateralized accounts that are suitable for liquidation.

### Minimum Liquidatable Collateral

The `Comptroller.minLiquidatableCollateral` variable represents the minimal collateral in USD required for regular (non-batch) liquidations. Accounts with collateral below this threshold may not be eligible for non-batch liquidations. It's defined in atoms of USD (18 decimals).

## Finding Under-Collateralized Accounts

The first step to performing a liquidation is to identify under-collateralized accounts.
Here's a suggested approach to finding under-collateralized accounts:

1. Create a record of account balances: To identify under-collateralized accounts efficiently, liquidators can maintain an off-chain mapping of accounts and balances by indexing market events to detect new positions and update existing ones:

   * `Mint`: Event emitted when tokens are minted.
   * `Redeem`: Event emitted when tokens are redeemed.
   * `Borrow`: Event emitted when underlying is borrowed.
   * `RepayBorrow`: Event emitted when a borrow is repaid. By listening to these events, liquidators can track changes in positions and update the balances of users accordingly.

Consider using a subgraph to index these events.

2. Get account balances:  Use the `vTokenBalancesAll` function provided by PoolLens (VenusLens on the Core Pool) to retrieve supply and borrow balances for multiple vTokens associated with an account. This function takes an array of vTokens and the account address as parameters.

3. Get underlying asset prices: Use the `vTokenUnderlyingPriceAll` function provided by the PoolLens
   (VenusLens on the Core Pool) to retrieve the underlying asset prices for multiple vTokens. This function takes an array of vTokens as a parameter.

4. Calculate liquidity shortfall: With the supply and borrow balances obtained from step 2 and the underlying asset prices from step 3, calculate the liquidity shortfall for each account. This can be done by taking the scalar product of the balances and prices and comparing them against the LT values.

By following this approach, you can efficiently identify under-collateralized accounts based on the CF and LT calculations.

{% hint style="warning" %}
Please note that the functions mentioned above are provided by PoolLens and may require integration within your liquidation bot. Additionally, it's important to stay updated with any changes or updates to Venus Protocol that may impact the process of finding under-collateralized accounts.
{% endhint %}

## Performing the Liquidation

Once an under-collateralized account has been identified, the liquidation process can be initiated using the `liquidateBorrow` function provided by the relevant vToken contract (Liquidator contract on the Core Pool). Here's an overview of the steps involved:

1. Calculate the liquidation amount: Determine the amount of debt to be repaid and the collateral to be seized. This is typically calculated by examining the borrower's debt balance, the market's collateral factor, and any discounts or liquidation incentives offered.

2. Invoke the `liquidateBorrow` function: Call the `liquidateBorrow` function on the relevant vToken contract. This function requires several parameters, including the borrower's address, the liquidator's address, the amount of debt to be repaid, and the collateral to be seized. Refer to the vToken contract documentation for specific details on the function's required parameters.

3. Handle liquidation results: After invoking `liquidateBorrow`, monitor the transaction's success and handle any resulting events or errors. Successful liquidations will transfer the seized collateral to the liquidator's address and repay the debt from the borrower's account.

{% hint style="info" %}
### Example
Collateral Factor: 50%
Liquidation Threshold: 60%
Borrow Amount: $10,000
Collateral Amount: $20,000

If the value of the borrowed asset increases to $12,000 or more, the position would be eligible for liquidation.

{% endhint %}

## Isolated Lending Liquidations
Isolated Lending pools extend the liquidation mechanism of our core pool. In our core pool there is no mechanic to generate bad debt and to offset the bad debt with protocol revenue/fees. For this purpose a new variable is introduced in Isolated Pools called Minimum Liquidatable Collateral.
The `Comptroller.minLiquidatableCollateral` variable represents the minimal collateral in USD required for regular (non-batch) liquidations. Accounts with collateral below this threshold may not be eligible for non-batch liquidations. There are 3 possible liqudiations that can be performed taking into account the `minLiquidatableCollateral` variable:

### <b> Collateral > Minimum Liquidatable Collateral</b>
In this case we perform the regular liquidation by calling `vToken.liquidateBorrow()` function (Step 2. from liquidation guide). This mechanic is the same for <b>Core Protocol</b> and  <b>Isolated Lending </b>

### <b> Collateral < Minimum Liquidatable Collateral </b>
In this situation we have to take in mind account solvency:
- If account is still solvent we need to invoke `Comptroller.liquidateAccount()` which liquidates all borrows of the borrower.
  
{% hint style="info" %}
### Example
Collateral Factor: 50%

Liquidation Threshold: 60%

Min Liquidatable Collateral: $100

Borrow Amount: $60

Collateral Amount: $90

Position is already eligible for liquidation since Borrow Amount >= $54. We should call `liquidateAccount()` because collateral < $100 and account is solvent.

{% endhint %}

- If account is insolvent we need to invoke `Comptroller.healAccount()` which seizes all the remaining collateral from the borrower, requires the person initiating the liquidation (msg.sender) to repay the borrower's existing debt, and treats any remaining debt as bad debt.The sender has to repay a certain percentage of the debt, computed as
`collateral / (borrows * liquidationIncentive)`.

{% hint style="info" %}
### Example

Collateral Factor: 50%

Liquidation Threshold: 60%

Min Liquidatable Collateral: $100

Borrow Amount: $90

Collateral Amount: $60

Position is eligible for liquidation, collateral is < $100, but account is insolvent and we need to call `healAccount()` so we can treat the remaining debt as bad debt for the protocol.
{% endhint %}