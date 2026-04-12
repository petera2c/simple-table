<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme, CellChangeProps } from "@simple-table/svelte";
  import { cellEditingConfig } from "./cell-editing.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let data = $state([...cellEditingConfig.rows]);

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item
    );
  }
</script>

<SimpleTable
  defaultHeaders={cellEditingConfig.headers}
  rows={data}
  {height}
  {theme}
  onCellEdit={handleCellEdit}
/>
