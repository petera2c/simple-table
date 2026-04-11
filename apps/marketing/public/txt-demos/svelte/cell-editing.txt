<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { CellChangeProps } from "simple-table-core";
  import { cellEditingConfig } from "@simple-table/examples-shared";
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
