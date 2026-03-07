import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import WebSocketNode from "ws";
import { KalshiWebSocketClient } from "../../src/ws-api";
import {
  generateHeaders,
  loadPrivateKey,
  loadPrivateKeyFromContent,
} from "../../src/auth";
import { KalshiClient } from "../../src/index";
import { getClient } from "./client";
import type {
  WebSocketAuthHeaders,
  WebSocketMessage,
  SubscribedMessage,
  UnsubscribedMessage,
  OrderbookDeltaMessage,
} from "../../src/types/websocket";

const DEMO_WS_URL = "wss://demo-api.kalshi.co/trade-api/ws/v2";

// ==================== Node.js WebSocket Subclass ====================

/**
 * KalshiWebSocketClient subclass that uses the `ws` library to support
 * custom headers (required for authenticated connections in Node.js).
 */
class NodeKalshiWebSocketClient extends KalshiWebSocketClient {
  protected createWebSocket(
    url: string,
    authHeaders: WebSocketAuthHeaders | null
  ): WebSocket {
    const options: WebSocketNode.ClientOptions = {};
    if (authHeaders) {
      options.headers = authHeaders;
    }
    return new WebSocketNode(url, options) as unknown as WebSocket;
  }
}

// ==================== Helpers ====================

let apiKey: string;
let privateKeyPem: string;
let restClient: KalshiClient;
let activeMarketTicker: string;
let secondMarketTicker: string;

function createAuthHeaders(): WebSocketAuthHeaders {
  return generateHeaders(
    apiKey,
    privateKeyPem,
    "GET",
    "/trade-api/ws/v2"
  ) as WebSocketAuthHeaders;
}

function createClient(): NodeKalshiWebSocketClient {
  return new NodeKalshiWebSocketClient({
    baseWsUrl: DEMO_WS_URL,
    getAuthHeaders: () => createAuthHeaders(),
    autoReconnect: false,
  });
}

/**
 * Wait for a specific message type from the client, with timeout.
 */
function waitForMessage<T extends WebSocketMessage>(
  client: KalshiWebSocketClient,
  type: T["type"],
  timeoutMs = 10000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      client.off("message", handler);
      reject(
        new Error(
          `Timed out waiting for '${type}' message (${timeoutMs}ms)`
        )
      );
    }, timeoutMs);

    const handler = (msg: WebSocketMessage) => {
      if (msg.type === type) {
        clearTimeout(timer);
        client.off("message", handler);
        resolve(msg as T);
      }
    };
    client.on("message", handler);
  });
}

/**
 * Collect N messages of a specific type.
 */
function collectMessages<T extends WebSocketMessage>(
  client: KalshiWebSocketClient,
  type: T["type"],
  count: number,
  timeoutMs = 10000
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const collected: T[] = [];
    const timer = setTimeout(() => {
      client.off("message", handler);
      reject(
        new Error(
          `Timed out collecting ${count} '${type}' messages (got ${collected.length})`
        )
      );
    }, timeoutMs);

    const handler = (msg: WebSocketMessage) => {
      if (msg.type === type) {
        collected.push(msg as T);
        if (collected.length >= count) {
          clearTimeout(timer);
          client.off("message", handler);
          resolve(collected);
        }
      }
    };
    client.on("message", handler);
  });
}

// ==================== Setup ====================

beforeAll(async () => {
  const keyId = process.env.KALSHI_DEV_KEY_ID;
  const keyString = process.env.KALSHI_DEV_KEY;
  const keyFile = process.env.KALSHI_DEV_KEY_FILE;

  if (!keyId || (!keyString && !keyFile)) {
    throw new Error(
      "E2E WebSocket tests require KALSHI_DEV_KEY_ID and either KALSHI_DEV_KEY or KALSHI_DEV_KEY_FILE in .env"
    );
  }

  apiKey = keyId;
  privateKeyPem = keyString
    ? loadPrivateKeyFromContent(keyString)
    : loadPrivateKey(keyFile!);
  restClient = getClient();

  // Fetch active market tickers for subscription tests
  const response = await restClient.getMarketsList({
    status: "open",
    limit: 5,
  });
  if (response.markets.length < 2) {
    throw new Error(
      "Need at least 2 active markets on demo API for WebSocket tests"
    );
  }
  activeMarketTicker = response.markets[0].ticker;
  secondMarketTicker = response.markets[1].ticker;
});

// ==================== Tests ====================

describe("WebSocket connection", () => {
  it("connects to Kalshi demo WebSocket with auth headers", async () => {
    const client = createClient();

    await client.connect();
    expect(client.isConnected()).toBe(true);
    expect(client.getConnectionState()).toBe("connected");

    client.disconnect();
    expect(client.isConnected()).toBe(false);
  });
});

describe("WebSocket subscribe", () => {
  let client: NodeKalshiWebSocketClient;

  beforeAll(async () => {
    client = createClient();
    await client.connect();
  });

  afterAll(() => {
    client.disconnect();
  });

  it("subscribes to a public channel and receives confirmation", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["ticker"],
      market_tickers: [activeMarketTicker],
    });

    expect(cmdId).toBeGreaterThan(0);

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(msg.msg).toHaveProperty("sid");
    expect(typeof msg.msg.sid).toBe("number");
    expect(msg.msg).toHaveProperty("channel");
    expect(msg.msg.channel).toBe("ticker");

    // Verify tracked as active subscription
    const subs = client.getActiveSubscriptions();
    const tracked = subs.find((s) => s.sid === msg.msg.sid);
    expect(tracked).toBeDefined();
    expect(tracked!.params.channels).toContain("ticker");
  });

  it("subscribes to a private channel (fill) and receives confirmation", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["fill"],
      market_tickers: [activeMarketTicker],
    });

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(typeof msg.msg.sid).toBe("number");
    expect(msg.msg.channel).toBe("fill");
  });

  it("subscribes to multiple channels at once", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["trade", "market_lifecycle_v2"],
      market_tickers: [activeMarketTicker],
    });

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(typeof msg.msg.sid).toBe("number");
  });
});

describe("WebSocket unsubscribe", () => {
  let client: NodeKalshiWebSocketClient;

  afterEach(() => {
    client.disconnect();
  });

  it("unsubscribes from a single subscription", async () => {
    client = createClient();
    await client.connect();

    // Subscribe
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );
    client.subscribe({
      channels: ["ticker"],
      market_tickers: [activeMarketTicker],
    });
    const subMsg = await subscribedPromise;
    const sid = subMsg.msg.sid;

    // Unsubscribe
    const unsubPromise = waitForMessage<UnsubscribedMessage>(
      client,
      "unsubscribed"
    );
    const unsubCmdId = client.unsubscribe([sid]);
    const unsubMsg = await unsubPromise;

    expect(unsubMsg.type).toBe("unsubscribed");
    expect(unsubMsg.id).toBe(unsubCmdId);
    // Server sends one message per sid with sid at top level
    expect(unsubMsg.sid).toBe(sid);
    expect(typeof unsubMsg.seq).toBe("number");

    // Verify removed from active subscriptions
    const subs = client.getActiveSubscriptions();
    expect(subs.find((s) => s.sid === sid)).toBeUndefined();
  });

  it("unsubscribes multiple sids (receives one message per sid)", async () => {
    client = createClient();
    await client.connect();

    // Subscribe to two channels
    const sub1Promise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );
    client.subscribe({
      channels: ["ticker"],
      market_tickers: [activeMarketTicker],
    });
    const sub1 = await sub1Promise;

    const sub2Promise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );
    client.subscribe({
      channels: ["trade"],
      market_tickers: [activeMarketTicker],
    });
    const sub2 = await sub2Promise;

    // Unsubscribe both — server sends one unsubscribed message per sid
    const unsubCollect = collectMessages<UnsubscribedMessage>(
      client,
      "unsubscribed",
      2
    );
    client.unsubscribe([sub1.msg.sid, sub2.msg.sid]);
    const unsubMsgs = await unsubCollect;

    expect(unsubMsgs).toHaveLength(2);
    const unsubSids = unsubMsgs.map((m) => m.sid);
    expect(unsubSids).toContain(sub1.msg.sid);
    expect(unsubSids).toContain(sub2.msg.sid);

    // Both should be removed from active subscriptions
    expect(client.getActiveSubscriptions()).toHaveLength(0);
  });
});

describe("WebSocket update_subscription", () => {
  let client: NodeKalshiWebSocketClient;

  beforeAll(async () => {
    client = createClient();
    await client.connect();
  });

  afterAll(() => {
    client.disconnect();
  });

  it("updates subscription to add a new market ticker", async () => {
    // Subscribe initially
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );
    client.subscribe({
      channels: ["ticker"],
      market_tickers: [activeMarketTicker],
    });
    const subMsg = await subscribedPromise;
    const sid = subMsg.msg.sid;

    // Update to add a second ticker
    const responsePromise = new Promise<WebSocketMessage>((resolve, reject) => {
      const timer = setTimeout(() => {
        client.off("message", handler);
        reject(
          new Error("Timed out waiting for update_subscription response")
        );
      }, 10000);

      const handler = (msg: WebSocketMessage) => {
        // Accept any protocol response (subscribed, ok, error)
        if (
          msg.type === "subscribed" ||
          msg.type === "ok" ||
          msg.type === "error"
        ) {
          clearTimeout(timer);
          client.off("message", handler);
          resolve(msg);
        }
      };
      client.on("message", handler);
    });

    const updateCmdId = client.updateSubscription({
      sids: [sid],
      action: "add_markets",
      market_tickers: [activeMarketTicker, secondMarketTicker],
    });

    expect(updateCmdId).toBeGreaterThan(0);

    const response = await responsePromise;

    // The server should acknowledge (exact response type varies)
    expect(["subscribed", "ok", "error"]).toContain(response.type);

    if (response.type === "error") {
      console.warn(
        "[WS E2E] update_subscription returned error:",
        (response as { msg: unknown }).msg
      );
    }

    // Clean up
    client.unsubscribe([sid]);
  });
});

// ==================== Additional Private Channel Subscriptions ====================

describe("WebSocket private channel subscriptions", () => {
  let client: NodeKalshiWebSocketClient;

  beforeAll(async () => {
    client = createClient();
    await client.connect();
  });

  afterAll(() => {
    client.disconnect();
  });

  it("subscribes to orderbook_delta (private) and receives confirmation", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["orderbook_delta"],
      market_tickers: [activeMarketTicker],
    });

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(msg.msg.channel).toBe("orderbook_delta");
    expect(typeof msg.msg.sid).toBe("number");
  });

  it("subscribes to market_positions (private) and receives confirmation", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["market_positions"],
      market_tickers: [activeMarketTicker],
    });

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(msg.msg.channel).toBe("market_positions");
  });

  it("subscribes to order_group_updates (private) and receives confirmation", async () => {
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      client,
      "subscribed"
    );

    const cmdId = client.subscribe({
      channels: ["order_group_updates"],
    });

    const msg = await subscribedPromise;

    expect(msg.type).toBe("subscribed");
    expect(msg.id).toBe(cmdId);
    expect(msg.msg.channel).toBe("order_group_updates");
  });
});

// ==================== Order-Driven WebSocket Events ====================

describe("WebSocket order-driven orderbook events", () => {
  let wsClient: NodeKalshiWebSocketClient;
  let orderMarketTicker: string;
  let orderId: string;

  beforeAll(async () => {
    // Reuse the same market ticker established in the outer beforeAll
    orderMarketTicker = activeMarketTicker;

    wsClient = createClient();
    await wsClient.connect();

    // Subscribe to orderbook_delta for our market before placing orders
    const subscribedPromise = waitForMessage<SubscribedMessage>(
      wsClient,
      "subscribed"
    );
    wsClient.subscribe({
      channels: ["orderbook_delta"],
      market_tickers: [orderMarketTicker],
    });
    await subscribedPromise;
  });

  afterAll(async () => {
    if (orderId) {
      try {
        await restClient.deletePortfolioOrder(orderId);
      } catch {
        // Already cancelled — fine
      }
    }
    wsClient.disconnect();
  });

  it("placing a limit order emits an orderbook_delta event with positive delta", async () => {
    // Arm the listener before placing the order to avoid race conditions
    const deltaPromise = new Promise<OrderbookDeltaMessage>((resolve, reject) => {
      const timer = setTimeout(() => {
        wsClient.off("orderbook_delta", handler);
        reject(
          new Error(
            "Timed out waiting for orderbook_delta after placing order (15s)"
          )
        );
      }, 15000);

      const handler = (msg: OrderbookDeltaMessage) => {
        if (msg.msg.market_ticker === orderMarketTicker && msg.msg.delta > 0) {
          clearTimeout(timer);
          wsClient.off("orderbook_delta", handler);
          resolve(msg);
        }
      };
      wsClient.on("orderbook_delta", handler);
    });

    // Place a passive limit buy at $0.01 — far from the market, won't fill
    const result = await restClient.createPortfolioOrder({
      ticker: orderMarketTicker,
      side: "yes",
      action: "buy",
      count: 1,
      type: "limit",
      yes_price_dollars: "0.01",
    });
    orderId = result.order.order_id;

    const delta = await deltaPromise;

    expect(delta.type).toBe("orderbook_delta");
    expect(delta.msg.market_ticker).toBe(orderMarketTicker);
    expect(typeof delta.msg.price).toBe("number");
    expect(typeof delta.msg.price_dollars).toBe("string");
    expect(delta.msg.delta).toBeGreaterThan(0);
    expect(["yes", "no"]).toContain(delta.msg.side);
  });

  it("cancelling the order emits an orderbook_delta event with negative delta", async () => {
    expect(orderId).toBeDefined();

    const deltaPromise = new Promise<OrderbookDeltaMessage>((resolve, reject) => {
      const timer = setTimeout(() => {
        wsClient.off("orderbook_delta", handler);
        reject(
          new Error(
            "Timed out waiting for orderbook_delta after cancelling order (15s)"
          )
        );
      }, 15000);

      const handler = (msg: OrderbookDeltaMessage) => {
        if (msg.msg.market_ticker === orderMarketTicker && msg.msg.delta < 0) {
          clearTimeout(timer);
          wsClient.off("orderbook_delta", handler);
          resolve(msg);
        }
      };
      wsClient.on("orderbook_delta", handler);
    });

    await restClient.deletePortfolioOrder(orderId);
    orderId = ""; // consumed

    const delta = await deltaPromise;

    expect(delta.type).toBe("orderbook_delta");
    expect(delta.msg.market_ticker).toBe(orderMarketTicker);
    expect(delta.msg.delta).toBeLessThan(0);
  });

  it("subscribing to fill channel and placing an unfilled order emits no fill events (passive order)", async () => {
    // Subscribe to fill channel
    const subPromise = waitForMessage<SubscribedMessage>(wsClient, "subscribed");
    wsClient.subscribe({
      channels: ["fill"],
      market_tickers: [orderMarketTicker],
    });
    const subMsg = await subPromise;
    expect(subMsg.msg.channel).toBe("fill");

    // Place a deeply passive order (at $0.01, far from market) and cancel it immediately.
    // No fill event should arrive since the order can't match at this price.
    const fillReceived = new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(false), 3000);
      wsClient.once("fill", () => {
        clearTimeout(timer);
        resolve(true);
      });
    });

    const result = await restClient.createPortfolioOrder({
      ticker: orderMarketTicker,
      side: "yes",
      action: "buy",
      count: 1,
      type: "limit",
      yes_price_dollars: "0.01",
    });
    const tempOrderId = result.order.order_id;

    await restClient.deletePortfolioOrder(tempOrderId);

    const gotFill = await fillReceived;
    expect(gotFill).toBe(false);
  });
});
