# GovernorBravoEvents

Storage structures and events used by the stable [`GovernorBravoInterfaces.sol` v2.15.0 source](https://github.com/VenusProtocol/governance-contracts/blob/v2.15.0/contracts/Governance/GovernorBravoInterfaces.sol).

The V1 scalar `votingDelay`, `votingPeriod`, `proposalThreshold`, and `timelock` storage slots are explicitly deprecated in the source but retained for upgrade-safe layout. Current logic uses the V2 `proposalConfigs` and `proposalTimelocks` mappings, plus the V3 `validationParams` structure.

# Solidity API

```solidity
struct Proposal {
  uint256 id;
  address proposer;
  uint256 eta;
  address[] targets;
  uint256[] values;
  string[] signatures;
  bytes[] calldatas;
  uint256 startBlock;
  uint256 endBlock;
  uint256 forVotes;
  uint256 againstVotes;
  uint256 abstainVotes;
  bool canceled;
  bool executed;
  mapping(address => struct GovernorBravoDelegateStorageV1.Receipt) receipts;
  uint8 proposalType;
}
```

```solidity
struct Receipt {
  bool hasVoted;
  uint8 support;
  uint96 votes;
}
```

```solidity
enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}
```

```solidity
enum ProposalType {
  NORMAL,
  FASTTRACK,
  CRITICAL
}
```

```solidity
struct ProposalConfig {
  uint256 votingDelay;
  uint256 votingPeriod;
  uint256 proposalThreshold;
}
```

```solidity
struct ValidationParams {
  uint256 minVotingPeriod;
  uint256 maxVotingPeriod;
  uint256 minVotingDelay;
  uint256 maxVotingDelay;
}
```

### proposalCount

The total number of proposals

```solidity
function proposalCount() external returns (uint256)
```

---
