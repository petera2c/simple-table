<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { pivotDemoConfig, pivotPresets } from "./pivot.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let activeId = $state(pivotPresets[0].id);
  const active = $derived(pivotPresets.find((p) => p.id === activeId) ?? pivotPresets[0]);
  const nestedRows = $derived(active.pivot.rows.length > 1);
</script>

<div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    {#each pivotPresets as preset}
      <button
        type="button"
        onclick={() => (activeId = preset.id)}
        style="padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; background: {preset.id ===
        activeId
          ? '#2563eb'
          : '#e5e7eb'}; color: {preset.id === activeId ? '#fff' : '#374151'}"
      >
        {preset.label}
      </button>
    {/each}
  </div>
  <SimpleTable
    defaultHeaders={pivotDemoConfig.headers}
    rows={pivotDemoConfig.rows}
    pivot={active.pivot}
    columnResizing={true}
    expandAll={nestedRows}
    selectableCells={true}
    {height}
    {theme}
  />
</div>
