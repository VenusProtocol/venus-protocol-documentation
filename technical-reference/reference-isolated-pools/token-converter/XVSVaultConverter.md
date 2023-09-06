# XVSVaultConverter
This contract extends the AbtractTokenConverter contract. ProtocolShareReserve will send XVSVault’s  share of the income to this contract which will help to convert the assets to XVS and send them to XVSVaultTreasury.

# Solidity API

### balanceOf

Get the balance for specific token

```solidity
function balanceOf(address tokenAddress) public view returns (uint256 tokenBalance)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddress | address | Address of the token |

- - -

