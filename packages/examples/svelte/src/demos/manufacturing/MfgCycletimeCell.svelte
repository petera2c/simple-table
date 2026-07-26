<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps<ManufacturingRow> = $props();
  const parent = $derived(hasStations(row));
</script>

{#if parent}
  <span style="font-weight:bold;">{row.cycletime?.toFixed(1)}</span>
{:else}
  {String(row.cycletime)}
{/if}
