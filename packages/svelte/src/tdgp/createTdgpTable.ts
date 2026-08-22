import { onDestroy, onMount } from "svelte";
import { writable, type Readable } from "svelte/store";
import {
  createTdgpTableSource,
  type TdgpTableSnapshot,
  type TdgpTableSourceOptions,
} from "simple-table-core";
import type { SvelteColumnDef, SvelteDefaultRowData } from "../types";

export type CreateTdgpTableOptions<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  Omit<TdgpTableSourceOptions<TData>, "columns"> & {
    columns: SvelteColumnDef<TData>[];
  };

export type TdgpTableView<TData extends SvelteDefaultRowData = SvelteDefaultRowData> = Omit<
  TdgpTableSnapshot<TData>,
  "columns"
> & {
  columns: SvelteColumnDef<TData>[];
};

export type TdgpTableStore<TData extends SvelteDefaultRowData = SvelteDefaultRowData> = Readable<
  TdgpTableView<TData>
> & {
  applyOptions: (next: CreateTdgpTableOptions<TData>) => void;
  destroy: () => void;
};

function toSourceOptions<TData extends SvelteDefaultRowData>(
  options: CreateTdgpTableOptions<TData>,
): TdgpTableSourceOptions<TData> {
  return {
    ...options,
    columns: options.columns as TdgpTableSourceOptions<TData>["columns"],
  };
}

function toView<TData extends SvelteDefaultRowData>(
  snapshot: TdgpTableSnapshot<TData>,
): TdgpTableView<TData> {
  return {
    ...snapshot,
    columns: snapshot.columns as SvelteColumnDef<TData>[],
  };
}

/**
 * Loads rows from a TDGP server and returns a store of Simple Table props for
 * server-side paging, sorting, filtering, and optional grouping.
 *
 * Call from a component script. Starts on mount and stops when the component
 * is destroyed. `$table.rows`, `$table.columns`, and `$table.tableProps` update
 * when the server answers.
 */
export function createTdgpTable<TData extends SvelteDefaultRowData = SvelteDefaultRowData>(
  options: CreateTdgpTableOptions<TData>,
): TdgpTableStore<TData> {
  const source = createTdgpTableSource(toSourceOptions(options));
  const store = writable(toView(source.getSnapshot()));

  const unsubscribe = source.subscribe(() => {
    store.set(toView(source.getSnapshot()));
  });

  let stopped = false;
  function destroy() {
    if (stopped) return;
    stopped = true;
    source.stop();
    unsubscribe();
  }

  try {
    onMount(() => {
      source.start();
    });
    onDestroy(destroy);
  } catch {
    source.start();
  }

  return {
    subscribe: store.subscribe,
    applyOptions(next) {
      source.applyOptions(toSourceOptions(next));
    },
    destroy,
  };
}
