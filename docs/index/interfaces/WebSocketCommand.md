# Interface: WebSocketCommand

Defined in: [types/websocket.ts:111](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L111)

Internal command envelope sent over the WebSocket.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="cmd"></a> `cmd` | \| `"subscribe"` \| `"unsubscribe"` \| `"update_subscription"` \| `"list_subscriptions"` | [types/websocket.ts:113](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L113) |
| <a id="id"></a> `id` | `number` | [types/websocket.ts:112](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L112) |
| <a id="params"></a> `params` | `Record`\<`string`, `unknown`\> | [types/websocket.ts:114](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/types/websocket.ts#L114) |
