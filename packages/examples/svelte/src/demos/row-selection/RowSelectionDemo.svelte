<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, RowSelectionChangeProps } from "@simple-table/svelte";
  import { rowSelectionConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let selectedRows = $state<Set<string>>(new Set());

  let selectedCount = $derived(selectedRows.size);

  function handleRowSelectionChange(props: RowSelectionChangeProps) {
    selectedRows = new Set(props.selectedRows);
  }
</script>

<div>
  <div style="margin-bottom: 12px;">
    Selected rows: <strong>{selectedCount}</strong>
  </div>
  <SimpleTable
    defaultHeaders={rowSelectionConfig.headers}
    rows={rowSelectionConfig.rows}
    enableRowSelection={true}
    onRowSelectionChange={handleRowSelectionChange}
    {height}
    {theme}
  />
</div>
