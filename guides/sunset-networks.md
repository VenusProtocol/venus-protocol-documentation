# Withdrawing from opBNB, Optimism and Unichain

Venus no longer supports **opBNB**, **Optimism** and **Unichain**, and these networks have been removed from the Venus app. Your funds are still in the protocol and you can withdraw them yourself through the network's block explorer.

Supplying and borrowing are paused on these networks. Repaying, withdrawing, claiming rewards, unstaking XVS and bridging XVS all still work.

Borrow interest keeps accruing and positions can still be liquidated, so repay first, then withdraw.

Positions on BNB Chain, Ethereum, Arbitrum, Base and ZKsync Era are separate deployments and are not affected.

## Before you start

* Open the explorer for your network and connect the wallet that holds the position:
  * opBNB (chain ID 204) — [opBNBScan](https://opbnbscan.com)
  * Optimism (chain ID 10) — [Optimistic Etherscan](https://optimistic.etherscan.io)
  * Unichain (chain ID 130) — [Uniscan](https://uniscan.xyz)
* On each contract page, open the **Contract** tab and use **Read as Proxy** / **Write as Proxy**. If the explorer does not show those tabs, stop — do not guess an implementation address or build the transaction by hand.
* Amounts are entered in base units, not decimals. Check `decimals()` on the token: 1 USDC with 6 decimals is `1000000`.
* Keep some native BNB or ETH for gas.
* Only use the addresses in the tables below. Token names and symbols can be imitated, and Venus will never ask for your seed phrase or private key.

## Your contracts

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

## Step 1 — Find your position

Open each vToken for your network and use **Read as Proxy**:

* `balanceOf(<your address>)` — the vTokens you hold. A non-zero value means you have a supplied position.
* `borrowBalanceStored(<your address>)` — what you owe, in the underlying token. Your real debt is slightly higher, because interest has accrued since this number was last updated.

A borrow can exist even when `balanceOf` is zero, so check every market in the table rather than only the tokens visible in your wallet.

## Step 2 — Repay what you owe

Skip to Step 3 if `borrowBalanceStored` is zero in every market. Otherwise, for each market with debt:

1. Open the underlying token from the table and call `approve(spender, amount)`. `spender` is the vToken address, and `amount` should be slightly above your debt so it still covers the interest accrued by the time the next transaction lands.
2. Open the vToken → **Write as Proxy** → `repayBorrow(repayAmount)`. To repay in full, enter `115792089237316195423570985008687907853269984665640564039457584007913129639935`. The contract takes only what you actually owe.

**If you owe WBNB or WETH and hold native BNB or ETH:** open your network's NativeTokenGateway → **Write Contract** → `wrapAndRepay()`, and enter the amount in the `payableAmount` field. It wraps your native token, repays the debt and refunds the excess.

Anyone can repay on your behalf with `repayBorrowBehalf(borrower, repayAmount)` after approving the vToken from their own wallet.

Afterwards, re-check `borrowBalanceStored(<your address>)` — it must be `0`. Then revoke the leftover allowance on the underlying token with `approve(<vToken address>, 0)`.

## Step 3 — Withdraw your supply

For each market where `balanceOf` is non-zero, open the vToken → **Write as Proxy**:

* `redeem(redeemTokens)` — enter the full value returned by `balanceOf(<your address>)` to withdraw everything. Use this for a full exit.
* `redeemUnderlying(redeemAmount)` — a partial withdrawal, in the underlying token's base units. Rounding means it will not cleanly empty the position.

Withdrawing from a WBNB or WETH market gives you the wrapped token. To receive native BNB or ETH instead, use the NativeTokenGateway:

1. Comptroller → **Write as Proxy** → `updateDelegate(<gateway address>, true)`.
2. Gateway → **Write Contract** → `redeemAndUnwrap(redeemTokens)` for a full exit, or `redeemUnderlyingAndUnwrap(redeemAmount)` for part of it.
3. Comptroller → `updateDelegate(<gateway address>, false)` to revoke the permission.

Confirm that `balanceOf(<your address>)` is back to `0` and that the tokens reached your wallet.

## Step 4 — Claim rewards (Unichain only)

opBNB and Optimism have no Core Pool rewards. On Unichain no new rewards accrue, but anything already earned is still claimable.

* RewardsDistributor (XVS): [`0x4630B71C1BD27c99DD86aBB2A18C50c3F75C88fb`](https://uniscan.xyz/address/0x4630B71C1BD27c99DD86aBB2A18C50c3F75C88fb)

**Read as Proxy** → `rewardTokenAccrued(<your address>)` shows what has been recorded so far. **Write as Proxy** → `claimRewardToken(holder)` with your address claims it. No approval is needed, and claiming is independent of repaying and withdrawing.

## Step 5 — Unstake XVS

XVS staked in the XVS Vault is separate from your market positions. There is a **7-day lock** between requesting a withdrawal and receiving the tokens.

| Network  | XVS Vault proxy                                                                                                | XVS token                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| opBNB    | [`0x7dc969122450749A8B0777c0e324522d67737988`](https://opbnbscan.com/address/0x7dc969122450749A8B0777c0e324522d67737988) | [`0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61`](https://opbnbscan.com/address/0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61) |
| Optimism | [`0x133120607C018c949E91AE333785519F6d947e01`](https://optimistic.etherscan.io/address/0x133120607C018c949E91AE333785519F6d947e01) | [`0x4a971e87ad1F61f7f3081645f52a99277AE917cF`](https://optimistic.etherscan.io/address/0x4a971e87ad1F61f7f3081645f52a99277AE917cF) |
| Unichain | [`0x5ECa0FBBc5e7bf49dbFb1953a92784F8e4248eF6`](https://uniscan.xyz/address/0x5ECa0FBBc5e7bf49dbFb1953a92784F8e4248eF6) | [`0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d`](https://uniscan.xyz/address/0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d) |

Each network has one pool, so every call below takes that network's XVS address as the reward token and `0` as the pool id.

1. **Check your stake** — **Read as Proxy** → `getUserInfo(<XVS address>, 0, <your address>)`.
2. **Request the withdrawal** — **Write as Proxy** → `requestWithdrawal(<XVS address>, 0, <amount>)`, with the amount in XVS base units (18 decimals). This also pays out pending rewards and starts the 7-day lock.
3. **After 7 days, check eligibility** — `getEligibleWithdrawalAmount(<XVS address>, 0, <your address>)`.
4. **Execute** — `executeWithdrawal(<XVS address>, 0)` sends the unlocked XVS back to your wallet.

If the vault cannot pay a reward in full it records the remainder, which stays claimable and can be read with `pendingRewardTransfers(<XVS address>, <your address>)`. Unstaking itself is not affected.

## Step 6 — Bridge XVS to BNB Chain

XVS on these networks can be bridged back to BNB Chain. Since the networks are no longer in the app, the bridge contract has to be called directly. Take care with the recipient encoding: an incorrect value sends tokens to an address nobody can recover.

| Network  | XVSProxyOFTDest                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| opBNB    | [`0x100D331C1B5Dcd41eACB1eCeD0e83DCEbf3498B2`](https://opbnbscan.com/address/0x100D331C1B5Dcd41eACB1eCeD0e83DCEbf3498B2) |
| Optimism | [`0xbBe46bAec851355c3FC4856914c47eB6Cea0B8B4`](https://optimistic.etherscan.io/address/0xbBe46bAec851355c3FC4856914c47eB6Cea0B8B4) |
| Unichain | [`0x9c95f8aa28fFEB7ECdC0c407B9F632419c5daAF8`](https://uniscan.xyz/address/0x9c95f8aa28fFEB7ECdC0c407B9F632419c5daAF8) |

Three values are the same for every transfer:

* Destination — `102`, the LayerZero endpoint ID for BNB Chain. This is not the chain ID.
* Recipient — your address left-padded to 32 bytes: `0x000000000000000000000000` followed by your address without its `0x`.
* Adapter parameters — `0x000100000000000000000000000000000000000000000000000000000000000493e0`. An empty value is rejected.

1. On the XVS token, `approve` the bridge address for the amount you are sending.
2. Bridge → **Read as Proxy** → `estimateSendFee(102, <padded recipient>, <amount>, false, <adapter params>)`. The first returned value is the native fee.
3. Bridge → **Write as Proxy** → `sendFrom(<your address>, 102, <padded recipient>, <amount>, <your address>, 0x0000000000000000000000000000000000000000, <adapter params>)`, with `payableAmount` set to that fee plus a small margin. Anything unused is refunded.

Per-transaction and daily limits apply, so split larger amounts across several transfers. Delivery is asynchronous — if a transfer looks delayed, wait rather than resending, because the pending message can still execute and a second transaction would send a second amount.

## If a transaction fails

Do not keep resubmitting. Open your network's Comptroller under **Read as Proxy** and check:

* `isMarketListed(<vToken address>)` returns `true`.
* `actionPaused(<vToken address>, 3)` returns `false` — repayment is allowed.
* `actionPaused(<vToken address>, 1)` returns `false` — withdrawal is allowed.
* `getAccountLiquidity(<your address>)` returns no shortfall. If it does, repay before trying to withdraw again.

Also confirm that you hold enough of the underlying token and that your allowance covers the repayment.

If it still fails, ask for help on the [Venus community forum](https://community.venus.io/) with the network, your wallet address, the contract address and the transaction hash or revert data. Never share your seed phrase or private key.
