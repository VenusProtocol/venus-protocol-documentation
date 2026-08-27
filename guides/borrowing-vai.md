# Borrowing and repaying VAI

{% hint style="warning" %}
**Current scope: BNB Chain Core Pool.** The official Venus app exposes the VAI borrow and repay flow on BNB Chain mainnet and testnet. Use BNB Chain testnet only for testing; the transaction guidance involving assets of value is for mainnet. New borrowing succeeds only when the selected VAI Controller's current Prime eligibility check accepts the wallet. Repaying existing VAI debt does not require Prime, but both actions depend on the selected deployment being available and the Core Comptroller's `protocolPaused()` flag being false. Check the live app, Controller, and selected network before every transaction.
{% endhint %}

VAI is minted against collateral in your BNB Chain Core Pool account. It is not borrowed from a separate VAI vToken market. Minting VAI creates debt that:

* uses the collateral and outstanding borrows in your Core Pool account to determine how much VAI you may mint;
* reduces your account health and can expose your Core Pool collateral to liquidation;
* accrues interest at a deployment-specific, variable rate; and
* may charge a mint fee. The full requested amount is added to your debt; the Controller separately mints the fee amount to the configured treasury and the remainder to your wallet.

Supplied assets in an isolated pool do not provide collateral for this VAI debt. The values shown in old screenshots or examples are not evidence of the current borrow APR, fee, mintable amount, account health, cap, or pause state.

## Before borrowing

1. Open the official [Venus app](https://app.venus.io) and select BNB Chain mainnet. Use BNB Chain testnet only to test the flow. The VAI route is not exposed by the official app on other networks.
2. Connect the intended wallet and open **VAI** from the navigation menu.
3. Confirm that the wallet satisfies the selected VAI Controller's current Prime eligibility check. Mainnet currently uses PrimeV2. On testnet, the Controller's configured Prime contract can differ from the contract checked by the app, so an enabled form does not prove that `mintVAI` will succeed. Prime is not required to repay existing VAI debt.
4. Review the Core Pool account that will secure the debt. Confirm which supplied assets are enabled as collateral, their current prices and liquidation thresholds, your other borrows, and the simulated account health after minting.
5. Review every live value in the form: **Available amount**, **Borrow APR**, any displayed **Mint fee**, and the simulated account health. **Available amount** is the current hard limit; the form's **Max** button can select a lower amount to preserve the interface's health-factor buffer. These values can change before the transaction is mined.

{% hint style="danger" %}
Neither the displayed available amount nor the form's client-selected maximum guarantees that a position will remain safe. Minting close to a limit can leave too little buffer for price movements, interest accrual, oracle updates, or governance parameter changes. If the account becomes liquidatable, a liquidator can repay debt and seize Core Pool collateral.
{% endhint %}

## Borrow VAI

1. On the **Borrow** tab, enter the amount of VAI to mint. Keep a deliberate health-factor buffer rather than selecting the maximum automatically.
2. Recheck any displayed mint fee. The app shows the fee row only when the current fee percentage is greater than zero. If the requested raw VAI amount is `M` and the Controller's `1e18`-scaled `treasuryPercent` is `P`, the fee amount is `floor(M × P / 1e18)`. The debt increase is `M`; the Controller mints the fee amount to `treasuryAddress` and mints `M - feeAmount` to the borrower. Use the live value rather than hardcoding a percentage or assuming that a current zero fee is permanent.
3. Recheck the variable Borrow APR and the post-transaction account health.
4. Submit the transaction. In the wallet, verify the chain, the VAI Controller proxy as the transaction target, the `mintVAI` action, and the raw amount before signing.
5. After confirmation, verify the transaction receipt, VAI received, VAI debt, and Core Pool account health. A successful wallet submission is not proof that the transaction succeeded on-chain.

Minting can fail if the account is not Prime-eligible according to the Controller, the amount exceeds the account's current mintable amount, the VAI mint cap would be exceeded, the Core Comptroller's `protocolPaused()` flag is true, an oracle check fails, or state changes before execution.

## Repay VAI

You may repay part or all of an existing VAI debt without holding a Prime token. You need VAI in the paying wallet and the network's native token for gas. Because interest accrues, the full repayment amount can be greater than both the amount originally requested and the amount originally received after the mint fee.

1. Open the **Repay** tab and review the current VAI debt, Borrow APR, VAI wallet balance, simulated account health, and spending limit.
2. Enter a partial amount or select **Max**. **Max** fills the current submit limit, which can be smaller than the total debt when the wallet's VAI balance or an existing nonzero allowance is lower. If you intend to repay in full, confirm that the entered amount equals the entire displayed debt.
3. If approval is required, approve the selected network's **VAI Controller proxy** to spend VAI. The VAI Vault, a vToken, an implementation contract, and any third-party address are not valid substitutes for this repayment spender.
4. Review the approval transaction separately from the repayment transaction. Confirm the token, spender, amount, chain, and wallet. After repayment, reduce or revoke any allowance you no longer need through the app's spending-limit control or directly on the token contract.
5. Submit the repayment and verify the receipt, remaining debt, remaining allowance, VAI wallet balance, and updated account health.

Only when the entered amount equals the debt recognized by the frontend does the official app classify the action as a full repayment and replace the input with the maximum `uint256` value for `repayVAI`. The Controller treats any value at least as large as the current total debt as a request to settle that total debt, so newly accrued interest can be included without transferring the entire maximum value. Because debt continues accruing before execution, the wallet needs enough VAI and allowance for the actual amount due. Do not copy this maximum-value convention to liquidation calls or unrelated contracts.

{% hint style="warning" %}
A partial repayment reduces debt but does not close the position or guarantee that the account is safe from liquidation. The VAI repayment path is also blocked while the Core Comptroller's `protocolPaused()` flag is true; if repayment is unavailable, verify that flag and official Venus communications instead of approving an alternative spender.
{% endhint %}

## Verify contracts and live state

Use [Funds — Deployed Contracts](../deployed-contracts/funds.md#bnb-chain-mainnet) to discover the BNB Chain mainnet VAI Unitroller and [the testnet section](../deployed-contracts/funds.md#bnb-chain-testnet) for the BNB Chain testnet deployment. The VAI Unitroller is the user-facing VAI Controller proxy. This is a custom Unitroller proxy: read its current implementation through `vaiControllerImplementation()` rather than assuming an EIP-1967 storage slot. Also verify the VAI token under the selected network in [Markets — Deployed Contracts](../deployed-contracts/markets.md).

Before signing:

* match the app's selected network to the wallet network;
* match the VAI token and VAI Controller proxy against the deployment page and the chain explorer;
* inspect the proxy's current implementation and current state rather than calling the implementation directly; and
* treat mint caps, Prime-only mode, the configured Prime contract, fee, interest rate, oracle state, and the global pause flag as live configuration. In particular, do not assume testnet uses the same Prime contract as mainnet.

For integrators, `mintVAI(uint256)` and `repayVAI(uint256)` accept raw VAI amounts. Read the selected token's decimals and current Controller state instead of assuming values from another chain or block. The behavior described here is bounded by [`venus-protocol@v10.3.0`](https://github.com/VenusProtocol/venus-protocol/blob/46afc66b1dbd61a707d0a3492b3ec21bf90fc17a/contracts/Tokens/VAI/VAIController.sol) and the official VAI interface at [`venus-protocol-interface@c51133c`](https://github.com/VenusProtocol/venus-protocol-interface/tree/c51133cb99c6881b96f9636b9cbec3bcf9c5e572/apps/evm/src/pages/Vai). A source snapshot explains implementation behavior; it does not prove that a particular proxy, implementation, parameter, or pause state is current at a later block.
