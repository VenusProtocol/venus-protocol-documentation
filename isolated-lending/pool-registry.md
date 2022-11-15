# Pool Registry

## Introduction
The pool registry maintains the isolated lending pools in the directory and can perform actions like creating and registering new isolated lending pools to the directory, adding new markets to existing pools, setting and updating the pool’s required metadata, and providing the getters methods to get an inside view of the pools.

![Isolated Pools Diagram](<../.gitbook/assets/isolated-pools.png>)

## Details

Isolated lending has three main components: PoolRegistry, Pools, and Markets. The PoolRegistry is responsible for managing pools. It can create new pools, update pool metadata and manage markets within pools. Pool Registry has some getter methods to get the details of any existing pool like getVTokenForAsset, getPoolsSupportedByAsset, updatePoolMetadata etc.

Pool Registry provides a pool Id to each pool mapped with the pool's comptroller address. Each comptroller mapped with the pool's metadata details which contain the additional information of that pool. Pool Registry also supports some other functionality like, users can bookmark the selected pools through the bookmarkPool method and can get the list of the all bookmarked pools through the getBookmarks method, Pool Registry also maps the asset to the supported list so it will be easier to get all the pools which support the similar asset through getPoolsSupportedByAsset method.


Venus provides the risk rating for each isolated pool. Through this rating users can select the appropriate pool to allocate their assets.

### Pools

Venus introduces Isolated pools. It gives the ability to create an independent market with specific assets and custom risk management configurations. Pool Registry helps to create a new Isolated pool in the directory through createRegistryPool method. It will take the required fields as parameters like deployed comptroller address, price oracle address, and etc, then create a proxy for the comptroller and set the msg.sender as the admin of the comptroller, provide an ID to the pool and update all the other states of the Pool Registry to add the pool to the directory.
 

### Markets

To add a new market to a lending pool, the PoolRegistry deploys the JumpRate or WhitePaperInterestRate factory as an interest rate model to calculate the interest for the borrowers and lenders according to the available liquidity of the protocol. Then deploys the upgradable vToken for the market to handle all the transactions within the market, in the last comptroller(pool) supports the market, and all the internal states of the Pool Registry get updated.
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

