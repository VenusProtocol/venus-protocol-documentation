# PSM

## Peg Stability Contract.

Contract for swapping stable token for VAI token and vice versa to maintain the peg stability between them.

## Solidity API

```solidity
enum FeeDirection {
  IN,
  OUT
}
```

#### BASIS\_POINTS\_DIVISOR

The divisor used to convert fees to basis points.

```solidity
uint256 BASIS_POINTS_DIVISOR
```

***

#### MANTISSA\_ONE

The mantissa value representing 1 (used for calculations).

```solidity
uint256 MANTISSA_ONE
```

***

#### ONE\_DOLLAR

The value representing one dollar in the stable token.

```solidity
uint256 ONE_DOLLAR
```

***

#### VAI

VAI token contract.

```solidity
contract IVAI VAI
```

***

#### STABLE\_TOKEN\_ADDRESS

The address of the stable token contract.

```solidity
address STABLE_TOKEN_ADDRESS
```

***

#### oracle

The address of ResilientOracle contract wrapped in its interface.

```solidity
contract ResilientOracleInterface oracle
```

***

#### venusTreasury

The address of the Venus Treasury contract.

```solidity
address venusTreasury
```

***

#### feeIn

The incoming stableCoin fee. (Fee for swapStableForVAI).

```solidity
uint256 feeIn
```

***

#### feeOut

The outgoing stableCoin fee. (Fee for swapVAIForStable).

```solidity
uint256 feeOut
```

***

#### vaiMintCap

The maximum amount of VAI that can be minted through this contract.

```solidity
uint256 vaiMintCap
```

***

#### vaiMinted

The total amount of VAI minted through this contract.

```solidity
uint256 vaiMinted
```

***

#### isPaused

A flag indicating whether the contract is currently paused or not.

```solidity
bool isPaused
```

***

#### initialize

Initializes the contract via Proxy Contract with the required parameters.

```solidity
function initialize(address accessControlManager_, address venusTreasury_, address oracleAddress_, uint256 feeIn_, uint256 feeOut_, uint256 vaiMintCap_) external
```

**Parameters**

| Name                   | Type    | Description                                                       |
| ---------------------- | ------- | ----------------------------------------------------------------- |
| accessControlManager\_ | address | The address of the AccessControlManager contract.                 |
| venusTreasury\_        | address | The address where fees will be sent.                              |
| oracleAddress\_        | address | The address of the ResilientOracle contract.                      |
| feeIn\_                | uint256 | The percentage of fees to be applied to a stablecoin -> VAI swap. |
| feeOut\_               | uint256 | The percentage of fees to be applied to a VAI -> stablecoin swap. |
| vaiMintCap\_           | uint256 | The cap for the total amount of VAI that can be minted.           |

***

#### swapVAIForStable

Swaps VAI for a stable token.

```solidity
function swapVAIForStable(address receiver, uint256 stableTknAmount) external returns (uint256)
```

**Parameters**

| Name            | Type    | Description                                    |
| --------------- | ------- | ---------------------------------------------- |
| receiver        | address | The address where the stablecoin will be sent. |
| stableTknAmount | uint256 | The amount of stable tokens to receive.        |

**Return Values**

| Name | Type    | Description                                           |
| ---- | ------- | ----------------------------------------------------- |
| \[0] | uint256 | The amount of VAI received and burnt from the sender. |

***

#### swapStableForVAI

Swaps stable tokens for VAI with fees.

```solidity
function swapStableForVAI(address receiver, uint256 stableTknAmount) external returns (uint256)
```

**Parameters**

| Name            | Type    | Description                                   |
| --------------- | ------- | --------------------------------------------- |
| receiver        | address | The address that will receive the VAI tokens. |
| stableTknAmount | uint256 | The amount of stable tokens to be swapped.    |

**Return Values**

| Name | Type    | Description                         |
| ---- | ------- | ----------------------------------- |
| \[0] | uint256 | Amount of VAI minted to the sender. |

***

#### pause

Pause the PSM contract.

```solidity
function pause() external
```

***

#### resume

Resume the PSM contract.

```solidity
function resume() external
```

***

#### setFeeIn

Set the fee percentage for incoming swaps.

```solidity
function setFeeIn(uint256 feeIn_) external
```

**Parameters**

| Name    | Type    | Description                                |
| ------- | ------- | ------------------------------------------ |
| feeIn\_ | uint256 | The new fee percentage for incoming swaps. |

***

#### setFeeOut

Set the fee percentage for outgoing swaps.

```solidity
function setFeeOut(uint256 feeOut_) external
```

**Parameters**

| Name     | Type    | Description                                |
| -------- | ------- | ------------------------------------------ |
| feeOut\_ | uint256 | The new fee percentage for outgoing swaps. |

***

#### setVenusTreasury

Set the address of the Venus Treasury contract.

```solidity
function setVenusTreasury(address venusTreasury_) external
```

**Parameters**

| Name            | Type    | Description                                     |
| --------------- | ------- | ----------------------------------------------- |
| venusTreasury\_ | address | The new address of the Venus Treasury contract. |

***

#### setOracle

Set the address of the ResilientOracle contract.

```solidity
function setOracle(address oracleAddress_) external
```

**Parameters**

| Name            | Type    | Description                                      |
| --------------- | ------- | ------------------------------------------------ |
| oracleAddress\_ | address | The new address of the ResilientOracle contract. |

***

#### previewSwapVAIForStable

Calculates the amount of VAI that would be burnt from the user.

```solidity
function previewSwapVAIForStable(uint256 stableTknAmount) external view returns (uint256)
```

**Parameters**

| Name            | Type    | Description                                                |
| --------------- | ------- | ---------------------------------------------------------- |
| stableTknAmount | uint256 | The amount of stable tokens to be received after the swap. |

**Return Values**

| Name | Type    | Description                                          |
| ---- | ------- | ---------------------------------------------------- |
| \[0] | uint256 | The amount of VAI that would be taken from the user. |

***

#### previewSwapStableForVAI

Calculates the amount of VAI that would be sent to the receiver.

```solidity
function previewSwapStableForVAI(uint256 stableTknAmount) external view returns (uint256)
```

**Parameters**

| Name            | Type    | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| stableTknAmount | uint256 | The amount of stable tokens provided for the swap. |

**Return Values**

| Name | Type    | Description                                           |
| ---- | ------- | ----------------------------------------------------- |
| \[0] | uint256 | The amount of VAI that would be sent to the receiver. |

***
