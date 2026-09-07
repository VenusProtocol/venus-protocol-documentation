# Leveraged Positions: Boost and Repay with Collateral

Boost and Repay with Collateral let users open or reduce leveraged Core Pool positions in a single transaction where the feature is available. Both operations use a flash loan internally, but the resulting position is an ordinary supplied-and-borrowed Venus position. It accrues interest and can be liquidated.

{% hint style="warning" %}
**Version and deployment boundary (BNB Chain).** The behavior in this guide is mapped to `venus-periphery` source commit `c11d10190fb20394a4529872be3aebf34de0db4c` and its committed `deployments/bscmainnet/LeverageStrategiesManager_Implementation.json` artifact. That artifact records candidate implementation `0xB8c418eFf558D7eE517b8f26B5Eb0F4f3c53F5D5`, deployed at block `105684846`, for proxy `0x03F079E809185a669Ca188676D0ADb09cbAd6dC1`.

An artifact and deployment receipt do not prove which implementation or configuration the proxy currently uses. Before acting on this guide, verify at one recorded BNB Chain block the proxy implementation and code hash, owner and ACM permissions, flash-loan authorization and pause state, supported markets, per-market flash-loan configuration, and SwapHelper.
{% endhint %}

The source-and-artifact-mapped implementation uses one flash loan per operation. It does not repeat an internal borrow-swap-supply loop.

> Boost and Repay with Collateral are high-risk, money-moving operations. Check the selected markets, fee, minimum swap output, resulting debt, and projected health factor before signing. Leave a safety buffer rather than targeting the displayed maximum.

## Boost

Boost increases a user's supplied collateral and borrow balance in one atomic transaction.

### How Boost works

For a cross-asset Boost, the leverage manager:

1. Takes one flash loan of the selected borrowed asset.
2. Swaps that asset into the selected collateral asset through the configured swap helper.
3. Supplies the received collateral to Venus on behalf of the user.
4. Borrows the flash-loan fee on behalf of the user and uses it for settlement.
5. Allows the unpaid flash-loan principal to become the user's ordinary borrow balance.
6. Checks the user's borrowing power after the operation.

For a same-asset Boost, the swap step is omitted: the flash-loaned asset is supplied directly as collateral. The fee is still borrowed on behalf of the user, and the principal still becomes ordinary debt.

The user must authorize the leverage manager as a delegate. The operation also depends on current market listing, pause state, oracle prices, collateral factors, caps, available cash, token behavior, and, for cross-asset Boost, the minimum swap output.

The transaction is atomic: if a required check or external call reverts, the state changes made by that operation roll back. Transaction gas is still paid. Token approvals or delegation transactions submitted earlier remain in effect.

### Supported markets

Use only markets offered by the Boost interface. The source-and-artifact-mapped manager rejects `vBNB`, the native BNB Core Pool market; verify the live proxy and interface before relying on that support boundary. Do not treat a reference to BNB as support for `vBNB`; a wrapped-token market, if offered, is a different market.

## Repay with Collateral

Repay with Collateral reduces debt using one selected supplied asset, without requiring the borrowed asset to be held in the user's wallet before the operation.

The source-and-artifact-mapped manager processes one collateral market and one borrowed market per transaction:

1. It takes a flash loan of the borrowed asset.
2. It repays up to the selected amount of the user's debt.
3. It redeems the selected collateral on behalf of the user.
4. If the collateral and borrowed assets differ, it swaps the redeemed collateral into the borrowed asset.
5. It requires the resulting funds to cover the flash-loan settlement and fee.
6. It checks the user's borrowing power after the operation and returns any positive token-balance delta produced by that operation to the initiator.

Repay with Collateral can revert if delegation, redemption, market liquidity, the swap quote, slippage, flash-loan settlement, or the final safety check fails. A maximally leveraged position is not guaranteed to be fully closable with any selected collateral or quote.

## Estimating a Boost amount

There is no single formula that produces a safe Boost amount for every account or market. The result depends on the whole account and current market configuration, including:

* collateral and borrowed-asset prices;
* collateral factors and liquidation thresholds;
* existing supplies and borrows;
* the flash-loan fee and token-unit rounding;
* borrow and supply caps;
* available market cash and accrued interest; and
* quoted swap output, price impact, and slippage for cross-asset Boost.

For a simplified same-asset example, let:

* `S` be the existing supplied amount;
* `D` be the existing debt;
* `c` be the collateral factor;
* `B` be the flash-loan principal used for Boost; and
* `r` be the flash-loan fee rate for that market.

After the operation, the simplified balances are:

```text
New supply = S + B
Flash-loan fee = r × B
New debt = D + B + (r × B)
```

The collateral-factor constraint is therefore:

```text
c × (S + B) >= D + B + (r × B)
```

Solving only this simplified constraint gives an algebraic boundary:

```text
B <= (c × S - D) / (1 - c + r)
```

This boundary is not a recommended amount. It has no execution or liquidation buffer and does not include the other constraints listed above. Health factor also uses liquidation thresholds, while borrowing power uses collateral factors; they are not interchangeable.

### Example: same-asset USDT Boost

Assume only for this example:

* 100 USDT supplied and enabled as collateral;
* 20 USDT already borrowed;
* an 80% collateral factor; and
* an illustrative 0.09% flash-loan fee.

The unused borrowing power before Boost is:

```text
(100 × 0.8) - 20 = 60 USDT
```

The fee-omitting calculation `60 / (1 - 0.8) = 300 USDT` is not safe. Even with a zero fee, it lands exactly on the collateral-factor boundary. With the illustrative 0.09% fee:

```text
Fee on 300 USDT = 0.27 USDT
Supply after Boost = 100 + 300 = 400 USDT
Debt after Boost = 20 + 300 + 0.27 = 320.27 USDT
Collateral-factor capacity = 400 × 0.8 = 320 USDT
```

The resulting debt exceeds the simplified borrowing capacity, so the operation should revert rather than create the advertised position.

The fee-aware algebraic boundary is approximately:

```text
60 / (1 - 0.8 + 0.0009) = 298.65604778 USDT
```

That value still lands on the simplified boundary and should not be used as a target. Choose a lower amount, keep a meaningful safety margin, and verify the final wallet simulation before signing. An interface preview is an estimate, not an execution or liquidation guarantee.

## Risks

### Liquidation risk

Leverage magnifies losses and reduces the distance to liquidation. Under the interface convention, a health factor at or below 1 is the liquidation boundary. A health factor near 1, including below 1.1, means the position has a thin buffer; 1.1 is not itself the liquidation trigger.

Monitor health factor after execution. Price moves, interest accrual, and oracle updates can make a previously valid position liquidatable.

### Amplified price exposure

If one asset drives the entire exposure, debt is fixed, and liquidation has not intervened, a 10% adverse asset move produces an approximate `10% × leverage` loss of starting equity. This simplified relationship is not a prediction: cross-asset correlations, interest, fees, swaps, and liquidation materially change outcomes.

### Swap and execution risk

Cross-asset operations depend on external swap execution. High price impact, insufficient output, token behavior, or an external-call failure can revert the transaction. A revert rolls back that operation, but the user pays gas, and earlier approvals or delegations remain active until revoked.

### Oracle and market risk

Oracle prices, market cash, caps, pause state, and interest rates can change. Oracle problems can cause a failed operation or unexpected liquidation. High or rising borrow rates can make a leveraged strategy unprofitable even when asset prices do not move.

## Safer operating practices

* Use only funds you can afford to lose.
* Confirm the exact collateral and borrowed markets; do not assume native BNB support.
* Leave a safety margin instead of selecting the maximum.
* Review fee, minimum swap output, debt, collateral, and health factor before signing.
* Monitor health factor and borrow rates after execution.
* Revoke approvals or delegation when they are no longer needed.
