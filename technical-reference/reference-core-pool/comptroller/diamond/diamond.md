# Diamond

The Diamond is the selector router used as the BNB Core Pool Unitroller implementation. The current stable source inherits `ComptrollerV19Storage`.

{% hint style="warning" %}
Use these functions through the Unitroller at `0xfD36E2c2a6789Db23113685031d7F16329158384`. The Diamond implementation address and selector map are upgradeable; verify the [live version map](../README.md) before use.
{% endhint %}

Source: [Diamond.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/Comptroller/Diamond/Diamond.sol).

## Solidity API

### `_become`

Accepts the pending Unitroller implementation role. Only the Unitroller admin can initiate this transition.

```solidity
function _become(Unitroller unitroller) public
```

### `diamondCut`

Adds, replaces, or removes selector assignments. Only the Unitroller admin can call it in the delegated Unitroller context.

```solidity
function diamondCut(IDiamondCut.FacetCut[] diamondCut_) public
```

### `facetFunctionSelectors`

Returns the selectors currently assigned to a facet address.

```solidity
function facetFunctionSelectors(address facet) external view returns (bytes4[])
```

### `facetPosition`

Returns a facet's position in the internal facet-address array.

```solidity
function facetPosition(address facet) external view returns (uint256)
```

### `facetAddresses`

Returns every facet address currently registered in the Diamond.

```solidity
function facetAddresses() external view returns (address[])
```

### `facetAddress`

Returns the current facet address and selector position for a function selector.

```solidity
function facetAddress(bytes4 functionSelector)
    external
    view
    returns (ComptrollerV19Storage.FacetAddressAndPosition)
```

### `facets`

Returns every registered facet with its assigned selectors.

```solidity
function facets() external view returns (Diamond.Facet[])
```
