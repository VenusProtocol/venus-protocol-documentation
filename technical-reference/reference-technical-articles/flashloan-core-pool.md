# Venus Protocol's FlashLoan Implementation

## Overview

Venus Protocol introduces **native multi-asset flash loans** in its **core-pool**, enabling advanced DeFi strategies such as **arbitrage, liquidation, and composable leverage**. 
The flash loan system is designed for **security, flexibility, and seamless integration** with Venus’s vToken markets.

### Key Benefits

- **Multi-Asset Support** – Borrow multiple assets in a single transaction.
- **Flexible Repayment Modes** – Classic (full repayment) and Debt Position (partial repayment becomes borrow).
- **Permissioned Delegation** – Flash loans can be executed on behalf of other users with explicit authorization.
- **Integrated Fee Routing** – Protocol and supplier fees are distributed to the correct recipients, including the **Protocol Share Reserve (PSR)**.
- **Upgradeable & Secure** – Built with diamond facets for upgradeability and access-controlled by governance.

---

## Understanding Flash Loans

A flash loan allows users to borrow assets **without collateral**, provided the loan is repaid **within the same transaction**.  
If not repaid, the transaction **reverts**.

Venus extends this model by allowing **debt positions**: if a user cannot fully repay, the unpaid amount automatically becomes a borrow against their account.

---

## Core Smart Contracts

### **1. PolicyFacet.sol – FlashLoan Execution & Validation**

Handles core flash loan operations including:
- Asset transfers
- Fee calculations
- Repayment logic
- Event emissions

#### Key Function

```solidity
function executeFlashLoan(
    address payable initiator,
    address payable receiver,
    VToken[] calldata vTokens,
    uint256[] calldata underlyingAmounts,
    uint256[] calldata modes,
    address onBehalfOf,
    bytes calldata param
) external {
    // Validation, asset transfer, fee calculation, repayment logic...
}
```
**Explanation:**  
The executeFlashLoan function facilitates a flash loan — a type of uncollateralized loan where assets are borrowed and repaid within the same transaction block. It is commonly used in DeFi for arbitrage, refinancing, liquidations, and other advanced operations.

#### Parameters
| Name              | Type                |Description                                                      |
|-------------------|---------------------------------------------------------------------------------------|
| initiator         | address payable     | The address initiating the flashloan                            |
| receiver          | address payable     | The contract receiving theassets                                |
| vTokens           | VToken[] calldata   | Array of vToken markets to borrowfrom                           |
| underlyingAmounts | uint256[] calldata  | Amounts of each asset toborrow                                  |
| modes             | uint256[] calldata  | Repayment modes (0: Classic, 1: DebtPosition)                   |
| onBehalfOf        | address             | Address for which the loan is executed (fordelegation)          |
| param             | bytes calldata      | Arbitrary data for customlogic                                  |

#### Return Values
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

#### 📅 Events
* FlashLoanExecuted is emitted after successful execution

#### ⛔️ Access Requirements
* Not restricted (but subject to whitelisting/delegation if enabled)

#### ❌ Errors
    * Validation errors for input arrays, insufficient liquidity, or unauthorized delegation

#### Features
- Supports **multi-asset borrowing** in a single transaction.
- Implements **Mode 0 (Classic)** and **Mode 1 (Debt Position)** repayment modes.
- Emits `FlashLoanExecuted` event for transparency.

---

### **2. SetterFacet.sol - Setter Functions For Flashloan

This file contains administrative functions to manage flash loan permissions.

#### **Functions**

#### `setWhiteListFlashLoanAccount`
```solidity
function setWhiteListFlashLoanAccount(address account, bool _isWhiteListed) external 
```
**Explanation:**  
Allows an admin or governance role to whitelist or revoke access for specific accounts to initiate flash loans.

#### Parameters
| Name        | Type    | Description                                 |
|-------------|---------|---------------------------------------------|
| account     | address | The account to whitelist or remove          |
| _isWhiteListed | bool | True to whitelist, false to remove          |

#### Return Values
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

#### 📅 Events
* IsAccountFlashLoanWhitelisted is emitted on change

#### ⛔️ Access Requirements
* Admin or governance only

#### ❌ Errors
* Unauthorized error if called by non-admin

#### `setDelegateAuthorizationFlashloan`
```solidity
function setDelegateAuthorizationFlashloan(address market, address delegate, bool approved) external 
```
**Explanation:**  
Grants or revokes delegate authorization for specific markets, allowing another account to initiate flash loans on behalf of a user.

#### Parameters
| Name     | Type    | Description                                 |
|----------|---------|---------------------------------------------|
| market   | address | The market for which to set delegation      |
| delegate | address | The delegate account                        |
| approved | bool    | True to approve, false to revoke            |

#### Return Values
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

#### 📅 Events
* DelegateAuthorizationFlashloanChanged is emitted on change

#### ⛔️ Access Requirements
* Admin or governance only

#### ❌ Errors
* Unauthorized error if called by non-admin

---

### **3. VToken.sol – Asset Transfer & Fee Calculation**

Manages the underlying asset transfers, flash loan fee calculations, and creation of debt positions.

#### Key Functions

```solidity
function transferOutUnderlying(address receiver, uint256 amount)
    external
    returns (uint256);
```
**Explanation:** 
Transfers the specified amount of the underlying asset to the receiver. Used for flash loan delivery or withdrawals.

##### Parameters
| Name     | Type    |Description                                 |
|----------|------------------------------------------------------|
| receiver | address | The address toreceive the underlying asset |
| amount   | uint256 | The amount of theunderlying asset to send  |

##### Return Values
| Name | Type    |Description                                 |
|------|------------------------------------------------------|
| [0]  | uint256 | The actual amounttransferred               |

##### 📅 Events
* AssetTransferred is emitted on successful transfer

##### ⛔️ Access Requirements
* Not restricted

##### ❌ Errors
* InsufficientBalance error if contract balance is too low


```solidity
function calculateFlashLoanFee(uint256 amount)
    public
    view
    returns (uint256 protocolFee, uint256 supplierFee);
```   
**Explanation:** 
Calculates the protocol and supplier fees for a given flash loan amount.

##### Parameters
| Name   | Type    | Description                          |
|--------|---------|--------------------------------------|
| amount | uint256 | The amount for which to calculate fee|

##### Return Values
| Name          | Type     | Description                                 |
|---------------|----------|---------------------------------------------|
| protocolFee   | uint256  | The protocol fee for the flash loan         |
| supplierFee   | uint256  | The supplier fee for the flash loan         |

##### 📅 Events
* None

##### ⛔️ Access Requirements
* Not restricted

##### ❌ Errors
* None 

```solidity
function _toggleFlashLoan()
    external
    returns (uint256);
```   
**Explanation:**  
Enables or disables flash loan functionality for the vToken market. Used by admins to control availability.

##### Parameters
| Name | Type | Description |
|------|------|-------------|
| None |      |             |

##### Return Values
| Name | Type    | Description                                 |
|------|---------|---------------------------------------------|
| [0]  | uint256 | Status code (e.g., success/failure)         |

##### 📅 Events
* FlashLoanToggled is emitted on change

##### ⛔️ Access Requirements
* Admin only

##### ❌ Errors
* Unauthorized error if called by non-admin

```solidity
function _setFlashLoanFeeMantissa(
    uint256 protocolFeeMantissa_,
    uint256 supplierFeeMantissa_
)
    external
    returns (uint256);
```
**Explanation:** 
Sets the fee rates (mantissa values) for protocol and supplier fees on flash loans. Allows governance to update fee parameters.

##### Parameters
| Name                  | Type    | Description                                 |
|-----------------------|---------|---------------------------------------------|
| protocolFeeMantissa_  | uint256 | New protocol fee mantissa                   |
| supplierFeeMantissa_  | uint256 | New supplier fee mantissa                   |

##### Return Values
| Name | Type    | Description                                 |
|------|---------|---------------------------------------------|
| [0]  | uint256 | Status code (e.g., success/failure)         |

##### 📅 Events
* FlashLoanFeeMantissaUpdated is emitted on update

##### ⛔️ Access Requirements
* Admin only

##### ❌ Errors
* Unauthorized error if called by non-admin

---

### **4. FlashLoanReceiverBase.sol – Receiver Base**

Provides the base functionality for contracts receiving flash loans, including repayment logic and callback hooks.

---

## Events

- **`FlashLoanExecuted`** – Emitted after a flash loan is executed.
- **`FlashLoanFeePaid`** – Emitted when fees are distributed.
- **`DebtPositionCreated`** – Emitted when unpaid amounts are converted to debt.
- **`IsAccountFlashLoanWhitelisted`** – Emitted when trying to set whitelist flashloan account.
- **`DelegateAuthorizationFlashloanChanged`** – Emitted when delegate authorization for flash loans is changed

---

## Security Features

### **1. Access Control**
- Delegation is **ACM-protected** to prevent unauthorized flash loans.

### **2. Input Validation**
- Non-zero address checks.
- Array length validation for consistency.

### **3. Attack Surface Mitigation**
| Threat Vector | Mitigation |
|---------------|------------|
| Reentrancy | `nonReentrant` modifiers |
| Unauthorized Delegation | Access Control Manager checks |
| Fee Misrouting | Explicit fee routing logic |
| Upgrade Risks | Governance-controlled diamond upgrades |

---

## Example FlashLoan Flow

**Scenario**: Alice requests a flash loan of **USDT using **Mode 0 (Classic Flashloan)** and BUSD**, using **Mode 1 (Debt Position)** for BUSD.

1. Alice receives **both assets**.  
2. Repays **USDT in full** (Mode 0).  
3. Remaining **BUSD becomes a borrow** (Mode 1).  
4. Fees are routed correctly to PSR and vToken contracts.

---

## Conclusion

Venus Protocol’s flash loan implementation provides a **secure, composable, and flexible foundation** for advanced DeFi strategies.  
It enables **atomic transactions**, **multi-asset borrowing**, and **deep composability** with Venus and other DeFi protocols.
