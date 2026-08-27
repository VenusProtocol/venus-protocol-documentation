# Submitting a VIP

Venus Improvement Proposals (VIPs) are executable governance proposals. Prepare and review a proposal as production code: a successful vote can change protocol configuration, transfer assets, or upgrade contracts.

{% hint style="warning" %}
At BNB Chain block `118,362,254`, every proposal route required at least 1,000,000 delegated XVS to propose. This threshold is configurable. Read the Governor's `proposalConfigs` before submitting instead of relying on a value copied from the interface or this page.
{% endhint %}

## Before submitting

1. Publish the motivation and specification on the [Venus Community Forum](https://community.venus.io/).
2. Define every target, value, function signature, argument, and destination network.
3. Add the proposal to the [VenusProtocol/vips repository](https://github.com/VenusProtocol/vips) so the payload and simulations can be reviewed.
4. Run the relevant fork simulations and review their state-change assertions.
5. Confirm that the selected timelock has permission to execute every action.

The Critical route still exists in the Governor, but [VIP-645](https://venus.io/governance/proposal/645?chainId=56) removed all of its privileged permissions. Do not select it for privileged actions unless governance grants the required permissions again.

## Generate and simulate the proposal

The VIP repository provides Hardhat tasks for building proposal files and running simulations. From a current checkout with its dependencies installed, the normal workflow is:

```bash
npx hardhat test simulations/<simulation-path> --fork <network>
npx hardhat createProposal --network <networkName>
```

For the proposal destination, select `venusApp` when generating a file for the Venus Governance interface. Follow the repository's current [Create Proposal instructions](https://github.com/VenusProtocol/vips#create-proposal), because task options can evolve.

Maintainers can also submit a reviewed VIP from the repository with:

```bash
npx hardhat propose <path-to-vip-relative-to-vips> --network bscmainnet
```

## Submit through the Governance portal

1. Open the [Venus Governance portal](https://venus.io/governance), connect the proposer wallet, and select **Create Proposal**.
2. Upload the generated proposal file, or create the proposal manually.
3. Select the intended Normal or Fast-track route.
4. Review the decoded title, description, targets, native values, function signatures, arguments, and destination networks.
5. Confirm that the portal output exactly matches the reviewed source and simulation.
6. Submit the transaction and record its transaction hash and proposal ID.

The Governor permits only one pending or active proposal per proposer. If the address already has one, wait for it to leave those states before submitting another.

## After submission

Share the on-chain proposal link and source with reviewers. Monitor the proposal through voting, then queue and execute it after the applicable timelock if it succeeds. For current route configuration and success conditions, see [Venus Improvement Proposals](../../governance/decentralization.md).
