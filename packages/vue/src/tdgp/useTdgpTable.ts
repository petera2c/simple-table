import { computed, onMounted, onUnmounted, shallowRef, watch } from "vue";
import {
  createTdgpTableSource,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { VueColumnDef, VueDefaultRowData } from "../types";

export type UseTdgpTableOptions<TData extends VueDefaultRowData = VueDefaultRowData> = Omit<
  TdgpTableSourceOptions<TData>,
  "columns"
> & {
  columns: VueColumnDef<TData>[];
};

function resolveOptions<TData extends VueDefaultRowData>(
  options: UseTdgpTableOptions<TData> | (() => UseTdgpTableOptions<TData>),
): UseTdgpTableOptions<TData> {
  return typeof options === "function" ? options() : options;
}

function toSourceOptions<TData extends VueDefaultRowData>(
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
export function useTdgpTable<TData extends VueDefaultRowData = VueDefaultRowData>(
  options: UseTdgpTableOptions<TData> | (() => UseTdgpTableOptions<TData>),
) {
  const source = createTdgpTableSource(toSourceOptions(resolveOptions(options)));
  const snapshot = shallowRef(source.getSnapshot());

  const unsubscribe = source.subscribe(() => {
    snapshot.value = source.getSnapshot();
  });

  watch(
    () => resolveOptions(options),
    (next) => {
      source.applyOptions(toSourceOptions(next));
    },
    { flush: "pre" },
  );

  onMounted(() => {
    source.start();
  });

  onUnmounted(() => {
    source.stop();
    unsubscribe();
  });

  return {
    rows: computed(() => snapshot.value.rows),
    columns: computed(() => snapshot.value.columns as VueColumnDef<TData>[]),
    tableProps: computed(() => snapshot.value.tableProps),
    error: computed(() => snapshot.value.error),
    isLoading: computed(() => snapshot.value.isLoading),
    totalRowCount: computed(() => snapshot.value.totalRowCount),
  };
}
