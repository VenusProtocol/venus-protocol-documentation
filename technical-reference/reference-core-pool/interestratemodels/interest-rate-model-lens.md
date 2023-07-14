# InterestRateModelLens

## InterestRateModelLens Contract

Lens for querying interest rate model simulations

## Solidity API

```solidity
struct SimulationResponse {
  uint256[] borrowSimulation;
  uint256[] supplySimulation;
}
```

#### getSimulationResponse

Simulate interest rate curve fo a specific interest rate model given a reference borrow amount and reserve factor

```solidity
function getSimulationResponse(uint256 referenceAmountInWei, address interestRateModel, uint256 reserveFactorMantissa) external view returns (struct InterestRateModelLens.SimulationResponse)
```

**Parameters**

| Name                  | Type    | Description                                 |
| --------------------- | ------- | ------------------------------------------- |
| referenceAmountInWei  | uint256 | Borrow amount to use in simulation          |
| interestRateModel     | address | Address for interest rate model to simulate |
| reserveFactorMantissa | uint256 | Reserve Factor to use in simulation         |

**Return Values**

| Name | Type                                            | Description |
| ---- | ----------------------------------------------- | ----------- |
| \[0] | struct InterestRateModelLens.SimulationResponse |             |

