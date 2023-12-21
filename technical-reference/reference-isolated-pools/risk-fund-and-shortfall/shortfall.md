# Shortfall

Shortfall is an auction contract designed to auction off the `convertibleBaseAsset` accumulated in `RiskFund`. The `convertibleBaseAsset`
is auctioned in exchange for users paying off the pool's bad debt. An auction can be started by anyone once a pool's bad debt has reached a minimum value.
This value is set and can be changed by the authorized accounts. If the pool’s bad debt exceeds the risk fund plus a 10% incentive, then the auction winner
is determined by who will pay off the largest percentage of the pool's bad debt. The auction winner then exchanges for the entire risk fund. Otherwise,
if the risk fund covers the pool's bad debt plus the 10% incentive, then the auction winner is determined by who will take the smallest percentage of the
risk fund in exchange for paying off all the pool's bad debt.

# Solidity API

```solidity
enum AuctionType {
  LARGE_POOL_DEBT,
  LARGE_RISK_FUND
}
```

```solidity
enum AuctionStatus {
  NOT_STARTED,
  STARTED,
  ENDED
}
```

```solidity
struct Auction {
  uint256 startBlock;
  enum Shortfall.AuctionType auctionType;
  enum Shortfall.AuctionStatus status;
  contract VToken[] markets;
  uint256 seizedRiskFund;
  address highestBidder;
  uint256 highestBidBps;
  uint256 highestBidBlock;
  uint256 startBidBps;
  mapping(contract VToken => uint256) marketDebt;
  mapping(contract VToken => uint256) bidAmount;
}
```

### poolRegistry

Pool registry address

```solidity
address poolRegistry
```

---

### riskFund

Risk fund address

```solidity
contract IRiskFund riskFund
```

---

### minimumPoolBadDebt

Minimum USD debt in pool for shortfall to trigger

```solidity
uint256 minimumPoolBadDebt
```

---

### incentiveBps

Incentive to auction participants, initial value set to 1000 or 10%

```solidity
uint256 incentiveBps
```

---

### nextBidderBlockLimit

Time to wait for next bidder. Initially waits for 100 blocks

```solidity
uint256 nextBidderBlockLimit
```

---

### auctionsPaused

Boolean of if auctions are paused

```solidity
bool auctionsPaused
```

---

### waitForFirstBidder

Time to wait for first bidder. Initially waits for 100 blocks

```solidity
uint256 waitForFirstBidder
```

---

### auctions

Auctions for each pool

```solidity
mapping(address => struct Shortfall.Auction) auctions
```

---

### initialize

Initialize the shortfall contract

```solidity
function initialize(contract IRiskFund riskFund_, uint256 minimumPoolBadDebt_, address accessControlManager_) external
```

#### Parameters

| Name                   | Type               | Description                                                |
| ---------------------- | ------------------ | ---------------------------------------------------------- |
| riskFund\_             | contract IRiskFund | RiskFund contract address                                  |
| minimumPoolBadDebt\_   | uint256            | Minimum bad debt in base asset for a pool to start auction |
| accessControlManager\_ | address            | AccessControlManager contract address                      |

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when convertible base asset address is zero
- ZeroAddressNotAllowed is thrown when risk fund address is zero

---

### placeBid

Place a bid greater than the previous in an ongoing auction

```solidity
function placeBid(address comptroller, uint256 bidBps, uint256 auctionStartBlock) external
```

#### Parameters

| Name              | Type    | Description                                                            |
| ----------------- | ------- | ---------------------------------------------------------------------- |
| comptroller       | address | Comptroller address of the pool                                        |
| bidBps            | uint256 | The bid percent of the risk fund or bad debt depending on auction type |
| auctionStartBlock | uint256 | The block number when auction started                                  |

#### 📅 Events

- Emits BidPlaced event on success

---

### closeAuction

Close an auction

```solidity
function closeAuction(address comptroller) external
```

#### Parameters

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| comptroller | address | Comptroller address of the pool |

#### 📅 Events

- Emits AuctionClosed event on successful close

---

### startAuction

Start a auction when there is not currently one active

```solidity
function startAuction(address comptroller) external
```

#### Parameters

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| comptroller | address | Comptroller address of the pool |

#### 📅 Events

- Emits AuctionStarted event on success
- Errors if auctions are paused

---

### restartAuction

Restart an auction

```solidity
function restartAuction(address comptroller) external
```

#### Parameters

| Name        | Type    | Description         |
| ----------- | ------- | ------------------- |
| comptroller | address | Address of the pool |

#### 📅 Events

- Emits AuctionRestarted event on successful restart

---

### updateNextBidderBlockLimit

Update next bidder block limit which is used determine when an auction can be closed

```solidity
function updateNextBidderBlockLimit(uint256 _nextBidderBlockLimit) external
```

#### Parameters

| Name                   | Type    | Description                 |
| ---------------------- | ------- | --------------------------- |
| \_nextBidderBlockLimit | uint256 | New next bidder block limit |

#### 📅 Events

- Emits NextBidderBlockLimitUpdated on success

#### ⛔️ Access Requirements

- Restricted by ACM

---

### updateIncentiveBps

Updates the incentive BPS

```solidity
function updateIncentiveBps(uint256 _incentiveBps) external
```

#### Parameters

| Name           | Type    | Description       |
| -------------- | ------- | ----------------- |
| \_incentiveBps | uint256 | New incentive BPS |

#### 📅 Events

- Emits IncentiveBpsUpdated on success

#### ⛔️ Access Requirements

- Restricted by ACM

---

### updateMinimumPoolBadDebt

Update minimum pool bad debt to start auction

```solidity
function updateMinimumPoolBadDebt(uint256 _minimumPoolBadDebt) external
```

#### Parameters

| Name                 | Type    | Description                                                    |
| -------------------- | ------- | -------------------------------------------------------------- |
| \_minimumPoolBadDebt | uint256 | Minimum bad debt in the base asset for a pool to start auction |

#### 📅 Events

- Emits MinimumPoolBadDebtUpdated on success

#### ⛔️ Access Requirements

- Restricted by ACM

---

### updateWaitForFirstBidder

Update wait for first bidder block count. If the first bid is not made within this limit, the auction is closed and needs to be restarted

```solidity
function updateWaitForFirstBidder(uint256 _waitForFirstBidder) external
```

#### Parameters

| Name                 | Type    | Description                           |
| -------------------- | ------- | ------------------------------------- |
| \_waitForFirstBidder | uint256 | New wait for first bidder block count |

#### 📅 Events

- Emits WaitForFirstBidderUpdated on success

#### ⛔️ Access Requirements

- Restricted by ACM

---

### updatePoolRegistry

Update the pool registry this shortfall supports

```solidity
function updatePoolRegistry(address poolRegistry_) external
```

#### Parameters

| Name           | Type    | Description                       |
| -------------- | ------- | --------------------------------- |
| poolRegistry\_ | address | Address of pool registry contract |

#### 📅 Events

- Emits PoolRegistryUpdated on success

#### ⛔️ Access Requirements

- Restricted to owner

#### ❌ Errors

- ZeroAddressNotAllowed is thrown when pool registry address is zero

---

### pauseAuctions

Pause auctions. This disables starting new auctions but lets the current auction finishes

```solidity
function pauseAuctions() external
```

#### 📅 Events

- Emits AuctionsPaused on success

#### ⛔️ Access Requirements

- Restricted by ACM

#### ❌ Errors

- Errors is auctions are paused

---

### resumeAuctions

Resume paused auctions.

```solidity
function resumeAuctions() external
```

#### 📅 Events

- Emits AuctionsResumed on success

#### ⛔️ Access Requirements

- Restricted by ACM

#### ❌ Errors

- Errors is auctions are active

---
