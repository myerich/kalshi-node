// ==================== Exchange Types ====================

export interface ExchangeStatus {
  exchange_active: boolean;
  trading_active: boolean;
  exchange_estimated_resume_time: string | null;
}

export interface Announcement {
  type: "info" | "warning" | "error";
  message: string;
  delivery_time: string;
  status: "active" | "inactive";
}

export interface ExchangeAnnouncementsResponse {
  announcements: Announcement[];
}

export interface FeeChange {
  id: string;
  series_ticker: string;
  fee_type: "quadratic" | "quadratic_with_maker_fees" | "flat";
  fee_multiplier: number;
  scheduled_ts: string;
}

export interface SeriesFeeChangesResponse {
  series_fee_change_arr: FeeChange[];
}

export interface TradingSession {
  open_time: string;
  close_time: string;
}

export interface StandardHours {
  start_time: string;
  end_time: string;
  monday: TradingSession[];
  tuesday: TradingSession[];
  wednesday: TradingSession[];
  thursday: TradingSession[];
  friday: TradingSession[];
  saturday: TradingSession[];
  sunday: TradingSession[];
}

export interface MaintenanceWindow {
  start_datetime: string;
  end_datetime: string;
}

export interface ExchangeSchedule {
  schedule: {
    standard_hours: StandardHours;
    maintenance_windows: MaintenanceWindow[];
  };
}

export interface UserDataTimestamp {
  as_of_time: string;
}

// ==================== Exchange Request Params ====================

export interface SeriesFeeChangesParams {
  series_ticker?: string;
  show_historical?: boolean;
}

// ==================== Search/Filter Types ====================

export interface SportFilterDetails {
  scopes: string[];
  competitions: Record<string, string[]>;
}

export interface FiltersBySportsResponse {
  filters_by_sports: Record<string, SportFilterDetails>;
  sport_ordering: string[];
}

// ==================== Account Types ====================

export interface AccountLimitsResponse {
  usage_tier: string;
  read_limit: number;
  write_limit: number;
}
