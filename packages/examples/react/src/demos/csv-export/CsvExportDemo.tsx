import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI } from "@simple-table/react";
import { csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CsvExportDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  const handleExport = () => {
    tableRef.current?.exportToCSV({ filename: "employees.csv" });
  };

  const handleGetInfo = () => {
    const api = tableRef.current;
    if (!api) return;
    const headers = api.getHeaders();
    const rows = api.getAllRows();
    alert(
      `Table Info:\n• ${headers.length} columns\n• ${rows.length} rows\n• Columns: ${headers.map((h) => h.label).join(", ")}`
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button onClick={handleExport} style={{ padding: "6px 16px" }}>
          Export to CSV
        </button>
        <button onClick={handleGetInfo} style={{ padding: "6px 16px" }}>
          Get Table Info
        </button>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={csvExportConfig.headers}
        rows={csvExportConfig.rows}
        columnResizing
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default CsvExportDemo;
