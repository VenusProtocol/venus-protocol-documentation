# XVSVaultProxy

`XVSVaultProxy` is a custom delegate proxy used on every XVS Vault deployment. Users and integrations call the proxy; state is stored at the proxy while `implementation()` supplies the logic.

The constructor sets the initial admin. The current admin can call `_setPendingImplementation(address)` and `_setPendingAdmin(address)`. A pending implementation or admin accepts through `_acceptImplementation()` or `_acceptAdmin()`.

These functions return protocol error codes: `0` means success. Decode the return value and emitted events instead of relying only on EVM transaction success.

{% hint style="warning" %}
Implementation and admin are chain-specific. Resolve `implementation()`, `admin()`, pending values, pause state, and time mode on the exact proxy. See the [mainnet XVS Vault version map](README.md).
{% endhint %}

Source: [XVSVaultProxy.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/XVSVault/XVSVaultProxy.sol).
