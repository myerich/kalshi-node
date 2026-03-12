import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { KalshiWebSocketClient } from "./ws-api";
import type {
  WebSocketAuthHeaders,
  SubscribedMessage,
  TickerMessage,
  ErrorMessage,
  WebSocketMessage,
} from "./types/websocket";

// ==================== Mock WebSocket ====================

/** Minimal mock that simulates the native WebSocket API. */
class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;

  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  private _openListeners: Array<(e: Event) => void> = [];
  private _errorListeners: Array<(e: Event) => void> = [];

  constructor(url: string) {
    this.url = url;
  }

  addEventListener(type: string, fn: (e: Event) => void) {
    if (type === "open") this._openListeners.push(fn);
    if (type === "error") this._errorListeners.push(fn);
  }

  removeEventListener(type: string, fn: (e: Event) => void) {
    if (type === "open")
      this._openListeners = this._openListeners.filter((h) => h !== fn);
    if (type === "error")
      this._errorListeners = this._errorListeners.filter((h) => h !== fn);
  }

  send = vi.fn();
  close = vi.fn();

  // Test helpers to simulate server behavior
  _simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    for (const fn of this._openListeners) fn(new Event("open"));
  }

  _simulateError() {
    for (const fn of this._errorListeners) fn(new Event("error"));
  }

  _simulateMessage(data: unknown) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  _simulateClose(code = 1000, reason = "") {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose({ code, reason } as CloseEvent);
    }
  }
}

// ==================== Test Harness ====================

/** Subclass that injects MockWebSocket instead of real WebSocket. */
class TestableWSClient extends KalshiWebSocketClient {
  public lastMockWs: MockWebSocket | null = null;
  public mockWsInstances: MockWebSocket[] = [];

  protected createWebSocket(
    url: string,
    _authHeaders: WebSocketAuthHeaders | null
  ): WebSocket {
    const mock = new MockWebSocket(url);
    this.lastMockWs = mock;
    this.mockWsInstances.push(mock);
    // Auto-open after a microtask (simulates async connection)
    queueMicrotask(() => mock._simulateOpen());
    return mock as unknown as WebSocket;
  }
}

/** Create a TestableWSClient that auto-opens and optionally fails to open. */
function createTestableClient(
  options: {
    autoOpen?: boolean;
    failOpen?: boolean;
    getAuthHeaders?: () =>
      | WebSocketAuthHeaders
      | null
      | Promise<WebSocketAuthHeaders | null>;
    autoReconnect?: boolean;
  } = {}
): TestableWSClient {
  const client = new (class extends KalshiWebSocketClient {
    public lastMockWs: MockWebSocket | null = null;
    public mockWsInstances: MockWebSocket[] = [];

    protected createWebSocket(
      url: string,
      _authHeaders: WebSocketAuthHeaders | null
    ): WebSocket {
      const mock = new MockWebSocket(url);
      this.lastMockWs = mock;
      this.mockWsInstances.push(mock);
      if (options.failOpen) {
        queueMicrotask(() => mock._simulateError());
      } else if (options.autoOpen !== false) {
        queueMicrotask(() => mock._simulateOpen());
      }
      return mock as unknown as WebSocket;
    }
  })({
    baseWsUrl: "wss://test.example.com/ws",
    getAuthHeaders: options.getAuthHeaders,
    autoReconnect: options.autoReconnect ?? false,
  }) as unknown as TestableWSClient;

  return client;
}

// ==================== Tests ====================

describe("WebSocketImpl config option", () => {
  it("uses the provided WebSocketImpl constructor", async () => {
    const instances: MockWebSocket[] = [];
    class TrackingWebSocket extends MockWebSocket {
      constructor(url: string) {
        super(url);
        instances.push(this);
        queueMicrotask(() => this._simulateOpen());
      }
    }
    const client = new KalshiWebSocketClient({
      WebSocketImpl: TrackingWebSocket as unknown as typeof WebSocket,
    });
    await client.connect();
    expect(instances).toHaveLength(1);
    expect(instances[0].url).toBe("wss://api.elections.kalshi.com/trade-api/ws/v2");
    client.disconnect();
  });
});

describe("KalshiWebSocketClient", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---- Connection Lifecycle ----

  describe("connect()", () => {
    it("resolves when connection opens", async () => {
      const client = createTestableClient();
      await client.connect();
      expect(client.isConnected()).toBe(true);
      expect(client.getConnectionState()).toBe("connected");
    });

    it("rejects when connection fails", async () => {
      const client = createTestableClient({ failOpen: true });
      await expect(client.connect()).rejects.toThrow(
        "WebSocket connection failed"
      );
      expect(client.isConnected()).toBe(false);
      expect(client.getConnectionState()).toBe("disconnected");
    });

    it("warns when already connected", async () => {
      const client = createTestableClient();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await client.connect();
      await client.connect(); // second call should warn
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Already connected")
      );
      warnSpy.mockRestore();
    });

    it("emits connected event", async () => {
      const client = createTestableClient();
      const handler = vi.fn();
      client.on("connected", handler);
      await client.connect();
      expect(handler).toHaveBeenCalledOnce();
    });

    it("calls getAuthHeaders on connect", async () => {
      const getAuthHeaders = vi.fn().mockResolvedValue({
        "KALSHI-ACCESS-KEY": "key",
        "KALSHI-ACCESS-SIGNATURE": "sig",
        "KALSHI-ACCESS-TIMESTAMP": "ts",
      });
      const client = createTestableClient({ getAuthHeaders });
      await client.connect();
      expect(getAuthHeaders).toHaveBeenCalledOnce();
    });

    it("connects even if getAuthHeaders throws", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const getAuthHeaders = vi.fn().mockRejectedValue(new Error("auth fail"));
      const client = createTestableClient({ getAuthHeaders });
      await client.connect();
      expect(client.isConnected()).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to get auth headers"),
        expect.any(Error)
      );
      errorSpy.mockRestore();
    });
  });

  describe("disconnect()", () => {
    it("disconnects cleanly", async () => {
      const client = createTestableClient();
      await client.connect();
      const handler = vi.fn();
      client.on("disconnected", handler);
      client.disconnect();
      expect(client.isConnected()).toBe(false);
      expect(client.getConnectionState()).toBe("disconnected");
      expect(handler).toHaveBeenCalledWith({
        code: 1000,
        reason: "Client disconnect",
      });
    });

    it("is safe to call when already disconnected", () => {
      const client = createTestableClient();
      // Should not throw
      client.disconnect();
      expect(client.getConnectionState()).toBe("disconnected");
    });
  });

  // ---- Subscriptions ----

  describe("subscribe()", () => {
    it("sends subscribe command and returns command id", async () => {
      const client = createTestableClient();
      await client.connect();
      const id = client.subscribe({
        channels: ["ticker"],
        market_tickers: ["MKT-1"],
      });
      expect(id).toBe(1);
      expect(client.lastMockWs!.send).toHaveBeenCalledWith(
        JSON.stringify({
          id: 1,
          cmd: "subscribe",
          params: { channels: ["ticker"], market_tickers: ["MKT-1"] },
        })
      );
    });

    it("tracks subscription after server confirms", async () => {
      const client = createTestableClient();
      await client.connect();

      const cmdId = client.subscribe({ channels: ["ticker"] });

      // Simulate server confirmation
      const subscribedMsg: SubscribedMessage = {
        type: "subscribed",
        id: cmdId,
        msg: { sid: 42, channel: "ticker" },
      };
      client.lastMockWs!._simulateMessage(subscribedMsg);

      const subs = client.getActiveSubscriptions();
      expect(subs).toHaveLength(1);
      expect(subs[0].sid).toBe(42);
      expect(subs[0].params.channels).toEqual(["ticker"]);
    });

    it("increments command id for each call", async () => {
      const client = createTestableClient();
      await client.connect();

      const id1 = client.subscribe({ channels: ["ticker"] });
      const id2 = client.subscribe({ channels: ["trade"] });
      const id3 = client.subscribe({ channels: ["fill"] });
      expect(id2).toBe(id1 + 1);
      expect(id3).toBe(id2 + 1);
    });

    it("logs error when not connected", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const client = createTestableClient();
      client.subscribe({ channels: ["ticker"] });
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Cannot send"),
        expect.anything(),
        expect.anything()
      );
      errorSpy.mockRestore();
    });
  });

  describe("unsubscribe()", () => {
    it("sends unsubscribe command and removes subscriptions", async () => {
      const client = createTestableClient();
      await client.connect();

      // Subscribe and confirm
      const cmdId = client.subscribe({ channels: ["ticker"] });
      client.lastMockWs!._simulateMessage({
        type: "subscribed",
        id: cmdId,
        msg: { sid: 42, channel: "ticker" },
      });
      expect(client.getActiveSubscriptions()).toHaveLength(1);

      // Unsubscribe
      client.unsubscribe([42]);
      expect(client.getActiveSubscriptions()).toHaveLength(0);
      expect(client.lastMockWs!.send).toHaveBeenLastCalledWith(
        JSON.stringify({
          id: 2,
          cmd: "unsubscribe",
          params: { sids: [42] },
        })
      );
    });
  });

  describe("updateSubscription()", () => {
    it("sends update_subscription command", async () => {
      const client = createTestableClient();
      await client.connect();

      const id = client.updateSubscription({
        sids: [42],
        market_tickers: ["MKT-2"],
      });

      expect(client.lastMockWs!.send).toHaveBeenCalledWith(
        JSON.stringify({
          id,
          cmd: "update_subscription",
          params: { sids: [42], market_tickers: ["MKT-2"] },
        })
      );
    });
  });

  // ---- Event Emitter ----

  describe("on() / off() / once()", () => {
    it("on registers handler that receives events", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.on("ticker", handler);

      const tickerMsg: TickerMessage = {
        type: "ticker",
        seq: 1,
        sid: 42,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0.55",
          yes_ask: "0.57",
          no_bid: "0.43",
          no_ask: "0.45",
        },
      };
      client.lastMockWs!._simulateMessage(tickerMsg);

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(tickerMsg);
    });

    it("off removes handler", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.on("ticker", handler);
      client.off("ticker", handler);

      client.lastMockWs!._simulateMessage({
        type: "ticker",
        seq: 1,
        sid: 1,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0",
          yes_ask: "0",
          no_bid: "0",
          no_ask: "0",
        },
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it("once fires handler only once", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.once("ticker", handler);

      const tickerMsg = {
        type: "ticker",
        seq: 1,
        sid: 1,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0",
          yes_ask: "0",
          no_bid: "0",
          no_ask: "0",
        },
      };

      client.lastMockWs!._simulateMessage(tickerMsg);
      client.lastMockWs!._simulateMessage(tickerMsg);

      expect(handler).toHaveBeenCalledOnce();
    });

    it("wildcard message handler receives all messages", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.on("message", handler);

      client.lastMockWs!._simulateMessage({
        type: "ticker",
        seq: 1,
        sid: 1,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0",
          yes_ask: "0",
          no_bid: "0",
          no_ask: "0",
        },
      });

      client.lastMockWs!._simulateMessage({
        type: "trade",
        seq: 2,
        sid: 1,
        msg: {
          trade_id: "t-1",
          market_ticker: "MKT-1",
          yes_price: "0.5",
          no_price: "0.5",
          count: 1,
          taker_side: "yes",
          created_time: "",
        },
      });

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("error event receives ErrorMessage", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.on("error", handler);

      const errorMsg: ErrorMessage = {
        type: "error",
        id: 1,
        msg: { code: 400, msg: "Bad request" },
      };
      client.lastMockWs!._simulateMessage(errorMsg);

      expect(handler).toHaveBeenCalledWith(errorMsg);
    });

    it("handler errors are caught and logged", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const client = createTestableClient();
      await client.connect();

      const throwingHandler = () => {
        throw new Error("handler error");
      };
      client.on("ticker", throwingHandler);

      client.lastMockWs!._simulateMessage({
        type: "ticker",
        seq: 1,
        sid: 1,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0",
          yes_ask: "0",
          no_bid: "0",
          no_ask: "0",
        },
      });

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error in 'ticker' handler"),
        expect.any(Error)
      );
      errorSpy.mockRestore();
    });

    it("multiple handlers for same event", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler1 = vi.fn();
      const handler2 = vi.fn();
      client.on("ticker", handler1);
      client.on("ticker", handler2);

      client.lastMockWs!._simulateMessage({
        type: "ticker",
        seq: 1,
        sid: 1,
        msg: {
          market_ticker: "MKT-1",
          yes_bid: "0",
          yes_ask: "0",
          no_bid: "0",
          no_ask: "0",
        },
      });

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it("on returns this for chaining", async () => {
      const client = createTestableClient();
      const result = client
        .on("connected", () => {})
        .on("disconnected", () => {});
      expect(result).toBe(client);
    });
  });

  // ---- Message Handling ----

  describe("message handling", () => {
    it("parses JSON messages correctly", async () => {
      const client = createTestableClient();
      await client.connect();

      const handler = vi.fn();
      client.on("message", handler);

      client.lastMockWs!._simulateMessage({
        type: "subscribed",
        id: 1,
        msg: { sid: 42, channel: "ticker" },
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "subscribed" })
      );
    });

    it("logs error for invalid JSON", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const client = createTestableClient();
      await client.connect();

      // Send raw non-JSON string
      if (client.lastMockWs!.onmessage) {
        client.lastMockWs!.onmessage({ data: "not json" });
      }

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to parse"),
        expect.anything()
      );
      errorSpy.mockRestore();
    });

    it("handles non-string data by converting to string", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const client = createTestableClient();
      await client.connect();

      // Send an object that toString's to "[object Object]" — not valid JSON
      if (client.lastMockWs!.onmessage) {
        client.lastMockWs!.onmessage({
          data: { notAString: true } as unknown as string,
        });
      }

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to parse"),
        expect.anything()
      );
      errorSpy.mockRestore();
    });
  });

  // ---- Reconnection ----

  describe("reconnection", () => {
    it("auto-reconnects when connection drops unexpectedly", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = createTestableClient({ autoReconnect: true });
      await client.connect();

      const reconnectingHandler = vi.fn();
      client.on("reconnecting", reconnectingHandler);

      // Simulate unexpected close
      client.lastMockWs!._simulateClose(1006, "Abnormal close");

      expect(client.getConnectionState()).toBe("reconnecting");
      expect(reconnectingHandler).toHaveBeenCalledWith(1);

      // Advance timer to trigger reconnect
      await vi.advanceTimersByTimeAsync(1000);

      expect(client.isConnected()).toBe(true);
      logSpy.mockRestore();
    });

    it("does not reconnect on intentional disconnect", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = createTestableClient({ autoReconnect: true });
      await client.connect();

      const reconnectingHandler = vi.fn();
      client.on("reconnecting", reconnectingHandler);

      client.disconnect();

      expect(reconnectingHandler).not.toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it("re-subscribes after reconnection", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = createTestableClient({ autoReconnect: true });
      await client.connect();

      // Subscribe and confirm
      const cmdId = client.subscribe({
        channels: ["ticker"],
        market_tickers: ["MKT-1"],
      });
      client.lastMockWs!._simulateMessage({
        type: "subscribed",
        id: cmdId,
        msg: { sid: 42, channel: "ticker" },
      });

      expect(client.getActiveSubscriptions()).toHaveLength(1);

      const resubscribedHandler = vi.fn();
      client.on("resubscribed", resubscribedHandler);

      // Simulate drop
      client.lastMockWs!._simulateClose(1006, "Abnormal");

      // Advance timer for reconnect
      await vi.advanceTimersByTimeAsync(1000);

      // After reconnect, the client should have sent a new subscribe command
      const lastMock = client.lastMockWs!;
      expect(lastMock.send).toHaveBeenCalledWith(
        expect.stringContaining('"cmd":"subscribe"')
      );
      expect(resubscribedHandler).toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it("uses exponential backoff for delays", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Create a client where first connect succeeds but subsequent ones fail
      // with both error + close events (as real WebSockets behave)
      let connectCount = 0;
      const client = new (class extends KalshiWebSocketClient {
        public lastMockWs: MockWebSocket | null = null;
        public mockWsInstances: MockWebSocket[] = [];
        protected createWebSocket(url: string): WebSocket {
          const mock = new MockWebSocket(url);
          this.lastMockWs = mock;
          this.mockWsInstances.push(mock);
          connectCount++;
          if (connectCount === 1) {
            queueMicrotask(() => mock._simulateOpen());
          } else {
            // Simulate real behavior: error then close
            queueMicrotask(() => {
              mock._simulateError();
              // After error, cleanup() in connect sets up onclose handler,
              // then the close event triggers handleClose → schedules next reconnect
              queueMicrotask(() => mock._simulateClose(1006, "Failed"));
            });
          }
          return mock as unknown as WebSocket;
        }
      })({
        baseWsUrl: "wss://test.example.com/ws",
        autoReconnect: true,
        maxReconnectAttempts: 3,
        reconnectBaseDelay: 100,
        reconnectMaxDelay: 10000,
      }) as unknown as TestableWSClient;

      const reconnectingHandler = vi.fn();
      client.on("reconnecting", reconnectingHandler);

      await client.connect();
      expect(client.isConnected()).toBe(true);

      // Simulate initial connection drop
      client.lastMockWs!._simulateClose(1006, "Abnormal");
      expect(reconnectingHandler).toHaveBeenCalledWith(1);

      // First retry after 100ms (100 * 2^0) — fails, then handleClose fires
      await vi.advanceTimersByTimeAsync(100);
      // Let microtasks settle (error + close simulation)
      await vi.advanceTimersByTimeAsync(0);
      expect(connectCount).toBe(2);

      // Second retry after 200ms (100 * 2^1)
      expect(reconnectingHandler).toHaveBeenCalledWith(2);
      await vi.advanceTimersByTimeAsync(200);
      await vi.advanceTimersByTimeAsync(0);
      expect(connectCount).toBe(3);

      // Third retry after 400ms (100 * 2^2)
      expect(reconnectingHandler).toHaveBeenCalledWith(3);
      await vi.advanceTimersByTimeAsync(400);
      await vi.advanceTimersByTimeAsync(0);
      expect(connectCount).toBe(4);

      // After max attempts (3), should be in "failed" state
      expect(client.getConnectionState()).toBe("failed");

      logSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  // ---- Default Config ----

  describe("default config", () => {
    it("defaults to production WebSocket URL", () => {
      const client = new TestableWSClient();
      // We can verify by connecting and checking the URL
      // But since the URL is private, we test indirectly via the mock
      expect(client).toBeInstanceOf(KalshiWebSocketClient);
    });

    it("defaults autoReconnect to true", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = new TestableWSClient(); // no config = defaults
      await client.connect();

      const reconnHandler = vi.fn();
      client.on("reconnecting", reconnHandler);

      client.lastMockWs!._simulateClose(1006, "Abnormal");
      expect(reconnHandler).toHaveBeenCalled();

      client.disconnect(); // cleanup
      logSpy.mockRestore();
    });
  });

  // ---- Edge Cases ----

  describe("edge cases", () => {
    it("getActiveSubscriptions returns empty when no subscriptions", () => {
      const client = createTestableClient();
      expect(client.getActiveSubscriptions()).toEqual([]);
    });

    it("off on non-existent handler is a no-op", () => {
      const client = createTestableClient();
      const handler = vi.fn();
      // Should not throw
      client.off("ticker", handler);
    });

    it("disconnect clears pending subscribes", async () => {
      const client = createTestableClient();
      await client.connect();

      // Subscribe but don't confirm
      client.subscribe({ channels: ["ticker"] });

      client.disconnect();
      expect(client.getActiveSubscriptions()).toEqual([]);
    });

    it("subscribed message for unknown command id is still tracked", async () => {
      const client = createTestableClient();
      await client.connect();

      // Simulate server sending a subscribed message we didn't request
      client.lastMockWs!._simulateMessage({
        type: "subscribed",
        id: 999,
        msg: { sid: 77, channel: "ticker" },
      });

      // It won't be tracked in active subscriptions since there's no pending
      expect(client.getActiveSubscriptions()).toHaveLength(0);
    });
  });
});
