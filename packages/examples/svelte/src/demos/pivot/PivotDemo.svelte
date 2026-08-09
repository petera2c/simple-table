<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams, PivotConfig } from "@simple-table/svelte";
  import { pivotDemoConfig } from "./pivot.demo-data";
  import type { PivotFact } from "./pivot.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "500px", theme }: { height?: string | number; theme?: Theme } = $props();

  const INITIAL_PIVOT: PivotConfig = {
    rows: ["region", "product"],
    columns: ["quarter"],
    values: [{ accessor: "sales", aggregation: { type: "sum" } }],
  };

  let pivotEnabled = $state(true);
  let pivot = $state<PivotConfig | null>(INITIAL_PIVOT);

  const handlePivotEnabledChange = (enabled: boolean) => {
    pivotEnabled = enabled;
    if (enabled && pivot === null) {
      pivot = INITIAL_PIVOT;
    }
  };

  const getRowId = ({ row }: GetRowIdParams<PivotFact>) =>
    row?.id == null ? undefined : String(row.id);
</script>

<div>
  <label
    style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 14px; color: #374151"
  >
    <input
      type="checkbox"
      checked={pivotEnabled}
      aria-label="Pivot mode"
      onchange={(e) => handlePivotEnabledChange(e.currentTarget.checked)}
    />
    Pivot mode
  </label>
  <SimpleTable
    columns={pivotDemoConfig.headers}
    rows={pivotDemoConfig.rows}
    pivot={pivotEnabled ? pivot : null}
    onPivotChange={(next) => (pivot = next)}
    autoExpandColumns={true}
    columnResizing={true}
    enableColumnEditor={true}
    enableColumnEditorInitOpen={true}
    enablePivotPanel={pivotEnabled}
    selectableCells={true}
    {getRowId}
    {height}
    {theme}
  />
</div>
