---
description: The Venus Protocol API providing access to indexed protocol data.
---

# API

Venus Protocol API provides two groups of endpoints

**Market Data -** Endpoints relating to lending markets

**Activity -** Endpoints relating to user interactions with markets

**Governance -** Endpoints providing information about proposals and voter activity

## Base URL

The API is available without authentication for testnet and mainnet.

mainnet: [https://api.venus.io](https://api.venus.io/api/governance/venus)\
testnet: [https://testnetapi.venus.io](https://testnetapi.venus.io/api/transactions/)

## Versioning

Endpoints are versioned using the `accept-version` header. The values for this header can be `stable` or `next`. By default the `stable` version is returned. When a `next` version is available, a `Warning - 299` header will be added to the `stable` version with a message of breaking changes. To receive this new version the `accept-version` header can be set to `next`.

When the latest `next` version is made stable and the previous stable version is deprecated, both values for `accept-version` will return the latest version. Using the `next` header at this point will add a `Warning - 299` header alerting the client to remove `accept-version: next` to avoid receiving unexpected changes in the future.

#### Versioning Choreography

These steps describe the process of upgrading endpoints to new versions as they are released

1. A `next` version is made available, accessible with the `accept-version: next` header. A `Warning - 299` header is added to the stable version with details about breaking changes.
2. Clients will be given adequate time to upgrade to use the next version.
3. The previous stable version will be deprecated, the next version becomes stable and using the `accept-version: next` header will add a warning to remove the header or use the stable version.
4. Clients remove the `accept-version: next` header to avoid receiving unexpected changes.
5. The endpoint is now ready to release another version.

### Pool Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/pools" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

### Market Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/markets" method="get" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/markets/history" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/markets/{address}/cmc-total-supply" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/markets/{address}/cmc-circulating-supply" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

## Activity

{% swagger src="../.gitbook/assets/swagger.json" path="/activity/transactions" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

### Governance Endpoints

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/:id" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/:proposalId/voteSummary" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/proposals/votes" method="get" expanded="false" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/voters" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

{% swagger src="../.gitbook/assets/swagger.json" path="/governance/voters/:address/summary" method="get" fullWidth="true" %}
[swagger.json](../.gitbook/assets/swagger.json)
{% endswagger %}

#### Deprecated
