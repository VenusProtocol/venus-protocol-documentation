# Native Token Gateway

The NativeTokenGateway contract serves the purpose of facilitating seamless interaction with Wrapped Native Token markets, even for users who do not possess any Wrapped Native Tokens. It achieves this by allowing users to utilize the native currency in their wallets directly.

## Overview

The Venus contracts deployed on the new networks do not directly support native currencies. For example on Ethereum instead of a native ether market there is a market for WETH. Wrapped Native Token markets address this limitation by facilitating the conversion of native currency into a format compatible with the ERC-20 standard.

To streamline user experience and eliminate the need for an additional transaction to convert native tokens into wrapped tokens, wrapping an unwrapping of native tokens is done behind the scenes when users interact with the market.

## User Journey

The introduction of the NativeTokenGateway contract significantly enhances the user experience when interacting with wrapped native token markets. Unlike before, where users were required to have the wrapped native token to engage with markets, they now have the flexibility to choose between native currency or wrapped version for market interaction.

If the user opts for native currency, the following functions are executed to facilitate interaction with the protocol:

### Approve Delegate

The `updateDelegate` function facilitates the granting or revocation of borrowing and redeeming delegate rights to or from an account. By invoking this function, borrowing delegate rights or redeeming delegate rights can be assigned to a specific address (delegate), enabling them to borrow or redeeming funds on behalf of the User.

This mechanism provides flexibility and control over borrowing and redeeming activities within the protocol, enhancing the overall efficiency and functionality of the system.

## Interaction with the NativeTokenGateway contract

### Supply (**wrapAndSupply**)

* The `wrapAndSupply` function is invoked sending the native currency, and the execution proceeds as follows:
  * Native currency is wrapped, providing the wrapped token.
  * VWrappedNative tokens are minted on behalf of the user.
  * VWrappedNative tokens are transferred to the user.

### Redeem

1. **redeemUnderlyingAndUnwrap**
   * The user approves the NativeTokenGateway contract as the delegate.
   * The `redeemUnderlyingAndUnwrap` function is called with the amount of underlying tokens to redeem, and the execution proceeds as follows:
     * VWrappedNative tokens are redeemed by the NativeTokenGateway contract on behalf of the user.
     * Received wrapped native tokens are unwrapped to obtain native currency.
     * Native currency is transferred to the user.
2. **redeemAndUnwrap**
   * The user approves the NativeTokenGateway contract as the delegate.
   * The `redeemAndUnwrap` function is called with the amount of VWrappedNative tokens to redeem, and the execution proceeds as follows:
     * VWrappedNative tokens are redeemed by the NativeTokenGateway contract on behalf of the user.
     * Received wrapped native tokens are unwrapped to obtain native currency.
     * Native currency is transferred to the user.

### Borrow (**borrowAndUnwrap**)

* The user approves the NativeTokenGateway contract as the delegate.
* The `borrowAndUnwrap` function is invoked, and the execution proceeds as follows:
  * Wrapped native tokens are borrowed on behalf of the user.
  * The borrowed wrapped native tokens are unwrapped to obtain native currency.
  * Native currency is transferred to the user.

### Repay (**wrapAndRepay**)

* The `wrapAndRepay` function is invoked sending the native currency, and the execution proceeds as follows:
  * The native currency sent is wrapped, providing the wrapped native.
  * The NativeTokenGateway repays the debt on behalf of the user.
  * Any unused native currency for repayment is returned to the user.
