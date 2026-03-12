import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  SettlementSource,
  Series,
  SeriesListResponse,
  SeriesResponse,
  TagsByCategoriesResponse,
  SeriesListParams,
  SeriesParams,
} from "./series";

describe("SettlementSource", () => {
  it("has name and url strings", () => {
    const source: SettlementSource = { name: "AP", url: "https://ap.org" };
    expect(source.name).toBe("AP");
    expect(source.url).toBe("https://ap.org");
    expectTypeOf<SettlementSource["name"]>().toBeString();
    expectTypeOf<SettlementSource["url"]>().toBeString();
  });
});

describe("Series", () => {
  const validSeries: Series = {
    ticker: "SERIES-1",
    frequency: "daily",
    title: "Test Series",
    category: "politics",
    tags: ["election", "2025"],
    settlement_sources: [{ name: "AP", url: "https://ap.org" }],
    contract_url: "https://example.com/contract",
    contract_terms_url: "https://example.com/terms",
    fee_type: "quadratic",
    fee_multiplier: 1.0,
    additional_prohibitions: [],
  };

  it("has required fields", () => {
    expect(validSeries.ticker).toBe("SERIES-1");
    expect(validSeries.tags).toContain("election");
  });

  it("has optional fields", () => {
    expectTypeOf<Series["product_metadata"]>().toEqualTypeOf<
      Record<string, unknown> | undefined
    >();
    expectTypeOf<Series["volume"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<Series["volume_fp"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Series["last_updated_ts"]>().toEqualTypeOf<string | undefined>();
  });

  it("accepts optional fields populated", () => {
    const withOptionals: Series = {
      ...validSeries,
      product_metadata: { key: "value" },
      volume: 1000,
      volume_fp: "1000.0000",
      last_updated_ts: "2025-06-01T12:00:00Z",
    };
    expect(withOptionals.volume).toBe(1000);
    expect(withOptionals.product_metadata).toEqual({ key: "value" });
    expect(withOptionals.volume_fp).toBe("1000.0000");
    expect(withOptionals.last_updated_ts).toBe("2025-06-01T12:00:00Z");
  });

  it("enforces fee_type union", () => {
    expectTypeOf<Series["fee_type"]>().toEqualTypeOf<
      "quadratic" | "quadratic_with_maker_fees" | "flat"
    >();
  });

  it("constructs with each fee_type variant", () => {
    const types = ["quadratic", "quadratic_with_maker_fees", "flat"] as const;
    for (const ft of types) {
      const s: Series = { ...validSeries, fee_type: ft };
      expect(s.fee_type).toBe(ft);
    }
  });

  it("settlement_sources is an array", () => {
    expect(validSeries.settlement_sources).toHaveLength(1);
    expect(validSeries.settlement_sources[0].name).toBe("AP");
  });

  it("additional_prohibitions is a string array", () => {
    const s: Series = {
      ...validSeries,
      additional_prohibitions: ["no insider trading", "must be 18+"],
    };
    expect(s.additional_prohibitions).toHaveLength(2);
  });

  it("tags can be empty array", () => {
    const s: Series = { ...validSeries, tags: [] };
    expect(s.tags).toHaveLength(0);
  });
});

describe("SeriesListResponse", () => {
  it("wraps array of Series", () => {
    const validSeries: Series = {
      ticker: "SERIES-1",
      frequency: "daily",
      title: "Test",
      category: "politics",
      tags: [],
      settlement_sources: [],
      contract_url: "",
      contract_terms_url: "",
      fee_type: "flat",
      fee_multiplier: 1.0,
      additional_prohibitions: [],
    };
    const list: SeriesListResponse = { series: [validSeries] };
    expect(list.series).toHaveLength(1);
  });

  it("accepts empty array", () => {
    const list: SeriesListResponse = { series: [] };
    expect(list.series).toHaveLength(0);
  });
});

describe("SeriesResponse", () => {
  it("wraps a single Series", () => {
    const validSeries: Series = {
      ticker: "SERIES-1",
      frequency: "daily",
      title: "Test",
      category: "politics",
      tags: [],
      settlement_sources: [],
      contract_url: "",
      contract_terms_url: "",
      fee_type: "flat",
      fee_multiplier: 1.0,
      additional_prohibitions: [],
    };
    const single: SeriesResponse = { series: validSeries };
    expect(single.series.ticker).toBe("SERIES-1");
  });
});

describe("TagsByCategoriesResponse", () => {
  it("is a Record<string, string[]>", () => {
    const tags: TagsByCategoriesResponse = {
      tags_by_categories: {
        politics: ["election", "senate"],
        finance: ["stocks"],
      },
    };
    expect(tags.tags_by_categories.politics).toHaveLength(2);
    expect(tags.tags_by_categories.finance).toContain("stocks");
  });

  it("accepts empty categories", () => {
    const tags: TagsByCategoriesResponse = { tags_by_categories: {} };
    expect(Object.keys(tags.tags_by_categories)).toHaveLength(0);
  });

  it("accepts categories with empty tag arrays", () => {
    const tags: TagsByCategoriesResponse = {
      tags_by_categories: { empty: [] },
    };
    expect(tags.tags_by_categories.empty).toHaveLength(0);
  });
});

describe("SeriesListParams", () => {
  it("all fields are optional", () => {
    const empty: SeriesListParams = {};
    expect(empty).toEqual({});
  });

  it("accepts all fields populated", () => {
    const full: SeriesListParams = {
      category: "politics",
      tags: "election,2025",
      include_product_metadata: true,
      include_volume: true,
    };
    expect(full.category).toBe("politics");
    expectTypeOf<SeriesListParams["include_product_metadata"]>().toEqualTypeOf<
      boolean | undefined
    >();
  });
});

describe("SeriesParams", () => {
  it("all fields are optional", () => {
    const empty: SeriesParams = {};
    expect(empty).toEqual({});
  });

  it("accepts include_volume", () => {
    const full: SeriesParams = { include_volume: true };
    expect(full.include_volume).toBe(true);
  });
});
