/**
 * Compile-time probe: TData should infer from `rows` without `<T>` on SimpleTable.
 * Uses JSX (not createElement) — createElement often fails to infer component generics.
 */
import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef, TableAPI } from "../index";

interface AnalyticsFactRow {
  id: number;
  metric: string;
  value: number;
}

const columns: ReactColumnDef<AnalyticsFactRow>[] = [
  { accessor: "metric", label: "Metric", width: 120 },
  { accessor: "value", label: "Value", width: 100, type: "number" },
];

const rows: AnalyticsFactRow[] = [{ id: 1, metric: "revenue", value: 10 }];

const ref = createRef<TableAPI<AnalyticsFactRow>>();

const inferred = (
  <SimpleTable
    ref={ref}
    columns={columns}
    rows={rows}
    getRowId={({ row }) => {
      const id: number = row.id;
      const metric: string = row.metric;
      void metric;
      return id;
    }}
  />
);
void inferred;

const missingPropShouldError = (
  <SimpleTable
    columns={columns}
    rows={rows}
    getRowId={({ row }) => {
      // @ts-expect-error — AnalyticsFactRow has no `missing`
      return row.missing;
    }}
  />
);
void missingPropShouldError;

const looseStillWorks = (
  <SimpleTable
    columns={[{ accessor: "x", label: "X", width: 40 }]}
    rows={[{ x: 1 }]}
    getRowId={({ row }) => row.x}
  />
);
void looseStillWorks;

// Annotated freestanding columns: no as const; valid literals assign; typos fail.
const freestandingColumns: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number", align: "right" },
];
const freestandingRows = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
];
const freestandingAccepted = (
  <SimpleTable columns={freestandingColumns} rows={freestandingRows} height="400px" />
);
void freestandingAccepted;

const _typoRejected: ReactColumnDef[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    // @ts-expect-error — "numbers" is not a ColumnType
    type: "numbers",
  },
];
void _typoRejected;

describe("SimpleTable TData inference", () => {
  it("compiles without an explicit JSX type argument", () => {
    expect(rows[0]?.id).toBe(1);
  });
});
