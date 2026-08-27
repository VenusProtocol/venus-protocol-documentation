# Protocol income, RiskFundV2, and bad-debt handling

Protocol income, risk-fund custody, and bad-debt recovery are separate processes. Risk-fund assets are protocol-controlled funds allocated by governance; they are not a per-user insurance policy, and their existence does not guarantee that every loss or bad-debt balance will be repaid.

## Current income path

Markets send withdrawn interest reserves and liquidation-related revenue to `ProtocolShareReserve` (PSR). PSR records income by Comptroller, asset, and one of two schemas:

* `PROTOCOL_RESERVES` for spread income; and
* `ADDITIONAL_REVENUE` for liquidation and other income.

PSR then distributes each schema according to its on-chain `distributionTargets`. Those targets and percentages are governance-controlled configuration, not fixed 50/50 constants. `releaseFunds(comptroller, assets)` is permissionless, but callers cannot choose the recipients or percentages.

The downstream path is chain- and configuration-specific. On BNB Chain mainnet, [VIP-620](https://app.venus.io/#/governance/proposal/620?chainId=56) and [VIP-621](https://app.venus.io/#/governance/proposal/621?chainId=56) replaced the legacy converter network with `TokenBuyback` instances. The risk-fund route is:

```text
markets → ProtocolShareReserve → RiskFundBuyback → RiskFundV2
```

`RiskFundBuyback` receives the risk-fund share of underlying assets, and an ACM-authorized finance process converts them through allowlisted routers. Its base asset is USDT, which it forwards to `RiskFundV2`. See [TokenBuyback](../whats-new/token-converter.md) for the conversion controls and migration details.

| BNB Chain mainnet component | Current role |
|---|---|
| [`ProtocolShareReserve`](https://bscscan.com/address/0xCa01D5A9A248a830E9D93231e791B1afFed7c446) | Active income accounting and distribution proxy. |
| [`RiskFundBuyback`](https://bscscan.com/address/0x0c71EFabD00329E839745ef23aB946d3ed24A805) | Active USDT buyback route whose destination is RiskFundV2. |
| [`RiskFundV2`](https://bscscan.com/address/0xdF31a28D68A2AB381D42b380649Ead7ae2A76E42) | Active protocol-fund custody proxy. It holds raw token balances and no longer maintains a per-pool reserve ledger. |
| [`Shortfall`](https://bscscan.com/address/0xf37530A8a810Fcb501AA0Ecd0B0699388F0F2209) | Deployed legacy auction and recovery proxy. New auction starts and restarts are paused on BNB Chain mainnet. |

The current BNB Chain mainnet `RiskFundV2` implementation removed `poolAssetsFunds`, `updatePoolState`, and `sweepTokenFromPool`. Its compatibility getter `getPoolsBaseAssetReserves(comptroller)` always returns zero; it must not be used as a current per-pool reserve balance. Governance can sweep raw ERC-20 balances. RiskFundV2 also retains `transferReserveForAuction`, which only the configured Shortfall address can call; it draws from the global raw USDT balance rather than a pool-attributed reserve. That compatibility surface does not make the paused auction system a current bad-debt workflow.

## How isolated-pool bad debt is recorded

An undercollateralized account does not become market bad debt merely because a shortfall is observed. In the isolated-pool lending engine, `healAccount(user)` is limited to an insolvent account whose total collateral does not exceed `minLiquidatableCollateral` and whose collateral-to-incentivized-borrow ratio does not exceed 100%. The call seizes all of the account's collateral vTokens. The caller receives the liquidator share, while each market's protocol seize share is redeemed to underlying and sent to PSR.

For each borrowed market, the caller then attempts the proportional repayment calculated from the account-wide collateral, borrows, and liquidation incentive. The vToken uses the amount actually transferred in: it removes the original borrow from the account and active `totalBorrows`, records `borrowBalance - actualRepayAmount` as market `badDebt`, and leaves the borrower's principal at zero. The written-off amount therefore no longer accrues as that borrower's debt.

This accounting can remain relevant to legacy isolated markets even though the standalone Isolated Pools product is deprecated. It does not mean the recorded market bad debt will be covered automatically.

## Legacy Shortfall auctions

Shortfall was designed to exchange a pool-attributed risk-fund reserve for bidder repayments of isolated-market bad debt. That design depended on the per-pool ledger removed from RiskFundV2.

As part of the joint VIP-620/VIP-621 migration, the BNB Chain mainnet Shortfall auctions were paused and the old converter path was retired. At BNB Chain mainnet block `118349571` (August 27, 2026, 08:12:46 UTC):

* `auctionsPaused()` returned `true`;
* all eight pools returned by PoolRegistry had auction status `NOT_STARTED`;
* `getPoolsBaseAssetReserves(comptroller)` returned zero for all eight pools; and
* the RiskFundV2 proxy held one global raw USDT balance rather than eight attributed balances.

The same snapshot found nonzero `badDebt()` in nine isolated vTokens. No active auction therefore does not mean no legacy market bad debt.

Do not approve tokens to Shortfall or call `startAuction`, `restartAuction`, or `placeBid` based on the old workflow. The pause is governance-controlled, however, and historical transfer debt can still require the `claimTokenDebt` recovery function. See [Shortfall and auctions](../technical-reference/reference-technical-articles/shortfall-and-auctions.md) for the dated historical design and recovery boundaries.

## Current bad-debt response

There is no universal on-chain function that automatically applies RiskFundV2 to every Venus bad-debt balance. Core Pool and isolated-pool accounting differ, and any use of protocol funds for recovery requires an explicit, scope-specific governance or operational action. Before describing a debt as covered, verify the relevant market state, asset balances, executed governance proposal, and on-chain repayment or recovery transaction.

For current integration work, verify all of the following rather than relying on historical architecture diagrams:

* PSR `distributionTargets` and percentages for the relevant chain and schema;
* the identity and configuration of each downstream income destination;
* RiskFundV2 raw token balances, owner, base asset, and configured Shortfall address;
* Shortfall pause and per-pool auction state, plus any `tokenDebt` owed to a historical bidder; and
* each affected market's `badDebt` balance and the governance actions that address it.

Contract addresses are listed under [Deployed Contracts → Funds](../deployed-contracts/funds.md). The current source boundaries used by this page are [`protocol-reserve@eaed4e3`](https://github.com/VenusProtocol/protocol-reserve/tree/eaed4e323edd44bf87b5be1e56522fc772cb5990) and [`isolated-pools@943e7db`](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95).
