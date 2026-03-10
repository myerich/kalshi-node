# Interface: Market

Defined in: [types/markets.ts:9](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L9)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="can_close_early"></a> `can_close_early` | `boolean` | [types/markets.ts:31](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L31) |
| <a id="cap_strike"></a> `cap_strike` | `string` | [types/markets.ts:47](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L47) |
| <a id="close_time"></a> `close_time` | `string` | [types/markets.ts:19](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L19) |
| <a id="created_time"></a> `created_time` | `string` | [types/markets.ts:17](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L17) |
| <a id="custom_strike"></a> `custom_strike` | `Record`\<`string`, `unknown`\> | [types/markets.ts:49](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L49) |
| <a id="early_close_condition"></a> `early_close_condition` | `string` | [types/markets.ts:44](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L44) |
| <a id="event_ticker"></a> `event_ticker` | `string` | [types/markets.ts:11](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L11) |
| <a id="expected_expiration_time"></a> `expected_expiration_time` | `string` | [types/markets.ts:40](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L40) |
| <a id="expiration_value"></a> `expiration_value` | `string` | [types/markets.ts:35](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L35) |
| <a id="fee_waiver_expiration_time"></a> `fee_waiver_expiration_time` | `string` | [types/markets.ts:43](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L43) |
| <a id="floor_strike"></a> `floor_strike` | `string` | [types/markets.ts:46](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L46) |
| <a id="functional_strike"></a> `functional_strike` | `string` | [types/markets.ts:48](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L48) |
| <a id="is_provisional"></a> `is_provisional` | `boolean` | [types/markets.ts:52](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L52) |
| <a id="last_price_dollars"></a> `last_price_dollars` | `string` | [types/markets.ts:27](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L27) |
| <a id="latest_expiration_time"></a> `latest_expiration_time` | `string` | [types/markets.ts:20](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L20) |
| <a id="liquidity_dollars"></a> `liquidity_dollars` | `string` | [types/markets.ts:34](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L34) |
| <a id="market_type"></a> `market_type` | `"binary"` \| `"scalar"` | [types/markets.ts:12](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L12) |
| <a id="mve_collection_ticker"></a> `mve_collection_ticker` | `string` | [types/markets.ts:50](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L50) |
| <a id="no_ask_dollars"></a> `no_ask_dollars` | `string` | [types/markets.ts:26](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L26) |
| <a id="no_bid_dollars"></a> `no_bid_dollars` | `string` | [types/markets.ts:25](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L25) |
| <a id="no_subtitle"></a> `no_subtitle` | `string` | [types/markets.ts:16](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L16) |
| <a id="notional_value_dollars"></a> `notional_value_dollars` | `string` | [types/markets.ts:33](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L33) |
| <a id="open_interest"></a> `open_interest` | `number` | [types/markets.ts:32](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L32) |
| <a id="open_time"></a> `open_time` | `string` | [types/markets.ts:18](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L18) |
| <a id="price_level_structure"></a> `price_level_structure` | `string` | [types/markets.ts:38](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L38) |
| <a id="price_ranges"></a> `price_ranges` | [`PriceRange`](PriceRange.md)[] | [types/markets.ts:39](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L39) |
| <a id="primary_participant_key"></a> `primary_participant_key` | `string` | [types/markets.ts:51](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L51) |
| <a id="result"></a> `result` | `string` | [types/markets.ts:30](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L30) |
| <a id="rules_primary"></a> `rules_primary` | `string` | [types/markets.ts:36](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L36) |
| <a id="rules_secondary"></a> `rules_secondary` | `string` | [types/markets.ts:37](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L37) |
| <a id="settlement_timer_seconds"></a> `settlement_timer_seconds` | `number` | [types/markets.ts:21](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L21) |
| <a id="settlement_ts"></a> `settlement_ts` | `string` | [types/markets.ts:42](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L42) |
| <a id="settlement_value_dollars"></a> `settlement_value_dollars` | `string` | [types/markets.ts:41](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L41) |
| <a id="status"></a> `status` | `string` | [types/markets.ts:22](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L22) |
| <a id="strike_type"></a> `strike_type` | `string` | [types/markets.ts:45](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L45) |
| <a id="subtitle"></a> `subtitle` | `string` | [types/markets.ts:14](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L14) |
| <a id="ticker"></a> `ticker` | `string` | [types/markets.ts:10](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L10) |
| <a id="title"></a> `title` | `string` | [types/markets.ts:13](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L13) |
| <a id="volume"></a> `volume` | `number` | [types/markets.ts:28](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L28) |
| <a id="volume_24h"></a> `volume_24h` | `number` | [types/markets.ts:29](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L29) |
| <a id="yes_ask_dollars"></a> `yes_ask_dollars` | `string` | [types/markets.ts:24](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L24) |
| <a id="yes_bid_dollars"></a> `yes_bid_dollars` | `string` | [types/markets.ts:23](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L23) |
| <a id="yes_subtitle"></a> `yes_subtitle` | `string` | [types/markets.ts:15](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/markets.ts#L15) |
