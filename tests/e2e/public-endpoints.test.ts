import { describe, it, expect, beforeAll } from "vitest";
import { getClient } from "./client";
import { KalshiClient } from "../../src/index";
import type { Market } from "../../src/types";

let client: KalshiClient;

// Shared state populated by earlier tests for use by later ones.
// We fetch an active market once and reuse its ticker throughout.
let activeMarketTicker: string;

beforeAll(async () => {
  client = getClient();

  // Pre-fetch an active market ticker for tests that need one
  const response = await client.getMarketsList({ status: "open", limit: 10 });
  // Prefer a market with some liquidity so orderbook/trades tests are meaningful
  const withLiquidity = response.markets.find(
    (m) => parseFloat(m.liquidity_dollars) > 0
  );
  activeMarketTicker = (withLiquidity ?? response.markets[0]).ticker;
});

// ==================== Exchange ====================

describe("Exchange endpoints", () => {
  it("GET /exchange/status returns active booleans", async () => {
    const status = await client.getExchangeStatus();

    expect(status).toHaveProperty("exchange_active");
    expect(status).toHaveProperty("trading_active");
    expect(typeof status.exchange_active).toBe("boolean");
    expect(typeof status.trading_active).toBe("boolean");
    expect(
      status.exchange_estimated_resume_time === null ||
        typeof status.exchange_estimated_resume_time === "string"
    ).toBe(true);
  });

  it("GET /exchange/announcements returns array", async () => {
    const response = await client.getExchangeAnnouncements();

    expect(response).toHaveProperty("announcements");
    expect(Array.isArray(response.announcements)).toBe(true);

    if (response.announcements.length > 0) {
      const ann = response.announcements[0];
      expect(["info", "warning", "error"]).toContain(ann.type);
      expect(typeof ann.message).toBe("string");
      expect(["active", "inactive"]).toContain(ann.status);
    }
  });

  it("GET /exchange/schedule returns schedule with standard hours", async () => {
    const response = await client.getExchangeSchedule();

    expect(response).toHaveProperty("schedule");
    expect(response.schedule).toHaveProperty("standard_hours");
    expect(response.schedule).toHaveProperty("maintenance_windows");

    // standard_hours is an array of schedule periods, each with day arrays
    const hoursArr = response.schedule.standard_hours as unknown as Array<
      Record<string, unknown>
    >;
    expect(Array.isArray(hoursArr)).toBe(true);
    expect(hoursArr.length).toBeGreaterThan(0);

    const hours = hoursArr[0];
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    for (const day of days) {
      expect(Array.isArray(hours[day])).toBe(true);
    }
  });

  it("GET /exchange/user_data_timestamp returns a timestamp", async () => {
    const response = await client.getExchangeUserDataTimestamp();

    expect(response).toHaveProperty("as_of_time");
    expect(typeof response.as_of_time).toBe("string");
  });
});

// ==================== Series ====================

describe("Series endpoints", () => {
  let firstSeriesTicker: string;

  it("GET /series returns a list of series", async () => {
    const response = await client.getSeriesList();

    expect(response).toHaveProperty("series");
    expect(Array.isArray(response.series)).toBe(true);
    expect(response.series.length).toBeGreaterThan(0);

    const series = response.series[0];
    expect(typeof series.ticker).toBe("string");
    expect(typeof series.title).toBe("string");
    expect(typeof series.category).toBe("string");
    // tags can be null or an array
    expect(series.tags === null || Array.isArray(series.tags)).toBe(true);
    expect(["quadratic", "quadratic_with_maker_fees", "flat"]).toContain(
      series.fee_type
    );

    firstSeriesTicker = series.ticker;
  });

  it("GET /series/:ticker returns a single series", async () => {
    const ticker = firstSeriesTicker || "KXBTC";
    const response = await client.getSeries(ticker);

    expect(response).toHaveProperty("series");
    expect(response.series.ticker).toBe(ticker);
    expect(typeof response.series.title).toBe("string");
  });

  it("GET /series/fee_changes returns fee change array", async () => {
    const response = await client.getSeriesFeeChanges();

    expect(response).toHaveProperty("series_fee_change_arr");
    expect(Array.isArray(response.series_fee_change_arr)).toBe(true);
  });
});

// ==================== Events ====================

describe("Events endpoints", () => {
  let firstEventTicker: string;

  it("GET /events returns paginated events", async () => {
    const response = await client.getEventsList({ limit: 5 });

    expect(response).toHaveProperty("events");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.events)).toBe(true);
    expect(response.events.length).toBeGreaterThan(0);
    expect(response.events.length).toBeLessThanOrEqual(5);

    const event = response.events[0];
    expect(typeof event.event_ticker).toBe("string");
    expect(typeof event.series_ticker).toBe("string");
    expect(typeof event.title).toBe("string");
    expect(typeof event.mutually_exclusive).toBe("boolean");

    firstEventTicker = event.event_ticker;
  });

  it("GET /events supports cursor pagination", async () => {
    const page1 = await client.getEventsList({ limit: 2 });
    expect(page1.events.length).toBeGreaterThan(0);

    if (page1.cursor) {
      const page2 = await client.getEventsList({
        limit: 2,
        cursor: page1.cursor,
      });
      expect(Array.isArray(page2.events)).toBe(true);
      if (page2.events.length > 0) {
        expect(page2.events[0].event_ticker).not.toBe(
          page1.events[0].event_ticker
        );
      }
    }
  });

  it("GET /events/:ticker returns a single event", async () => {
    const ticker = firstEventTicker;
    expect(ticker).toBeDefined();

    const response = await client.getEvent(ticker);

    expect(response).toHaveProperty("event");
    expect(response.event.event_ticker).toBe(ticker);
    expect(typeof response.event.title).toBe("string");
  });

  it("GET /events/:ticker with nested markets includes markets array", async () => {
    const ticker = firstEventTicker;
    const response = await client.getEvent(ticker, {
      with_nested_markets: true,
    });

    expect(response.event).toHaveProperty("markets");
    if (response.event.markets) {
      expect(Array.isArray(response.event.markets)).toBe(true);
    }
  });
});

// ==================== Markets ====================

describe("Markets endpoints", () => {
  it("GET /markets returns paginated markets", async () => {
    const response = await client.getMarketsList({ limit: 5 });

    expect(response).toHaveProperty("markets");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.markets)).toBe(true);
    expect(response.markets.length).toBeGreaterThan(0);

    const market = response.markets[0];
    assertMarketShape(market);
  });

  it("GET /markets filters by status=open returns active markets", async () => {
    const response = await client.getMarketsList({
      status: "open",
      limit: 5,
    });

    expect(response.markets.length).toBeGreaterThan(0);
    for (const market of response.markets) {
      // Status may vary by environment: "open" on demo, "active" on prod.
      expect(["open", "active"]).toContain(market.status);
    }
  });

  it("GET /markets filters by status=closed", async () => {
    const response = await client.getMarketsList({
      status: "closed",
      limit: 3,
    });

    // There may or may not be closed markets at any given time.
    // Status may vary by environment: "closed" on demo, "determined" on prod.
    expect(Array.isArray(response.markets)).toBe(true);
    for (const market of response.markets) {
      expect(["closed", "determined"]).toContain(market.status);
    }
  });

  it("GET /markets filters by status=settled returns finalized markets", async () => {
    const response = await client.getMarketsList({
      status: "settled",
      limit: 3,
    });

    expect(response.markets.length).toBeGreaterThan(0);
    for (const market of response.markets) {
      // Status may vary by environment: "settled" on demo, "finalized" on prod.
      expect(["settled", "finalized"]).toContain(market.status);
    }
  });

  it("GET /markets/:ticker returns a single market", async () => {
    const response = await client.getMarket(activeMarketTicker);

    expect(response).toHaveProperty("market");
    expect(response.market.ticker).toBe(activeMarketTicker);
    assertMarketShape(response.market);
  });

  it("GET /markets/:ticker/orderbook returns orderbook structure", async () => {
    const orderbook = await client.getMarketOrderbook(activeMarketTicker);

    expect(orderbook).toHaveProperty("orderbook_fp");
    expect(orderbook.orderbook_fp).toHaveProperty("yes_dollars");
    expect(orderbook.orderbook_fp).toHaveProperty("no_dollars");

    // yes_dollars and no_dollars can be null (no orders) or array of tuples
    const { yes_dollars, no_dollars } = orderbook.orderbook_fp;
    if (yes_dollars !== null) {
      expect(Array.isArray(yes_dollars)).toBe(true);
      if (yes_dollars.length > 0) {
        const [price, qty] = yes_dollars[0];
        expect(typeof price).toBe("string");
        expect(typeof qty).toBe("string");
      }
    }
    if (no_dollars !== null) {
      expect(Array.isArray(no_dollars)).toBe(true);
    }
  });

  it("GET /markets/:ticker/orderbook respects depth param", async () => {
    const shallow = await client.getMarketOrderbook(activeMarketTicker, {
      depth: 2,
    });

    const { yes_dollars, no_dollars } = shallow.orderbook_fp;
    if (yes_dollars !== null) {
      expect(yes_dollars.length).toBeLessThanOrEqual(2);
    }
    if (no_dollars !== null) {
      expect(no_dollars.length).toBeLessThanOrEqual(2);
    }
  });

  it("GET /markets/trades returns recent trades", async () => {
    const response = await client.getMarketTrades({ limit: 5 });

    expect(response).toHaveProperty("trades");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.trades)).toBe(true);

    if (response.trades.length > 0) {
      const trade = response.trades[0];
      expect(typeof trade.trade_id).toBe("string");
      expect(typeof trade.ticker).toBe("string");
      expect(typeof trade.yes_price_dollars).toBe("string");
      expect(typeof trade.no_price_dollars).toBe("string");
      expect(typeof trade.count).toBe("number");
      expect(["yes", "no"]).toContain(trade.taker_side);
    }
  });

  it("GET /markets/trades filters by ticker", async () => {
    const response = await client.getMarketTrades({
      ticker: activeMarketTicker,
      limit: 5,
    });

    expect(Array.isArray(response.trades)).toBe(true);
    for (const trade of response.trades) {
      expect(trade.ticker).toBe(activeMarketTicker);
    }
  });
});

// ==================== Candlesticks ====================

describe("Candlesticks endpoint", () => {
  it("GET /markets/candlesticks returns OHLC data", async () => {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400;

    const response = await client.getBatchCandlesticks({
      market_tickers: activeMarketTicker,
      start_ts: oneDayAgo,
      end_ts: now,
      period_interval: 60,
    });

    expect(response).toHaveProperty("markets");
    expect(Array.isArray(response.markets)).toBe(true);

    if (response.markets.length > 0) {
      const marketCandles = response.markets[0];
      expect(marketCandles.market_ticker).toBe(activeMarketTicker);
      expect(Array.isArray(marketCandles.candlesticks)).toBe(true);

      if (marketCandles.candlesticks.length > 0) {
        const candle = marketCandles.candlesticks[0];
        expect(typeof candle.end_period_ts).toBe("number");
        expect(typeof candle.volume).toBe("number");
        expect(typeof candle.open_interest).toBe("number");
        expect(candle).toHaveProperty("yes_bid");
        expect(candle).toHaveProperty("yes_ask");
        expect(candle).toHaveProperty("price");
      }
    }
  });
});

// ==================== Incentive Programs ====================

describe("Incentive Programs endpoint", () => {
  it("GET /incentive_programs returns programs list", async () => {
    const response = await client.getIncentivePrograms();

    expect(response).toHaveProperty("incentive_programs");
    expect(Array.isArray(response.incentive_programs)).toBe(true);

    if (response.incentive_programs.length > 0) {
      const program = response.incentive_programs[0];
      expect(typeof program.id).toBe("string");
      expect(typeof program.market_ticker).toBe("string");
      expect(["liquidity", "volume"]).toContain(program.incentive_type);
    }
  });
});

// ==================== Search ====================

describe("Search endpoints", () => {
  it("GET /search/filters_by_sport returns filters structure", async () => {
    const response = await client.getSearchFiltersBySport();

    expect(response).toHaveProperty("filters_by_sports");
    expect(response).toHaveProperty("sport_ordering");
    expect(typeof response.filters_by_sports).toBe("object");
    expect(Array.isArray(response.sport_ordering)).toBe(true);
  });
});

// ==================== Events - Additional ====================

describe("Events - Multivariate & Metadata", () => {
  it("GET /events/multivariate returns multivariate events", async () => {
    try {
      const response = await client.getMultivariateEvents({ limit: 5 });

      expect(response).toHaveProperty("events");
      expect(Array.isArray(response.events)).toBe(true);
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log("Multivariate events endpoint not available (404)");
      } else {
        throw err;
      }
    }
  });

  it("GET /events/:eventTicker/metadata returns metadata object", async () => {
    // Get an event ticker first
    const events = await client.getEventsList({ limit: 1 });
    if (events.events.length === 0) return;

    const eventTicker = events.events[0].event_ticker;

    try {
      const response = await client.getEventMetadata(eventTicker);

      expect(response).toHaveProperty("image_url");
      expect(response).toHaveProperty("market_details");
      expect(response).toHaveProperty("settlement_sources");
      expect(typeof response.image_url).toBe("string");
      expect(Array.isArray(response.market_details)).toBe(true);
      expect(Array.isArray(response.settlement_sources)).toBe(true);
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log("Event metadata endpoint not available (404)");
      } else {
        throw err;
      }
    }
  });
});

// ==================== Milestones ====================

describe("Milestones endpoints", () => {
  it("GET /milestones returns milestones list", async () => {
    try {
      const response = await client.getMilestones({ limit: 5 });

      expect(response).toHaveProperty("milestones");
      expect(Array.isArray(response.milestones)).toBe(true);
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log("Milestones endpoint not available on demo API (404)");
      } else {
        throw err;
      }
    }
  });
});

// ==================== Multivariate Event Collections ====================

describe("Multivariate Event Collections endpoints", () => {
  it("GET /multivariate_event_collections returns collections", async () => {
    try {
      const response = await client.getMultivariateEventCollections({
        limit: 5,
      });

      expect(response).toHaveProperty("multivariate_contracts");
      expect(Array.isArray(response.multivariate_contracts)).toBe(true);
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log("Collections endpoint not available on demo API (404)");
      } else {
        throw err;
      }
    }
  });

  it("GET /multivariate_event_collections/:ticker returns single collection", async () => {
    try {
      // First get a collection ticker
      const collections = await client.getMultivariateEventCollections({
        limit: 1,
      });
      if (!collections.multivariate_contracts || collections.multivariate_contracts.length === 0) {
        console.log("No collections available to test");
        return;
      }

      const ticker = collections.multivariate_contracts[0].collection_ticker;
      const response = await client.getMultivariateEventCollection(ticker);

      expect(response).toHaveProperty("multivariate_contract");
      expect(response.multivariate_contract.collection_ticker).toBe(ticker);
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log(
          "Collection by ticker endpoint not available on demo API (404)"
        );
      } else {
        throw err;
      }
    }
  });

  it("GET /multivariate_event_collections/:ticker/lookup returns lookup history", async () => {
    try {
      // First get a collection ticker
      const collections = await client.getMultivariateEventCollections({
        limit: 1,
      });
      if (!collections.multivariate_contracts || collections.multivariate_contracts.length === 0) {
        console.log("No collections available to test");
        return;
      }

      const ticker = collections.multivariate_contracts[0].collection_ticker;
      const response = await client.getCollectionLookupHistory(ticker, {
        lookback_seconds: 86400, // Last 24 hours
      });

      expect(response).toHaveProperty("lookup_points");
      expect(Array.isArray(response.lookup_points)).toBe(true);
    } catch (err) {
      // May not exist on demo API or fail due to business logic
      const error = err as { message?: string };
      if (error.message?.includes("404") || error.message?.includes("400")) {
        console.log(
          `Collection lookup history endpoint issue: ${error.message?.substring(0, 100)}`
        );
      } else {
        throw err;
      }
    }
  });
});

// ==================== Helpers ====================

function assertMarketShape(market: Market) {
  expect(typeof market.ticker).toBe("string");
  expect(typeof market.event_ticker).toBe("string");
  expect(["binary", "scalar"]).toContain(market.market_type);
  expect(typeof market.title).toBe("string");
  expect(typeof market.status).toBe("string");
  expect(typeof market.volume).toBe("number");
  expect(typeof market.open_interest).toBe("number");
  expect(typeof market.yes_bid_dollars).toBe("string");
  expect(typeof market.yes_ask_dollars).toBe("string");
  expect(typeof market.no_bid_dollars).toBe("string");
  expect(typeof market.no_ask_dollars).toBe("string");
  expect(typeof market.last_price_dollars).toBe("string");
  expect(typeof market.can_close_early).toBe("boolean");
}
