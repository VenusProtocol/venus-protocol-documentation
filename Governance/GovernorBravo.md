# Governance

## Introduction

Venus Governance V4 is updated version of on-chain governance, allowing unique features such as delegated voting, rapid protocol upgrades, governance upgrades. On top of that Governance V4 brings a granularity in our pause mechanism, allowing governance to pause any actions on any markets, especially in the context of isolated markets.  **The above changes are meant to increase Governance efficiency, while reducing opportunities for malicious or erroneous proposals to slip through.**

## Details

Governance has **3 main contracts**: **GovernanceBravoDelegate, XVSVault, XVS** token.
XVS token is the protocol token used for protocol users to cast their vote on proposals submitted from other users.
XVSVault is the main stacking contract for XVS. Users should stake their XVS in order to be able to cast their votes. Users can also delegate their voting power to other users via the XVSVault. This contract is also responsible for staking rewards for each pool.

# Governor Bravo
GovernanceBravoDelegate is Venus main Governance contract. Users interact with it to:
- Submit new proposal
- Vote on a proposal
- Cancel proposal
- Queue proposal for execution to a timelock executor contract
GovernanceBravoDelegate is using XVSVault to get information about voting power of users to enforce some of important governance rules:
- Users with voting power below proposalThreshold cannot submit a proposal
- If a user's voring power drops below certain amount, anyone can cancel the the proposal. On the other hand governance guardian and proposal creator can cancel a proposal at anytime, but before it is queued for execution.

## Venus Improvement Proposal
Venus V4 Governance brings up categorisation for VIPs in order to optimise some actions such as the fast expedition of interest rate, risk parameters and other crucial protocol variables.
In order to implement different VIP roles, a solution of having 3 different types of VIPs has been implemented:

- NORMAL
- FASTTRACK
- CRITICAL

Each type has the following parameters, based on which the governance flow might change:

- `votingDelay` - **The delay before voting on a proposal may take place, once proposed, in blocks**
- `votingPeriod` - **The duration of voting on a proposal, in blocks**
- `proposalThreshold` - **The number of votes required in order for a voter to become a proposer**

The configurations for the three types is done upon initialisation of the **GovernorBravo** contract.
For each type of VIP there is also separate timelock executor contract, which will be used to dispatch the VIP to be executed, giving even more control over the flow of each type of VIP.

![chart](./charts/vip_lifecycle.png)

## Voting
After a VIP is proposed, one could vote on it only after the `votingDelay` has been passed. If `votingDelay = 0` the voting will begin in the next block after the proposal has been submitted. After the delay, the proposal state is `ACTIVE` and users can cast their vote `for` or `against`  the proposal, weighted by the users total voting power (tokens + delegated voting power). The total voting power for the user is obtained by calling XVSVault's `getPriorVotes`.
GovernorBravoDelegate also  accepts EIP-712 signatures for voting on proposals via the external function `castVoteBySig`

## Delegating
A users voting power is not measured only by the amount of staked XVS he has, but also delegated voting power is taken into account. Delegating is the process of 1 user delegating his voting power to other, so that the latter has the combined voting power of both users. This is quite a crucial feature, because of the fact that a voter can submit a proposal if he has **passed** a certain **voting power threshold** which in our code is called `proposalThreshold`. 
The delegation of votes should happen through the XVSVault contract by calling `delegate` or `delegateBySig` functions. In order to revert delegation of votes to a user, one should call the same functions with a value of `0`.
