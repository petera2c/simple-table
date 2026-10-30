<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps<ManufacturingRow> = $props();
  const parent = $derived(hasStations(row));
  const rate = $derived(typeof row.defectRate === "number" ? row.defectRate : parseFloat(String(row.defectRate)));
  const color = $derived(rate < 1 ? "#16a34a" : rate < 3 ? "#f59e0b" : "#dc2626");
</script>

<span style="color:{color};font-weight:{parent ? 'bold' : 'normal'};">{rate.toFixed(2)}%</span>
