# FlashLoanFacet
This facet contract contains functions for flash loan operations

{% hint style="warning" %}
BNB Core Pool only. At block `118,363,255`, this facet was routed to `0xAC54A4D148690b7FDA22B1D29c4439aCBF668fb2`. Call its selectors through the Unitroller, verify the live selector assignment, authorized caller, pause state, and market implementation, and treat the [v10.3.0 source](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Comptroller/Diamond/facets/FlashLoanFacet.sol) as the source reference rather than a permanent deployed ABI.
{% endhint %}

# Solidity API

### executeFlashLoan

Executes a flashLoan operation with the requested assets

```solidity
function executeFlashLoan(
    address payable onBehalf,
    address payable receiver,
    VToken[] memory vTokens,
    uint256[] memory underlyingAmounts,
    bytes memory param
) external
```

Transfers the specified assets to the receiver contract and handles repayment. Supports both full repayment and partial repayment where unpaid amounts become ongoing debt positions.

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| onBehalf | address payable | The address of the user whose debt position will be created in case of partial repayment |
| receiver | address payable | The address of the contract that will receive the flashLoan amount and execute the operation |
| vTokens | VToken[] | The addresses of the vToken assets to be loaned |
| underlyingAmounts | uint256[] | The amounts of each underlying assets to be loaned |
| param | bytes | The bytes passed in the executeOperation call |

- - -
