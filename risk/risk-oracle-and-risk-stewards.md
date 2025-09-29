# Risk Stewards & Risk Oracles

## Overview

Venus Protocol incorporates Risk Oracles and Risk Stewards to ensure risk parameters remain up-to-date, resilient, and aligned with real-time market conditions—all while preserving decentralized governance. Previously, Venus relied on manually created VIPs to apply risk updates based on Chaos Labs recommendations. With the introduction of the Risk Steward and its on-chain receiver, this process is now automated through a secure and permissioned mechanism. In the initial phase, only market cap-related parameters—specifically supply caps and borrow caps—will be updated automatically, improving responsiveness and operational efficiency.

---

## Chaos Labs Risk Oracle

The **Chaos Labs Risk Oracle** is a system designed to continuously analyze market conditions—such as price volatility, liquidity, asset utilization, and liquidation events—and generate risk parameter recommendations tailored to the Venus Protocol.

### Key Benefits:

- **Real-time updates** to key parameters like supply and borrow caps
- **Automated adjustments** to ensure optimal lending and borrowing rates
- **More responsive risk management** with lower latency
- **Reduced operational overhead** for the Venus community

The Risk Oracle makes Venus more adaptable while ensuring parameters remain within safe and governance-approved limits.

---

## Risk Steward

A **Risk Steward** is an on-chain smart contract that executes risk parameter updates on behalf of the protocol, based on recommendations from the Risk Oracle. Venus has introduced this role to bridge off-chain risk intelligence with on-chain execution in a controlled, transparent way.

### Role of the Risk Steward:

- Reads values from the Risk Oracle during execution
- Updates only pre-approved risk parameters (e.g., supply caps, borrow caps)
- Operates within limits set by Venus governance
- Cannot modify critical protocol settings such as interest rate models, market listings, or governance controls

This structure ensures **faster, automated adjustments** without compromising community control.

---

## How It Works

1. **Data Source**: Chaos Labs publishes updated recommendations via the Risk Oracle.
2. **Keeper Role**: A Keeper bot observes changes and initiates transactions to update Venus Protocol’s parameters.
3. **Validation**: During execution, Venus contracts read and apply new values **only if they are within predefined safety bounds**.
4. **Challenge Window**:  Critical updates, which will be introduced in an upcoming phase, will go through governance and can be **challenged or vetoed** during a defined challenge window before they take effect.

## Governance & Control

Importantly, this system does **not bypass protocol governance**. All automated updates happen within constraints defined and approved by the Venus community.

Any change made through the Risk Oracle follows an **optimistic governance model**:

This process **preserves decentralization** while enabling faster, safer protocol maintenance.

---

## What’s Next

Initially, the integration focuses on automating supply and borrow cap updates. Over time, additional parameters may be supported as part of a gradual rollout, always subject to DAO approval and governance-defined constraints.

---

## Learn More

- [Chaos Labs: Risk Oracles — Real-Time Risk Management for DeFi](https://chaoslabs.xyz/posts/risk-oracles-real-time-risk-management-for-defi)  
- [Venus Community Proposal: Integrate Chaos Labs Risk Oracle](https://community.venus.io/t/integrate-chaos-labs-risk-oracle-to-venus-protocol/4569)

