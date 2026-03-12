import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  Event,
  Milestone,
  EventsListResponse,
  EventResponse,
  EventsListParams,
  EventParams,
} from "./events";
import type { Market } from "./markets";

describe("Event", () => {
  const validEvent: Event = {
    event_ticker: "EVT-1",
    series_ticker: "SERIES-1",
    sub_title: "Sub",
    title: "Test Event",
    collateral_return_type: "full",
    mutually_exclusive: true,
    category: "politics",
    available_on_brokers: false,
    product_metadata: {},
    strike_date: "2025-06-01",
    strike_period: "daily",
  };

  it("has all required fields", () => {
    expect(validEvent.event_ticker).toBe("EVT-1");
    expect(validEvent.mutually_exclusive).toBe(true);
  });

  it("markets field is optional", () => {
    expectTypeOf<Event["markets"]>().toEqualTypeOf<Market[] | undefined>();
    expect(validEvent.markets).toBeUndefined();
  });

  it("accepts markets array when populated", () => {
    const market: Market = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      market_type: "binary",
      yes_sub_title: "",
      no_sub_title: "",
      created_time: "",
      updated_time: "",
      open_time: "",
      close_time: "",
      latest_expiration_time: "",
      settlement_timer_seconds: 0,
      status: "open",
      yes_bid_dollars: "0",
      yes_bid_size_fp: "0.0000",
      yes_ask_dollars: "0",
      yes_ask_size_fp: "0.0000",
      no_bid_dollars: "0",
      no_ask_dollars: "0",
      last_price_dollars: "0",
      previous_yes_bid_dollars: "0",
      previous_yes_ask_dollars: "0",
      previous_price_dollars: "0",
      volume_fp: "0.0000",
      volume_24h_fp: "0.0000",
      open_interest_fp: "0.0000",
      notional_value_dollars: "0",
      result: "",
      can_close_early: false,
      fractional_trading_enabled: false,
      expiration_value: "",
      rules_primary: "",
      rules_secondary: "",
      price_level_structure: "",
      price_ranges: [],
    };
    const eventWithMarkets: Event = { ...validEvent, markets: [market] };
    expect(eventWithMarkets.markets).toHaveLength(1);
  });

  it("product_metadata is a Record<string, unknown>", () => {
    const e: Event = {
      ...validEvent,
      product_metadata: { nested: { deep: true }, count: 5 },
    };
    expect(e.product_metadata).toHaveProperty("nested");
  });

  it("last_updated_ts is optional", () => {
    expectTypeOf<Event["last_updated_ts"]>().toEqualTypeOf<string | undefined>();
    expect(validEvent.last_updated_ts).toBeUndefined();
  });

  it("accepts last_updated_ts when populated", () => {
    const e: Event = { ...validEvent, last_updated_ts: "2025-06-01T12:00:00Z" };
    expect(e.last_updated_ts).toBe("2025-06-01T12:00:00Z");
  });
});

describe("Milestone", () => {
  it("allows arbitrary keys via index signature", () => {
    const milestone: Milestone = {
      step: 1,
      description: "test",
      nested: { a: true },
    };
    expect(milestone.step).toBe(1);
    expect(milestone.description).toBe("test");
  });

  it("accepts empty object", () => {
    const milestone: Milestone = {};
    expect(Object.keys(milestone)).toHaveLength(0);
  });
});

describe("EventsListResponse", () => {
  it("includes cursor and events array", () => {
    const response: EventsListResponse = {
      events: [],
      cursor: "abc123",
    };
    expect(response.cursor).toBe("abc123");
    expect(response.events).toHaveLength(0);
  });

  it("milestones field is optional", () => {
    expectTypeOf<EventsListResponse["milestones"]>().toEqualTypeOf<
      Milestone[] | undefined
    >();
  });

  it("accepts milestones when populated", () => {
    const response: EventsListResponse = {
      events: [],
      cursor: "",
      milestones: [{ step: 1 }],
    };
    expect(response.milestones).toHaveLength(1);
  });
});

describe("EventResponse", () => {
  it("wraps a single Event", () => {
    const event: Event = {
      event_ticker: "EVT-1",
      series_ticker: "SERIES-1",
      sub_title: "",
      title: "Test",
      collateral_return_type: "",
      mutually_exclusive: false,
      category: "",
      available_on_brokers: false,
      product_metadata: {},
      strike_date: "",
      strike_period: "",
    };
    const response: EventResponse = { event };
    expect(response.event.event_ticker).toBe("EVT-1");
  });
});

describe("EventsListParams", () => {
  it("all fields are optional", () => {
    const empty: EventsListParams = {};
    expect(empty).toEqual({});
  });

  it("enforces status union", () => {
    expectTypeOf<EventsListParams["status"]>().toEqualTypeOf<
      "open" | "closed" | "settled" | undefined
    >();
  });

  it("accepts all fields populated", () => {
    const full: EventsListParams = {
      series_ticker: "SERIES-1",
      status: "open",
      with_nested_markets: true,
      with_milestones: false,
      min_close_ts: 1700000000,
      limit: 10,
      cursor: "abc",
    };
    expect(full.series_ticker).toBe("SERIES-1");
    expect(full.limit).toBe(10);
  });

  it("accepts each status variant", () => {
    const statuses = ["open", "closed", "settled"] as const;
    for (const s of statuses) {
      const params: EventsListParams = { status: s };
      expect(params.status).toBe(s);
    }
  });
});

describe("EventParams", () => {
  it("all fields are optional", () => {
    const empty: EventParams = {};
    expect(empty).toEqual({});
  });

  it("accepts with_nested_markets", () => {
    const full: EventParams = { with_nested_markets: true };
    expect(full.with_nested_markets).toBe(true);
  });
});
