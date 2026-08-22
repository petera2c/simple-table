import type ColumnDef from "../types/ColumnDef";
import type { TableFilterState } from "../types/FilterTypes";
import type { GetRowIdParams } from "../types/GetRowId";
import type OnRowGroupExpandProps from "../types/OnRowGroupExpandProps";
import type Row from "../types/Row";
import type { RowData } from "../types/Row";
import type SortColumn from "../types/SortColumn";
import { headersStructurallyEqual } from "../utils/propSyncEqual";
import { getTdgpGroupKeys, isTdgpGroupNode, tdgpGroupNodesToRows } from "./mapGroupResponse";
import { setNestedChildren } from "./setNestedChildren";
import { sortColumnToTdgpSort } from "./sortColumnToTdgpSort";
import { tableFiltersToTdgpFilter } from "./tableFiltersToTdgpFilter";
import {
  TDGP_CHILDREN_ACCESSOR,
  type TdgpQueryRequest,
  type TdgpTableSnapshot,
  type TdgpTableSource,
  type TdgpTableSourceOptions,
  type TdgpTableProps,
} from "./types";

function withExpandableGroupColumn<TData extends RowData>(
  columns: ColumnDef<TData, any>[],
  groupBy: string[] | undefined,
): ColumnDef<TData, any>[] {
  if (!groupBy?.length) return columns;
  const target = groupBy[0];
  return columns.map((column) =>
    column.accessor === target || (column === columns[0] && !columns.some((c) => c.accessor === target))
      ? { ...column, expandable: true }
      : column,
  );
}

/** Dataset, page size, key field, groups, and aggregations — not client or columns identity. */
function queryShapeKey<TData extends RowData>(options: TdgpTableSourceOptions<TData>): string {
  const groupBy = options.groupBy?.join("\0") ?? "";
  const aggregations =
    options.aggregations?.map((item) => `${item.id}:${item.field}:${item.fn}`).join("|") ?? "";
  return `${options.dataset}\n${options.pageSize ?? 50}\n${options.primaryKey ?? "id"}\n${groupBy}\n${aggregations}`;
}

/**
 * Loads pages, sorts, filters, and optional groups from a TDGP server
 * and exposes the Simple Table props that keep that data in sync.
 */
export function createTdgpTableSource<TData extends RowData = Row>(
  initialOptions: TdgpTableSourceOptions<TData>,
): TdgpTableSource<TData> {
  let options = initialOptions;
  const childrenAccessor = TDGP_CHILDREN_ACCESSOR;

  let page = 1;
  let sort: SortColumn | null = null;
  let filters: TableFilterState<TData> = {};
  let rows: TData[] = [];
  let totalRowCount = 0;
  let isLoading = true;
  let error: string | null = null;
  let loadGeneration = 0;
  let stopped = false;
  let started = false;

  const listeners = new Set<() => void>();

  function pageSize(): number {
    return options.pageSize ?? 50;
  }

  function primaryKey(): string {
    return options.primaryKey ?? "id";
  }

  function groupingKeys(): string[] | undefined {
    return options.groupBy?.map(() => childrenAccessor);
  }

  function resolvedColumns(): ColumnDef<TData, any>[] {
    return withExpandableGroupColumn(options.columns, options.groupBy);
  }

  const getRowId = (params: GetRowIdParams<TData>) => {
    const row = params.row as Record<string, unknown> | undefined;
    const groupKeys = getTdgpGroupKeys(row);
    if (groupKeys) return `group:${groupKeys.join("/")}`;
    const value = row?.[primaryKey()];
    return value == null ? undefined : String(value);
  };

  const handlePageChange = (nextPage: number) => {
    page = nextPage;
    void load();
  };

  const handleSortChange = (nextSort: SortColumn | null) => {
    sort = nextSort;
    page = 1;
    void load();
  };

  const handleFilterChange = (nextFilters: TableFilterState<TData>) => {
    filters = nextFilters;
    page = 1;
    void load();
  };

  const handleRowGroupExpand = async (props: OnRowGroupExpandProps<TData>) => {
    const groupBy = options.groupBy;
    const keys = groupingKeys();
    if (!groupBy?.length || !keys) return;
    if (!props.isExpanded) return;

    const row = props.row as Record<string, unknown>;
    const field = props.groupingKey ? String(props.groupingKey) : childrenAccessor;
    const existing = row[field];
    if (Array.isArray(existing) && existing.length > 0) return;

    const parentKeys = getTdgpGroupKeys(row);
    if (!parentKeys) return;

    props.setLoading(true);
    try {
      const response = await options.client.query(
        options.dataset,
        buildRequest({ groupKeys: parentKeys, start: 0, limit: Math.max(pageSize(), 500) }),
      );
      const childRows = mapResponseRows(response.data, parentKeys.length);
      if (childRows.length === 0) {
        props.setEmpty(true, "No rows");
        return;
      }
      rows = setNestedChildren(rows as Row[], props.rowIndexPath, keys, childRows as Row[]) as TData[];
      emit();
      props.setLoading(false);
    } catch (err) {
      props.setError(err instanceof Error ? err.message : "Failed to load rows");
    }
  };

  function buildRequest(overrides: { groupKeys?: string[]; start?: number; limit?: number }): TdgpQueryRequest {
    const size = pageSize();
    const groupBy = options.groupBy;
    const aggregations = options.aggregations;
    const request: TdgpQueryRequest = {
      start: overrides.start ?? (page - 1) * size,
      limit: overrides.limit ?? size,
      sort: sortColumnToTdgpSort(sort),
      filter: tableFiltersToTdgpFilter(filters),
      process: { pagination: "server" },
    };

    if (groupBy?.length) {
      request.groupBy = groupBy.map((field) => ({ field }));
      request.groupKeys = overrides.groupKeys ?? [];
      request.process = {
        ...request.process,
        group: "server",
        ...(aggregations?.length ? { aggregation: "server" } : {}),
      };
      if (aggregations?.length) request.aggregations = aggregations;
    }

    return request;
  }

  function mapResponseRows(data: unknown[], groupKeyCount: number): TData[] {
    const groupBy = options.groupBy;
    if (groupBy?.length && groupKeyCount < groupBy.length && data.some(isTdgpGroupNode)) {
      return tdgpGroupNodesToRows(data, childrenAccessor) as TData[];
    }
    return data.filter((row) => row && typeof row === "object" && !isTdgpGroupNode(row)) as TData[];
  }

  function buildTableProps(): TdgpTableProps<TData> {
    const keys = groupingKeys();
    return {
      enablePagination: true,
      serverSidePagination: true,
      rowsPerPage: pageSize(),
      totalRowCount,
      isLoading,
      externalSortHandling: true,
      externalFilterHandling: true,
      onPageChange: handlePageChange,
      onSortChange: handleSortChange,
      onFilterChange: handleFilterChange,
      getRowId,
      ...(keys ? { rowGrouping: keys, onRowGroupExpand: handleRowGroupExpand } : {}),
    };
  }

  let snapshot: TdgpTableSnapshot<TData> = {
    rows,
    columns: resolvedColumns(),
    isLoading,
    error,
    totalRowCount,
    tableProps: buildTableProps(),
  };

  function emit() {
    snapshot = {
      rows,
      columns: resolvedColumns(),
      isLoading,
      error,
      totalRowCount,
      tableProps: buildTableProps(),
    };
    listeners.forEach((listener) => listener());
  }

  async function load() {
    const generation = ++loadGeneration;
    isLoading = true;
    error = null;
    emit();
    try {
      const response = await options.client.query(options.dataset, buildRequest({}));
      if (stopped || generation !== loadGeneration) return;
      rows = mapResponseRows(response.data, 0);
      totalRowCount = response.totalCount;
      isLoading = false;
      emit();
    } catch (err) {
      if (stopped || generation !== loadGeneration) return;
      error = err instanceof Error ? err.message : "Failed to load rows";
      isLoading = false;
      emit();
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    start() {
      stopped = false;
      started = true;
      void load();
    },
    stop() {
      stopped = true;
      loadGeneration += 1;
    },
    reload() {
      void load();
    },
    applyOptions(next) {
      const prev = options;
      options = next;
      if (!started || stopped) return;

      if (queryShapeKey(prev) !== queryShapeKey(next)) {
        page = 1;
        void load();
        return;
      }

      if (!headersStructurallyEqual(prev.columns, next.columns)) {
        emit();
      }
    },
  };
}
