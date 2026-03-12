// ==================== Series Types ====================

export interface SettlementSource {
  name: string;
  url: string;
}

export interface Series {
  ticker: string;
  frequency: string;
  title: string;
  category: string;
  tags: string[];
  settlement_sources: SettlementSource[];
  contract_url: string;
  contract_terms_url: string;
  fee_type: "quadratic" | "quadratic_with_maker_fees" | "flat";
  fee_multiplier: number;
  additional_prohibitions: string[];
  product_metadata?: Record<string, unknown>;
  /** String representation of total contracts traded across all events in this series (fixed-point count). */
  volume_fp?: string;
  /** ISO 8601 timestamp of when this series' metadata was last updated. */
  last_updated_ts?: string;
}

export interface SeriesListResponse {
  series: Series[];
}

export interface SeriesResponse {
  series: Series;
}

export interface TagsByCategoriesResponse {
  tags_by_categories: Record<string, string[]>;
}

// ==================== Series Request Params ====================

export interface SeriesListParams {
  category?: string;
  tags?: string;
  include_product_metadata?: boolean;
  include_volume?: boolean;
  min_updated_ts?: number;
}

export interface SeriesParams {
  include_volume?: boolean;
}
