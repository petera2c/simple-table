import { describe, expect, it, vi } from "vitest";
import { createTdgpTableSource } from "../tdgp/createTdgpTableSource";
import { setNestedChildren } from "../tdgp/setNestedChildren";
import { sortColumnToTdgpSort } from "../tdgp/sortColumnToTdgpSort";
import {
  TDGP_CHILDREN_ACCESSOR,
  TDGP_GROUP_KEYS,
  type TdgpQueryClient,
  type TdgpQueryRequest,
  type TdgpTableSource,
} from "../tdgp/types";
import type { ColumnDef } from "../index";
import type Row from "../types/Row";
import type SortColumn from "../types/SortColumn";

const columns: ColumnDef[] = [
  { accessor: "country", label: "Country", width: 140, type: "string" },
  { accessor: "salary", label: "Salary", width: 120, type: "number" },
  { accessor: "id", label: "ID", width: 80, type: "number" },
];

function waitFor(
  source: TdgpTableSource<Row>,
  predicate: () => boolean,
  timeoutMs = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (predicate()) {
      resolve();
      return;
    }
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error("Timed out waiting for source update"));
    }, timeoutMs);
    const unsubscribe = source.subscribe(() => {
      if (predicate()) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      }
    });
  });
}

function requestArgs(query: ReturnType<typeof vi.fn>): TdgpQueryRequest[] {
  return (query.mock.calls as unknown as Array<[string, TdgpQueryRequest?]>).map(
    (call) => call[1] ?? {},
  );
}

describe("sortColumnToTdgpSort", () => {
  it("maps a column sort to field and direction", () => {
    const sort: SortColumn = { key: columns[1], direction: "desc" };
    expect(sortColumnToTdgpSort(sort)).toEqual([{ field: "salary", dir: "desc" }]);
  });

  it("returns undefined when sort is cleared", () => {
    expect(sortColumnToTdgpSort(null)).toBeUndefined();
  });
});

describe("setNestedChildren", () => {
  it("writes children onto the row at the given path", () => {
    const rows = [
      { id: 1, country: "France", [TDGP_CHILDREN_ACCESSOR]: [] as { id: number }[] },
      { id: 2, country: "Spain", [TDGP_CHILDREN_ACCESSOR]: [] as { id: number }[] },
    ];
    const next = setNestedChildren(rows, [1], [TDGP_CHILDREN_ACCESSOR], [{ id: 9, name: "Ada" }]);
    expect(next[0][TDGP_CHILDREN_ACCESSOR]).toEqual([]);
    expect(next[1][TDGP_CHILDREN_ACCESSOR]).toEqual([{ id: 9, name: "Ada" }]);
    expect(rows[1][TDGP_CHILDREN_ACCESSOR]).toEqual([]);
  });
});

describe("createTdgpTableSource", () => {
  it("loads the first page and exposes server-side table props", async () => {
    const query = vi.fn(async (_dataset: string, request?: { start?: number; limit?: number }) => ({
      protocol: "tdgp/1",
      data: [
        { id: 1, country: "France", salary: 120000 },
        { id: 2, country: "Spain", salary: 110000 },
      ],
      totalCount: 10000,
    }));

    const source = createTdgpTableSource({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      pageSize: 50,
    });
    source.start();

    await waitFor(source, () => source.getSnapshot().isLoading === false);

    const snapshot = source.getSnapshot();
    expect(query).toHaveBeenCalledWith("developers-10k", expect.objectContaining({ start: 0, limit: 50 }));
    expect(snapshot.rows).toHaveLength(2);
    expect(snapshot.totalRowCount).toBe(10000);
    expect(snapshot.tableProps.enablePagination).toBe(true);
    expect(snapshot.tableProps.serverSidePagination).toBe(true);
    expect(snapshot.tableProps.externalSortHandling).toBe(true);
    expect(snapshot.tableProps.externalFilterHandling).toBe(true);

    source.getSnapshot().tableProps.onPageChange(2);
    await waitFor(source, () => requestArgs(query).some((request) => request.start === 50));
    expect(query).toHaveBeenCalledWith("developers-10k", expect.objectContaining({ start: 50, limit: 50 }));
  });

  it("sends sort and filter on the next query and resets to page 1", async () => {
    const query = vi.fn(async () => ({
      protocol: "tdgp/1",
      data: [{ id: 1, country: "France", salary: 120000 }],
      totalCount: 1,
    }));

    const source = createTdgpTableSource({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      pageSize: 25,
    });
    source.start();
    await waitFor(source, () => !source.getSnapshot().isLoading);

    source.getSnapshot().tableProps.onSortChange({ key: columns[1], direction: "desc" });
    await waitFor(source, () => requestArgs(query).some((request) => request.sort?.[0]?.field === "salary"));

    source.getSnapshot().tableProps.onFilterChange({
      age: { accessor: "age", operator: "greaterThan", value: 30 },
    });
    await waitFor(source, () =>
      requestArgs(query).some(
        (request) => request.filter && "operator" in request.filter && request.filter.operator === "GT",
      ),
    );

    const lastCall = requestArgs(query).at(-1);
    expect(lastCall?.start).toBe(0);
    expect(lastCall?.sort).toEqual([{ field: "salary", dir: "desc" }]);
    expect(lastCall?.filter).toEqual({
      kind: "predicate",
      field: "age",
      operator: "GT",
      args: [30],
    });
  });

  it("loads group nodes, then children when a group expands", async () => {
    const query = vi.fn(async (_dataset: string, request?: { groupKeys?: string[] }) => {
      if (!request?.groupKeys?.length) {
        return {
          protocol: "tdgp/1",
          data: [
            {
              keys: ["France"],
              data: { country: "France" },
              aggregations: { salary: 128000 },
            },
          ],
          totalCount: 24,
        };
      }
      return {
        protocol: "tdgp/1",
        data: [{ id: 11, firstName: "Ada", country: "France", salary: 150000 }],
        totalCount: 1,
      };
    });

    const source = createTdgpTableSource({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      groupBy: ["country"],
      aggregations: [{ id: "salary", field: "salary", fn: "sum" }],
    });
    source.start();
    await waitFor(source, () => !source.getSnapshot().isLoading);

    const top = source.getSnapshot();
    expect(top.rows).toHaveLength(1);
    expect(top.rows[0]).toMatchObject({
      country: "France",
      salary: 128000,
      [TDGP_GROUP_KEYS]: ["France"],
    });
    expect(top.tableProps.rowGrouping).toEqual([TDGP_CHILDREN_ACCESSOR]);
    expect(top.columns[0]?.expandable).toBe(true);

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setEmpty = vi.fn();
    await top.tableProps.onRowGroupExpand?.({
      row: top.rows[0],
      depth: 0,
      event: new MouseEvent("click"),
      groupingKey: TDGP_CHILDREN_ACCESSOR,
      isExpanded: true,
      rowIndexPath: [0],
      groupingKeys: [TDGP_CHILDREN_ACCESSOR],
      setLoading,
      setError,
      setEmpty,
    });

    const expanded = source.getSnapshot();
    expect(query).toHaveBeenCalledWith(
      "developers-10k",
      expect.objectContaining({ groupKeys: ["France"] }),
    );
    expect(expanded.rows[0][TDGP_CHILDREN_ACCESSOR]).toEqual([
      { id: 11, firstName: "Ada", country: "France", salary: 150000 },
    ]);
  });
});
