# Shortfall

{% hint style="warning" %}
**Legacy auction and recovery contract on BNB Chain mainnet.** The standalone Isolated Pools product is deprecated. At BNB Chain mainnet block `118349571` (August 27, 2026, 08:12:46 UTC), `auctionsPaused()` was `true`, and all eight pools returned by PoolRegistry had auction status `NOT_STARTED`.

Do not approve tokens to Shortfall or call `startAuction`, `restartAuction`, or `placeBid` based on this reference. The pause is governance-controlled rather than an irreversible contract retirement. A historical user should consider only the separately verified `claimTokenDebt` recovery path described below.
{% endhint %}

The BNB Chain mainnet contracts at the snapshot were:

| Contract | Address |
|---|---|
| Shortfall proxy | [`0xf37530A8a810Fcb501AA0Ecd0B0699388F0F2209`](https://bscscan.com/address/0xf37530A8a810Fcb501AA0Ecd0B0699388F0F2209) |
| Current implementation | [`0x4F41EcAce160f6ef893102D64f84E8040c06d8B0`](https://bscscan.com/address/0x4F41EcAce160f6ef893102D64f84E8040c06d8B0) |
| Configured RiskFundV2 | [`0xdF31a28D68A2AB381D42b380649Ead7ae2A76E42`](https://bscscan.com/address/0xdF31a28D68A2AB381D42b380649Ead7ae2A76E42) |

The source boundary for this API is [`isolated-pools@943e7db`](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95/contracts/Shortfall). For the corrected historical calculations and auction-event discovery rules, see [Shortfall and auctions](../../reference-technical-articles/shortfall-and-auctions.md).

## Historical design

Shortfall was designed to exchange a pool-attributed risk-fund reserve for bidder payments of isolated-market bad debt. Two auction types existed:

```solidity
enum AuctionType {
    LARGE_POOL_DEBT,
    LARGE_RISK_FUND
}

enum AuctionStatus {
    NOT_STARTED,
    STARTED,
    ENDED
}
```

In a `LARGE_POOL_DEBT` auction, bidders competed by paying an increasing fraction of every market's snapshotted bad debt for the complete seized risk-fund amount. In a `LARGE_RISK_FUND` auction, bidders paid every market's complete snapshotted debt and competed by requesting a decreasing fraction of the seized risk fund.

RiskFundV2 no longer holds a per-pool ledger, and `getPoolsBaseAssetReserves(comptroller)` now always returns zero. Together with the BNB Chain mainnet pause, this makes the auction mechanism a legacy compatibility surface rather than the current bad-debt process.

## Auction state

The internal struct is:

```solidity
struct Auction {
    uint256 startBlockOrTimestamp;
    AuctionType auctionType;
    AuctionStatus status;
    VToken[] markets;
    uint256 seizedRiskFund;
    address highestBidder;
    uint256 highestBidBps;
    uint256 highestBidBlockOrTimestamp;
    uint256 startBidBps;
    mapping(VToken => uint256) marketDebt;
    mapping(VToken => uint256) bidAmount;
}
```

### auctions

```solidity
function auctions(
    address comptroller
) external view returns (
    uint256 startBlockOrTimestamp,
    AuctionType auctionType,
    AuctionStatus status,
    uint256 seizedRiskFund,
    address highestBidder,
    uint256 highestBidBps,
    uint256 highestBidBlockOrTimestamp,
    uint256 startBidBps
);
```

The generated public getter exposes only the eight scalar values above. It does not return `markets`, `marketDebt`, or `bidAmount`. A historical integration must obtain the market array and debt snapshot from the matching `AuctionStarted` event; the current `Comptroller.getAllMarkets()` result is not a substitute for an old auction snapshot.

### Other state getters

```solidity
function poolRegistry() external view returns (address);

function riskFund() external view returns (address);

function minimumPoolBadDebt() external view returns (uint256);

function incentiveBps() external view returns (uint256);

function nextBidderBlockLimit() external view returns (uint256);

function waitForFirstBidder() external view returns (uint256);

function auctionsPaused() external view returns (bool);
```

The numeric parameters are deployment and governance state. Values historically described as 1,000 USD, 1,000 bps, or 100 blocks are not universal constants.

## Block-or-timestamp mode

Shortfall inherits deployment-specific time management:

```solidity
function isTimeBased() external view returns (bool);

function blocksOrSecondsPerYear() external view returns (uint256);

function getBlockNumberOrTimestamp() external view returns (uint256);
```

When `isTimeBased()` is false, auction slots and bidder limits use block numbers. When it is true, the corresponding values use timestamps and seconds. This is why the struct and ABI use `startBlockOrTimestamp` and `highestBidBlockOrTimestamp` rather than the old `startBlock` and `highestBidBlock` names.

## Initialization

```solidity
function initialize(
    address riskFund_,
    uint256 minimumPoolBadDebt_,
    address accessControlManager_
) external;
```

The initializer requires a nonzero RiskFund address and a nonzero minimum bad-debt value, then initializes ownership, ACM, reentrancy protection, transfer-debt tracking, auction defaults, and the RiskFund link. The implementation contract itself has initializers disabled.

## Legacy auction entry points

These functions remain in the deployed ABI. They are documented for compatibility and incident analysis, not as participation instructions.

### startAuction

```solidity
function startAuction(address comptroller) external;
```

Historically permissionless. It reverts while `auctionsPaused()` is true. When enabled, it verifies the PoolRegistry entry, snapshots every market's `badDebt`, updates oracle prices, requires total USD bad debt to meet `minimumPoolBadDebt`, and reads the pool reserve through RiskFundV2's compatibility getter.

### restartAuction

```solidity
function restartAuction(address comptroller) external;
```

Historically permissionless. It reverts while auctions are paused and also requires a `STARTED` auction with no bidder that has become stale. Restarting ends the prior instance, reruns oracle updates, and recomputes the auction valuation, market-debt snapshot, start bid, and seized reserve amount at a new block or timestamp.

### placeBid

```solidity
function placeBid(
    address comptroller,
    uint256 bidBps,
    uint256 auctionStartBlockOrTimestamp
) external;
```

The third argument must equal the auction's current `startBlockOrTimestamp`; it is not `startBidBps`. `bidBps` must be between 1 and 10,000. A first `LARGE_POOL_DEBT` bid must meet or exceed `startBidBps`, and later bids must strictly increase the highest bid. A first `LARGE_RISK_FUND` bid must meet or fall below `startBidBps`, and later bids must strictly decrease the highest bid.

Historically, for each market in the auction snapshot:

* `LARGE_POOL_DEBT` pulled `floor(marketDebt × bidBps / 10_000)` of the underlying token;
* `LARGE_RISK_FUND` pulled the complete snapshotted `marketDebt` of the underlying token; and
* the bidder had to separately approve the Shortfall proxy for every required underlying token.

The contract recorded the actual balance increase as `bidAmount`. When a better bid replaced the previous bidder, Shortfall tried to return each deposited token; a failed outgoing transfer was recorded as claimable `tokenDebt`.

`placeBid` does not check `auctionsPaused`. It could operate only on an auction that was already `STARTED`, had the matching identifier, and was not stale. The recorded snapshot confirmed that no registered BNB Chain mainnet pool was in that state.

### closeAuction

```solidity
function closeAuction(address comptroller) external;
```

Historically permissionless. It required a `STARTED` auction, a nonzero highest bidder, and a current block or timestamp strictly greater than `highestBidBlockOrTimestamp + nextBidderBlockLimit`. It then:

1. marks the auction `ENDED`;
2. transfers each winning `bidAmount` to its vToken;
3. calls `badDebtRecovered` with the vToken's actual underlying balance increase;
4. requests the winning payout from RiskFundV2; and
5. transfers the base asset to the winner or records `tokenDebt` if that outgoing transfer fails.

`closeAuction` does not check `auctionsPaused`; pausing alone does not prove that no existing auction needs completion. The separate all-pool state read at the top of this page established that boundary for the recorded BNB Chain mainnet block.

## Historical transfer-debt recovery

Shortfall inherits `TokenDebtTracker`. It records an outgoing token transfer as debt when the contract has enough balance but the recipient transfer fails. This can occur when returning an outbid participant's underlying tokens or paying the auction winner.

### tokenDebt

```solidity
function tokenDebt(
    address token,
    address user
) external view returns (uint256);
```

Returns the amount of `token` owed to `user`.

### totalTokenDebt

```solidity
function totalTokenDebt(
    address token
) external view returns (uint256);
```

Returns the aggregate recorded debt for a token. It helps distinguish tokens owed to users from other token balances held by Shortfall.

### claimTokenDebt

```solidity
function claimTokenDebt(
    address token,
    uint256 amount
) external;
```

Claims only `msg.sender`'s recorded debt. Pass the exact amount to claim partially, or `type(uint256).max` to claim the caller's complete recorded amount. The call reverts if a non-max amount exceeds `tokenDebt(token, msg.sender)` or if the final token transfer fails. No third party can redirect another user's claim.

Before claiming, verify the full token address, `tokenDebt(token, yourAddress)`, the Shortfall token balance, and the explorer proxy/implementation. No token approval is required.

At the snapshot block, Shortfall held zero balance and reported zero `totalTokenDebt` for each of the 27 scanned unique underlying tokens represented by 35 `getAllMarkets()` entries across eight PoolRegistry pools. Of those entries, 34 were listed and one was unlisted. Native BNB was also zero. Token and beneficiary sets are not enumerable, so this does not prove that every arbitrary token address has zero debt; it does show that the current registered-market underlying set had no recorded transfer debt.

## Governance configuration

| Function | Access | Effect |
|---|---|---|
| `updateNextBidderBlockLimit(uint256)` | ACM | Updates the blocks-or-seconds interval after the latest bid. Value must be nonzero. |
| `updateIncentiveBps(uint256)` | ACM | Updates the bidder incentive. Value must be nonzero; 10% is not a source-enforced maximum. |
| `updateMinimumPoolBadDebt(uint256)` | ACM | Updates the USD threshold for starting an auction. |
| `updateWaitForFirstBidder(uint256)` | ACM | Updates the blocks-or-seconds interval before a no-bid auction is stale. |
| `updatePoolRegistry(address)` | Owner | Updates the PoolRegistry; the address must be nonzero. |
| `pauseAuctions()` | ACM | Prevents new starts and restarts. Reverts if already paused. |
| `resumeAuctions()` | ACM | Clears the pause. Reverts if already active. |

The presence of `resumeAuctions` means the pause is reversible through governance permissions. The separate RiskFundV2 per-pool getter behavior and deprecated-product policy must also be considered before treating a resumed selector as a supported workflow.

Keep this contract reference until historical `tokenDebt`, Shortfall token balances, all auction states, market bad-debt balances, and any governance recovery duties have been resolved. Do not infer that those obligations are zero from the pause flag alone.
