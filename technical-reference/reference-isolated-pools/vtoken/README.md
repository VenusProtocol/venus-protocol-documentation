# VToken

A VToken is the market contract for one underlying asset within one pool. It tracks supplier shares, borrows, reserves, bad debt, interest accrual, and the market's links to its Comptroller and interest-rate model.

Modern VTokens are beacon proxies. A network's VToken beacon can upgrade every market that uses it, while each market proxy keeps independent balances and configuration.

- [User, liquidation, and administration API](vtoken.md)
- [State and interface reference](vtoken-interfaces.md)
- [Mainnet beacon implementation and clock map](../README.md#mainnet-implementation-map)

These contracts are not the legacy BNB Chain Core Pool's `VBep20`/`VBNB` family. They can represent either an active modern Core market or an old non-Core market retained for exits and recovery duties; determine lifecycle per market.
