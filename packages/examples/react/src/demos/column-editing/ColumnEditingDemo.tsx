import { useState, useMemo } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, ReactHeaderObject, HeaderObject } from "@simple-table/react";
import { columnEditingData, columnEditingHeaders } from "./column-editing.demo-data";
import "@simple-table/react/styles.css";

const ColumnEditingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [additionalColumns, setAdditionalColumns] = useState<ReactHeaderObject[]>([]);
  const [lastAdded, setLastAdded] = useState("");

  const headers: ReactHeaderObject[] = useMemo(
    () => [...defaultHeadersFromCore(columnEditingHeaders), ...additionalColumns],
    [additionalColumns],
  );

  const addColumn = () => {
    const n = additionalColumns.length + 1;
    const col: ReactHeaderObject = {
      accessor: `custom-${n}`,
      label: `Custom ${n}`,
      width: 120,
      type: "string",
    };
    setAdditionalColumns((prev) => [...prev, col]);
    setLastAdded(col.label);
  };

  const handleHeaderEdit = (_header: HeaderObject, newLabel: string) => {
    setLastAdded(`Renamed to: ${newLabel}`);
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={addColumn}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 14px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          + Add Column
        </button>
        {lastAdded && (
          <span style={{ marginLeft: 12, color: "#64748b", fontSize: 13 }}>
            Added: {lastAdded}
          </span>
        )}
      </div>
      <SimpleTable
        defaultHeaders={headers}
        rows={columnEditingData}
        enableHeaderEditing
        selectableColumns
        onHeaderEdit={handleHeaderEdit}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default ColumnEditingDemo;
