import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  WebSocketAuthHeaders,
  KalshiWebSocketConfig,
  ConnectionState,
  PublicChannel,
  PrivateChannel,
  Channel,
  SubscribeParams,
  UpdateSubscriptionParams,
  WebSocketCommand,
  SubscribedMessage,
  UnsubscribedMessage,
  ErrorMessage,
  OkMessage,
  TickerMessage,
  TickerV2Message,
  TradeWsMessage,
  OrderbookDeltaMessage,
  OrderbookSnapshotMessage,
  FillWsMessage,
  MarketPositionsWsMessage,
  MarketLifecycleMessage,
  CommunicationsWsMessage,
  OrderGroupUpdatesWsMessage,
  MultivariateWsMessage,
  WebSocketMessage,
  WebSocketEventMap,
  ActiveSubscription,
} from "./websocket";

// ==================== Auth Headers ====================

describe("WebSocketAuthHeaders", () => {
  it("has all three required header fields", () => {
    const headers: WebSocketAuthHeaders = {
      "KALSHI-ACCESS-KEY": "my-key",
      "KALSHI-ACCESS-SIGNATURE": "my-sig",
      "KALSHI-ACCESS-TIMESTAMP": "1700000000",
    };
    expect(headers["KALSHI-ACCESS-KEY"]).toBe("my-key");
    expect(headers["KALSHI-ACCESS-SIGNATURE"]).toBe("my-sig");
    expect(headers["KALSHI-ACCESS-TIMESTAMP"]).toBe("1700000000");
  });

  it("enforces string types for all fields", () => {
    expectTypeOf<WebSocketAuthHeaders["KALSHI-ACCESS-KEY"]>().toBeString();
    expectTypeOf<WebSocketAuthHeaders["KALSHI-ACCESS-SIGNATURE"]>().toBeString();
    expectTypeOf<WebSocketAuthHeaders["KALSHI-ACCESS-TIMESTAMP"]>().toBeString();
  });
});

// ==================== Config ====================

describe("KalshiWebSocketConfig", () => {
  it("all fields are optional", () => {
    const empty: KalshiWebSocketConfig = {};
    expect(empty).toEqual({});
  });

  it("accepts baseWsUrl", () => {
    const config: KalshiWebSocketConfig = {
      baseWsUrl: "wss://demo-api.kalshi.co/trade-api/ws/v2",
    };
    expect(config.baseWsUrl).toContain("demo-api");
  });

  it("accepts sync getAuthHeaders", () => {
    const config: KalshiWebSocketConfig = {
      getAuthHeaders: () => ({
        "KALSHI-ACCESS-KEY": "k",
        "KALSHI-ACCESS-SIGNATURE": "s",
        "KALSHI-ACCESS-TIMESTAMP": "t",
      }),
    };
    expect(config.getAuthHeaders).toBeDefined();
    const result = config.getAuthHeaders!();
    expect(result).toHaveProperty("KALSHI-ACCESS-KEY");
  });

  it("accepts async getAuthHeaders", async () => {
    const config: KalshiWebSocketConfig = {
      getAuthHeaders: async () => ({
        "KALSHI-ACCESS-KEY": "k",
        "KALSHI-ACCESS-SIGNATURE": "s",
        "KALSHI-ACCESS-TIMESTAMP": "t",
      }),
    };
    const result = await config.getAuthHeaders!();
    expect(result).toHaveProperty("KALSHI-ACCESS-KEY");
  });

  it("getAuthHeaders can return null", () => {
    const config: KalshiWebSocketConfig = {
      getAuthHeaders: () => null,
    };
    expect(config.getAuthHeaders!()).toBeNull();
  });

  it("accepts reconnect settings", () => {
    const config: KalshiWebSocketConfig = {
      autoReconnect: false,
      maxReconnectAttempts: 5,
      reconnectBaseDelay: 500,
      reconnectMaxDelay: 30000,
    };
    expect(config.autoReconnect).toBe(false);
    expect(config.maxReconnectAttempts).toBe(5);
    expect(config.reconnectBaseDelay).toBe(500);
    expect(config.reconnectMaxDelay).toBe(30000);
  });

  it("enforces optional types", () => {
    expectTypeOf<KalshiWebSocketConfig["baseWsUrl"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<KalshiWebSocketConfig["autoReconnect"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<KalshiWebSocketConfig["maxReconnectAttempts"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<KalshiWebSocketConfig["reconnectBaseDelay"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<KalshiWebSocketConfig["reconnectMaxDelay"]>().toEqualTypeOf<
      number | undefined
    >();
  });
});

// ==================== Connection State ====================

describe("ConnectionState", () => {
  it("accepts all valid states", () => {
    const states: ConnectionState[] = [
      "disconnected",
      "connecting",
      "connected",
      "reconnecting",
      "failed",
    ];
    expect(states).toHaveLength(5);
    for (const s of states) {
      expectTypeOf(s).toEqualTypeOf<ConnectionState>();
    }
  });
});

// ==================== Channel Types ====================

describe("Channel types", () => {
  it("PublicChannel includes all 5 public channels", () => {
    const channels: PublicChannel[] = [
      "ticker",
      "ticker_v2",
      "trade",
      "market_lifecycle_v2",
      "multivariate",
    ];
    expect(channels).toHaveLength(5);
  });

  it("PrivateChannel includes all 6 private channels", () => {
    const channels: PrivateChannel[] = [
      "orderbook_delta",
      "orderbook_snapshot",
      "fill",
      "market_positions",
      "communications",
      "order_group_updates",
    ];
    expect(channels).toHaveLength(6);
  });

  it("Channel is union of PublicChannel and PrivateChannel", () => {
    const pub: PublicChannel = "ticker";
    const priv: PrivateChannel = "fill";
    const ch1: Channel = pub;
    const ch2: Channel = priv;
    expect(ch1).toBe("ticker");
    expect(ch2).toBe("fill");
  });
});

// ==================== Commands ====================

describe("SubscribeParams", () => {
  it("requires channels array", () => {
    const params: SubscribeParams = {
      channels: ["ticker", "trade"],
    };
    expect(params.channels).toHaveLength(2);
  });

  it("optional ticker fields", () => {
    expectTypeOf<SubscribeParams["market_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<SubscribeParams["event_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<SubscribeParams["series_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
  });

  it("accepts all fields", () => {
    const params: SubscribeParams = {
      channels: ["ticker_v2"],
      market_tickers: ["MKT-1", "MKT-2"],
      event_tickers: ["EVT-1"],
      series_tickers: ["SERIES-1"],
    };
    expect(params.market_tickers).toHaveLength(2);
  });

  it("accepts private channels", () => {
    const params: SubscribeParams = {
      channels: ["orderbook_delta", "fill", "market_positions"],
      market_tickers: ["MKT-1"],
    };
    expect(params.channels).toHaveLength(3);
  });

  it("accepts mix of public and private channels", () => {
    const params: SubscribeParams = {
      channels: ["ticker", "fill"],
    };
    expect(params.channels).toContain("ticker");
    expect(params.channels).toContain("fill");
  });
});

describe("UpdateSubscriptionParams", () => {
  it("requires sids array", () => {
    const params: UpdateSubscriptionParams = {
      sids: [1, 2, 3],
    };
    expect(params.sids).toHaveLength(3);
  });

  it("optional ticker fields", () => {
    expectTypeOf<UpdateSubscriptionParams["market_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<UpdateSubscriptionParams["event_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<UpdateSubscriptionParams["series_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
  });

  it("accepts all fields", () => {
    const params: UpdateSubscriptionParams = {
      sids: [42],
      market_tickers: ["MKT-1"],
      event_tickers: ["EVT-1"],
      series_tickers: ["SERIES-1"],
    };
    expect(params.sids).toEqual([42]);
  });
});

describe("WebSocketCommand", () => {
  it("enforces cmd union", () => {
    expectTypeOf<WebSocketCommand["cmd"]>().toEqualTypeOf<
      "subscribe" | "unsubscribe" | "update_subscription"
    >();
  });

  it("constructs subscribe command", () => {
    const cmd: WebSocketCommand = {
      id: 1,
      cmd: "subscribe",
      params: { channels: ["ticker"], market_tickers: ["MKT-1"] },
    };
    expect(cmd.cmd).toBe("subscribe");
    expect(cmd.id).toBe(1);
  });

  it("constructs unsubscribe command", () => {
    const cmd: WebSocketCommand = {
      id: 2,
      cmd: "unsubscribe",
      params: { sids: [1, 2] },
    };
    expect(cmd.cmd).toBe("unsubscribe");
  });

  it("constructs update_subscription command", () => {
    const cmd: WebSocketCommand = {
      id: 3,
      cmd: "update_subscription",
      params: { sids: [1], market_tickers: ["MKT-2"] },
    };
    expect(cmd.cmd).toBe("update_subscription");
  });

  it("id is a number", () => {
    expectTypeOf<WebSocketCommand["id"]>().toBeNumber();
  });

  it("params is a Record<string, unknown>", () => {
    expectTypeOf<WebSocketCommand["params"]>().toEqualTypeOf<
      Record<string, unknown>
    >();
  });
});

// ==================== Server Messages ====================

describe("SubscribedMessage", () => {
  it("has correct structure", () => {
    const msg: SubscribedMessage = {
      type: "subscribed",
      id: 1,
      msg: { sid: 42, channel: "ticker" },
    };
    expect(msg.type).toBe("subscribed");
    expect(msg.msg.sid).toBe(42);
    expect(msg.msg.channel).toBe("ticker");
  });

  it("type is literal 'subscribed'", () => {
    expectTypeOf<SubscribedMessage["type"]>().toEqualTypeOf<"subscribed">();
  });

  it("channel accepts private channels", () => {
    const msg: SubscribedMessage = {
      type: "subscribed",
      id: 1,
      msg: { sid: 1, channel: "fill" },
    };
    expect(msg.msg.channel).toBe("fill");
  });
});

describe("UnsubscribedMessage", () => {
  it("has correct structure (one message per sid)", () => {
    const msg: UnsubscribedMessage = {
      type: "unsubscribed",
      id: 3,
      sid: 42,
      seq: 1,
    };
    expect(msg.type).toBe("unsubscribed");
    expect(msg.sid).toBe(42);
    expect(msg.seq).toBe(1);
  });

  it("type is literal 'unsubscribed'", () => {
    expectTypeOf<UnsubscribedMessage["type"]>().toEqualTypeOf<"unsubscribed">();
  });

  it("sid and seq are numbers", () => {
    expectTypeOf<UnsubscribedMessage["sid"]>().toBeNumber();
    expectTypeOf<UnsubscribedMessage["seq"]>().toBeNumber();
  });
});

describe("ErrorMessage", () => {
  it("has correct structure", () => {
    const msg: ErrorMessage = {
      type: "error",
      id: 1,
      msg: { code: 400, msg: "Bad request" },
    };
    expect(msg.type).toBe("error");
    expect(msg.msg.code).toBe(400);
    expect(msg.msg.msg).toBe("Bad request");
  });

  it("id is optional", () => {
    expectTypeOf<ErrorMessage["id"]>().toEqualTypeOf<number | undefined>();
    const msg: ErrorMessage = {
      type: "error",
      msg: { code: 500, msg: "Internal error" },
    };
    expect(msg.id).toBeUndefined();
  });
});

describe("OkMessage", () => {
  it("has correct structure", () => {
    const msg: OkMessage = {
      type: "ok",
      id: 4,
      sid: 3,
      msg: { market_tickers: ["MKT-1"] },
    };
    expect(msg.type).toBe("ok");
    expect(msg.id).toBe(4);
    expect(msg.sid).toBe(3);
  });

  it("type is literal 'ok'", () => {
    expectTypeOf<OkMessage["type"]>().toEqualTypeOf<"ok">();
  });

  it("msg is Record<string, unknown>", () => {
    expectTypeOf<OkMessage["msg"]>().toEqualTypeOf<Record<string, unknown>>();
  });
});

describe("TickerMessage", () => {
  it("has correct structure", () => {
    const msg: TickerMessage = {
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
    expect(msg.type).toBe("ticker");
    expect(msg.seq).toBe(1);
    expect(msg.msg.market_ticker).toBe("MKT-1");
    expect(msg.msg.yes_bid).toBe("0.55");
  });

  it("type is literal 'ticker'", () => {
    expectTypeOf<TickerMessage["type"]>().toEqualTypeOf<"ticker">();
  });

  it("all price fields are strings", () => {
    expectTypeOf<TickerMessage["msg"]["yes_bid"]>().toBeString();
    expectTypeOf<TickerMessage["msg"]["yes_ask"]>().toBeString();
    expectTypeOf<TickerMessage["msg"]["no_bid"]>().toBeString();
    expectTypeOf<TickerMessage["msg"]["no_ask"]>().toBeString();
  });
});

describe("TickerV2Message", () => {
  it("has correct structure with additional fields", () => {
    const msg: TickerV2Message = {
      type: "ticker_v2",
      seq: 10,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        yes_bid: "0.55",
        yes_ask: "0.57",
        no_bid: "0.43",
        no_ask: "0.45",
        last_price: "0.56",
        volume: 1000,
        open_interest: 500,
      },
    };
    expect(msg.type).toBe("ticker_v2");
    expect(msg.msg.last_price).toBe("0.56");
    expect(msg.msg.volume).toBe(1000);
    expect(msg.msg.open_interest).toBe(500);
  });

  it("type is literal 'ticker_v2'", () => {
    expectTypeOf<TickerV2Message["type"]>().toEqualTypeOf<"ticker_v2">();
  });

  it("volume and open_interest are numbers", () => {
    expectTypeOf<TickerV2Message["msg"]["volume"]>().toBeNumber();
    expectTypeOf<TickerV2Message["msg"]["open_interest"]>().toBeNumber();
  });
});

describe("TradeWsMessage", () => {
  it("has correct structure", () => {
    const msg: TradeWsMessage = {
      type: "trade",
      seq: 5,
      sid: 42,
      msg: {
        trade_id: "t-1",
        market_ticker: "MKT-1",
        yes_price: "0.55",
        no_price: "0.45",
        count: 10,
        taker_side: "yes",
        created_time: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("trade");
    expect(msg.msg.trade_id).toBe("t-1");
    expect(msg.msg.count).toBe(10);
  });

  it("enforces taker_side union", () => {
    expectTypeOf<TradeWsMessage["msg"]["taker_side"]>().toEqualTypeOf<
      "yes" | "no"
    >();
  });

  it("constructs with each taker_side variant", () => {
    for (const side of ["yes", "no"] as const) {
      const msg: TradeWsMessage = {
        type: "trade",
        seq: 1,
        sid: 1,
        msg: {
          trade_id: "",
          market_ticker: "",
          yes_price: "",
          no_price: "",
          count: 0,
          taker_side: side,
          created_time: "",
        },
      };
      expect(msg.msg.taker_side).toBe(side);
    }
  });
});

describe("OrderbookDeltaMessage", () => {
  it("has correct structure", () => {
    const msg: OrderbookDeltaMessage = {
      type: "orderbook_delta",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        price: 55,
        price_dollars: "0.55",
        delta: 100,
        side: "yes",
      },
    };
    expect(msg.type).toBe("orderbook_delta");
    expect(msg.msg.price).toBe(55);
    expect(msg.msg.price_dollars).toBe("0.55");
    expect(msg.msg.delta).toBe(100);
  });

  it("enforces side union", () => {
    expectTypeOf<OrderbookDeltaMessage["msg"]["side"]>().toEqualTypeOf<
      "yes" | "no"
    >();
  });

  it("client_order_id is optional", () => {
    expectTypeOf<
      OrderbookDeltaMessage["msg"]["client_order_id"]
    >().toEqualTypeOf<string | undefined>();
  });

  it("delta can be negative", () => {
    const msg: OrderbookDeltaMessage = {
      type: "orderbook_delta",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        price: 55,
        price_dollars: "0.55",
        delta: -50,
        side: "no",
      },
    };
    expect(msg.msg.delta).toBe(-50);
  });
});

describe("OrderbookSnapshotMessage", () => {
  it("has correct structure", () => {
    const msg: OrderbookSnapshotMessage = {
      type: "orderbook_snapshot",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        yes: [
          [55, 100],
          [54, 200],
        ],
        no: [
          [45, 100],
          [46, 150],
        ],
        yes_dollars: [
          ["0.55", 100],
          ["0.54", 200],
        ],
        no_dollars: [
          ["0.45", 100],
          ["0.46", 150],
        ],
      },
    };
    expect(msg.type).toBe("orderbook_snapshot");
    expect(msg.msg.yes).toHaveLength(2);
    expect(msg.msg.yes[0]).toEqual([55, 100]);
    expect(msg.msg.yes_dollars).toHaveLength(2);
    expect(msg.msg.yes_dollars[0]).toEqual(["0.55", 100]);
    expect(msg.msg.no_dollars).toHaveLength(2);
  });

  it("yes/no are [number, number] tuples (cents)", () => {
    expectTypeOf<OrderbookSnapshotMessage["msg"]["yes"]>().toEqualTypeOf<
      [number, number][]
    >();
    expectTypeOf<OrderbookSnapshotMessage["msg"]["no"]>().toEqualTypeOf<
      [number, number][]
    >();
  });

  it("yes_dollars/no_dollars are [string, number] tuples", () => {
    expectTypeOf<OrderbookSnapshotMessage["msg"]["yes_dollars"]>().toEqualTypeOf<
      [string, number][]
    >();
    expectTypeOf<OrderbookSnapshotMessage["msg"]["no_dollars"]>().toEqualTypeOf<
      [string, number][]
    >();
  });

  it("accepts empty orderbook", () => {
    const msg: OrderbookSnapshotMessage = {
      type: "orderbook_snapshot",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        yes: [],
        no: [],
        yes_dollars: [],
        no_dollars: [],
      },
    };
    expect(msg.msg.yes).toHaveLength(0);
    expect(msg.msg.yes_dollars).toHaveLength(0);
  });
});

describe("FillWsMessage", () => {
  it("has correct structure", () => {
    const msg: FillWsMessage = {
      type: "fill",
      seq: 1,
      sid: 42,
      msg: {
        fill_id: "f-1",
        order_id: "o-1",
        market_ticker: "MKT-1",
        side: "yes",
        action: "buy",
        count: 5,
        yes_price: "0.55",
        no_price: "0.45",
        is_taker: true,
        created_time: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("fill");
    expect(msg.msg.fill_id).toBe("f-1");
    expect(msg.msg.is_taker).toBe(true);
  });

  it("enforces side union", () => {
    expectTypeOf<FillWsMessage["msg"]["side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("enforces action union", () => {
    expectTypeOf<FillWsMessage["msg"]["action"]>().toEqualTypeOf<
      "buy" | "sell"
    >();
  });

  it("is_taker is boolean", () => {
    expectTypeOf<FillWsMessage["msg"]["is_taker"]>().toBeBoolean();
  });
});

describe("MarketPositionsWsMessage", () => {
  it("has correct structure", () => {
    const msg: MarketPositionsWsMessage = {
      type: "market_positions",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        position: 10,
        market_exposure_cents: 5000,
        realized_pnl_cents: 250,
        fees_paid_cents: 50,
      },
    };
    expect(msg.type).toBe("market_positions");
    expect(msg.msg.position).toBe(10);
    expect(msg.msg.market_exposure_cents).toBe(5000);
  });

  it("all numeric fields are numbers", () => {
    expectTypeOf<MarketPositionsWsMessage["msg"]["position"]>().toBeNumber();
    expectTypeOf<
      MarketPositionsWsMessage["msg"]["market_exposure_cents"]
    >().toBeNumber();
    expectTypeOf<
      MarketPositionsWsMessage["msg"]["realized_pnl_cents"]
    >().toBeNumber();
    expectTypeOf<
      MarketPositionsWsMessage["msg"]["fees_paid_cents"]
    >().toBeNumber();
  });

  it("position can be negative", () => {
    const msg: MarketPositionsWsMessage = {
      type: "market_positions",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        position: -5,
        market_exposure_cents: 0,
        realized_pnl_cents: -100,
        fees_paid_cents: 10,
      },
    };
    expect(msg.msg.position).toBe(-5);
    expect(msg.msg.realized_pnl_cents).toBe(-100);
  });
});

describe("MarketLifecycleMessage", () => {
  it("has correct structure", () => {
    const msg: MarketLifecycleMessage = {
      type: "market_lifecycle_v2",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        old_status: "open",
        new_status: "closed",
        timestamp: "2025-06-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("market_lifecycle_v2");
    expect(msg.msg.old_status).toBe("open");
    expect(msg.msg.new_status).toBe("closed");
  });

  it("all msg fields are strings", () => {
    expectTypeOf<
      MarketLifecycleMessage["msg"]["market_ticker"]
    >().toBeString();
    expectTypeOf<MarketLifecycleMessage["msg"]["old_status"]>().toBeString();
    expectTypeOf<MarketLifecycleMessage["msg"]["new_status"]>().toBeString();
    expectTypeOf<MarketLifecycleMessage["msg"]["timestamp"]>().toBeString();
  });
});

describe("CommunicationsWsMessage", () => {
  it("has correct structure", () => {
    const msg: CommunicationsWsMessage = {
      type: "communications",
      seq: 1,
      sid: 42,
      msg: {
        message_id: "msg-1",
        title: "Important Notice",
        body: "Exchange closing early today.",
        created_time: "2025-01-01T00:00:00Z",
        priority: "high",
      },
    };
    expect(msg.type).toBe("communications");
    expect(msg.msg.message_id).toBe("msg-1");
    expect(msg.msg.priority).toBe("high");
  });

  it("enforces priority union", () => {
    expectTypeOf<CommunicationsWsMessage["msg"]["priority"]>().toEqualTypeOf<
      "low" | "medium" | "high"
    >();
  });

  it("constructs with each priority variant", () => {
    for (const priority of ["low", "medium", "high"] as const) {
      const msg: CommunicationsWsMessage = {
        type: "communications",
        seq: 1,
        sid: 1,
        msg: {
          message_id: "",
          title: "",
          body: "",
          created_time: "",
          priority,
        },
      };
      expect(msg.msg.priority).toBe(priority);
    }
  });
});

describe("OrderGroupUpdatesWsMessage", () => {
  it("has correct structure", () => {
    const msg: OrderGroupUpdatesWsMessage = {
      type: "order_group_updates",
      seq: 1,
      sid: 42,
      msg: {
        order_group_id: "grp-1",
        status: "triggered",
      },
    };
    expect(msg.type).toBe("order_group_updates");
    expect(msg.msg.order_group_id).toBe("grp-1");
    expect(msg.msg.status).toBe("triggered");
  });

  it("status is a string (not union-restricted)", () => {
    expectTypeOf<
      OrderGroupUpdatesWsMessage["msg"]["status"]
    >().toBeString();
  });
});

describe("MultivariateWsMessage", () => {
  it("has correct structure", () => {
    const msg: MultivariateWsMessage = {
      type: "multivariate",
      seq: 1,
      sid: 42,
      msg: { some_key: "some_value", nested: { deep: true } },
    };
    expect(msg.type).toBe("multivariate");
    expect(msg.msg).toHaveProperty("some_key");
  });

  it("msg is Record<string, unknown>", () => {
    expectTypeOf<MultivariateWsMessage["msg"]>().toEqualTypeOf<
      Record<string, unknown>
    >();
  });

  it("accepts empty msg", () => {
    const msg: MultivariateWsMessage = {
      type: "multivariate",
      seq: 1,
      sid: 1,
      msg: {},
    };
    expect(Object.keys(msg.msg)).toHaveLength(0);
  });
});

// ==================== WebSocketMessage Union ====================

describe("WebSocketMessage", () => {
  it("accepts SubscribedMessage", () => {
    const msg: WebSocketMessage = {
      type: "subscribed",
      id: 1,
      msg: { sid: 1, channel: "ticker" },
    };
    expect(msg.type).toBe("subscribed");
  });

  it("accepts ErrorMessage", () => {
    const msg: WebSocketMessage = {
      type: "error",
      msg: { code: 404, msg: "Not found" },
    };
    expect(msg.type).toBe("error");
  });

  it("accepts TickerMessage", () => {
    const msg: WebSocketMessage = {
      type: "ticker",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        yes_bid: "0.5",
        yes_ask: "0.6",
        no_bid: "0.4",
        no_ask: "0.5",
      },
    };
    expect(msg.type).toBe("ticker");
  });

  it("accepts all 15 message types in the union", () => {
    const types: WebSocketMessage["type"][] = [
      "subscribed",
      "unsubscribed",
      "error",
      "ok",
      "ticker",
      "ticker_v2",
      "trade",
      "orderbook_delta",
      "orderbook_snapshot",
      "fill",
      "market_positions",
      "market_lifecycle_v2",
      "communications",
      "order_group_updates",
      "multivariate",
    ];
    expect(types).toHaveLength(15);
  });

  it("can discriminate on type field", () => {
    const msg: WebSocketMessage = {
      type: "trade",
      seq: 1,
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
    };
    if (msg.type === "trade") {
      expect(msg.msg.trade_id).toBe("t-1");
    }
  });
});

// ==================== Event Handler Map ====================

describe("WebSocketEventMap", () => {
  it("has connection lifecycle events", () => {
    expectTypeOf<WebSocketEventMap["connected"]>().toEqualTypeOf<() => void>();
    expectTypeOf<WebSocketEventMap["disconnected"]>().toEqualTypeOf<
      (event: { code: number; reason: string }) => void
    >();
    expectTypeOf<WebSocketEventMap["reconnecting"]>().toEqualTypeOf<
      (attempt: number) => void
    >();
    expectTypeOf<WebSocketEventMap["resubscribed"]>().toEqualTypeOf<
      () => void
    >();
  });

  it("has protocol events", () => {
    expectTypeOf<WebSocketEventMap["subscribed"]>().toEqualTypeOf<
      (msg: SubscribedMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["unsubscribed"]>().toEqualTypeOf<
      (msg: UnsubscribedMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["error"]>().toEqualTypeOf<
      (msg: ErrorMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["ok"]>().toEqualTypeOf<
      (msg: OkMessage) => void
    >();
  });

  it("has public channel data events", () => {
    expectTypeOf<WebSocketEventMap["ticker"]>().toEqualTypeOf<
      (msg: TickerMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["ticker_v2"]>().toEqualTypeOf<
      (msg: TickerV2Message) => void
    >();
    expectTypeOf<WebSocketEventMap["trade"]>().toEqualTypeOf<
      (msg: TradeWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["market_lifecycle_v2"]>().toEqualTypeOf<
      (msg: MarketLifecycleMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["multivariate"]>().toEqualTypeOf<
      (msg: MultivariateWsMessage) => void
    >();
  });

  it("has private channel data events", () => {
    expectTypeOf<WebSocketEventMap["orderbook_delta"]>().toEqualTypeOf<
      (msg: OrderbookDeltaMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["orderbook_snapshot"]>().toEqualTypeOf<
      (msg: OrderbookSnapshotMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["fill"]>().toEqualTypeOf<
      (msg: FillWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["market_positions"]>().toEqualTypeOf<
      (msg: MarketPositionsWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["communications"]>().toEqualTypeOf<
      (msg: CommunicationsWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["order_group_updates"]>().toEqualTypeOf<
      (msg: OrderGroupUpdatesWsMessage) => void
    >();
  });

  it("has wildcard message event", () => {
    expectTypeOf<WebSocketEventMap["message"]>().toEqualTypeOf<
      (msg: WebSocketMessage) => void
    >();
  });
});

// ==================== ActiveSubscription ====================

describe("ActiveSubscription", () => {
  it("has sid and params", () => {
    const sub: ActiveSubscription = {
      sid: 42,
      params: {
        channels: ["ticker"],
        market_tickers: ["MKT-1"],
      },
    };
    expect(sub.sid).toBe(42);
    expect(sub.params.channels).toContain("ticker");
  });

  it("sid is a number", () => {
    expectTypeOf<ActiveSubscription["sid"]>().toBeNumber();
  });

  it("params is SubscribeParams", () => {
    expectTypeOf<ActiveSubscription["params"]>().toEqualTypeOf<SubscribeParams>();
  });
});
