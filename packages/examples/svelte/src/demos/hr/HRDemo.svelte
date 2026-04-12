<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject, CellChangeProps } from "@simple-table/svelte";
  import { hrConfig } from "./hr.demo-data";
  import HrFullNameCell from "./HrFullNameCell.svelte";
  import HrPerformanceCell from "./HrPerformanceCell.svelte";
  import HrHireDateCell from "./HrHireDateCell.svelte";
  import HrYearsCell from "./HrYearsCell.svelte";
  import HrSalaryCell from "./HrSalaryCell.svelte";
  import HrStatusCell from "./HrStatusCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state([...hrConfig.rows]);

  const renderers: Record<string, unknown> = {
    fullName: HrFullNameCell,
    performanceScore: HrPerformanceCell,
    hireDate: HrHireDateCell,
    yearsOfService: HrYearsCell,
    salary: HrSalaryCell,
    status: HrStatusCell,
  };

  const headers = $derived(
    hrConfig.headers.map((h) => {
      const cellRenderer = renderers[h.accessor as string];
      return cellRenderer ? { ...h, cellRenderer } : { ...h };
    }),
  );

  const rowHeight = 48;
  const heightNum = $derived(typeof height === "number" ? height : 400);
  const rowsPerPage = $derived(Math.floor(heightNum / rowHeight));

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item));
  }
</script>

<SimpleTable
  columnReordering={true}
  columnResizing={true}
  customTheme={{ rowHeight }}
  defaultHeaders={headers}
  onCellEdit={handleCellEdit}
  rows={data}
  {height}
  {rowsPerPage}
  selectableCells={true}
  shouldPaginate={true}
  {theme}
/>
