<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps<ManufacturingRow> = $props();
  const parent = $derived(hasStations(row));
</script>

{#if parent}
  <span style="color:#6b7280;">{row.id}</span>
{:else}
  <div style="display:flex;align-items:center;gap:4px;">
    <span
      style="background-color:#dbeafe;color:#1d4ed8;font-size:0.75rem;font-weight:500;padding:2px 6px;border-radius:4px;"
      >{row.id}</span>
    <span>{row.station}</span>
  </div>
{/if}
