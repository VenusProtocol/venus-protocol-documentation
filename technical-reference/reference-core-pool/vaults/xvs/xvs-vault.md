# XVS Vault API

The XVS Vault lets users stake configured tokens, accrue rewards, request and execute withdrawals, and delegate voting power. Deployments can be block-based or time-based; use the [mainnet version map](README.md) to select the correct units and implementation.

{% hint style="danger" %}
Call the chain's proxy, not the implementation. Verify `implementation()`, `vaultPaused()`, `isTimeBased()`, `blocksOrSecondsPerYear()`, pool configuration, reward funding, and live permissions before constructing a transaction.
{% endhint %}

## User staking and rewards

```solidity
function deposit(address rewardToken, uint256 pid, uint256 amount) external
function claim(address account, address rewardToken, uint256 pid) external
function requestWithdrawal(address rewardToken, uint256 pid, uint256 amount) external
function executeWithdrawal(address rewardToken, uint256 pid) external
function pendingReward(address rewardToken, uint256 pid, address user) external view returns (uint256)
function getEligibleWithdrawalAmount(address rewardToken, uint256 pid, address user) external view returns (uint256)
function getRequestedAmount(address rewardToken, uint256 pid, address user) external view returns (uint256)
function getWithdrawalRequests(address rewardToken, uint256 pid, address user) external view returns (WithdrawalRequest[])
```

The user must approve the vault to transfer the staked token before depositing. A withdrawal has two stages: request it, wait until the pool's locking period has elapsed, then execute it. `claim(address,...)` pays the named account.

If the XVSStore cannot fully pay a reward, the vault transfers the available amount and records the remainder in `pendingRewardTransfers` rather than treating the entire claim as paid.

## Reward clock and configuration

The canonical speed setter and getter use block-or-second terminology:

```solidity
function setRewardAmountPerBlockOrSecond(address rewardToken, uint256 rewardAmount) external
function rewardTokenAmountsPerBlockOrSecond(address rewardToken) external view returns (uint256)
function isTimeBased() external view returns (bool)
function blocksOrSecondsPerYear() external view returns (uint256)
```

The old `rewardTokenAmountsPerBlock(address)` compatibility getter returns the same speed mapping, but its name does not describe time-based deployments. The previously documented `setRewardAmountPerBlock(address,uint256)` selector is not part of the current implementation; operator tooling must use `setRewardAmountPerBlockOrSecond` after verifying the deployed ABI.

Pool addition, allocation updates, speed changes, withdrawal-lock changes, pause/resume, and `setBlocksPerYear` use signature-specific Access Control Manager checks. `setXvsStore`, `setPrimeToken`, `initializeTimeManager`, and `setAccessControl` are restricted to the proxy admin.

## Governance delegation

```solidity
function delegate(address delegatee) external
function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external
function delegates(address account) external view returns (address)
function getCurrentVotes(address account) external view returns (uint96)
function getPriorVotes(address account, uint256 blockNumberOrSecond) external view returns (uint96)
```

Voting checkpoints use the deployment's configured clock. On time-based chains, the historical parameter is a timestamp; on block-based chains, it is a block number. Governance proposal voting on BNB Chain uses the BNB vault snapshots.

## Prime integration

The vault can call the configured Prime token when an eligible XVS stake changes. Prime generation and support differ by network; see [Prime Contract Versions](../../prime/README.md). Do not assume the BNB PrimeV2 leaderboard callback exists on a Prime V1 deployment.

Source: [XVSVault.sol in venus-protocol v10.3.0](https://github.com/VenusProtocol/venus-protocol/blob/v10.3.0/contracts/XVSVault/XVSVault.sol).
