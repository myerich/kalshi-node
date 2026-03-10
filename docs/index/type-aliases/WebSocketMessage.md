# Type Alias: WebSocketMessage

```ts
type WebSocketMessage = 
  | SubscribedMessage
  | UnsubscribedMessage
  | ErrorMessage
  | OkMessage
  | TickerMessage
  | TradeWsMessage
  | OrderbookDeltaMessage
  | OrderbookSnapshotMessage
  | FillWsMessage
  | MarketPositionsWsMessage
  | MarketLifecycleMessage
  | EventLifecycleMessage
  | OrderGroupUpdatesWsMessage
  | MultivariateWsMessage
  | RFQCreatedWsMessage
  | RFQDeletedWsMessage
  | QuoteCreatedWsMessage
  | QuoteAcceptedWsMessage
  | QuoteExecutedWsMessage
  | UserOrderWsMessage;
```

Defined in: [types/websocket.ts:553](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L553)

Union of all possible server → client messages.
