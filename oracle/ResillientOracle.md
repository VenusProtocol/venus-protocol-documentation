# Resillient Oracle

## Introduction

Resillient oracle is the price oracle that the protocol interacts with for fetching price of assets. 

## Details

DeFi Protocols are usually vulnerable to price oracles reporting incorrect prices. There are various ways in which oracle prices can be manipulated depending on the type of price oracle used which can create a single point of failure and opens several ways for attacking the protocol.

Keeping this in mind, we have designed a resilient oracle which uses multiple oracle sources to validate prices and fallback mechanisms to provide accurate prices and protect from oracle attacks. Currently it includes integrations with Chainlink, Pyth, Binance Oracle and TWAP (Time-Weighted Average Price) oracles. TWAP uses PancakeSwap as the on-chain price source.

The way the resilient oracle works is for every market (vToken) we configure the main, pivot and fallback oracles. The main oracle oracle is the most trustworthy price source, the pivot oracle is is used as a loose sanity checker and the fallback oracle is used as a backup price source.

![Resillient Oracle](../.gitbook/assets/oracle.png)

To validate the price between two oracles we set an upper and lower bound ratio for every market. The upper bound ratio represents the deviation between reported prices (price from oracle that’s being validated) and anchor price (price from oracle we are validating against) beyond which the reported price will be invalidated. And the lower bound ratio presents the deviation between reported price and anchor price below which the reported price will be invalidated. So for oracle price to be considered valid the below statement should be true:

```
anchorRatio = anchorPrice/reporterPrice
isValid = anchorRatio <= upperBoundAnchorRatio && anchorRatio >= lowerBoundAnchorRatio
```

We usually use Chainlink as the main oracle, TWAP or Pyth oracle as pivot oracle depending on which supports the given market and binance oracle is used as the fallback oracle. For some markets we may use Pyth or TWAP as the main oracle if the token price is not supported by Chainlink or Binance oracles. 

When fetching an oracle price, for the price to be valid it must be positive and not stagnant. If the price is invalid then we consider the oracle to be stagnant and treat it like it's disabled.
