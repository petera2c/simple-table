<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { tableHeightConfig } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height: _height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let selectedHeight = $state("400px");
  const heights = ["200px", "300px", "400px"];
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px">
    {#each heights as h}
      <button
        onclick={() => selectedHeight = h}
        style="padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; background: {selectedHeight === h ? '#3b82f6' : '#f3f4f6'}; color: {selectedHeight === h ? '#fff' : '#374151'}; cursor: pointer; font-size: 14px; font-weight: 500;"
      >
        {h}
      </button>
    {/each}
  </div>
  <SimpleTable
    defaultHeaders={tableHeightConfig.headers}
    rows={tableHeightConfig.rows}
    height={selectedHeight}
    {theme}
  />
</div>
