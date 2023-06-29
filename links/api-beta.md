---
description: The Venus Protocol API providing access to indexed protocol data.
---

# API (Beta)

The API is available without authentication for testnet and mainnet.

mainnet: [https://api.venus.io](https://api.venus.io/api/governance/venus)\
testnet: [https://testnetapi.venus.io](https://testnetapi.venus.io/api/transactions/)\
\
All endpoints are considered unstable and will be refactored.

{% swagger src="../.gitbook/assets/swagger.json" path="/api/governance/venus" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/market_history/graph" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/transactions" method="get" expanded="false" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/proposals" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/proposals/:id" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/voters/:id" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/voters/accounts" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api/voters/accounts/:address" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/api//voters/history/:address" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}
