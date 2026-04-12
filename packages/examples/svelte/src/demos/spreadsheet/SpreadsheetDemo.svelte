<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject, CellChangeProps } from "@simple-table/svelte";
  import { spreadsheetConfig, recalculateAmortization } from "./spreadsheet.demo-data";
  import type { SpreadsheetRow } from "./spreadsheet.demo-data";
  import { setSpreadsheetAddColumnHandler } from "./spreadsheet-add-header-handler";
  import SpreadsheetAddColumnHeader from "./SpreadsheetAddColumnHeader.svelte";
  import "@simple-table/svelte/styles.css";
  import "./spreadsheet-custom.css";

  let { height = "400px", theme = "light" as Theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state([...spreadsheetConfig.rows]);
  let additionalColumns = $state<SvelteHeaderObject[]>([]);
  let tableRef: any;

  $effect.pre(() => {
    setSpreadsheetAddColumnHandler(() => {
      const totalCols = spreadsheetConfig.headers.length + additionalColumns.length;
      const newCol: SvelteHeaderObject = {
        accessor: `column${totalCols + 1}`,
        label: `Column ${totalCols + 1}`,
        width: 120,
        minWidth: 80,
        type: "number",
        align: "right",
        isEditable: true,
        aggregation: { type: "sum" },
      };
      additionalColumns = [...additionalColumns, newCol];
    });
  });

  const headers = $derived.by((): SvelteHeaderObject[] => {
    const baseHeaders: SvelteHeaderObject[] = [...spreadsheetConfig.headers];
    return [
      ...baseHeaders,
      ...additionalColumns,
      {
        accessor: "actions",
        label: "",
        width: 100,
        minWidth: 100,
        filterable: false,
        type: "other" as const,
        disableReorder: true,
        headerRenderer: SpreadsheetAddColumnHeader,
      },
    ];
  });

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) => {
      if (item.id === row.id) {
        return recalculateAmortization(item as SpreadsheetRow, accessor, newValue as string | number);
      }
      return item;
    });
  }
</script>

<div class="spreadsheet-container">
  <SimpleTable
    bind:this={tableRef}
    columnBorders={true}
    columnReordering={true}
    columnResizing={true}
    defaultHeaders={headers}
    enableHeaderEditing={true}
    enableRowSelection={true}
    {height}
    onCellEdit={handleCellEdit}
    customTheme={{ rowHeight: 22 }}
    rows={data}
    selectableCells={true}
    selectableColumns={true}
    {theme}
    useOddEvenRowBackground={true}
  />
</div>
