/**
 * Compile-time probe: TData should flow from typed `rows` / `columns` on
 * SimpleTableAngularProps without casts in callbacks.
 */
import { describe, it, expect } from "vitest";
import type { AngularColumnDef, SimpleTableAngularProps } from "../index";

interface AnalyticsFactRow {
  id: number;
  metric: string;
  value: number;
}

const columns: AngularColumnDef<AnalyticsFactRow>[] = [
  { accessor: "metric", label: "Metric", width: 120 },
  { accessor: "value", label: "Value", width: 100, type: "number" },
];

const rows: AnalyticsFactRow[] = [{ id: 1, metric: "revenue", value: 10 }];

const typedProps: SimpleTableAngularProps<AnalyticsFactRow> = {
  columns,
  rows,
  getRowId: ({ row }) => {
    const id: number = row.id;
    const metric: string = row.metric;
    void metric;
    return id;
  },
};
void typedProps;

const badProps: SimpleTableAngularProps<AnalyticsFactRow> = {
  columns,
  rows,
  getRowId: ({ row }) => {
    // @ts-expect-error — AnalyticsFactRow has no `missing`
    return row.missing;
  },
};
void badProps;

const looseProps: SimpleTableAngularProps = {
  columns: [{ accessor: "x", label: "X", width: 40 }],
  rows: [{ x: 1 }],
  getRowId: ({ row }) => row.x,
};
void looseProps;

describe("SimpleTable TData inference", () => {
  it("compiles without an explicit type argument on column defs", () => {
    expect(rows[0]?.id).toBe(1);
  });
});
