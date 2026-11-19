<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SortColumn, GetRowIdParams } from "@simple-table/svelte";
  import { externalSortConfig } from "./external-sort.demo-data";
  import type { SortableEmployee } from "./external-sort.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let sortConfig = $state<SortColumn | null>(null);

  const getRowId = ({ row }: GetRowIdParams<SortableEmployee>) => row.id;

  let sortedRows = $derived.by(() => {
    const data = [...externalSortConfig.rows];
    if (!sortConfig) return data;

    const accessor = sortConfig.key.accessor as keyof SortableEmployee;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    return data.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (typeof aVal === "string" && typeof bVal === "string") return dir * aVal.localeCompare(bVal);
      return dir * (Number(aVal) - Number(bVal));
    });
  });

  function handleSortChange(sort: SortColumn | null) {
    sortConfig = sort;
  }
</script>

<SimpleTable
  columns={externalSortConfig.headers}
  rows={sortedRows}
  {getRowId}
  externalSortHandling={true}
  columnResizing={externalSortConfig.tableProps.columnResizing}
  onSortChange={handleSortChange}
  {height}
  {theme}
/>
