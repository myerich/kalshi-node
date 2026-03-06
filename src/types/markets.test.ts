import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  PriceRange,
  Market,
  MarketsListResponse,
  MarketResponse,
  Orderbook,
  Trade,
  TradesResponse,
  OHLCDollars,
  PriceOHLC,
  Candlestick,
  MarketCandlesticks,
  BatchCandlesticksResponse,
  IncentiveProgram,
  IncentiveProgramsResponse,
  MarketsListParams,
  OrderbookParams,
  TradesParams,
  BatchCandlesticksParams,
  IncentiveProgramsParams,
} from "./markets";

describe("PriceRange", () => {
  it("has start/end/step strings", () => {
    const range: PriceRange = { start: "0.01", end: "0.99", step: "0.01" };
    expect(range.start).toBe("0.01");
    expectTypeOf<PriceRange["start"]>().toBeString();
    expectTypeOf<PriceRange["end"]>().toBeString();
    expectTypeOf<PriceRange["step"]>().toBeString();
  });
});

describe("Market", () => {
  const validMarket: Market = {
    ticker: "MKT-1",
    event_ticker: "EVT-1",
    market_type: "binary",
    title: "Test Market",
    subtitle: "Sub",
    yes_subtitle: "Yes",
    no_subtitle: "No",
    created_time: "2025-01-01T00:00:00Z",
    open_time: "2025-01-01T00:00:00Z",
    close_time: "2025-12-31T23:59:59Z",
    latest_expiration_time: "2025-12-31T23:59:59Z",
    settlement_timer_seconds: 3600,
    status: "open",
    yes_bid_dollars: "0.55",
    yes_ask_dollars: "0.57",
    no_bid_dollars: "0.43",
    no_ask_dollars: "0.45",
    last_price_dollars: "0.56",
    volume: 10000,
    volume_24h: 500,
    result: "",
    can_close_early: false,
    open_interest: 5000,
    notional_value_dollars: "100000",
    liquidity_dollars: "50000",
    expiration_value: "",
    rules_primary: "Primary rules",
    rules_secondary: "Secondary rules",
    price_level_structure: "standard",
    price_ranges: [{ start: "0.01", end: "0.99", step: "0.01" }],
    expected_expiration_time: "2025-12-31T23:59:59Z",
    settlement_value_dollars: "",
    settlement_ts: "",
    fee_waiver_expiration_time: "",
    early_close_condition: "",
    strike_type: "greater",
    floor_strike: "0",
    cap_strike: "100",
    functional_strike: "50",
    custom_strike: {},
    mve_collection_ticker: "",
    primary_participant_key: "",
    is_provisional: false,
  };

  it("enforces market_type union", () => {
    expectTypeOf<Market["market_type"]>().toEqualTypeOf<"binary" | "scalar">();
  });

  it("has all required fields", () => {
    expect(validMarket.ticker).toBe("MKT-1");
    expect(validMarket.price_ranges).toHaveLength(1);
    expect(validMarket.settlement_timer_seconds).toBe(3600);
  });

  it("custom_strike is Record<string, unknown>", () => {
    expectTypeOf(validMarket.custom_strike).toEqualTypeOf<
      Record<string, unknown>
    >();
  });

  it("is_provisional is boolean", () => {
    expectTypeOf(validMarket.is_provisional).toBeBoolean();
  });

  it("constructs scalar market type", () => {
    const scalar: Market = { ...validMarket, market_type: "scalar" };
    expect(scalar.market_type).toBe("scalar");
  });

  it("price_ranges can be empty", () => {
    const m: Market = { ...validMarket, price_ranges: [] };
    expect(m.price_ranges).toHaveLength(0);
  });
});

describe("MarketsListResponse", () => {
  it("includes cursor and markets array", () => {
    const response: MarketsListResponse = { markets: [], cursor: "" };
    expectTypeOf(response.cursor).toBeString();
    expect(response.markets).toHaveLength(0);
  });
});

describe("MarketResponse", () => {
  it("wraps a single Market", () => {
    const market: Market = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      market_type: "binary",
      title: "",
      subtitle: "",
      yes_subtitle: "",
      no_subtitle: "",
      created_time: "",
      open_time: "",
      close_time: "",
      latest_expiration_time: "",
      settlement_timer_seconds: 0,
      status: "",
      yes_bid_dollars: "",
      yes_ask_dollars: "",
      no_bid_dollars: "",
      no_ask_dollars: "",
      last_price_dollars: "",
      volume: 0,
      volume_24h: 0,
      result: "",
      can_close_early: false,
      open_interest: 0,
      notional_value_dollars: "",
      liquidity_dollars: "",
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
    const response: MarketResponse = { market };
    expect(response.market.ticker).toBe("MKT-1");
  });
});

describe("Orderbook", () => {
  it("has nested yes/no dollar tuples", () => {
    const book: Orderbook = {
      orderbook_fp: {
        yes_dollars: [["0.55", "100"]],
        no_dollars: [["0.45", "50"]],
      },
    };
    expect(book.orderbook_fp.yes_dollars[0]).toEqual(["0.55", "100"]);
  });

  it("accepts empty orderbook levels", () => {
    const book: Orderbook = {
      orderbook_fp: {
        yes_dollars: [],
        no_dollars: [],
      },
    };
    expect(book.orderbook_fp.yes_dollars).toHaveLength(0);
    expect(book.orderbook_fp.no_dollars).toHaveLength(0);
  });

  it("accepts multiple price levels", () => {
    const book: Orderbook = {
      orderbook_fp: {
        yes_dollars: [
          ["0.55", "100"],
          ["0.54", "200"],
          ["0.53", "50"],
        ],
        no_dollars: [
          ["0.45", "100"],
          ["0.46", "200"],
        ],
      },
    };
    expect(book.orderbook_fp.yes_dollars).toHaveLength(3);
    expect(book.orderbook_fp.no_dollars).toHaveLength(2);
  });
});

describe("Trade", () => {
  it("enforces taker_side union", () => {
    expectTypeOf<Trade["taker_side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("constructs full object", () => {
    const trade: Trade = {
      trade_id: "trade-1",
      ticker: "MKT-1",
      yes_price_dollars: "0.55",
      no_price_dollars: "0.45",
      count: 10,
      taker_side: "yes",
      created_time: "2025-01-01T00:00:00Z",
    };
    expect(trade.trade_id).toBe("trade-1");
    expect(trade.count).toBe(10);
  });

  it("constructs with each taker_side variant", () => {
    const sides = ["yes", "no"] as const;
    for (const side of sides) {
      const t: Trade = {
        trade_id: "t-1",
        ticker: "MKT-1",
        yes_price_dollars: "0.55",
        no_price_dollars: "0.45",
        count: 1,
        taker_side: side,
        created_time: "",
      };
      expect(t.taker_side).toBe(side);
    }
  });
});

describe("TradesResponse", () => {
  it("wraps trades array with cursor", () => {
    const response: TradesResponse = { trades: [], cursor: "abc" };
    expect(response.trades).toHaveLength(0);
    expectTypeOf<TradesResponse["cursor"]>().toBeString();
  });
});

describe("OHLCDollars", () => {
  it("has four dollar string fields", () => {
    const ohlc: OHLCDollars = {
      open_dollars: "0.50",
      low_dollars: "0.45",
      high_dollars: "0.60",
      close_dollars: "0.55",
    };
    expect(ohlc.open_dollars).toBe("0.50");
    expectTypeOf<OHLCDollars["open_dollars"]>().toBeString();
    expectTypeOf<OHLCDollars["low_dollars"]>().toBeString();
    expectTypeOf<OHLCDollars["high_dollars"]>().toBeString();
    expectTypeOf<OHLCDollars["close_dollars"]>().toBeString();
  });
});

describe("PriceOHLC", () => {
  it("extends OHLCDollars with additional fields", () => {
    expectTypeOf<PriceOHLC>().toMatchTypeOf<OHLCDollars>();
    const ohlc: PriceOHLC = {
      open_dollars: "0.50",
      low_dollars: "0.45",
      high_dollars: "0.60",
      close_dollars: "0.55",
      mean_dollars: "0.52",
      previous_dollars: "0.48",
      min_dollars: "0.44",
      max_dollars: "0.61",
    };
    expect(ohlc.mean_dollars).toBe("0.52");
    expectTypeOf<PriceOHLC["mean_dollars"]>().toBeString();
    expectTypeOf<PriceOHLC["previous_dollars"]>().toBeString();
    expectTypeOf<PriceOHLC["min_dollars"]>().toBeString();
    expectTypeOf<PriceOHLC["max_dollars"]>().toBeString();
  });
});

describe("Candlestick", () => {
  it("has correct nested structure", () => {
    const candle: Candlestick = {
      end_period_ts: 1700000000,
      yes_bid: {
        open_dollars: "0.50",
        low_dollars: "0.45",
        high_dollars: "0.55",
        close_dollars: "0.52",
      },
      yes_ask: {
        open_dollars: "0.51",
        low_dollars: "0.46",
        high_dollars: "0.56",
        close_dollars: "0.53",
      },
      price: {
        open_dollars: "0.50",
        low_dollars: "0.45",
        high_dollars: "0.55",
        close_dollars: "0.52",
        mean_dollars: "0.50",
        previous_dollars: "0.48",
        min_dollars: "0.44",
        max_dollars: "0.56",
      },
      volume: 500,
      open_interest: 1000,
    };
    expect(candle.end_period_ts).toBe(1700000000);
    expect(candle.volume).toBe(500);
    expect(candle.open_interest).toBe(1000);
  });
});

describe("MarketCandlesticks", () => {
  it("wraps candlesticks array with ticker", () => {
    const mc: MarketCandlesticks = {
      market_ticker: "MKT-1",
      candlesticks: [],
    };
    expect(mc.market_ticker).toBe("MKT-1");
    expect(mc.candlesticks).toHaveLength(0);
    expectTypeOf<MarketCandlesticks["candlesticks"]>().toMatchTypeOf<
      Candlestick[]
    >();
  });
});

describe("BatchCandlesticksResponse", () => {
  it("wraps MarketCandlesticks array", () => {
    const response: BatchCandlesticksResponse = {
      markets: [{ market_ticker: "MKT-1", candlesticks: [] }],
    };
    expect(response.markets).toHaveLength(1);
    expectTypeOf<BatchCandlesticksResponse["markets"]>().toMatchTypeOf<
      MarketCandlesticks[]
    >();
  });

  it("accepts empty markets array", () => {
    const response: BatchCandlesticksResponse = { markets: [] };
    expect(response.markets).toHaveLength(0);
  });
});

describe("IncentiveProgram", () => {
  it("has all required fields", () => {
    const program: IncentiveProgram = {
      id: "inc-1",
      market_ticker: "MKT-1",
      incentive_type: "liquidity",
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      period_reward: 1000,
      paid_out: false,
      discount_factor_bps: 50,
      target_size: 500,
    };
    expect(program.id).toBe("inc-1");
    expect(program.paid_out).toBe(false);
  });

  it("enforces incentive_type union", () => {
    expectTypeOf<IncentiveProgram["incentive_type"]>().toEqualTypeOf<
      "liquidity" | "volume"
    >();
  });

  it("constructs with each incentive_type variant", () => {
    const types = ["liquidity", "volume"] as const;
    for (const t of types) {
      const p: IncentiveProgram = {
        id: "inc-1",
        market_ticker: "MKT-1",
        incentive_type: t,
        start_date: "",
        end_date: "",
        period_reward: 0,
        paid_out: false,
        discount_factor_bps: 0,
        target_size: 0,
      };
      expect(p.incentive_type).toBe(t);
    }
  });
});

describe("IncentiveProgramsResponse", () => {
  it("wraps programs with next_cursor", () => {
    const response: IncentiveProgramsResponse = {
      incentive_programs: [],
      next_cursor: "cursor-abc",
    };
    expect(response.incentive_programs).toHaveLength(0);
    expect(response.next_cursor).toBe("cursor-abc");
    expectTypeOf<IncentiveProgramsResponse["next_cursor"]>().toBeString();
  });
});

// ==================== Market Request Params ====================

describe("MarketsListParams", () => {
  it("all fields are optional", () => {
    const empty: MarketsListParams = {};
    expect(empty).toEqual({});
  });

  it("enforces status union", () => {
    expectTypeOf<MarketsListParams["status"]>().toEqualTypeOf<
      "unopened" | "open" | "paused" | "closed" | "settled" | undefined
    >();
  });

  it("enforces mve_filter union", () => {
    expectTypeOf<MarketsListParams["mve_filter"]>().toEqualTypeOf<
      "only" | "exclude" | undefined
    >();
  });

  it("accepts all fields populated", () => {
    const full: MarketsListParams = {
      tickers: "MKT-1,MKT-2",
      event_ticker: "EVT-1",
      series_ticker: "SERIES-1",
      min_created_ts: 1700000000,
      max_created_ts: 1700100000,
      min_close_ts: 1700000000,
      max_close_ts: 1700100000,
      min_settled_ts: 1700000000,
      max_settled_ts: 1700100000,
      status: "open",
      mve_filter: "exclude",
      limit: 100,
      cursor: "abc",
    };
    expect(full.tickers).toContain("MKT-1");
  });

  it("accepts each status variant", () => {
    const statuses = [
      "unopened",
      "open",
      "paused",
      "closed",
      "settled",
    ] as const;
    for (const s of statuses) {
      const p: MarketsListParams = { status: s };
      expect(p.status).toBe(s);
    }
  });
});

describe("OrderbookParams", () => {
  it("all fields are optional", () => {
    const empty: OrderbookParams = {};
    expect(empty).toEqual({});
  });

  it("accepts depth", () => {
    const full: OrderbookParams = { depth: 5 };
    expect(full.depth).toBe(5);
    expectTypeOf<OrderbookParams["depth"]>().toEqualTypeOf<
      number | undefined
    >();
  });
});

describe("TradesParams", () => {
  it("all fields are optional", () => {
    const empty: TradesParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: TradesParams = {
      ticker: "MKT-1",
      min_ts: 1700000000,
      max_ts: 1700100000,
      limit: 50,
      cursor: "abc",
    };
    expect(full.ticker).toBe("MKT-1");
  });
});

describe("BatchCandlesticksParams", () => {
  it("has required fields", () => {
    const params: BatchCandlesticksParams = {
      market_tickers: "TICKER-1,TICKER-2",
      start_ts: 1700000000,
      end_ts: 1700100000,
      period_interval: 60,
    };
    expect(params.market_tickers).toContain("TICKER-1");
  });

  it("include_latest_before_start is optional", () => {
    expectTypeOf<
      BatchCandlesticksParams["include_latest_before_start"]
    >().toEqualTypeOf<boolean | undefined>();
  });

  it("accepts optional field", () => {
    const params: BatchCandlesticksParams = {
      market_tickers: "TICKER-1",
      start_ts: 1700000000,
      end_ts: 1700100000,
      period_interval: 60,
      include_latest_before_start: true,
    };
    expect(params.include_latest_before_start).toBe(true);
  });
});

describe("IncentiveProgramsParams", () => {
  it("all fields are optional", () => {
    const empty: IncentiveProgramsParams = {};
    expect(empty).toEqual({});
  });

  it("enforces status union", () => {
    expectTypeOf<IncentiveProgramsParams["status"]>().toEqualTypeOf<
      "all" | "active" | "upcoming" | "closed" | "paid_out" | undefined
    >();
  });

  it("enforces type union", () => {
    expectTypeOf<IncentiveProgramsParams["type"]>().toEqualTypeOf<
      "all" | "liquidity" | "volume" | undefined
    >();
  });

  it("accepts all fields populated", () => {
    const full: IncentiveProgramsParams = {
      status: "active",
      type: "liquidity",
      limit: 20,
      cursor: "abc",
    };
    expect(full.status).toBe("active");
  });
});
