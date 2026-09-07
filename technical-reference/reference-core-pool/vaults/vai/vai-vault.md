# VAI Vault API

This reference applies to the BNB Chain VAI Vault proxy `0x0667Eed0a0aAb930af74a3dfeDD263A73994f216`, which used implementation `0xA52f2a56aBb7cbDD378bC36c6088fAfEaf9AC423` at block `118,364,540`.

{% hint style="warning" %}
Call the proxy, not the implementation. Verify `vaiVaultImplementation()`, `vaultPaused()`, token addresses, reward funding, and live permissions at the block relevant to the transaction.
{% endhint %}

## User functions

```solidity
function deposit(uint256 amount) external
function withdraw(uint256 amount) external
function claim() external
function claim(address account) external
function pendingXVS(address user) public view returns (uint256)
function updatePendingRewards() public
```

`deposit` transfers VAI from the caller and therefore requires an underlying VAI allowance. `withdraw` returns staked VAI. `claim(address)` pays the named account; it does not redirect that account's rewards to the caller.

The vault can record rewards that have not yet been distributed. Check both `pendingXVS` and current reward funding before presenting a claim as guaranteed.

## Administration

* `pause()` and `resume()` are signature-gated through the Access Control Manager.
* `_become(VAIVaultProxy)` can accept an implementation only when called by the proxy admin.
* `setAccessControl(address)` is restricted to the proxy admin.
* `setVenusInfo(address xvs, address vai)` updates the token references, in that order, and is restricted to the proxy admin.

Permission assignments and token addresses can change. Query the proxy and ACM instead of relying on a static caller label.

Source: [VAIVault.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/VAIVault/VAIVault.sol).
