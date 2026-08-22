import { createEffect, createSignal, onCleanup, onMount, type Accessor } from "solid-js";
import {
  createTdgpTableSource,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { SolidColumnDef, SolidDefaultRowData } from "../types";

export type UseTdgpTableOptions<TData extends SolidDefaultRowData = SolidDefaultRowData> = Omit<
  TdgpTableSourceOptions<TData>,
  "columns"
> & {
  columns: SolidColumnDef<TData>[];
};

function resolveOptions<TData extends SolidDefaultRowData>(
  options: UseTdgpTableOptions<TData> | Accessor<UseTdgpTableOptions<TData>>,
): UseTdgpTableOptions<TData> {
  return typeof options === "function"
    ? (options as Accessor<UseTdgpTableOptions<TData>>)()
    : options;
}

function toSourceOptions<TData extends SolidDefaultRowData>(
  options: UseTdgpTableOptions<TData>,
): TdgpTableSourceOptions<TData> {
  return {
    ...options,
    columns: options.columns as TdgpTableSourceOptions<TData>["columns"],
  };
}

/**
 * Loads rows from a TDGP server and returns Simple Table props for
 * server-side paging, sorting, filtering, and optional grouping.
 *
 * Pass a getter if dataset, page size, or other query options should update.
 * A new client or columns object does not reload. A change to dataset, page
 * size, primary key, group fields, or aggregations does.
 */
export function useTdgpTable<TData extends SolidDefaultRowData = SolidDefaultRowData>(
  options: UseTdgpTableOptions<TData> | Accessor<UseTdgpTableOptions<TData>>,
) {
  const source = createTdgpTableSource(toSourceOptions(resolveOptions(options)));
  const [snapshot, setSnapshot] = createSignal(source.getSnapshot(), { equals: false });

  const unsubscribe = source.subscribe(() => {
    setSnapshot(source.getSnapshot());
  });

  createEffect(() => {
    source.applyOptions(toSourceOptions(resolveOptions(options)));
  });

  onMount(() => {
    source.start();
  });

  onCleanup(() => {
    source.stop();
    unsubscribe();
  });

  return {
    rows: () => snapshot().rows,
    columns: () => snapshot().columns as SolidColumnDef<TData>[],
    tableProps: () => snapshot().tableProps,
    error: () => snapshot().error,
    isLoading: () => snapshot().isLoading,
    totalRowCount: () => snapshot().totalRowCount,
  };
}
