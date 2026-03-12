// ==================== Market Types ====================

export interface MveSelectedLeg {
  event_ticker?: string;
  market_ticker?: string;
  side?: string;
  yes_settlement_value_dollars?: string | null;
}

export interface PriceRange {
  start: string;
  end: string;
  step: string;
}

export interface Market {
  ticker: string;
  event_ticker: string;
  market_type: "binary" | "scalar";
  yes_sub_title: string;
  no_sub_title: string;
  created_time: string;
  updated_time: string;
  open_time: string;
  close_time: string;
  latest_expiration_time: string;
  settlement_timer_seconds: number;
  status: string;
  yes_bid_dollars: string;
  yes_bid_size_fp: string;
  yes_ask_dollars: string;
  yes_ask_size_fp: string;
  no_bid_dollars: string;
  no_ask_dollars: string;
  last_price_dollars: string;
  previous_yes_bid_dollars: string;
  previous_yes_ask_dollars: string;
  previous_price_dollars: string;
  volume_fp: string;
  volume_24h_fp: string;
  open_interest_fp: string;
  notional_value_dollars: string;
  result: string;
  can_close_early: boolean;
  fractional_trading_enabled: boolean;
  expiration_value: string;
  rules_primary: string;
  rules_secondary: string;
  price_level_structure: string;
  price_ranges: PriceRange[];
  // Optional fields
  expected_expiration_time?: string;
  settlement_value_dollars?: string;
  settlement_ts?: string;
  fee_waiver_expiration_time?: string;
  early_close_condition?: string;
  strike_type?: string;
  floor_strike?: string | number | null;
  cap_strike?: string | number | null;
  functional_strike?: string | null;
  custom_strike?: Record<string, unknown> | null;
  mve_collection_ticker?: string;
  mve_selected_legs?: MveSelectedLeg[];
  primary_participant_key?: string | null;
  is_provisional?: boolean;
  no_bid_size_fp?: string;
  no_ask_size_fp?: string;
}

export interface MarketsListResponse {
  markets: Market[];
  cursor: string;
}

export interface MarketResponse {
  market: Market;
}

// ==================== Orderbook Types ====================

export interface Orderbook {
  orderbook_fp: {
    yes_dollars: [string, string][];
    no_dollars: [string, string][];
  };
}

// ==================== Trade Types ====================

export interface Trade {
  trade_id: string;
  ticker: string;
  yes_price_dollars: string;
  no_price_dollars: string;
  count_fp: string;
  taker_side: "yes" | "no";
  created_time: string;
}

export interface TradesResponse {
  trades: Trade[];
  cursor: string;
}

// ==================== Candlestick Types ====================

export interface OHLCDollars {
  open_dollars: string;
  low_dollars: string;
  high_dollars: string;
  close_dollars: string;
}

export interface PriceOHLC {
  open_dollars: string | null;
  low_dollars: string | null;
  high_dollars: string | null;
  close_dollars: string | null;
  mean_dollars: string | null;
  previous_dollars: string | null;
  min_dollars: string | null;
  max_dollars: string | null;
}

export interface Candlestick {
  end_period_ts: number;
  yes_bid: OHLCDollars;
  yes_ask: OHLCDollars;
  price: PriceOHLC;
  volume_fp: string;
  open_interest_fp: string;
}

export interface MarketCandlesticks {
  market_ticker: string;
  candlesticks: Candlestick[];
}

export interface BatchCandlesticksResponse {
  markets: MarketCandlesticks[];
}

// ==================== Incentive Types ====================

export interface IncentiveProgram {
  id: string;
  market_id: string;
  market_ticker: string;
  incentive_type: "liquidity" | "volume";
  start_date: string;
  end_date: string;
  period_reward: number;
  paid_out: boolean;
  discount_factor_bps?: number | null;
  target_size_fp?: string | null;
}

export interface IncentiveProgramsResponse {
  incentive_programs: IncentiveProgram[];
  next_cursor: string;
}

// ==================== Market Request Params ====================

export interface MarketsListParams {
  tickers?: string;
  event_ticker?: string;
  series_ticker?: string;
  min_created_ts?: number;
  max_created_ts?: number;
  min_close_ts?: number;
  max_close_ts?: number;
  min_settled_ts?: number;
  max_settled_ts?: number;
  min_updated_ts?: number;
  status?: "unopened" | "open" | "paused" | "closed" | "settled";
  mve_filter?: "only" | "exclude";
  limit?: number;
  cursor?: string;
}

export interface OrderbookParams {
  depth?: number;
}

export interface TradesParams {
  ticker?: string;
  min_ts?: number;
  max_ts?: number;
  limit?: number;
  cursor?: string;
}

export interface BatchCandlesticksParams {
  market_tickers: string;
  start_ts: number;
  end_ts: number;
  period_interval: number;
  include_latest_before_start?: boolean;
}

export interface IncentiveProgramsParams {
  status?: "all" | "active" | "upcoming" | "closed" | "paid_out";
  type?: "all" | "liquidity" | "volume";
  limit?: number;
  cursor?: string;
}

export interface MarketCandlesticksParams {
  start_ts: number;
  end_ts: number;
  period_interval: number;
  include_latest_before_start?: boolean;
}

// ==================== Market Candlestick Response Types ====================

export interface MarketCandlesticksResponse {
  ticker: string;
  candlesticks: Candlestick[];
}

export interface MarketMetadata {
  market_ticker: string;
  image_url: string;
  color_code: string;
}
