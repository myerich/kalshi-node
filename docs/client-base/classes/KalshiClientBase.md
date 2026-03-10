# Abstract Class: KalshiClientBase

Defined in: [client-base.ts:127](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L127)

## Extended by

- [`KalshiClient`](../../index/classes/KalshiClient.md)

## Constructors

### Constructor

```ts
new KalshiClientBase(): KalshiClientBase;
```

#### Returns

`KalshiClientBase`

## Methods

### acceptQuote()

```ts
acceptQuote(quoteId, data): Promise<void>;
```

Defined in: [client-base.ts:849](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L849)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `quoteId` | `string` |
| `data` | [`AcceptQuoteRequest`](../../index/interfaces/AcceptQuoteRequest.md) |

#### Returns

`Promise`\<`void`\>

***

### amendPortfolioOrder()

```ts
amendPortfolioOrder(orderId, data): Promise<AmendOrderResponse>;
```

Defined in: [client-base.ts:615](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L615)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |
| `data` | [`AmendOrderData`](../../index/interfaces/AmendOrderData.md) |

#### Returns

`Promise`\<[`AmendOrderResponse`](../../index/interfaces/AmendOrderResponse.md)\>

***

### batchCancelPortfolioOrders()

```ts
batchCancelPortfolioOrders(data): Promise<BatchCancelOrdersResponse>;
```

Defined in: [client-base.ts:590](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L590)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`BatchCancelOrdersData`](../../index/interfaces/BatchCancelOrdersData.md) |

#### Returns

`Promise`\<[`BatchCancelOrdersResponse`](../../index/interfaces/BatchCancelOrdersResponse.md)\>

***

### batchCreatePortfolioOrders()

```ts
batchCreatePortfolioOrders(data): Promise<BatchCreateOrdersResponse>;
```

Defined in: [client-base.ts:580](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L580)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`BatchCreateOrdersData`](../../index/interfaces/BatchCreateOrdersData.md) |

#### Returns

`Promise`\<[`BatchCreateOrdersResponse`](../../index/interfaces/BatchCreateOrdersResponse.md)\>

***

### confirmQuote()

```ts
confirmQuote(quoteId): Promise<void>;
```

Defined in: [client-base.ts:860](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L860)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `quoteId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### createApiKey()

```ts
createApiKey(data): Promise<CreateApiKeyResponse>;
```

Defined in: [client-base.ts:683](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L683)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`CreateApiKeyRequest`](../../index/interfaces/CreateApiKeyRequest.md) |

#### Returns

`Promise`\<[`CreateApiKeyResponse`](../../index/interfaces/CreateApiKeyResponse.md)\>

***

### createMarketInCollection()

```ts
createMarketInCollection(collectionTicker, data): Promise<CreateMarketInCollectionResponse>;
```

Defined in: [client-base.ts:366](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L366)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collectionTicker` | `string` |
| `data` | [`CreateMarketInCollectionData`](../../index/interfaces/CreateMarketInCollectionData.md) |

#### Returns

`Promise`\<[`CreateMarketInCollectionResponse`](../../index/interfaces/CreateMarketInCollectionResponse.md)\>

***

### createPortfolioOrder()

```ts
createPortfolioOrder(data): Promise<CreateOrderResponse>;
```

Defined in: [client-base.ts:600](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L600)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`CreateOrderData`](../../index/interfaces/CreateOrderData.md) |

#### Returns

`Promise`\<[`CreateOrderResponse`](../../index/interfaces/CreateOrderResponse.md)\>

***

### createPortfolioOrderGroup()

```ts
createPortfolioOrderGroup(data): Promise<CreateOrderGroupResponse>;
```

Defined in: [client-base.ts:466](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L466)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`CreateOrderGroupData`](../../index/interfaces/CreateOrderGroupData.md) |

#### Returns

`Promise`\<[`CreateOrderGroupResponse`](../../index/interfaces/CreateOrderGroupResponse.md)\>

***

### createQuote()

```ts
createQuote(data): Promise<CreateQuoteResponse>;
```

Defined in: [client-base.ts:825](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L825)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`CreateQuoteRequest`](../../index/interfaces/CreateQuoteRequest.md) |

#### Returns

`Promise`\<[`CreateQuoteResponse`](../../index/interfaces/CreateQuoteResponse.md)\>

***

### createRFQ()

```ts
createRFQ(data): Promise<CreateRFQResponse>;
```

Defined in: [client-base.ts:795](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L795)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`CreateRFQRequest`](../../index/interfaces/CreateRFQRequest.md) |

#### Returns

`Promise`\<[`CreateRFQResponse`](../../index/interfaces/CreateRFQResponse.md)\>

***

### createSubaccount()

```ts
createSubaccount(): Promise<CreateSubaccountResponse>;
```

Defined in: [client-base.ts:639](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L639)

#### Returns

`Promise`\<[`CreateSubaccountResponse`](../../index/interfaces/CreateSubaccountResponse.md)\>

***

### decreasePortfolioOrder()

```ts
decreasePortfolioOrder(orderId, data): Promise<DecreaseOrderResponse>;
```

Defined in: [client-base.ts:626](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L626)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |
| `data` | [`DecreaseOrderData`](../../index/interfaces/DecreaseOrderData.md) |

#### Returns

`Promise`\<[`DecreaseOrderResponse`](../../index/interfaces/DecreaseOrderResponse.md)\>

***

### deleteApiKey()

```ts
deleteApiKey(apiKey): Promise<void>;
```

Defined in: [client-base.ts:699](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L699)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `apiKey` | `string` |

#### Returns

`Promise`\<`void`\>

***

### deletePortfolioOrder()

```ts
deletePortfolioOrder(orderId): Promise<DeleteOrderResponse>;
```

Defined in: [client-base.ts:607](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L607)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |

#### Returns

`Promise`\<[`DeleteOrderResponse`](../../index/interfaces/DeleteOrderResponse.md)\>

***

### deletePortfolioOrderGroup()

```ts
deletePortfolioOrderGroup(groupId): Promise<void>;
```

Defined in: [client-base.ts:476](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L476)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `groupId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### deleteQuote()

```ts
deleteQuote(quoteId): Promise<void>;
```

Defined in: [client-base.ts:841](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L841)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `quoteId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### deleteRFQ()

```ts
deleteRFQ(rfqId): Promise<void>;
```

Defined in: [client-base.ts:810](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L810)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rfqId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### generateApiKey()

```ts
generateApiKey(data): Promise<GenerateApiKeyResponse>;
```

Defined in: [client-base.ts:690](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L690)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`GenerateApiKeyRequest`](../../index/interfaces/GenerateApiKeyRequest.md) |

#### Returns

`Promise`\<[`GenerateApiKeyResponse`](../../index/interfaces/GenerateApiKeyResponse.md)\>

***

### getAccountLimits()

```ts
getAccountLimits(): Promise<AccountLimitsResponse>;
```

Defined in: [client-base.ts:154](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L154)

#### Returns

`Promise`\<[`AccountLimitsResponse`](../../index/interfaces/AccountLimitsResponse.md)\>

***

### getApiKeys()

```ts
getApiKeys(): Promise<GetApiKeysResponse>;
```

Defined in: [client-base.ts:679](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L679)

#### Returns

`Promise`\<[`GetApiKeysResponse`](../../index/interfaces/GetApiKeysResponse.md)\>

***

### getBatchCandlesticks()

```ts
getBatchCandlesticks(params): Promise<BatchCandlesticksResponse>;
```

Defined in: [client-base.ts:252](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L252)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`BatchCandlesticksParams`](../../index/interfaces/BatchCandlesticksParams.md) |

#### Returns

`Promise`\<[`BatchCandlesticksResponse`](../../index/interfaces/BatchCandlesticksResponse.md)\>

***

### getCollectionLookupHistory()

```ts
getCollectionLookupHistory(collectionTicker, params): Promise<CollectionLookupHistoryResponse>;
```

Defined in: [client-base.ts:377](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L377)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collectionTicker` | `string` |
| `params` | [`CollectionLookupHistoryParams`](../../index/interfaces/CollectionLookupHistoryParams.md) |

#### Returns

`Promise`\<[`CollectionLookupHistoryResponse`](../../index/interfaces/CollectionLookupHistoryResponse.md)\>

***

### getCommunicationsID()

```ts
getCommunicationsID(): Promise<GetCommunicationsIDResponse>;
```

Defined in: [client-base.ts:780](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L780)

#### Returns

`Promise`\<[`GetCommunicationsIDResponse`](../../index/interfaces/GetCommunicationsIDResponse.md)\>

***

### getEvent()

```ts
getEvent(eventTicker, params?): Promise<EventResponse>;
```

Defined in: [client-base.ts:201](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L201)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventTicker` | `string` |
| `params?` | [`EventParams`](../../index/interfaces/EventParams.md) |

#### Returns

`Promise`\<[`EventResponse`](../../index/interfaces/EventResponse.md)\>

***

### getEventCandlesticks()

```ts
getEventCandlesticks(
   seriesTicker, 
   eventTicker, 
params): Promise<EventCandlesticksResponse>;
```

Defined in: [client-base.ts:272](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L272)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seriesTicker` | `string` |
| `eventTicker` | `string` |
| `params` | [`EventCandlesticksParams`](../../index/interfaces/EventCandlesticksParams.md) |

#### Returns

`Promise`\<[`EventCandlesticksResponse`](../../index/interfaces/EventCandlesticksResponse.md)\>

***

### getEventForecastPercentilesHistory()

```ts
getEventForecastPercentilesHistory(
   seriesTicker, 
   eventTicker, 
params): Promise<ForecastPercentilesHistoryResponse>;
```

Defined in: [client-base.ts:284](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L284)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seriesTicker` | `string` |
| `eventTicker` | `string` |
| `params` | [`ForecastPercentilesHistoryParams`](../../index/interfaces/ForecastPercentilesHistoryParams.md) |

#### Returns

`Promise`\<[`ForecastPercentilesHistoryResponse`](../../index/interfaces/ForecastPercentilesHistoryResponse.md)\>

***

### getEventMetadata()

```ts
getEventMetadata(eventTicker): Promise<EventMetadataResponse>;
```

Defined in: [client-base.ts:218](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L218)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventTicker` | `string` |

#### Returns

`Promise`\<[`EventMetadataResponse`](../../index/interfaces/EventMetadataResponse.md)\>

***

### getEventsList()

```ts
getEventsList(params?): Promise<EventsListResponse>;
```

Defined in: [client-base.ts:195](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L195)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`EventsListParams`](../../index/interfaces/EventsListParams.md) |

#### Returns

`Promise`\<[`EventsListResponse`](../../index/interfaces/EventsListResponse.md)\>

***

### getExchangeAnnouncements()

```ts
getExchangeAnnouncements(): Promise<ExchangeAnnouncementsResponse>;
```

Defined in: [client-base.ts:140](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L140)

#### Returns

`Promise`\<[`ExchangeAnnouncementsResponse`](../../index/interfaces/ExchangeAnnouncementsResponse.md)\>

***

### getExchangeSchedule()

```ts
getExchangeSchedule(): Promise<ExchangeSchedule>;
```

Defined in: [client-base.ts:144](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L144)

#### Returns

`Promise`\<[`ExchangeSchedule`](../../index/interfaces/ExchangeSchedule.md)\>

***

### getExchangeStatus()

```ts
getExchangeStatus(): Promise<ExchangeStatus>;
```

Defined in: [client-base.ts:136](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L136)

#### Returns

`Promise`\<[`ExchangeStatus`](../../index/interfaces/ExchangeStatus.md)\>

***

### getExchangeUserDataTimestamp()

```ts
getExchangeUserDataTimestamp(): Promise<UserDataTimestamp>;
```

Defined in: [client-base.ts:148](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L148)

#### Returns

`Promise`\<[`UserDataTimestamp`](../../index/interfaces/UserDataTimestamp.md)\>

***

### getFCMOrders()

```ts
getFCMOrders(params): Promise<PortfolioOrdersResponse>;
```

Defined in: [client-base.ts:760](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L760)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`GetFCMOrdersParams`](../../index/interfaces/GetFCMOrdersParams.md) |

#### Returns

`Promise`\<[`PortfolioOrdersResponse`](../../index/interfaces/PortfolioOrdersResponse.md)\>

***

### getFCMPositions()

```ts
getFCMPositions(params): Promise<PortfolioPositionsResponse>;
```

Defined in: [client-base.ts:769](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L769)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`GetFCMPositionsParams`](../../index/interfaces/GetFCMPositionsParams.md) |

#### Returns

`Promise`\<[`PortfolioPositionsResponse`](../../index/interfaces/PortfolioPositionsResponse.md)\>

***

### getHistoricalCutoff()

```ts
getHistoricalCutoff(): Promise<GetHistoricalCutoffResponse>;
```

Defined in: [client-base.ts:707](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L707)

#### Returns

`Promise`\<[`GetHistoricalCutoffResponse`](../../index/interfaces/GetHistoricalCutoffResponse.md)\>

***

### getHistoricalFills()

```ts
getHistoricalFills(params?): Promise<PortfolioFillsResponse>;
```

Defined in: [client-base.ts:740](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L740)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`GetHistoricalFillsParams`](../../index/interfaces/GetHistoricalFillsParams.md) |

#### Returns

`Promise`\<[`PortfolioFillsResponse`](../../index/interfaces/PortfolioFillsResponse.md)\>

***

### getHistoricalMarket()

```ts
getHistoricalMarket(ticker): Promise<MarketResponse>;
```

Defined in: [client-base.ts:722](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L722)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ticker` | `string` |

#### Returns

`Promise`\<[`MarketResponse`](../../index/interfaces/MarketResponse.md)\>

***

### getHistoricalMarketCandlesticks()

```ts
getHistoricalMarketCandlesticks(ticker, params): Promise<MarketCandlesticksResponse>;
```

Defined in: [client-base.ts:729](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L729)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ticker` | `string` |
| `params` | [`GetHistoricalCandlesticksParams`](../../index/interfaces/GetHistoricalCandlesticksParams.md) |

#### Returns

`Promise`\<[`MarketCandlesticksResponse`](../../index/interfaces/MarketCandlesticksResponse.md)\>

***

### getHistoricalMarkets()

```ts
getHistoricalMarkets(params?): Promise<MarketsListResponse>;
```

Defined in: [client-base.ts:714](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L714)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`GetHistoricalMarketsParams`](../../index/interfaces/GetHistoricalMarketsParams.md) |

#### Returns

`Promise`\<[`MarketsListResponse`](../../index/interfaces/MarketsListResponse.md)\>

***

### getHistoricalOrders()

```ts
getHistoricalOrders(params?): Promise<PortfolioOrdersResponse>;
```

Defined in: [client-base.ts:749](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L749)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`GetHistoricalOrdersParams`](../../index/interfaces/GetHistoricalOrdersParams.md) |

#### Returns

`Promise`\<[`PortfolioOrdersResponse`](../../index/interfaces/PortfolioOrdersResponse.md)\>

***

### getIncentivePrograms()

```ts
getIncentivePrograms(params?): Promise<IncentiveProgramsResponse>;
```

Defined in: [client-base.ts:401](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L401)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`IncentiveProgramsParams`](../../index/interfaces/IncentiveProgramsParams.md) |

#### Returns

`Promise`\<[`IncentiveProgramsResponse`](../../index/interfaces/IncentiveProgramsResponse.md)\>

***

### getLiveData()

```ts
getLiveData(type, milestoneId): Promise<LiveDataResponse>;
```

Defined in: [client-base.ts:313](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L313)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `milestoneId` | `string` |

#### Returns

`Promise`\<[`LiveDataResponse`](../../index/interfaces/LiveDataResponse.md)\>

***

### getLiveDataBatch()

```ts
getLiveDataBatch(params): Promise<LiveDataBatchResponse>;
```

Defined in: [client-base.ts:320](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L320)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`LiveDataBatchParams`](../../index/interfaces/LiveDataBatchParams.md) |

#### Returns

`Promise`\<[`LiveDataBatchResponse`](../../index/interfaces/LiveDataBatchResponse.md)\>

***

### getMarket()

```ts
getMarket(ticker): Promise<MarketResponse>;
```

Defined in: [client-base.ts:233](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L233)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ticker` | `string` |

#### Returns

`Promise`\<[`MarketResponse`](../../index/interfaces/MarketResponse.md)\>

***

### getMarketCandlesticks()

```ts
getMarketCandlesticks(
   seriesTicker, 
   ticker, 
params): Promise<MarketCandlesticksResponse>;
```

Defined in: [client-base.ts:260](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L260)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seriesTicker` | `string` |
| `ticker` | `string` |
| `params` | [`MarketCandlesticksParams`](../../index/interfaces/MarketCandlesticksParams.md) |

#### Returns

`Promise`\<[`MarketCandlesticksResponse`](../../index/interfaces/MarketCandlesticksResponse.md)\>

***

### getMarketOrderbook()

```ts
getMarketOrderbook(ticker, params?): Promise<Orderbook>;
```

Defined in: [client-base.ts:237](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L237)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ticker` | `string` |
| `params?` | [`OrderbookParams`](../../index/interfaces/OrderbookParams.md) |

#### Returns

`Promise`\<[`Orderbook`](../../index/interfaces/Orderbook.md)\>

***

### getMarketsList()

```ts
getMarketsList(params?): Promise<MarketsListResponse>;
```

Defined in: [client-base.ts:227](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L227)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`MarketsListParams`](../../index/interfaces/MarketsListParams.md) |

#### Returns

`Promise`\<[`MarketsListResponse`](../../index/interfaces/MarketsListResponse.md)\>

***

### getMarketTrades()

```ts
getMarketTrades(params?): Promise<TradesResponse>;
```

Defined in: [client-base.ts:246](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L246)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`TradesParams`](../../index/interfaces/TradesParams.md) |

#### Returns

`Promise`\<[`TradesResponse`](../../index/interfaces/TradesResponse.md)\>

***

### getMilestoneById()

```ts
getMilestoneById(milestoneId): Promise<MilestoneByIdResponse>;
```

Defined in: [client-base.ts:304](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L304)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `milestoneId` | `string` |

#### Returns

`Promise`\<[`MilestoneByIdResponse`](../../index/interfaces/MilestoneByIdResponse.md)\>

***

### getMilestones()

```ts
getMilestones(params): Promise<MilestonesResponse>;
```

Defined in: [client-base.ts:298](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L298)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`MilestonesParams`](../../index/interfaces/MilestonesParams.md) |

#### Returns

`Promise`\<[`MilestonesResponse`](../../index/interfaces/MilestonesResponse.md)\>

***

### getMultivariateEventCollection()

```ts
getMultivariateEventCollection(collectionTicker): Promise<MultivariateEventCollectionResponse>;
```

Defined in: [client-base.ts:357](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L357)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collectionTicker` | `string` |

#### Returns

`Promise`\<[`MultivariateEventCollectionResponse`](../../index/interfaces/MultivariateEventCollectionResponse.md)\>

***

### getMultivariateEventCollections()

```ts
getMultivariateEventCollections(params?): Promise<MultivariateEventCollectionsResponse>;
```

Defined in: [client-base.ts:347](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L347)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`MultivariateEventCollectionsParams`](../../index/interfaces/MultivariateEventCollectionsParams.md) |

#### Returns

`Promise`\<[`MultivariateEventCollectionsResponse`](../../index/interfaces/MultivariateEventCollectionsResponse.md)\>

***

### getMultivariateEvents()

```ts
getMultivariateEvents(params?): Promise<MultivariateEventsResponse>;
```

Defined in: [client-base.ts:210](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L210)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`MultivariateEventsParams`](../../index/interfaces/MultivariateEventsParams.md) |

#### Returns

`Promise`\<[`MultivariateEventsResponse`](../../index/interfaces/MultivariateEventsResponse.md)\>

***

### getPortfolioBalance()

```ts
getPortfolioBalance(): Promise<Balance>;
```

Defined in: [client-base.ts:513](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L513)

#### Returns

`Promise`\<[`Balance`](../../index/interfaces/Balance.md)\>

***

### getPortfolioFills()

```ts
getPortfolioFills(params?): Promise<PortfolioFillsResponse>;
```

Defined in: [client-base.ts:569](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L569)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`PortfolioFillsParams`](../../index/interfaces/PortfolioFillsParams.md) |

#### Returns

`Promise`\<[`PortfolioFillsResponse`](../../index/interfaces/PortfolioFillsResponse.md)\>

***

### getPortfolioOrderById()

```ts
getPortfolioOrderById(orderId): Promise<PortfolioOrderResponse>;
```

Defined in: [client-base.ts:420](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L420)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |

#### Returns

`Promise`\<[`PortfolioOrderResponse`](../../index/interfaces/PortfolioOrderResponse.md)\>

***

### getPortfolioOrderGroupById()

```ts
getPortfolioOrderGroupById(groupId): Promise<OrderGroupByIdResponse>;
```

Defined in: [client-base.ts:456](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L456)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `groupId` | `string` |

#### Returns

`Promise`\<[`OrderGroupByIdResponse`](../../index/interfaces/OrderGroupByIdResponse.md)\>

***

### getPortfolioOrderGroups()

```ts
getPortfolioOrderGroups(): Promise<OrderGroupsResponse>;
```

Defined in: [client-base.ts:450](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L450)

#### Returns

`Promise`\<[`OrderGroupsResponse`](../../index/interfaces/OrderGroupsResponse.md)\>

***

### getPortfolioOrderQueuePositionById()

```ts
getPortfolioOrderQueuePositionById(orderId): Promise<QueuePositionByIdResponse>;
```

Defined in: [client-base.ts:438](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L438)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |

#### Returns

`Promise`\<[`QueuePositionByIdResponse`](../../index/interfaces/QueuePositionByIdResponse.md)\>

***

### getPortfolioOrderQueuePositions()

```ts
getPortfolioOrderQueuePositions(params?): Promise<QueuePositionsResponse>;
```

Defined in: [client-base.ts:428](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L428)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`QueuePositionsParams`](../../index/interfaces/QueuePositionsParams.md) |

#### Returns

`Promise`\<[`QueuePositionsResponse`](../../index/interfaces/QueuePositionsResponse.md)\>

***

### getPortfolioOrders()

```ts
getPortfolioOrders(params?): Promise<PortfolioOrdersResponse>;
```

Defined in: [client-base.ts:411](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L411)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`PortfolioOrdersParams`](../../index/interfaces/PortfolioOrdersParams.md) |

#### Returns

`Promise`\<[`PortfolioOrdersResponse`](../../index/interfaces/PortfolioOrdersResponse.md)\>

***

### getPortfolioPositions()

```ts
getPortfolioPositions(params?): Promise<PortfolioPositionsResponse>;
```

Defined in: [client-base.ts:537](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L537)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`PortfolioPositionsParams`](../../index/interfaces/PortfolioPositionsParams.md) |

#### Returns

`Promise`\<[`PortfolioPositionsResponse`](../../index/interfaces/PortfolioPositionsResponse.md)\>

***

### getPortfolioSettlements()

```ts
getPortfolioSettlements(params?): Promise<PortfolioSettlementsResponse>;
```

Defined in: [client-base.ts:549](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L549)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`PortfolioSettlementsParams`](../../index/interfaces/PortfolioSettlementsParams.md) |

#### Returns

`Promise`\<[`PortfolioSettlementsResponse`](../../index/interfaces/PortfolioSettlementsResponse.md)\>

***

### getPortfolioSubaccountBalances()

```ts
getPortfolioSubaccountBalances(): Promise<SubaccountBalancesResponse>;
```

Defined in: [client-base.ts:517](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L517)

#### Returns

`Promise`\<[`SubaccountBalancesResponse`](../../index/interfaces/SubaccountBalancesResponse.md)\>

***

### getPortfolioSubaccountTransfers()

```ts
getPortfolioSubaccountTransfers(params?): Promise<SubaccountTransfersResponse>;
```

Defined in: [client-base.ts:525](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L525)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`SubaccountTransfersParams`](../../index/interfaces/SubaccountTransfersParams.md) |

#### Returns

`Promise`\<[`SubaccountTransfersResponse`](../../index/interfaces/SubaccountTransfersResponse.md)\>

***

### getPortfolioTotalRestingOrderValue()

```ts
getPortfolioTotalRestingOrderValue(): Promise<RestingValue>;
```

Defined in: [client-base.ts:561](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L561)

#### Returns

`Promise`\<[`RestingValue`](../../index/interfaces/RestingValue.md)\>

***

### getQuote()

```ts
getQuote(quoteId): Promise<GetQuoteResponse>;
```

Defined in: [client-base.ts:833](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L833)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `quoteId` | `string` |

#### Returns

`Promise`\<[`GetQuoteResponse`](../../index/interfaces/GetQuoteResponse.md)\>

***

### getQuotes()

```ts
getQuotes(params?): Promise<GetQuotesResponse>;
```

Defined in: [client-base.ts:818](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L818)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`GetQuotesParams`](../../index/interfaces/GetQuotesParams.md) |

#### Returns

`Promise`\<[`GetQuotesResponse`](../../index/interfaces/GetQuotesResponse.md)\>

***

### getRFQ()

```ts
getRFQ(rfqId): Promise<GetRFQResponse>;
```

Defined in: [client-base.ts:802](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L802)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `rfqId` | `string` |

#### Returns

`Promise`\<[`GetRFQResponse`](../../index/interfaces/GetRFQResponse.md)\>

***

### getRFQs()

```ts
getRFQs(params?): Promise<GetRFQsResponse>;
```

Defined in: [client-base.ts:788](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L788)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`GetRFQsParams`](../../index/interfaces/GetRFQsParams.md) |

#### Returns

`Promise`\<[`GetRFQsResponse`](../../index/interfaces/GetRFQsResponse.md)\>

***

### getSearchFiltersBySport()

```ts
getSearchFiltersBySport(): Promise<FiltersBySportsResponse>;
```

Defined in: [client-base.ts:174](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L174)

#### Returns

`Promise`\<[`FiltersBySportsResponse`](../../index/interfaces/FiltersBySportsResponse.md)\>

***

### getSearchTagsForSeriesCategories()

```ts
getSearchTagsForSeriesCategories(): Promise<TagsByCategoriesResponse>;
```

Defined in: [client-base.ts:170](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L170)

#### Returns

`Promise`\<[`TagsByCategoriesResponse`](../../index/interfaces/TagsByCategoriesResponse.md)\>

***

### getSeries()

```ts
getSeries(seriesTicker, params?): Promise<SeriesResponse>;
```

Defined in: [client-base.ts:184](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L184)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `seriesTicker` | `string` |
| `params?` | [`SeriesParams`](../../index/interfaces/SeriesParams.md) |

#### Returns

`Promise`\<[`SeriesResponse`](../../index/interfaces/SeriesResponse.md)\>

***

### getSeriesFeeChanges()

```ts
getSeriesFeeChanges(params?): Promise<SeriesFeeChangesResponse>;
```

Defined in: [client-base.ts:162](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L162)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`SeriesFeeChangesParams`](../../index/interfaces/SeriesFeeChangesParams.md) |

#### Returns

`Promise`\<[`SeriesFeeChangesResponse`](../../index/interfaces/SeriesFeeChangesResponse.md)\>

***

### getSeriesList()

```ts
getSeriesList(params?): Promise<SeriesListResponse>;
```

Defined in: [client-base.ts:178](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L178)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`SeriesListParams`](../../index/interfaces/SeriesListParams.md) |

#### Returns

`Promise`\<[`SeriesListResponse`](../../index/interfaces/SeriesListResponse.md)\>

***

### getStructuredTargetById()

```ts
getStructuredTargetById(structuredTargetId): Promise<StructuredTargetByIdResponse>;
```

Defined in: [client-base.ts:336](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L336)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `structuredTargetId` | `string` |

#### Returns

`Promise`\<[`StructuredTargetByIdResponse`](../../index/interfaces/StructuredTargetByIdResponse.md)\>

***

### getStructuredTargets()

```ts
getStructuredTargets(params?): Promise<StructuredTargetsResponse>;
```

Defined in: [client-base.ts:328](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L328)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params?` | [`StructuredTargetsParams`](../../index/interfaces/StructuredTargetsParams.md) |

#### Returns

`Promise`\<[`StructuredTargetsResponse`](../../index/interfaces/StructuredTargetsResponse.md)\>

***

### getSubaccountNetting()

```ts
getSubaccountNetting(): Promise<GetSubaccountNettingResponse>;
```

Defined in: [client-base.ts:659](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L659)

#### Returns

`Promise`\<[`GetSubaccountNettingResponse`](../../index/interfaces/GetSubaccountNettingResponse.md)\>

***

### lookupTickersInCollection()

```ts
lookupTickersInCollection(collectionTicker, data): Promise<LookupTickersInCollectionResponse>;
```

Defined in: [client-base.ts:388](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L388)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collectionTicker` | `string` |
| `data` | [`LookupTickersInCollectionData`](../../index/interfaces/LookupTickersInCollectionData.md) |

#### Returns

`Promise`\<[`LookupTickersInCollectionResponse`](../../index/interfaces/LookupTickersInCollectionResponse.md)\>

***

### request()

```ts
abstract protected request<T>(
   method, 
   endpoint, 
options?): Promise<T>;
```

Defined in: [client-base.ts:128](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L128)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `method` | `string` |
| `endpoint` | `string` |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) |

#### Returns

`Promise`\<`T`\>

***

### resetPortfolioOrderGroup()

```ts
resetPortfolioOrderGroup(groupId): Promise<void>;
```

Defined in: [client-base.ts:484](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L484)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `groupId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### transferBetweenSubaccounts()

```ts
transferBetweenSubaccounts(data): Promise<void>;
```

Defined in: [client-base.ts:647](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L647)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`TransferBetweenSubaccountsData`](../../index/interfaces/TransferBetweenSubaccountsData.md) |

#### Returns

`Promise`\<`void`\>

***

### triggerPortfolioOrderGroup()

```ts
triggerPortfolioOrderGroup(groupId): Promise<void>;
```

Defined in: [client-base.ts:492](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L492)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `groupId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### updatePortfolioOrderGroupLimit()

```ts
updatePortfolioOrderGroupLimit(groupId, data): Promise<void>;
```

Defined in: [client-base.ts:500](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L500)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `groupId` | `string` |
| `data` | [`UpdateOrderGroupLimitData`](../../index/interfaces/UpdateOrderGroupLimitData.md) |

#### Returns

`Promise`\<`void`\>

***

### updateSubaccountNetting()

```ts
updateSubaccountNetting(data): Promise<GetSubaccountNettingResponse>;
```

Defined in: [client-base.ts:667](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/client-base.ts#L667)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`UpdateSubaccountNettingRequest`](../../index/interfaces/UpdateSubaccountNettingRequest.md) |

#### Returns

`Promise`\<[`GetSubaccountNettingResponse`](../../index/interfaces/GetSubaccountNettingResponse.md)\>
