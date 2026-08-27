# BNB Core Pool Facets

Facets contain the BNB Core Pool Comptroller's application logic. They are reached through chained delegate calls from the Unitroller and Diamond.

At BNB Chain block `118,363,255`, the selector map installed by [VIP-640](https://venus.io/governance/proposal/640?chainId=56) was:

| Facet | Responsibility | Live address | Reference |
| --- | --- | --- | --- |
| MarketFacet | Market membership, account delegation, liquidity and pool views | `0x21f8E1471b153f49BE1d645A008E4a57434eEd23` | [API](market-facet.md) |
| PolicyFacet | vToken policy hooks and liquidity checks | `0x8930B02c69EDd37464B50991680D306Bb9B8FDBD` | [API](policy-facet.md) |
| RewardFacet | XVS accrual, claim and seizure flows | `0x9e0CCD70b5E0030472D5013bbBd37B6E868d416f` | [API](reward-facet.md) |
| SetterFacet | Risk, oracle, pause, cap, pool and feature configuration | `0xbc4885e5A27050E321d094503597aC6734AB1871` | [API](setter-facet.md) |
| FlashLoanFacet | Multi-market flash-loan execution | `0xAC54A4D148690b7FDA22B1D29c4439aCBF668fb2` | [API](flashLoan-facet.md) |

`FacetBase` is inherited shared logic and storage, not a separate runtime facet. It defines `ComptrollerV19Storage` access helpers such as admin-only, admin-or-guardian, and signature-specific Access Control Manager checks.

{% hint style="danger" %}
Always call facet selectors through the Unitroller. Never send an application call directly to a facet address. Query `facetAddress(bytes4)` before relying on a selector, because governance can replace or remove individual assignments.
{% endhint %}
