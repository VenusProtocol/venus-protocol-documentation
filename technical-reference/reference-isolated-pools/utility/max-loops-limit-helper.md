# MaxLoopsLimitHelper

This reference matches [`MaxLoopsLimitHelper` in `isolated-pools` v4.4.0](https://github.com/VenusProtocol/isolated-pools/blob/v4.4.0/contracts/MaxLoopsLimitHelper.sol). It is an inherited abstract storage/helper module, not a separately deployed contract.

Abstract contract used to avoid collection with too many items that would generate gas errors and DoS.

{% hint style="warning" %}
The internal setter only permits increasing the limit. The public administrator entry point and its permission, if any, belong to the inheriting implementation. Resolve that implementation before assuming a caller can change the value.
{% endhint %}

## Solidity API

### maxLoopsLimit

Maximum number of items accepted by guarded loops. Solidity generates a public getter for this storage field.

```solidity
uint256 public maxLoopsLimit
```

### MaxLoopsLimitUpdated

Emitted after the limit is increased.

```solidity
event MaxLoopsLimitUpdated(uint256 oldMaxLoopsLimit, uint256 newmaxLoopsLimit)
```

### MaxLoopsLimitExceeded

Thrown when a guarded collection is longer than the configured limit.

```solidity
error MaxLoopsLimitExceeded(uint256 loopsLimit, uint256 requiredLoops)
```

### _setMaxLoopsLimit

Increases the limit. The call reverts unless `limit > maxLoopsLimit`; it cannot reduce the value.

```solidity
function _setMaxLoopsLimit(uint256 limit) internal
```

### _ensureMaxLoops

Reverts with `MaxLoopsLimitExceeded(maxLoopsLimit, len)` when `len` exceeds the configured limit.

```solidity
function _ensureMaxLoops(uint256 len) internal view
```
