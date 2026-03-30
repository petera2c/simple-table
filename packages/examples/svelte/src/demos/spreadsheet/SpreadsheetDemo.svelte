<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject, CellChangeProps } from "simple-table-core";
  import { spreadsheetConfig, recalculateAmortization } from "@simple-table/examples-shared";
  import type { SpreadsheetRow } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";
  import "@simple-table/examples-shared/styles/spreadsheet-custom.css";

  let { height = "400px", theme = "light" as Theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state([...spreadsheetConfig.rows]);
  let additionalColumns = $state<HeaderObject[]>([]);
  let tableRef: any;

  const headers = $derived.by((): HeaderObject[] => {
    const baseHeaders: HeaderObject[] = [...spreadsheetConfig.headers];
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
        headerRenderer: () => {
          const div = document.createElement("div");
          div.style.display = "flex";
          div.style.justifyContent = "center";

          const btn = document.createElement("button");
          btn.textContent = "+ Add Column";
          Object.assign(btn.style, {
            color: "white",
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          } satisfies Partial<CSSStyleDeclaration>);

          btn.addEventListener("click", () => {
            const totalCols = spreadsheetConfig.headers.length + additionalColumns.length;
            const newCol: HeaderObject = {
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

          div.appendChild(btn);
          return div;
        },
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
