# Isolated Lending

## Introduction
Isolated lending creates collections of assets which users can supply and borrow in closed liquidity pools. This allows for more tokens with a wider variety of risk paramters to be made available to users without risking the liquidity of the entire protocol.

![Isolated Pools Diagram](<../.gitbook/assets/isolated-pools.png>)

## Details

Isolated lending has three main components the PoolRegistry, Pools, and Markets. The PoolRegistry is responsible for managing pools. It can create new pools, update pool metadata and manage markets within pools.

To create a new custom lending pool, the PoolRegistry deploys the unitroller and sets the comptroller implementation address to the unitroller. After setting up the comptroller, it adds the pool to the directory, and the Shortfall contract.

### PoolRegistry

The pool registry maintains the isolated lending pools in the directory and can perform actions like creating and registering new isolated lending pools to the directory, adding new markets to existing pools, setting and updating the pool’s required metadata, and providing the getters methods to get an inside view of the pools.

### Pools

Venus introduces Isolated pools, giving the ability to create an independent market with specific assets and custom risk management configurations. They work in a similar manner to the Venus core lending pool for borrowing and lending assets. 

Multiple lending pools with different assets, and custom risk management parameters give users a wider market to split the risks associated with an asset amongst different pools. Multiple pools also reduce the impact of any potential asset failure affecting the liquidity of the protocol.

Venus provides the risk rating for each isolated pool. Through this rating users can select the appropriate pool to allocate their assets.
 

### Markets

To add a new market to a lending pool, the PoolRegistry deploys the JumpRate or WhitePaperInterestRate factory as interest rate model and then deploys the upgradable vToken for the market, before getting the support of the particular pool’s comptroller.
You can read more about interest rate models under [Protocol Math](/)


# Solidity API

## Pool Registry

### initialize


```solidity
function initialize(
        VBep20ImmutableProxyFactory _vTokenFactory,
        JumpRateModelFactory _jumpRateFactory,
        WhitePaperInterestRateModelFactory _whitePaperFactory,
        Shortfall _shortfall,
        address payable riskFund_,
        address payable protocolShareReserve_
    ) public initializer
```



Initializes the deployer to owner. Set all the required contracts to pool registry.



#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| _vTokenFactory | VBep20ImmutableProxyFactory | VBep20 proxy factory to deploy vTokens. |
| _jumpRateFactory | JumpRateModelFactory | Jump rate model factory as Interest rate model. |
| _whitePaperFactory | WhitePaperInterestRateModelFactory | white paper rate model factory as Interest rate model. |
| _shortfall | Shortfall | shortfall contract. |
| riskFund_ | address | riskFund contract address. |
| protocolShareReserve_ | address | protocolShareReserve contract address. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | false if the user account cannot call the particular contract function |


### createRegistryPool



```solidity
function createRegistryPool(
        string memory name,
        address implementation,
        uint256 closeFactor,
        uint256 liquidationIncentive,
        address priceOracle
    ) external virtual onlyOwner returns (uint256, address)
```



Deploys a new venus pool and adds to the directory, by taking all the required inputs



#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | The name of the pool. |
| implementation | address | The Comptroller implementation address. |
| closeFactor | uint256 | The pool's close factor (scaled by 1e18). |
| liquidationIncentive | uint256 | The pool's liquidation incentive (scaled by 1e18). |
| priceOracle | address | The pool's PriceOracle address. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The index of the registered Venus pool. |
| [1] | address | The comptroller's proxy address. |


### setPoolName



```solidity
function setPoolName(uint256 poolId, string calldata name)
        external
```


Modify existing Venus pool name.



#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint256 | The Id of the registered pool. |
| name | string | The new name of the pool to be updated. |



### bookmarkPool



```solidity
  function bookmarkPool(address comptroller)    
        external
```


Bookmarks a Venus pool Comptroller(proxy) contract addresses.



#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | Address of the comptroller to be bookmarked |



### getAllPools


```solidity
function getAllPools() external view returns (VenusPool[] memory) 
```



To get the details of all the registered pools in the directory.


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | array of VenusPool | Arrays of all Venus pools' data. |



### getVenusPoolMetadata




```solidity
function getVenusPoolMetadata(uint256 poolId)
        external
        view
        returns (VenusPoolMetaData memory)
```



Get the registered pool Meta data by pool ID.


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| comptroller | address | comptroller address of the pool. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VenusPoolMetaData | Meta data of the Venus pool  |



### getBookmarks


```solidity
function getBookmarks(address account)
        external
        view
        returns (address[] memory)
```



Get the book marked pools by the account.


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Account address. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | array | Array of the pools' addresses.  |




### addMarket



```solidity
function addMarket(
        AddMarketInput memory input
    ) external
```


 Add a market to an existing venus pool.


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| input | AddMarketInput | Details of the market to be added. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | VenusPoolMetaData | Meta data of the Venus pool  |



### getVTokenForAsset



```solidity
function getVTokenForAsset(uint256 poolId, address asset)
        external
        view
        returns (address)
```


 Add a market to an existing venus pool.


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint256 | Pool ID of the existing pool. |
| asset | address | Address of the underlying asset. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | Address of the vToken.  |



### getPoolsSupportedByAsset



```solidity
function getPoolsSupportedByAsset(address asset)
        external
        view
        returns (uint256[] memory)
```


Get pools which supports the given asset as input.


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| asset | address | Address of the underlying asset. |


#### Return Values



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | Array of the pools' addresses.  |



### updatePoolMetadata



```solidity
function updatePoolMetadata(uint256 poolId, VenusPoolMetaData memory _metadata)
        external
        onlyOwner 
```


Update metadata of an existing pool


#### Parameters



| Name | Type | Description |
| ---- | ---- | ----------- |
| poolId | uint256 | Pool ID of the existing pool. |
| _metadata | VenusPoolMetaData | Meta data to be updated. |

