# GovernorBravoDelegate

## GovernorBravoDelegate

Venus Governance latest on chain governance includes several new features including variable proposal routes and fine grained pause control. Variable routes for proposals allows for governance paramaters such as voting threshold and timelocks to be customized based on the risk level and impact of the proposal. Added granularity to the pause control mechanism allows governance to pause individual actions on specific markets, which reduces impact on the protocol as a whole. This is particularly useful when applied to isolated pools.

The goal of **Governance** is to increase governance efficiency, while mitigating and eliminating malicious or erroneous proposals.

### Details

Governance has **3 main contracts**: **GovernanceBravoDelegate, XVSVault, XVS** token.

* XVS token is the protocol token used for protocol users to cast their vote on submitted proposals.
* XVSVault is the main staking contract for XVS. Users first stake their XVS in the vault and receive voting power proportional to their staked tokens that they can use to vote on proposals. Users also can choose to delegate their voting power to other users.

## Governor Bravo

`GovernanceBravoDelegate` is main Venus Governance contract. Users interact with it to:

* Submit new proposal
* Vote on a proposal
* Cancel a proposal
* Queue a proposal for execution with a timelock executor contract.

`GovernanceBravoDelegate` uses the XVSVault to get restrict certain actions based on a user's voting power. The governance rules it inforces are:

* A user's voting power must be greater than the `proposalThreshold` to submit a proposal
* If a user's voting power drops below certain amount, anyone can cancel the the proposal. The governance guardian and proposal creator can also cancel a proposal at anytime before it is queued for execution.

### Venus Improvement Proposal

Venus Governance allows for Venus Improvement Proposals (VIPs) to be categorized based on their impact and risk levels. This allows for optimizing proposals execution to allow for things such as expediting interest rate changes and quickly updating risk parameters, while moving slower on other types of proposals that can prevent a larger risk to the protocol and are not urgent. There are three different types of VIPs with different proposal paramters:

* `NORMAL`
* `FASTTRACK`
* `CRITICAL`

When initializing the `GovernorBravo` contract, the parameters for the three routes are set. The parameters are:

* `votingDelay`: The delay in blocks between submitting a proposal and when voting begins
* `votingPeriod`: The number of blocks where voting will be open
* `proposalThreshold`: The number of votes required in order submit a proposal

There is also a separate timelock executor contract for each route, which is used to dispatch the VIP for execution, giving even more control over the flow of each type of VIP.

### Voting

After a VIP is proposed, voting is opened after the `votingDelay` has passed. For example, if `votingDelay = 0`, then voting will begin in the next block after the proposal has been submitted. After the delay, the proposal state is `ACTIVE` and users can cast their vote `for`, `against`, or `abstain`, weighted by their total voting power (tokens + delegated voting power). Abstaining from a voting allows for a vote to be cast and optionally include a comment, without the incrementing for or against vote count. The total voting power for the user is obtained by calling XVSVault's `getPriorVotes`.

`GovernorBravoDelegate` also accepts [EIP-712](https://eips.ethereum.org/EIPS/eip-712) signatures for voting on proposals via the external function `castVoteBySig`.

### Delegating

A users voting power includes the amount of staked XVS the have staked as well as the votes delegate to them. Delegating is the process of a user loaning their voting power to another, so that the latter has the combined voting power of both users. This is an important feature because it allows for a user to let another user who they trust propose or vote in their place.

The delegation of votes happens through the `XVSVault` contract by calling the `delegate` or `delegateBySig` functions. These same functions can revert vote delegation by calling the same function with a value of `0`.

## Solidity API

#### initialize

Used to initialize the contract during delegator contructor

```solidity
function initialize(address xvsVault_, struct GovernorBravoDelegateStorageV2.ProposalConfig[] proposalConfigs_, contract TimelockInterface[] timelocks, address guardian_) public
```

**Parameters**

| Name              | Type                                                    | Description                                  |
| ----------------- | ------------------------------------------------------- | -------------------------------------------- |
| xvsVault\_        | address                                                 | The address of the XvsVault                  |
| proposalConfigs\_ | struct GovernorBravoDelegateStorageV2.ProposalConfig\[] | Governance configs for each governance route |
| timelocks         | contract TimelockInterface\[]                           | Timelock addresses for each governance route |
| guardian\_        | address                                                 |                                              |



#### propose

Function used to propose a new proposal. Sender must have delegates above the proposal threshold. targets, values, signatures, and calldatas must be of equal length

```solidity
function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description, enum GovernorBravoDelegateStorageV2.ProposalType proposalType) public returns (uint256)
```

**Parameters**

| Name         | Type                                             | Description                                                |
| ------------ | ------------------------------------------------ | ---------------------------------------------------------- |
| targets      | address\[]                                       | Target addresses for proposal calls                        |
| values       | uint256\[]                                       | BNB values for proposal calls                              |
| signatures   | string\[]                                        | Function signatures for proposal calls                     |
| calldatas    | bytes\[]                                         | Calldatas for proposal calls                               |
| description  | string                                           | String description of the proposal                         |
| proposalType | enum GovernorBravoDelegateStorageV2.ProposalType | the type of the proposal (e.g NORMAL, FASTTRACK, CRITICAL) |

**Return Values**

| Name | Type    | Description                 |
| ---- | ------- | --------------------------- |
| \[0] | uint256 | Proposal id of new proposal |



#### queue

Queues a proposal of state succeeded

```solidity
function queue(uint256 proposalId) external
```

**Parameters**

| Name       | Type    | Description                     |
| ---------- | ------- | ------------------------------- |
| proposalId | uint256 | The id of the proposal to queue |



#### execute

Executes a queued proposal if eta has passed

```solidity
function execute(uint256 proposalId) external
```

**Parameters**

| Name       | Type    | Description                       |
| ---------- | ------- | --------------------------------- |
| proposalId | uint256 | The id of the proposal to execute |



#### cancel

Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold

```solidity
function cancel(uint256 proposalId) external
```

**Parameters**

| Name       | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| proposalId | uint256 | The id of the proposal to cancel |



#### getActions

Gets actions of a proposal

```solidity
function getActions(uint256 proposalId) external view returns (address[] targets, uint256[] values, string[] signatures, bytes[] calldatas)
```

**Parameters**

| Name       | Type    | Description            |
| ---------- | ------- | ---------------------- |
| proposalId | uint256 | the id of the proposal |

**Return Values**

| Name       | Type       | Description |
| ---------- | ---------- | ----------- |
| targets    | address\[] |             |
| values     | uint256\[] |             |
| signatures | string\[]  |             |
| calldatas  | bytes\[]   |             |



#### getReceipt

Gets the receipt for a voter on a given proposal

```solidity
function getReceipt(uint256 proposalId, address voter) external view returns (struct GovernorBravoDelegateStorageV1.Receipt)
```

**Parameters**

| Name       | Type    | Description              |
| ---------- | ------- | ------------------------ |
| proposalId | uint256 | the id of proposal       |
| voter      | address | The address of the voter |

**Return Values**

| Name | Type                                          | Description        |
| ---- | --------------------------------------------- | ------------------ |
| \[0] | struct GovernorBravoDelegateStorageV1.Receipt | The voting receipt |



#### state

Gets the state of a proposal

```solidity
function state(uint256 proposalId) public view returns (enum GovernorBravoDelegateStorageV1.ProposalState)
```

**Parameters**

| Name       | Type    | Description            |
| ---------- | ------- | ---------------------- |
| proposalId | uint256 | The id of the proposal |

**Return Values**

| Name | Type                                              | Description    |
| ---- | ------------------------------------------------- | -------------- |
| \[0] | enum GovernorBravoDelegateStorageV1.ProposalState | Proposal state |



#### castVote

Cast a vote for a proposal

```solidity
function castVote(uint256 proposalId, uint8 support) external
```

**Parameters**

| Name       | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| proposalId | uint256 | The id of the proposal to vote on                           |
| support    | uint8   | The support value for the vote. 0=against, 1=for, 2=abstain |



#### castVoteWithReason

Cast a vote for a proposal with a reason

```solidity
function castVoteWithReason(uint256 proposalId, uint8 support, string reason) external
```

**Parameters**

| Name       | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| proposalId | uint256 | The id of the proposal to vote on                           |
| support    | uint8   | The support value for the vote. 0=against, 1=for, 2=abstain |
| reason     | string  | The reason given for the vote by the voter                  |



#### castVoteBySig

Cast a vote for a proposal by signature

```solidity
function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external
```

**Parameters**

| Name       | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| proposalId | uint256 | The id of the proposal to vote on                           |
| support    | uint8   | The support value for the vote. 0=against, 1=for, 2=abstain |
| v          | uint8   | recovery id of ECDSA signature                              |
| r          | bytes32 | part of the ECDSA sig output                                |
| s          | bytes32 | part of the ECDSA sig output                                |



#### \_setGuardian

Sets the new governance guardian

```solidity
function _setGuardian(address newGuardian) external
```

**Parameters**

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| newGuardian | address | the address of the new guardian |



#### \_initiate

Initiate the GovernorBravo contract

```solidity
function _initiate(address governorAlpha) external
```

**Parameters**

| Name          | Type    | Description                                                         |
| ------------- | ------- | ------------------------------------------------------------------- |
| governorAlpha | address | The address for the Governor to continue the proposal id count from |



#### \_setProposalMaxOperations

Set max proposal operations

```solidity
function _setProposalMaxOperations(uint256 proposalMaxOperations_) external
```

**Parameters**

| Name                    | Type    | Description             |
| ----------------------- | ------- | ----------------------- |
| proposalMaxOperations\_ | uint256 | Max proposal operations |



#### \_setPendingAdmin

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```solidity
function _setPendingAdmin(address newPendingAdmin) external
```

**Parameters**

| Name            | Type    | Description        |
| --------------- | ------- | ------------------ |
| newPendingAdmin | address | New pending admin. |



#### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```solidity
function _acceptAdmin() external
```

