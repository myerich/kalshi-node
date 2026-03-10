# Interface: KalshiWebSocketConfig

Defined in: [types/websocket.ts:19](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L19)

Configuration for KalshiWebSocketClient.

Authentication note: Browser WebSocket API does not support custom HTTP headers.
Auth headers can only be applied in environments that support them (Node.js with
the `ws` library). For browser clients, unauthenticated connections support all
public channels. For private channels from browsers, use the server-side proxy.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autoreconnect"></a> `autoReconnect?` | `boolean` | Auto-reconnect on disconnection. Default: true | [types/websocket.ts:41](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L41) |
| <a id="basewsurl"></a> `baseWsUrl?` | `string` | Base WebSocket URL. Defaults to production: `wss://api.elections.kalshi.com/trade-api/ws/v2` For demo: `wss://demo-api.kalshi.co/trade-api/ws/v2` | [types/websocket.ts:26](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L26) |
| <a id="getauthheaders"></a> `getAuthHeaders?` | () => \| [`WebSocketAuthHeaders`](WebSocketAuthHeaders.md) \| `Promise`\<[`WebSocketAuthHeaders`](WebSocketAuthHeaders.md) \| `null`\> \| `null` | Provider for authentication headers. Called on each connection attempt to ensure fresh signatures. Return null/undefined to skip authentication. Node.js: Use generateHeaders() from auth.ts Browser: Fetch from server's /api/auth/ws-signature endpoint | [types/websocket.ts:35](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L35) |
| <a id="maxreconnectattempts"></a> `maxReconnectAttempts?` | `number` | Max reconnect attempts before giving up. Default: 10 | [types/websocket.ts:44](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L44) |
| <a id="reconnectbasedelay"></a> `reconnectBaseDelay?` | `number` | Base delay for exponential backoff in ms. Default: 1000 | [types/websocket.ts:47](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L47) |
| <a id="reconnectmaxdelay"></a> `reconnectMaxDelay?` | `number` | Max delay for exponential backoff in ms. Default: 60000 | [types/websocket.ts:50](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L50) |
