# Protocol Math

### Overview

The contracts under the Venus Protocol employ a system called Exponential.sol. This system uses exponential mathematics to represent fractional quantities with high precision.

Most numbers in this system are represented by a mantissa, an unsigned integer scaled by a factor of 1 \* 10^18. This scaling ensures basic mathematical operations can be performed with a high degree of accuracy.

### vToken and Underlying Decimals

Prices and exchange rates are adjusted according to the unique decimal scaling of each asset. vTokens, which are BEP-20 tokens, are scaled with 8 decimal places. However, their underlying tokens may have different decimal scaling, which is indicated by a public member called 'decimals'.

For further details, please refer to the respective token contract addresses.

{% content-ref url="../deployed-contracts/markets.md" %}
[core-pool.md](../deployed-contracts/markets.md)
{% endcontent-ref %}

### Interpreting Exchange Rates

The exchange rate of vTokens is adjusted based on the decimal difference between the vToken and its underlying asset.

$$
oneVTokenInUnderlying = \frac{exchangeRateCurrent}{1 \times 10^{(18 + underlyingDecimals - vTokenDecimals)}}
$$

Here is an example illustrating how to determine the value of one vBUSD in BUSD using the Web3.js JavaScript library.

```javascript
const vTokenDecimals = 8; // all vTokens have 8 decimal places
const underlying = new web3.eth.Contract(bep20Abi, busdAddress);
const vToken = new web3.eth.Contract(vTokenAbi, vBusdAddress);
const underlyingDecimals = await underlying.methods.decimals().call();
const exchangeRateCurrent = await vToken.methods.exchangeRateCurrent().call();
const mantissa = 18 + parseInt(underlyingDecimals) - vTokenDecimals;
const oneVTokenInUnderlying = exchangeRateCurrent / Math.pow(10, mantissa);
console.log('1 vBUSD can be redeemed for', oneVTokenInUnderlying, 'BUSD');
```

As BNB lacks an underlying contract, you must set the 'underlyingDecimals' to 18 when dealing with vBNB.

To calculate the number of underlying tokens that can be redeemed using vTokens, you should multiply the total amount of vTokens by the previously computed 'oneVTokenInUnderlying' value.

$$
underlyingTokens = vTokenAmount \times oneVTokenInUnderlying
$$

### Calculating Accrued Interest

Interest rates for each market are updated in any block where there is a change in the ratio of borrowed assets to supplied assets. The magnitude of this change in interest rates depends on the interest rate model smart contract in place for the market, and the degree of change in the aforementioned ratio.

For a visualization of the current interest rate model applied to each market, refer to the market pages at the [Venus app](https://app.venus.io).

The accrual of interest to suppliers and borrowers in a market occurs when any wallet interacts with the market's vToken contract. This interaction could be any of the following functions: mint, redeem, borrow, or repay. A successful execution of any of these functions triggers the `accrueInterest` method, leading to the addition of interest to the underlying balance of every supplier and borrower in the market. Interest accrues for the current block, as well as any previous blocks where the `accrueInterest` method was not triggered due to lack of interaction with the vToken contract. Interest only accumulates during blocks where one of the aforementioned methods is invoked on the vToken contract.

Let's consider an example of supply interest accrual: Alice supplies 1 BNB to the Venus Protocol. At the time of her supply, the `supplyRatePerBlock` is 37893605 Wei, which equates to 0.000000000037893605 BNB per block. For 3 blocks, no interactions occur with the vBNB contract. On the subsequent 4th block, Bob borrows some BNB. As a result, Alice’s underlying balance is updated to 1.000000000151574420 BNB (calculated by multiplying 37893605 Wei by 4 blocks and adding the original 1 BNB). From this point onwards, the accrued interest on Alice’s underlying BNB balance will be based on the updated value of 1.000000000151574420 BNB, rather than the initial 1 BNB. It is important to note that the `supplyRatePerBlock` value may alter at any given time.

### Calculating the APY Using Rate Per Block

The Annual Percentage Yield (APY) for either supplying or borrowing in each market can be computed using the `supplyRatePerBlock` (for Supply APY) or `borrowRatePerBlock` (for Borrow APY) values. These rates can be used in the following formula (assuming a daily compound):

```javascript
Rate = vToken.supplyRatePerBlock(); // Integer
Rate = 37893566
BNB Mantissa = 1 * 10 ^ 18 (BNB has 18 decimal places)
Blocks Per Day = 80 * 60 * 24 (based on 80 blocks occurring every minute on BNB Chain)
Days Per Year = 365

APY = (((Rate / BNB Mantissa) * Blocks Per Day) + 1) ^ (Days Per Year - 1) * 100
```

Here is an example of calculating the supply and borrow APY with Web3.js JavaScript:

```javascript
const ethMantissa = 1e18;
const blocksPerDay = 80 * 60 * 24;
const daysPerYear = 365;

const vToken = new web3.eth.Contract(vBnbAbi, vBnbAddress);
const supplyRatePerBlock = await vToken.methods.supplyRatePerBlock().call();
const borrowRatePerBlock = await vToken.methods.borrowRatePerBlock().call();
const supplyApy = Math.pow(((supplyRatePerBlock / bnbMantissa) * blocksPerDay) + 1, daysPerYear - 1) * 100;
const borrowApy = Math.pow(((borrowRatePerBlock / bnbMantissa) * blocksPerDay) + 1, daysPerYear - 1) * 100;
console.log(`Supply APY for BNB ${supplyApy} %`);
console.log(`Borrow APY for BNB ${borrowApy} %`);
```
