// ==================== Portfolio Order Types ====================

export interface Order {
  order_id: string;
  user_id: string;
  client_order_id: string;
  ticker: string;
  side: "yes" | "no";
  action: "buy" | "sell";
  type: "limit";
  yes_price_dollars: string;
  no_price_dollars: string;
  fill_count: number;
  remaining_count: number;
  initial_count: number;
  taker_fees_dollars: string;
  maker_fees_dollars: string;
  taker_fill_cost_dollars: string;
  maker_fill_cost_dollars: string;
  expiration_time: string | null;
  created_time: string | null;
  last_update_time: string | null;
  self_trade_prevention_type: "taker_at_cross" | "maker" | null;
  order_group_id: string | null;
  cancel_order_on_pause: boolean;
  subaccount_number?: number;
}

export interface PortfolioOrdersResponse {
  orders: Order[];
  cursor: string;
}

export interface PortfolioOrderResponse {
  order: Order;
}

export interface QueuePosition {
  order_id: string;
  market_ticker: string;
  queue_position: number;
}

export interface QueuePositionsResponse {
  queue_positions: QueuePosition[];
}

export interface QueuePositionByIdResponse {
  queue_position: number;
  queue_position_fp?: string;
}

// ==================== Order Group Types ====================

export interface OrderGroup {
  id: string;
  is_auto_cancel_enabled: boolean;
  contracts_limit?: number;
  contracts_limit_fp?: string;
}

export interface OrderGroupsResponse {
  order_groups: OrderGroup[];
}

export interface OrderGroupByIdResponse {
  is_auto_cancel_enabled: boolean;
  contracts_limit?: number;
  contracts_limit_fp?: string;
  orders: string[];
}

export interface CreateOrderGroupResponse {
  order_group_id: string;
}

// ==================== Balance Types ====================

export interface Balance {
  balance: number;
  portfolio_value: number;
  updated_ts: number;
}

// ==================== Position Types ====================

export interface MarketPosition {
  ticker: string;
  total_traded_dollars: string;
  position: number;
  market_exposure_dollars: string;
  realized_pnl_dollars: string;
  fees_paid_dollars: string;
  last_updated_ts: string;
}

export interface EventPosition {
  event_ticker: string;
  total_cost_dollars: string;
  total_cost_shares: number;
  event_exposure_dollars: string;
  realized_pnl_dollars: string;
  fees_paid_dollars: string;
}

export interface PortfolioPositionsResponse {
  market_positions: MarketPosition[];
  event_positions: EventPosition[];
  cursor: string;
}

// ==================== Settlement Types ====================

export interface Settlement {
  ticker: string;
  event_ticker: string;
  market_result: "yes" | "no" | "scalar" | "void";
  yes_count: number;
  no_count: number;
  settled_time: string;
  fee_cost: string;
  yes_total_cost_dollars?: string;
  no_total_cost_dollars?: string;
  yes_count_fp?: string;
  no_count_fp?: string;
}

export interface PortfolioSettlementsResponse {
  settlements: Settlement[];
  cursor: string;
}

// ==================== Resting Value Types ====================

export interface RestingValue {
  total_resting_order_value: number;
}

// ==================== Fill Types ====================

export interface Fill {
  fill_id: string;
  trade_id: string;
  order_id: string;
  ticker: string;
  side: "yes" | "no";
  action: "buy" | "sell";
  count: number;
  yes_price_fixed: string;
  no_price_fixed: string;
  is_taker: boolean;
  client_order_id: string;
  created_time: string;
  ts: number;
}

export interface PortfolioFillsResponse {
  fills: Fill[];
  cursor: string;
}

// ==================== Portfolio Request Params ====================

export interface PortfolioOrdersParams {
  ticker?: string;
  event_ticker?: string;
  min_ts?: number;
  max_ts?: number;
  status?: "resting" | "canceled" | "executed";
  limit?: number;
  cursor?: string;
  subaccount?: number;
}

export interface QueuePositionsParams {
  market_tickers?: string;
  event_ticker?: string;
  subaccount?: number;
}

export interface PortfolioPositionsParams {
  ticker?: string;
  event_ticker?: string;
  count_filter?: string;
  subaccount?: number;
  limit?: number;
  cursor?: string;
}

export interface PortfolioSettlementsParams {
  ticker?: string;
  event_ticker?: string;
  min_ts?: number;
  max_ts?: number;
  limit?: number;
  cursor?: string;
  subaccount?: number;
}

export interface PortfolioFillsParams {
  ticker?: string;
  order_id?: string;
  min_ts?: number;
  max_ts?: number;
  subaccount?: number;
  limit?: number;
  cursor?: string;
}

export interface CreateOrderGroupData {
  contracts_limit?: number;
}
