# Venus Improvement Proposal
Venus v4 Governance brings up categorisation for VIPs in order to optimise some actions such as the fast expedition of interest rate, risk parameters and other crucial protocol variables.
In order to implement different VIP roles, we came up with the solution of having 3 different types of VIPs:

 - NORMAL
 - FASTTRACK
 - CRITICAL

Each type has the following parameters, based on which the governance flow might change:

 - `votingDelay` - **The delay before voting on a proposal may take place, once proposed, in blocks**
 - `votingPeriod` - **The duration of voting on a proposal, in blocks**
 - `proposalThreshold` - **The number of votes required in order for a voter to become a proposer**
 
 The configurations for the three types is done upon initialisation of the **GovernorBravo** contract.
 For each type of VIP there is also separate timelock executor contract, which will be used to dispatch the VIP to be executed, giving even more control over the flow of each type of VIP.