# VTokenProxyFactory

This factory deploys a ERC-1967 compliant transparent proxy and initializes it with the implementation of VToken.

## deploy

```solidity
function deployVTokenProxy(
    VTokenArgs memory input
) external returns (VToken)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `input` | VTokenArgs memory | `VTokenArgs` struct with the parameters for the new market |

The parameters are defined as follows:
```
struct VTokenArgs {
    address underlying_;
    ComptrollerInterface comptroller_;
    InterestRateModel interestRateModel_;
    uint256 initialExchangeRateMantissa_;
    string name_;
    string symbol_;
    uint8 decimals_;
    address payable admin_;
    AccessControlManager accessControlManager_;
    VTokenInterface.RiskManagementInit riskManagement;
    address vTokenProxyAdmin_;
    VToken tokenImplementation_;
}

struct RiskManagementInit {
    address shortfall;
    address payable riskFund;
    address payable protocolShareReserve;
}
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| `underlying_` | address | The underlying BEP-20 token to list |
| `comptroller_` | address | The pool Comptroller |
| `interestRateModel_` | address | Interest rate model to use |
| `initialExchangeRateMantissa_` | uint256 | The vToken to underlying exchange rate to start with |
| `name_` | address | vToken name (usually it's "Venus " + underlying name) |
| `symbol_` | address | vToken symbol (usually it's "v" + underlying symbol) |
| `decimals_` | address | vToken decimals (the convention is to use 8 decimals for vTokens) |
| `admin_` | address | vToken admin (should be Governance). Note that this is **not** the upgradeability administrator |
| `accessControlManager_` | address | [AccessControlManager](../governance/access-control-manager.md) contract |
| `riskManagement` | RiskManagementInit | Addreses of the [Shortfall](../shortfall.md), [Risk Fund](../risk-fund.md), and [Protocol Share Reserve](../protocol-share-reserve.md) contracts |
| `vTokenProxyAdmin_` | address | The address of the upgradeability admin |
| `tokenImplementation_` | address | voken implementation contract |
