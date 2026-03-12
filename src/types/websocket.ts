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

  /**
   * WebSocket constructor to use. Defaults to the native global `WebSocket`.
   * Pass `WebSocket` from the `ws` npm package in Node.js server environments
   * where the built-in experimental WebSocket is unreliable.
   *
   * @example (Node.js)
   * import { WebSocket } from 'ws';
   * new KalshiWebSocketClient({ WebSocketImpl: WebSocket });
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WebSocketImpl?: new (url: string, ...args: any[]) => WebSocket;
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
  | "fill"
  | "market_positions"
  | "communications"
  | "order_group_updates"
  | "user_orders";

export type Channel = PublicChannel | PrivateChannel;

// ==================== Commands (client → server) ====================

export interface SubscribeParams {
  channels: Channel[];
  market_ticker?: string;
  market_tickers?: string[];
  market_id?: string;
  market_ids?: string[];
  send_initial_snapshot?: boolean;
  skip_ticker_ack?: boolean;
  /** Communications channel sharding */
  shard_factor?: number;
  /** Communications channel sharding */
  shard_key?: number;
}

export interface UpdateSubscriptionParams {
  sid?: number;
  sids?: number[];
  action: "add_markets" | "delete_markets";
  market_ticker?: string;
  market_tickers?: string[];
  market_id?: string;
  market_ids?: string[];
  send_initial_snapshot?: boolean;
}

/** Internal command envelope sent over the WebSocket. */
export interface WebSocketCommand {
  id: number;
  cmd: "subscribe" | "unsubscribe" | "update_subscription" | "list_subscriptions";
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
    market_id: string;
    /** Price in cents (integer 1-99) */
    price: number;
    price_dollars: string;
    yes_bid_dollars: string;
    yes_ask_dollars: string;
    yes_bid_size_fp?: string;
    yes_ask_size_fp?: string;
    last_trade_size_fp?: string;
    volume: number;
    volume_fp: string;
    open_interest: number;
    open_interest_fp: string;
    dollar_volume: number;
    dollar_open_interest: number;
    /** Unix seconds */
    ts: number;
    /** RFC3339 */
    time: string;
  };
}

export interface TradeWsMessage {
  type: "trade";
  seq: number;
  sid: number;
  msg: {
    trade_id: string;
    market_ticker: string;
    /** Dollar string, e.g. "0.360" */
    yes_price_dollars: string;
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
    market_id: string;
    /** Cent-integer price on wire */
    price: number;
    /** Dollar-string price */
    price_dollars: string;
    delta: number;
    /** Fixed-point 2 decimals */
    delta_fp: string;
    side: "yes" | "no";
    client_order_id?: string;
    subaccount?: number;
    /** RFC3339 optional */
    ts?: string;
  };
}

export interface OrderbookSnapshotMessage {
  type: "orderbook_snapshot";
  seq: number;
  sid: number;
  msg: {
    market_ticker: string;
    market_id: string;
    /** Legacy cent-integer tuples: [cents, quantity] */
    yes: [number, number][];
    no: [number, number][];
    /** Dollar-string tuples: [dollarPrice, quantity] */
    yes_dollars: [string, number][];
    no_dollars: [string, number][];
    /** Dollar-string tuples: [price_dollars, count_fp] */
    yes_dollars_fp?: [string, string][];
    /** Dollar-string tuples: [price_dollars, count_fp] */
    no_dollars_fp?: [string, string][];
  };
}

export interface FillWsMessage {
  type: "fill";
  seq: number;
  sid: number;
  msg: {
    /** UUID (replaces fill_id) */
    trade_id: string;
    order_id: string;
    market_ticker: string;
    is_taker: boolean;
    side: "yes" | "no";
    yes_price_dollars: string;
    count: number;
    /** Fixed-point 2 decimals */
    count_fp: string;
    /** Exchange fee in fixed-point dollars */
    fee_cost: string;
    action: "buy" | "sell";
    /** Unix seconds */
    ts: number;
    client_order_id?: string;
    post_position: number;
    post_position_fp: string;
    purchased_side: "yes" | "no";
    subaccount?: number;
  };
}

export interface MarketPositionsWsMessage {
  type: "market_position";
  seq: number;
  sid: number;
  msg: {
    user_id: string;
    market_ticker: string;
    /** int32 net position */
    position: number;
    /** fixed-point 2 decimals */
    position_fp: string;
    /** centi-cents int64 */
    position_cost: number;
    /** centi-cents int64 */
    realized_pnl: number;
    /** centi-cents int64 */
    fees_paid: number;
    /** centi-cents int64 */
    position_fee_cost: number;
    /** int32 */
    volume: number;
    volume_fp: string;
    subaccount?: number;
  };
}

export interface MarketLifecycleMessage {
  type: "market_lifecycle_v2";
  seq: number;
  sid: number;
  msg: {
    event_type: "created" | "deactivated" | "activated" | "close_date_updated" | "determined" | "settled";
    market_ticker: string;
    /** Only on "created" */
    open_ts?: number;
    /** On "created" or "close_date_updated" */
    close_ts?: number;
    /** Only on "determined" */
    result?: string;
    /** Only on "determined" */
    determination_ts?: number;
    /** Only on "determined" — fixed-point dollars */
    settlement_value?: string;
    /** Only on "settled" */
    settled_ts?: number;
    /** Only on "activated"/"deactivated" */
    is_deactivated?: boolean;
    /** Only on "created" */
    additional_metadata?: {
      name?: string;
      title?: string;
      yes_sub_title?: string;
      no_sub_title?: string;
      rules_primary?: string;
      rules_secondary?: string;
      can_close_early?: boolean;
      event_ticker?: string;
      expected_expiration_ts?: number;
      strike_type?: string;
      floor_strike?: number;
      cap_strike?: number;
      custom_strike?: object;
    };
  };
}

export interface EventLifecycleMessage {
  type: "event_lifecycle";
  sid: number;
  msg: {
    event_ticker: string;
    title: string;
    subtitle: string;
    collateral_return_type: "MECNET" | "DIRECNET" | "";
    series_ticker: string;
    strike_date?: number;
    strike_period?: string;
  };
}

export interface OrderGroupUpdatesWsMessage {
  type: "order_group_updates";
  seq: number;
  sid: number;
  msg: {
    event_type: "created" | "triggered" | "reset" | "deleted" | "limit_updated";
    order_group_id: string;
    /** Present only for "created" and "limit_updated" */
    contracts_limit_fp?: string;
  };
}

export interface MultivariateWsMessage {
  type: "multivariate_lookup";
  seq: number;
  sid: number;
  msg: {
    collection_ticker: string;
    event_ticker: string;
    market_ticker: string;
    selected_markets: Array<{
      event_ticker: string;
      market_ticker: string;
      side: "yes" | "no";
    }>;
  };
}

// ==================== Communications Channel Messages ====================

export interface RFQCreatedWsMessage {
  type: "rfq_created";
  seq: number;
  sid: number;
  msg: {
    id: string;
    /** Anonymized, currently empty for rfq_created */
    creator_id: string;
    market_ticker: string;
    event_ticker?: string;
    contracts?: number;
    contracts_fp?: string;
    /** Centicents */
    target_cost?: number;
    target_cost_dollars?: string;
    /** RFC3339 */
    created_ts: string;
    mve_collection_ticker?: string;
    mve_selected_legs?: Array<{
      event_ticker: string;
      market_ticker: string;
      side: string;
      yes_settlement_value_dollars?: string;
    }>;
  };
}

export interface RFQDeletedWsMessage {
  type: "rfq_deleted";
  seq: number;
  sid: number;
  msg: {
    id: string;
    creator_id: string;
    market_ticker: string;
    event_ticker?: string;
    contracts?: number;
    contracts_fp?: string;
    target_cost?: number;
    target_cost_dollars?: string;
    /** RFC3339 */
    deleted_ts: string;
  };
}

export interface QuoteCreatedWsMessage {
  type: "quote_created";
  seq: number;
  sid: number;
  msg: {
    quote_id: string;
    rfq_id: string;
    /** Anonymized */
    quote_creator_id: string;
    market_ticker: string;
    event_ticker?: string;
    /** Cents int32 */
    yes_bid: number;
    /** Cents int32 */
    no_bid: number;
    yes_bid_dollars: string;
    no_bid_dollars: string;
    yes_contracts_offered?: number;
    no_contracts_offered?: number;
    yes_contracts_offered_fp?: string;
    no_contracts_offered_fp?: string;
    /** Centicents */
    rfq_target_cost?: number;
    rfq_target_cost_dollars?: string;
    /** RFC3339 */
    created_ts: string;
  };
}

export interface QuoteAcceptedWsMessage {
  type: "quote_accepted";
  seq: number;
  sid: number;
  msg: {
    quote_id: string;
    rfq_id: string;
    quote_creator_id: string;
    market_ticker: string;
    event_ticker?: string;
    yes_bid: number;
    no_bid: number;
    yes_bid_dollars: string;
    no_bid_dollars: string;
    accepted_side?: "yes" | "no";
    contracts_accepted?: number;
    contracts_accepted_fp?: string;
    yes_contracts_offered?: number;
    no_contracts_offered?: number;
    yes_contracts_offered_fp?: string;
    no_contracts_offered_fp?: string;
    rfq_target_cost?: number;
    rfq_target_cost_dollars?: string;
  };
}

export interface QuoteExecutedWsMessage {
  type: "quote_executed";
  seq: number;
  sid: number;
  msg: {
    quote_id: string;
    rfq_id: string;
    quote_creator_id: string;
    rfq_creator_id: string;
    order_id: string;
    /** Required per spec */
    client_order_id: string;
    market_ticker: string;
    /** RFC3339 */
    executed_ts: string;
  };
}

// ==================== User Orders Channel Messages ====================

export interface UserOrderWsMessage {
  type: "user_order";
  sid: number;
  msg: {
    /** UUID — required */
    order_id: string;
    /** UUID — required */
    user_id: string;
    /** Market ticker — required */
    ticker: string;
    status: "resting" | "canceled" | "executed";
    side: "yes" | "no";
    is_yes: boolean;
    /** 4 decimal fixed-point */
    yes_price_dollars: string;
    fill_count_fp: string;
    remaining_count_fp: string;
    initial_count_fp: string;
    taker_fill_cost_dollars: string;
    maker_fill_cost_dollars: string;
    /** Required (not optional per schema) */
    client_order_id: string;
    /** Omitted when zero */
    taker_fees_dollars?: string;
    /** Omitted when zero */
    maker_fees_dollars?: string;
    order_group_id?: string;
    self_trade_prevention_type?: "taker_at_cross" | "maker";
    /** RFC3339 — required */
    created_time: string;
    /** RFC3339 */
    last_update_time?: string;
    /** RFC3339 */
    expiration_time?: string;
    subaccount_number?: number;
  };
}

/** Acknowledgement message sent after certain subscriptions (e.g. fill). */
export interface OkMessage {
  type: "ok";
  id: number;
  sid: number;
  msg: Record<string, unknown>;
}

export interface ListSubscriptionsResponse {
  type: "ok";
  id: number;
  msg: Array<{ channel: string; sid: number }>;
}

/** Union of all possible server → client messages. */
export type WebSocketMessage =
  | SubscribedMessage
  | UnsubscribedMessage
  | ErrorMessage
  | OkMessage
  | TickerMessage
  | TradeWsMessage
  | OrderbookDeltaMessage
  | OrderbookSnapshotMessage
  | FillWsMessage
  | MarketPositionsWsMessage
  | MarketLifecycleMessage
  | EventLifecycleMessage
  | OrderGroupUpdatesWsMessage
  | MultivariateWsMessage
  | RFQCreatedWsMessage
  | RFQDeletedWsMessage
  | QuoteCreatedWsMessage
  | QuoteAcceptedWsMessage
  | QuoteExecutedWsMessage
  | UserOrderWsMessage;

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
  trade: (msg: TradeWsMessage) => void;
  market_lifecycle_v2: (msg: MarketLifecycleMessage) => void;
  event_lifecycle: (msg: EventLifecycleMessage) => void;
  multivariate_lookup: (msg: MultivariateWsMessage) => void;

  // Private channel data events
  orderbook_delta: (msg: OrderbookDeltaMessage) => void;
  orderbook_snapshot: (msg: OrderbookSnapshotMessage) => void;
  fill: (msg: FillWsMessage) => void;
  market_position: (msg: MarketPositionsWsMessage) => void;
  order_group_updates: (msg: OrderGroupUpdatesWsMessage) => void;

  // Communications channel events (dispatched by msg.type)
  rfq_created: (msg: RFQCreatedWsMessage) => void;
  rfq_deleted: (msg: RFQDeletedWsMessage) => void;
  quote_created: (msg: QuoteCreatedWsMessage) => void;
  quote_accepted: (msg: QuoteAcceptedWsMessage) => void;
  quote_executed: (msg: QuoteExecutedWsMessage) => void;

  // User orders channel
  user_order: (msg: UserOrderWsMessage) => void;

  // Wildcard — receives all parsed server messages
  message: (msg: WebSocketMessage) => void;
}

// ==================== Internal Subscription Tracking ====================

export interface ActiveSubscription {
  sid: number;
  params: SubscribeParams;
}
