// ==================== Historical Endpoint Types ====================

export interface GetHistoricalCutoffResponse {
  market_settled_ts: number;
  trades_created_ts: number;
  orders_updated_ts: number;
}

export interface GetHistoricalMarketsParams {
  limit?: number;
  cursor?: string;
  tickers?: string;
  event_ticker?: string;
  mve_filter?: "only" | "exclude";
}

export interface GetHistoricalCandlesticksParams {
  start_ts: number;
  end_ts: number;
  period_interval: 1 | 60 | 1440;
}

export interface GetHistoricalOrdersParams {
  ticker?: string;
  max_ts?: number;
  limit?: number;
  cursor?: string;
}

export interface GetHistoricalFillsParams {
  ticker?: string;
  max_ts?: number;
  limit?: number;
  cursor?: string;
}
