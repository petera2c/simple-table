<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getManufacturingStatusColors } from "./manufacturing.demo-data";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const colors = $derived(
    hasStations(row) ? null : getManufacturingStatusColors(d.status, theme),
  );
</script>

{#if hasStations(row)}
  —
{:else if colors}
  <span
    style="background-color:{colors.bg};color:{colors.text};padding:4px 12px;font-size:12px;line-height:20px;border-radius:4px;display:inline-block;font-weight:600;"
    >{d.status}</span>
{/if}
