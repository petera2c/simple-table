<script lang="ts" generics="TData extends Record<string, any> = Record<string, any>">
  import { onMount, onDestroy } from "svelte";
  import {
    SimpleTableVanilla,
    headersStructurallyEqual,
    rowsShallowUnchanged,
  } from "simple-table-core";
  import type { SimpleTableConfig, TableAPI } from "simple-table-core";
  import { buildVanillaConfig, resolveSvelteColumns } from "./buildVanillaConfig";
  import { MountRegistry } from "./MountRegistry";
  import type { SimpleTableSvelteProps, TableInstance } from "./types";

  // SimpleTable — Svelte adapter for simple-table-core.
  // Accepts the same props as SimpleTableProps with Svelte component types for renderers.
  // Prefer typed `rows` / `columns` (`SvelteColumnDef<MyRow>`) so TData flows into
  // callbacks. Use bind:this={tableRef} for TableAPI: tableRef.getAPI()?.sort(...)

  type $$Props = SimpleTableSvelteProps<TData>;

  export let rows: $$Props["rows"];
  export let columns: $$Props["columns"] = undefined;

  // All remaining optional props — spread via $$restProps
  let container: HTMLDivElement;
  let instance: TableInstance | null = null;
  const registry = new MountRegistry();

  /** Last headers/rows whose structure/content was applied via update. */
  let syncedColumns: ReadonlyArray<
    NonNullable<$$Props["columns"]>[number]
  > | undefined = undefined;
  let syncedRows: $$Props["rows"] | undefined = undefined;

  onMount(() => {
    const props = { rows, columns, ...$$restProps } as SimpleTableSvelteProps<TData>;
    instance = new SimpleTableVanilla(
      container,
      buildVanillaConfig(props, registry),
    ) as unknown as TableInstance;
    instance.mount();
    syncedColumns = resolveSvelteColumns(props);
    syncedRows = rows;
  });

  onDestroy(() => {
    instance?.destroy();
    instance = null;
    syncedColumns = undefined;
    syncedRows = undefined;
    registry.clear();
  });

  // Reactive update: skip no-op columns/rows when structure/content is unchanged.
  $: if (instance) {
    const props = { rows, columns, ...$$restProps } as SimpleTableSvelteProps<TData>;
    const fullConfig = buildVanillaConfig(props, registry);
    const patch: Partial<SimpleTableConfig> = { ...fullConfig };
    const resolvedColumns = resolveSvelteColumns(props);

    const headersUnchanged = headersStructurallyEqual(syncedColumns, resolvedColumns);
    syncedColumns = resolvedColumns;
    if (headersUnchanged) {
      delete patch.columns;
    }

    const rowsUnchanged = rowsShallowUnchanged(
      syncedRows as ReadonlyArray<object> | undefined,
      rows as ReadonlyArray<object>,
      props.getRowId as Parameters<typeof rowsShallowUnchanged>[2],
    );
    syncedRows = rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    instance.update(patch);
  }

  /** Expose the TableAPI for consumers using bind:this. */
  export function getAPI(): TableAPI<TData> | null {
    return (instance?.getAPI() as TableAPI<TData> | undefined) ?? null;
  }
</script>

<div bind:this={container}></div>
