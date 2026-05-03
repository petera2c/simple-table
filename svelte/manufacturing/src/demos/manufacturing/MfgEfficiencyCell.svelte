<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import type { ManufacturingRow } from "./manufacturing.demo-data";
  import { hasStations } from "./mfg-helpers";

  let { row }: CellRendererProps = $props();
  const d = $derived(row as unknown as ManufacturingRow);
  const eff = $derived(d.efficiency);
  const parent = $derived(hasStations(row));
  const color = $derived(eff >= 90 ? "#52c41a" : eff >= 75 ? "#1890ff" : "#ff4d4f");
</script>

<div style="width:100%;display:flex;flex-direction:column;">
  <div style="background-color:#f5f5f5;height:6px;width:100%;border-radius:100px;overflow:hidden;">
    <div style="height:100%;width:{eff}%;background-color:{color};border-radius:100px;"></div>
  </div>
  <div style="font-size:12px;text-align:center;margin-top:4px;font-weight:{parent ? 'bold' : 'normal'};">
    {eff}%
  </div>
</div>
