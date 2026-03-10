# Interface: OrderbookSnapshotMessage

Defined in: [types/websocket.ts:220](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L220)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:224](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L224) |
| `msg.market_id` | `string` | - | [types/websocket.ts:226](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L226) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:225](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L225) |
| `msg.no` | \[`number`, `number`\][] | - | [types/websocket.ts:229](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L229) |
| `msg.no_dollars` | \[`string`, `number`\][] | - | [types/websocket.ts:232](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L232) |
| `msg.no_dollars_fp?` | \[`string`, `string`\][] | Dollar-string tuples: [price_dollars, count_fp] | [types/websocket.ts:236](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L236) |
| `msg.yes` | \[`number`, `number`\][] | Legacy cent-integer tuples: [cents, quantity] | [types/websocket.ts:228](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L228) |
| `msg.yes_dollars` | \[`string`, `number`\][] | Dollar-string tuples: [dollarPrice, quantity] | [types/websocket.ts:231](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L231) |
| `msg.yes_dollars_fp?` | \[`string`, `string`\][] | Dollar-string tuples: [price_dollars, count_fp] | [types/websocket.ts:234](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L234) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:222](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L222) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:223](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L223) |
| <a id="type"></a> `type` | `"orderbook_snapshot"` | - | [types/websocket.ts:221](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L221) |
