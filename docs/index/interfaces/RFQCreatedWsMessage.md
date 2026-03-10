# Interface: RFQCreatedWsMessage

Defined in: [types/websocket.ts:380](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L380)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:384](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L384) |
| `msg.contracts?` | `number` | - | [types/websocket.ts:390](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L390) |
| `msg.contracts_fp?` | `string` | - | [types/websocket.ts:391](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L391) |
| `msg.created_ts` | `string` | RFC3339 | [types/websocket.ts:396](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L396) |
| `msg.creator_id` | `string` | Anonymized, currently empty for rfq_created | [types/websocket.ts:387](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L387) |
| `msg.event_ticker?` | `string` | - | [types/websocket.ts:389](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L389) |
| `msg.id` | `string` | - | [types/websocket.ts:385](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L385) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:388](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L388) |
| `msg.mve_collection_ticker?` | `string` | - | [types/websocket.ts:397](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L397) |
| `msg.mve_selected_legs?` | `object`[] | - | [types/websocket.ts:398](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L398) |
| `msg.target_cost?` | `number` | Centicents | [types/websocket.ts:393](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L393) |
| `msg.target_cost_dollars?` | `string` | - | [types/websocket.ts:394](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L394) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:382](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L382) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:383](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L383) |
| <a id="type"></a> `type` | `"rfq_created"` | - | [types/websocket.ts:381](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L381) |
