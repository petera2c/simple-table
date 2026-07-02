<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const parent = $derived(hasStations(row));
  const rate = $derived(typeof d.defectRate === "number" ? d.defectRate : parseFloat(String(d.defectRate)));
  const color = $derived(rate < 1 ? "#16a34a" : rate < 3 ? "#f59e0b" : "#dc2626");
</script>

<span style="color:{color};font-weight:{parent ? 'bold' : 'normal'};">{rate.toFixed(2)}%</span>
