# Interface: QuoteAcceptedWsMessage

Defined in: [types/websocket.ts:454](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L454)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | [types/websocket.ts:458](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L458) |
| `msg.accepted_side?` | `"yes"` \| `"no"` | [types/websocket.ts:468](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L468) |
| `msg.contracts_accepted?` | `number` | [types/websocket.ts:469](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L469) |
| `msg.contracts_accepted_fp?` | `string` | [types/websocket.ts:470](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L470) |
| `msg.event_ticker?` | `string` | [types/websocket.ts:463](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L463) |
| `msg.market_ticker` | `string` | [types/websocket.ts:462](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L462) |
| `msg.no_bid` | `number` | [types/websocket.ts:465](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L465) |
| `msg.no_bid_dollars` | `string` | [types/websocket.ts:467](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L467) |
| `msg.no_contracts_offered?` | `number` | [types/websocket.ts:472](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L472) |
| `msg.no_contracts_offered_fp?` | `string` | [types/websocket.ts:474](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L474) |
| `msg.quote_creator_id` | `string` | [types/websocket.ts:461](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L461) |
| `msg.quote_id` | `string` | [types/websocket.ts:459](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L459) |
| `msg.rfq_id` | `string` | [types/websocket.ts:460](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L460) |
| `msg.rfq_target_cost?` | `number` | [types/websocket.ts:475](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L475) |
| `msg.rfq_target_cost_dollars?` | `string` | [types/websocket.ts:476](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L476) |
| `msg.yes_bid` | `number` | [types/websocket.ts:464](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L464) |
| `msg.yes_bid_dollars` | `string` | [types/websocket.ts:466](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L466) |
| `msg.yes_contracts_offered?` | `number` | [types/websocket.ts:471](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L471) |
| `msg.yes_contracts_offered_fp?` | `string` | [types/websocket.ts:473](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L473) |
| <a id="seq"></a> `seq` | `number` | [types/websocket.ts:456](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L456) |
| <a id="sid"></a> `sid` | `number` | [types/websocket.ts:457](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L457) |
| <a id="type"></a> `type` | `"quote_accepted"` | [types/websocket.ts:455](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L455) |
