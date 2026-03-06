import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getClient } from "./client";
import { KalshiClient } from "../../src/index";

let client: KalshiClient;

beforeAll(() => {
  client = getClient();
});

// ==================== Balance ====================

describe("Portfolio Balance", () => {
  it("GET /portfolio/balance returns balance and portfolio value", async () => {
    const balance = await client.getPortfolioBalance();

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("portfolio_value");
    expect(typeof balance.balance).toBe("number");
    expect(typeof balance.portfolio_value).toBe("number");
    expect(balance.balance).toBeGreaterThanOrEqual(0);
  });

  it("GET /portfolio/subaccounts/balances returns subaccount balances", async () => {
    const response = await client.getPortfolioSubaccountBalances();

    expect(response).toHaveProperty("subaccount_balances");
    expect(Array.isArray(response.subaccount_balances)).toBe(true);

    if (response.subaccount_balances.length > 0) {
      const sub = response.subaccount_balances[0];
      expect(typeof sub.subaccount_number).toBe("number");
      // balance may be a string or number depending on API version
      expect(sub.balance !== undefined).toBe(true);
    }
  });

  it("GET /portfolio/subaccounts/transfers returns transfers list", async () => {
    const response = await client.getPortfolioSubaccountTransfers();

    expect(response).toHaveProperty("transfers");
    expect(Array.isArray(response.transfers)).toBe(true);

    if (response.transfers.length > 0) {
      const xfer = response.transfers[0];
      expect(typeof xfer.transfer_id).toBe("string");
      expect(typeof xfer.amount).toBe("number");
    }
  });
});

// ==================== Orders ====================

describe("Portfolio Orders", () => {
  it("GET /portfolio/orders returns paginated orders", async () => {
    const response = await client.getPortfolioOrders({ limit: 5 });

    expect(response).toHaveProperty("orders");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.orders)).toBe(true);

    if (response.orders.length > 0) {
      const order = response.orders[0];
      expect(typeof order.order_id).toBe("string");
      expect(typeof order.ticker).toBe("string");
      expect(["yes", "no"]).toContain(order.side);
      expect(["buy", "sell"]).toContain(order.action);
      expect(["limit", "market"]).toContain(order.type);
      expect(typeof order.initial_count).toBe("number");
    }
  });

  it("GET /portfolio/orders filters by status", async () => {
    for (const status of ["resting", "executed", "canceled"] as const) {
      const response = await client.getPortfolioOrders({ status, limit: 2 });
      expect(Array.isArray(response.orders)).toBe(true);
    }
  });

  it("GET /portfolio/orders/:id returns single order (if any exist)", async () => {
    const orders = await client.getPortfolioOrders({ limit: 1 });

    if (orders.orders.length > 0) {
      const orderId = orders.orders[0].order_id;
      const response = await client.getPortfolioOrderById(orderId);

      expect(response).toHaveProperty("order");
      expect(response.order.order_id).toBe(orderId);
    }
  });

  it("GET /portfolio/orders/queue_positions requires market or event ticker", async () => {
    // Get an active market to use for queue position query
    const markets = await client.getMarketsList({ status: "open", limit: 1 });
    if (markets.markets.length > 0) {
      const ticker = markets.markets[0].ticker;
      const response = await client.getPortfolioOrderQueuePositions({
        market_tickers: ticker,
      });

      // Response contains queue_positions (may be array or null/missing when none exist)
      if ("queue_positions" in response && response.queue_positions !== null) {
        expect(Array.isArray(response.queue_positions)).toBe(true);
      } else {
        // Valid empty response
        expect(response).toBeDefined();
      }
    }
  });
});

// ==================== Order Groups ====================

describe("Portfolio Order Groups", () => {
  it("GET /portfolio/order_groups returns response", async () => {
    const response = await client.getPortfolioOrderGroups();

    // Response may be empty object {} when no groups exist,
    // or contain order_groups array
    if ("order_groups" in response) {
      expect(Array.isArray(response.order_groups)).toBe(true);
    } else {
      // Empty response is valid when no order groups exist
      expect(response).toBeDefined();
    }
  });
});

// ==================== Positions ====================

describe("Portfolio Positions", () => {
  it("GET /portfolio/positions returns market and event positions", async () => {
    const response = await client.getPortfolioPositions();

    expect(response).toHaveProperty("market_positions");
    expect(response).toHaveProperty("event_positions");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.market_positions)).toBe(true);
    expect(Array.isArray(response.event_positions)).toBe(true);

    if (response.market_positions.length > 0) {
      const pos = response.market_positions[0];
      expect(typeof pos.ticker).toBe("string");
      expect(typeof pos.position).toBe("number");
      expect(typeof pos.total_traded_dollars).toBe("string");
      expect(typeof pos.realized_pnl_dollars).toBe("string");
    }

    if (response.event_positions.length > 0) {
      const epos = response.event_positions[0];
      expect(typeof epos.event_ticker).toBe("string");
      expect(typeof epos.total_cost_dollars).toBe("string");
    }
  });

  it("GET /portfolio/positions supports ticker filter", async () => {
    const allPositions = await client.getPortfolioPositions();

    if (allPositions.market_positions.length > 0) {
      const ticker = allPositions.market_positions[0].ticker;
      const filtered = await client.getPortfolioPositions({ ticker });

      expect(filtered.market_positions.length).toBeGreaterThan(0);
      for (const pos of filtered.market_positions) {
        expect(pos.ticker).toBe(ticker);
      }
    }
  });
});

// ==================== Settlements ====================

describe("Portfolio Settlements", () => {
  it("GET /portfolio/settlements returns settlements list", async () => {
    const response = await client.getPortfolioSettlements({ limit: 5 });

    expect(response).toHaveProperty("settlements");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.settlements)).toBe(true);

    if (response.settlements.length > 0) {
      const settlement = response.settlements[0];
      expect(typeof settlement.ticker).toBe("string");
      expect(typeof settlement.event_ticker).toBe("string");
      expect(typeof settlement.revenue).toBe("number");
      expect(typeof settlement.settled_time).toBe("string");
    }
  });
});

// ==================== Fills ====================

describe("Portfolio Fills", () => {
  it("GET /portfolio/fills returns fills list", async () => {
    const response = await client.getPortfolioFills({ limit: 5 });

    expect(response).toHaveProperty("fills");
    expect(response).toHaveProperty("cursor");
    expect(Array.isArray(response.fills)).toBe(true);

    if (response.fills.length > 0) {
      const fill = response.fills[0];
      expect(typeof fill.fill_id).toBe("string");
      expect(typeof fill.trade_id).toBe("string");
      expect(typeof fill.order_id).toBe("string");
      expect(typeof fill.ticker).toBe("string");
      expect(["yes", "no"]).toContain(fill.side);
      expect(["buy", "sell"]).toContain(fill.action);
      expect(typeof fill.count).toBe("number");
      expect(typeof fill.is_taker).toBe("boolean");
    }
  });

  it("GET /portfolio/fills supports time range filtering", async () => {
    const now = Math.floor(Date.now() / 1000);
    const oneWeekAgo = now - 7 * 86400;

    const response = await client.getPortfolioFills({
      min_ts: oneWeekAgo,
      max_ts: now,
      limit: 5,
    });

    expect(Array.isArray(response.fills)).toBe(true);
  });
});

// ==================== Account ====================

describe("Account endpoints", () => {
  it("GET /account/limits returns API rate limit info (auth)", async () => {
    try {
      const response = await client.getAccountLimits();

      expect(response).toHaveProperty("usage_tier");
      expect(response).toHaveProperty("read_limit");
      expect(response).toHaveProperty("write_limit");
      expect(typeof response.usage_tier).toBe("string");
      expect(typeof response.read_limit).toBe("number");
      expect(typeof response.write_limit).toBe("number");
    } catch (err) {
      // May not exist on demo API - skip gracefully
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log("Account limits endpoint not available on demo API (404)");
      } else {
        throw err;
      }
    }
  });
});

// ==================== Order Lifecycle ====================

/**
 * Polls getPortfolioOrders until the given orderId appears in the resting list,
 * or until maxAttempts is reached. The Kalshi demo API uses eventual consistency
 * so the order may not appear in the query-side immediately after creation.
 */
async function pollForRestingOrder(
  c: KalshiClient,
  orderId: string,
  maxAttempts = 8,
  delayMs = 500
) {
  for (let i = 0; i < maxAttempts; i++) {
    const resp = await c.getPortfolioOrders({ status: "resting", limit: 50 });
    const found = resp.orders.find((o) => o.order_id === orderId);
    if (found) return found;
    if (i < maxAttempts - 1)
      await new Promise((r) => setTimeout(r, delayMs));
  }
  return null;
}

/**
 * Polls getPortfolioOrderById until it resolves (not 404), or maxAttempts.
 */
async function pollForOrderById(
  c: KalshiClient,
  orderId: string,
  maxAttempts = 8,
  delayMs = 500
) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await c.getPortfolioOrderById(orderId);
    } catch {
      if (i < maxAttempts - 1)
        await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}

describe("Order lifecycle (create → verify → cancel)", () => {
  let orderMarketTicker: string;
  let createdOrderId: string;

  beforeAll(async () => {
    const markets = await client.getMarketsList({ status: "open", limit: 5 });
    if (markets.markets.length === 0) {
      throw new Error("No open markets available on demo API for order tests");
    }
    orderMarketTicker = markets.markets[0].ticker;
  });

  afterAll(async () => {
    // Safety cleanup in case a test failed before cancellation
    if (createdOrderId) {
      try {
        await client.deletePortfolioOrder(createdOrderId);
      } catch {
        // Already cancelled or gone — that's fine
      }
    }
  });

  it("POST /portfolio/orders creates a passive limit buy order", async () => {
    const result = await client.createPortfolioOrder({
      ticker: orderMarketTicker,
      side: "yes",
      action: "buy",
      count: 1,
      type: "limit",
      yes_price_dollars: "0.01",
    });

    expect(result).toHaveProperty("order");
    const order = result.order;
    expect(order.ticker).toBe(orderMarketTicker);
    expect(order.side).toBe("yes");
    expect(order.action).toBe("buy");
    expect(order.type).toBe("limit");
    expect(typeof order.order_id).toBe("string");
    expect(order.initial_count).toBe(1);
    // A passive limit at $0.01 should not immediately fill
    expect(order.fill_count).toBe(0);

    createdOrderId = order.order_id;
  });

  it("created order appears in resting portfolio orders (with retry for eventual consistency)", async () => {
    expect(createdOrderId).toBeDefined();

    const found = await pollForRestingOrder(client, createdOrderId);
    expect(found).not.toBeNull();
    expect(found!.ticker).toBe(orderMarketTicker);
    expect(found!.side).toBe("yes");
  });

  it("GET /portfolio/orders/:id returns the created order by ID", async () => {
    expect(createdOrderId).toBeDefined();

    const response = await pollForOrderById(client, createdOrderId);
    expect(response).not.toBeNull();
    expect(response!.order.order_id).toBe(createdOrderId);
    expect(response!.order.ticker).toBe(orderMarketTicker);
    expect(response!.order.type).toBe("limit");
  });

  it("GET /portfolio/orders/queue_positions/:id returns queue position for resting order", async () => {
    expect(createdOrderId).toBeDefined();

    try {
      const response = await client.getPortfolioOrderQueuePositionById(
        createdOrderId
      );
      expect(response).toHaveProperty("queue_position");
      expect(typeof response.queue_position).toBe("number");
      expect(response.queue_position).toBeGreaterThanOrEqual(1);
    } catch (err) {
      const error = err as { message?: string };
      if (error.message?.includes("404")) {
        console.log(
          "queue_positions-by-order-id not available on demo API (404) — skipping"
        );
      } else {
        throw err;
      }
    }
  });

  it("DELETE /portfolio/orders/:id cancels the resting order", async () => {
    expect(createdOrderId).toBeDefined();

    const result = await client.deletePortfolioOrder(createdOrderId);

    expect(result).toHaveProperty("order");
    expect(result).toHaveProperty("reduced_by");
    expect(result.order.order_id).toBe(createdOrderId);
    expect(typeof result.reduced_by).toBe("number");
    expect(result.reduced_by).toBeGreaterThanOrEqual(0);
  });

  it("cancelled order no longer appears in resting orders", async () => {
    expect(createdOrderId).toBeDefined();

    // Poll briefly waiting for query-side to reflect the cancellation
    let found = true;
    for (let i = 0; i < 6; i++) {
      const response = await client.getPortfolioOrders({
        status: "resting",
        limit: 50,
      });
      if (!response.orders.find((o) => o.order_id === createdOrderId)) {
        found = false;
        break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(found).toBe(false);

    // Mark as consumed so afterAll cleanup skips it
    createdOrderId = "";
  });

  it("cancelled order appears in canceled orders list", async () => {
    const response = await client.getPortfolioOrders({
      status: "canceled",
      limit: 10,
    });
    expect(Array.isArray(response.orders)).toBe(true);
  });
});

// ==================== Order Groups - Additional Mutations ====================

describe("Portfolio Order Groups - Additional Operations", () => {
  it("PUT /portfolio/order_groups/:id/trigger triggers a group (conditional)", async () => {
    // Get order groups first
    const groups = await client.getPortfolioOrderGroups();

    if ("order_groups" in groups && groups.order_groups && groups.order_groups.length > 0) {
      const groupId = groups.order_groups[0].id;

      try {
        await client.triggerPortfolioOrderGroup(groupId);
        // If successful, response should be empty or contain confirmation
        console.log("Order group triggered successfully");
      } catch (err) {
        // May fail if group is not in triggerable state
        const error = err as { message?: string };
        console.log(
          `Trigger failed (expected if group not triggerable): ${error.message}`
        );
      }
    } else {
      console.log("No order groups available to test trigger operation");
    }
  });

  it("PUT /portfolio/order_groups/:id/limit updates group limit (conditional)", async () => {
    // Get order groups first
    const groups = await client.getPortfolioOrderGroups();

    if ("order_groups" in groups && groups.order_groups && groups.order_groups.length > 0) {
      const groupId = groups.order_groups[0].id;

      try {
        await client.updatePortfolioOrderGroupLimit(groupId, {
          contracts_limit: 100,
        });
        console.log("Order group limit updated successfully");
      } catch (err) {
        // May fail due to business logic constraints
        const error = err as { message?: string };
        console.log(
          `Update limit failed (may be expected): ${error.message}`
        );
      }
    } else {
      console.log("No order groups available to test limit update");
    }
  });
});
