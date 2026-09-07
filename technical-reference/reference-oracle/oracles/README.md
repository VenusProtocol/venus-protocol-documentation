# Price Source Adapters

`ResilientOracle` roles are assigned per underlying asset. An adapter type does not have a universal role: a Chainlink-compatible, RedStone, Binance, reference, or correlated-token adapter can be main, pivot, fallback, disabled, or absent depending on the live configuration.

## Documented adapters

* [ChainlinkOracle](chainlink-oracle.md)
* [SequencerChainlinkOracle](sequencer-chainlink-oracle.md)
* [BinanceOracle](binance-oracle.md)
* [Correlated token oracles](../correlated-token-oracles/README.md)

The stable oracle repository also contains generic and asset-specific adapters that do not yet have individual pages here. Use the [stable source tree](https://github.com/VenusProtocol/oracle/tree/main/contracts) together with the [configuration snapshot](../../../risk/resilient-price-oracle.md#current-configuration) and live on-chain reads.

{% hint style="info" %}
The former Venus `PythOracle` is not a maintained source adapter. Its source, interface, deployment script, mocks, and tests were [removed as unused on March 11, 2025](https://github.com/VenusProtocol/oracle/commit/2f9600f6b7a33a87ea0ed941d956ce71daa74480). Historical deployment JSON remains in the repository for provenance; the existence of an artifact or old proxy does not mean it is enabled in a live `ResilientOracle` configuration.
{% endhint %}
