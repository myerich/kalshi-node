// ==================== Communications REST Types ====================

export interface GetCommunicationsIDResponse {
  id: string;
}

// ==================== RFQ Types ====================

export interface RFQSelectedLeg {
  event_ticker: string;
  market_ticker: string;
  side: string;
  yes_settlement_value_dollars?: string;
}

export interface RFQ {
  id: string;
  creator_id: string;
  market_ticker: string;
  event_ticker?: string;
  contracts?: number;
  contracts_fp?: string;
  target_cost?: number;
  target_cost_dollars?: string;
  created_ts: string;
  status?: string;
  mve_collection_ticker?: string;
  mve_selected_legs?: RFQSelectedLeg[];
}

export interface GetRFQsParams {
  cursor?: string;
  event_ticker?: string;
  ticker?: string;
  subaccount?: number;
  limit?: number;
  status?: string;
  creator_user_id?: string;
}

export interface GetRFQsResponse {
  rfqs: RFQ[];
  cursor?: string;
}

export interface GetRFQResponse {
  rfq: RFQ;
}

export interface CreateRFQRequest {
  market_ticker: string;
  event_ticker?: string;
  contracts?: number;
  contracts_fp?: string;
  target_cost?: number;
  target_cost_dollars?: string;
  mve_collection_ticker?: string;
  mve_selected_legs?: RFQSelectedLeg[];
}

export interface CreateRFQResponse {
  rfq: RFQ;
}

// ==================== Quote Types ====================

export interface Quote {
  quote_id: string;
  rfq_id: string;
  quote_creator_id: string;
  market_ticker: string;
  event_ticker?: string;
  yes_bid: number;
  no_bid: number;
  yes_bid_dollars: string;
  no_bid_dollars: string;
  yes_contracts_offered?: number;
  no_contracts_offered?: number;
  yes_contracts_offered_fp?: string;
  no_contracts_offered_fp?: string;
  rfq_target_cost?: number;
  rfq_target_cost_dollars?: string;
  created_ts: string;
  status?: string;
}

export interface GetQuotesParams {
  cursor?: string;
  event_ticker?: string;
  ticker?: string;
  limit?: number;
  status?: string;
  quote_creator_user_id?: string;
  rfq_creator_user_id?: string;
  rfq_creator_subtrader_id?: string;
  rfq_id?: string;
}

export interface GetQuotesResponse {
  quotes: Quote[];
  cursor?: string;
}

export interface GetQuoteResponse {
  quote: Quote;
}

export interface CreateQuoteRequest {
  rfq_id: string;
  yes_bid: number;
  no_bid: number;
  yes_contracts_offered?: number;
  no_contracts_offered?: number;
}

export interface CreateQuoteResponse {
  quote: Quote;
}

export interface AcceptQuoteRequest {
  side: "yes" | "no";
  contracts?: number;
}
