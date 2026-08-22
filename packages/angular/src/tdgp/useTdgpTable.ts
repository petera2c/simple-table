import { DestroyRef, computed, effect, inject, signal, untracked } from "@angular/core";
import {
  createTdgpTableSource,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { AngularColumnDef, AngularDefaultRowData } from "../types";

export type UseTdgpTableOptions<TData extends AngularDefaultRowData = AngularDefaultRowData> = Omit<
  TdgpTableSourceOptions<TData>,
  "columns"
> & {
  columns: AngularColumnDef<TData>[];
};

function resolveOptions<TData extends AngularDefaultRowData>(
  options: UseTdgpTableOptions<TData> | (() => UseTdgpTableOptions<TData>),
): UseTdgpTableOptions<TData> {
  return typeof options === "function" ? options() : options;
}

function toSourceOptions<TData extends AngularDefaultRowData>(
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
 * Call from an injection context (component field or constructor). Pass a
 * getter if dataset, page size, or other query options should update. Bind
 * `[tableProps]` on `<simple-table>` for paging, sort, and filter.
 */
export function useTdgpTable<TData extends AngularDefaultRowData = AngularDefaultRowData>(
  options: UseTdgpTableOptions<TData> | (() => UseTdgpTableOptions<TData>),
) {
  const destroyRef = inject(DestroyRef);
  const source = createTdgpTableSource(toSourceOptions(resolveOptions(options)));
  const snapshot = signal(source.getSnapshot());

  const unsubscribe = source.subscribe(() => {
    snapshot.set(source.getSnapshot());
  });

  effect(() => {
    const next = resolveOptions(options);
    untracked(() => {
      source.applyOptions(toSourceOptions(next));
    });
  });

  source.start();

  destroyRef.onDestroy(() => {
    source.stop();
    unsubscribe();
  });

  return {
    rows: computed(() => snapshot().rows),
    columns: computed(() => snapshot().columns as AngularColumnDef<TData>[]),
    tableProps: computed(() => snapshot().tableProps),
    error: computed(() => snapshot().error),
    isLoading: computed(() => snapshot().isLoading),
    totalRowCount: computed(() => snapshot().totalRowCount),
  };
}
