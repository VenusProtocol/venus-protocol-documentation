# GovernorBravoEvents

Set of events emitted by the GovernorBravo contracts.

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

### proposalCount

The total number of proposals

```solidity
function proposalCount() external returns (uint256)
```

---
