# Class: KalshiWebSocketClient

Defined in: [ws-api.ts:41](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L41)

## Constructors

### Constructor

```ts
new KalshiWebSocketClient(config?): KalshiWebSocketClient;
```

Defined in: [ws-api.ts:74](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L74)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`KalshiWebSocketConfig`](../../index/interfaces/KalshiWebSocketConfig.md) |

#### Returns

`KalshiWebSocketClient`

## Methods

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [ws-api.ts:91](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L91)

Open a WebSocket connection to Kalshi. Resolves when connected.

#### Returns

`Promise`\<`void`\>

***

### createWebSocket()

```ts
protected createWebSocket(url, _authHeaders): WebSocket;
```

Defined in: [ws-api.ts:304](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L304)

Create a WebSocket instance. Override this for environments that
support custom headers (e.g. Node.js `ws` library).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `_authHeaders` | \| [`WebSocketAuthHeaders`](../../index/interfaces/WebSocketAuthHeaders.md) \| `null` |

#### Returns

`WebSocket`

***

### disconnect()

```ts
disconnect(): void;
```

Defined in: [ws-api.ts:156](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L156)

Gracefully close the WebSocket connection.

#### Returns

`void`

***

### getActiveSubscriptions()

```ts
getActiveSubscriptions(): ActiveSubscription[];
```

Defined in: [ws-api.ts:243](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L243)

Get all currently active subscriptions.

#### Returns

[`ActiveSubscription`](../../index/interfaces/ActiveSubscription.md)[]

***

### getConnectionState()

```ts
getConnectionState(): ConnectionState;
```

Defined in: [ws-api.ts:180](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L180)

Current connection state.

#### Returns

[`ConnectionState`](../../index/type-aliases/ConnectionState.md)

***

### isConnected()

```ts
isConnected(): boolean;
```

Defined in: [ws-api.ts:185](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L185)

Whether the connection is open and ready to send/receive.

#### Returns

`boolean`

***

### listSubscriptions()

```ts
listSubscriptions(): number;
```

Defined in: [ws-api.ts:252](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L252)

Request a list of active server-side subscriptions.
Listen for 'ok' events to receive the response.
Returns the command ID.

#### Returns

`number`

***

### off()

```ts
off<K>(event, handler): this;
```

Defined in: [ws-api.ts:277](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L277)

Remove a handler for a specific event type.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md)\[`K`\] |

#### Returns

`this`

***

### on()

```ts
on<K>(event, handler): this;
```

Defined in: [ws-api.ts:266](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L266)

Register a handler for a specific event type.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md)\[`K`\] |

#### Returns

`this`

***

### once()

```ts
once<K>(event, handler): this;
```

Defined in: [ws-api.ts:290](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L290)

Register a one-shot handler that fires once then removes itself.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`WebSocketEventMap`](../../index/interfaces/WebSocketEventMap.md)\[`K`\] |

#### Returns

`this`

***

### subscribe()

```ts
subscribe(params): number;
```

Defined in: [ws-api.ts:195](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L195)

Subscribe to one or more channels. Returns the command ID.
Listen for 'subscribed' events to get the server-assigned subscription ID.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`SubscribeParams`](../../index/interfaces/SubscribeParams.md) |

#### Returns

`number`

***

### unsubscribe()

```ts
unsubscribe(sids): number;
```

Defined in: [ws-api.ts:209](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L209)

Unsubscribe from subscriptions by their server-assigned IDs.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sids` | `number`[] |

#### Returns

`number`

***

### updateSubscription()

```ts
updateSubscription(params): number;
```

Defined in: [ws-api.ts:230](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/ws-api.ts#L230)

Update an existing subscription (add/remove tickers).
Pass the sids to update and the new ticker lists.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`UpdateSubscriptionParams`](../../index/interfaces/UpdateSubscriptionParams.md) |

#### Returns

`number`
