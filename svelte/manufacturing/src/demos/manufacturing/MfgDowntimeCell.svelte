<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const parent = $derived(hasStations(row));
  const hours = $derived(typeof d.downtime === "number" ? d.downtime : parseFloat(String(d.downtime)));
  const color = $derived(hours < 1 ? "#16a34a" : hours < 2 ? "#f59e0b" : "#dc2626");
</script>

<span style="color:{color};font-weight:{parent ? 'bold' : 'normal'};">{hours.toFixed(2)}</span>
