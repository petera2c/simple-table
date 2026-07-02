<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const parent = $derived(hasStations(row));
</script>

{#if parent}
  <span style="font-weight:bold;">{d.utilization?.toFixed(0)}%</span>
{:else}
  {`${row.utilization}%`}
{/if}
