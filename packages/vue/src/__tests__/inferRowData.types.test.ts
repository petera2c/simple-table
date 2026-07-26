/**
 * Compile-time probe: TData should infer from `rows` without `<T>` on SimpleTable.
 * Uses `h(SimpleTable, props)` — Vue's attrs runtime; typed via the generic export cast.
 * Calls are behind `false &&` so the component body never runs.
 */
import { h } from "vue";
import { describe, it, expect } from "vitest";
import { SimpleTable } from "../index";
import type { VueColumnDef } from "../index";

interface AnalyticsFactRow {
  id: number;
  metric: string;
  value: number;
}

const columns: VueColumnDef<AnalyticsFactRow>[] = [
  { accessor: "metric", label: "Metric", width: 120 },
  { accessor: "value", label: "Value", width: 100, type: "number" },
];

const rows: AnalyticsFactRow[] = [{ id: 1, metric: "revenue", value: 10 }];

false &&
  h(SimpleTable, {
    columns,
    rows,
    getRowId: ({ row }) => {
      const id: number = row.id;
      const metric: string = row.metric;
      void metric;
      return id;
    },
  });

false &&
  h(SimpleTable, {
    columns,
    rows,
    getRowId: ({ row }) => {
      // @ts-expect-error — AnalyticsFactRow has no `missing`
      return row.missing;
    },
  });

false &&
  h(SimpleTable, {
    columns: [{ accessor: "x", label: "X", width: 40 }],
    rows: [{ x: 1 }],
    getRowId: ({ row }) => row.x,
  });

describe("SimpleTable TData inference", () => {
  it("compiles without an explicit type argument", () => {
    expect(rows[0]?.id).toBe(1);
  });
});
