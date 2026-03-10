# Interface: MarketLifecycleMessage

Defined in: [types/websocket.ts:296](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L296)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="msg"></a> `msg` | `object` | - | [types/websocket.ts:300](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L300) |
| `msg.additional_metadata?` | `object` | Only on "created" | [types/websocket.ts:318](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L318) |
| `msg.additional_metadata.can_close_early?` | `boolean` | - | [types/websocket.ts:325](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L325) |
| `msg.additional_metadata.cap_strike?` | `number` | - | [types/websocket.ts:330](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L330) |
| `msg.additional_metadata.custom_strike?` | `object` | - | [types/websocket.ts:331](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L331) |
| `msg.additional_metadata.event_ticker?` | `string` | - | [types/websocket.ts:326](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L326) |
| `msg.additional_metadata.expected_expiration_ts?` | `number` | - | [types/websocket.ts:327](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L327) |
| `msg.additional_metadata.floor_strike?` | `number` | - | [types/websocket.ts:329](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L329) |
| `msg.additional_metadata.name?` | `string` | - | [types/websocket.ts:319](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L319) |
| `msg.additional_metadata.no_sub_title?` | `string` | - | [types/websocket.ts:322](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L322) |
| `msg.additional_metadata.rules_primary?` | `string` | - | [types/websocket.ts:323](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L323) |
| `msg.additional_metadata.rules_secondary?` | `string` | - | [types/websocket.ts:324](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L324) |
| `msg.additional_metadata.strike_type?` | `string` | - | [types/websocket.ts:328](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L328) |
| `msg.additional_metadata.title?` | `string` | - | [types/websocket.ts:320](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L320) |
| `msg.additional_metadata.yes_sub_title?` | `string` | - | [types/websocket.ts:321](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L321) |
| `msg.close_ts?` | `number` | On "created" or "close_date_updated" | [types/websocket.ts:306](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L306) |
| `msg.determination_ts?` | `number` | Only on "determined" | [types/websocket.ts:310](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L310) |
| `msg.event_type` | \| `"settled"` \| `"created"` \| `"deactivated"` \| `"activated"` \| `"close_date_updated"` \| `"determined"` | - | [types/websocket.ts:301](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L301) |
| `msg.is_deactivated?` | `boolean` | Only on "activated"/"deactivated" | [types/websocket.ts:316](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L316) |
| `msg.market_ticker` | `string` | - | [types/websocket.ts:302](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L302) |
| `msg.open_ts?` | `number` | Only on "created" | [types/websocket.ts:304](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L304) |
| `msg.result?` | `string` | Only on "determined" | [types/websocket.ts:308](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L308) |
| `msg.settled_ts?` | `number` | Only on "settled" | [types/websocket.ts:314](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L314) |
| `msg.settlement_value?` | `string` | Only on "determined" — fixed-point dollars | [types/websocket.ts:312](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L312) |
| <a id="seq"></a> `seq` | `number` | - | [types/websocket.ts:298](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L298) |
| <a id="sid"></a> `sid` | `number` | - | [types/websocket.ts:299](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L299) |
| <a id="type"></a> `type` | `"market_lifecycle_v2"` | - | [types/websocket.ts:297](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L297) |
