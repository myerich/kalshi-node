# kalshi-node

A TypeScript Node.js client for the Kalshi Trade API, covering all REST endpoints and WebSocket channels per the official spec.

## Specs

- `specs/openapi.yaml` — REST API spec (source of truth for all REST endpoints, request params, response schemas)
- `specs/asyncapi.yaml` — WebSocket API spec (source of truth for all channels, message schemas)

**Always consult these files before adding or changing API coverage.** Key sections to know:
- `openapi.yaml`: `paths:` for all endpoints; `components/schemas:` for reusable object shapes
- `asyncapi.yaml`: `channels:` for subscribe/unsubscribe; `components/schemas:` and `components/messages:` for message payloads

## Project Structure

```
src/
  index.ts              — public exports: KalshiClient, KalshiWebSocketClient, all types, all errors
  rest-api.ts           — KalshiClient class: all REST methods + private request() helper
  ws-api.ts             — KalshiWebSocketClient class
  auth.ts               — RSA-PSS signing: generateHeaders(), loadPrivateKey(), loadPrivateKeyFromContent()
  errors.ts             — typed error class hierarchy (KalshiAPIError subclasses per HTTP status)
  types/
    index.ts            — re-exports all type modules
    exchange.ts         — exchange status, announcements, schedule, account limits
    markets.ts          — Market, Orderbook, Trade, Candlestick, and related params/responses
    series.ts           — Series, fee changes
    events.ts           — Event, milestone, multivariate collection, structured target, live data
    portfolio.ts        — Order, Fill, Position, Settlement, Balance, OrderGroup types
    mutations.ts        — order mutation request/response types (create, amend, decrease, batch)
    subaccounts.ts      — subaccount balance/transfer types + netting types
    websocket.ts        — all WebSocket message types, channel types, SubscribeParams, EventMap
    historical.ts       — historical endpoint param types
    api-keys.ts         — API key management types
    fcm.ts              — FCM (Futures Commission Merchant) endpoint params
    communications.ts   — RFQ and Quote REST types
specs/
  openapi.yaml          — REST API spec
  asyncapi.yaml         — WebSocket spec
tests/
  e2e/
    client.ts           — shared KalshiClient factory (uses KALSHI_DEV_* env vars + demo API)
    public-endpoints.test.ts   — REST endpoint e2e tests
    portfolio-endpoints.test.ts
    websocket.test.ts   — WebSocket e2e tests (connects to demo API)
```

## Numeric Encoding Conventions

Understanding these is essential for reading types correctly:

| Kind | Wire type | Example | Notes |
|------|-----------|---------|-------|
| Price (cents) | `number` | `55` | Integer 1–99. `yes_price`, `yes_bid`, etc. |
| Price (dollars) | `string` | `"0.55"` | Fixed-point, fields end in `_dollars` |
| Quantity | `number` | `10` | Integer contracts |
| Quantity (fixed-point) | `string` | `"10.00"` | Fields end in `_fp` |
| Dollar amount (fixed-point) | `string` | `"136.00"` | `count_fp`, `fee_cost`, etc. |
| Timestamp | `number` | `1700000000` | Unix **seconds** (not milliseconds) |
| Timestamp (RFC3339) | `string` | `"2025-01-01T00:00:00Z"` | Fields end in `_ts` or `_time` |
| Centicents | `number` | `5000` | 100ths of a cent — used in WS `market_position` msg for `position_cost`, `realized_pnl`, `fees_paid`, `position_fee_cost` |

## REST Client (KalshiClient)

Located in `src/rest-api.ts`.

```typescript
const client = new KalshiClient({
  apiKey: "...",          // or KALSHI_PROD_KEY_ID env var
  privateKey: "...",      // PEM string, or KALSHI_PROD_KEY env var
  privateKeyPath: "...",  // path to PEM file, or KALSHI_PROD_KEY_FILE env var
  baseUrl: "...",         // default: https://api.elections.kalshi.com/trade-api/v2
                          // demo:    https://demo-api.kalshi.co/trade-api/v2
});
```

### `request<T>()` internal helper

- Builds URL from `baseUrl + endpoint`, appends query params from `params` object
- Calls `generateHeaders()` when `auth: true`
- Auto-retries on 429 using the `Retry-After` response header (up to 100 retries)
- Throws typed `KalshiAPIError` subclasses on non-2xx responses (see `src/errors.ts`)
- Returns parsed JSON body typed as `T`

### Endpoint groups

| Group | Methods |
|-------|---------|
| Exchange | `getExchangeStatus`, `getExchangeAnnouncements`, `getExchangeSchedule`, `getExchangeUserDataTimestamp` |
| Account | `getAccountLimits` |
| Search | `getSearchTagsForSeriesCategories`, `getSearchFiltersBySport` |
| Series | `getSeriesList`, `getSeries`, `getSeriesFeeChanges` |
| Events | `getEventsList`, `getEvent`, `getMultivariateEvents`, `getEventMetadata` |
| Markets | `getMarketsList`, `getMarket`, `getMarketOrderbook`, `getMarketTrades`, `getBatchCandlesticks`, `getMarketCandlesticks`, `getEventCandlesticks`, `getEventForecastPercentilesHistory` |
| Milestones | `getMilestones`, `getMilestoneById` |
| Live Data | `getLiveData`, `getLiveDataBatch` |
| Structured Targets | `getStructuredTargets`, `getStructuredTargetById` |
| MVE Collections | `getMultivariateEventCollections`, `getMultivariateEventCollection`, `createMarketInCollection`, `getCollectionLookupHistory`, `lookupTickersInCollection` |
| Incentives | `getIncentivePrograms` |
| Portfolio - Orders | `getPortfolioOrders`, `getPortfolioOrderById`, `getPortfolioOrderQueuePositions`, `getPortfolioOrderQueuePositionById` |
| Portfolio - Order Groups | `getPortfolioOrderGroups`, `getPortfolioOrderGroupById`, `createPortfolioOrderGroup`, `deletePortfolioOrderGroup`, `resetPortfolioOrderGroup`, `triggerPortfolioOrderGroup`, `updatePortfolioOrderGroupLimit` |
| Portfolio - Balance | `getPortfolioBalance`, `getPortfolioSubaccountBalances`, `getPortfolioSubaccountTransfers` |
| Portfolio - Positions | `getPortfolioPositions` |
| Portfolio - Settlements | `getPortfolioSettlements` |
| Portfolio - Resting Value | `getPortfolioTotalRestingOrderValue` |
| Portfolio - Fills | `getPortfolioFills` |
| Portfolio - Mutations | `createPortfolioOrder`, `deletePortfolioOrder`, `amendPortfolioOrder`, `decreasePortfolioOrder`, `batchCreatePortfolioOrders`, `batchCancelPortfolioOrders` |
| Subaccounts | `createSubaccount`, `transferBetweenSubaccounts`, `getSubaccountNetting`, `updateSubaccountNetting` |
| API Keys | `getApiKeys`, `createApiKey`, `generateApiKey`, `deleteApiKey` |
| Historical | `getHistoricalCutoff`, `getHistoricalMarkets`, `getHistoricalMarket`, `getHistoricalMarketCandlesticks`, `getHistoricalFills`, `getHistoricalOrders` |
| FCM | `getFCMOrders`, `getFCMPositions` |
| Communications | `getCommunicationsID`, `getRFQs`, `createRFQ`, `getRFQ`, `deleteRFQ`, `getQuotes`, `createQuote`, `getQuote`, `deleteQuote`, `acceptQuote`, `confirmQuote` |

**Polling tip:** `getEventsList`, `getMarketsList`, `getSeriesList`, and `getMilestones` all support a `min_updated_ts` param (Unix seconds) to efficiently poll for changes since a given timestamp.

## WebSocket Client (KalshiWebSocketClient)

Located in `src/ws-api.ts`. Uses the native `WebSocket` API (Node.js 22+ or browser).

```typescript
const ws = new KalshiWebSocketClient({
  getAuthHeaders: () => generateHeaders(apiKey, privateKey, "GET", "/trade-api/ws/v2"),
  autoReconnect: true,
  maxReconnectAttempts: 10,
  // baseWsUrl default: wss://api.elections.kalshi.com/trade-api/ws/v2
  // demo:              wss://demo-api.kalshi.co/trade-api/ws/v2
});
await ws.connect();
ws.subscribe({ channels: ["ticker"], market_tickers: ["TICKER-1"] });
ws.on("ticker", (msg) => console.log(msg.msg.yes_bid)); // number (cents)
```

### Node.js: authenticated connections require subclassing

The native `WebSocket` API does not support custom HTTP headers on the upgrade request. For authenticated private channels in Node.js, subclass `KalshiWebSocketClient` and override `createWebSocket()` to inject auth headers via the `ws` library:

```typescript
import WebSocketNode from "ws";
import { KalshiWebSocketClient } from "kalshi-node";
import type { WebSocketAuthHeaders } from "kalshi-node";

class NodeKalshiWebSocketClient extends KalshiWebSocketClient {
  protected createWebSocket(url: string, authHeaders: WebSocketAuthHeaders | null): WebSocket {
    return new WebSocketNode(url, authHeaders ? { headers: authHeaders } : {}) as unknown as WebSocket;
  }
}
```

This pattern is demonstrated in `tests/e2e/websocket.test.ts`. Browser clients can only use public channels without auth.

### Dispatch mechanism

Messages are dispatched via `this.emit(msg.type as EventKey, msg)`. **The event key equals the `msg.type` string on the wire.** Event map keys in `WebSocketEventMap` must exactly match the `type` field of each message interface — mismatches cause silent dispatch failure.

Critical alignments to preserve:
- `"market_position"` (singular) — not `"market_positions"` (the subscribe channel name)
- `"multivariate_lookup"` — not `"multivariate"` (the subscribe channel name)
- `"rfq_created"`, `"rfq_deleted"`, `"quote_created"`, `"quote_accepted"`, `"quote_executed"` — all dispatched individually from the `communications` subscribe channel

### Channels and messages

**Public channels** (no auth):

| Subscribe with | Messages dispatched |
|---------------|---------------------|
| `ticker` | `ticker` |
| `trade` | `trade` |
| `market_lifecycle_v2` | `market_lifecycle_v2`, `event_lifecycle` |
| `multivariate` | `multivariate_lookup` |

**Private channels** (require auth headers):

| Subscribe with | Messages dispatched |
|---------------|---------------------|
| `orderbook_delta` | `orderbook_delta`, `orderbook_snapshot` |
| `orderbook_snapshot` | `orderbook_snapshot` |
| `fill` | `fill` |
| `market_positions` | `market_position` |
| `order_group_updates` | `order_group_updates` |
| `communications` | `rfq_created`, `rfq_deleted`, `quote_created`, `quote_accepted`, `quote_executed` |
| `user_orders` | `user_order` |

### Methods

- `connect()` / `disconnect()`
- `subscribe(params: SubscribeParams)` — returns command ID; confirmation arrives as `subscribed` event
- `unsubscribe(sids: number[])` — removes by server-assigned subscription ID
- `updateSubscription(params: UpdateSubscriptionParams)` — `action` field is required: `"add_markets"` or `"delete_markets"`
- `listSubscriptions()` — sends `list_subscriptions` command; response arrives as `ok` event
- `getActiveSubscriptions()` — returns locally tracked subscriptions (client-side, not round-tripped)
- `on(event, handler)` / `off(event, handler)` / `once(event, handler)`
- `getConnectionState()` / `isConnected()`

Auto-reconnect: on unexpected disconnect, re-connects with exponential backoff and re-subscribes all previously active subscriptions. Disabled on intentional `disconnect()`.

## Authentication

Located in `src/auth.ts`. Signs requests with RSA-PSS (SHA-256).

```typescript
generateHeaders(apiKeyId, privateKeyPem, method, path)
// => { "KALSHI-ACCESS-KEY": ..., "KALSHI-ACCESS-SIGNATURE": ..., "KALSHI-ACCESS-TIMESTAMP": ... }
```

**Path convention:** The `path` argument must include the full API path prefix:
- REST: `/trade-api/v2/portfolio/orders` (not just `/portfolio/orders`)
- WebSocket: `/trade-api/ws/v2`

`KalshiClient.authHeaders()` prepends `/trade-api/v2` automatically, so endpoint methods pass just `/portfolio/orders`.

**PEM handling:** `loadPrivateKeyFromContent()` normalizes PEM strings — it handles escaped newlines (`\\n` as written in `.env` files), single-line PEM (no line breaks), and already-formatted multi-line PEM. Store private keys in `.env` with `\n` escaping or use `KALSHI_PROD_KEY_FILE` to point at a file.

## Error Handling

All errors thrown by `KalshiClient.request()` extend `KalshiAPIError`:

```typescript
import { KalshiNotFoundError, KalshiRateLimitError, KalshiAPIError } from "kalshi-node";

try {
  await client.getMarket("FAKE");
} catch (err) {
  if (err instanceof KalshiNotFoundError) { /* 404 */ }
  if (err instanceof KalshiRateLimitError) { console.log(err.retryAfter); } // seconds
  if (err instanceof KalshiAPIError) {
    console.log(err.statusCode, err.method, err.endpoint, err.responseBody);
  }
}
```

| Class | Status |
|-------|--------|
| `KalshiBadRequestError` | 400 |
| `KalshiUnauthorizedError` | 401 |
| `KalshiForbiddenError` | 403 |
| `KalshiNotFoundError` | 404 |
| `KalshiConflictError` | 409 |
| `KalshiRateLimitError` | 429 — auto-retried up to 100 times; `retryAfter` field is seconds |
| `KalshiServerError` | 500 |
| `KalshiServiceUnavailableError` | 503 |
| `KalshiGatewayTimeoutError` | 504 |
| `KalshiAPIError` (base) | all other non-2xx |

## Testing

```bash
npm test           # unit tests (vitest) — runs src/**/*.test.ts
npm run test:e2e   # live API e2e tests (separate vitest config)
npx tsc --noEmit   # type check src/ only
```

**Important:** `npx tsc --noEmit` only covers `src/**/*.ts` (test files excluded via tsconfig). Files in `tests/e2e/` are **not** type-checked by tsc. Always run `npm test` (which includes type-level `expectTypeOf` assertions in vitest) to catch type regressions in test files.

**E2E environment variables** (all tests use the demo API):
```
KALSHI_DEV_KEY_ID       # API key ID for the demo environment
KALSHI_DEV_KEY          # RSA private key PEM string (escaped \n is OK)
KALSHI_DEV_KEY_FILE     # alternative: path to PEM file
KALSHI_API_BASE_URL     # optional: override REST base URL (default: demo)
```

Unit tests mock `fetch` globally via vitest — no network required.

## Adding New REST Endpoints

1. Read the endpoint in `specs/openapi.yaml` — check `paths:`, the request schema under `requestBody`, the response schema, and whether `security:` is present (means auth required)
2. Check `components/schemas:` for reusable object definitions referenced by `$ref`
3. Add param/response types to the appropriate `src/types/*.ts` file (create a new file for new domains)
4. Export from `src/types/index.ts`
5. Add the method to `KalshiClient` in `src/rest-api.ts`, following the existing pattern
6. `npx tsc --noEmit && npm test`

## Adding New WebSocket Messages

1. Find the channel in `specs/asyncapi.yaml` under `channels:`, then find the message under `components/messages:` or inline
2. Note the exact `type:` string on the wire — this becomes both the `type` literal in the interface AND the key in `WebSocketEventMap`
3. Add the interface to `src/types/websocket.ts`
4. Add to the `WebSocketMessage` union type
5. Add to `WebSocketEventMap` with key = `msg.type` value
6. If it's a new subscribe channel, add to `PublicChannel` or `PrivateChannel`
7. `npx tsc --noEmit && npm test`
