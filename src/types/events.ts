// ==================== Event Types ====================

import type { Market } from "./markets";

export interface Event {
  event_ticker: string;
  series_ticker: string;
  sub_title: string;
  title: string;
  collateral_return_type: string;
  mutually_exclusive: boolean;
  category: string;
  available_on_brokers: boolean;
  product_metadata: Record<string, unknown>;
  strike_date: string;
  strike_period: string;
  markets?: Market[];
  /** ISO 8601 timestamp of when this event's metadata was last updated. */
  last_updated_ts?: string;
}

export interface Milestone {
  [key: string]: unknown;
}

export interface EventsListResponse {
  events: Event[];
  cursor: string;
  milestones?: Milestone[];
}

export interface EventResponse {
  event: Event;
  markets?: Market[];
}

// ==================== Event Request Params ====================

export interface EventsListParams {
  series_ticker?: string;
  status?: "open" | "closed" | "settled";
  with_nested_markets?: boolean;
  with_milestones?: boolean;
  min_close_ts?: number;
  min_updated_ts?: number;
  limit?: number;
  cursor?: string;
}

export interface EventParams {
  with_nested_markets?: boolean;
}

// ==================== Event Candlestick Types ====================

export interface EventCandlesticksResponse {
  market_tickers: string[];
  market_candlesticks: import("./markets").Candlestick[][];
  adjusted_end_ts: number;
}

export interface EventCandlesticksParams {
  start_ts: number;
  end_ts: number;
  period_interval: number;
}

// ==================== Forecast Percentile Types ====================

export interface PercentilePoint {
  percentile: number;
  raw_numerical_forecast: number;
  numerical_forecast: number;
  formatted_forecast: string;
}

export interface ForecastPercentilesPoint {
  event_ticker: string;
  end_period_ts: number;
  period_interval: number;
  percentile_points: PercentilePoint[];
}

export interface ForecastPercentilesHistoryResponse {
  forecast_history: ForecastPercentilesPoint[];
}

export interface ForecastPercentilesHistoryParams {
  percentiles: string;
  start_ts: number;
  end_ts: number;
  period_interval: number;
}

// ==================== Multivariate Event Types ====================

export interface MultivariateEventsResponse {
  events: Event[];
  cursor: string;
}

export interface MultivariateEventsParams {
  limit?: number;
  cursor?: string;
  series_ticker?: string;
  collection_ticker?: string;
  with_nested_markets?: boolean;
}

// ==================== Event Metadata Types ====================

export interface EventMetadataResponse {
  image_url: string;
  featured_image_url?: string;
  market_details: import("./markets").MarketMetadata[];
  settlement_sources: import("./series").SettlementSource[];
  competition?: string | null;
  competition_scope?: string | null;
}

// ==================== Milestone Types ====================

export interface MilestoneDetail {
  id: string;
  category: string;
  type: string;
  start_date: string;
  end_date?: string | null;
  related_event_tickers: string[];
  title: string;
  notification_message: string;
  source_id?: string | null;
  details: Record<string, unknown>;
  primary_event_tickers: string[];
  last_updated_ts: string;
}

export interface MilestonesResponse {
  milestones: MilestoneDetail[];
  cursor?: string;
}

export interface MilestoneByIdResponse {
  milestone: MilestoneDetail;
}

export interface MilestonesParams {
  limit: number;
  minimum_start_date?: string;
  category?: string;
  competition?: string;
  source_id?: string;
  type?: string;
  related_event_ticker?: string;
  min_updated_ts?: number;
  cursor?: string;
}

// ==================== Live Data Types ====================

export interface LiveData {
  type: string;
  details: Record<string, unknown>;
  milestone_id: string;
}

export interface LiveDataResponse {
  live_data: LiveData;
}

export interface LiveDataBatchResponse {
  live_datas: LiveData[];
}

export interface LiveDataBatchParams {
  milestone_ids: string;
}

// ==================== Structured Target Types ====================

export interface StructuredTarget {
  id?: string;
  name?: string;
  type?: string;
  details?: Record<string, unknown>;
  source_id?: string;
  last_updated_ts?: string;
}

export interface StructuredTargetsResponse {
  structured_targets?: StructuredTarget[];
  cursor?: string;
}

export interface StructuredTargetByIdResponse {
  structured_target?: StructuredTarget;
}

export interface StructuredTargetsParams {
  type?: string;
  competition?: string;
  page_size?: number;
  cursor?: string;
}

// ==================== Multivariate Event Collection Types ====================

export interface AssociatedEvent {
  ticker: string;
  is_yes_only: boolean;
  size_max?: number | null;
  size_min?: number | null;
  active_quoters: string[];
}

export interface MultivariateEventCollection {
  collection_ticker: string;
  series_ticker: string;
  title: string;
  description: string;
  open_date: string;
  close_date: string;
  associated_events: AssociatedEvent[];
  associated_event_tickers: string[];
  is_ordered: boolean;
  is_single_market_per_event: boolean;
  is_all_yes: boolean;
  size_min: number;
  size_max: number;
  functional_description: string;
}

export interface MultivariateEventCollectionsResponse {
  multivariate_contracts: MultivariateEventCollection[];
  cursor?: string;
}

export interface MultivariateEventCollectionResponse {
  multivariate_contract: MultivariateEventCollection;
}

export interface MultivariateEventCollectionsParams {
  status?: "unopened" | "open" | "closed";
  associated_event_ticker?: string;
  series_ticker?: string;
  limit?: number;
  cursor?: string;
}

export interface TickerPair {
  market_ticker: string;
  event_ticker: string;
  side: "yes" | "no";
}

export interface LookupPoint {
  event_ticker: string;
  market_ticker: string;
  selected_markets: TickerPair[];
  last_queried_ts: string;
}

export interface CollectionLookupHistoryResponse {
  lookup_points: LookupPoint[];
}

export interface CollectionLookupHistoryParams {
  lookback_seconds: number;
}

export interface LookupTickersInCollectionResponse {
  event_ticker: string;
  market_ticker: string;
}

export interface LookupTickersInCollectionData {
  selected_markets: TickerPair[];
}
