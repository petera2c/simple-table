import { describe, expect, it } from "vitest";
import {
  pivotRows,
  buildPivotAccessor,
  buildPivotRowTotalAccessor,
  PIVOT_CHILDREN_KEY,
  PIVOT_IS_TOTAL_KEY,
  PIVOT_BLANK_LABEL,
  type HeaderObject,
  type Row,
} from "simple-table-core";

const fieldHeaders: HeaderObject[] = [
  { accessor: "region", label: "Region", width: 120, type: "string" },
  { accessor: "product", label: "Product", width: 120, type: "string" },
  { accessor: "quarter", label: "Quarter", width: 80, type: "string" },
  { accessor: "sales", label: "Sales", width: 100, type: "number" },
  { accessor: "units", label: "Units", width: 80, type: "number" },
];

const sampleRows: Row[] = [
  { region: "West", product: "A", quarter: "Q1", sales: 100, units: 10 },
  { region: "West", product: "A", quarter: "Q2", sales: 120, units: 12 },
  { region: "West", product: "B", quarter: "Q1", sales: 50, units: 5 },
  { region: "East", product: "A", quarter: "Q1", sales: 80, units: 8 },
  { region: "East", product: "A", quarter: "Q2", sales: 90, units: 9 },
];

describe("pivotRows", () => {
  it("pivots a single row dim × single column dim with sum", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showColumnTotals: false,
        showRowTotals: false,
        showGrandTotal: false,
      },
    });

    expect(result.rowGrouping).toBeUndefined();
    expect(result.rows).toHaveLength(2);

    const west = result.rows.find((r) => r.region === "West")!;
    const east = result.rows.find((r) => r.region === "East")!;
    expect(west[buildPivotAccessor("Q1", "sales")]).toBe(150);
    expect(west[buildPivotAccessor("Q2", "sales")]).toBe(120);
    expect(east[buildPivotAccessor("Q1", "sales")]).toBe(80);
    expect(east[buildPivotAccessor("Q2", "sales")]).toBe(90);
  });

  it("adds row totals and a column totals row with grand total", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
      },
    });

    const west = result.rows.find((r) => r.region === "West")!;
    expect(west[buildPivotRowTotalAccessor("sales")]).toBe(270);

    const totalRow = result.rows.find((r) => r[PIVOT_IS_TOTAL_KEY] === true)!;
    expect(totalRow).toBeDefined();
    expect(totalRow.region).toBe("Total");
    expect(totalRow[buildPivotAccessor("Q1", "sales")]).toBe(230);
    expect(totalRow[buildPivotAccessor("Q2", "sales")]).toBe(210);
    expect(totalRow[buildPivotRowTotalAccessor("sales")]).toBe(440);
  });

  it("builds a tree for multi-level row dimensions", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region", "product"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showColumnTotals: false,
        showRowTotals: false,
      },
    });

    expect(result.rowGrouping).toEqual([PIVOT_CHILDREN_KEY]);
    const west = result.rows.find((r) => r.region === "West")!;
    const children = west[PIVOT_CHILDREN_KEY] as Row[];
    expect(children).toHaveLength(2);
    expect(west[buildPivotAccessor("Q1", "sales")]).toBe(150);

    const productA = children.find((c) => c.product === "A")!;
    expect(productA[buildPivotAccessor("Q1", "sales")]).toBe(100);
    expect(productA[buildPivotAccessor("Q2", "sales")]).toBe(120);
  });

  it("supports multiple value measures", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: ["quarter"],
        values: [
          { accessor: "sales", aggregation: { type: "sum" } },
          { accessor: "units", aggregation: { type: "sum" } },
        ],
        showColumnTotals: false,
        showRowTotals: false,
      },
    });

    const west = result.rows.find((r) => r.region === "West")!;
    expect(west[buildPivotAccessor("Q1", "sales")]).toBe(150);
    expect(west[buildPivotAccessor("Q1", "units")]).toBe(15);
  });

  it("supports average, count, min, max", () => {
    const rows: Row[] = [
      { region: "West", quarter: "Q1", sales: 10 },
      { region: "West", quarter: "Q1", sales: 30 },
    ];

    const base = {
      rows,
      fieldHeaders,
      pivot: {
        rows: ["region"] as const,
        columns: ["quarter"] as const,
        showColumnTotals: false as const,
        showRowTotals: false as const,
      },
    };

    const avg = pivotRows({
      ...base,
      pivot: { ...base.pivot, values: [{ accessor: "sales", aggregation: { type: "average" } }] },
    });
    expect(avg.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(20);

    const count = pivotRows({
      ...base,
      pivot: { ...base.pivot, values: [{ accessor: "sales", aggregation: { type: "count" } }] },
    });
    expect(count.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(2);

    const min = pivotRows({
      ...base,
      pivot: { ...base.pivot, values: [{ accessor: "sales", aggregation: { type: "min" } }] },
    });
    expect(min.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(10);

    const max = pivotRows({
      ...base,
      pivot: { ...base.pivot, values: [{ accessor: "sales", aggregation: { type: "max" } }] },
    });
    expect(max.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(30);
  });

  it("buckets null dimension values as (blank)", () => {
    const result = pivotRows({
      rows: [{ region: null, quarter: "Q1", sales: 5 } as Row],
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showColumnTotals: false,
        showRowTotals: false,
      },
    });

    expect(result.rows[0].region).toBe(PIVOT_BLANK_LABEL);
    expect(result.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(5);
  });

  it("with empty columns produces value-only aggregation grid", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: [],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showColumnTotals: false,
      },
    });

    const west = result.rows.find((r) => r.region === "West")!;
    expect(west[buildPivotAccessor("", "sales")]).toBe(270);
    // No row-total column when there are no column dims
    expect(west[buildPivotRowTotalAccessor("sales")]).toBeUndefined();
  });

  it("with empty rows produces a single aggregate row", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: [],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showRowTotals: false,
      },
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][buildPivotAccessor("Q1", "sales")]).toBe(230);
    expect(result.rows[0][buildPivotAccessor("Q2", "sales")]).toBe(210);
  });

  it("throws when values is empty", () => {
    expect(() =>
      pivotRows({
        rows: sampleRows,
        fieldHeaders,
        pivot: { rows: ["region"], columns: ["quarter"], values: [] },
      })
    ).toThrow(/values/);
  });

  it("pins row dimension columns left", () => {
    const result = pivotRows({
      rows: sampleRows,
      fieldHeaders,
      pivot: {
        rows: ["region"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
        showColumnTotals: false,
        showRowTotals: false,
      },
    });

    expect(result.headers[0].accessor).toBe("region");
    expect(result.headers[0].pinned).toBe("left");
  });
});
