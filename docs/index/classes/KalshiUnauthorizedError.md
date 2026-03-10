# Class: KalshiUnauthorizedError

Defined in: [errors.ts:14](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L14)

## Extends

- [`KalshiAPIError`](KalshiAPIError.md)

## Constructors

### Constructor

```ts
new KalshiUnauthorizedError(
   statusCode, 
   method, 
   endpoint, 
   responseBody): KalshiUnauthorizedError;
```

Defined in: [errors.ts:2](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L2)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |
| `method` | `string` |
| `endpoint` | `string` |
| `responseBody` | `string` |

#### Returns

`KalshiUnauthorizedError`

#### Inherited from

[`KalshiAPIError`](KalshiAPIError.md).[`constructor`](KalshiAPIError.md#constructor)

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="endpoint"></a> `endpoint` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`endpoint`](KalshiAPIError.md#endpoint) | [errors.ts:5](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L5) |
| <a id="method"></a> `method` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`method`](KalshiAPIError.md#method) | [errors.ts:4](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L4) |
| <a id="responsebody"></a> `responseBody` | `readonly` | `string` | [`KalshiAPIError`](KalshiAPIError.md).[`responseBody`](KalshiAPIError.md#responsebody) | [errors.ts:6](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L6) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [`KalshiAPIError`](KalshiAPIError.md).[`statusCode`](KalshiAPIError.md#statuscode) | [errors.ts:3](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L3) |
