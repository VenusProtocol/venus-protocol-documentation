# Comptroller Contract

# Solidity API

### getAssetsIn

Returns the assets an account has entered

```solidity
function getAssetsIn(address account) external view returns (contract VToken[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to pull assets for |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | contract VToken\[] | A dynamic list with the assets the account has entered |

---

### checkMembership

Returns whether the given account is entered in the given asset

```solidity
function checkMembership(address account, contract VToken vToken) external view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the account to check |
| vToken | contract VToken | The vToken to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | True if the account is in the asset, otherwise false. |

---

### enterMarkets

Add assets to be included in account liquidity calculation

```solidity
function enterMarkets(address[] vTokens) external returns (uint256[])
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | address\[] | The list of addresses of the vToken markets to be enabled |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256\[] | Success indicator for whether each corresponding market was entered |

---

### exitMarket

Removes asset from sender's account liquidity calculation

```solidity
function exitMarket(address vTokenAddress) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenAddress | address | The address of the asset to be removed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | Whether or not the account successfully exited the market |

---

### updateDelegate

Grants or revokes the borrowing delegate rights to / from an account.
If allowed, the delegate will be able to borrow funds on behalf of the sender.
Upon a delegated borrow, the delegate will receive the funds, and the borrower
will see the debt on their account.

```solidity
function updateDelegate(address delegate, bool allowBorrows) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| delegate | address | The address to update the rights for |
| allowBorrows | bool | Whether to grant (true) or revoke (false) the rights |

---

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
| \[0] | uint256 | 0 if the mint is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

---

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

---

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
| \[0] | uint256 | 0 if the redeem is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

---

### redeemVerify

Validates redeem and reverts on rejection. May emit logs.

```solidity
function redeemVerify(address vToken, address redeemer, uint256 redeemAmount, uint256 redeemTokens) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset being redeemed |
| redeemer | address | The address redeeming the tokens |
| redeemAmount | uint256 | The amount of the underlying asset being redeemed |
| redeemTokens | uint256 | The number of tokens being redeemed |

---

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
| \[0] | uint256 | 0 if the borrow is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

---

### borrowVerify

Validates borrow and reverts on rejection. May emit logs.

```solidity
function borrowVerify(address vToken, address borrower, uint256 borrowAmount) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | Asset whose underlying is being borrowed |
| borrower | address | The address borrowing the underlying |
| borrowAmount | uint256 | The amount of the underlying asset requested to borrow |

---

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
| \[0] | uint256 | 0 if the repay is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

---

### repayBorrowVerify

Validates repayBorrow and reverts on rejection. May emit logs.

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

---

### liquidateBorrowAllowed

Checks if the liquidation should be allowed to occur

```solidity
function liquidateBorrowAllowed(address vTokenBorrowed, address vTokenCollateral, address liquidator, address borrower, uint256 repayAmount) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Asset which was borrowed by the borrower |
| vTokenCollateral | address | Asset which was used as collateral and will be seized |
| liquidator | address | The address repaying the borrow and seizing the collateral |
| borrower | address | The address of the borrower |
| repayAmount | uint256 | The amount of underlying being repaid |

---

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

---

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

---

### seizeVerify

Validates seize and reverts on rejection. May emit logs.

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

---

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
| \[0] | uint256 | 0 if the transfer is allowed, otherwise a semi-opaque error code (See ErrorReporter.sol) |

---

### transferVerify

Validates transfer and reverts on rejection. May emit logs.

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

---

### getAccountLiquidity

Determine the current account liquidity wrt collateral requirements

```solidity
function getAccountLiquidity(address account) external view returns (uint256, uint256, uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (possible error code (semi-opaque), account liquidity in excess of collateral requirements,          account shortfall below collateral requirements) |
| \[1] | uint256 |  |
| \[2] | uint256 |  |

---

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
| \[0] | uint256 | (possible error code (semi-opaque), hypothetical account liquidity in excess of collateral requirements,          hypothetical account shortfall below collateral requirements) |
| \[1] | uint256 |  |
| \[2] | uint256 |  |

---

### liquidateCalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateCalculateSeizeTokens(address vTokenBorrowed, address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | The address of the borrowed vToken |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| \[1] | uint256 |  |

---

### liquidateVAICalculateSeizeTokens

Calculate number of tokens of collateral asset to seize given an underlying amount

```solidity
function liquidateVAICalculateSeizeTokens(address vTokenCollateral, uint256 actualRepayAmount) external view returns (uint256, uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenCollateral | address | The address of the collateral vToken |
| actualRepayAmount | uint256 | The amount of vTokenBorrowed underlying to convert into vTokenCollateral tokens |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | (errorCode, number of vTokenCollateral tokens to be seized in a liquidation) |
| \[1] | uint256 |  |

---

### \_setPriceOracle

Sets a new price oracle for the comptroller

```solidity
function _setPriceOracle(contract PriceOracle newOracle) external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_setCloseFactor

Sets the closeFactor used when liquidating borrows

```solidity
function _setCloseFactor(uint256 newCloseFactorMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newCloseFactorMantissa | uint256 | New close factor, scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise will revert |

---

### \_setAccessControl

Sets the address of the access control of this contract

```solidity
function _setAccessControl(address newAccessControlAddress) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newAccessControlAddress | address | New address for the access control |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise will revert |

---

### \_setCollateralFactor

Sets the collateralFactor for a market

```solidity
function _setCollateralFactor(contract VToken vToken, uint256 newCollateralFactorMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The market to set the factor on |
| newCollateralFactorMantissa | uint256 | The new collateral factor, scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### \_setLiquidationIncentive

Sets liquidationIncentive

```solidity
function _setLiquidationIncentive(uint256 newLiquidationIncentiveMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newLiquidationIncentiveMantissa | uint256 | New liquidationIncentive scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### \_supportMarket

Add the market to the markets mapping and set it as listed

```solidity
function _supportMarket(contract VToken vToken) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The address of the market (token) to list |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure. (See enum Error for details) |

---

### \_setPauseGuardian

Admin function to change the Pause Guardian

```solidity
function _setPauseGuardian(address newPauseGuardian) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newPauseGuardian | address | The address of the new Pause Guardian |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure. (See enum Error for details) |

---

### \_setMarketBorrowCaps

Set the given borrow caps for the given vToken markets. Borrowing that brings total borrows to or above borrow cap will revert.

```solidity
function _setMarketBorrowCaps(contract VToken[] vTokens, uint256[] newBorrowCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the borrow caps for |
| newBorrowCaps | uint256\[] | The new borrow cap values in underlying to be set. A value of 0 corresponds to unlimited borrowing. |

---

### \_setMarketSupplyCaps

Set the given supply caps for the given vToken markets. Supply that brings total Supply to or above supply cap will revert.

```solidity
function _setMarketSupplyCaps(contract VToken[] vTokens, uint256[] newSupplyCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the supply caps for |
| newSupplyCaps | uint256\[] | The new supply cap values in underlying to be set. A value of 0 corresponds to Minting NotAllowed. |

---

### \_setProtocolPaused

Set whole protocol pause/unpause state

```solidity
function _setProtocolPaused(bool state) external returns (bool)
```

---

### \_setActionsPaused

Pause/unpause certain actions

```solidity
function _setActionsPaused(address[] markets, enum ComptrollerV9Storage.Action[] actions, bool paused) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| markets | address\[] | Markets to pause/unpause the actions on |
| actions | enum ComptrollerV9Storage.Action\[] | List of action ids to pause/unpause |
| paused | bool | The new paused state (true=paused, false=unpaused) |

---

### \_setVAIController

Sets a new VAI controller

```solidity
function _setVAIController(contract VAIControllerInterface vaiController_) external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### claimVenus

Claim all the xvs accrued by holder in all markets and VAI

```solidity
function claimVenus(address holder) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |

---

### claimVenus

Claim all the xvs accrued by holder in the specified markets

```solidity
function claimVenus(address holder, contract VToken[] vTokens) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |
| vTokens | contract VToken\[] | The list of markets to claim XVS in |

---

### claimVenus

Claim all xvs accrued by the holders

```solidity
function claimVenus(address[] holders, contract VToken[] vTokens, bool borrowers, bool suppliers) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holders | address\[] | The addresses to claim XVS for |
| vTokens | contract VToken\[] | The list of markets to claim XVS in |
| borrowers | bool | Whether or not to claim XVS earned by borrowing |
| suppliers | bool | Whether or not to claim XVS earned by supplying |

---

### claimVenus

Claim all xvs accrued by the holders

```solidity
function claimVenus(address[] holders, contract VToken[] vTokens, bool borrowers, bool suppliers, bool collateral) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holders | address\[] | The addresses to claim XVS for |
| vTokens | contract VToken\[] | The list of markets to claim XVS in |
| borrowers | bool | Whether or not to claim XVS earned by borrowing |
| suppliers | bool | Whether or not to claim XVS earned by supplying |
| collateral | bool | Whether or not to use XVS earned as collateral, only takes effect when the holder has a shortfall |

---

### claimVenusAsCollateral

Claim all the xvs accrued by holder in all markets, a shorthand for `claimVenus` with collateral set to `true`

```solidity
function claimVenusAsCollateral(address holder) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | The address to claim XVS for |

---

### \_grantXVS

Transfer XVS to the recipient

```solidity
function _grantXVS(address recipient, uint256 amount) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address of the recipient to transfer XVS to |
| amount | uint256 | The amount of XVS to (possibly) transfer |

---

### \_setVenusVAIVaultRate

Set the amount of XVS distributed per block to VAI Vault

```solidity
function _setVenusVAIVaultRate(uint256 venusVAIVaultRate_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| venusVAIVaultRate\_ | uint256 | The amount of XVS wei per block to distribute to VAI Vault |

---

### \_setVAIVaultInfo

Set the VAI Vault infos

```solidity
function _setVAIVaultInfo(address vault_, uint256 releaseStartBlock_, uint256 minReleaseAmount_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vault\_ | address | The address of the VAI Vault |
| releaseStartBlock\_ | uint256 | The start block of release to VAI Vault |
| minReleaseAmount\_ | uint256 | The minimum release amount to VAI Vault |

---

### \_setVenusSpeeds

Set XVS speed for a single market

```solidity
function _setVenusSpeeds(contract VToken[] vTokens, uint256[] supplySpeeds, uint256[] borrowSpeeds) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The market whose XVS speed to update |
| supplySpeeds | uint256\[] | New XVS speed for supply |
| borrowSpeeds | uint256\[] | New XVS speed for borrow |

---

### getAllMarkets

Return all of the markets

```solidity
function getAllMarkets() external view returns (contract VToken[])
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | contract VToken\[] | The list of market addresses |

---

### getXVSAddress

Return the address of the XVS token

```solidity
function getXVSAddress() public view returns (address)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | address | The address of XVS |

---

### getXVSVTokenAddress

Return the address of the XVS vToken

```solidity
function getXVSVTokenAddress() public view returns (address)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | address | The address of XVS vToken |

---

### actionPaused

Checks if a certain action is paused on a market

```solidity
function actionPaused(address market, enum ComptrollerV9Storage.Action action) public view returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| market | address | vToken address |
| action | enum ComptrollerV9Storage.Action | Action id |

---

### setMintedVAIOf

Set the minted VAI amount of the `owner`

```solidity
function setMintedVAIOf(address owner, uint256 amount) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the account to set |
| amount | uint256 | The amount of VAI to set to the account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | The number of minted VAI by `owner` |

---

### releaseToVault

Transfer XVS to VAI Vault

```solidity
function releaseToVault() public
```

---
