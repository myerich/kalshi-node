# Class: KalshiRateLimitError

Defined in: [errors.ts:18](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L18)

## Extends

- [`KalshiAPIError`](KalshiAPIError.md)

## Constructors

### Constructor

```ts
new KalshiRateLimitError(
   statusCode, 
   method, 
   endpoint, 
   body, 
   retryAfter?): KalshiRateLimitError;
```

Defined in: [errors.ts:19](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |
| `method` | `string` |
| `endpoint` | `string` |
| `body` | `string` |
| `retryAfter?` | `number` |

#### Returns

`KalshiRateLimitError`

#### Overrides

[`KalshiAPIError`](KalshiAPIError.md).[`constructor`](KalshiAPIError.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="endpoint"></a> `endpoint` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`endpoint`](KalshiAPIError.md#endpoint) | [errors.ts:5](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L5) |
| <a id="method"></a> `method` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`method`](KalshiAPIError.md#method) | [errors.ts:4](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L4) |
| <a id="responsebody"></a> `responseBody` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`responseBody`](KalshiAPIError.md#responsebody) | [errors.ts:6](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L6) |
| <a id="retryafter"></a> `retryAfter?` | `readonly` | `number` | - | [errors.ts:24](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L24) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [`KalshiAPIError`](KalshiAPIError.md).[`statusCode`](KalshiAPIError.md#statuscode) | [errors.ts:3](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L3) |
