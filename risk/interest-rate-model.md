# Interest-rate models

{% hint style="info" %}
**This is a model-selection overview, not a per-market configuration registry.** Each market points to a deployment-specific interest-rate-model contract that governance can replace. Resolve the model address, implementation family, parameters, and clock at the target chain and block before using a formula.
{% endhint %}

An interest-rate model converts market utilization into borrow and supply rates. Venus deployments include WhitePaper, Jump Rate, and Two Kinks model families. That list describes model families found in current and legacy deployments; it does not mean that every family is active on every chain or that those are the only possible future implementations.

The vToken's `interestRateModel()` getter is the source of truth for which model address a market used at a particular block. Governance can replace that address, and some model parameters can also be updated without replacing the model. Static documentation must not be used as a current market-to-model registry.

## Clock and rate units

Rates are `1e18`-scaled mantissas per accrual slot. The meaning of a slot depends on the deployed architecture:

* BNB Chain mainnet Core vTokens use block-based accrual and expose per-block rates; and
* modern TimeManager-based vTokens and interest-rate models can be configured as block-based or time-based, where a time-based slot is one second.

Modern contracts retain ABI names such as `borrowRatePerBlock()` for compatibility even when the implementation describes the value as a per-slot rate. Read `isTimeBased()` and `blocksOrSecondsPerYear()` where the implementation exposes them. For a Core model that does not implement TimeManager, verify its deployed `blocksPerYear` assumption. Never infer the annualization unit from the function name alone.

## Utilization depends on the engine

Let:

* `C` be market cash;
* `B` be active borrows;
* `R` be reserves; and
* `D` be recorded bad debt.

BNB Chain mainnet Core Jump Rate and WhitePaper models use:

$$
u = \frac{B}{C + B - R}
$$

The Core Two Kinks implementation caps that ratio at one:

$$
u_{twoKinks} = \min\left(1, \frac{B}{C + B - R}\right)
$$

Modern isolated-engine models include bad debt in borrow utilization:

$$
u_{borrow} = \min\left(1, \frac{B + D}{C + B + D - R}\right)
$$

Because bad debt does not accrue interest or produce supplier income, the corresponding supply utilization is:

$$
u_{supply} = \frac{B}{C + B + D - R}
$$

For those models, if `r_b` is the borrow rate per slot and `f` is the reserve factor:

$$
r_s = r_b \times u_{supply} \times (1 - f)
$$

Do not add `badDebt` to a Core formula that does not accept it, or omit it from a modern model that does. Inspect the exact ABI and source used by the target vToken.

## WhitePaper model

The WhitePaper model has one linear borrow-rate slope. With per-slot base rate `b` and multiplier `m`:

$$
r_b(u) = b + m \times u
$$

The model constructor derives its per-slot values from annualized inputs and its configured slots-per-year assumption. An old WhitePaper deployment can remain relevant to an unlisted market with positions, so the family name alone is not evidence that a market can be ignored or archived.

## Jump Rate model

The Jump Rate model uses one slope below a utilization kink and a steeper, separately configured slope above it. With kink `k`, normal multiplier `m`, and jump multiplier `j`:

$$
r_b(u) =
\begin{cases}
b + m \times u, & u \leq k \\
b + m \times k + j \times (u-k), & u > k
\end{cases}
$$

The names `baseRatePerBlock`, `multiplierPerBlock`, and `jumpMultiplierPerBlock` are retained in some modern contracts even when TimeManager makes them per-second values. Treat the deployed clock configuration, rather than the storage-variable name, as authoritative.

## Two Kinks model

The Two Kinks family divides utilization into three segments around `kink1` and `kink2`. It supports a separately configured slope in each segment, including an increasing or decreasing middle segment, and then a final jump slope above the second kink.

Do not approximate a Two Kinks deployment as a one-kink Jump Rate model. Read both kink points, all slope and base components, the time basis, and the exact implementation. Existing general-design articles are not a substitute for the deployed model source and state.

## Integration checklist

For a rate or APY calculation at a historical or current block, record:

* chain, pool, Comptroller, and vToken address;
* the vToken implementation and `interestRateModel()` address at that block;
* the model implementation family and parameter values;
* whether the accrual slot is a block or a second, plus slots per year;
* cash, active borrows, reserves, bad debt where applicable, and reserve factor; and
* whether the displayed result adds rewards or other incentives to the base supply or borrow rate.

The [deployed markets](../deployed-contracts/markets.md) page helps locate markets but is not a complete historical model/version map. For mantissa conversion, checkpoint behavior, and APR/APY display math, see [Protocol math](../guides/protocol-math.md).

Current source boundaries used for the architecture distinctions on this page are [`venus-protocol@v10.3.0`](https://github.com/VenusProtocol/venus-protocol/tree/46afc66b1dbd61a707d0a3492b3ec21bf90fc17a/contracts/InterestRateModels) and [`isolated-pools@943e7db`](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95/contracts).
