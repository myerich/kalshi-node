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
  TradeWsMessage,
  OrderbookDeltaMessage,
  OrderbookSnapshotMessage,
  FillWsMessage,
  MarketPositionsWsMessage,
  MarketLifecycleMessage,
  EventLifecycleMessage,
  OrderGroupUpdatesWsMessage,
  MultivariateWsMessage,
  RFQCreatedWsMessage,
  QuoteCreatedWsMessage,
  QuoteExecutedWsMessage,
  UserOrderWsMessage,
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
  it("PublicChannel includes all 4 public channels", () => {
    const channels: PublicChannel[] = [
      "ticker",
      "trade",
      "market_lifecycle_v2",
      "multivariate",
    ];
    expect(channels).toHaveLength(4);
  });

  it("PrivateChannel includes all 6 private channels", () => {
    const channels: PrivateChannel[] = [
      "orderbook_delta",
      "fill",
      "market_positions",
      "communications",
      "order_group_updates",
      "user_orders",
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

  it("optional market_tickers and market_ids", () => {
    expectTypeOf<SubscribeParams["market_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<SubscribeParams["market_ids"]>().toEqualTypeOf<
      string[] | undefined
    >();
  });

  it("optional singular market_ticker and market_id", () => {
    expectTypeOf<SubscribeParams["market_ticker"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<SubscribeParams["market_id"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("optional send_initial_snapshot and skip_ticker_ack flags", () => {
    expectTypeOf<SubscribeParams["send_initial_snapshot"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<SubscribeParams["skip_ticker_ack"]>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  it("optional shard_factor and shard_key for communications channel", () => {
    expectTypeOf<SubscribeParams["shard_factor"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<SubscribeParams["shard_key"]>().toEqualTypeOf<
      number | undefined
    >();
  });

  it("accepts all fields", () => {
    const params: SubscribeParams = {
      channels: ["ticker"],
      market_ticker: "MKT-1",
      market_tickers: ["MKT-1", "MKT-2"],
      market_id: "uuid-1",
      market_ids: ["uuid-1", "uuid-2"],
      send_initial_snapshot: true,
      skip_ticker_ack: false,
      shard_factor: 10,
      shard_key: 3,
    };
    expect(params.market_tickers).toHaveLength(2);
    expect(params.shard_factor).toBe(10);
  });

  it("accepts private channels", () => {
    const params: SubscribeParams = {
      channels: ["orderbook_delta", "fill", "market_positions"],
      market_tickers: ["MKT-1"],
    };
    expect(params.channels).toHaveLength(3);
  });

  it("accepts user_orders channel", () => {
    const params: SubscribeParams = {
      channels: ["user_orders"],
    };
    expect(params.channels).toContain("user_orders");
  });
});

describe("UpdateSubscriptionParams", () => {
  it("requires action field", () => {
    const params: UpdateSubscriptionParams = {
      sids: [1, 2, 3],
      action: "add_markets",
    };
    expect(params.action).toBe("add_markets");
  });

  it("action accepts both values", () => {
    expectTypeOf<UpdateSubscriptionParams["action"]>().toEqualTypeOf<
      "add_markets" | "delete_markets"
    >();
  });

  it("optional sid and sids", () => {
    expectTypeOf<UpdateSubscriptionParams["sid"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<UpdateSubscriptionParams["sids"]>().toEqualTypeOf<
      number[] | undefined
    >();
  });

  it("optional market_tickers and market_ids", () => {
    expectTypeOf<UpdateSubscriptionParams["market_tickers"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<UpdateSubscriptionParams["market_ids"]>().toEqualTypeOf<
      string[] | undefined
    >();
  });

  it("accepts all fields", () => {
    const params: UpdateSubscriptionParams = {
      sid: 1,
      sids: [1, 2],
      action: "delete_markets",
      market_ticker: "MKT-1",
      market_tickers: ["MKT-1"],
      market_id: "uuid-1",
      market_ids: ["uuid-1"],
      send_initial_snapshot: true,
    };
    expect(params.action).toBe("delete_markets");
  });
});

describe("WebSocketCommand", () => {
  it("enforces cmd union including list_subscriptions", () => {
    expectTypeOf<WebSocketCommand["cmd"]>().toEqualTypeOf<
      "subscribe" | "unsubscribe" | "update_subscription" | "list_subscriptions"
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
      params: { sids: [1], action: "add_markets", market_tickers: ["MKT-2"] },
    };
    expect(cmd.cmd).toBe("update_subscription");
  });

  it("constructs list_subscriptions command", () => {
    const cmd: WebSocketCommand = {
      id: 4,
      cmd: "list_subscriptions",
      params: {},
    };
    expect(cmd.cmd).toBe("list_subscriptions");
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
  it("has correct structure with all spec fields", () => {
    const msg: TickerMessage = {
      type: "ticker",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        market_id: "uuid-abc",
        price: 55,
        price_dollars: "0.55",
        yes_bid: 54,
        yes_ask: 56,
        yes_bid_dollars: "0.54",
        yes_ask_dollars: "0.56",
        volume: 1000,
        volume_fp: "1000.00",
        open_interest: 500,
        open_interest_fp: "500.00",
        dollar_volume: 550,
        dollar_open_interest: 275,
        ts: 1700000000,
        time: "2023-11-14T00:00:00Z",
      },
    };
    expect(msg.type).toBe("ticker");
    expect(msg.seq).toBe(1);
    expect(msg.msg.market_ticker).toBe("MKT-1");
    expect(msg.msg.yes_bid_dollars).toBe("0.54");
  });

  it("type is literal 'ticker'", () => {
    expectTypeOf<TickerMessage["type"]>().toEqualTypeOf<"ticker">();
  });

  it("price field is a number (cents integer)", () => {
    expectTypeOf<TickerMessage["msg"]["price"]>().toBeNumber();
  });

  it("dollar fields are strings", () => {
    expectTypeOf<TickerMessage["msg"]["price_dollars"]>().toBeString();
    expectTypeOf<TickerMessage["msg"]["yes_bid_dollars"]>().toBeString();
    expectTypeOf<TickerMessage["msg"]["yes_ask_dollars"]>().toBeString();
  });

  it("ts is a number (Unix seconds)", () => {
    expectTypeOf<TickerMessage["msg"]["ts"]>().toBeNumber();
  });

  it("time is a string (RFC3339)", () => {
    expectTypeOf<TickerMessage["msg"]["time"]>().toBeString();
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
        yes_price_dollars: "0.55",
        no_price_dollars: "0.45",
        count_fp: "10.00",
        taker_side: "yes",
        ts: 1700000000,
      },
    };
    expect(msg.type).toBe("trade");
    expect(msg.msg.trade_id).toBe("t-1");
    expect(msg.msg.count_fp).toBe("10.00");
  });

  it("enforces taker_side union", () => {
    expectTypeOf<TradeWsMessage["msg"]["taker_side"]>().toEqualTypeOf<
      "yes" | "no"
    >();
  });

  it("ts is Unix seconds number", () => {
    expectTypeOf<TradeWsMessage["msg"]["ts"]>().toBeNumber();
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
          yes_price_dollars: "0.50",
          no_price_dollars: "0.50",
          count_fp: "0.00",
          taker_side: side,
          ts: 0,
        },
      };
      expect(msg.msg.taker_side).toBe(side);
    }
  });
});

describe("OrderbookDeltaMessage", () => {
  it("has correct structure with all spec fields", () => {
    const msg: OrderbookDeltaMessage = {
      type: "orderbook_delta",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        market_id: "uuid-abc",
        price: 55,
        price_dollars: "0.55",
        delta: 100,
        delta_fp: "100.00",
        side: "yes",
      },
    };
    expect(msg.type).toBe("orderbook_delta");
    expect(msg.msg.price).toBe(55);
    expect(msg.msg.delta_fp).toBe("100.00");
    expect(msg.msg.market_id).toBe("uuid-abc");
  });

  it("enforces side union", () => {
    expectTypeOf<OrderbookDeltaMessage["msg"]["side"]>().toEqualTypeOf<
      "yes" | "no"
    >();
  });

  it("client_order_id, subaccount, ts are optional", () => {
    expectTypeOf<
      OrderbookDeltaMessage["msg"]["client_order_id"]
    >().toEqualTypeOf<string | undefined>();
    expectTypeOf<
      OrderbookDeltaMessage["msg"]["subaccount"]
    >().toEqualTypeOf<number | undefined>();
    expectTypeOf<
      OrderbookDeltaMessage["msg"]["ts"]
    >().toEqualTypeOf<string | undefined>();
  });

  it("delta can be negative", () => {
    const msg: OrderbookDeltaMessage = {
      type: "orderbook_delta",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        market_id: "uuid-abc",
        price: 55,
        price_dollars: "0.55",
        delta: -50,
        delta_fp: "-50.00",
        side: "no",
      },
    };
    expect(msg.msg.delta).toBe(-50);
  });
});

describe("OrderbookSnapshotMessage", () => {
  it("has correct structure with market_id", () => {
    const msg: OrderbookSnapshotMessage = {
      type: "orderbook_snapshot",
      seq: 1,
      sid: 42,
      msg: {
        market_ticker: "MKT-1",
        market_id: "uuid-abc",
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
    expect(msg.msg.market_id).toBe("uuid-abc");
    expect(msg.msg.yes).toHaveLength(2);
    expect(msg.msg.yes[0]).toEqual([55, 100]);
    expect(msg.msg.yes_dollars[0]).toEqual(["0.55", 100]);
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

  it("yes_dollars_fp/no_dollars_fp are optional [string, string] tuples", () => {
    expectTypeOf<
      OrderbookSnapshotMessage["msg"]["yes_dollars_fp"]
    >().toEqualTypeOf<[string, string][] | undefined>();
    expectTypeOf<
      OrderbookSnapshotMessage["msg"]["no_dollars_fp"]
    >().toEqualTypeOf<[string, string][] | undefined>();
  });

  it("accepts empty orderbook", () => {
    const msg: OrderbookSnapshotMessage = {
      type: "orderbook_snapshot",
      seq: 1,
      sid: 1,
      msg: {
        market_ticker: "MKT-1",
        market_id: "uuid-abc",
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
  it("has correct structure per spec", () => {
    const msg: FillWsMessage = {
      type: "fill",
      seq: 1,
      sid: 42,
      msg: {
        trade_id: "t-1",
        order_id: "o-1",
        market_ticker: "MKT-1",
        is_taker: true,
        side: "yes",
        yes_price: 55,
        yes_price_dollars: "0.55",
        count: 5,
        count_fp: "5.00",
        fee_cost: "0.01",
        action: "buy",
        ts: 1700000000,
        post_position: 5,
        post_position_fp: "5.00",
        purchased_side: "yes",
      },
    };
    expect(msg.type).toBe("fill");
    expect(msg.msg.trade_id).toBe("t-1");
    expect(msg.msg.is_taker).toBe(true);
    expect(msg.msg.yes_price_dollars).toBe("0.55");
  });

  it("trade_id replaces the old fill_id field", () => {
    expectTypeOf<FillWsMessage["msg"]["trade_id"]>().toBeString();
  });

  it("yes_price_dollars is a dollar string", () => {
    expectTypeOf<FillWsMessage["msg"]["yes_price_dollars"]>().toBeString();
  });

  it("enforces side and action unions", () => {
    expectTypeOf<FillWsMessage["msg"]["side"]>().toEqualTypeOf<"yes" | "no">();
    expectTypeOf<FillWsMessage["msg"]["action"]>().toEqualTypeOf<
      "buy" | "sell"
    >();
    expectTypeOf<FillWsMessage["msg"]["purchased_side"]>().toEqualTypeOf<
      "yes" | "no"
    >();
  });

  it("is_taker is boolean", () => {
    expectTypeOf<FillWsMessage["msg"]["is_taker"]>().toBeBoolean();
  });

  it("client_order_id and subaccount are optional", () => {
    expectTypeOf<FillWsMessage["msg"]["client_order_id"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<FillWsMessage["msg"]["subaccount"]>().toEqualTypeOf<
      number | undefined
    >();
  });
});

describe("MarketPositionsWsMessage", () => {
  it("has correct structure with spec fields", () => {
    const msg: MarketPositionsWsMessage = {
      type: "market_position",
      seq: 1,
      sid: 42,
      msg: {
        user_id: "user-uuid",
        market_ticker: "MKT-1",
        position: 10,
        position_fp: "10.00",
        position_cost: 5000,
        realized_pnl: 250,
        fees_paid: 50,
        position_fee_cost: 25,
        volume: 20,
        volume_fp: "20.00",
      },
    };
    expect(msg.type).toBe("market_position");
    expect(msg.msg.position).toBe(10);
    expect(msg.msg.position_cost).toBe(5000);
  });

  it("type is 'market_position' (singular — matches wire msg.type)", () => {
    expectTypeOf<MarketPositionsWsMessage["type"]>().toEqualTypeOf<"market_position">();
  });

  it("all numeric fields are numbers", () => {
    expectTypeOf<MarketPositionsWsMessage["msg"]["position"]>().toBeNumber();
    expectTypeOf<MarketPositionsWsMessage["msg"]["position_cost"]>().toBeNumber();
    expectTypeOf<MarketPositionsWsMessage["msg"]["realized_pnl"]>().toBeNumber();
    expectTypeOf<MarketPositionsWsMessage["msg"]["fees_paid"]>().toBeNumber();
    expectTypeOf<MarketPositionsWsMessage["msg"]["volume"]>().toBeNumber();
  });

  it("subaccount is optional", () => {
    expectTypeOf<MarketPositionsWsMessage["msg"]["subaccount"]>().toEqualTypeOf<
      number | undefined
    >();
  });

  it("position can be negative", () => {
    const msg: MarketPositionsWsMessage = {
      type: "market_position",
      seq: 1,
      sid: 1,
      msg: {
        user_id: "u",
        market_ticker: "MKT-1",
        position: -5,
        position_fp: "-5.00",
        position_cost: 0,
        realized_pnl: -100,
        fees_paid: 10,
        position_fee_cost: 5,
        volume: 5,
        volume_fp: "5.00",
      },
    };
    expect(msg.msg.position).toBe(-5);
    expect(msg.msg.realized_pnl).toBe(-100);
  });
});

describe("MarketLifecycleMessage", () => {
  it("has correct structure with event_type", () => {
    const msg: MarketLifecycleMessage = {
      type: "market_lifecycle_v2",
      seq: 1,
      sid: 42,
      msg: {
        event_type: "settled",
        market_ticker: "MKT-1",
        settled_ts: 1700000000,
      },
    };
    expect(msg.type).toBe("market_lifecycle_v2");
    expect(msg.msg.event_type).toBe("settled");
  });

  it("event_type covers all spec variants", () => {
    expectTypeOf<MarketLifecycleMessage["msg"]["event_type"]>().toEqualTypeOf<
      "created" | "deactivated" | "activated" | "close_date_updated" | "determined" | "settled"
    >();
  });

  it("optional fields for each event_type variant", () => {
    expectTypeOf<MarketLifecycleMessage["msg"]["open_ts"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<MarketLifecycleMessage["msg"]["close_ts"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<MarketLifecycleMessage["msg"]["result"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<MarketLifecycleMessage["msg"]["settled_ts"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<MarketLifecycleMessage["msg"]["is_deactivated"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("constructs a 'created' event with additional_metadata", () => {
    const msg: MarketLifecycleMessage = {
      type: "market_lifecycle_v2",
      seq: 1,
      sid: 1,
      msg: {
        event_type: "created",
        market_ticker: "MKT-1",
        open_ts: 1700000000,
        close_ts: 1700086400,
        additional_metadata: {
          title: "Will X happen?",
          can_close_early: true,
        },
      },
    };
    expect(msg.msg.event_type).toBe("created");
    expect(msg.msg.additional_metadata?.title).toBe("Will X happen?");
  });
});

describe("EventLifecycleMessage", () => {
  it("has correct structure", () => {
    const msg: EventLifecycleMessage = {
      type: "event_lifecycle",
      sid: 42,
      msg: {
        event_ticker: "EVT-1",
        title: "US Elections 2024",
        subtitle: "Presidential Race",
        collateral_return_type: "MECNET",
        series_ticker: "PRES",
      },
    };
    expect(msg.type).toBe("event_lifecycle");
    expect(msg.msg.event_ticker).toBe("EVT-1");
    expect(msg.msg.collateral_return_type).toBe("MECNET");
  });

  it("collateral_return_type accepts all spec values", () => {
    expectTypeOf<EventLifecycleMessage["msg"]["collateral_return_type"]>().toEqualTypeOf<
      "MECNET" | "DIRECNET" | ""
    >();
  });

  it("strike_date and strike_period are optional", () => {
    expectTypeOf<EventLifecycleMessage["msg"]["strike_date"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<EventLifecycleMessage["msg"]["strike_period"]>().toEqualTypeOf<string | undefined>();
  });
});

describe("OrderGroupUpdatesWsMessage", () => {
  it("has correct structure with event_type", () => {
    const msg: OrderGroupUpdatesWsMessage = {
      type: "order_group_updates",
      seq: 1,
      sid: 42,
      msg: {
        event_type: "triggered",
        order_group_id: "grp-1",
      },
    };
    expect(msg.type).toBe("order_group_updates");
    expect(msg.msg.order_group_id).toBe("grp-1");
    expect(msg.msg.event_type).toBe("triggered");
  });

  it("event_type covers all spec variants", () => {
    expectTypeOf<OrderGroupUpdatesWsMessage["msg"]["event_type"]>().toEqualTypeOf<
      "created" | "triggered" | "reset" | "deleted" | "limit_updated"
    >();
  });

  it("contracts_limit_fp is optional", () => {
    expectTypeOf<
      OrderGroupUpdatesWsMessage["msg"]["contracts_limit_fp"]
    >().toEqualTypeOf<string | undefined>();
  });
});

describe("MultivariateWsMessage", () => {
  it("has correct structure with type 'multivariate_lookup'", () => {
    const msg: MultivariateWsMessage = {
      type: "multivariate_lookup",
      seq: 1,
      sid: 42,
      msg: {
        collection_ticker: "COLL-1",
        event_ticker: "EVT-1",
        market_ticker: "MKT-1",
        selected_markets: [
          { event_ticker: "EVT-1", market_ticker: "MKT-1", side: "yes" },
        ],
      },
    };
    expect(msg.type).toBe("multivariate_lookup");
    expect(msg.msg.collection_ticker).toBe("COLL-1");
    expect(msg.msg.selected_markets).toHaveLength(1);
  });

  it("type is 'multivariate_lookup' (channel name is still 'multivariate')", () => {
    expectTypeOf<MultivariateWsMessage["type"]>().toEqualTypeOf<"multivariate_lookup">();
  });

  it("selected_markets side is 'yes' | 'no'", () => {
    expectTypeOf<
      MultivariateWsMessage["msg"]["selected_markets"][number]["side"]
    >().toEqualTypeOf<"yes" | "no">();
  });
});

describe("RFQCreatedWsMessage", () => {
  it("has correct structure", () => {
    const msg: RFQCreatedWsMessage = {
      type: "rfq_created",
      seq: 1,
      sid: 42,
      msg: {
        id: "rfq-1",
        creator_id: "",
        market_ticker: "MKT-1",
        created_ts: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("rfq_created");
    expect(msg.msg.id).toBe("rfq-1");
  });

  it("optional fields", () => {
    expectTypeOf<RFQCreatedWsMessage["msg"]["event_ticker"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<RFQCreatedWsMessage["msg"]["contracts"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<RFQCreatedWsMessage["msg"]["target_cost"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<RFQCreatedWsMessage["msg"]["mve_collection_ticker"]>().toEqualTypeOf<string | undefined>();
  });
});

describe("QuoteCreatedWsMessage", () => {
  it("has correct structure", () => {
    const msg: QuoteCreatedWsMessage = {
      type: "quote_created",
      seq: 1,
      sid: 42,
      msg: {
        quote_id: "q-1",
        rfq_id: "rfq-1",
        quote_creator_id: "",
        market_ticker: "MKT-1",
        yes_bid: 55,
        no_bid: 45,
        yes_bid_dollars: "0.55",
        no_bid_dollars: "0.45",
        created_ts: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("quote_created");
    expect(msg.msg.yes_bid).toBe(55);
  });

  it("yes_bid and no_bid are cents integers", () => {
    expectTypeOf<QuoteCreatedWsMessage["msg"]["yes_bid"]>().toBeNumber();
    expectTypeOf<QuoteCreatedWsMessage["msg"]["no_bid"]>().toBeNumber();
  });
});

describe("QuoteExecutedWsMessage", () => {
  it("has correct structure", () => {
    const msg: QuoteExecutedWsMessage = {
      type: "quote_executed",
      seq: 1,
      sid: 42,
      msg: {
        quote_id: "q-1",
        rfq_id: "rfq-1",
        quote_creator_id: "qc-1",
        rfq_creator_id: "rc-1",
        order_id: "o-1",
        client_order_id: "c-1",
        market_ticker: "MKT-1",
        executed_ts: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("quote_executed");
    expect(msg.msg.client_order_id).toBe("c-1");
  });

  it("client_order_id is required (not optional)", () => {
    expectTypeOf<QuoteExecutedWsMessage["msg"]["client_order_id"]>().toBeString();
  });
});

describe("UserOrderWsMessage", () => {
  it("has correct structure", () => {
    const msg: UserOrderWsMessage = {
      type: "user_order",
      sid: 42,
      msg: {
        order_id: "o-1",
        user_id: "u-1",
        ticker: "MKT-1",
        status: "resting",
        side: "yes",
        is_yes: true,
        yes_price_dollars: "0.5500",
        fill_count_fp: "0.00",
        remaining_count_fp: "10.00",
        initial_count_fp: "10.00",
        taker_fill_cost_dollars: "0.00",
        maker_fill_cost_dollars: "0.00",
        client_order_id: "coid-1",
        created_time: "2025-01-01T00:00:00Z",
      },
    };
    expect(msg.type).toBe("user_order");
    expect(msg.msg.ticker).toBe("MKT-1");
    expect(msg.msg.status).toBe("resting");
  });

  it("status covers all variants", () => {
    expectTypeOf<UserOrderWsMessage["msg"]["status"]>().toEqualTypeOf<
      "resting" | "canceled" | "executed"
    >();
  });

  it("optional fields", () => {
    expectTypeOf<UserOrderWsMessage["msg"]["taker_fees_dollars"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<UserOrderWsMessage["msg"]["maker_fees_dollars"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<UserOrderWsMessage["msg"]["order_group_id"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<UserOrderWsMessage["msg"]["subaccount_number"]>().toEqualTypeOf<number | undefined>();
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
        market_id: "uuid-1",
        price: 55,
        price_dollars: "0.55",
        yes_bid: 54,
        yes_ask: 56,
        yes_bid_dollars: "0.54",
        yes_ask_dollars: "0.56",
        volume: 0,
        volume_fp: "0.00",
        open_interest: 0,
        open_interest_fp: "0.00",
        dollar_volume: 0,
        dollar_open_interest: 0,
        ts: 0,
        time: "",
      },
    };
    expect(msg.type).toBe("ticker");
  });

  it("accepts all 20 message types in the union", () => {
    const types: WebSocketMessage["type"][] = [
      "subscribed",
      "unsubscribed",
      "error",
      "ok",
      "ticker",
      "trade",
      "orderbook_delta",
      "orderbook_snapshot",
      "fill",
      "market_position",
      "market_lifecycle_v2",
      "event_lifecycle",
      "order_group_updates",
      "multivariate_lookup",
      "rfq_created",
      "rfq_deleted",
      "quote_created",
      "quote_accepted",
      "quote_executed",
      "user_order",
    ];
    expect(types).toHaveLength(20);
  });

  it("can discriminate on type field", () => {
    const msg: WebSocketMessage = {
      type: "trade",
      seq: 1,
      sid: 1,
      msg: {
        trade_id: "t-1",
        market_ticker: "MKT-1",
        yes_price_dollars: "0.55",
        no_price_dollars: "0.45",
        count_fp: "1.00",
        taker_side: "yes",
        ts: 0,
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
    expectTypeOf<WebSocketEventMap["trade"]>().toEqualTypeOf<
      (msg: TradeWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["market_lifecycle_v2"]>().toEqualTypeOf<
      (msg: MarketLifecycleMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["event_lifecycle"]>().toEqualTypeOf<
      (msg: EventLifecycleMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["multivariate_lookup"]>().toEqualTypeOf<
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
    expectTypeOf<WebSocketEventMap["market_position"]>().toEqualTypeOf<
      (msg: MarketPositionsWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["order_group_updates"]>().toEqualTypeOf<
      (msg: OrderGroupUpdatesWsMessage) => void
    >();
  });

  it("has communications channel events", () => {
    expectTypeOf<WebSocketEventMap["rfq_created"]>().toEqualTypeOf<
      (msg: RFQCreatedWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["quote_created"]>().toEqualTypeOf<
      (msg: QuoteCreatedWsMessage) => void
    >();
    expectTypeOf<WebSocketEventMap["quote_executed"]>().toEqualTypeOf<
      (msg: QuoteExecutedWsMessage) => void
    >();
  });

  it("has user_order event", () => {
    expectTypeOf<WebSocketEventMap["user_order"]>().toEqualTypeOf<
      (msg: UserOrderWsMessage) => void
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
