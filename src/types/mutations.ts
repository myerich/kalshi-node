// ==================== Order Mutation Types ====================

import type { Order } from "./portfolio";

export interface CreateOrderResponse {
  order: Order;
}

export interface DeleteOrderResponse {
  order: Order;
  reduced_by: number;
  reduced_by_fp: string;
}

export interface AmendOrderResponse {
  old_order: Order;
  order: Order;
}

export interface DecreaseOrderResponse {
  order: Order;
}

// ==================== Order Mutation Request Data ====================

export interface CreateOrderData {
  ticker: string;
  side: "yes" | "no";
  action: "buy" | "sell";
  count: number;
  count_fp?: string;
  type: "limit";
  client_order_id?: string;
  yes_price_dollars?: string;
  no_price_dollars?: string;
  expiration_ts?: number;
  time_in_force?: "fill_or_kill" | "good_till_canceled" | "immediate_or_cancel";
  buy_max_cost?: number;
  post_only?: boolean;
  reduce_only?: boolean;
  self_trade_prevention_type?: "taker_at_cross" | "maker";
  order_group_id?: string;
  cancel_order_on_pause?: boolean;
  subaccount?: number;
}

export interface AmendOrderData {
  ticker: string;
  side: "yes" | "no";
  action: "buy" | "sell";
  client_order_id?: string;
  updated_client_order_id?: string;
  count: number;
  yes_price_dollars?: string;
  no_price_dollars?: string;
}

export interface DecreaseOrderData {
  reduce_by?: number;
  reduce_to?: number;
}

// ==================== Batch Order Types ====================

export interface BatchCreateOrdersResponse {
  orders: CreateOrderResponse[];
}

export interface BatchCreateOrdersData {
  orders: CreateOrderData[];
}

export interface BatchCancelOrdersRequestOrder {
  order_id: string;
  subaccount?: number;
}

export interface BatchCancelOrderIndividualResponse {
  order_id: string;
  order?: Order | null;
  reduced_by: number;
  reduced_by_fp: string;
  error?: unknown;
}

export interface BatchCancelOrdersResponse {
  orders: BatchCancelOrderIndividualResponse[];
}

export interface BatchCancelOrdersData {
  orders?: BatchCancelOrdersRequestOrder[];
}

// ==================== Order Group Limit Types ====================

export interface UpdateOrderGroupLimitData {
  contracts_limit?: number;
  contracts_limit_fp?: string;
}

// ==================== Collection Market Creation Types ====================

export interface CreateMarketInCollectionResponse {
  event_ticker: string;
  market_ticker: string;
  market?: import("./markets").Market;
}

export interface CreateMarketInCollectionData {
  selected_markets: import("./events").TickerPair[];
  with_market_payload?: boolean;
}
