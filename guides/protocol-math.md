# Protocol math

{% hint style="warning" %}
**Use deployment-specific inputs.** The conversion identities on this page are current, but token decimals, vToken implementation, interest-rate model, and rate time unit are deployment state. Resolve them for the target chain, pool, market, and block before using the examples. Do not reuse vBNB or per-block assumptions on another deployment.
{% endhint %}

Venus contracts commonly represent fractional rates and exchange rates as integer mantissas scaled by `1e18`. Token amounts use the token's own decimal scale instead. Keep those two scales separate and use integer or arbitrary-precision arithmetic for on-chain values.

## vToken and underlying decimals

vTokens are ERC-20-compatible tokens, but the contract initializer accepts the vToken decimal count as a deployment parameter. Read it instead of assuming every vToken has eight decimals:

```solidity
function decimals() external view returns (uint8);
```

For an ERC-20 market, read the underlying address from the vToken and then read the underlying token's `decimals()`. Native-asset markets are an exception: for example, BNB Chain mainnet vBNB has no ERC-20 underlying contract, and native BNB uses 18 decimals.

The [deployed markets](../deployed-contracts/markets.md) page is an address-discovery starting point. Verify the address, implementation, listing state, and decimals on the target chain before calculating balances.

## Exchange rates

Let:

* `V_raw` be a vToken amount in raw vToken units;
* `E` be the `1e18`-scaled exchange-rate mantissa; and
* `U_raw` be the corresponding underlying amount in raw underlying units.

The exact integer conversion is:

$$
U_{raw} = \left\lfloor\frac{V_{raw} \times E}{10^{18}}\right\rfloor
$$

Solidity integer division and the following `BigInt` code both round down:

```javascript
const WAD = 10n ** 18n;

function vTokensToUnderlyingRaw(vTokenRaw, exchangeRateMantissa) {
  return (vTokenRaw * exchangeRateMantissa) / WAD;
}
```

For human-readable values, if `dV` and `dU` are the vToken and underlying decimal counts:

$$
oneVTokenInUnderlying = \frac{E}{10^{18 + dU - dV}}
$$

and:

$$
U_{human} = V_{human} \times oneVTokenInUnderlying
$$

Do not apply the human-unit formula to raw integers. For example, with `dV = 8`, `dU = 18`, and `E = 2 × 10^26`, one vToken represents `0.02` underlying tokens. A raw vToken balance of `10^8` therefore converts to `2 × 10^16` raw underlying units.

### Stored versus current exchange rate

```solidity
function exchangeRateStored() external view returns (uint256);

function exchangeRateCurrent() external returns (uint256);
```

`exchangeRateStored()` uses the last persisted interest checkpoint and does not accrue interest. `exchangeRateCurrent()` calls the accrual path first. It is not a Solidity `view` function:

* an off-chain `eth_call` simulates catch-up accrual and returns the resulting rate without persisting state; and
* a successful transaction persists the new checkpoint before returning the rate.

When `totalSupply` is zero, the implementation returns the configured initial exchange-rate mantissa. When comparing a simulated current rate with stored state, pin every read to the same block.

## Interest accrual and checkpoints

Interest is economically accounted for over elapsed slots, but the contract does not update storage autonomously in every block or second. Stored totals and indexes remain at the last checkpoint until a successful call executes `accrueInterest()` directly or reaches it through another function.

For the borrow side, the core checkpoint calculation is:

$$
\Delta = currentSlot - priorAccrualSlot
$$

$$
simpleInterestFactor = borrowRatePerSlot \times \Delta
$$

$$
interestAccumulated = \left\lfloor\frac{simpleInterestFactor \times borrowsPrior}{10^{18}}\right\rfloor
$$

The implementation then increases `totalBorrows` by `interestAccumulated`, adds the reserve-factor share to `totalReserves`, and increases `borrowIndex` by its proportional simple-interest factor. A later successful accrual therefore catches up all elapsed slots; inactivity does not make the elapsed interest disappear.

A supplier does not receive an account-level `supplyRate × principal × slots` storage update. The supplier keeps a vToken balance, and its underlying value changes through the market's updated exchange rate. Calls such as mint, redeem, borrow, repay, liquidation, current-balance getters, reserve operations, and direct `accrueInterest()` can reach the checkpoint path; the exact set depends on the implementation.

One catch-up over multiple slots applies a simple-interest factor for that interval. Do not describe the contract as automatically compounding in every block. Checkpoint frequency, utilization changes, and governance parameter changes affect the realized path.

## Annualizing a per-slot snapshot rate

The ABI names `supplyRatePerBlock()` and `borrowRatePerBlock()` are retained across Venus implementations, but modern vTokens document the return value as a rate per **slot**. A slot can be a block or a second.

Before annualizing a rate:

1. identify whether the target implementation is block-based or time-based;
2. obtain the matching `slotsPerYear` value from the deployed implementation or interest-rate model;
3. obtain the `slotsPerDay` convention used by the display client; and
4. read the rate mantissa at the same target block.

Modern TimeManager-based deployments expose `isTimeBased()` and `blocksOrSecondsPerYear()`. BNB Chain mainnet Core models are block-based and may expose their own `blocksPerYear` assumption. Do not assume `slotsPerDay = slotsPerYear / 365`: a block-based model's annualization parameter and a client's current block-cadence configuration can diverge. Do not hardcode a chain-wide blocks-per-day value in a long-lived integration.

For a `1e18`-scaled rate snapshot:

$$
r_{slot} = \frac{rateMantissa}{10^{18}}
$$

The deployed model's normalization produces:

$$
modelNormalizedAPR = r_{slot} \times configuredSlotsPerYear
$$

APY is an off-chain display convention. Define the daily snapshot using the consuming client's `slotsPerDay` value:

$$
dailyRate = r_{slot} \times slotsPerDay
$$

and the corresponding non-compounded display extrapolation is:

$$
displayAPR = dailyRate \times 365
$$

The official frontend rate utility assumes 365 daily compounding periods:

$$
frontendAPY = \left(1 + dailyRate\right)^{365} - 1
$$

At the pinned source snapshots used for this page, the official API base-market supply/borrow calculator instead raises the same daily factor to 364 (`DAYS_PER_YEAR - 1`):

$$
apiAPY = \left(1 + dailyRate\right)^{364} - 1
$$

A client that consumes those API-provided base-market values can therefore differ from a direct use of the frontend utility. Other API calculations can use different conventions. Neither convention changes on-chain accrual. Choose and label the `slotsPerDay` input and daily exponent required by the consuming system; do not claim one derived value is universal across Venus components.

`modelNormalizedAPR` and `displayAPR` are equal only when `configuredSlotsPerYear = slotsPerDay × 365`. Check that equality explicitly for a block-based deployment rather than treating it as an invariant.

Multiply APR or APY by 100 only when formatting it as a percentage. This implementation uses arbitrary-precision decimal arithmetic, makes the number of compounding periods explicit, and returns zero for a zero rate:

```javascript
import BigNumber from 'bignumber.js';

const WAD = new BigNumber(10).pow(18);
const DAYS_PER_YEAR = 365;

function annualizeRate(rateMantissa, configuredSlotsPerYear, slotsPerDay, dailyExponent = DAYS_PER_YEAR) {
  const ratePerSlot = new BigNumber(rateMantissa.toString()).div(WAD);
  const modelNormalizedApr = ratePerSlot.times(configuredSlotsPerYear.toString());
  const dailyRate = ratePerSlot.times(slotsPerDay.toString());
  const displayApr = dailyRate.times(DAYS_PER_YEAR);
  const apy = dailyRate.plus(1).pow(dailyExponent).minus(1);

  return {
    modelNormalizedAprPercentage: modelNormalizedApr.times(100),
    displayAprPercentage: displayApr.times(100),
    apyPercentage: apy.times(100),
  };
}

console.assert(annualizeRate(0n, 31_536_000n, 86_400n).apyPercentage.isZero());
```

Daily compounding is a display convention, not a promise that the contract compounds once per day or that the current rate will persist for a year. Base supply and borrow APY also exclude token incentives, Prime rewards, and other distribution programs unless those components are calculated separately.

For model selection and utilization formulas, see [Interest-rate models](../risk/interest-rate-model.md). Source boundaries used for this page are [`venus-protocol@v10.3.0`](https://github.com/VenusProtocol/venus-protocol/tree/46afc66b1dbd61a707d0a3492b3ec21bf90fc17a), [`isolated-pools@943e7db`](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95), the official frontend rate utilities at [`venus-protocol-interface@532895b`](https://github.com/VenusProtocol/venus-protocol-interface/tree/532895b508b3c7cc3ee94fcd6397978b9264d5ba/apps/evm/src/utilities), and the market API calculation at [`venus-protocol-api@d61125f`](https://github.com/VenusProtocol/venus-protocol-api/blob/d61125f1cccf3b36299a69cab1b09cced90ce1a5/src/modules/calculateInterestRates.ts).
