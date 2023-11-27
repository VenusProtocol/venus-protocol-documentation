* [Account Liquidity Calculations](#account-liquidity-calculations)
  * [Collateral Factor (CF)](#collateral-factor-cf)
  * [Liquidation Threshold (LT)](#liquidation-threshold-lt)
  * [Minimum Liquidatable Collateral](#minimum-liquidatable-collateral)
* [Finding Under-Collateralized Accounts](#finding-under-collateralized-accounts)
* [Performing the Liquidation](#performing-the-liquidation)
* [Forced liquidations](#forced-liquidations)

# Liquidations

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

The `Comptroller.minLiquidatableCollateral` variable represents the minimal collateral in USD required for regular (non-batch) liquidations. Accounts with collateral below this threshold may not be eligible for non-batch liquidations. It's defined in USD value (18 decimals scale).

## Finding Under-Collateralized Accounts

The first step to performing a liquidation is to identify under-collateralized accounts. Here's a suggested approach to finding under-collateralized accounts:

1. Create a record of account balances: To identify under-collateralized accounts efficiently, liquidators can maintain an off-chain mapping of accounts and balances by indexing market events to detect new positions and update existing ones:
   * `Mint`: Event emitted when tokens are minted.
   * `Redeem`: Event emitted when tokens are redeemed.
   * `Borrow`: Event emitted when underlying is borrowed.
   * `RepayBorrow`: Event emitted when a borrow is repaid. By listening to these events, liquidators can track changes in positions and update the balances of users accordingly.

Consider using a subgraph to index these events.

2. Get account balances: Use the `vTokenBalancesAll` function provided by PoolLens (VenusLens on the Core Pool) to retrieve supply and borrow balances for multiple vTokens associated with an account. This function takes an array of vTokens and the account address as parameters.
3. Get underlying asset prices: Use the `vTokenUnderlyingPriceAll` function provided by the PoolLens (VenusLens on the Core Pool) to retrieve the underlying asset prices for multiple vTokens. This function takes an array of vTokens as a parameter.
4. Calculate liquidity shortfall: With the supply and borrow balances obtained from step 2 and the underlying asset prices from step 3, calculate the liquidity shortfall for each account. This can be done by taking the scalar product of the balances and prices and comparing them against the LT values.

By following this approach, you can efficiently identify under-collateralized accounts based on the CF and LT calculations.

{% hint style="warning" %}
Please note that the functions mentioned above are provided by PoolLens and may require integration within your liquidation bot. Additionally, it's important to stay updated with any changes or updates to Venus Protocol that may impact the process of finding under-collateralized accounts.
{% endhint %}

## Performing the Liquidation

Once an under-collateralized account has been identified, the liquidation process can be initiated using either `liquidateBorrow` , `liquidateAccount` or `healAccount` function. `liquidateBorrow` is provided by the relevant vToken contract (Liquidator contract on the Core Pool) whereas `liquidateAccount` and `healAccount` are provided in Comptroller. Here's an overview of the steps involved:

{% hint style="warning" %}
Please note that `healAccount` is an extension of the liquidation mechanism to address handling of bad debt and offseting it with protocol revenue/fees. On the other hand, `liquidateAccount` allows batches of liquidations in a single transaction. In both cases, the total collateral must be lower than the threshold `Comptroller.minLiquidatableCollateral`. Those two functions are only available in Isolated Pools. For Core Pool `liquidateBorrow` function provided by `Liquidator` contract is the only available mechanism to perform liquidations.
{% endhint %}

1. Calculate the liquidation amount: Determine the amount of debt to be repaid and the collateral to be seized. This is typically calculated by examining the borrower's debt balance, the market's collateral factor, and any discounts or liquidation incentives offered.
2. When performing the liquidation, there are 3 different types of liquidations that can be called, taking in mind the **collateral**, **minimum liquidatable collateral** and **solvency** of the account:

* **Collateral > `minLiquidatableCollateral` -->** `liquidateBorrow()`: Call the `liquidateBorrow` function on the relevant vToken contract. This function requires several parameters, including the borrower's address, the liquidator's address, the amount of debt to be repaid, and the collateral to be seized. Refer to the vToken contract documentation for specific details on the function's required parameters.

{% hint style="info" %}
#### Example

**Collateral Factor: 50%**

**Close Factor: 50%**

**Liquidation Threshold: 60%**

**Borrow Amount: $13,000**

**Collateral Amount: $20,000**

**Liquidation Incentive: 110%**

**Protocol Share Percentage: 5%**

The borrowed amount is $1,000 above the liquidation threshold ($12,000), therefore the position is eligible for liquidation. Liquidation can be called with a repayment of up to $6,500 (borrow amount \* close factor). Let's assume the liquidator initiates the liquidation process with a repayment amount of $1,000 Let's Calculate the Collateral Seized Amount (the amount that is seized from the borrower's collateral):

`Collateral Seized Amount = Repayment Amount * Liquidation Incentive`

`Collateral Seized Amount = $1,000 * 1.1`

`Collateral Seized Amount = $1,100`

Therefore, if the borrowed asset value reaches **$13,000** and the repayment amount is **$1,000**, the total collateral seized will be **$1,100** considering the liquidation incentive of 10%. In order to calculate what amount the liquidator will get we need to consider `treasuryPercentMantissa` (in the Core pool) or `protocolSeizeShareMantissa` (in the Isolated pools). This variable (`Protocol Share Percentage`) sets the percentage of the collateral seized that will go to the protocol. Let's assume that the protocol shares for liquidations is `5%` and calculate the liquidator received amount:

`Liquidator Receive Amount = Collateral Seized - Protocol Shares`

`Protocol Shares = (Collateral Seized / Liquidation Incentive) * Protocol Share Percentage`

`Protocol Shares = ($1,100 / 1.1) * 0.05 = $50`

`Liquidator Receive Amount = $1,100 - $50 = $1,050`

In conclusion, the liquidator will provide **$1,000** for the liquidation. After the liquidation, the liquidator will receive **$1,050** and the rest **$50** will go to the protocol.
{% endhint %}

* **Collateral < minLiquidatableCollateral && account is solvent -->** `liquidateAccount()`: this function liquidates all borrows of the borrower.

{% hint style="info" %}
#### Example

**Collateral Factor: 50%**

**Liquidation Threshold: 60%**

**Min Liquidatable Collateral: $100**

**Borrow Amount: $60**

**Collateral Amount: $90**

Position is already eligible for liquidation since Borrow Amount >= $54. We should call `liquidateAccount()` because **collateral < $100** and account is **solvent**.
{% endhint %}

* **Collateral < minLiquidatableCollateral && account is insolvent -->** `healAccount()`: this function seizes all the remaining collateral from the borrower, requires the person initiating the liquidation (msg.sender) to repay the borrower's existing debt, and treats any remaining debt as bad debt. The sender has to repay a certain percentage of the debt, computed as `collateral / (borrows * liquidationIncentive)`

{% hint style="info" %}
#### Example

**Collateral Factor: 50%**

**Liquidation Threshold: 60%**

**Min Liquidatable Collateral: $100**

**Borrow Amount: $90**

**Collateral Amount: $60**

Position is eligible for liquidation and **collateral is < $100**, but the account is **insolvent**, so we need to call `healAccount()` to ensure that the remaining debt ($30) is treated as bad debt for the protocol.
{% endhint %}

3. Handle liquidation results: After invoking `liquidateBorrow`, monitor the transaction's success and handle any resulting events or errors. Successful liquidations will transfer the seized collateral to the liquidator's address and repay the debt from the borrower's account.

{% hint style="warning" %}
Please note that the liquidation process involves complex calculations and requires a deep understanding of Venus Protocol. It's essential to thoroughly test and validate your liquidation bot before deploying it in a production environment. Additionally, keep track of any changes or updates to the Venus Protocol that may impact the liquidation process.
{% endhint %}

## Forced liquidations

Usually, accounts are only eligible to be liquidated if they are under-collateralized, as described in the previous sections. An exception is if "forced liquidations" are enabled for a market or an individual account in a market. In this case, borrow positions can be liquidated in that market even when the health rate of the account is greater than 1 (i.e. when the account is sufficiently collateralized). Additionally, the close factor check is ignored, allowing the liquidation of 100% of the debt in one transaction.

This feature is based on the implementation done by Compound V2 [here](https://github.com/compound-finance/compound-protocol/pull/123/files). Compound V2 allows "forced liquidations" on markets as soon as the Collateral factor is zero, the Reserve factor is 100% and the borrows are paused. Venus defines a feature flag to enable/disable "forced liquidations", configurable directly via VIP, not based on other parameters. Compound community talked about this feature in [this post](https://www.comp.xyz/t/deprecate-fei-market/3513).

On Venus, forced liquidations can be enabled either for an entire market (all borrow positions in the market can be forcefully liquidated), or for individual accounts in a market (only the borrows of a particular account can be forcefully liquidated in the market).

To check if forced liquidations are enabled for an entire market, the function `Comptroller.isForcedLiquidationEnabled(address vToken)` can be called on the Comptroller contract of the pool with the address of the market. To check if forced liquidations are enabled for an individual account in the market, the function `Comptroller.isForcedLiquidationEnabledForUser(address borrower, address vToken)` can be used, providing the account and market address as arguments.


{% hint style="info" %}
**Availability**:
Forced Liquidations for entire markets are available in the Core pool since [VIP-172](https://app.venus.io/#/governance/proposal/172), in the Isolated pools since [VIP-186](https://app.venus.io/#/governance/proposal/186). Forced Liquidations for individual accounts are available only in the Core pool since [VIP-210](https://app.venus.io/#/governance/proposal/210).
{% endhint %}

### Example

Given:

* `vUSDT` collateral factor: 80%
* 1 USDT = 1 BUSD = 1 USDC = $1 (for simplicity)
* Close factor: 50%
* Liquidation incentive: 10%
* User with the following positions:
  * Supply: 500 USDT
  * Borrow: 200 BUSD
  * Borrow: 100 USDC

The health rate for this user would be `(500 * 0.8) / (200 + 100) = 1.33`. So, in normal circumstances, this user is not eligible to be liquidated.

Now, let’s say we enable the **forced liquidations in the BUSD market** (via VIP). Then:

* Anyone will be allowed to liquidate the BUSD position of the previous user. Moreover, the close factor limit won’t be taken into account. So, the following liquidation would be doable:
  * Repay amount: 200 BUSD
  * Collateral market to seize: USDT
    
* By doing this liquidation, 220 USDT (repay amount + liquidation incentive) would be seized from the user’s collateral.
    
* After the liquidation, the global position of our user would be:
  * Supply: 280 USDT (500 USDT - 220 USDT seized during the liquidation)
  * Borrow: 0 BUSD
  * Borrow: 100 USDC
    
* So, the new health rate would be `(280 * 0.8 / 100) = 2.24`. They will be still ineligible for regular liquidations
    
* Because the forced liquidation is not enabled in the USDC market, the USDC debt cannot be liquidated (because the health rate is greater than 1).