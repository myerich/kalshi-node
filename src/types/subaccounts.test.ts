import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  SubaccountBalance,
  SubaccountBalancesResponse,
  SubaccountTransfer,
  SubaccountTransfersResponse,
  CreateSubaccountResponse,
  SubaccountTransfersParams,
  TransferBetweenSubaccountsData,
} from "./subaccounts";

describe("SubaccountBalance", () => {
  it("has all fields", () => {
    const balance: SubaccountBalance = {
      subaccount_number: 1,
      balance: 5000,
      updated_ts: 1700000000,
    };
    expect(balance.subaccount_number).toBe(1);
    expectTypeOf<SubaccountBalance["subaccount_number"]>().toBeNumber();
    expectTypeOf<SubaccountBalance["balance"]>().toBeNumber();
    expectTypeOf<SubaccountBalance["updated_ts"]>().toBeNumber();
  });

  it("accepts zero balance", () => {
    const balance: SubaccountBalance = {
      subaccount_number: 0,
      balance: 0,
      updated_ts: 0,
    };
    expect(balance.balance).toBe(0);
  });
});

describe("SubaccountBalancesResponse", () => {
  it("wraps array", () => {
    const response: SubaccountBalancesResponse = {
      subaccount_balances: [
        { subaccount_number: 0, balance: 10000, updated_ts: 1700000000 },
      ],
    };
    expect(response.subaccount_balances).toHaveLength(1);
  });

  it("accepts empty array", () => {
    const response: SubaccountBalancesResponse = { subaccount_balances: [] };
    expect(response.subaccount_balances).toHaveLength(0);
  });
});

describe("SubaccountTransfer", () => {
  it("has all fields", () => {
    const transfer: SubaccountTransfer = {
      transfer_id: "xfer-1",
      from_subaccount: 0,
      to_subaccount: 1,
      amount: 5000,
      created_ts: 1700000000,
    };
    expect(transfer.transfer_id).toBe("xfer-1");
    expectTypeOf<SubaccountTransfer["amount"]>().toBeNumber();
    expectTypeOf<SubaccountTransfer["created_ts"]>().toBeNumber();
    expectTypeOf<SubaccountTransfer["from_subaccount"]>().toBeNumber();
    expectTypeOf<SubaccountTransfer["to_subaccount"]>().toBeNumber();
  });
});

describe("SubaccountTransfersResponse", () => {
  it("wraps transfers with cursor", () => {
    const response: SubaccountTransfersResponse = {
      transfers: [],
      cursor: "abc",
    };
    expect(response.transfers).toHaveLength(0);
    expectTypeOf<SubaccountTransfersResponse["cursor"]>().toBeString();
  });
});

describe("CreateSubaccountResponse", () => {
  it("has subaccount_number", () => {
    const response: CreateSubaccountResponse = { subaccount_number: 1 };
    expect(response.subaccount_number).toBe(1);
    expectTypeOf<CreateSubaccountResponse["subaccount_number"]>().toBeNumber();
  });
});

describe("SubaccountTransfersParams", () => {
  it("all fields are optional", () => {
    const empty: SubaccountTransfersParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: SubaccountTransfersParams = { limit: 10, cursor: "abc" };
    expect(full.limit).toBe(10);
    expectTypeOf<SubaccountTransfersParams["limit"]>().toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf<SubaccountTransfersParams["cursor"]>().toEqualTypeOf<
      string | undefined
    >();
  });
});

describe("TransferBetweenSubaccountsData", () => {
  it("has all required fields", () => {
    const transfer: TransferBetweenSubaccountsData = {
      client_transfer_id: "xfer-1",
      from_subaccount: 0,
      to_subaccount: 1,
      amount_cents: 5000,
    };
    expect(transfer.amount_cents).toBe(5000);
    expect(transfer.client_transfer_id).toBe("xfer-1");
  });

  it("enforces numeric types for subaccount fields", () => {
    expectTypeOf<TransferBetweenSubaccountsData["from_subaccount"]>().toBeNumber();
    expectTypeOf<TransferBetweenSubaccountsData["to_subaccount"]>().toBeNumber();
    expectTypeOf<TransferBetweenSubaccountsData["amount_cents"]>().toBeNumber();
  });

  it("enforces string type for client_transfer_id", () => {
    expectTypeOf<TransferBetweenSubaccountsData["client_transfer_id"]>().toBeString();
  });
});
