# Interface: QuoteExecutedWsMessage

Defined in: [types/websocket.ts:480](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L480)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:484](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L484) |
| `msg.client_order_id` | `string` | Required per spec | [types/websocket.ts:491](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L491) |
| `msg.executed_ts` | `string` | RFC3339 | [types/websocket.ts:494](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L494) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:492](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L492) |
| `msg.order_id` | `string` | - | [types/websocket.ts:489](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L489) |
| `msg.quote_creator_id` | `string` | - | [types/websocket.ts:487](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L487) |
| `msg.quote_id` | `string` | - | [types/websocket.ts:485](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L485) |
| `msg.rfq_creator_id` | `string` | - | [types/websocket.ts:488](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L488) |
| `msg.rfq_id` | `string` | - | [types/websocket.ts:486](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L486) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:482](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L482) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:483](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L483) |
| <a id="type"></a> `type` | `"quote_executed"` | - | [types/websocket.ts:481](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L481) |
