import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject } from "@simple-table/react";
import { columnEditingData, columnEditingHeaders } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnEditingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [additionalColumns, setAdditionalColumns] = useState<ReactHeaderObject[]>([]);

  const headers: ReactHeaderObject[] = useMemo(
    () => [
      ...columnEditingHeaders,
      ...additionalColumns,
      {
        accessor: "actions",
        label: "Actions",
        width: 120,
        filterable: false,
        type: "other" as const,
        headerRenderer: () => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => {
                const newCol: ReactHeaderObject = {
                  accessor: `custom-${additionalColumns.length + 1}`,
                  label: `Custom ${additionalColumns.length + 1}`,
                  width: 120,
                  type: "string",
                };
                setAdditionalColumns((prev) => [...prev, newCol]);
              }}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              + Add Column
            </button>
          </div>
        ),
        cellRenderer: ({ row }) => (
          <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Row {String(row.id || "")}</span>
          </div>
        ),
      },
    ],
    [additionalColumns],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      enableHeaderEditing
      height={height}
      onHeaderEdit={() => {}}
      rows={columnEditingData}
      selectableColumns
      theme={theme}
    />
  );
};

export default ColumnEditingDemo;
