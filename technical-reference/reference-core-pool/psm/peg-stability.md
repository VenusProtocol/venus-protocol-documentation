# Peg Stability Module

The BNB Chain Peg Stability Module (PSM) swaps USDT and VAI. It is a transparent proxy at [`0xC138aa4E424D1A8539e8F38Af5a754a2B7c3Cc36`](https://bscscan.com/address/0xC138aa4E424D1A8539e8F38Af5a754a2B7c3Cc36).

## Live version and configuration

At BNB Chain block `118,364,540`:

| Field | Value |
| --- | --- |
| Implementation | `0x9664568e5131e85f67d87fcd55b249f5d25fa43e` |
| Paused | No |
| Stable token | USDT `0x55d398326f99059fF775485246999027B3197955` |
| VAI | `0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7` |
| Fee in | 0 basis points |
| Fee out | 10 basis points |
| VAI mint cap | 5,000,000 VAI |
| VAI attributed to PSM mints | 465,696.242314352647832029 VAI |
| Treasury | `0xF322942f644A996A617BD29c16BD7d231d9F35E9` |
| Access Control Manager | `0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555` |

These values are governance-configurable. Read the proxy at the relevant block before constructing a swap.

## Swap API

### `swapStableForVAI`

```solidity
function swapStableForVAI(address receiver, uint256 stableTknAmount)
    external
    returns (uint256 vaiOut)
```

The caller must approve the PSM to transfer USDT. The PSM supports fee-on-transfer accounting by measuring the amount actually received. It mints the net VAI to `receiver`, not necessarily to the caller. The gross USD value counts against `vaiMintCap`; any fee is minted to the treasury.

### `swapVAIForStable`

```solidity
function swapVAIForStable(address receiver, uint256 stableTknAmount)
    external
    returns (uint256 vaiBurned)
```

The caller must approve the PSM to transfer any VAI fee. The requested stable-token amount is sent to `receiver`; the corresponding VAI is burned from the caller and `vaiMinted` is reduced.

### Preview functions

```solidity
function previewSwapStableForVAI(uint256 stableTknAmount) external view returns (uint256)
function previewSwapVAIForStable(uint256 stableTknAmount) external view returns (uint256)
```

Preview results can differ from execution if oracle prices or configuration change before the transaction is mined.

## Administration

Every state-changing administrative function below checks its exact signature through the Access Control Manager:

* `pause()` and `resume()`;
* `setFeeIn(uint256)` and `setFeeOut(uint256)`;
* `setVAIMintCap(uint256)`;
* `setVenusTreasury(address)`;
* `setOracle(address)`.

Permission is signature-specific. Check the live ACM grantee for the target proxy rather than treating “governance” or “guardian” as a universal role.

Source: [PegStability.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/PegStability/PegStability.sol).
