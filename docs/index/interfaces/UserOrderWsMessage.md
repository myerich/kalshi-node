# Interface: UserOrderWsMessage

Defined in: [types/websocket.ts:500](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L500)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:503](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L503) |
| `msg.client_order_id` | `string` | Required (not optional per schema) | [types/websocket.ts:521](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L521) |
| `msg.created_time` | `string` | RFC3339 — required | [types/websocket.ts:529](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L529) |
| `msg.expiration_time?` | `string` | RFC3339 | [types/websocket.ts:533](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L533) |
| `msg.fill_count_fp` | `string` | - | [types/websocket.ts:515](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L515) |
| `msg.initial_count_fp` | `string` | - | [types/websocket.ts:517](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L517) |
| `msg.is_yes` | `boolean` | - | [types/websocket.ts:512](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L512) |
| `msg.last_update_time?` | `string` | RFC3339 | [types/websocket.ts:531](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L531) |
| `msg.maker_fees_dollars?` | `string` | Omitted when zero | [types/websocket.ts:525](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L525) |
| `msg.maker_fill_cost_dollars` | `string` | - | [types/websocket.ts:519](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L519) |
| `msg.order_group_id?` | `string` | - | [types/websocket.ts:526](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L526) |
| `msg.order_id` | `string` | UUID — required | [types/websocket.ts:505](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L505) |
| `msg.remaining_count_fp` | `string` | - | [types/websocket.ts:516](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L516) |
| `msg.self_trade_prevention_type?` | `"taker_at_cross"` \| `"maker"` | - | [types/websocket.ts:527](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L527) |
| `msg.side` | `"yes"` \| `"no"` | - | [types/websocket.ts:511](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L511) |
| `msg.status` | `"resting"` \| `"canceled"` \| `"executed"` | - | [types/websocket.ts:510](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L510) |
| `msg.subaccount_number?` | `number` | - | [types/websocket.ts:534](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L534) |
| `msg.taker_fees_dollars?` | `string` | Omitted when zero | [types/websocket.ts:523](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L523) |
| `msg.taker_fill_cost_dollars` | `string` | - | [types/websocket.ts:518](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L518) |
| `msg.ticker` | `string` | Market ticker — required | [types/websocket.ts:509](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L509) |
| `msg.user_id` | `string` | UUID — required | [types/websocket.ts:507](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L507) |
| `msg.yes_price_dollars` | `string` | 4 decimal fixed-point | [types/websocket.ts:514](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L514) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:502](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L502) |
| <a id="type"></a> `type` | `"user_order"` | - | [types/websocket.ts:501](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L501) |
