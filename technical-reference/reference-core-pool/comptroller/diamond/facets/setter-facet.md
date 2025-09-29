# SetterFacet

This facet contract contains all the configurational setter functions

# Solidity API

### setPriceOracle

Alias to \_setPriceOracle to support the Isolated Lending Comptroller Interface

```solidity
function setPriceOracle(contract ResilientOracleInterface newOracle) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newOracle | contract ResilientOracleInterface | The new price oracle to set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_setPriceOracle

Sets a new price oracle for the comptroller

```solidity
function _setPriceOracle(contract ResilientOracleInterface newOracle) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newOracle | contract ResilientOracleInterface | The new price oracle to set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### setCloseFactor

Alias to \_setCloseFactor to support the Isolated Lending Comptroller Interface

```solidity
function setCloseFactor(uint256 newCloseFactorMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newCloseFactorMantissa | uint256 | New close factor, scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise will revert |

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
| \[0] | uint256 | uint256 0=success, otherwise will revert |

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
| \[0] | uint256 | uint256 0=success, otherwise will revert |

---

### setCollateralFactor

Sets the collateral factor and liquidation threshold for a market in the Core Pool only.

```solidity
function setCollateralFactor(contract VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | contract VToken | The market to set the factor on |
| newCollateralFactorMantissa | uint256 | The new collateral factor, scaled by 1e18 |
| newLiquidationThresholdMantissa | uint256 | The new liquidation threshold, scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### setLiquidationIncentive

Sets the liquidation incentive for a market in the Core Pool only.

```solidity
function setLiquidationIncentive(address vToken, uint256 newLiquidationIncentiveMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vToken | address | The market to set the liquidationIncentive for |
| newLiquidationIncentiveMantissa | uint256 | New liquidationIncentive scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### setCollateralFactor

Sets the collateral factor and liquidation threshold for a market in the specified pool.

```solidity
function setCollateralFactor(uint96 poolId, contract VToken vToken, uint256 newCollateralFactorMantissa, uint256 newLiquidationThresholdMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool. |
| vToken | contract VToken | The market to set the factor on |
| newCollateralFactorMantissa | uint256 | The new collateral factor, scaled by 1e18 |
| newLiquidationThresholdMantissa | uint256 | The new liquidation threshold, scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### setLiquidationIncentive

Sets the liquidation incentive for a market in the specified pool.

```solidity
function setLiquidationIncentive(uint96 poolId, address vToken, uint256 newLiquidationIncentiveMantissa) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool. |
| vToken | address | The market to set the liquidationIncentive for |
| newLiquidationIncentiveMantissa | uint256 | New liquidationIncentive scaled by 1e18 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See ErrorReporter for details) |

---

### \_setLiquidatorContract

Update the address of the liquidator contract

```solidity
function _setLiquidatorContract(address newLiquidatorContract_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newLiquidatorContract\_ | address | The new address of the liquidator contract |

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
| \[0] | uint256 | uint256 0=success, otherwise a failure. (See enum Error for details) |

---

### setMarketBorrowCaps

Alias to \_setMarketBorrowCaps to support the Isolated Lending Comptroller Interface

```solidity
function setMarketBorrowCaps(contract VToken[] vTokens, uint256[] newBorrowCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the borrow caps for |
| newBorrowCaps | uint256\[] | The new borrow cap values in underlying to be set. A value of 0 corresponds to Borrow not allowed |

---

### \_setMarketBorrowCaps

Set the given borrow caps for the given vToken market Borrowing that brings total borrows to or above borrow cap will revert

```solidity
function _setMarketBorrowCaps(contract VToken[] vTokens, uint256[] newBorrowCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the borrow caps for |
| newBorrowCaps | uint256\[] | The new borrow cap values in underlying to be set. A value of 0 corresponds to Borrow not allowed |

---

### setMarketSupplyCaps

Alias to \_setMarketSupplyCaps to support the Isolated Lending Comptroller Interface

```solidity
function setMarketSupplyCaps(contract VToken[] vTokens, uint256[] newSupplyCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the supply caps for |
| newSupplyCaps | uint256\[] | The new supply cap values in underlying to be set. A value of 0 corresponds to Minting NotAllowed |

---

### \_setMarketSupplyCaps

Set the given supply caps for the given vToken market Supply that brings total Supply to or above supply cap will revert

```solidity
function _setMarketSupplyCaps(contract VToken[] vTokens, uint256[] newSupplyCaps) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokens | contract VToken\[] | The addresses of the markets (tokens) to change the supply caps for |
| newSupplyCaps | uint256\[] | The new supply cap values in underlying to be set. A value of 0 corresponds to Minting NotAllowed |

---

### \_setProtocolPaused

Set whole protocol pause/unpause state

```solidity
function _setProtocolPaused(bool state) external returns (bool)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| state | bool | The new state (true=paused, false=unpaused) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | bool | bool The updated state of the protocol |

---

### setActionsPaused

Alias to \_setActionsPaused to support the Isolated Lending Comptroller Interface

```solidity
function setActionsPaused(address[] markets_, enum Action[] actions_, bool paused_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| markets\_ | address\[] | Markets to pause/unpause the actions on |
| actions\_ | enum Action\[] | List of action ids to pause/unpause |
| paused\_ | bool | The new paused state (true=paused, false=unpaused) |

---

### \_setActionsPaused

Pause/unpause certain actions

```solidity
function _setActionsPaused(address[] markets_, enum Action[] actions_, bool paused_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| markets\_ | address\[] | Markets to pause/unpause the actions on |
| actions\_ | enum Action\[] | List of action ids to pause/unpause |
| paused\_ | bool | The new paused state (true=paused, false=unpaused) |

---

### \_setVAIController

Sets a new VAI controller

```solidity
function _setVAIController(contract VAIControllerInterface vaiController_) external returns (uint256)
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_setVAIMintRate

Set the VAI mint rate

```solidity
function _setVAIMintRate(uint256 newVAIMintRate) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newVAIMintRate | uint256 | The new VAI mint rate to be set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (see ErrorReporter.sol for details) |

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

### \_setTreasuryData

Set the treasury data.

```solidity
function _setTreasuryData(address newTreasuryGuardian, address newTreasuryAddress, uint256 newTreasuryPercent) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newTreasuryGuardian | address | The new address of the treasury guardian to be set |
| newTreasuryAddress | address | The new address of the treasury to be set |
| newTreasuryPercent | uint256 | The new treasury percent to be set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint256 0=success, otherwise a failure (see ErrorReporter.sol for details) |

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

### setPrimeToken

Alias to \_setPrimeToken to support the Isolated Lending Comptroller Interface

```solidity
function setPrimeToken(contract IPrime _prime) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_prime | contract IPrime | The new prime token contract to be set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### \_setPrimeToken

Sets the prime token contract for the comptroller

```solidity
function _setPrimeToken(contract IPrime _prime) external returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_prime | contract IPrime | The new prime token contract to be set |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| \[0] | uint256 | uint 0=success, otherwise a failure (see ErrorReporter.sol for details) |

---

### setForcedLiquidation

Alias to \_setForcedLiquidation to support the Isolated Lending Comptroller Interface

```solidity
function setForcedLiquidation(address vTokenBorrowed, bool enable) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Borrowed vToken |
| enable | bool | Whether to enable forced liquidations |

---

### \_setForcedLiquidation

Enables forced liquidations for a market. If forced liquidation is enabled,
borrows in the market may be liquidated regardless of the account liquidity

```solidity
function _setForcedLiquidation(address vTokenBorrowed, bool enable) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vTokenBorrowed | address | Borrowed vToken |
| enable | bool | Whether to enable forced liquidations |

---

### \_setForcedLiquidationForUser

Enables forced liquidations for user's borrows in a certain market. If forced
liquidation is enabled, user's borrows in the market may be liquidated regardless of
the account liquidity. Forced liquidation may be enabled for a user even if it is not
enabled for the entire market.

```solidity
function _setForcedLiquidationForUser(address borrower, address vTokenBorrowed, bool enable) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| borrower | address | The address of the borrower |
| vTokenBorrowed | address | Borrowed vToken |
| enable | bool | Whether to enable forced liquidations |

---

### setWhiteListFlashLoanAccount

```solidity
function setWhiteListFlashLoanAccount(address account, bool _isWhiteListed) external 
```
**Explanation:**  
This function grants or revokes an account's permission to use the protocol's flash loan feature, enforcing access control and address validation.

#### Parameters
| Name        | Type    | Description                                 |
|-------------|---------|---------------------------------------------|
| account     | address | The account to whitelist or remove          |
| _isWhiteListed | bool | True to whitelist, false to remove          |

#### Return Values
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

---


### \_setXVSToken

Set the address of the XVS token

```solidity
function _setXVSToken(address xvs_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvs\_ | address | The address of the XVS token |

---

### \_setXVSVToken

Set the address of the XVS vToken

```solidity
function _setXVSVToken(address xvsVToken_) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| xvsVToken\_ | address | The address of the XVS vToken |

---

### setPoolActive

updates active status for a specific pool (excluding the Core Pool)

```solidity
function setPoolActive(uint96 poolId, bool active) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | id of the pool to update |
| active | bool | true to enable, false to disable |

#### 📅 Events

* PoolActiveStatusUpdated Emitted after the pool active status is updated.

#### ❌ Errors

* InvalidOperationForCorePool Reverts when attempting to call pool-specific methods on the Core Pool.
* PoolDoesNotExist Reverts if the target pool ID does not exist.

---

### setIsBorrowAllowed

Updates the `isBorrowAllowed` flag for a market in a pool.

```solidity
function setIsBorrowAllowed(uint96 poolId, address vToken, bool borrowAllowed) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint96 | The ID of the pool. |
| vToken | address | The address of the market (vToken). |
| borrowAllowed | bool | The new borrow allowed status. |

#### 📅 Events

* BorrowAllowedUpdated Emitted after the borrow permission for a market is updated.

#### ❌ Errors

* PoolDoesNotExist Reverts if the pool ID is invalid.
* MarketConfigNotFound Reverts if the market is not listed in the pool.

---
