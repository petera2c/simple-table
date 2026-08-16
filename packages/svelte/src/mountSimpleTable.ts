import { mount, type Component } from "svelte";
import SimpleTable from "./SimpleTable.svelte";
import type { SimpleTableExports } from "./SimpleTable.svelte";
import type { SimpleTableSvelteProps, SvelteDefaultRowData } from "./types";

export type MountSimpleTableOptions<TData extends SvelteDefaultRowData> = {
  target: Document | Element | ShadowRoot;
  props: SimpleTableSvelteProps<TData>;
  intro?: boolean;
};

/**
 * Imperative mount with `TData` inferred from `props` (same role as typing
 * `<SimpleTable rows={…}>` in a Svelte template). Prefer this over bare
 * `mount(SimpleTable, …)`, whose typings collapse to the default row shape.
 */
export function mountSimpleTable<TData extends SvelteDefaultRowData>(
  options: MountSimpleTableOptions<TData>,
): SimpleTableExports<TData> {
  return mount(
    SimpleTable as Component<SimpleTableSvelteProps<TData>, SimpleTableExports<TData>>,
    options,
  );
}
