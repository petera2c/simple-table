<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row, value }: CellRendererProps<ManufacturingRow> = $props();
  const num = $derived(Number(value));
  const parent = $derived(hasStations(row));
</script>

<div style={parent ? "font-weight:bold;" : ""}>{num.toLocaleString()}</div>
