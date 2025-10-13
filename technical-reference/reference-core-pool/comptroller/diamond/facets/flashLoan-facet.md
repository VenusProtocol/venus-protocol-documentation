# FlashLoanFacet
This facet contract contains functions for flash loan operations

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

