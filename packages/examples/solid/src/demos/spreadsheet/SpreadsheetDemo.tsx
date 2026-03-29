import { createSignal, createMemo } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject } from "@simple-table/solid";
import type { CellChangeProps, HeaderObject } from "simple-table-core";
import { spreadsheetConfig, recalculateAmortization } from "@simple-table/examples-shared";
import type { SpreadsheetRow } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "@simple-table/examples-shared/styles/spreadsheet-custom.css";

export default function SpreadsheetDemo(props: { height?: string | number; theme?: Theme }) {
  const theme = () => props.theme ?? "light";
  const [data, setData] = createSignal([...spreadsheetConfig.rows]);
  const [additionalColumns, setAdditionalColumns] = createSignal<HeaderObject[]>([]);

  const headers = createMemo((): SolidHeaderObject[] => {
    const baseHeaders: SolidHeaderObject[] = [...spreadsheetConfig.headers];
    return [
      ...baseHeaders,
      ...additionalColumns(),
      {
        accessor: "actions",
        label: "",
        width: 100,
        minWidth: 100,
        filterable: false,
        type: "other" as const,
        disableReorder: true,
        headerRenderer: () => (
          <div style={{ display: "flex", "justify-content": "center" }}>
            <button
              onClick={() => {
                const newCol: HeaderObject = {
                  accessor: `column${baseHeaders.length + additionalColumns().length + 1}`,
                  label: `Column ${baseHeaders.length + additionalColumns().length + 1}`,
                  width: 120,
                  minWidth: 80,
                  type: "number",
                  align: "right",
                  isEditable: true,
                  aggregation: { type: "sum" },
                };
                setAdditionalColumns([...additionalColumns(), newCol]);
              }}
              style={{ color: "white", border: "none", padding: "4px 10px", "border-radius": "4px", cursor: "pointer", "font-size": "11px", "font-weight": "500", "white-space": "nowrap" }}
            >
              + Add Column
            </button>
          </div>
        ),
      },
    ];
  });

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.id === row.id) {
          return recalculateAmortization(item as SpreadsheetRow, accessor, newValue as string | number);
        }
        return item;
      })
    );
  };

  return (
    <div class="spreadsheet-container">
      <SimpleTable
        columnBorders
        columnReordering
        columnResizing
        defaultHeaders={headers()}
        enableHeaderEditing
        enableRowSelection
        height={props.height ?? "400px"}
        onCellEdit={handleCellEdit}
        customTheme={{ rowHeight: 22 }}
        rows={data()}
        selectableCells
        selectableColumns
        theme={theme()}
        useOddEvenRowBackground
      />
    </div>
  );
}
