# XVS Bridge

The Venus interface can bridge XVS among BNB Chain, Ethereum, Arbitrum, opBNB, Optimism, Base, zkSync Era, and Unichain. Available paths and limits are mutable; use the networks and live checks shown by the interface rather than a saved limits table.

## Before you start

* Open the official [XVS Bridge](https://app.venus.io/#/bridge) and confirm the domain before connecting a wallet.
* Keep native gas tokens on the source network.
* Confirm the source and destination networks, connected account, XVS amount, quoted LayerZero fee, bridge address, and wallet spending limit.
* The current interface sends destination XVS to the connected account. Do not use this workflow when you need a different recipient.
* Bridging is asynchronous and depends on both networks, Venus bridge configuration, its oracle and limits, destination mint capacity, and LayerZero V1 messaging.

## Submit a transfer

1. Connect the wallet that holds XVS and select the source network.
2. Choose a different destination network. Switching the source network in the form also requests a wallet network switch.
3. Enter the XVS amount. The interface checks the local balance, single and rolling 24-hour bridge limits, destination mint capacity, and estimated native-token fee.
4. If the interface requests an approval, inspect the exact token, spender, amount, and network before signing. BNB Chain outbound transfers lock native XVS with `transferFrom`; destination-chain transfers burn omnichain XVS through the authorized local bridge.
5. Review the final quote and submit the bridge transaction. The fee can change before inclusion, so reject a wallet request whose value or contract differs from the reviewed transaction.
6. Track the source transaction and the corresponding LayerZero message. The destination balance is final only after the destination transaction succeeds.

## If a transfer is delayed or fails

Do not immediately repeat the transfer: a delayed message can still execute and a duplicate transfer would send another amount. Record the source transaction hash and inspect its LayerZero message and destination status.

Common causes include a paused bridge or token, stale or rejected oracle price, path limits, insufficient destination gas, an untrusted route, blacklisting, or exhausted destination mint capacity. `retryMessage` is an administrative recovery path for a stored failed payload, not a normal user action. Report the transaction hash and both networks through an official Venus support channel if the interface does not recover normally.

## Approval hygiene

An ERC-20 approval remains after a transfer unless it is consumed or revoked. Prefer the amount needed for the intended transaction. After bridging, review the remaining XVS allowance to the source bridge and revoke it if you do not plan to bridge again.
