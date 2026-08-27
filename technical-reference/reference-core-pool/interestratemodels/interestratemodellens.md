# InterestRateModelLens — Unverified Legacy Reference

The former page described this function:

```solidity
function getNextInterestRates(
    uint256 cash,
    uint256 borrows,
    uint256 reserves,
    uint256 reserveFactorMantissa,
    uint256 badDebt,
    InterestRateModel interestRateModel
) external view returns (uint256 borrowRate, uint256 supplyRate)
```

No canonical source file, deployed address, supported network, or current consumer for `InterestRateModelLens` has been identified in the stable Venus repositories or deployment registries.

{% hint style="danger" %}
Do not assume this contract is deployed or supported. Simulate rates by calling the exact model selected by the target market, after resolving any `CheckpointView` wrapper. See [BNB Core Interest Rate Models](README.md).
{% endhint %}

This page is retained only to prevent old links from silently implying that the unverified ABI is current. It can be archived after integrations and ownership are conclusively ruled out.
