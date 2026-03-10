# Interface: MarketPositionsWsMessage

Defined in: [types/websocket.ts:270](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L270)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:274](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L274) |
| `msg.fees_paid` | `number` | centi-cents int64 | [types/websocket.ts:286](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L286) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:276](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L276) |
| `msg.position` | `number` | int32 net position | [types/websocket.ts:278](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L278) |
| `msg.position_cost` | `number` | centi-cents int64 | [types/websocket.ts:282](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L282) |
| `msg.position_fee_cost` | `number` | centi-cents int64 | [types/websocket.ts:288](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L288) |
| `msg.position_fp` | `string` | fixed-point 2 decimals | [types/websocket.ts:280](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L280) |
| `msg.realized_pnl` | `number` | centi-cents int64 | [types/websocket.ts:284](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L284) |
| `msg.subaccount?` | `number` | - | [types/websocket.ts:292](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L292) |
| `msg.user_id` | `string` | - | [types/websocket.ts:275](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L275) |
| `msg.volume` | `number` | int32 | [types/websocket.ts:290](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L290) |
| `msg.volume_fp` | `string` | - | [types/websocket.ts:291](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L291) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:272](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L272) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:273](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L273) |
| <a id="type"></a> `type` | `"market_position"` | - | [types/websocket.ts:271](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L271) |
