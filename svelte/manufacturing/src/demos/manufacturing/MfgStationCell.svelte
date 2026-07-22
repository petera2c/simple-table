<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const parent = $derived(hasStations(row));
</script>

{#if parent}
  <span style="color:#6b7280;">{d.id}</span>
{:else}
  <div style="display:flex;align-items:center;gap:4px;">
    <span
      style="background-color:#dbeafe;color:#1d4ed8;font-size:0.75rem;font-weight:500;padding:2px 6px;border-radius:4px;"
      >{d.id}</span>
    <span>{d.station}</span>
  </div>
{/if}
