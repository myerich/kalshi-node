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
      title: "Test",
      subtitle: "",
      yes_subtitle: "",
      no_subtitle: "",
      created_time: "",
      open_time: "",
      close_time: "",
      latest_expiration_time: "",
      settlement_timer_seconds: 0,
      status: "open",
      yes_bid_dollars: "0",
      yes_ask_dollars: "0",
      no_bid_dollars: "0",
      no_ask_dollars: "0",
      last_price_dollars: "0",
      volume: 0,
      volume_24h: 0,
      result: "",
      can_close_early: false,
      open_interest: 0,
      notional_value_dollars: "0",
      expiration_value: "",
      rules_primary: "",
      rules_secondary: "",
      price_level_structure: "",
      price_ranges: [],
      expected_expiration_time: "",
      settlement_value_dollars: "",
      settlement_ts: "",
      fee_waiver_expiration_time: "",
      early_close_condition: "",
      strike_type: "",
      floor_strike: "",
      cap_strike: "",
      functional_strike: "",
      custom_strike: {},
      mve_collection_ticker: "",
      primary_participant_key: "",
      is_provisional: false,
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
