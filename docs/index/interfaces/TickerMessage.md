# Interface: TickerMessage

Defined in: [types/websocket.ts:145](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L145)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:149](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L149) |
| `msg.dollar_open_interest` | `number` | - | [types/websocket.ts:166](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L166) |
| `msg.dollar_volume` | `number` | - | [types/websocket.ts:165](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L165) |
| `msg.market_id` | `string` | - | [types/websocket.ts:151](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L151) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:150](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L150) |
| `msg.open_interest` | `number` | - | [types/websocket.ts:163](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L163) |
| `msg.open_interest_fp` | `string` | - | [types/websocket.ts:164](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L164) |
| `msg.price` | `number` | Price in cents (integer 1-99) | [types/websocket.ts:153](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L153) |
| `msg.price_dollars` | `string` | - | [types/websocket.ts:158](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L158) |
| `msg.time` | `string` | RFC3339 | [types/websocket.ts:170](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L170) |
| `msg.ts` | `number` | Unix seconds | [types/websocket.ts:168](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L168) |
| `msg.volume` | `number` | - | [types/websocket.ts:161](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L161) |
| `msg.volume_fp` | `string` | - | [types/websocket.ts:162](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L162) |
| `msg.yes_ask` | `number` | Yes ask in cents | [types/websocket.ts:157](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L157) |
| `msg.yes_ask_dollars` | `string` | - | [types/websocket.ts:160](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L160) |
| `msg.yes_bid` | `number` | Yes bid in cents | [types/websocket.ts:155](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L155) |
| `msg.yes_bid_dollars` | `string` | - | [types/websocket.ts:159](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L159) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:147](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L147) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:148](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L148) |
| <a id="type"></a> `type` | `"ticker"` | - | [types/websocket.ts:146](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L146) |
