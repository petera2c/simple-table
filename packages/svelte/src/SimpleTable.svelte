<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { SimpleTableVanilla } from "simple-table-core";
  import type { TableAPI } from "simple-table-core";
  import { buildVanillaConfig } from "./buildVanillaConfig";
  import { MountRegistry } from "./MountRegistry";
  import type { SimpleTableSvelteProps, TableInstance } from "./types";

  // SimpleTable — Svelte adapter for simple-table-core.
  // Accepts the same props as SimpleTableProps with Svelte component types for renderers.
  // Use bind:this={tableRef} to access the TableAPI: tableRef.getAPI()?.sort(...)

  type $$Props = SimpleTableSvelteProps;

  export let rows: $$Props["rows"];
  export let defaultHeaders: $$Props["defaultHeaders"];

  // All remaining optional props — spread via $$restProps
  let container: HTMLDivElement;
  let instance: TableInstance | null = null;
  const registry = new MountRegistry();

  onMount(() => {
    instance = new SimpleTableVanilla(
      container,
      buildVanillaConfig(
        { rows, defaultHeaders, ...$$restProps } as SimpleTableSvelteProps,
        registry,
      ),
    ) as unknown as TableInstance;
    instance.mount();
  });

  onDestroy(() => {
    instance?.destroy();
    instance = null;
    registry.clear();
  });

  // Reactive update: re-run whenever any prop changes.
  $: if (instance) {
    instance.update(
      buildVanillaConfig(
        { rows, defaultHeaders, ...$$restProps } as SimpleTableSvelteProps,
        registry,
      ),
    );
  }

  /** Expose the TableAPI for consumers using bind:this. */
  export function getAPI(): TableAPI | null {
    return instance?.getAPI() ?? null;
  }
</script>

<div bind:this={container}></div>
