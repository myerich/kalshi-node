import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  ExchangeStatus,
  Announcement,
  ExchangeAnnouncementsResponse,
  FeeChange,
  SeriesFeeChangesResponse,
  TradingSession,
  StandardHours,
  MaintenanceWindow,
  ExchangeSchedule,
  UserDataTimestamp,
  SeriesFeeChangesParams,
} from "./exchange";

describe("ExchangeStatus", () => {
  it("has correct shape with active exchange", () => {
    const status: ExchangeStatus = {
      exchange_active: true,
      trading_active: false,
      exchange_estimated_resume_time: null,
    };
    expect(status.exchange_active).toBe(true);
    expect(status.exchange_estimated_resume_time).toBeNull();
  });

  it("accepts string for resume time", () => {
    const status: ExchangeStatus = {
      exchange_active: false,
      trading_active: false,
      exchange_estimated_resume_time: "2025-01-01T00:00:00Z",
    };
    expect(status.exchange_estimated_resume_time).toBe("2025-01-01T00:00:00Z");
  });

  it("enforces nullable resume time type", () => {
    expectTypeOf<ExchangeStatus["exchange_estimated_resume_time"]>().toEqualTypeOf<
      string | null
    >();
  });

  it("enforces boolean types for active flags", () => {
    expectTypeOf<ExchangeStatus["exchange_active"]>().toBeBoolean();
    expectTypeOf<ExchangeStatus["trading_active"]>().toBeBoolean();
  });
});

describe("Announcement", () => {
  it("enforces type union", () => {
    expectTypeOf<Announcement["type"]>().toEqualTypeOf<
      "info" | "warning" | "error"
    >();
  });

  it("enforces status union", () => {
    expectTypeOf<Announcement["status"]>().toEqualTypeOf<
      "active" | "inactive"
    >();
  });

  it("constructs valid announcement for each type", () => {
    const types = ["info", "warning", "error"] as const;
    for (const t of types) {
      const a: Announcement = {
        type: t,
        message: `Test ${t}`,
        delivery_time: "2025-01-01T00:00:00Z",
        status: "active",
      };
      expect(a.type).toBe(t);
    }
  });

  it("constructs valid announcement for each status", () => {
    const statuses = ["active", "inactive"] as const;
    for (const s of statuses) {
      const a: Announcement = {
        type: "info",
        message: "test",
        delivery_time: "2025-01-01T00:00:00Z",
        status: s,
      };
      expect(a.status).toBe(s);
    }
  });
});

describe("ExchangeAnnouncementsResponse", () => {
  it("wraps an array of Announcements", () => {
    const response: ExchangeAnnouncementsResponse = {
      announcements: [
        {
          type: "info",
          message: "test",
          delivery_time: "2025-01-01T00:00:00Z",
          status: "active",
        },
      ],
    };
    expect(response.announcements).toHaveLength(1);
  });

  it("accepts empty announcements array", () => {
    const response: ExchangeAnnouncementsResponse = { announcements: [] };
    expect(response.announcements).toHaveLength(0);
  });
});

describe("FeeChange", () => {
  it("enforces fee_type union", () => {
    expectTypeOf<FeeChange["fee_type"]>().toEqualTypeOf<
      "quadratic" | "quadratic_with_maker_fees" | "flat"
    >();
  });

  it("constructs with all required fields", () => {
    const feeChange: FeeChange = {
      id: "fc-1",
      series_ticker: "SERIES-1",
      fee_type: "quadratic",
      fee_multiplier: 1.5,
      scheduled_ts: "2025-06-01T00:00:00Z",
    };
    expect(feeChange.id).toBe("fc-1");
    expect(feeChange.fee_multiplier).toBe(1.5);
  });

  it("constructs with each fee_type variant", () => {
    const types = ["quadratic", "quadratic_with_maker_fees", "flat"] as const;
    for (const ft of types) {
      const fc: FeeChange = {
        id: "fc-1",
        series_ticker: "S-1",
        fee_type: ft,
        fee_multiplier: 1.0,
        scheduled_ts: "2025-01-01T00:00:00Z",
      };
      expect(fc.fee_type).toBe(ft);
    }
  });
});

describe("SeriesFeeChangesResponse", () => {
  it("wraps fee changes array", () => {
    const response: SeriesFeeChangesResponse = {
      series_fee_change_arr: [
        {
          id: "fc-1",
          series_ticker: "SERIES-1",
          fee_type: "flat",
          fee_multiplier: 2.0,
          scheduled_ts: "2025-01-01T00:00:00Z",
        },
      ],
    };
    expect(response.series_fee_change_arr).toHaveLength(1);
  });

  it("accepts empty array", () => {
    const response: SeriesFeeChangesResponse = { series_fee_change_arr: [] };
    expect(response.series_fee_change_arr).toHaveLength(0);
  });
});

describe("TradingSession", () => {
  it("has open and close time strings", () => {
    const session: TradingSession = {
      open_time: "09:30",
      close_time: "16:00",
    };
    expect(session.open_time).toBe("09:30");
    expect(session.close_time).toBe("16:00");
    expectTypeOf<TradingSession["open_time"]>().toBeString();
    expectTypeOf<TradingSession["close_time"]>().toBeString();
  });
});

describe("StandardHours", () => {
  it("has arrays for each day of the week", () => {
    const session: TradingSession = { open_time: "09:30", close_time: "16:00" };
    const hours: StandardHours = {
      start_time: "09:30",
      end_time: "16:00",
      monday: [session],
      tuesday: [session],
      wednesday: [session],
      thursday: [session],
      friday: [session],
      saturday: [],
      sunday: [],
    };
    expect(hours.saturday).toHaveLength(0);
    expect(hours.monday).toHaveLength(1);
  });

  it("allows multiple sessions per day", () => {
    const morning: TradingSession = { open_time: "09:00", close_time: "12:00" };
    const afternoon: TradingSession = { open_time: "13:00", close_time: "16:00" };
    const hours: StandardHours = {
      start_time: "09:00",
      end_time: "16:00",
      monday: [morning, afternoon],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    expect(hours.monday).toHaveLength(2);
  });
});

describe("MaintenanceWindow", () => {
  it("has start and end datetime strings", () => {
    const window: MaintenanceWindow = {
      start_datetime: "2025-01-01T00:00:00Z",
      end_datetime: "2025-01-01T06:00:00Z",
    };
    expect(window.start_datetime).toBe("2025-01-01T00:00:00Z");
    expectTypeOf<MaintenanceWindow["start_datetime"]>().toBeString();
    expectTypeOf<MaintenanceWindow["end_datetime"]>().toBeString();
  });
});

describe("ExchangeSchedule", () => {
  it("has nested schedule structure", () => {
    const session: TradingSession = { open_time: "09:30", close_time: "16:00" };
    const schedule: ExchangeSchedule = {
      schedule: {
        standard_hours: {
          start_time: "09:30",
          end_time: "16:00",
          monday: [session],
          tuesday: [session],
          wednesday: [session],
          thursday: [session],
          friday: [session],
          saturday: [],
          sunday: [],
        },
        maintenance_windows: [
          {
            start_datetime: "2025-01-01T00:00:00Z",
            end_datetime: "2025-01-01T06:00:00Z",
          },
        ],
      },
    };
    expect(schedule.schedule.standard_hours.saturday).toHaveLength(0);
    expect(schedule.schedule.maintenance_windows).toHaveLength(1);
  });

  it("accepts empty maintenance windows", () => {
    const session: TradingSession = { open_time: "09:30", close_time: "16:00" };
    const schedule: ExchangeSchedule = {
      schedule: {
        standard_hours: {
          start_time: "09:30",
          end_time: "16:00",
          monday: [session],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        maintenance_windows: [],
      },
    };
    expect(schedule.schedule.maintenance_windows).toHaveLength(0);
  });
});

describe("UserDataTimestamp", () => {
  it("has as_of_time string", () => {
    const ts: UserDataTimestamp = { as_of_time: "2025-01-01T00:00:00Z" };
    expect(ts.as_of_time).toBe("2025-01-01T00:00:00Z");
    expectTypeOf<UserDataTimestamp["as_of_time"]>().toBeString();
  });
});

describe("SeriesFeeChangesParams", () => {
  it("all fields are optional", () => {
    const empty: SeriesFeeChangesParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: SeriesFeeChangesParams = {
      series_ticker: "SERIES-1",
      show_historical: true,
    };
    expect(full.series_ticker).toBe("SERIES-1");
    expect(full.show_historical).toBe(true);
  });

  it("enforces optional types", () => {
    expectTypeOf<SeriesFeeChangesParams["series_ticker"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<SeriesFeeChangesParams["show_historical"]>().toEqualTypeOf<
      boolean | undefined
    >();
  });
});
