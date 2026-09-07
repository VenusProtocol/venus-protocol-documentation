# Delegating and Voting

XVS deposited in the XVS Vault can participate in Venus governance after its voting power has been delegated. You can delegate to your own address or to another address without transferring ownership of the staked XVS.

{% hint style="info" %}
Staking XVS and delegating voting power are separate actions. Voting power must be delegated before a proposal's voting snapshot to count for that proposal.
{% endhint %}

## Delegate voting power

1. Open the [Venus Governance portal](https://venus.io/governance) and connect the wallet that controls the vault position.
2. If necessary, deposit XVS into the XVS Vault.
3. Select the governance delegation action.
4. Enter the address that should receive the voting power. Use your connected address to self-delegate.
5. Review and confirm the delegation transaction in your wallet.

Delegating does not lock or transfer additional tokens. Redelegating moves voting power to a new delegate after the transaction is confirmed, but it does not retroactively change a proposal snapshot.

You can verify delegation on the XVS Vault by reading `delegates(address)`, `getCurrentVotes(address)`, and `getPriorVotes(address, blockNumber)`. Contract addresses are listed in [Deployed Governance Contracts](../../deployed-contracts/governance.md).

## Vote on a VIP

1. Open an active proposal in the [Governance portal](https://venus.io/governance).
2. Review the proposal description, discussion, executable actions, simulations, and proposal route.
3. Choose **For**, **Against**, or **Abstain** and, if available, add a public reason.
4. Confirm the voting transaction in your wallet.
5. Verify that the transaction succeeded and that the proposal displays the vote.

There is no 600,000 XVS minimum for an individual voter. An address can cast the voting power recorded for it at the proposal's start block.

The current global quorum is 1,500,000 **For** votes. A proposal succeeds only if **For** is greater than **Against** and **For** meets the quorum. Abstain votes are visible in the result but do not count toward that quorum. Governance can change these parameters, so check the live Governor when the exact value matters.

For route-specific voting periods and timelock delays, see [Venus Improvement Proposals](../../governance/decentralization.md).
