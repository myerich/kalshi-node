# Interface: OrderbookDeltaMessage

Defined in: [types/websocket.ts:198](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L198)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:202](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L202) |
| `msg.client_order_id?` | `string` | - | [types/websocket.ts:213](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L213) |
| `msg.delta` | `number` | - | [types/websocket.ts:209](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L209) |
| `msg.delta_fp` | `string` | Fixed-point 2 decimals | [types/websocket.ts:211](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L211) |
| `msg.market_id` | `string` | - | [types/websocket.ts:204](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L204) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:203](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L203) |
| `msg.price` | `number` | Cent-integer price on wire | [types/websocket.ts:206](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L206) |
| `msg.price_dollars` | `string` | Dollar-string price | [types/websocket.ts:208](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L208) |
| `msg.side` | `"yes"` \| `"no"` | - | [types/websocket.ts:212](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L212) |
| `msg.subaccount?` | `number` | - | [types/websocket.ts:214](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L214) |
| `msg.ts?` | `string` | RFC3339 optional | [types/websocket.ts:216](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L216) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:200](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L200) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:201](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L201) |
| <a id="type"></a> `type` | `"orderbook_delta"` | - | [types/websocket.ts:199](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L199) |
