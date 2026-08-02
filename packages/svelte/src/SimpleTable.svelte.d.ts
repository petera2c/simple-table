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
 * Declaration for the precompiled SimpleTable Svelte component.
 * Copied into dist/types so published `index.d.ts` can resolve
 * `export … from "./SimpleTable.svelte"`.
 */
declare const SimpleTable: Component<
  SimpleTableSvelteProps,
  SimpleTableExports
>;

export default SimpleTable;
