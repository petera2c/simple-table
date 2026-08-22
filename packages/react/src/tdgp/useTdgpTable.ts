import { useEffect, useMemo } from "react";
import { useSyncExternalStore } from "react";
import {
  createTdgpTableSource,
  type TdgpTableSnapshot,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { ReactDefaultRowData } from "../types";

/**
 * Loads rows from a TDGP server and returns Simple Table props for
 * server-side paging, sorting, filtering, and optional grouping.
 */
export function useTdgpTable<TData extends ReactDefaultRowData = ReactDefaultRowData>(
  options: TdgpTableSourceOptions<TData>,
): TdgpTableSnapshot<TData> {
  const groupByKey = options.groupBy?.join("\0") ?? "";
  const aggregationsKey =
    options.aggregations?.map((item) => `${item.id}:${item.field}:${item.fn}`).join("|") ?? "";

  const source = useMemo(
    () => createTdgpTableSource(options),
    [options.client, options.dataset, options.pageSize, options.primaryKey, options.columns, groupByKey, aggregationsKey],
  );

  const snapshot = useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);

  useEffect(() => {
    source.start();
    return () => {
      source.stop();
    };
  }, [source]);

  return snapshot;
}
