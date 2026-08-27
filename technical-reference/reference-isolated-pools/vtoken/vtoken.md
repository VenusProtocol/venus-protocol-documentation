# VToken API

The [`VToken` v4.4.0 source](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/VToken.sol) is the current source family for modern markets outside BNB Chain. The BNB Chain beacon uses the earlier implementation recorded in the [engine version map](../README.md#mainnet-implementation-map); verify its ABI before using v4.4.0-only functions such as `internalCash` or `syncCash`.

## Construction and initialization

The implementation constructor fixes three immutables:

```solidity
constructor(
    bool timeBased,
    uint256 blocksPerYear,
    uint256 maxBorrowRateMantissa
)
```

When `timeBased` is true, `blocksPerYear` must be zero and the clock uses `31,536,000` seconds/year. A block-based implementation requires a nonzero blocks/year value.

Each market proxy is initialized once:

```solidity
struct RiskManagementInit {
    address shortfall;
    address payable protocolShareReserve;
}

function initialize(
    address underlying,
    ComptrollerInterface comptroller,
    InterestRateModel interestRateModel,
    uint256 initialExchangeRateMantissa,
    string name,
    string symbol,
    uint8 decimals,
    address admin,
    address accessControlManager,
    RiskManagementInit riskManagement,
    uint256 reserveFactorMantissa
) external;
```

The implementation and initializer are separate version inputs: the beacon selects code, while the proxy holds market-specific state.

## Supply and redeem

| Function | Payer / owner | Recipient |
|---|---|---|
| `mint(mintAmount)` | caller pays underlying | caller receives VTokens |
| `mintBehalf(minter, mintAmount)` | **caller pays underlying** | `minter` receives VTokens |
| `redeem(redeemTokens)` | caller burns VTokens | caller receives underlying |
| `redeemUnderlying(redeemAmount)` | caller burns the calculated VTokens | caller receives underlying |
| `redeemBehalf(redeemer, redeemTokens)` | `redeemer`'s VTokens are burned | approved delegate caller receives underlying |
| `redeemUnderlyingBehalf(redeemer, redeemAmount)` | `redeemer`'s VTokens are burned | approved delegate caller receives underlying |

The delegated redeem functions require `Comptroller.approvedDelegates(redeemer, caller)`. VToken ERC-20 allowance is not a substitute.

## Borrow and repay

| Function | Effect |
|---|---|
| `borrow(amount)` | caller receives underlying and records debt on the caller |
| `borrowBehalf(borrower, amount)` | approved delegate caller receives underlying; debt is recorded on `borrower` |
| `repayBorrow(amount)` | caller pays their own debt |
| `repayBorrowBehalf(borrower, amount)` | caller pays the named borrower's debt |

For either repayment function, `type(uint256).max` requests repayment of the full current balance. The exact transferred amount can be lower for fee-on-transfer assets because accounting uses the amount received.

## Liquidation and bad debt

```solidity
function liquidateBorrow(
    address borrower,
    uint256 repayAmount,
    VTokenInterface vTokenCollateral
) external returns (uint256);
```

Regular liquidation accrues both markets, runs Comptroller policy checks, transfers repayment from the liquidator, and calls the collateral market's `seize`. `seizeTokens` is the gross collateral amount: `protocolSeizeShareMantissa` is allocated to protocol reserves and only the remainder is credited to the liquidator.

Small accounts can instead be processed through `Comptroller.liquidateAccount` or `Comptroller.healAccount`. The latter calls `healBorrow`, records the unpaid portion as `badDebt`, and seizes all entered collateral. `badDebtRecovered` can only be called by the configured Shortfall contract.

## Accrual and cash

- `accrueInterest()` advances interest to the current block or timestamp.
- `borrowRatePerBlock()` and `supplyRatePerBlock()` are per-slot values; on time-based deployments the slot is one second.
- `exchangeRateCurrent()`, `borrowBalanceCurrent()`, `balanceOfUnderlying()`, and `totalBorrowsCurrent()` accrue before returning.
- `exchangeRateStored()` and `borrowBalanceStored()` do not accrue.
- In v4.4.0, `getCash()` returns tracked `internalCash`, making unsolicited underlying transfers unable to change the exchange rate. `syncCash()` is an ACM-controlled migration/repair operation, not a routine user action.

## Privileged and protocol operations

| Function | Required caller in v4.4.0 |
|---|---|
| `setProtocolSeizeShare(uint256)` | AccessControlManager authorization |
| `setReserveFactor(uint256)` | AccessControlManager authorization |
| `setInterestRateModel(address)` | AccessControlManager authorization |
| `setReduceReservesBlockDelta(uint256)` | AccessControlManager authorization |
| `syncCash()` | AccessControlManager authorization |
| `setProtocolShareReserve(address)` | VToken owner |
| `setShortfallContract(address)` | VToken owner |
| `sweepToken(address)` | VToken owner; cannot sweep the underlying |
| `healBorrow(address,address,uint256)` | this market's Comptroller |
| `forceLiquidateBorrow(address,address,uint256,address,bool)` | this market's Comptroller |
| `badDebtRecovered(uint256)` | configured Shortfall contract |

`reduceReserves(uint256)` and `addReserves(uint256)` are permissionless, but transfers and accounting constraints still apply. Reserve reduction sends underlying to `protocolShareReserve`; it is also performed automatically during accrual once the configured slot delta has elapsed.

Check the current owner, ACM permissions, Comptroller, Shortfall, and ProtocolShareReserve on the market proxy at the intended execution block. Source-level access labels do not prove who holds those roles on a particular chain.
