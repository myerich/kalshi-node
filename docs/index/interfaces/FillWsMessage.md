# Interface: FillWsMessage

Defined in: [types/websocket.ts:240](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L240)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:244](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L244) |
| `msg.action` | `"buy"` \| `"sell"` | - | [types/websocket.ts:259](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L259) |
| `msg.client_order_id?` | `string` | - | [types/websocket.ts:262](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L262) |
| `msg.count` | `number` | - | [types/websocket.ts:254](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L254) |
| `msg.count_fp` | `string` | Fixed-point 2 decimals | [types/websocket.ts:256](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L256) |
| `msg.fee_cost` | `string` | Exchange fee in fixed-point dollars | [types/websocket.ts:258](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L258) |
| `msg.is_taker` | `boolean` | - | [types/websocket.ts:249](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L249) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:248](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L248) |
| `msg.order_id` | `string` | - | [types/websocket.ts:247](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L247) |
| `msg.post_position` | `number` | - | [types/websocket.ts:263](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L263) |
| `msg.post_position_fp` | `string` | - | [types/websocket.ts:264](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L264) |
| `msg.purchased_side` | `"yes"` \| `"no"` | - | [types/websocket.ts:265](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L265) |
| `msg.side` | `"yes"` \| `"no"` | - | [types/websocket.ts:250](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L250) |
| `msg.subaccount?` | `number` | - | [types/websocket.ts:266](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L266) |
| `msg.trade_id` | `string` | UUID (replaces fill_id) | [types/websocket.ts:246](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L246) |
| `msg.ts` | `number` | Unix seconds | [types/websocket.ts:261](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L261) |
| `msg.yes_price` | `number` | Cents integer 1-99 | [types/websocket.ts:252](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L252) |
| `msg.yes_price_dollars` | `string` | - | [types/websocket.ts:253](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L253) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:242](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L242) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:243](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L243) |
| <a id="type"></a> `type` | `"fill"` | - | [types/websocket.ts:241](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L241) |
