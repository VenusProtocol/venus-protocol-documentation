# Withdrawing from deprecated isolated pools

Venus isolated pools have been fully deprecated. Their navigation and market screens have been removed from the Venus app, so positions can no longer be managed through the interface.

For markets that still allow repayments and redemptions, legacy positions may be closable by interacting directly with the market contracts. This is not possible for every market: some deprecated markets are unlisted or have **REPAY** or **REDEEM** paused. Check the market status as described below before submitting a transaction. Do not repeatedly submit transactions if the required action is unavailable.

Production isolated pools were deployed on **BNB Chain**, **Ethereum**, and **Arbitrum**. Core Pool positions and other Venus products are separate from the deprecated standalone pools. Legacy testnet deployments also exist on BNB Testnet, Sepolia, and Arbitrum Sepolia; make sure you select the explorer for the network where your position exists.

## Before you begin

* You will interact with Venus contracts through a block explorer, connecting the same wallet that holds the position:
  * BNB Chain — [BscScan](https://bscscan.com) or [BscScan Testnet](https://testnet.bscscan.com)
  * Ethereum — [Etherscan](https://etherscan.io) or [Etherscan Sepolia](https://sepolia.etherscan.io)
  * Arbitrum — [Arbiscan](https://arbiscan.io) or [Arbiscan Sepolia](https://sepolia.arbiscan.io)
* vTokens are beacon proxies, and RewardsDistributor contracts are transparent proxies. On an explorer, open **Contract** and use **Read as Proxy** or **Write as Proxy** when those tabs are available. If the explorer has not recognized the proxy, do not guess an implementation address or construct a transaction manually; stop and ask for verification through the official community forum.
* Confirm the explorer domain, network, and full contract address before connecting your wallet. Token names and symbols can be imitated. Venus contributors and support representatives will never ask for your seed phrase or private key.
* Keep enough of the network's native token for gas. The direct vToken flow operates on ERC-20 underlying tokens. For WBNB or WETH markets, repayment requires the wrapped token and redemption returns the wrapped token; BNB or ETH held for gas is not the same asset.
* Contract inputs use integer base units, not human-readable decimal amounts.

The current [Deployed Contracts → Markets](../deployed-contracts/markets.md) page lists documented pool and vToken addresses. Older unlisted markets may appear only in your Venus transaction history or the canonical [`isolated-pools` deployment records](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95/deployments). Deployment records identify contracts but do not prove their current implementation, pause state, liquidity, or oracle status.

Each isolated-pool market is a **vToken** contract. Supplying an asset mints vTokens; borrowing records debt in the vToken. Repayments and redemptions below are made through the vToken proxy, while approvals are made through the underlying token contract.

## Step 1 — Identify your positions and check market status

For every isolated-pool vToken you previously used, open its proxy on the correct explorer and check these functions under **Read as Proxy**:

* `balanceOf(<your address>)` — your vToken balance. A non-zero value represents a supplied position, but does not guarantee that redemption is currently available.
* `borrowBalanceStored(<your address>)` — debt denominated in the underlying token, calculated with the market's latest stored borrow index. It does not first accrue new interest.
* `underlying()` — the ERC-20 token used to repay the market and received on a direct redemption.
* `comptroller()` — the Comptroller proxy that controls this market.

`borrowBalanceCurrent(<your address>)` accrues interest and is not a view function. Explorers generally place it under **Write as Proxy**, where broadcasting a transaction does not display its return value like a normal read. Do not send a transaction merely to read this value. A wallet/client simulation or RPC `eth_call` can obtain the simulated result; otherwise use `borrowBalanceStored` to identify debt and re-check it after repayment.

Token holdings can help find supplied positions, but a borrow-only account can have a zero vToken balance. The absence of a vToken from a wallet's token list—or the absence of an app notice—does not prove that the wallet has no debt or unclaimed rewards. Review the wallet's Venus transaction history and the official market records on every relevant network.

Before using the write functions below, open the market's Comptroller proxy and check:

* `isMarketListed(<vToken address>)` must return `true`.
* `actionPaused(<vToken address>, 3)` checks **REPAY** and must return `false` before repayment.
* `actionPaused(<vToken address>, 1)` checks **REDEEM** and must return `false` before redemption.

If the market is unlisted or the action you need is paused, the direct call below will revert. Stop and ask for help through the [Venus community forum](https://community.venus.io/); include the chain, wallet address, vToken address, and any transaction hash or revert data, but never share private credentials.

## Step 2 — Repay your borrows

Do this only for markets where `borrowBalanceStored` is non-zero and **REPAY** is available. If you have no borrows, skip to Step 3.

1. Open the underlying token returned by `underlying()` and use **Write as Proxy** if it is itself a proxy. Call `approve(spender, amount)`:
   * `spender` is the vToken proxy address, not its implementation.
   * `amount` must cover the debt after newly accrued interest and must be entered in the underlying token's base units. If an existing allowance is non-zero, some tokens require setting it to zero before changing it.
2. Open the vToken under **Write as Proxy** and call `repayBorrow(repayAmount)`. For a full repayment, pass `repayAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935`, which is `type(uint256).max`.

Passing `type(uint256).max` asks the vToken to repay up to the debt after interest accrual. The vToken caps the attempted transfer at that debt rather than attempting to transfer `uint256.max`. The transaction can still revert because of market state, oracle updates, insufficient token balance or allowance, or token behavior; fee-on-transfer behavior can also leave debt behind.

After confirmation, re-check `borrowBalanceStored(<your address>)`. Do not treat the position as closed unless it is zero. Once it is zero—or if you decide to stop attempting repayment—check `allowance(<your address>, <vToken address>)` on the underlying token and revoke any unused allowance by calling `approve(<vToken address>, 0)`.

Repeat for every borrowed market in each pool and on every affected network.

## Step 3 — Withdraw your supplied assets

For each listed market where `balanceOf` is non-zero and **REDEEM** is available, open the vToken under **Write as Proxy**:

* `redeem(redeemTokens)` — burns the specified vTokens and returns the corresponding underlying. To request a full exit, pass the complete value returned by `balanceOf(<your address>)`. This is the preferred full-exit method.
* `redeemUnderlying(redeemAmount)` — requests a partial withdrawal denominated in the underlying token's base units. Conversion to vTokens and rounding can affect the resulting amount, so do not use it as a guarantee of an exact full exit.

After confirmation, re-check `balanceOf(<your address>)` and confirm that the underlying tokens reached your wallet. Direct redemption from a WBNB or WETH market returns the wrapped token, which must be unwrapped separately if you need BNB or ETH. Token-level transfer fees or other token behavior can affect the amount received.

Repaying all borrows first is the simplest pool-local order because it removes account shortfall as one possible blocker. It does not guarantee redemption. A paused or unlisted market, insufficient market cash, unavailable oracle prices, or token and reward-hook failures can still cause a transaction to revert.

For a market your account has entered, redeeming or calling `exitMarket` causes the Comptroller to check the account across all currently listed entered markets in that pool. The Resilient Oracle first applies its configured validation and fallback logic. If it still cannot produce a valid price for any required market, the operation can revert. `exitMarket` performs the same full-balance redeem check and generally cannot bypass that condition.

If a repayment or redemption fails unexpectedly, stop rather than repeatedly spending gas. Ask for help through the [Venus community forum](https://community.venus.io/) and provide the chain, wallet address, vToken address, and transaction hash or revert data.

## Reward claims

A legacy RewardsDistributor may still record accrued rewards. Claiming updates the accrual and attempts payment; payment succeeds only if that distributor holds enough of its reward token. A pool can have multiple distributors, each covering one reward token. Calling one distributor does not claim from the others.

The following mainnet proxy addresses come from the deployment records at commit [`943e7db`](https://github.com/VenusProtocol/isolated-pools/tree/943e7db1855c8ab4a09104f1d09e2b2db0506b95/deployments). Use these proxy addresses—not a contract named `RewardsDistributorImpl`—and verify the network, proxy, and `rewardToken()` value on the explorer before submitting a claim.

| Network | Pool | Reward token and expected address | RewardsDistributor proxy |
|---|---|---|---|
| BNB Chain | DeFi | BSW — [`0x965f527d9159dce6288a2219db51fc6eef120dd1`](https://bscscan.com/token/0x965f527d9159dce6288a2219db51fc6eef120dd1) | [`0x7524116CEC937ef17B5998436F16d1306c4F7EF8`](https://bscscan.com/address/0x7524116CEC937ef17B5998436F16d1306c4F7EF8) |
| BNB Chain | DeFi | ANKR — [`0xf307910A4c7bbc79691fD374889b36d8531B08e3`](https://bscscan.com/token/0xf307910A4c7bbc79691fD374889b36d8531B08e3) | [`0x14d9A428D0f35f81A30ca8D8b2F3974D3CccB98B`](https://bscscan.com/address/0x14d9A428D0f35f81A30ca8D8b2F3974D3CccB98B) |
| BNB Chain | DeFi | USDT — [`0x55d398326f99059fF775485246999027B3197955`](https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955) | [`0xD86FCff6CCF5C4E277E49e1dC01Ed4bcAb8260ba`](https://bscscan.com/address/0xD86FCff6CCF5C4E277E49e1dC01Ed4bcAb8260ba) |
| BNB Chain | GameFi | FLOKI — [`0xfb5B838b6cfEEdC2873aB27866079AC55363D37E`](https://bscscan.com/token/0xfb5B838b6cfEEdC2873aB27866079AC55363D37E) | [`0x501a91b995Bd41177503A1A4144F3D25BFF869e1`](https://bscscan.com/address/0x501a91b995Bd41177503A1A4144F3D25BFF869e1) |
| BNB Chain | GameFi | RACA — [`0x12BB890508c125661E03b09EC06E404bc9289040`](https://bscscan.com/token/0x12BB890508c125661E03b09EC06E404bc9289040) | [`0x2517A3bEe42EA8f628926849B04870260164b555`](https://bscscan.com/address/0x2517A3bEe42EA8f628926849B04870260164b555) |
| BNB Chain | Liquid Staked BNB | ankrBNB — [`0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827`](https://bscscan.com/token/0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827) | [`0x63aFCe42086c8302659CA0E21F4Eade27Ad85ded`](https://bscscan.com/address/0x63aFCe42086c8302659CA0E21F4Eade27Ad85ded) |
| BNB Chain | Liquid Staked BNB | stkBNB — [`0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16`](https://bscscan.com/token/0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16) | [`0x79397BAc982718347406Ebb7A6a8845896fdD8dE`](https://bscscan.com/address/0x79397BAc982718347406Ebb7A6a8845896fdD8dE) |
| BNB Chain | Liquid Staked BNB | SD — [`0x3BC5AC0dFdC871B365d159f728dd1B9A0B5481E8`](https://bscscan.com/token/0x3BC5AC0dFdC871B365d159f728dd1B9A0B5481E8) | [`0x6a7b50EccC721f0Fa9FD7879A7dF082cdA60Db78`](https://bscscan.com/address/0x6a7b50EccC721f0Fa9FD7879A7dF082cdA60Db78) |
| BNB Chain | Liquid Staked BNB | SD — [`0x3BC5AC0dFdC871B365d159f728dd1B9A0B5481E8`](https://bscscan.com/token/0x3BC5AC0dFdC871B365d159f728dd1B9A0B5481E8) | [`0xBE607b239a8776B47159e2b0E9E65a7F1DAA6478`](https://bscscan.com/address/0xBE607b239a8776B47159e2b0E9E65a7F1DAA6478) |
| BNB Chain | Liquid Staked BNB | lisUSD — [`0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5`](https://bscscan.com/token/0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5) | [`0x888E317606b4c590BBAD88653863e8B345702633`](https://bscscan.com/address/0x888E317606b4c590BBAD88653863e8B345702633) |
| BNB Chain | Meme | BabyDoge — [`0xc748673057861a797275CD8A068AbB95A902e8de`](https://bscscan.com/token/0xc748673057861a797275CD8A068AbB95A902e8de) | [`0xC1044437AbfD8592150d612185581c5600851d44`](https://bscscan.com/address/0xC1044437AbfD8592150d612185581c5600851d44) |
| BNB Chain | Stablecoins | lisUSD — [`0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5`](https://bscscan.com/token/0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5) | [`0xBA711976CdF8CF3288bF721f758fB764503Eb1f6`](https://bscscan.com/address/0xBA711976CdF8CF3288bF721f758fB764503Eb1f6) |
| BNB Chain | Stablecoins | lisUSD — [`0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5`](https://bscscan.com/token/0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5) | [`0xA31185D804BF9209347698128984a43A67Ce6d11`](https://bscscan.com/address/0xA31185D804BF9209347698128984a43A67Ce6d11) |
| BNB Chain | Stablecoins | ANGLE — [`0x97B6897AAd7aBa3861c04C0e6388Fc02AF1F227f`](https://bscscan.com/token/0x97B6897AAd7aBa3861c04C0e6388Fc02AF1F227f) | [`0x177ED4625F57cEa2804EA3A396c8Ff78f314F1CA`](https://bscscan.com/address/0x177ED4625F57cEa2804EA3A396c8Ff78f314F1CA) |
| BNB Chain | Tron | BTT — [`0x352Cb5E19b12FC216548a2677bD0fce83BaE434B`](https://bscscan.com/token/0x352Cb5E19b12FC216548a2677bD0fce83BaE434B) | [`0x804F3893d3c1C3EFFDf778eDDa7C199129235882`](https://bscscan.com/address/0x804F3893d3c1C3EFFDf778eDDa7C199129235882) |
| BNB Chain | Tron | WIN — [`0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99`](https://bscscan.com/token/0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99) | [`0x6536123503DF76BDfF8207e4Fb0C594Bc5eFD00A`](https://bscscan.com/address/0x6536123503DF76BDfF8207e4Fb0C594Bc5eFD00A) |
| BNB Chain | Tron | TRX — [`0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3`](https://bscscan.com/token/0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3) | [`0x22af8a65639a351a9D5d77d5a25ea5e1Cf5e9E6b`](https://bscscan.com/address/0x22af8a65639a351a9D5d77d5a25ea5e1Cf5e9E6b) |
| BNB Chain | Tron | USDD — [`0xd17479997F34dd9156Deef8F95A52D81D265be9c`](https://bscscan.com/token/0xd17479997F34dd9156Deef8F95A52D81D265be9c) | [`0x08e4AFd80A5849FDBa4bBeea86ed470D697e4C54`](https://bscscan.com/address/0x08e4AFd80A5849FDBa4bBeea86ed470D697e4C54) |
| Ethereum | Curve | XVS — [`0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A`](https://etherscan.io/token/0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A) | [`0x8473B767F68250F5309bae939337136a899E43F9`](https://etherscan.io/address/0x8473B767F68250F5309bae939337136a899E43F9) |
| Ethereum | Curve | CRV — [`0xD533a949740bb3306d119CC777fa900bA034cd52`](https://etherscan.io/token/0xD533a949740bb3306d119CC777fa900bA034cd52) | [`0x5f65A7b60b4F91229B8484F80bc2EEc52758EAf9`](https://etherscan.io/address/0x5f65A7b60b4F91229B8484F80bc2EEc52758EAf9) |
| Ethereum | Curve | XVS — [`0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A`](https://etherscan.io/token/0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A) | [`0x461dE281c453F447200D67C9Dd31b3046c8f49f8`](https://etherscan.io/address/0x461dE281c453F447200D67C9Dd31b3046c8f49f8) |
| Ethereum | Liquid Staked ETH | XVS — [`0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A`](https://etherscan.io/token/0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A) | [`0x7A91bEd36D96E4e644d3A181c287E0fcf9E9cc98`](https://etherscan.io/address/0x7A91bEd36D96E4e644d3A181c287E0fcf9E9cc98) |
| Ethereum | Liquid Staked ETH | wstETH — [`0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0`](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0) | [`0xe72Aa7BaB160eaa2605964D2379AA56Cb4b9A1BB`](https://etherscan.io/address/0xe72Aa7BaB160eaa2605964D2379AA56Cb4b9A1BB) |
| Ethereum | Liquid Staked ETH | USDC — [`0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`](https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) | [`0xDCB0CfA130496c749738Acbe2d6aA06C7C320f06`](https://etherscan.io/address/0xDCB0CfA130496c749738Acbe2d6aA06C7C320f06) |
| Ethereum | Liquid Staked ETH | XVS — [`0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A`](https://etherscan.io/token/0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A) | [`0x1e25CF968f12850003Db17E0Dba32108509C4359`](https://etherscan.io/address/0x1e25CF968f12850003Db17E0Dba32108509C4359) |
| Arbitrum | Liquid Staked ETH | XVS — [`0xc1Eb7689147C81aC840d4FF0D298489fc7986d52`](https://arbiscan.io/token/0xc1Eb7689147C81aC840d4FF0D298489fc7986d52) | [`0x6204Bae72dE568384Ca4dA91735dc343a0C7bD6D`](https://arbiscan.io/address/0x6204Bae72dE568384Ca4dA91735dc343a0C7bD6D) |

Not every deprecated pool had a RewardsDistributor deployment record. If your pool appears in the table, check each listed proxy for that pool; duplicate reward-token symbols represent distinct distributors and must not be deduplicated.

Before claiming, read the distributor's `comptroller()` and `maxLoopsLimit()`, then call `getAllMarkets()` on that Comptroller. Check `isMarketListed(<vToken address>)` for every returned market:

* If every returned market is still listed and the number of markets does not exceed `maxLoopsLimit()`, use **Write as Proxy** and call the one-argument `claimRewardToken(address)` with your address.
* If any returned market is unlisted, the one-argument overload will revert because it passes the complete historical market array to the claim logic. If the array is longer than `maxLoopsLimit()`, it will also revert. Instead, use `claimRewardToken(address,address[])`: pass your address first, then all verified listed vToken addresses returned by that Comptroller. Do not include an unlisted vToken, and split the list into separate calls no larger than `maxLoopsLimit()` if necessary.

Both overloads update rewards for the markets they process and then attempt to pay the distributor's recorded aggregate accrued amount. The two-argument fallback does not calculate additional pending rewards from omitted or unlisted markets. If rewards from an unlisted market have not already been recorded, the current claim path cannot update them; ask for help through the [Venus community forum](https://community.venus.io/) because a protocol or governance action may be required.

Each call covers only that proxy's reward token and Comptroller. It does not claim other reward tokens, other distributors, other pools, or other networks. No token approval is required.

After confirmation, verify the reward-token transfer. If the distributor does not hold enough reward tokens, the contract retains the accrued amount instead of making a partial payment. Claiming rewards is optional and independent of repaying and redeeming positions.
