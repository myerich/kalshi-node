// ==================== WebSocket Configuration ====================

/** Auth headers required for authenticated Kalshi WebSocket connections. */
export interface WebSocketAuthHeaders {
  "KALSHI-ACCESS-KEY": string;
  "KALSHI-ACCESS-SIGNATURE": string;
  "KALSHI-ACCESS-TIMESTAMP": string;
  [key: string]: string;
}

/**
 * Configuration for KalshiWebSocketClient.
 *
 * Authentication note: Browser WebSocket API does not support custom HTTP headers.
 * Auth headers can only be applied in environments that support them (Node.js with
 * the `ws` library). For browser clients, unauthenticated connections support all
 * public channels. For private channels from browsers, use the server-side proxy.
 */
export interface KalshiWebSocketConfig {
  /**
   * Base WebSocket URL. Defaults to production:
   * `wss://api.elections.kalshi.com/trade-api/ws/v2`
   *
   * For demo: `wss://demo-api.kalshi.co/trade-api/ws/v2`
   */
  baseWsUrl?: string;

  /**
   * Provider for authentication headers. Called on each connection attempt
   * to ensure fresh signatures. Return null/undefined to skip authentication.
   *
   * Node.js: Use generateHeaders() from auth.ts
   * Browser: Fetch from server's /api/auth/ws-signature endpoint
   */
  getAuthHeaders?: () =>
    | WebSocketAuthHeaders
    | null
    | Promise<WebSocketAuthHeaders | null>;

  /** Auto-reconnect on disconnection. Default: true */
  autoReconnect?: boolean;

  /** Max reconnect attempts before giving up. Default: 10 */
  maxReconnectAttempts?: number;

  /** Base delay for exponential backoff in ms. Default: 1000 */
  reconnectBaseDelay?: number;

  /** Max delay for exponential backoff in ms. Default: 60000 */
  reconnectMaxDelay?: number;
}

// ==================== Connection State ====================

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "failed";

// ==================== Channels ====================

/** Channels that do not require authentication. */
export type PublicChannel =
  | "ticker"
  | "ticker_v2"
  | "trade"
  | "market_lifecycle_v2"
  | "multivariate";

/** Channels that require authentication. */
export type PrivateChannel =
  | "orderbook_delta"
  | "orderbook_snapshot"
  | "fill"
  | "market_positions"
  | "communications"
  | "order_group_updates";

export type Channel = PublicChannel | PrivateChannel;

// ==================== Commands (client → server) ====================

export interface SubscribeParams {
  channels: Channel[];
  market_tickers?: string[];
  event_tickers?: string[];
  series_tickers?: string[];
}

export interface UpdateSubscriptionParams {
  sids: number[];
  market_tickers?: string[];
  event_tickers?: string[];
  series_tickers?: string[];
}

/** Internal command envelope sent over the WebSocket. */
export interface WebSocketCommand {
  id: number;
  cmd: "subscribe" | "unsubscribe" | "update_subscription";
  params: Record<string, unknown>;
}

// ==================== Messages (server → client) ====================

export interface SubscribedMessage {
  type: "subscribed";
  id: number;
  msg: {
    sid: number;
    channel: Channel;
  };
}

export interface UnsubscribedMessage {
  type: "unsubscribed";
  id: number;
  /** Server-assigned subscription ID that was removed. One message per sid. */
  sid: number;
  seq: number;
}

export interface ErrorMessage {
  type: "error";
  id?: number;
  msg: {
    code: number;
    msg: string;
  };
}

export interface TickerMessage {
  type: "ticker";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    yes_bid: string;
    yes_ask: string;
    no_bid: string;
    no_ask: string;
  };
}

export interface TickerV2Message {
  type: "ticker_v2";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    yes_bid: string;
    yes_ask: string;
    no_bid: string;
    no_ask: string;
    last_price: string;
    volume: number;
    open_interest: number;
  };
}

export interface TradeWsMessage {
  type: "trade";
  seq: number;
  sid: number;
  msg: {
    trade_id: string;
    market_ticker: string;
    /** Price in cents (integer) */
    yes_price: number;
    /** Dollar string, e.g. "0.360" */
    yes_price_dollars: string;
    /** Price in cents (integer) */
    no_price: number;
    /** Dollar string, e.g. "0.640" */
    no_price_dollars: string;
    count: number;
    /** Dollar string, e.g. "136.00" */
    count_fp: string;
    taker_side: "yes" | "no";
    /** Unix timestamp in seconds */
    ts: number;
  };
}

export interface OrderbookDeltaMessage {
  type: "orderbook_delta";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    /** Cent-integer price on wire */
    price: number;
    /** Dollar-string price */
    price_dollars: string;
    delta: number;
    side: "yes" | "no";
    client_order_id?: string;
  };
}

export interface OrderbookSnapshotMessage {
  type: "orderbook_snapshot";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    /** Legacy cent-integer tuples: [cents, quantity] */
    yes: [number, number][];
    no: [number, number][];
    /** Dollar-string tuples: [dollarPrice, quantity] */
    yes_dollars: [string, number][];
    no_dollars: [string, number][];
  };
}

export interface FillWsMessage {
  type: "fill";
  seq: number;
  sid: number;
  msg: {
    fill_id: string;
    order_id: string;
    market_ticker: string;
    side: "yes" | "no";
    action: "buy" | "sell";
    count: number;
    yes_price: string;
    no_price: string;
    is_taker: boolean;
    created_time: string;
  };
}

export interface MarketPositionsWsMessage {
  type: "market_positions";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    position: number;
    market_exposure_cents: number;
    realized_pnl_cents: number;
    fees_paid_cents: number;
  };
}

export interface MarketLifecycleMessage {
  type: "market_lifecycle_v2";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    old_status: string;
    new_status: string;
    timestamp: string;
  };
}

export interface CommunicationsWsMessage {
  type: "communications";
  seq: number;
  sid: number;
  msg: {
    message_id: string;
    title: string;
    body: string;
    created_time: string;
    priority: "low" | "medium" | "high";
  };
}

export interface OrderGroupUpdatesWsMessage {
  type: "order_group_updates";
  seq: number;
  sid: number;
  msg: {
    order_group_id: string;
    status: string;
  };
}

export interface MultivariateWsMessage {
  type: "multivariate";
  seq: number;
  sid: number;
  msg: Record<string, unknown>;
}

/** Acknowledgement message sent after certain subscriptions (e.g. fill). */
export interface OkMessage {
  type: "ok";
  id: number;
  sid: number;
  msg: Record<string, unknown>;
}

/** Union of all possible server → client messages. */
export type WebSocketMessage =
  | SubscribedMessage
  | UnsubscribedMessage
  | ErrorMessage
  | OkMessage
  | TickerMessage
  | TickerV2Message
  | TradeWsMessage
  | OrderbookDeltaMessage
  | OrderbookSnapshotMessage
  | FillWsMessage
  | MarketPositionsWsMessage
  | MarketLifecycleMessage
  | CommunicationsWsMessage
  | OrderGroupUpdatesWsMessage
  | MultivariateWsMessage;

// ==================== Event Handler Map ====================

/** Type-safe event handler signatures for on/off/once. */
export interface WebSocketEventMap {
  // Connection lifecycle events
  connected: () => void;
  disconnected: (event: { code: number; reason: string }) => void;
  reconnecting: (attempt: number) => void;
  resubscribed: () => void;

  // Protocol events
  subscribed: (msg: SubscribedMessage) => void;
  unsubscribed: (msg: UnsubscribedMessage) => void;
  error: (msg: ErrorMessage) => void;
  ok: (msg: OkMessage) => void;

  // Public channel data events
  ticker: (msg: TickerMessage) => void;
  ticker_v2: (msg: TickerV2Message) => void;
  trade: (msg: TradeWsMessage) => void;
  market_lifecycle_v2: (msg: MarketLifecycleMessage) => void;
  multivariate: (msg: MultivariateWsMessage) => void;

  // Private channel data events
  orderbook_delta: (msg: OrderbookDeltaMessage) => void;
  orderbook_snapshot: (msg: OrderbookSnapshotMessage) => void;
  fill: (msg: FillWsMessage) => void;
  market_positions: (msg: MarketPositionsWsMessage) => void;
  communications: (msg: CommunicationsWsMessage) => void;
  order_group_updates: (msg: OrderGroupUpdatesWsMessage) => void;

  // Wildcard — receives all parsed server messages
  message: (msg: WebSocketMessage) => void;
}

// ==================== Internal Subscription Tracking ====================

export interface ActiveSubscription {
  sid: number;
  params: SubscribeParams;
}
