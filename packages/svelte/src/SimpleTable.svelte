<script lang="ts">
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
  // Use bind:this={tableRef} to access the TableAPI: tableRef.getAPI()?.sort(...)

  type $$Props = SimpleTableSvelteProps;

  export let rows: $$Props["rows"];
  export let defaultHeaders: $$Props["defaultHeaders"] = undefined;
  export let columns: $$Props["columns"] = undefined;

  // All remaining optional props — spread via $$restProps
  let container: HTMLDivElement;
  let instance: TableInstance | null = null;
  const registry = new MountRegistry();

  /** Last headers/rows whose structure/content was applied via update. */
  let syncedDefaultHeaders: ReadonlyArray<
    NonNullable<$$Props["columns"]>[number]
  > | undefined = undefined;
  let syncedRows: $$Props["rows"] | undefined = undefined;

  onMount(() => {
    const props = { rows, defaultHeaders, columns, ...$$restProps } as SimpleTableSvelteProps;
    instance = new SimpleTableVanilla(
      container,
      buildVanillaConfig(props, registry),
    ) as unknown as TableInstance;
    instance.mount();
    syncedDefaultHeaders = resolveSvelteColumns(props);
    syncedRows = rows;
  });

  onDestroy(() => {
    instance?.destroy();
    instance = null;
    syncedDefaultHeaders = undefined;
    syncedRows = undefined;
    registry.clear();
  });

  // Reactive update: skip no-op columns/rows when structure/content is unchanged.
  $: if (instance) {
    const props = { rows, defaultHeaders, columns, ...$$restProps } as SimpleTableSvelteProps;
    const fullConfig = buildVanillaConfig(props, registry);
    const patch: Partial<SimpleTableConfig> = { ...fullConfig };
    const resolvedColumns = resolveSvelteColumns(props);

    const headersUnchanged = headersStructurallyEqual(syncedDefaultHeaders, resolvedColumns);
    syncedDefaultHeaders = resolvedColumns;
    if (headersUnchanged) {
      delete patch.defaultHeaders;
    }

    const rowsUnchanged = rowsShallowUnchanged(
      syncedRows as ReadonlyArray<object> | undefined,
      rows as ReadonlyArray<object>,
      props.getRowId,
    );
    syncedRows = rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    instance.update(patch);
  }

  /** Expose the TableAPI for consumers using bind:this. */
  export function getAPI(): TableAPI | null {
    return instance?.getAPI() ?? null;
  }
</script>

<div bind:this={container}></div>
