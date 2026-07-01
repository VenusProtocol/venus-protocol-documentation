# Glossary

A reference for terms used throughout the Venus Protocol documentation.

### Supply Cap

A **supply cap** is the maximum total amount of an asset that can be supplied to a given market. Each market has its own cap, set per asset.

**What it does**

The supply cap limits how much of an asset the protocol will accept as supply (minted into vTokens). Once a market's total supply reaches its cap, any new supply transaction for that asset reverts. The restriction applies only to new supply — existing positions are not affected, and suppliers can still withdraw or interact with their funds as usual. A supply cap of `0` disables new supply for that market entirely.

**Why Venus uses it**

Supply caps are a risk-management tool. By bounding how much of any single asset the protocol holds, they limit the protocol's exposure to that asset and contain the blast radius of a problem in any one market — for example a price manipulation, a sudden liquidity crunch, or a wave of liquidations. Caps also give governance and risk stewards a lever to tune exposure as market conditions change, including automated adjustments via Chaos Labs Risk Oracles and Risk Stewards.

**See also:** [Risk Oracles and Risk Stewards](../risk/risk-oracle-and-risk-stewards.md)
