# Interface: OrderGroupUpdatesWsMessage

Defined in: [types/websocket.ts:350](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L350)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:354](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L354) |
| `msg.contracts_limit_fp?` | `string` | Present only for "created" and "limit_updated" | [types/websocket.ts:358](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L358) |
| `msg.event_type` | `"created"` \| `"triggered"` \| `"reset"` \| `"deleted"` \| `"limit_updated"` | - | [types/websocket.ts:355](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L355) |
| `msg.order_group_id` | `string` | - | [types/websocket.ts:356](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L356) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:352](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L352) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:353](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L353) |
| <a id="type"></a> `type` | `"order_group_updates"` | - | [types/websocket.ts:351](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L351) |
