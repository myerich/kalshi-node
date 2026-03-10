# Function: makeKalshiError()

```ts
function makeKalshiError(
   statusCode, 
   method, 
   endpoint, 
   body, 
   retryAfter?): KalshiAPIError;
```

Defined in: [errors.ts:34](https://github.com/myerich/kalshi-node/blob/3528ebe88544ddad32bb21f7dbb45582eeadfa49/src/errors.ts#L34)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `statusCode` | `number` |
| `method` | `string` |
| `endpoint` | `string` |
| `body` | `string` |
| `retryAfter?` | `number` |

## Returns

[`KalshiAPIError`](../classes/KalshiAPIError.md)
