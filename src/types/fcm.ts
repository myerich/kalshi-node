// ==================== FCM (Futures Commission Merchant) Types ====================

export interface GetFCMOrdersParams {
  subtrader_id: string;
  cursor?: string;
  event_ticker?: string;
  ticker?: string;
  min_ts?: number;
  max_ts?: number;
  status?: "resting" | "canceled" | "executed";
  limit?: number;
}

export interface GetFCMPositionsParams {
  subtrader_id: string;
  ticker?: string;
  event_ticker?: string;
  count_filter?: string;
  settlement_status?: "all" | "unsettled" | "settled";
  limit?: number;
  cursor?: string;
}
