# BNB Core Interest Rate Models

Each BNB Core market stores its own interest-rate-model address. Model families and annualization constants have changed over time, so the market address and block determine the applicable implementation.

## Model selection

1. Read `interestRateModel()` from the vToken.
2. Identify whether the returned address is a model or a `CheckpointView` wrapper.
3. For a wrapper, resolve the active target at the relevant checkpoint.
4. Read `blocksPerYear` or `BLOCKS_PER_YEAR` from the effective model before annualizing a per-block rate.
5. Use the exact deployed ABI and parameters; do not infer them from the model family name.

At BNB Chain block `118,364,540`, the active vUSDC and vUSDT markets both pointed to `CheckpointView` `0x2CF0e211c99dFd28892cf80D142aA27a9042Dbf4`, whose active TwoKinks target exposed `BLOCKS_PER_YEAR = 70,080,000`.

{% hint style="warning" %}
Checkpoint wrappers can switch their underlying model at a configured timestamp while keeping the same address in the vToken. Historical rate reconstruction must resolve the target for the historical block, not only inspect the wrapper's current result.
{% endhint %}

## Model families

* [JumpRateModel](jumpmodel.md) — one kink and a jump slope.
* [TwoKinksInterestRateModel](twokinksinterestratemodel.md) — three curve segments separated by two kinks.
* [WhitePaperInterestRateModel](whitepapermodel.md) — older linear model; some unlisted markets retain balances or debt, so its legacy reference must remain available.

The previously published [InterestRateModelLens page](interestratemodellens.md) has no resolved canonical source or deployment and must not be treated as a supported integration address.

Current market addresses are listed in [Deployed Markets](../../../deployed-contracts/markets.md). For interest, exchange-rate, and APR/APY equations, see [Protocol Math](../../../guides/protocol-math.md).
