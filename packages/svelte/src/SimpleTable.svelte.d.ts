import type { Component } from "svelte";
import type { TableAPI } from "simple-table-core";
import type { SimpleTableSvelteProps, SvelteDefaultRowData } from "./types";

/** Instance exports available via `bind:this` on `<SimpleTable>`. */
export type SimpleTableExports<
  TData extends SvelteDefaultRowData = SvelteDefaultRowData,
> = {
  getAPI: () => TableAPI<TData> | null;
};

/**
 * Typed Svelte component for a concrete row shape. Prefer
 * {@link mountSimpleTable} for imperative mounts so `TData` is inferred from
 * `props` without casts.
 */
export type SimpleTableComponent<
  TData extends SvelteDefaultRowData = SvelteDefaultRowData,
> = Component<SimpleTableSvelteProps<TData>, SimpleTableExports<TData>>;

/**
 * Declaration for the precompiled SimpleTable Svelte component.
 * Copied into dist/types so published `index.d.ts` can resolve
 * `export … from "./SimpleTable.svelte"`.
 *
 * Defaults `TData` for untyped usage; use {@link SimpleTableComponent} /
 * {@link mountSimpleTable} when mounting with a concrete row type.
 */
declare const SimpleTable: SimpleTableComponent;

export default SimpleTable;
