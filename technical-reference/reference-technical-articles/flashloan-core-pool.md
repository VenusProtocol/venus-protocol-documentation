# Core Pool Flash Loans

{% hint style="warning" %}
**Technical version map (BNB Chain).** This article is mapped to `venus-protocol` source commit `46afc66b1dbd61a707d0a3492b3ec21bf90fc17a`. The committed deployment artifacts record:

* Core Comptroller Unitroller proxy `0xfD36E2c2a6789Db23113685031d7F16329158384`;
* candidate `FlashLoanFacet` `0x7F00af2f30a55e79311392C98fBBfA629D19b3A5`, deployed at block `95559359`, whose embedded `FlashLoanFacet.sol` matches that source commit apart from a final newline; and
* candidate `VBep20Delegate` `0xb25b57599BA969c4829699F7E4Fc4076D14745E1`, deployed at block `87124541`, whose embedded `VToken.sol` contains the transfer, fee, and debt functions described below but differs from the source commit in later flash-loan interest-accrual and accounting changes.

These artifacts are candidate-build evidence, not proof of current routing or market configuration. At a recorded block, resolve the Unitroller diamond routing and selected facet code for `executeFlashLoan(address,address,address[],uint256[],bytes)` (selector `0x5544ed9c`). For every market used, also resolve the active vToken delegate and code, flash-loan enablement and fee/share values, listing, caps, cash, and pause state. Verify the initiator whitelist, user delegation, and effective ACM permissions at the same block.
{% endhint %}

The Core Pool flash-loan implementation is a hybrid settlement mechanism for authorized initiating contracts. It supports full repayment in the same transaction and, when all ordinary borrowing checks pass, partial repayment with the unpaid balance created as debt for an `onBehalf` account.

The operation is atomic, but atomicity does not mean the protocol keeps custody of the tokens throughout the callback. Each vToken transfers underlying tokens to the receiver, and the receiver can interact with external contracts while it holds them. Either the final state, including any newly created debt, commits as a whole or a revert rolls back the transaction's state changes.

## Important properties

* *Authorized initiators:* `msg.sender` must be in the Core Comptroller's flash-loan authorization mapping.
* *Delegation:* if `msg.sender` differs from `onBehalf`, the initiating contract must be an approved delegate for that account.
* *Multi-asset support:* one request can include up to 200 listed, flash-loan-enabled Core Pool markets.
* *Per-market fees:* each vToken stores its own flash-loan fee rate and protocol-share rate.
* *Hybrid settlement:* actual repayment must cover at least the fee. Any remaining principal-and-fee balance is attempted as ordinary debt for `onBehalf`.
* *Conditional debt creation:* debt conversion can fail because of market, pause, oracle, cap, policy, or collateral-factor borrowing-power checks. If it fails, the entire transaction reverts.
* *System and market controls:* flash loans can be paused system-wide and enabled or disabled per market.

Successful debt conversion creates a normal interest-bearing borrow. It does not protect the account from later liquidation.

## Core execution

### `FlashLoanFacet.executeFlashLoan`

```solidity
function executeFlashLoan(
    address payable onBehalf,
    address payable receiver,
    VToken[] memory vTokens,
    uint256[] memory underlyingAmounts,
    bytes memory param
) external nonReentrant;
```

The function validates and settles the complete operation.

### Validation

Before transferring funds, the Comptroller checks that:

* flash loans are not paused system-wide;
* `onBehalf` and `receiver` are nonzero addresses;
* the asset array is nonempty and contains no more than 200 entries;
* `vTokens` and `underlyingAmounts` have equal lengths;
* every market is listed and has flash loans enabled;
* every requested amount is nonzero;
* `msg.sender` is authorized to initiate flash loans; and
* `msg.sender` is an approved delegate when it differs from `onBehalf`.

Authorization applies to the initiating caller. The receiver is a separate address and must independently authenticate the callback.

### Phase 1: fees and asset transfer

For every requested market, the Comptroller:

1. calls that vToken's `calculateFlashLoanFee` function; and
2. calls `transferOutUnderlyingFlashLoan(receiver, amount)`.

`transferOutUnderlyingFlashLoan` transfers the underlying asset from the vToken to the receiver. The funds therefore leave the vToken during the callback. Transaction rollback and settlement checks protect atomic execution; they are not continuous protocol custody and do not eliminate receiver or external-protocol risk.

### Phase 2: receiver callback

The Comptroller calls:

```solidity
function executeOperation(
    VToken[] calldata vTokens,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    address onBehalf,
    bytes calldata param
) external returns (bool success, uint256[] memory repayAmounts);
```

`initiator` is the authorized caller of `executeFlashLoan`. `repayAmounts` contains numeric repayment amounts, not approval booleans. The receiver must return one amount for each requested asset and approve each corresponding vToken to pull that amount.

If the receiver returns `false` or reverts, the entire transaction reverts.

### Phase 3: settlement and optional debt

For each asset, settlement uses the following sequence:

1. Calculate `maximum repayment = principal + fee`.
2. Cap the receiver's requested repayment at that maximum.
3. Revert before the token pull if the requested repayment is less than the fee.
4. Pull the requested amount from the receiver through the vToken.
5. Revert if the actual amount received by the vToken is less than the fee.
6. Calculate `unpaid balance = principal + fee - actual amount received`.
7. If the unpaid balance is nonzero, call `flashLoanDebtPosition(onBehalf, unpaid balance)`.

The receiver needs sufficient balance and allowance for the amount it reports. Missing allowance does not skip repayment and trigger debt conversion; it causes the token transfer, and therefore the transaction, to fail.

`flashLoanDebtPosition` uses the ordinary borrow path. Debt creation must pass the relevant protocol and market pause checks, listing and pool policy, valid oracle prices, borrow cap, and the `onBehalf` account's collateral-factor borrowing power. Merely having supplied collateral does not guarantee conversion.

For multi-asset requests, a failure while settling any asset reverts all state changes in the transaction.

## Fee handling

### `VToken.calculateFlashLoanFee`

```solidity
function calculateFlashLoanFee(uint256 amount) public view returns (uint256, uint256);
```

The function returns:

* the total fee, calculated from the vToken's `flashLoanFeeMantissa`; and
* the protocol portion, calculated from the vToken's `flashLoanProtocolShareMantissa`.

Both calculations use fixed-point arithmetic and truncate to token units. Fee configuration is per vToken, not one global Comptroller value.

### `VToken.transferInUnderlyingFlashLoan`

```solidity
function transferInUnderlyingFlashLoan(
    address payable from,
    uint256 repaymentAmount,
    uint256 totalFee,
    uint256 protocolFee
) external nonReentrant returns (uint256 actualAmountTransferred);
```

Only the Comptroller can call this function. It pulls underlying from the receiver, checks the actual amount received against the fee, sends the protocol portion of the fee to the Protocol Share Reserve, records the PSR income type, and clears the active flash-loan amount. The non-protocol portion remains in market cash; there is no separate per-supplier credit call during settlement.

Tokens with transfer taxes or other non-standard transfer behavior can make `actualAmountTransferred` differ from the requested amount. Receiver code must reason about the actual amount the vToken will receive.

### Fee and market configuration

```solidity
function setFlashLoanEnabled(bool enabled) external returns (uint256);

function setFlashLoanFeeMantissa(
    uint256 flashLoanFeeMantissa_,
    uint256 flashLoanProtocolShare_
) external returns (uint256);
```

These vToken functions are controlled through the Access Control Manager using their exact function signatures. Both fee parameters are scaled by `1e18` and cannot exceed `1e18`.

The Core Comptroller also exposes ACM-controlled functions to authorize initiating accounts and pause flash loans system-wide:

```solidity
function setWhiteListFlashLoanAccount(address account, bool isWhiteListed) external;

function setFlashLoanPaused(bool paused) external;
```

Do not assume the initiator whitelist is temporary or that the feature is permissionless. Integrators must verify current on-chain authorization, pause state, market enablement, and fee configuration.

## VToken cash accounting

```solidity
function getCash() external view returns (uint256);
```

`getCash` reports the vToken's actual underlying-token cash. During an active flash loan, it therefore reflects the lower balance after funds have been transferred to the receiver. Flash-loan-aware internal accounting can include the tracked active amount where required for rate and exchange-rate calculations. Integrators that depend on the precise accounting sequence must bind their analysis to the active vToken implementation, not only to repository `main`.

## Receiver requirements

A receiver should implement `IFlashLoanReceiver` directly or use a separately published, versioned, and audited integration library.

The `FlashLoanReceiverBase` found under `contracts/test` in the protocol repository is a test helper, not a production integration standard. Its Comptroller field is ordinary public storage, not a Solidity `immutable`, and the helper does not authenticate callbacks or implement settlement.

Production receiver code must:

1. Authenticate that `msg.sender` is the expected Core Comptroller.
2. Validate `initiator`, `onBehalf`, `vTokens`, amounts, premiums, and strategy parameters.
3. Execute only calls and routes the receiver is designed to trust.
4. Return one numeric repayment amount for every asset.
5. Approve each corresponding vToken to pull the returned amount.
6. Ensure the vToken will actually receive at least the fee for each asset.
7. Obtain explicit user authorization before intentionally leaving debt for `onBehalf`.
8. Verify that the account has sufficient current borrowing power for any intended unpaid balance.
9. Return `false` or revert when strategy validation fails.

Receiver code must not treat atomic rollback as protection from every integration risk. External protocols, swap routes, token behavior, callback authentication, approvals, and any successfully created user debt remain part of the receiver's security model.

## Numerical examples

The following examples use a 100,000 USDC principal and an illustrative 0.09% fee:

```text
Fee = 100,000 × 0.0009 = 90 USDC
Maximum repayment = 100,000 + 90 = 100,090 USDC
```

The example fee is not a statement of the current fee for every market. Read the selected vToken's on-chain configuration.

### Full repayment

If a strategy finishes with 100,200 USDC, approves the vToken, and reports full repayment:

```text
Amount pulled = 100,090 USDC
Amount remaining for the receiver = 100,200 - 100,090 = 110 USDC
Debt created = 0
```

The arithmetic does not guarantee strategy profit. It only describes settlement if the receiver actually has the stated balance and every check succeeds.

### Partial repayment: 99,500 USDC returned

```text
Unpaid balance = 100,090 - 99,500 = 590 USDC
```

The protocol attempts to create 590 USDC of ordinary debt for `onBehalf`. The transaction completes only if the vToken receives the 99,500 USDC and the additional 590 USDC borrow passes every ordinary borrow check. Otherwise, the transaction reverts.

### Partial repayment: 80,000 USDC returned

```text
Unpaid balance = 100,090 - 80,000 = 20,090 USDC
```

The debt attempt is 20,090 USDC, not 20,000 USDC. A statement such as “the user has 10 ETH collateral” is not enough to determine success. The ETH oracle price, applicable collateral factor, existing supplies and borrows, caps, pause state, and other account and market data are required.

### Repayment below the fee

If the receiver reports 50 USDC when the fee is 90 USDC, the Comptroller detects `50 < 90` and reverts before asking the vToken to pull repayment. No debt conversion occurs, all transaction state changes roll back, and the transaction sender still pays gas.

## Events

The relevant events include:

* `FlashLoanExecuted`;
* `FlashLoanRepaid`;
* `TransferOutUnderlyingFlashLoan`;
* `TransferInUnderlyingFlashLoan`;
* `FlashLoanStatusChanged`;
* `FlashLoanFeeUpdated`;
* `IsAccountFlashLoanWhitelisted`; and
* `FlashLoanPauseChanged`.

Use the ABI of the active implementations as the authoritative event schema.

## Errors

Important errors include:

* `FlashLoanPausedSystemWide`;
* `FlashLoanNotEnabled`;
* `NoAssetsRequested`;
* `TooManyAssetsRequested`;
* `InvalidFlashLoanParams`;
* `InvalidAmount`;
* `MarketNotListed`;
* `SenderNotAuthorizedForFlashLoan`;
* `NotAnApprovedDelegate`;
* `ExecuteFlashLoanFailed`;
* `NotEnoughRepayment`;
* `InsufficientRepayment`;
* `FailedToCreateDebtPosition`;
* `InvalidComptroller`; and
* `FlashLoanAlreadyActive`.

The exact error set depends on the active Comptroller facet and vToken implementation. Integrations should generate selectors from the matching deployed ABI.
