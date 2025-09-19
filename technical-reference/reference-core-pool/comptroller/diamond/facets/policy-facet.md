# PolicyFacet
This facet contract contains all the external pre-hook functions related to vToken

# Solidity API

### mintAllowed

Checks if the account should be allowed to mint tokens in the given market

```solidity
function mintAllowed(address vToken, address minter, uint256 mintAmount) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the mint against |
| minter | address | The account which would get the minted tokens |
| mintAmount | uint256 | The amount of underlying being supplied to the market in exchange for tokens |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 0 if the mint is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

- - -

### mintVerify

Validates mint and reverts on rejection. May emit logs.

```solidity
function mintVerify(address vToken, address minter, uint256 actualMintAmount, uint256 mintTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset being minted |
| minter | address | The address minting the tokens |
| actualMintAmount | uint256 | The amount of the underlying asset being minted |
| mintTokens | uint256 | The number of tokens being minted |

- - -

### redeemAllowed

Checks if the account should be allowed to redeem tokens in the given market

```solidity
function redeemAllowed(address vToken, address redeemer, uint256 redeemTokens) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the redeem against |
| redeemer | address | The account which would redeem the tokens |
| redeemTokens | uint256 | The number of vTokens to exchange for the underlying asset in the market |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 0 if the redeem is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

- - -

### redeemVerify

Validates redeem and reverts on rejection. May emit log

```solidity
function redeemVerify(address vToken, address redeemer, uint256 redeemAmount, uint256 redeemTokens) external pure
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset being redeemed |
| redeemer | address | The address redeeming the tokens |
| redeemAmount | uint256 | The amount of the underlying asset being redeemed |
| redeemTokens | uint256 | The number of tokens being redeemed |

- - -

### borrowAllowed

Checks if the account should be allowed to borrow the underlying asset of the given market

```solidity
function borrowAllowed(address vToken, address borrower, uint256 borrowAmount) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the borrow against |
| borrower | address | The account which would borrow the asset |
| borrowAmount | uint256 | The amount of underlying the account would borrow |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 0 if the borrow is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

- - -

### borrowVerify

Validates borrow and reverts on rejection. May emit log

```solidity
function borrowVerify(address vToken, address borrower, uint256 borrowAmount) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset whose underlying is being borrowed |
| borrower | address | The address borrowing the underlying |
| borrowAmount | uint256 | The amount of the underlying asset requested to borrow |

- - -

### repayBorrowAllowed

Checks if the account should be allowed to repay a borrow in the given market

```solidity
function repayBorrowAllowed(address vToken, address payer, address borrower, uint256 repayAmount) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the repay against |
| payer | address | The account which would repay the asset |
| borrower | address | The account which borrowed the asset |
| repayAmount | uint256 | The amount of the underlying asset the account would repay |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 0 if the repay is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

- - -

### repayBorrowVerify

Validates repayBorrow and reverts on rejection. May emit log

```solidity
function repayBorrowVerify(address vToken, address payer, address borrower, uint256 actualRepayAmount, uint256 borrowerIndex) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset being repaid |
| payer | address | The address repaying the borrow |
| borrower | address | The address of the borrower |
| actualRepayAmount | uint256 | The amount of underlying being repaid |
| borrowerIndex | uint256 |  |

- - -

### liquidateBorrowAllowed

Checks if the liquidation should be allowed to occur

```solidity
function liquidateBorrowAllowed(address vTokenBorrowed, address vTokenCollateral, address liquidator, address borrower, uint256 repayAmount) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |
| repayAmount | uint256 | The amount of underlying being repaid |

- - -

### liquidateBorrowVerify

Validates liquidateBorrow and reverts on rejection. May emit logs.

```solidity
function liquidateBorrowVerify(address vTokenBorrowed, address vTokenCollateral, address liquidator, address borrower, uint256 actualRepayAmount, uint256 seizeTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |
| actualRepayAmount | uint256 | The amount of underlying being repaid |
| seizeTokens | uint256 | The amount of collateral token that will be seized |

- - -

### seizeAllowed

Checks if the seizing of assets should be allowed to occur

```solidity
function seizeAllowed(address vTokenCollateral, address vTokenBorrowed, address liquidator, address borrower, uint256 seizeTokens) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |
| seizeTokens | uint256 | The number of collateral tokens to seize |

- - -

### seizeVerify

Validates seize and reverts on rejection. May emit log

```solidity
function seizeVerify(address vTokenCollateral, address vTokenBorrowed, address liquidator, address borrower, uint256 seizeTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |
| seizeTokens | uint256 | The number of collateral tokens to seize |

- - -

### transferAllowed

Checks if the account should be allowed to transfer tokens in the given market

```solidity
function transferAllowed(address vToken, address src, address dst, uint256 transferTokens) external returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to verify the transfer against |
| src | address | The account which sources the tokens |
| dst | address | The account which receives the tokens |
| transferTokens | uint256 | The number of vTokens to transfer |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 0 if the transfer is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

- - -

### transferVerify

Validates transfer and reverts on rejection. May emit log

```solidity
function transferVerify(address vToken, address src, address dst, uint256 transferTokens) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset being transferred |
| src | address | The account which sources the tokens |
| dst | address | The account which receives the tokens |
| transferTokens | uint256 | The number of vTokens to transfer |

- - -

### getAccountLiquidity

Determine the current account liquidity wrt collateral requirements

```solidity
function getAccountLiquidity(address account) external view returns (uint256, uint256, uint256)
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (possible error code (semi-opaque), account liquidity in excess of collateral requirements,          account shortfall below collateral requirements) |
| [1] | uint256 |  |
| [2] | uint256 |  |

- - -

### getHypotheticalAccountLiquidity

Determine what the account liquidity would be if the given amounts were redeemed/borrowed

```solidity
function getHypotheticalAccountLiquidity(address account, address vTokenModify, uint256 redeemTokens, uint256 borrowAmount) external view returns (uint256, uint256, uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account to determine liquidity for |
| vTokenModify | address | The market to hypothetically redeem/borrow in |
| redeemTokens | uint256 | The number of tokens to hypothetically redeem |
| borrowAmount | uint256 | The amount of underlying to hypothetically borrow |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (possible error code (semi-opaque), hypothetical account liquidity in excess of collateral requirements,          hypothetical account shortfall below collateral requirements) |
| [1] | uint256 |  |
| [2] | uint256 |  |

- - -

### _setVenusSpeeds

Set XVS speed for a single market

```solidity
function _setVenusSpeeds(contract VToken[] vTokens, uint256[] supplySpeeds, uint256[] borrowSpeeds) external
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken[] | The market whose XVS speed to update |
| supplySpeeds | uint256[] | New XVS speed for supply |
| borrowSpeeds | uint256[] | New XVS speed for borrow |

- - -

### executeFlashLoan

The executeFlashLoan function facilitates a flash loan, an uncollateralized loan where assets that are borrowed must be repaid within the same transaction, enabling DeFi strategies like arbitrage and liquidations. The repayment is enforced by a safety mechanism:

- A user must repay the loan plus fees in full.
- If a user with existing Venus collateral fails to fully repay, the unpaid amount is seamlessly converted into a borrow position secured by their supplied assets.
- For a user with no collateral in Venus, the transaction will revert if not repaid in full, as there are no assets to secure the resulting debt.

```solidity
function executeFlashLoan(
    address payable initiator,
    address payable receiver,
    VToken[] memory vTokens,
    uint256[] memory underlyingAmounts,
    bytes memory param
) external 
```

#### Parameters
| Name              | Type                |Description                                                      |
|-------------------|---------------------------------------------------------------------------------------|
| initiator         | address payable     | The address initiating the flashloan                            |
| receiver          | address payable     | The contract receiving the assets                                |
| vTokens           | VToken[] calldata   | Array of vToken markets to borrow from                           |
| underlyingAmounts | uint256[] calldata  | Amounts of each asset to borrow                                  |
| param             | bytes calldata      | Arbitrary data for custom logic                                  |

#### Return Values
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

---


