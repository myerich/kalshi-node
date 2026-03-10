# Interface: QuoteCreatedWsMessage

Defined in: [types/websocket.ts:425](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L425)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:429](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L429) |
| `msg.created_ts` | `string` | RFC3339 | [types/websocket.ts:450](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L450) |
| `msg.event_ticker?` | `string` | - | [types/websocket.ts:435](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L435) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:434](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L434) |
| `msg.no_bid` | `number` | Cents int32 | [types/websocket.ts:439](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L439) |
| `msg.no_bid_dollars` | `string` | - | [types/websocket.ts:441](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L441) |
| `msg.no_contracts_offered?` | `number` | - | [types/websocket.ts:443](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L443) |
| `msg.no_contracts_offered_fp?` | `string` | - | [types/websocket.ts:445](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L445) |
| `msg.quote_creator_id` | `string` | Anonymized | [types/websocket.ts:433](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L433) |
| `msg.quote_id` | `string` | - | [types/websocket.ts:430](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L430) |
| `msg.rfq_id` | `string` | - | [types/websocket.ts:431](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L431) |
| `msg.rfq_target_cost?` | `number` | Centicents | [types/websocket.ts:447](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L447) |
| `msg.rfq_target_cost_dollars?` | `string` | - | [types/websocket.ts:448](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L448) |
| `msg.yes_bid` | `number` | Cents int32 | [types/websocket.ts:437](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L437) |
| `msg.yes_bid_dollars` | `string` | - | [types/websocket.ts:440](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L440) |
| `msg.yes_contracts_offered?` | `number` | - | [types/websocket.ts:442](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L442) |
| `msg.yes_contracts_offered_fp?` | `string` | - | [types/websocket.ts:444](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L444) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:427](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L427) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:428](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L428) |
| <a id="type"></a> `type` | `"quote_created"` | - | [types/websocket.ts:426](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L426) |
