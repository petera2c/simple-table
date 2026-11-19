<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, CellChangeProps, GetRowIdParams } from "@simple-table/svelte";
  import { cellEditingConfig } from "./cell-editing.demo-data";
  import type { CellEditingEmployee } from "./cell-editing.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let data = $state<CellEditingEmployee[]>([...cellEditingConfig.rows]);

  const getRowId = ({ row }: GetRowIdParams<CellEditingEmployee>) => row.id;

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps<CellEditingEmployee>) {
    data = data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item
    );
  }
</script>

<SimpleTable
  columns={cellEditingConfig.headers}
  rows={data}
  getRowId={getRowId}
  {height}
  {theme}
  onCellEdit={handleCellEdit}
/>
