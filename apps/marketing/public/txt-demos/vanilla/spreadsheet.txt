import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, CellChangeProps } from "simple-table-core";
import { spreadsheetConfig, recalculateAmortization } from "@simple-table/examples-shared";
import type { SpreadsheetRow } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "@simple-table/examples-shared/styles/spreadsheet-custom.css";

export function renderSpreadsheetDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const wrapper = document.createElement("div");
  wrapper.className = "spreadsheet-container";
  container.appendChild(wrapper);

  let rows = [...spreadsheetConfig.rows];
  let additionalColumns: HeaderObject[] = [];

  function buildHeaders(): HeaderObject[] {
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
            table.update({ defaultHeaders: buildHeaders() });
          });

          div.appendChild(btn);
          return div;
        },
      },
    ];
  }

  const table = new SimpleTableVanilla(wrapper, {
    defaultHeaders: buildHeaders(),
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnBorders: true,
    columnReordering: true,
    columnResizing: true,
    enableHeaderEditing: true,
    enableRowSelection: true,
    selectableCells: true,
    selectableColumns: true,
    useOddEvenRowBackground: true,
    customTheme: { rowHeight: 22 },
    onCellEdit: ({ accessor, newValue, row }: CellChangeProps) => {
      rows = rows.map((item) => {
        if (item.id === row.id) {
          return recalculateAmortization(item as SpreadsheetRow, accessor, newValue as string | number);
        }
        return item;
      });
      table.update({ rows });
    },
  });
  return table;
}
