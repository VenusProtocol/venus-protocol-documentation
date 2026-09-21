# Exiting positions on sunset networks

Venus is winding down its deployments on **opBNB**, **Optimism** and **Unichain**. On every Core Pool market on those three networks, supplying (`MINT`), borrowing (`BORROW`) and entering a market as collateral (`ENTER_MARKET`) are paused on-chain, while repaying (`REPAY`), redeeming (`REDEEM`) and exiting a market (`EXIT_MARKET`) remain open. This was checked on 21 September 2026 at opBNB block `187368051`, Optimism block `157180092` and Unichain block `59210622`. Pause states are governance-controlled and can change, so verify them as described in Step 2 before submitting a transaction.

Liquidation is not paused. A borrow position that becomes undercollateralized can still be liquidated, and borrow interest keeps accruing, so close positions rather than leaving them open.

If one of these networks is no longer offered in the Venus app, the position can still be closed by interacting directly with the market contracts through a block explorer. Positions on BNB Chain, Ethereum, Arbitrum, Base and ZKsync Era are separate deployments and are not affected by this guide.

| Network  | Chain ID | Block explorer                                                       |
| -------- | -------- | -------------------------------------------------------------------- |
| opBNB    | 204      | [opBNBScan](https://opbnbscan.com)                                   |
| Optimism | 10       | [Optimistic Etherscan](https://optimistic.etherscan.io)              |
| Unichain | 130      | [Uniscan](https://uniscan.xyz)                                       |

## Before you begin

* Connect the same wallet that holds the position, and confirm the explorer domain, the network and the full contract address before signing anything. Token names and symbols can be imitated. Venus contributors and support representatives will never ask for your seed phrase or private key.
* vTokens are beacon proxies and the Comptroller, XVS Vault and RewardsDistributor are transparent proxies. On an explorer, open **Contract** and use **Read as Proxy** or **Write as Proxy** when those tabs are available. If the explorer has not recognized the proxy, do not guess an implementation address or construct a transaction manually; stop and ask for verification through the [Venus community forum](https://community.venus.io/).
* Contract inputs use integer base units, not human-readable decimal amounts. Check `decimals()` on the underlying token: `1 USDC` with 6 decimals is `1000000`.
* Keep enough of the network's native token for gas.
* The direct vToken flow operates on ERC-20 underlying tokens. In the WBNB and WETH markets, repayment requires the wrapped token and redemption returns the wrapped token. Native BNB or ETH held for gas is not the same asset; see the NativeTokenGateway notes in Steps 3 and 4.
* Work through one market at a time, and repeat on every network where you have a position.

## Contract reference

Addresses below were read from each network's Core Pool Comptroller on 21 September 2026 and match the [Deployed Contracts → Markets](../deployed-contracts/markets.md) page. Every listed market was confirmed listed at that time.

### opBNB

* Comptroller: [`0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd`](https://opbnbscan.com/address/0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd)
* NativeTokenGateway (BNB/WBNB): [`0x7bAf6019C90B93aD30f8aD6a2EcCD2B11427b29f`](https://opbnbscan.com/address/0x7bAf6019C90B93aD30f8aD6a2EcCD2B11427b29f)

| Market       | vToken                                                                                                            | Underlying token                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| vBTCB\_Core  | [`0xED827b80Bd838192EA95002C01B5c6dA8354219a`](https://opbnbscan.com/address/0xED827b80Bd838192EA95002C01B5c6dA8354219a) | BTCB [`0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2`](https://opbnbscan.com/address/0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2) |
| vETH\_Core   | [`0x509e81eF638D489936FA85BC58F52Df01190d26C`](https://opbnbscan.com/address/0x509e81eF638D489936FA85BC58F52Df01190d26C) | ETH [`0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea`](https://opbnbscan.com/address/0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea) |
| vFDUSD\_Core | [`0x13B492B8A03d072Bab5C54AC91Dba5b830a50917`](https://opbnbscan.com/address/0x13B492B8A03d072Bab5C54AC91Dba5b830a50917) | FDUSD [`0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`](https://opbnbscan.com/address/0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb) |
| vUSDT\_Core  | [`0xb7a01Ba126830692238521a1aA7E7A7509410b8e`](https://opbnbscan.com/address/0xb7a01Ba126830692238521a1aA7E7A7509410b8e) | USDT [`0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3`](https://opbnbscan.com/address/0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3) |
| vWBNB\_Core  | [`0x53d11cB8A0e5320Cd7229C3acc80d1A0707F2672`](https://opbnbscan.com/address/0x53d11cB8A0e5320Cd7229C3acc80d1A0707F2672) | WBNB [`0x4200000000000000000000000000000000000006`](https://opbnbscan.com/address/0x4200000000000000000000000000000000000006) |

### Optimism

* Comptroller: [`0x5593FF68bE84C966821eEf5F0a988C285D5B7CeC`](https://optimistic.etherscan.io/address/0x5593FF68bE84C966821eEf5F0a988C285D5B7CeC)
* NativeTokenGateway (ETH/WETH): [`0x5B1b7465cfDE450e267b562792b434277434413c`](https://optimistic.etherscan.io/address/0x5B1b7465cfDE450e267b562792b434277434413c)

| Market      | vToken                                                                                                                         | Underlying token                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| vOP\_Core   | [`0x6b846E3418455804C1920fA4CC7a31A51C659A2D`](https://optimistic.etherscan.io/address/0x6b846E3418455804C1920fA4CC7a31A51C659A2D) | OP [`0x4200000000000000000000000000000000000042`](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000042) |
| vUSDC\_Core | [`0x1C9406ee95B7af55F005996947b19F91B6D55b15`](https://optimistic.etherscan.io/address/0x1C9406ee95B7af55F005996947b19F91B6D55b15) | USDC [`0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85`](https://optimistic.etherscan.io/address/0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85) |
| vUSDT\_Core | [`0x37ac9731B0B02df54975cd0c7240e0977a051721`](https://optimistic.etherscan.io/address/0x37ac9731B0B02df54975cd0c7240e0977a051721) | USDT [`0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`](https://optimistic.etherscan.io/address/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58) |
| vWBTC\_Core | [`0x9EfdCfC2373f81D3DF24647B1c46e15268884c46`](https://optimistic.etherscan.io/address/0x9EfdCfC2373f81D3DF24647B1c46e15268884c46) | WBTC [`0x68f180fcCe6836688e9084f035309E29Bf0A2095`](https://optimistic.etherscan.io/address/0x68f180fcCe6836688e9084f035309E29Bf0A2095) |
| vWETH\_Core | [`0x66d5AE25731Ce99D46770745385e662C8e0B4025`](https://optimistic.etherscan.io/address/0x66d5AE25731Ce99D46770745385e662C8e0B4025) | WETH [`0x4200000000000000000000000000000000000006`](https://optimistic.etherscan.io/address/0x4200000000000000000000000000000000000006) |

### Unichain

* Comptroller: [`0xe22af1e6b78318e1Fe1053Edbd7209b8Fc62c4Fe`](https://uniscan.xyz/address/0xe22af1e6b78318e1Fe1053Edbd7209b8Fc62c4Fe)
* NativeTokenGateway (ETH/WETH): [`0x4441aE3bCEd3210edbA35d0F7348C493E79F1C52`](https://uniscan.xyz/address/0x4441aE3bCEd3210edbA35d0F7348C493E79F1C52)

| Market        | vToken                                                                                                        | Underlying token                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| vUNI\_Core    | [`0x67716D6Bf76170Af816F5735e14c4d44D0B05eD2`](https://uniscan.xyz/address/0x67716D6Bf76170Af816F5735e14c4d44D0B05eD2) | UNI [`0x8f187aA05619a017077f5308904739877ce9eA21`](https://uniscan.xyz/address/0x8f187aA05619a017077f5308904739877ce9eA21) |
| vUSDC\_Core   | [`0xB953f92B9f759d97d2F2Dec10A8A3cf75fcE3A95`](https://uniscan.xyz/address/0xB953f92B9f759d97d2F2Dec10A8A3cf75fcE3A95) | USDC [`0x078D782b760474a361dDA0AF3839290b0EF57AD6`](https://uniscan.xyz/address/0x078D782b760474a361dDA0AF3839290b0EF57AD6) |
| vUSD₮0\_Core  | [`0xDa7Ce7Ba016d266645712e2e4Ebc6cC75eA8E4CD`](https://uniscan.xyz/address/0xDa7Ce7Ba016d266645712e2e4Ebc6cC75eA8E4CD) | USD₮0 [`0x9151434b16b9763660705744891fA906F660EcC5`](https://uniscan.xyz/address/0x9151434b16b9763660705744891fA906F660EcC5) |
| vWBTC\_Core   | [`0x68e2A6F7257FAc2F5a557b9E83E1fE6D5B408CE5`](https://uniscan.xyz/address/0x68e2A6F7257FAc2F5a557b9E83E1fE6D5B408CE5) | WBTC [`0x0555E30da8f98308EdB960aa94C0Db47230d2B9c`](https://uniscan.xyz/address/0x0555E30da8f98308EdB960aa94C0Db47230d2B9c) |
| vWETH\_Core   | [`0xc219BC179C7cDb37eACB03f993f9fDc2495e3374`](https://uniscan.xyz/address/0xc219BC179C7cDb37eACB03f993f9fDc2495e3374) | WETH [`0x4200000000000000000000000000000000000006`](https://uniscan.xyz/address/0x4200000000000000000000000000000000000006) |
| vweETH\_Core  | [`0x0170398083eb0D0387709523baFCA6426146C218`](https://uniscan.xyz/address/0x0170398083eb0D0387709523baFCA6426146C218) | weETH [`0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7`](https://uniscan.xyz/address/0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7) |
| vwstETH\_Core | [`0xbEC19Bef402C697a7be315d3e59E5F65b89Fa1BB`](https://uniscan.xyz/address/0xbEC19Bef402C697a7be315d3e59E5F65b89Fa1BB) | wstETH [`0xc02fE7317D4eb8753a02c35fe019786854A92001`](https://uniscan.xyz/address/0xc02fE7317D4eb8753a02c35fe019786854A92001) |

## Step 1 — Look up your position

Open each vToken above on the network's explorer and read these functions under **Read as Proxy**:

* `balanceOf(<your address>)` — your vToken balance. A non-zero value represents a supplied position.
* `borrowBalanceStored(<your address>)` — debt denominated in the underlying token, calculated with the market's latest stored borrow index. It does not first accrue new interest, so the true debt is slightly higher.
* `exchangeRateStored()` — vTokens to underlying, scaled by `1e18` adjusted for token decimals. Useful to estimate what a redemption returns.
* `underlying()` — the ERC-20 token used to repay the market and received on a direct redemption.

`borrowBalanceCurrent(<your address>)` and `balanceOfUnderlying(<your address>)` accrue interest and are not view functions. Explorers place them under **Write as Proxy**, where broadcasting a transaction does not display the returned value. Do not send a transaction merely to read a balance. A wallet simulation or an RPC `eth_call` returns the simulated value; otherwise use the stored variants above.

A borrow-only account can have a zero vToken balance, so the absence of a vToken from your wallet's token list does not prove that you have no debt. Review your Venus transaction history on each network, and check every market in the tables above.

The Comptroller also answers account-level questions under **Read as Proxy**:

* `getAssetsIn(<your address>)` — markets your account has entered as collateral.
* `getAccountLiquidity(<your address>)` — returns `(error, liquidity, shortfall)`. A non-zero shortfall means the account is undercollateralized and can be liquidated; repay before attempting to redeem.

## Step 2 — Confirm the market still accepts the action

Open the network's Comptroller under **Read as Proxy** and check, for each vToken you intend to use:

* `isMarketListed(<vToken address>)` must return `true`.
* `actionPaused(<vToken address>, 3)` checks `REPAY` and must return `false` before repayment.
* `actionPaused(<vToken address>, 1)` checks `REDEEM` and must return `false` before redemption.

The second argument is the action index: `0` MINT, `1` REDEEM, `2` BORROW, `3` REPAY, `4` SEIZE, `5` LIQUIDATE, `6` TRANSFER, `7` ENTER_MARKET, `8` EXIT_MARKET.

If the market is unlisted or the action you need is paused, the call in the next steps will revert. Stop and ask for help through the [Venus community forum](https://community.venus.io/); include the network, wallet address, vToken address, and any transaction hash or revert data, but never share private credentials.

## Step 3 — Repay your borrows

Do this only for markets where `borrowBalanceStored` is non-zero and `REPAY` is available. If you have no borrows, skip to Step 4.

1. Open the underlying token returned by `underlying()` and call `approve(spender, amount)`, using **Write as Proxy** if the token is itself a proxy.
   * `spender` is the vToken proxy address, not its implementation.
   * `amount` must cover the debt after newly accrued interest, in the underlying token's base units. If an existing allowance is non-zero, some tokens require setting it to zero before changing it.
2. Open the vToken under **Write as Proxy** and call `repayBorrow(repayAmount)`. For a full repayment, pass `repayAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935`, which is `type(uint256).max`.

Passing `type(uint256).max` asks the vToken to repay up to the debt after interest accrual; it caps the transfer at that debt rather than attempting to transfer `uint256.max`. The transaction can still revert because of market state, insufficient token balance or allowance, or token behavior; fee-on-transfer behavior can also leave debt behind.

Someone else can repay on your behalf with `repayBorrowBehalf(borrower, repayAmount)` after approving the vToken from their own wallet. No delegate approval is required for repayment.

**Repaying a WBNB or WETH borrow with native BNB or ETH.** Instead of wrapping manually, open the network's NativeTokenGateway under **Write Contract** and call `wrapAndRepay()` with the native amount in the `payableAmount` field. The gateway wraps the value, repays your debt in the wrapped-native market and refunds any excess native token. Use it only for the market named in the reference above; the gateway serves a single market per network.

After confirmation, re-check `borrowBalanceStored(<your address>)`. Do not treat the position as closed unless it is zero. Then check `allowance(<your address>, <vToken address>)` on the underlying token and revoke any unused allowance with `approve(<vToken address>, 0)`.

## Step 4 — Withdraw your supplied assets

For each market where `balanceOf` is non-zero and `REDEEM` is available, open the vToken under **Write as Proxy**:

* `redeem(redeemTokens)` — burns the specified vTokens and returns the corresponding underlying. For a full exit, pass the complete value returned by `balanceOf(<your address>)`. This is the preferred method.
* `redeemUnderlying(redeemAmount)` — requests a partial withdrawal denominated in the underlying token's base units. Rounding during conversion means it is not a reliable way to empty the position.

Redeeming from a market you have entered makes the Comptroller check your account across all entered markets in the pool, using the Resilient Oracle. Repay borrows first: it removes shortfall as a blocker, though it does not guarantee that redemption succeeds. Insufficient market cash, an unavailable oracle price, or token behavior can still cause a revert.

**Receiving native BNB or ETH instead of the wrapped token.** A direct `redeem` on a WBNB or WETH market returns the wrapped token, which you can unwrap yourself by calling `withdraw(wad)` on the wrapped-token contract. Alternatively use the NativeTokenGateway, which requires one extra approval because it redeems on your behalf:

1. On the Comptroller, **Write as Proxy** → `updateDelegate(delegate, approved)` with the gateway address and `true`.
2. On the gateway, **Write Contract** → `redeemAndUnwrap(redeemTokens)` with your vToken balance, or `redeemUnderlyingAndUnwrap(redeemAmount)` for a partial amount in underlying base units. The gateway redeems, unwraps and sends you native tokens.
3. Afterwards, call `updateDelegate(<gateway address>, false)` to revoke the delegation.

After confirmation, re-check `balanceOf(<your address>)` and confirm that the tokens reached your wallet.

## Step 5 — Claim outstanding market rewards

Only Unichain has a RewardsDistributor attached to its Core Pool; the opBNB and Optimism Core Pools have none. Reward speeds on Unichain are currently zero, so no new rewards accrue, but previously accrued rewards can still be claimed.

* Unichain RewardsDistributor (XVS): [`0x4630B71C1BD27c99DD86aBB2A18C50c3F75C88fb`](https://uniscan.xyz/address/0x4630B71C1BD27c99DD86aBB2A18C50c3F75C88fb)

Under **Read as Proxy**, `rewardTokenAccrued(<your address>)` shows the amount already recorded for you; it does not include rewards not yet updated for your markets. To claim, use **Write as Proxy** → `claimRewardToken(holder)` with your address. That overload processes every market in the pool, which is valid here because all Unichain Core Pool markets are listed and the pool is well below the contract's loop limit.

Payment succeeds only if the distributor still holds enough of its reward token; the contract keeps the accrual recorded rather than making a partial payment. No token approval is required, and claiming is independent of repaying and redeeming.

## Step 6 — Unstake XVS from the XVS Vault

Each of the three networks has an XVS Vault. Stakes there are separate from Core Pool positions and must be withdrawn separately, with a **7-day lock** between the request and the withdrawal.

| Network  | XVS Vault proxy                                                                                                | XVS token                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| opBNB    | [`0x7dc969122450749A8B0777c0e324522d67737988`](https://opbnbscan.com/address/0x7dc969122450749A8B0777c0e324522d67737988) | [`0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61`](https://opbnbscan.com/address/0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61) |
| Optimism | [`0x133120607C018c949E91AE333785519F6d947e01`](https://optimistic.etherscan.io/address/0x133120607C018c949E91AE333785519F6d947e01) | [`0x4a971e87ad1F61f7f3081645f52a99277AE917cF`](https://optimistic.etherscan.io/address/0x4a971e87ad1F61f7f3081645f52a99277AE917cF) |
| Unichain | [`0x5ECa0FBBc5e7bf49dbFb1953a92784F8e4248eF6`](https://uniscan.xyz/address/0x5ECa0FBBc5e7bf49dbFb1953a92784F8e4248eF6) | [`0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d`](https://uniscan.xyz/address/0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d) |

Each network has a single pool, so `_rewardToken` is that network's XVS address and `_pid` is `0`.

1. **Check the stake.** Under **Read as Proxy**, `getUserInfo(<XVS address>, 0, <your address>)` returns your staked `amount`, `rewardDebt` and `pendingWithdrawals`. `pendingReward(<XVS address>, 0, <your address>)` shows unclaimed rewards.
2. **Request the withdrawal.** Under **Write as Proxy**, `requestWithdrawal(<XVS address>, 0, <amount>)` with the amount in XVS base units (18 decimals). This also pays out pending rewards and starts the 7-day lock. Voting power for the requested amount is removed immediately.
3. **Wait, then check eligibility.** `getEligibleWithdrawalAmount(<XVS address>, 0, <your address>)` returns the amount whose lock has expired.
4. **Execute.** `executeWithdrawal(<XVS address>, 0)` transfers every unlocked amount back to your wallet. It reverts while nothing is eligible.

Reward payments come from that network's XVS Store. If the store's balance is short, the vault pays what it can and records the remainder, which you can read with `pendingRewardTransfers(<XVS address>, <your address>)`; the amount stays claimable and is paid on a later claim once the store is funded. Unstaking itself is not affected. Venus Prime is paused on these networks and no Prime tokens are issued there, so withdrawing a stake does not affect a Prime position.

## Step 7 — Move XVS to another network

XVS on these networks is omnichain XVS and can be bridged back to BNB Chain. Use the [XVS Bridge](xvs-bridge.md) in the Venus app while the network is still offered there.

If the app no longer lists the network, the bridge contract can be called directly. This is an advanced flow: an incorrect recipient encoding sends tokens to an unrecoverable address.

| Network  | XVSProxyOFTDest                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| opBNB    | [`0x100D331C1B5Dcd41eACB1eCeD0e83DCEbf3498B2`](https://opbnbscan.com/address/0x100D331C1B5Dcd41eACB1eCeD0e83DCEbf3498B2) |
| Optimism | [`0xbBe46bAec851355c3FC4856914c47eB6Cea0B8B4`](https://optimistic.etherscan.io/address/0xbBe46bAec851355c3FC4856914c47eB6Cea0B8B4) |
| Unichain | [`0x9c95f8aa28fFEB7ECdC0c407B9F632419c5daAF8`](https://uniscan.xyz/address/0x9c95f8aa28fFEB7ECdC0c407B9F632419c5daAF8) |

The destination is a LayerZero V1 endpoint ID, not a chain ID: BNB Chain is `102`. Amounts are in XVS base units (18 decimals), and the recipient is your address left-padded to 32 bytes, for example `0x000000000000000000000000` followed by your 20-byte address without its `0x`.

1. Approve the bridge as spender on the XVS token for the amount you are sending.
2. Adapter parameters are required; an empty value is rejected. Use version 1 with the configured minimum destination gas of 300,000: `0x000100000000000000000000000000000000000000000000000000000000000493e0`.
3. Under **Read as Proxy**, call `estimateSendFee(102, <padded recipient>, <amount>, false, <adapter params>)`. The first returned value is the native fee.
4. Under **Write as Proxy**, call `sendFrom(<your address>, 102, <padded recipient>, <amount>, <your address>, 0x0000000000000000000000000000000000000000, <adapter params>)` and set `payableAmount` to the estimated native fee. Quotes move with gas prices, so add a small margin; excess is refunded to the refund address.
5. Single-transaction limits apply per source network and destination, and a daily limit applies as well. Split larger amounts across transactions.

Delivery is asynchronous. Track the source transaction and its LayerZero message, and do not resend a transfer that appears delayed: a pending message can still execute, and a duplicate would send a second amount.

## If a transaction fails

Stop rather than repeatedly spending gas on a reverting call. Re-check the market's listing and pause state, your balances and allowances, and the account's shortfall. If it still fails, ask for help through the [Venus community forum](https://community.venus.io/) with the network, wallet address, contract address and the transaction hash or revert data. Never share your seed phrase or private key.
