/** Endpoint registry — describes every Kalshi API endpoint for the test panel UI. */

export interface ParamDef {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  options?: string[]; // enum values
  description?: string;
}

export interface EndpointDef {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string; // e.g. "/exchange/status" or "/markets/:ticker"
  auth: boolean;
  category: string;
  pathParams?: string[]; // e.g. ["ticker"]
  queryParams?: ParamDef[];
  bodyParams?: ParamDef[];
}

export const ENDPOINTS: EndpointDef[] = [
  // ==================== Exchange ====================
  {
    name: "Get Exchange Status",
    method: "GET",
    endpoint: "/exchange/status",
    auth: false,
    category: "Exchange",
  },
  {
    name: "Get Exchange Announcements",
    method: "GET",
    endpoint: "/exchange/announcements",
    auth: false,
    category: "Exchange",
  },
  {
    name: "Get Exchange Schedule",
    method: "GET",
    endpoint: "/exchange/schedule",
    auth: false,
    category: "Exchange",
  },
  {
    name: "Get Exchange User Data Timestamp",
    method: "GET",
    endpoint: "/exchange/user_data_timestamp",
    auth: false,
    category: "Exchange",
  },

  // ==================== Series ====================
  {
    name: "Get Series Fee Changes",
    method: "GET",
    endpoint: "/series/fee_changes",
    auth: false,
    category: "Series",
    queryParams: [
      { name: "series_ticker", type: "string", required: false },
      { name: "show_historical", type: "boolean", required: false },
    ],
  },
  {
    name: "Get Tags By Categories",
    method: "GET",
    endpoint: "/search/tags_by_categories",
    auth: false,
    category: "Search",
  },
  {
    name: "Get Filters By Sport",
    method: "GET",
    endpoint: "/search/filters_by_sport",
    auth: false,
    category: "Search",
  },

  // ==================== Account ====================
  {
    name: "Get Account API Limits",
    method: "GET",
    endpoint: "/account/limits",
    auth: true,
    category: "Account",
  },

  // ==================== Series (continued) ====================
  {
    name: "Get Series List",
    method: "GET",
    endpoint: "/series",
    auth: false,
    category: "Series",
    queryParams: [
      { name: "category", type: "string", required: false },
      { name: "tags", type: "string", required: false },
      { name: "include_product_metadata", type: "boolean", required: false },
      { name: "include_volume", type: "boolean", required: false },
      { name: "min_updated_ts", type: "number", required: false, description: "Unix timestamp — return series with metadata updated after this time" },
    ],
  },
  {
    name: "Get Series",
    method: "GET",
    endpoint: "/series/:seriesTicker",
    auth: false,
    category: "Series",
    pathParams: ["seriesTicker"],
    queryParams: [
      { name: "include_volume", type: "boolean", required: false },
    ],
  },

  // ==================== Events ====================
  {
    name: "Get Events List",
    method: "GET",
    endpoint: "/events",
    auth: false,
    category: "Events",
    queryParams: [
      { name: "series_ticker", type: "string", required: false },
      {
        name: "status",
        type: "string",
        required: false,
        options: ["open", "closed", "settled"],
      },
      { name: "with_nested_markets", type: "boolean", required: false },
      { name: "with_milestones", type: "boolean", required: false },
      { name: "min_close_ts", type: "number", required: false },
      { name: "min_updated_ts", type: "number", required: false, description: "Unix timestamp — return events with metadata updated after this time" },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Event",
    method: "GET",
    endpoint: "/events/:eventTicker",
    auth: false,
    category: "Events",
    pathParams: ["eventTicker"],
    queryParams: [
      { name: "with_nested_markets", type: "boolean", required: false },
    ],
  },
  {
    name: "Get Multivariate Events",
    method: "GET",
    endpoint: "/events/multivariate",
    auth: false,
    category: "Events",
    queryParams: [
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
      { name: "series_ticker", type: "string", required: false },
      { name: "collection_ticker", type: "string", required: false },
      { name: "with_nested_markets", type: "boolean", required: false },
    ],
  },
  {
    name: "Get Event Metadata",
    method: "GET",
    endpoint: "/events/:eventTicker/metadata",
    auth: false,
    category: "Events",
    pathParams: ["eventTicker"],
  },

  // ==================== Markets ====================
  {
    name: "Get Markets List",
    method: "GET",
    endpoint: "/markets",
    auth: false,
    category: "Markets",
    queryParams: [
      { name: "tickers", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "series_ticker", type: "string", required: false },
      { name: "min_created_ts", type: "number", required: false },
      { name: "max_created_ts", type: "number", required: false },
      { name: "min_close_ts", type: "number", required: false },
      { name: "max_close_ts", type: "number", required: false },
      { name: "min_settled_ts", type: "number", required: false },
      { name: "max_settled_ts", type: "number", required: false },
      { name: "min_updated_ts", type: "number", required: false, description: "Unix timestamp — return markets with metadata updated after this time. Incompatible with most other filters." },
      {
        name: "status",
        type: "string",
        required: false,
        options: ["unopened", "open", "paused", "closed", "settled"],
      },
      {
        name: "mve_filter",
        type: "string",
        required: false,
        options: ["only", "exclude"],
      },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Market",
    method: "GET",
    endpoint: "/markets/:ticker",
    auth: false,
    category: "Markets",
    pathParams: ["ticker"],
  },
  {
    name: "Get Market Orderbook",
    method: "GET",
    endpoint: "/markets/:ticker/orderbook",
    auth: false,
    category: "Markets",
    pathParams: ["ticker"],
    queryParams: [{ name: "depth", type: "number", required: false }],
  },
  {
    name: "Get Market Trades",
    method: "GET",
    endpoint: "/markets/trades",
    auth: false,
    category: "Markets",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Batch Candlesticks",
    method: "GET",
    endpoint: "/markets/candlesticks",
    auth: false,
    category: "Markets",
    queryParams: [
      { name: "market_tickers", type: "string", required: true },
      { name: "start_ts", type: "number", required: true },
      { name: "end_ts", type: "number", required: true },
      { name: "period_interval", type: "number", required: true },
      {
        name: "include_latest_before_start",
        type: "boolean",
        required: false,
      },
    ],
  },

  {
    name: "Get Market Candlesticks (by Series)",
    method: "GET",
    endpoint: "/series/:seriesTicker/markets/:ticker/candlesticks",
    auth: false,
    category: "Markets",
    pathParams: ["seriesTicker", "ticker"],
    queryParams: [
      { name: "start_ts", type: "number", required: true },
      { name: "end_ts", type: "number", required: true },
      {
        name: "period_interval",
        type: "number",
        required: true,
        description: "1 (minute), 60 (hour), or 1440 (day)",
      },
      {
        name: "include_latest_before_start",
        type: "boolean",
        required: false,
      },
    ],
  },
  {
    name: "Get Event Candlesticks (by Series)",
    method: "GET",
    endpoint: "/series/:seriesTicker/events/:eventTicker/candlesticks",
    auth: false,
    category: "Events",
    pathParams: ["seriesTicker", "eventTicker"],
    queryParams: [
      { name: "start_ts", type: "number", required: true },
      { name: "end_ts", type: "number", required: true },
      {
        name: "period_interval",
        type: "number",
        required: true,
        description: "1 (minute), 60 (hour), or 1440 (day)",
      },
    ],
  },
  {
    name: "Get Event Forecast Percentile History",
    method: "GET",
    endpoint:
      "/series/:seriesTicker/events/:eventTicker/forecast_percentile_history",
    auth: false,
    category: "Events",
    pathParams: ["seriesTicker", "eventTicker"],
    queryParams: [
      {
        name: "percentiles",
        type: "string",
        required: true,
        description: "Comma-separated percentile values (0-10000), max 10",
      },
      { name: "start_ts", type: "number", required: true },
      { name: "end_ts", type: "number", required: true },
      {
        name: "period_interval",
        type: "number",
        required: true,
        description: "0 (5s), 1 (minute), 60 (hour), or 1440 (day)",
      },
    ],
  },

  // ==================== Milestones ====================
  {
    name: "Get Milestones",
    method: "GET",
    endpoint: "/milestones",
    auth: false,
    category: "Milestones",
    queryParams: [
      { name: "limit", type: "number", required: true },
      { name: "minimum_start_date", type: "string", required: false, description: "RFC3339 timestamp" },
      { name: "category", type: "string", required: false },
      { name: "competition", type: "string", required: false },
      { name: "source_id", type: "string", required: false },
      { name: "type", type: "string", required: false },
      { name: "related_event_ticker", type: "string", required: false },
      { name: "min_updated_ts", type: "number", required: false, description: "Unix timestamp — return milestones updated after this time" },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Milestone By ID",
    method: "GET",
    endpoint: "/milestones/:milestoneId",
    auth: false,
    category: "Milestones",
    pathParams: ["milestoneId"],
  },

  // ==================== Live Data ====================
  {
    name: "Get Live Data",
    method: "GET",
    endpoint: "/live_data/:type/milestone/:milestoneId",
    auth: false,
    category: "Live Data",
    pathParams: ["type", "milestoneId"],
  },
  {
    name: "Get Live Data Batch",
    method: "GET",
    endpoint: "/live_data/batch",
    auth: false,
    category: "Live Data",
    queryParams: [
      {
        name: "milestone_ids",
        type: "string",
        required: true,
        description: "Comma-separated milestone IDs",
      },
    ],
  },

  // ==================== Structured Targets ====================
  {
    name: "Get Structured Targets",
    method: "GET",
    endpoint: "/structured_targets",
    auth: false,
    category: "Structured Targets",
    queryParams: [
      { name: "type", type: "string", required: false },
      { name: "competition", type: "string", required: false },
      { name: "page_size", type: "number", required: false, description: "1-2000, default 100" },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Structured Target By ID",
    method: "GET",
    endpoint: "/structured_targets/:structuredTargetId",
    auth: false,
    category: "Structured Targets",
    pathParams: ["structuredTargetId"],
  },

  // ==================== Multivariate Event Collections ====================
  {
    name: "Get Multivariate Event Collections",
    method: "GET",
    endpoint: "/multivariate_event_collections",
    auth: false,
    category: "Multivariate Collections",
    queryParams: [
      {
        name: "status",
        type: "string",
        required: false,
        options: ["unopened", "open", "closed"],
      },
      { name: "associated_event_ticker", type: "string", required: false },
      { name: "series_ticker", type: "string", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Multivariate Event Collection",
    method: "GET",
    endpoint: "/multivariate_event_collections/:collectionTicker",
    auth: false,
    category: "Multivariate Collections",
    pathParams: ["collectionTicker"],
  },
  {
    name: "Create Market in Collection",
    method: "POST",
    endpoint: "/multivariate_event_collections/:collectionTicker",
    auth: true,
    category: "Multivariate Collections",
    pathParams: ["collectionTicker"],
    bodyParams: [
      {
        name: "selected_markets",
        type: "string",
        required: true,
        description:
          'JSON array of {market_ticker, event_ticker, side} objects',
      },
      { name: "with_market_payload", type: "boolean", required: false },
    ],
  },
  {
    name: "Get Collection Lookup History",
    method: "GET",
    endpoint: "/multivariate_event_collections/:collectionTicker/lookup",
    auth: false,
    category: "Multivariate Collections",
    pathParams: ["collectionTicker"],
    queryParams: [
      {
        name: "lookback_seconds",
        type: "number",
        required: true,
        description: "10, 60, 300, or 3600",
      },
    ],
  },
  {
    name: "Lookup Tickers in Collection",
    method: "PUT",
    endpoint: "/multivariate_event_collections/:collectionTicker/lookup",
    auth: false,
    category: "Multivariate Collections",
    pathParams: ["collectionTicker"],
    bodyParams: [
      {
        name: "selected_markets",
        type: "string",
        required: true,
        description:
          'JSON array of {market_ticker, event_ticker, side} objects',
      },
    ],
  },

  // ==================== Incentives ====================
  {
    name: "Get Incentive Programs",
    method: "GET",
    endpoint: "/incentive_programs",
    auth: false,
    category: "Incentives",
    queryParams: [
      {
        name: "status",
        type: "string",
        required: false,
        options: ["all", "active", "upcoming", "closed", "paid_out"],
      },
      {
        name: "type",
        type: "string",
        required: false,
        options: ["all", "liquidity", "volume"],
      },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Orders ====================
  {
    name: "Get Portfolio Orders",
    method: "GET",
    endpoint: "/portfolio/orders",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      {
        name: "status",
        type: "string",
        required: false,
        options: ["resting", "executed", "canceled"],
      },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
      { name: "subaccount", type: "number", required: false },
    ],
  },
  {
    name: "Get Portfolio Order By ID",
    method: "GET",
    endpoint: "/portfolio/orders/:orderId",
    auth: true,
    category: "Portfolio",
    pathParams: ["orderId"],
  },
  {
    name: "Get Order Queue Positions",
    method: "GET",
    endpoint: "/portfolio/orders/queue_positions",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "market_tickers", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "subaccount", type: "number", required: false },
    ],
  },
  {
    name: "Get Order Queue Position By ID",
    method: "GET",
    endpoint: "/portfolio/orders/:orderId/queue_position",
    auth: true,
    category: "Portfolio",
    pathParams: ["orderId"],
  },

  // ==================== Portfolio — Order Groups ====================
  {
    name: "Get Order Groups",
    method: "GET",
    endpoint: "/portfolio/order_groups",
    auth: true,
    category: "Portfolio",
  },
  {
    name: "Get Order Group By ID",
    method: "GET",
    endpoint: "/portfolio/order_groups/:groupId",
    auth: true,
    category: "Portfolio",
    pathParams: ["groupId"],
  },
  {
    name: "Create Order Group",
    method: "POST",
    endpoint: "/portfolio/order_groups/create",
    auth: true,
    category: "Portfolio",
    bodyParams: [
      { name: "contracts_limit", type: "number", required: false },
    ],
  },
  {
    name: "Delete Order Group",
    method: "DELETE",
    endpoint: "/portfolio/order_groups/:groupId",
    auth: true,
    category: "Portfolio",
    pathParams: ["groupId"],
  },
  {
    name: "Reset Order Group",
    method: "PUT",
    endpoint: "/portfolio/order_groups/:groupId/reset",
    auth: true,
    category: "Portfolio",
    pathParams: ["groupId"],
  },
  {
    name: "Trigger Order Group",
    method: "PUT",
    endpoint: "/portfolio/order_groups/:groupId/trigger",
    auth: true,
    category: "Portfolio",
    pathParams: ["groupId"],
  },
  {
    name: "Update Order Group Limit",
    method: "PUT",
    endpoint: "/portfolio/order_groups/:groupId/limit",
    auth: true,
    category: "Portfolio",
    pathParams: ["groupId"],
    bodyParams: [
      { name: "contracts_limit", type: "number", required: false },
      { name: "contracts_limit_fp", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Balance ====================
  {
    name: "Get Portfolio Balance",
    method: "GET",
    endpoint: "/portfolio/balance",
    auth: true,
    category: "Portfolio",
  },
  {
    name: "Get Subaccount Balances",
    method: "GET",
    endpoint: "/portfolio/subaccounts/balances",
    auth: true,
    category: "Portfolio",
  },
  {
    name: "Get Subaccount Transfers",
    method: "GET",
    endpoint: "/portfolio/subaccounts/transfers",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Positions ====================
  {
    name: "Get Portfolio Positions",
    method: "GET",
    endpoint: "/portfolio/positions",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "count_filter", type: "string", required: false },
      { name: "subaccount", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Settlements ====================
  {
    name: "Get Portfolio Settlements",
    method: "GET",
    endpoint: "/portfolio/settlements",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Resting Value ====================
  {
    name: "Get Portfolio Total Resting Order Value",
    method: "GET",
    endpoint: "/portfolio/summary/total_resting_order_value",
    auth: true,
    category: "Portfolio",
  },

  // ==================== Portfolio — Fills ====================
  {
    name: "Get Portfolio Fills",
    method: "GET",
    endpoint: "/portfolio/fills",
    auth: true,
    category: "Portfolio",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "order_id", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "subaccount", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Portfolio — Order Mutations ====================
  {
    name: "Batch Create Orders",
    method: "POST",
    endpoint: "/portfolio/orders/batched",
    auth: true,
    category: "Trading",
    bodyParams: [
      {
        name: "orders",
        type: "string",
        required: true,
        description:
          "JSON array of order objects (same shape as Create Order body)",
      },
    ],
  },
  {
    name: "Batch Cancel Orders",
    method: "DELETE",
    endpoint: "/portfolio/orders/batched",
    auth: true,
    category: "Trading",
    bodyParams: [
      {
        name: "orders",
        type: "string",
        required: true,
        description:
          'JSON array of {order_id, subaccount?} objects',
      },
    ],
  },
  {
    name: "Create Order",
    method: "POST",
    endpoint: "/portfolio/orders",
    auth: true,
    category: "Trading",
    bodyParams: [
      { name: "ticker", type: "string", required: true },
      {
        name: "side",
        type: "string",
        required: true,
        options: ["yes", "no"],
      },
      {
        name: "action",
        type: "string",
        required: true,
        options: ["buy", "sell"],
      },
      { name: "count", type: "number", required: false, description: "Order quantity in whole contracts. Provide count or count_fp." },
      { name: "count_fp", type: "string", required: false, description: "Fixed-point string quantity. Provide count or count_fp." },
      {
        name: "type",
        type: "string",
        required: true,
        options: ["limit", "market"],
      },
      { name: "client_order_id", type: "string", required: false },
      { name: "yes_price", type: "number", required: false, description: "Yes price in cents (1-99)" },
      { name: "no_price", type: "number", required: false, description: "No price in cents (1-99)" },
      { name: "yes_price_dollars", type: "string", required: false, description: "Yes price as fixed-point dollars" },
      { name: "no_price_dollars", type: "string", required: false, description: "No price as fixed-point dollars" },
      { name: "expiration_ts", type: "number", required: false },
      {
        name: "time_in_force",
        type: "string",
        required: false,
        options: [
          "fill_or_kill",
          "good_till_canceled",
          "immediate_or_cancel",
        ],
      },
      { name: "buy_max_cost", type: "number", required: false },
      { name: "post_only", type: "boolean", required: false },
      { name: "reduce_only", type: "boolean", required: false },
      {
        name: "self_trade_prevention_type",
        type: "string",
        required: false,
        options: ["taker_at_cross", "maker"],
      },
      { name: "order_group_id", type: "string", required: false },
      { name: "cancel_order_on_pause", type: "boolean", required: false },
      { name: "subaccount", type: "number", required: false },
    ],
  },
  {
    name: "Delete Order",
    method: "DELETE",
    endpoint: "/portfolio/orders/:orderId",
    auth: true,
    category: "Trading",
    pathParams: ["orderId"],
  },
  {
    name: "Amend Order",
    method: "POST",
    endpoint: "/portfolio/orders/:orderId/amend",
    auth: true,
    category: "Trading",
    pathParams: ["orderId"],
    bodyParams: [
      { name: "ticker", type: "string", required: true },
      {
        name: "side",
        type: "string",
        required: true,
        options: ["yes", "no"],
      },
      {
        name: "action",
        type: "string",
        required: true,
        options: ["buy", "sell"],
      },
      { name: "client_order_id", type: "string", required: true },
      { name: "updated_client_order_id", type: "string", required: true },
      { name: "count", type: "number", required: false, description: "Updated quantity in whole contracts. Provide count or count_fp." },
      { name: "count_fp", type: "string", required: false, description: "Fixed-point string quantity. Provide count or count_fp." },
      { name: "yes_price", type: "number", required: false, description: "Updated yes price in cents (1-99)" },
      { name: "no_price", type: "number", required: false, description: "Updated no price in cents (1-99)" },
      { name: "yes_price_dollars", type: "string", required: false, description: "Updated yes price as fixed-point dollars" },
      { name: "no_price_dollars", type: "string", required: false, description: "Updated no price as fixed-point dollars" },
      { name: "subaccount", type: "number", required: false },
    ],
  },
  {
    name: "Decrease Order",
    method: "POST",
    endpoint: "/portfolio/orders/:orderId/decrease",
    auth: true,
    category: "Trading",
    pathParams: ["orderId"],
    bodyParams: [
      { name: "reduce_by", type: "number", required: false, description: "Contracts to reduce by. Provide reduce_by or reduce_by_fp." },
      { name: "reduce_by_fp", type: "string", required: false, description: "Fixed-point string contracts to reduce by." },
      { name: "reduce_to", type: "number", required: false, description: "Contracts to reduce to. Provide reduce_to or reduce_to_fp." },
      { name: "reduce_to_fp", type: "string", required: false, description: "Fixed-point string contracts to reduce to." },
      { name: "subaccount", type: "number", required: false },
    ],
  },

  // ==================== Subaccounts ====================
  {
    name: "Create Subaccount",
    method: "POST",
    endpoint: "/portfolio/subaccounts",
    auth: true,
    category: "Subaccounts",
  },
  {
    name: "Transfer Between Subaccounts",
    method: "POST",
    endpoint: "/portfolio/subaccounts/transfer",
    auth: true,
    category: "Subaccounts",
    bodyParams: [
      { name: "client_transfer_id", type: "string", required: true },
      { name: "from_subaccount", type: "number", required: true },
      { name: "to_subaccount", type: "number", required: true },
      { name: "amount_cents", type: "number", required: true },
    ],
  },
  {
    name: "Get Subaccount Netting",
    method: "GET",
    endpoint: "/portfolio/subaccounts/netting",
    auth: true,
    category: "Subaccounts",
  },
  {
    name: "Update Subaccount Netting",
    method: "PUT",
    endpoint: "/portfolio/subaccounts/netting",
    auth: true,
    category: "Subaccounts",
    bodyParams: [
      { name: "subaccount_number", type: "number", required: true },
      { name: "enabled", type: "boolean", required: true },
    ],
  },

  // ==================== API Keys ====================
  {
    name: "Get API Keys",
    method: "GET",
    endpoint: "/api_keys",
    auth: true,
    category: "API Keys",
  },
  {
    name: "Create API Key",
    method: "POST",
    endpoint: "/api_keys",
    auth: true,
    category: "API Keys",
    bodyParams: [
      { name: "label", type: "string", required: true },
      { name: "scopes", type: "string", required: true, description: "Comma-separated scopes" },
      { name: "markets_access_level", type: "string", required: false, options: ["read", "write"] },
    ],
  },
  {
    name: "Generate API Key",
    method: "POST",
    endpoint: "/api_keys/generate",
    auth: true,
    category: "API Keys",
    bodyParams: [
      { name: "label", type: "string", required: true },
      { name: "scopes", type: "string", required: true, description: "Comma-separated scopes" },
    ],
  },
  {
    name: "Delete API Key",
    method: "DELETE",
    endpoint: "/api_keys/:apiKey",
    auth: true,
    category: "API Keys",
    pathParams: ["apiKey"],
  },

  // ==================== Historical ====================
  {
    name: "Get Historical Cutoff",
    method: "GET",
    endpoint: "/historical/cutoff",
    auth: false,
    category: "Historical",
  },
  {
    name: "Get Historical Markets",
    method: "GET",
    endpoint: "/historical/markets",
    auth: false,
    category: "Historical",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "status", type: "string", required: false, options: ["open", "closed", "settled"] },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Historical Market",
    method: "GET",
    endpoint: "/historical/markets/:ticker",
    auth: false,
    category: "Historical",
    pathParams: ["ticker"],
  },
  {
    name: "Get Historical Market Candlesticks",
    method: "GET",
    endpoint: "/historical/markets/:ticker/candlesticks",
    auth: false,
    category: "Historical",
    pathParams: ["ticker"],
    queryParams: [
      { name: "start_ts", type: "number", required: true },
      { name: "end_ts", type: "number", required: true },
      { name: "period_interval", type: "number", required: true, description: "1 (minute), 60 (hour), or 1440 (day)" },
    ],
  },
  {
    name: "Get Historical Fills",
    method: "GET",
    endpoint: "/historical/fills",
    auth: true,
    category: "Historical",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "order_id", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get Historical Orders",
    method: "GET",
    endpoint: "/historical/orders",
    auth: true,
    category: "Historical",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "status", type: "string", required: false, options: ["resting", "executed", "canceled"] },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== FCM ====================
  {
    name: "Get FCM Orders",
    method: "GET",
    endpoint: "/fcm/orders",
    auth: true,
    category: "FCM",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "min_ts", type: "number", required: false },
      { name: "max_ts", type: "number", required: false },
      { name: "status", type: "string", required: false, options: ["resting", "executed", "canceled"] },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Get FCM Positions",
    method: "GET",
    endpoint: "/fcm/positions",
    auth: true,
    category: "FCM",
    queryParams: [
      { name: "ticker", type: "string", required: false },
      { name: "event_ticker", type: "string", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },

  // ==================== Communications ====================
  {
    name: "Get Communications ID",
    method: "GET",
    endpoint: "/communications/id",
    auth: true,
    category: "Communications",
  },
  {
    name: "Get RFQs",
    method: "GET",
    endpoint: "/communications/rfqs",
    auth: true,
    category: "Communications",
    queryParams: [
      { name: "event_ticker", type: "string", required: false },
      { name: "market_ticker", type: "string", required: false },
      { name: "subaccount", type: "number", required: false },
      { name: "status", type: "string", required: false },
      { name: "creator_user_id", type: "string", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Create RFQ",
    method: "POST",
    endpoint: "/communications/rfqs",
    auth: true,
    category: "Communications",
    bodyParams: [
      { name: "ticker", type: "string", required: true },
      { name: "side", type: "string", required: true, options: ["yes", "no"] },
      { name: "count", type: "number", required: true },
    ],
  },
  {
    name: "Get RFQ",
    method: "GET",
    endpoint: "/communications/rfqs/:rfqId",
    auth: true,
    category: "Communications",
    pathParams: ["rfqId"],
  },
  {
    name: "Delete RFQ",
    method: "DELETE",
    endpoint: "/communications/rfqs/:rfqId",
    auth: true,
    category: "Communications",
    pathParams: ["rfqId"],
  },
  {
    name: "Get Quotes",
    method: "GET",
    endpoint: "/communications/quotes",
    auth: true,
    category: "Communications",
    queryParams: [
      { name: "event_ticker", type: "string", required: false },
      { name: "market_ticker", type: "string", required: false },
      { name: "status", type: "string", required: false },
      { name: "quote_creator_user_id", type: "string", required: false },
      { name: "rfq_creator_user_id", type: "string", required: false },
      { name: "rfq_creator_subtrader_id", type: "string", required: false },
      { name: "rfq_id", type: "string", required: false },
      { name: "limit", type: "number", required: false },
      { name: "cursor", type: "string", required: false },
    ],
  },
  {
    name: "Create Quote",
    method: "POST",
    endpoint: "/communications/quotes",
    auth: true,
    category: "Communications",
    bodyParams: [
      { name: "rfq_id", type: "string", required: true },
      { name: "yes_price", type: "number", required: false },
      { name: "no_price", type: "number", required: false },
      { name: "count", type: "number", required: true },
    ],
  },
  {
    name: "Get Quote",
    method: "GET",
    endpoint: "/communications/quotes/:quoteId",
    auth: true,
    category: "Communications",
    pathParams: ["quoteId"],
  },
  {
    name: "Delete Quote",
    method: "DELETE",
    endpoint: "/communications/quotes/:quoteId",
    auth: true,
    category: "Communications",
    pathParams: ["quoteId"],
  },
  {
    name: "Accept Quote",
    method: "PUT",
    endpoint: "/communications/quotes/:quoteId/accept",
    auth: true,
    category: "Communications",
    pathParams: ["quoteId"],
    bodyParams: [
      { name: "taker_fills_all", type: "boolean", required: false },
    ],
  },
  {
    name: "Confirm Quote",
    method: "PUT",
    endpoint: "/communications/quotes/:quoteId/confirm",
    auth: true,
    category: "Communications",
    pathParams: ["quoteId"],
  },
];
