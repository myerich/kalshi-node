import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  Order,
  PortfolioOrdersResponse,
  PortfolioOrderResponse,
  QueuePosition,
  QueuePositionsResponse,
  QueuePositionByIdResponse,
  OrderGroup,
  OrderGroupsResponse,
  OrderGroupByIdResponse,
  CreateOrderGroupResponse,
  Balance,
  MarketPosition,
  EventPosition,
  PortfolioPositionsResponse,
  Settlement,
  PortfolioSettlementsResponse,
  RestingValue,
  Fill,
  PortfolioFillsResponse,
  PortfolioOrdersParams,
  QueuePositionsParams,
  PortfolioPositionsParams,
  PortfolioSettlementsParams,
  PortfolioFillsParams,
  CreateOrderGroupData,
} from "./portfolio";

// ==================== Order ====================

describe("Order", () => {
  const validOrder: Order = {
    order_id: "ord-1",
    user_id: "usr-1",
    client_order_id: "client-1",
    ticker: "MKT-1",
    side: "yes",
    action: "buy",
    type: "limit",
    status: "resting",
    yes_price_dollars: "0.55",
    no_price_dollars: "0.45",
    fill_count_fp: "5.0000",
    remaining_count_fp: "5.0000",
    initial_count_fp: "10.0000",
    taker_fees_dollars: "0.02",
    maker_fees_dollars: "0.01",
    taker_fill_cost_dollars: "2.75",
    maker_fill_cost_dollars: "2.75",
    expiration_time: "2025-12-31T23:59:59Z",
    created_time: "2025-01-01T00:00:00Z",
    last_update_time: "2025-01-02T00:00:00Z",
    self_trade_prevention_type: "taker_at_cross",
    order_group_id: "grp-1",
    cancel_order_on_pause: false,
  };

  it("enforces side union", () => {
    expectTypeOf<Order["side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("enforces action union", () => {
    expectTypeOf<Order["action"]>().toEqualTypeOf<"buy" | "sell">();
  });

  it("enforces type union", () => {
    expectTypeOf<Order["type"]>().toEqualTypeOf<"limit" | "market">();
  });

  it("fill count fields are required strings", () => {
    expectTypeOf<Order["fill_count_fp"]>().toBeString();
    expectTypeOf<Order["remaining_count_fp"]>().toBeString();
    expectTypeOf<Order["initial_count_fp"]>().toBeString();
  });

  it("status is a required string", () => {
    expectTypeOf<Order["status"]>().toBeString();
  });

  it("enforces nullable fields", () => {
    expectTypeOf<Order["expiration_time"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Order["created_time"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Order["last_update_time"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Order["order_group_id"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Order["self_trade_prevention_type"]>().toEqualTypeOf<
      "taker_at_cross" | "maker" | null
    >();
  });

  it("constructs with all fields populated", () => {
    expect(validOrder.order_id).toBe("ord-1");
    expect(validOrder.fill_count_fp).toBe("5.0000");
    expect(validOrder.status).toBe("resting");
    expectTypeOf(validOrder.cancel_order_on_pause).toBeBoolean();
  });

  it("nullable fields accept null", () => {
    const order: Order = {
      ...validOrder,
      expiration_time: null,
      created_time: null,
      last_update_time: null,
      self_trade_prevention_type: null,
      order_group_id: null,
    };
    expect(order.expiration_time).toBeNull();
    expect(order.self_trade_prevention_type).toBeNull();
    expect(order.order_group_id).toBeNull();
  });

  it("constructs with each side variant", () => {
    for (const side of ["yes", "no"] as const) {
      const o: Order = { ...validOrder, side };
      expect(o.side).toBe(side);
    }
  });

  it("constructs with each action variant", () => {
    for (const action of ["buy", "sell"] as const) {
      const o: Order = { ...validOrder, action };
      expect(o.action).toBe(action);
    }
  });

  it("constructs with each type variant", () => {
    for (const type of ["limit", "market"] as const) {
      const o: Order = { ...validOrder, type };
      expect(o.type).toBe(type);
    }
  });

  it("constructs with each self_trade_prevention_type variant", () => {
    for (const stp of ["taker_at_cross", "maker", null] as const) {
      const o: Order = { ...validOrder, self_trade_prevention_type: stp };
      expect(o.self_trade_prevention_type).toBe(stp);
    }
  });
});

// ==================== Order Response Wrappers ====================

describe("PortfolioOrdersResponse", () => {
  it("wraps orders array with cursor", () => {
    const response: PortfolioOrdersResponse = { orders: [], cursor: "abc" };
    expect(response.orders).toHaveLength(0);
    expectTypeOf<PortfolioOrdersResponse["cursor"]>().toBeString();
  });
});

describe("PortfolioOrderResponse", () => {
  it("wraps a single Order", () => {
    const order: Order = {
      order_id: "ord-1",
      user_id: "usr-1",
      client_order_id: "",
      ticker: "MKT-1",
      side: "yes",
      action: "buy",
      type: "limit",
      status: "resting",
      yes_price_dollars: "0.55",
      no_price_dollars: "0.45",
      fill_count_fp: "0.0000",
      remaining_count_fp: "10.0000",
      initial_count_fp: "10.0000",
      taker_fees_dollars: "0",
      maker_fees_dollars: "0",
      taker_fill_cost_dollars: "0",
      maker_fill_cost_dollars: "0",
      expiration_time: null,
      created_time: null,
      last_update_time: null,
      self_trade_prevention_type: null,
      order_group_id: null,
      cancel_order_on_pause: false,
    };
    const response: PortfolioOrderResponse = { order };
    expect(response.order.order_id).toBe("ord-1");
  });
});

// ==================== Queue Position ====================

describe("QueuePosition", () => {
  it("has queue_position_fp string field", () => {
    const qp: QueuePosition = {
      order_id: "ord-1",
      market_ticker: "MKT-1",
      queue_position_fp: "3.0000",
    };
    expect(qp.queue_position_fp).toBe("3.0000");
    expectTypeOf<QueuePosition["queue_position_fp"]>().toBeString();
  });
});

describe("QueuePositionsResponse", () => {
  it("wraps array", () => {
    const response: QueuePositionsResponse = {
      queue_positions: [
        { order_id: "ord-1", market_ticker: "MKT-1", queue_position_fp: "1.0000" },
      ],
    };
    expect(response.queue_positions).toHaveLength(1);
  });

  it("accepts empty array", () => {
    const response: QueuePositionsResponse = { queue_positions: [] };
    expect(response.queue_positions).toHaveLength(0);
  });
});

describe("QueuePositionByIdResponse", () => {
  it("has queue_position_fp string", () => {
    const response: QueuePositionByIdResponse = { queue_position_fp: "5.0000" };
    expect(response.queue_position_fp).toBe("5.0000");
    expectTypeOf<QueuePositionByIdResponse["queue_position_fp"]>().toBeString();
  });
});

// ==================== Order Groups ====================

describe("OrderGroup", () => {
  it("has id and is_auto_cancel_enabled", () => {
    const group: OrderGroup = { id: "grp-1", is_auto_cancel_enabled: true };
    expect(group.id).toBe("grp-1");
    expect(group.is_auto_cancel_enabled).toBe(true);
  });
});

describe("OrderGroupsResponse", () => {
  it("wraps array", () => {
    const response: OrderGroupsResponse = {
      order_groups: [{ id: "grp-1", is_auto_cancel_enabled: false }],
    };
    expect(response.order_groups).toHaveLength(1);
  });

  it("accepts empty array", () => {
    const response: OrderGroupsResponse = { order_groups: [] };
    expect(response.order_groups).toHaveLength(0);
  });
});

describe("OrderGroupByIdResponse", () => {
  it("has orders array and auto-cancel flag", () => {
    const response: OrderGroupByIdResponse = {
      is_auto_cancel_enabled: true,
      orders: ["ord-1", "ord-2"],
    };
    expect(response.orders).toHaveLength(2);
    expectTypeOf<OrderGroupByIdResponse["orders"]>().toEqualTypeOf<string[]>();
  });
});

describe("CreateOrderGroupResponse", () => {
  it("has order_group_id string", () => {
    const response: CreateOrderGroupResponse = { order_group_id: "grp-1" };
    expect(response.order_group_id).toBe("grp-1");
    expectTypeOf<CreateOrderGroupResponse["order_group_id"]>().toBeString();
  });
});

// ==================== Balance ====================

describe("Balance", () => {
  it("uses numeric fields", () => {
    const balance: Balance = {
      balance: 10000,
      portfolio_value: 25000,
      updated_ts: 1700000000,
    };
    expect(balance.balance).toBe(10000);
    expectTypeOf(balance.balance).toBeNumber();
    expectTypeOf(balance.portfolio_value).toBeNumber();
    expectTypeOf(balance.updated_ts).toBeNumber();
  });
});

// ==================== Positions ====================

describe("MarketPosition", () => {
  it("has all required fields with correct types", () => {
    const position: MarketPosition = {
      ticker: "MKT-1",
      total_traded_dollars: "100.00",
      position_fp: "10.0000",
      market_exposure_dollars: "50.00",
      realized_pnl_dollars: "5.00",
      fees_paid_dollars: "0.50",
      last_updated_ts: "2025-01-01T00:00:00Z",
    };
    expect(position.ticker).toBe("MKT-1");
    expect(position.position_fp).toBe("10.0000");
    expectTypeOf<MarketPosition["total_traded_dollars"]>().toBeString();
    expectTypeOf<MarketPosition["position_fp"]>().toBeString();
  });

  it("position_fp can be zero or negative string", () => {
    const zero: MarketPosition = {
      ticker: "MKT-1",
      total_traded_dollars: "0",
      position_fp: "0.0000",
      market_exposure_dollars: "0",
      realized_pnl_dollars: "0",
      fees_paid_dollars: "0",
    };
    expect(zero.position_fp).toBe("0.0000");

    const negative: MarketPosition = { ...zero, position_fp: "-5.0000" };
    expect(negative.position_fp).toBe("-5.0000");
  });

  it("resting_orders_count is optional", () => {
    expectTypeOf<MarketPosition["resting_orders_count"]>().toEqualTypeOf<number | undefined>();
    const pos: MarketPosition = {
      ticker: "MKT-1",
      total_traded_dollars: "0",
      position_fp: "0.0000",
      market_exposure_dollars: "0",
      realized_pnl_dollars: "0",
      fees_paid_dollars: "0",
      resting_orders_count: 3,
    };
    expect(pos.resting_orders_count).toBe(3);
  });

  it("last_updated_ts is optional", () => {
    expectTypeOf<MarketPosition["last_updated_ts"]>().toEqualTypeOf<string | undefined>();
    const pos: MarketPosition = {
      ticker: "MKT-1",
      total_traded_dollars: "0",
      position_fp: "0.0000",
      market_exposure_dollars: "0",
      realized_pnl_dollars: "0",
      fees_paid_dollars: "0",
    };
    expect(pos.last_updated_ts).toBeUndefined();
  });
});

describe("EventPosition", () => {
  it("has all required fields", () => {
    const position: EventPosition = {
      event_ticker: "EVT-1",
      total_cost_dollars: "200.00",
      total_cost_shares_fp: "20.0000",
      event_exposure_dollars: "100.00",
      realized_pnl_dollars: "10.00",
      fees_paid_dollars: "1.00",
    };
    expect(position.event_ticker).toBe("EVT-1");
    expect(position.total_cost_shares_fp).toBe("20.0000");
    expectTypeOf<EventPosition["total_cost_shares_fp"]>().toBeString();
    expectTypeOf<EventPosition["event_exposure_dollars"]>().toBeString();
  });

  it("resting_orders_count is optional", () => {
    expectTypeOf<EventPosition["resting_orders_count"]>().toEqualTypeOf<number | undefined>();
    const pos: EventPosition = {
      event_ticker: "EVT-1",
      total_cost_dollars: "0",
      total_cost_shares_fp: "0.0000",
      event_exposure_dollars: "0",
      realized_pnl_dollars: "0",
      fees_paid_dollars: "0",
      resting_orders_count: 0,
    };
    expect(pos.resting_orders_count).toBe(0);
  });
});

describe("PortfolioPositionsResponse", () => {
  it("has market/event positions with cursor", () => {
    expectTypeOf<PortfolioPositionsResponse["market_positions"]>().toMatchTypeOf<
      MarketPosition[]
    >();
    expectTypeOf<PortfolioPositionsResponse["event_positions"]>().toMatchTypeOf<
      EventPosition[]
    >();
    expectTypeOf<PortfolioPositionsResponse["cursor"]>().toBeString();
  });

  it("accepts empty arrays", () => {
    const response: PortfolioPositionsResponse = {
      market_positions: [],
      event_positions: [],
      cursor: "",
    };
    expect(response.market_positions).toHaveLength(0);
    expect(response.event_positions).toHaveLength(0);
  });
});

// ==================== Settlements ====================

describe("Settlement", () => {
  it("enforces market_result union", () => {
    expectTypeOf<Settlement["market_result"]>().toEqualTypeOf<
      "yes" | "no" | "scalar" | "void"
    >();
  });

  it("constructs full object with required _fp fields", () => {
    const settlement: Settlement = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      market_result: "yes",
      yes_count_fp: "10.0000",
      no_count_fp: "0.0000",
      yes_total_cost_dollars: "55.00",
      no_total_cost_dollars: "0.00",
      revenue: 55,
      settled_time: "2025-06-01T00:00:00Z",
      fee_cost: "50",
    };
    expect(settlement.ticker).toBe("MKT-1");
    expect(settlement.market_result).toBe("yes");
    expect(settlement.yes_count_fp).toBe("10.0000");
    expect(settlement.yes_total_cost_dollars).toBe("55.00");
    expect(settlement.revenue).toBe(55);
    expectTypeOf<Settlement["fee_cost"]>().toBeString();
    expectTypeOf<Settlement["yes_count_fp"]>().toBeString();
    expectTypeOf<Settlement["no_count_fp"]>().toBeString();
    expectTypeOf<Settlement["revenue"]>().toBeNumber();
  });

  it("value is optional and nullable", () => {
    expectTypeOf<Settlement["value"]>().toEqualTypeOf<number | null | undefined>();
    const s: Settlement = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      market_result: "scalar",
      yes_count_fp: "10.0000",
      no_count_fp: "0.0000",
      yes_total_cost_dollars: "55.00",
      no_total_cost_dollars: "0.00",
      revenue: 55,
      settled_time: "",
      fee_cost: "0",
      value: 42,
    };
    expect(s.value).toBe(42);

    const nullValue: Settlement = { ...s, value: null };
    expect(nullValue.value).toBeNull();
  });

  it("constructs with each market_result variant", () => {
    for (const result of ["yes", "no", "scalar", "void"] as const) {
      const s: Settlement = {
        ticker: "MKT-1",
        event_ticker: "EVT-1",
        market_result: result,
        yes_count_fp: "0.0000",
        no_count_fp: "0.0000",
        yes_total_cost_dollars: "0.00",
        no_total_cost_dollars: "0.00",
        revenue: 0,
        settled_time: "",
        fee_cost: "0",
      };
      expect(s.market_result).toBe(result);
    }
  });
});

describe("PortfolioSettlementsResponse", () => {
  it("wraps settlements with cursor", () => {
    const response: PortfolioSettlementsResponse = {
      settlements: [],
      cursor: "abc",
    };
    expect(response.settlements).toHaveLength(0);
    expectTypeOf<PortfolioSettlementsResponse["cursor"]>().toBeString();
  });
});

// ==================== Resting Value ====================

describe("RestingValue", () => {
  it("is a simple numeric wrapper", () => {
    const rv: RestingValue = { total_resting_order_value: 5000 };
    expect(rv.total_resting_order_value).toBe(5000);
    expectTypeOf<RestingValue["total_resting_order_value"]>().toBeNumber();
  });

  it("accepts zero", () => {
    const rv: RestingValue = { total_resting_order_value: 0 };
    expect(rv.total_resting_order_value).toBe(0);
  });
});

// ==================== Fills ====================

describe("Fill", () => {
  it("has is_taker boolean", () => {
    expectTypeOf<Fill["is_taker"]>().toBeBoolean();
  });

  it("enforces side and action unions", () => {
    expectTypeOf<Fill["side"]>().toEqualTypeOf<"yes" | "no">();
    expectTypeOf<Fill["action"]>().toEqualTypeOf<"buy" | "sell">();
  });

  it("constructs with all required fields", () => {
    const fill: Fill = {
      fill_id: "fill-1",
      trade_id: "trade-1",
      order_id: "ord-1",
      ticker: "MKT-1",
      market_ticker: "MKT-1",
      side: "yes",
      action: "buy",
      count_fp: "5.0000",
      yes_price_dollars: "0.55",
      no_price_dollars: "0.45",
      fee_cost: "0.0100",
      is_taker: true,
      client_order_id: "client-1",
      created_time: "2025-01-01T00:00:00Z",
      ts: 1700000000,
    };
    expect(fill.fill_id).toBe("fill-1");
    expect(fill.count_fp).toBe("5.0000");
    expect(fill.yes_price_dollars).toBe("0.55");
    expect(fill.fee_cost).toBe("0.0100");
    expect(fill.market_ticker).toBe("MKT-1");
    expect(fill.is_taker).toBe(true);
  });

  it("required fields are non-optional strings", () => {
    expectTypeOf<Fill["market_ticker"]>().toBeString();
    expectTypeOf<Fill["count_fp"]>().toBeString();
    expectTypeOf<Fill["yes_price_dollars"]>().toBeString();
    expectTypeOf<Fill["no_price_dollars"]>().toBeString();
    expectTypeOf<Fill["fee_cost"]>().toBeString();
  });

  it("optional fields have correct types", () => {
    expectTypeOf<Fill["client_order_id"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Fill["created_time"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Fill["ts"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<Fill["subaccount_number"]>().toEqualTypeOf<number | null | undefined>();
  });

  it("subaccount_number accepts null", () => {
    const fill: Fill = {
      fill_id: "",
      trade_id: "",
      order_id: "",
      ticker: "",
      market_ticker: "",
      side: "yes",
      action: "buy",
      count_fp: "0.0000",
      yes_price_dollars: "0",
      no_price_dollars: "0",
      fee_cost: "0",
      is_taker: false,
      subaccount_number: null,
    };
    expect(fill.subaccount_number).toBeNull();
  });

  it("constructs with each side/action combination", () => {
    const combos = [
      { side: "yes", action: "buy" },
      { side: "yes", action: "sell" },
      { side: "no", action: "buy" },
      { side: "no", action: "sell" },
    ] as const;
    for (const { side, action } of combos) {
      const f: Fill = {
        fill_id: "",
        trade_id: "",
        order_id: "",
        ticker: "",
        market_ticker: "",
        side,
        action,
        count_fp: "0.0000",
        yes_price_dollars: "0",
        no_price_dollars: "0",
        fee_cost: "0",
        is_taker: false,
      };
      expect(f.side).toBe(side);
      expect(f.action).toBe(action);
    }
  });
});

describe("PortfolioFillsResponse", () => {
  it("wraps fills with cursor", () => {
    const response: PortfolioFillsResponse = { fills: [], cursor: "" };
    expect(response.fills).toHaveLength(0);
    expectTypeOf<PortfolioFillsResponse["cursor"]>().toBeString();
  });
});

// ==================== Request Params ====================

describe("PortfolioOrdersParams", () => {
  it("all fields are optional", () => {
    const empty: PortfolioOrdersParams = {};
    expect(empty).toEqual({});
  });

  it("enforces status union", () => {
    expectTypeOf<PortfolioOrdersParams["status"]>().toEqualTypeOf<
      "resting" | "executed" | "canceled" | undefined
    >();
  });

  it("accepts all fields populated", () => {
    const full: PortfolioOrdersParams = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      min_ts: 1700000000,
      max_ts: 1700100000,
      status: "resting",
      limit: 50,
      cursor: "abc",
      subaccount: 1,
    };
    expect(full.ticker).toBe("MKT-1");
    expect(full.subaccount).toBe(1);
  });

  it("accepts each status variant", () => {
    for (const status of ["resting", "executed", "canceled"] as const) {
      const p: PortfolioOrdersParams = { status };
      expect(p.status).toBe(status);
    }
  });
});

describe("QueuePositionsParams", () => {
  it("all fields are optional", () => {
    const empty: QueuePositionsParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: QueuePositionsParams = {
      market_tickers: "MKT-1,MKT-2",
      event_ticker: "EVT-1",
      subaccount: 0,
    };
    expect(full.market_tickers).toContain("MKT-1");
  });
});

describe("PortfolioPositionsParams", () => {
  it("all fields are optional", () => {
    const empty: PortfolioPositionsParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: PortfolioPositionsParams = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      count_filter: "nonzero",
      subaccount: 1,
      limit: 50,
      cursor: "xyz",
    };
    expect(full.ticker).toBe("MKT-1");
    expect(full.subaccount).toBe(1);
  });
});

describe("PortfolioSettlementsParams", () => {
  it("all fields are optional", () => {
    const empty: PortfolioSettlementsParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: PortfolioSettlementsParams = {
      ticker: "MKT-1",
      event_ticker: "EVT-1",
      min_ts: 1700000000,
      max_ts: 1700100000,
      limit: 25,
      cursor: "abc",
      subaccount: 1,
    };
    expect(full.min_ts).toBe(1700000000);
    expect(full.subaccount).toBe(1);
  });
});

describe("PortfolioFillsParams", () => {
  it("all fields are optional", () => {
    const empty: PortfolioFillsParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: PortfolioFillsParams = {
      ticker: "MKT-1",
      order_id: "ord-1",
      min_ts: 1700000000,
      max_ts: 1700100000,
      subaccount: 0,
      limit: 100,
      cursor: "def",
    };
    expect(full.order_id).toBe("ord-1");
  });
});

describe("CreateOrderGroupData", () => {
  it("contracts_limit is optional", () => {
    const empty: CreateOrderGroupData = {};
    expect(empty).toEqual({});
  });

  it("accepts contracts_limit", () => {
    const group: CreateOrderGroupData = { contracts_limit: 100 };
    expect(group.contracts_limit).toBe(100);
    expectTypeOf<CreateOrderGroupData["contracts_limit"]>().toEqualTypeOf<
      number | undefined
    >();
  });
});
