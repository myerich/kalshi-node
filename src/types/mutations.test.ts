import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  CreateOrderResponse,
  DeleteOrderResponse,
  AmendOrderResponse,
  DecreaseOrderResponse,
  CreateOrderData,
  AmendOrderData,
  DecreaseOrderData,
} from "./mutations";
import type { Order } from "./portfolio";

// ==================== Mutation Response Types ====================

describe("CreateOrderResponse", () => {
  it("wraps an Order", () => {
    expectTypeOf<CreateOrderResponse["order"]>().toMatchTypeOf<Order>();
  });
});

describe("DeleteOrderResponse", () => {
  it("includes order, reduced_by, and reduced_by_fp", () => {
    expectTypeOf<DeleteOrderResponse["order"]>().toMatchTypeOf<Order>();
    expectTypeOf<DeleteOrderResponse["reduced_by"]>().toBeNumber();
    expectTypeOf<DeleteOrderResponse["reduced_by_fp"]>().toBeString();
  });
});

describe("AmendOrderResponse", () => {
  it("has old_order and order", () => {
    expectTypeOf<AmendOrderResponse["old_order"]>().toMatchTypeOf<Order>();
    expectTypeOf<AmendOrderResponse["order"]>().toMatchTypeOf<Order>();
  });
});

describe("DecreaseOrderResponse", () => {
  it("wraps an Order", () => {
    expectTypeOf<DecreaseOrderResponse["order"]>().toMatchTypeOf<Order>();
  });
});

// ==================== CreateOrderData ====================

describe("CreateOrderData", () => {
  it("has required fields", () => {
    const order: CreateOrderData = {
      ticker: "TICKER-1",
      side: "yes",
      action: "buy",
      count: 10,
      type: "limit",
    };
    expect(order.count).toBe(10);
    expect(order.ticker).toBe("TICKER-1");
  });

  it("enforces side union", () => {
    expectTypeOf<CreateOrderData["side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("enforces action union", () => {
    expectTypeOf<CreateOrderData["action"]>().toEqualTypeOf<"buy" | "sell">();
  });

  it("enforces type union", () => {
    expectTypeOf<CreateOrderData["type"]>().toEqualTypeOf<"limit" | "market">();
  });

  it("optional fields have correct types", () => {
    expectTypeOf<CreateOrderData["yes_price_dollars"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<CreateOrderData["no_price_dollars"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<CreateOrderData["client_order_id"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<CreateOrderData["expiration_ts"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<CreateOrderData["buy_max_cost"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<CreateOrderData["post_only"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<CreateOrderData["reduce_only"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<CreateOrderData["cancel_order_on_pause"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<CreateOrderData["subaccount"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<CreateOrderData["order_group_id"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("enforces time_in_force union", () => {
    expectTypeOf<CreateOrderData["time_in_force"]>().toEqualTypeOf<
      "fill_or_kill" | "good_till_canceled" | "immediate_or_cancel" | undefined
    >();
  });

  it("enforces self_trade_prevention_type union", () => {
    expectTypeOf<CreateOrderData["self_trade_prevention_type"]>().toEqualTypeOf<
      "taker_at_cross" | "maker" | undefined
    >();
  });

  it("constructs with all optional fields", () => {
    const order: CreateOrderData = {
      ticker: "MKT-1",
      side: "yes",
      action: "buy",
      count: 10,
      type: "limit",
      client_order_id: "client-1",
      yes_price_dollars: "0.55",
      no_price_dollars: "0.45",
      expiration_ts: 1700100000,
      time_in_force: "good_till_canceled",
      buy_max_cost: 600,
      post_only: true,
      reduce_only: false,
      self_trade_prevention_type: "maker",
      order_group_id: "grp-1",
      cancel_order_on_pause: true,
      subaccount: 0,
    };
    expect(order.post_only).toBe(true);
    expect(order.subaccount).toBe(0);
  });

  it("constructs with each time_in_force variant", () => {
    const variants = [
      "fill_or_kill",
      "good_till_canceled",
      "immediate_or_cancel",
    ] as const;
    for (const tif of variants) {
      const o: CreateOrderData = {
        ticker: "MKT-1",
        side: "yes",
        action: "buy",
        count: 1,
        type: "limit",
        time_in_force: tif,
      };
      expect(o.time_in_force).toBe(tif);
    }
  });
});

// ==================== AmendOrderData ====================

describe("AmendOrderData", () => {
  it("has all required fields", () => {
    const amend: AmendOrderData = {
      ticker: "TICKER-1",
      side: "yes",
      action: "buy",
      client_order_id: "old-id",
      updated_client_order_id: "new-id",
      count: 5,
    };
    expect(amend.client_order_id).toBe("old-id");
    expect(amend.updated_client_order_id).toBe("new-id");
  });

  it("has optional price fields", () => {
    expectTypeOf<AmendOrderData["yes_price_dollars"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<AmendOrderData["no_price_dollars"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("constructs with optional price fields", () => {
    const amend: AmendOrderData = {
      ticker: "MKT-1",
      side: "no",
      action: "sell",
      client_order_id: "old-id",
      updated_client_order_id: "new-id",
      count: 5,
      yes_price_dollars: "0.60",
      no_price_dollars: "0.40",
    };
    expect(amend.yes_price_dollars).toBe("0.60");
  });

  it("enforces side union", () => {
    expectTypeOf<AmendOrderData["side"]>().toEqualTypeOf<"yes" | "no">();
  });

  it("enforces action union", () => {
    expectTypeOf<AmendOrderData["action"]>().toEqualTypeOf<"buy" | "sell">();
  });
});

// ==================== DecreaseOrderData ====================

describe("DecreaseOrderData", () => {
  it("both fields are optional", () => {
    const decrease: DecreaseOrderData = {};
    expect(decrease).toEqual({});
  });

  it("accepts reduce_by", () => {
    const decrease: DecreaseOrderData = { reduce_by: 5 };
    expect(decrease.reduce_by).toBe(5);
    expectTypeOf<DecreaseOrderData["reduce_by"]>().toEqualTypeOf<
      number | undefined
    >();
  });

  it("accepts reduce_to", () => {
    const decrease: DecreaseOrderData = { reduce_to: 3 };
    expect(decrease.reduce_to).toBe(3);
    expectTypeOf<DecreaseOrderData["reduce_to"]>().toEqualTypeOf<
      number | undefined
    >();
  });

  it("accepts both fields", () => {
    const decrease: DecreaseOrderData = { reduce_by: 5, reduce_to: 3 };
    expect(decrease.reduce_by).toBe(5);
    expect(decrease.reduce_to).toBe(3);
  });
});
