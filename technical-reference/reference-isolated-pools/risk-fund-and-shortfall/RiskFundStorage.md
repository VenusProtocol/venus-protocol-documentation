# RiskFundStorage

Storage layout for the `RiskFundV2` contract.

# Solidity API

### poolAssetsFunds

Available asset's fund per pool in RiskFund
Comptroller(pool) -> Asset -> amount

```solidity
mapping(address => mapping(address => uint256)) poolAssetsFunds
```

- - -

### maxLoopsLimit

Limit for the loops to avoid the DOS
This state is deprecated, using it to prevent storage collision

```solidity
uint256 maxLoopsLimit
```

- - -

### convertibleBaseAsset

Address of base asset

```solidity
address convertibleBaseAsset
```

- - -

### shortfall

Address of shortfall contract

```solidity
address shortfall
```

- - -

### riskFundConverter

Risk fund converter address

```solidity
address riskFundConverter
```

- - -

