# XVS Bridge contract families

The XVS bridge remains an active LayerZero OFT V2 deployment. This section is pinned to the stable [`token-bridge` v2.7.0 tag](https://github.com/VenusProtocol/token-bridge/tree/v2.7.0), rather than the moving `develop` branch.

The contract names use `ProxyOFT` in the LayerZero token-model sense. `XVSProxyOFTSrc` and `XVSProxyOFTDest` are not EIP-1967 upgradeable proxies in the tagged mainnet artifacts. `XVSBridgeAdmin` is the transparent proxy.

| Network role | Contracts | Token behavior |
| --- | --- | --- |
| BNB Chain source | Native XVS, `XVSProxyOFTSrc`, `XVSBridgeAdmin` | XVS is locked on outbound transfers and released on inbound transfers |
| Ethereum, Arbitrum, opBNB, Optimism, Base, zkSync Era, and Unichain destinations | Omnichain `XVS`, `XVSProxyOFTDest`, `XVSBridgeAdmin` | XVS is burned on outbound transfers and minted on inbound transfers, subject to the TokenController mint cap |

`BaseXVSProxyOFT` is abstract and is not a deployment address. `TokenController` is inherited by the destination-chain XVS token. The bridge uses LayerZero V1 `uint16` endpoint IDs (named chain IDs in the ABI) and OFT V2 APIs; these must not be replaced with EVM chain IDs, LayerZero V2 EIDs, or OApp selectors.

LayerZero marks V1 deprecated for new integrations in its [V1 deployment reference](https://docs.layerzero.network/v1/deployments/deployed-contracts). The existing Venus bridge is nevertheless active. “Deprecated upstream transport” and “retired Venus product” are different lifecycle claims.

A deployment on two networks does not by itself prove that their trusted-remote path is enabled. For user transactions, use the networks exposed by the current Venus interface and verify the selected route, limits, mint capacity, and native-gas fee immediately before signing. See the [XVS omnichain registry](../../deployed-contracts/xvs-omnichain.md) for addresses.
