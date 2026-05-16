<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject } from "@simple-table/svelte";
  import { manufacturingConfig } from "./manufacturing.demo-data";
  import MfgProductLineCell from "./MfgProductLineCell.svelte";
  import MfgStationCell from "./MfgStationCell.svelte";
  import MfgStatusCell from "./MfgStatusCell.svelte";
  import MfgBoldNumberCell from "./MfgBoldNumberCell.svelte";
  import MfgCycletimeCell from "./MfgCycletimeCell.svelte";
  import MfgEfficiencyCell from "./MfgEfficiencyCell.svelte";
  import MfgDefectRateCell from "./MfgDefectRateCell.svelte";
  import MfgDowntimeCell from "./MfgDowntimeCell.svelte";
  import MfgUtilizationCell from "./MfgUtilizationCell.svelte";
  import MfgMaintenanceDateCell from "./MfgMaintenanceDateCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const rendererMap: Record<string, unknown> = {
    productLine: MfgProductLineCell,
    station: MfgStationCell,
    status: MfgStatusCell,
    outputRate: MfgBoldNumberCell,
    cycletime: MfgCycletimeCell,
    efficiency: MfgEfficiencyCell,
    defectRate: MfgDefectRateCell,
    defectCount: MfgBoldNumberCell,
    downtime: MfgDowntimeCell,
    utilization: MfgUtilizationCell,
    energy: MfgBoldNumberCell,
    maintenanceDate: MfgMaintenanceDateCell,
  };

  const headers = $derived.by((): SvelteHeaderObject[] =>
    manufacturingConfig.headers.map((h) => {
      const cellRenderer = rendererMap[h.accessor as string];
      return cellRenderer ? { ...h, cellRenderer } : { ...h };
    }),
  );
</script>

<SimpleTable
  columnResizing={true}
  columnReordering={true}
  defaultHeaders={headers}
  {height}
  rowGrouping={["stations"]}
  rows={manufacturingConfig.rows}
  selectableCells={true}
  {theme}
/>
