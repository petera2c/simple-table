import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, CellChangeProps, HeaderObject } from "@simple-table/react";
import { spreadsheetConfig, recalculateAmortization } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";
import "@simple-table/examples-shared/styles/spreadsheet-custom.css";

const SpreadsheetDemo = ({ height = "400px", theme = "light" }: { height?: string | number; theme?: Theme }) => {
  const [data, setData] = useState([...spreadsheetConfig.rows]);
  const [additionalColumns, setAdditionalColumns] = useState<HeaderObject[]>([]);

  const headers = useMemo((): ReactHeaderObject[] => {
    const baseHeaders: ReactHeaderObject[] = [...spreadsheetConfig.headers];
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
        headerRenderer: () => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => {
                const newCol: HeaderObject = {
                  accessor: `column${baseHeaders.length + additionalColumns.length + 1}`,
                  label: `Column ${baseHeaders.length + additionalColumns.length + 1}`,
                  width: 120,
                  minWidth: 80,
                  type: "number",
                  align: "right",
                  isEditable: true,
                  aggregation: { type: "sum" },
                };
                setAdditionalColumns([...additionalColumns, newCol]);
              }}
              style={{ color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              + Add Column
            </button>
          </div>
        ),
      },
    ];
  }, [additionalColumns]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.id === row.id) {
          const val = typeof newValue === "number" ? newValue : String(newValue ?? "");
          return recalculateAmortization(item, accessor, val);
        }
        return item;
      })
    );
  };

  return (
    <div className="spreadsheet-container">
      <SimpleTable
        columnBorders
        columnReordering
        columnResizing
        defaultHeaders={headers}
        enableHeaderEditing
        enableRowSelection
        height={height}
        onCellEdit={handleCellEdit}
        customTheme={{ rowHeight: 22 }}
        rows={data}
        selectableCells
        selectableColumns
        theme={theme}
        useOddEvenRowBackground
      />
    </div>
  );
};

export default SpreadsheetDemo;
