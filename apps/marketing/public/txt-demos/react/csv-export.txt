import { useRef, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, ReactHeaderObject } from "@simple-table/react";
import { csvExportHeaders, csvExportData, csvExportConfig } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const CsvExportDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  const headers: ReactHeaderObject[] = useMemo(
    () =>
      csvExportHeaders.map((h) => {
        if (h.accessor === "actions") {
          return {
            ...h,
            cellRenderer: () => (
              <button
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                View
              </button>
            ),
          } as ReactHeaderObject;
        }
        return { ...h } as ReactHeaderObject;
      }),
    [],
  );

  const handleExport = () => {
    tableRef.current?.exportToCSV();
  };

  const handleGetInfo = () => {
    const api = tableRef.current;
    if (!api) return;
    const rows = api.getAllRows();
    const hdrs = api.getHeaders();
    const totalRevenue = rows.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
        defaultHeaders={headers}
        rows={csvExportData}
        editColumns={csvExportConfig.tableProps.editColumns}
        selectableCells={csvExportConfig.tableProps.selectableCells}
        customTheme={csvExportConfig.tableProps.customTheme}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default CsvExportDemo;
