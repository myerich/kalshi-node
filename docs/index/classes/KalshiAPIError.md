# Class: KalshiAPIError

Defined in: [errors.ts:1](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L1)

## Extends

- `Error`

## Extended by

- [`KalshiBadRequestError`](KalshiBadRequestError.md)
- [`KalshiUnauthorizedError`](KalshiUnauthorizedError.md)
- [`KalshiForbiddenError`](KalshiForbiddenError.md)
- [`KalshiNotFoundError`](KalshiNotFoundError.md)
- [`KalshiConflictError`](KalshiConflictError.md)
- [`KalshiRateLimitError`](KalshiRateLimitError.md)
- [`KalshiServerError`](KalshiServerError.md)
- [`KalshiServiceUnavailableError`](KalshiServiceUnavailableError.md)
- [`KalshiGatewayTimeoutError`](KalshiGatewayTimeoutError.md)

## Constructors

### Constructor

```ts
new KalshiAPIError(
   statusCode, 
   method, 
   endpoint, 
   responseBody): KalshiAPIError;
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

`KalshiAPIError`

#### Overrides

```ts
Error.constructor
```

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="endpoint"></a> `endpoint` | `readonly` | `string` | [errors.ts:5](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L5) |
| <a id="method"></a> `method` | `readonly` | `string` | [errors.ts:4](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L4) |
| <a id="responsebody"></a> `responseBody` | `readonly` | `string` | [errors.ts:6](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L6) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [errors.ts:3](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L3) |
