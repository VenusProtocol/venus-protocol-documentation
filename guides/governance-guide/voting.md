# Voting
  After a VIP is proposed, one could vote on it only after the `votingDelay` has been passed. If `votingDelay = 0` the voting will begin in the next block after the proposal has been submitted. After the delay, the proposal state is `ACTIVE` and users can cast their vote `for` or `against`  the proposal, weighted by the users total voting power (tokens + delegated voting power).
