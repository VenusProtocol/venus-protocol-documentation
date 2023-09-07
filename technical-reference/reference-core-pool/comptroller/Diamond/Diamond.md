# Diamond
This contract contains functions related to facets

# Solidity API

```solidity
struct Facet {
  address facetAddress;
  bytes4[] functionSelectors;
}
```

### _become

Call _acceptImplementation to accept the diamond proxy as new implementaion

```solidity
function _become(contract Unitroller unitroller) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| unitroller | contract Unitroller | Address of the unitroller |

- - -

### diamondCut

To add function selectors to the facet's mapping

```solidity
function diamondCut(struct IDiamondCut.FacetCut[] diamondCut_) public
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| diamondCut_ | struct IDiamondCut.FacetCut[] | IDiamondCut contains facets address, action and function selectors |

- - -

### facetFunctionSelectors

Get all function selectors mapped to the facet address

```solidity
function facetFunctionSelectors(address facet) external view returns (bytes4[])
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| facet | address | Address of the facet |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4[] | selectors Array of function selectors |

- - -

### facetPosition

Get facet position in the _facetFunctionSelectors through facet address

```solidity
function facetPosition(address facet) external view returns (uint256)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| facet | address | Address of the facet |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Position of the facet |

- - -

### facetAddresses

Get all facet addresses

```solidity
function facetAddresses() external view returns (address[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | facetAddresses Array of facet addresses |

- - -

### facetAddress

Get facet address and position through function selector

```solidity
function facetAddress(bytes4 functionSelector) external view returns (struct ComptrollerV12Storage.FacetAddressAndPosition)
```

#### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| functionSelector | bytes4 | function selector |

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct ComptrollerV12Storage.FacetAddressAndPosition | FacetAddressAndPosition facet address and position |

- - -

### facets

Get all facets address and their function selector

```solidity
function facets() external view returns (struct Diamond.Facet[])
```

#### Return Values
| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Diamond.Facet[] | facets_ Array of Facet |

- - -

