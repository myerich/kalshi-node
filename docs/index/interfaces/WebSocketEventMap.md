# Interface: WebSocketEventMap

Defined in: [types/websocket.ts:578](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L578)

Type-safe event handler signatures for on/off/once.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="connected"></a> `connected` | () => `void` | [types/websocket.ts:580](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L580) |
| <a id="disconnected"></a> `disconnected` | (`event`) => `void` | [types/websocket.ts:581](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L581) |
| <a id="error"></a> `error` | (`msg`) => `void` | [types/websocket.ts:588](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L588) |
| <a id="event_lifecycle"></a> `event_lifecycle` | (`msg`) => `void` | [types/websocket.ts:595](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L595) |
| <a id="fill"></a> `fill` | (`msg`) => `void` | [types/websocket.ts:601](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L601) |
| <a id="market_lifecycle_v2"></a> `market_lifecycle_v2` | (`msg`) => `void` | [types/websocket.ts:594](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L594) |
| <a id="market_position"></a> `market_position` | (`msg`) => `void` | [types/websocket.ts:602](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L602) |
| <a id="message"></a> `message` | (`msg`) => `void` | [types/websocket.ts:616](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L616) |
| <a id="multivariate_lookup"></a> `multivariate_lookup` | (`msg`) => `void` | [types/websocket.ts:596](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L596) |
| <a id="ok"></a> `ok` | (`msg`) => `void` | [types/websocket.ts:589](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L589) |
| <a id="order_group_updates"></a> `order_group_updates` | (`msg`) => `void` | [types/websocket.ts:603](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L603) |
| <a id="orderbook_delta"></a> `orderbook_delta` | (`msg`) => `void` | [types/websocket.ts:599](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L599) |
| <a id="orderbook_snapshot"></a> `orderbook_snapshot` | (`msg`) => `void` | [types/websocket.ts:600](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L600) |
| <a id="quote_accepted"></a> `quote_accepted` | (`msg`) => `void` | [types/websocket.ts:609](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L609) |
| <a id="quote_created"></a> `quote_created` | (`msg`) => `void` | [types/websocket.ts:608](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L608) |
| <a id="quote_executed"></a> `quote_executed` | (`msg`) => `void` | [types/websocket.ts:610](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L610) |
| <a id="reconnecting"></a> `reconnecting` | (`attempt`) => `void` | [types/websocket.ts:582](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L582) |
| <a id="resubscribed"></a> `resubscribed` | () => `void` | [types/websocket.ts:583](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L583) |
| <a id="rfq_created"></a> `rfq_created` | (`msg`) => `void` | [types/websocket.ts:606](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L606) |
| <a id="rfq_deleted"></a> `rfq_deleted` | (`msg`) => `void` | [types/websocket.ts:607](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L607) |
| <a id="subscribed"></a> `subscribed` | (`msg`) => `void` | [types/websocket.ts:586](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L586) |
| <a id="ticker"></a> `ticker` | (`msg`) => `void` | [types/websocket.ts:592](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L592) |
| <a id="trade"></a> `trade` | (`msg`) => `void` | [types/websocket.ts:593](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L593) |
| <a id="unsubscribed"></a> `unsubscribed` | (`msg`) => `void` | [types/websocket.ts:587](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L587) |
| <a id="user_order"></a> `user_order` | (`msg`) => `void` | [types/websocket.ts:613](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L613) |
