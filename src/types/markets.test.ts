import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  MveSelectedLeg,
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

describe("MveSelectedLeg", () => {
  it("all fields are optional", () => {
    const leg: MveSelectedLeg = {};
    expect(leg).toEqual({});
    expectTypeOf<MveSelectedLeg["event_ticker"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<MveSelectedLeg["market_ticker"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<MveSelectedLeg["side"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<MveSelectedLeg["yes_settlement_value_dollars"]>().toEqualTypeOf<string | null | undefined>();
  });

  it("accepts fully populated leg", () => {
    const leg: MveSelectedLeg = {
      event_ticker: "EVT-1",
      market_ticker: "MKT-1",
      side: "yes",
      yes_settlement_value_dollars: "1.0000",
    };
    expect(leg.event_ticker).toBe("EVT-1");
    expect(leg.yes_settlement_value_dollars).toBe("1.0000");
  });

  it("yes_settlement_value_dollars accepts null", () => {
    const leg: MveSelectedLeg = { yes_settlement_value_dollars: null };
    expect(leg.yes_settlement_value_dollars).toBeNull();
  });
});

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
    yes_sub_title: "Yes",
    no_sub_title: "No",
    created_time: "2025-01-01T00:00:00Z",
    updated_time: "2025-01-02T00:00:00Z",
    open_time: "2025-01-01T00:00:00Z",
    close_time: "2025-12-31T23:59:59Z",
    latest_expiration_time: "2025-12-31T23:59:59Z",
    settlement_timer_seconds: 3600,
    status: "open",
    yes_bid_dollars: "0.55",
    yes_bid_size_fp: "100.0000",
    yes_ask_dollars: "0.57",
    yes_ask_size_fp: "200.0000",
    no_bid_dollars: "0.43",
    no_ask_dollars: "0.45",
    last_price_dollars: "0.56",
    previous_yes_bid_dollars: "0.54",
    previous_yes_ask_dollars: "0.56",
    previous_price_dollars: "0.55",
    volume_fp: "10000.0000",
    volume_24h_fp: "500.0000",
    open_interest_fp: "5000.0000",
    notional_value_dollars: "1.0000",
    result: "",
    can_close_early: false,
    fractional_trading_enabled: true,
    expiration_value: "",
    rules_primary: "Primary rules",
    rules_secondary: "Secondary rules",
    price_level_structure: "standard",
    price_ranges: [{ start: "0.01", end: "0.99", step: "0.01" }],
  };

  it("enforces market_type union", () => {
    expectTypeOf<Market["market_type"]>().toEqualTypeOf<"binary" | "scalar">();
  });

  it("has all required fields", () => {
    expect(validMarket.ticker).toBe("MKT-1");
    expect(validMarket.price_ranges).toHaveLength(1);
    expect(validMarket.settlement_timer_seconds).toBe(3600);
  });

  it("uses yes_sub_title and no_sub_title (spec field names)", () => {
    expect(validMarket.yes_sub_title).toBe("Yes");
    expect(validMarket.no_sub_title).toBe("No");
    expectTypeOf<Market["yes_sub_title"]>().toBeString();
    expectTypeOf<Market["no_sub_title"]>().toBeString();
  });

  it("updated_time is a required string", () => {
    expectTypeOf<Market["updated_time"]>().toBeString();
    expect(validMarket.updated_time).toBe("2025-01-02T00:00:00Z");
  });

  it("fixed-point size and volume fields are required strings", () => {
    expectTypeOf<Market["yes_bid_size_fp"]>().toBeString();
    expectTypeOf<Market["yes_ask_size_fp"]>().toBeString();
    expectTypeOf<Market["volume_fp"]>().toBeString();
    expectTypeOf<Market["volume_24h_fp"]>().toBeString();
    expectTypeOf<Market["open_interest_fp"]>().toBeString();
    expect(validMarket.volume_fp).toBe("10000.0000");
  });

  it("previous price fields are required strings", () => {
    expectTypeOf<Market["previous_yes_bid_dollars"]>().toBeString();
    expectTypeOf<Market["previous_yes_ask_dollars"]>().toBeString();
    expectTypeOf<Market["previous_price_dollars"]>().toBeString();
    expect(validMarket.previous_price_dollars).toBe("0.55");
  });

  it("constructs scalar market type", () => {
    const scalar: Market = { ...validMarket, market_type: "scalar" };
    expect(scalar.market_type).toBe("scalar");
  });

  it("price_ranges can be empty", () => {
    const m: Market = { ...validMarket, price_ranges: [] };
    expect(m.price_ranges).toHaveLength(0);
  });

  it("optional fields are absent by default", () => {
    expectTypeOf<Market["settlement_value_dollars"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Market["settlement_ts"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Market["mve_selected_legs"]>().toEqualTypeOf<MveSelectedLeg[] | undefined>();
    expectTypeOf<Market["no_bid_size_fp"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Market["no_ask_size_fp"]>().toEqualTypeOf<string | undefined>();
    expect(validMarket.settlement_ts).toBeUndefined();
  });

  it("accepts optional fields populated", () => {
    const m: Market = {
      ...validMarket,
      settlement_ts: "2025-12-31T23:59:59Z",
      settlement_value_dollars: "1.0000",
      mve_selected_legs: [{ event_ticker: "EVT-1", market_ticker: "MKT-1", side: "yes" }],
      no_bid_size_fp: "50.0000",
    };
    expect(m.settlement_ts).toBe("2025-12-31T23:59:59Z");
    expect(m.mve_selected_legs).toHaveLength(1);
    expect(m.no_bid_size_fp).toBe("50.0000");
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
      yes_sub_title: "",
      no_sub_title: "",
      created_time: "",
      updated_time: "",
      open_time: "",
      close_time: "",
      latest_expiration_time: "",
      settlement_timer_seconds: 0,
      status: "",
      yes_bid_dollars: "",
      yes_bid_size_fp: "",
      yes_ask_dollars: "",
      yes_ask_size_fp: "",
      no_bid_dollars: "",
      no_ask_dollars: "",
      last_price_dollars: "",
      previous_yes_bid_dollars: "",
      previous_yes_ask_dollars: "",
      previous_price_dollars: "",
      volume_fp: "",
      volume_24h_fp: "",
      open_interest_fp: "",
      notional_value_dollars: "",
      result: "",
      can_close_early: false,
      fractional_trading_enabled: false,
      expiration_value: "",
      rules_primary: "",
      rules_secondary: "",
      price_level_structure: "",
      price_ranges: [],
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
      orderbook_fp: { yes_dollars: [], no_dollars: [] },
    };
    expect(book.orderbook_fp.yes_dollars).toHaveLength(0);
  });
});

describe("Trade", () => {
  it("enforces taker_side union", () => {
    expectTypeOf<Trade["taker_side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("count_fp is a required string", () => {
    expectTypeOf<Trade["count_fp"]>().toBeString();
  });

  it("constructs full object", () => {
    const trade: Trade = {
      trade_id: "trade-1",
      ticker: "MKT-1",
      yes_price_dollars: "0.55",
      no_price_dollars: "0.45",
      count_fp: "10.0000",
      taker_side: "yes",
      created_time: "2025-01-01T00:00:00Z",
    };
    expect(trade.trade_id).toBe("trade-1");
    expect(trade.count_fp).toBe("10.0000");
  });

  it("constructs with each taker_side variant", () => {
    for (const side of ["yes", "no"] as const) {
      const t: Trade = {
        trade_id: "t-1",
        ticker: "MKT-1",
        yes_price_dollars: "0.55",
        no_price_dollars: "0.45",
        count_fp: "1.0000",
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
  it("has four required non-nullable dollar string fields", () => {
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
  it("all fields are nullable strings", () => {
    expectTypeOf<PriceOHLC["open_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["low_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["high_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["close_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["mean_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["previous_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["min_dollars"]>().toEqualTypeOf<string | null>();
    expectTypeOf<PriceOHLC["max_dollars"]>().toEqualTypeOf<string | null>();
  });

  it("constructs with non-null values", () => {
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
  });

  it("constructs with null values (no-trade period)", () => {
    const ohlc: PriceOHLC = {
      open_dollars: null,
      low_dollars: null,
      high_dollars: null,
      close_dollars: null,
      mean_dollars: null,
      previous_dollars: "0.48",
      min_dollars: null,
      max_dollars: null,
    };
    expect(ohlc.open_dollars).toBeNull();
    expect(ohlc.previous_dollars).toBe("0.48");
  });
});

describe("Candlestick", () => {
  it("has volume_fp and open_interest_fp as required strings", () => {
    expectTypeOf<Candlestick["volume_fp"]>().toBeString();
    expectTypeOf<Candlestick["open_interest_fp"]>().toBeString();
  });

  it("constructs with correct nested structure", () => {
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
      volume_fp: "500.0000",
      open_interest_fp: "1000.0000",
    };
    expect(candle.end_period_ts).toBe(1700000000);
    expect(candle.volume_fp).toBe("500.0000");
    expect(candle.open_interest_fp).toBe("1000.0000");
  });

  it("price accepts null fields (no-trade period)", () => {
    const candle: Candlestick = {
      end_period_ts: 1700000000,
      yes_bid: { open_dollars: "0.50", low_dollars: "0.45", high_dollars: "0.55", close_dollars: "0.52" },
      yes_ask: { open_dollars: "0.51", low_dollars: "0.46", high_dollars: "0.56", close_dollars: "0.53" },
      price: {
        open_dollars: null,
        low_dollars: null,
        high_dollars: null,
        close_dollars: null,
        mean_dollars: null,
        previous_dollars: "0.48",
        min_dollars: null,
        max_dollars: null,
      },
      volume_fp: "0.0000",
      open_interest_fp: "1000.0000",
    };
    expect(candle.price.open_dollars).toBeNull();
    expect(candle.price.previous_dollars).toBe("0.48");
  });
});

describe("MarketCandlesticks", () => {
  it("wraps candlesticks array with ticker", () => {
    const mc: MarketCandlesticks = { market_ticker: "MKT-1", candlesticks: [] };
    expect(mc.market_ticker).toBe("MKT-1");
    expectTypeOf<MarketCandlesticks["candlesticks"]>().toMatchTypeOf<Candlestick[]>();
  });
});

describe("BatchCandlesticksResponse", () => {
  it("wraps MarketCandlesticks array", () => {
    const response: BatchCandlesticksResponse = {
      markets: [{ market_ticker: "MKT-1", candlesticks: [] }],
    };
    expect(response.markets).toHaveLength(1);
  });
});

describe("IncentiveProgram", () => {
  it("market_id and market_ticker are required strings", () => {
    expectTypeOf<IncentiveProgram["market_id"]>().toBeString();
    expectTypeOf<IncentiveProgram["market_ticker"]>().toBeString();
  });

  it("has all required fields", () => {
    const program: IncentiveProgram = {
      id: "inc-1",
      market_id: "market-uuid-1",
      market_ticker: "MKT-1",
      incentive_type: "liquidity",
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      period_reward: 1000,
      paid_out: false,
    };
    expect(program.id).toBe("inc-1");
    expect(program.market_id).toBe("market-uuid-1");
    expect(program.paid_out).toBe(false);
  });

  it("discount_factor_bps and target_size_fp are optional/nullable", () => {
    expectTypeOf<IncentiveProgram["discount_factor_bps"]>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<IncentiveProgram["target_size_fp"]>().toEqualTypeOf<string | null | undefined>();
    const p: IncentiveProgram = {
      id: "inc-1",
      market_id: "uuid",
      market_ticker: "MKT-1",
      incentive_type: "volume",
      start_date: "",
      end_date: "",
      period_reward: 0,
      paid_out: false,
      discount_factor_bps: null,
      target_size_fp: "1000.0000",
    };
    expect(p.discount_factor_bps).toBeNull();
    expect(p.target_size_fp).toBe("1000.0000");
  });

  it("enforces incentive_type union", () => {
    expectTypeOf<IncentiveProgram["incentive_type"]>().toEqualTypeOf<"liquidity" | "volume">();
  });
});

describe("IncentiveProgramsResponse", () => {
  it("wraps programs with next_cursor", () => {
    const response: IncentiveProgramsResponse = {
      incentive_programs: [],
      next_cursor: "cursor-abc",
    };
    expect(response.next_cursor).toBe("cursor-abc");
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
});

describe("OrderbookParams", () => {
  it("all fields are optional", () => {
    const empty: OrderbookParams = {};
    expect(empty).toEqual({});
  });

  it("accepts depth", () => {
    const full: OrderbookParams = { depth: 5 };
    expect(full.depth).toBe(5);
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
    expectTypeOf<BatchCandlesticksParams["include_latest_before_start"]>().toEqualTypeOf<boolean | undefined>();
  });
});

describe("IncentiveProgramsParams", () => {
  it("all fields are optional", () => {
    const empty: IncentiveProgramsParams = {};
    expect(empty).toEqual({});
  });

  it("enforces status and type unions", () => {
    expectTypeOf<IncentiveProgramsParams["status"]>().toEqualTypeOf<
      "all" | "active" | "upcoming" | "closed" | "paid_out" | undefined
    >();
    expectTypeOf<IncentiveProgramsParams["type"]>().toEqualTypeOf<
      "all" | "liquidity" | "volume" | undefined
    >();
  });
});
