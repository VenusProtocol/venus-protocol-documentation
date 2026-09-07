# XVS

XVS is the governance token of Venus Protocol. Holders can deposit XVS in the XVS Vault, delegate the associated voting power, and participate in Venus Improvement Proposals (VIPs).

Staking alone does not make voting power active: the vault position must be delegated to the holder's address or another delegate. A proposal uses the delegate's voting-power snapshot at its start block. Delegation does not transfer ownership of the staked XVS.

See [Delegating and Voting](../guides/governance-guide/delegating.md) for the participation workflow and [Venus Improvement Proposals](../governance/decentralization.md) for current governance rules.

## Vault rewards

The XVS Vault can distribute governance-funded base rewards and XVS purchased with protocol revenue. Reward funding and emission speed are configurable and may change through VIPs. Staking XVS therefore does not guarantee a particular yield. See [Tokenomics](../governance/tokenomics.md) for the current policy snapshot and instructions for checking the live reward speed.

## Venus Prime

An XVS Vault position also contributes to [Venus Prime](../whats-new/prime-yield.md) eligibility. Prime uses a time-weighted leaderboard that considers both the amount and age of eligible XVS stakes. At each configured issuance epoch, governance can issue a limited number of non-transferable Prime tokens to qualifying accounts.

Leaderboard rank does not guarantee issuance, and the epoch schedule, token limit, minimum stake, and other conditions are governance-configurable. Check the current Prime interface and deployed configuration before relying on a particular eligibility rule.
