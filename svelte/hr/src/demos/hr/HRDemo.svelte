<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type {
    Theme,
    SvelteColumnDef,
    SvelteCellRenderer,
    CellChangeProps,
    GetRowIdParams,
  } from "@simple-table/svelte";
  import { hrConfig } from "./hr.demo-data";
  import type { HREmployee } from "./hr.demo-data";
  import HrFullNameCell from "./HrFullNameCell.svelte";
  import HrPerformanceCell from "./HrPerformanceCell.svelte";
  import HrHireDateCell from "./HrHireDateCell.svelte";
  import HrYearsCell from "./HrYearsCell.svelte";
  import HrSalaryCell from "./HrSalaryCell.svelte";
  import HrStatusCell from "./HrStatusCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state<HREmployee[]>([...hrConfig.rows]);

  const renderers: Partial<Record<string, SvelteCellRenderer<HREmployee>>> = {
    fullName: HrFullNameCell,
    performanceScore: HrPerformanceCell,
    hireDate: HrHireDateCell,
    yearsOfService: HrYearsCell,
    salary: HrSalaryCell,
    status: HrStatusCell,
  };

  const headers = $derived(
    hrConfig.headers.map((h): SvelteColumnDef<HREmployee> => {
      const cellRenderer = renderers[String(h.accessor)];
      return cellRenderer ? { ...h, cellRenderer } : { ...h };
    }),
  );

  const rowHeight = 48;
  const heightNum = $derived(typeof height === "number" ? height : 400);
  const rowsPerPage = $derived(Math.floor(heightNum / rowHeight));
  const getRowId = ({ row }: GetRowIdParams<HREmployee>) => row.id;

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps<HREmployee>) {
    data = data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item));
  }
</script>

<SimpleTable
  autoExpandColumns={true}
  columnReordering={true}
  columnResizing={true}
  customTheme={{ rowHeight }}
  columns={headers}
  {getRowId}
  onCellEdit={handleCellEdit}
  rows={data}
  {height}
  {rowsPerPage}
  selectableCells={true}
  enablePagination={true}
  {theme}
/>
