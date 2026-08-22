import { useEffect, useLayoutEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import {
  createTdgpTableSource,
  type TdgpTableSnapshot,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { ReactColumnDef, ReactDefaultRowData } from "../types";

export type UseTdgpTableOptions<TData extends ReactDefaultRowData = ReactDefaultRowData> = Omit<
  TdgpTableSourceOptions<TData>,
  "columns"
> & {
  columns: ReactColumnDef<TData>[];
};

function toSourceOptions<TData extends ReactDefaultRowData>(
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
 * A new `client` or `columns` object each render does not reload. A change to
 * dataset, page size, primary key, group fields, or aggregations does.
 */
export function useTdgpTable<TData extends ReactDefaultRowData = ReactDefaultRowData>(
  options: UseTdgpTableOptions<TData>,
): TdgpTableSnapshot<TData> {
  const [source] = useState(() => createTdgpTableSource(toSourceOptions(options)));

  const snapshot = useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);

  useLayoutEffect(() => {
    source.applyOptions(toSourceOptions(options));
  });

  useEffect(() => {
    source.start();
    return () => {
      source.stop();
    };
  }, [source]);

  return snapshot;
}
