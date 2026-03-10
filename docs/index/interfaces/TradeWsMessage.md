# Interface: TradeWsMessage

Defined in: [types/websocket.ts:174](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L174)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:178](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L178) |
| `msg.count` | `number` | - | [types/websocket.ts:189](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L189) |
| `msg.count_fp` | `string` | Dollar string, e.g. "136.00" | [types/websocket.ts:191](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L191) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:180](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L180) |
| `msg.no_price` | `number` | Price in cents (integer) | [types/websocket.ts:186](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L186) |
| `msg.no_price_dollars` | `string` | Dollar string, e.g. "0.640" | [types/websocket.ts:188](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L188) |
| `msg.taker_side` | `"yes"` \| `"no"` | - | [types/websocket.ts:192](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L192) |
| `msg.trade_id` | `string` | - | [types/websocket.ts:179](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L179) |
| `msg.ts` | `number` | Unix timestamp in seconds | [types/websocket.ts:194](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L194) |
| `msg.yes_price` | `number` | Price in cents (integer) | [types/websocket.ts:182](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L182) |
| `msg.yes_price_dollars` | `string` | Dollar string, e.g. "0.360" | [types/websocket.ts:184](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L184) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:176](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L176) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:177](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L177) |
| <a id="type"></a> `type` | `"trade"` | - | [types/websocket.ts:175](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L175) |
