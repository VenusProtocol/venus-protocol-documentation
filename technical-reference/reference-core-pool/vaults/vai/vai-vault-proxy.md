# VAIVaultProxy

`VAIVaultProxy` is a custom delegate proxy. Users and integrations call the proxy; state is stored at the proxy while the implementation supplies logic.

## BNB deployment

At block `118,364,540`:

| Field | Address |
| --- | --- |
| Proxy | `0x0667Eed0a0aAb930af74a3dfeDD263A73994f216` |
| `vaiVaultImplementation()` | `0xA52f2a56aBb7cbDD378bC36c6088fAfEaf9AC423` |
| `admin()` | `0x939bD8d64c0A9583A7Dcea9933f7b21697ab6396` |
| `pendingVAIVaultImplementation()` | Read live before an upgrade |
| `pendingAdmin()` | Read live before an admin transfer |

The constructor initially sets `admin` to the deployer. The current admin can call `_setPendingImplementation(address)` and `_setPendingAdmin(address)`. A pending implementation or admin must accept its role through `_acceptImplementation()` or `_acceptAdmin()` respectively.

These methods return protocol error codes: `0` means success. Decode the return value and emitted events instead of relying only on EVM transaction success.

Source: [VAIVaultProxy.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/VAIVault/VAIVaultProxy.sol).
