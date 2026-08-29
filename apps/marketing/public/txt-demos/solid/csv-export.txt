import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI, SolidColumnDef } from "@simple-table/solid";
import { csvExportHeaders, csvExportData, csvExportConfig, type CsvProduct } from "./csv-export.demo-data";
import "@simple-table/solid/styles.css";

export default function CsvExportDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI<CsvProduct> | undefined;

  const headers: SolidColumnDef<CsvProduct>[] = csvExportHeaders.map((h) => {
    if (h.accessor === "actions") {
      return {
        ...h,
        cellRenderer: () => (
          <button
            type="button"
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "4px 12px",
              "border-radius": "4px",
              cursor: "pointer",
              "font-size": "12px",
              "font-weight": "bold",
            }}
          >
            View
          </button>
        ),
      };
    }
    return h;
  });

  const handleExport = () => {
    tableRef?.exportToCSV();
  };

  const handleGetInfo = () => {
    if (!tableRef) return;
    const rows = tableRef.getAllRows();
    const hdrs = tableRef.getHeaders();
    const totalRevenue = rows.reduce((sum, r) => {
      const revenue = r.row.revenue;
      return sum + (typeof revenue === "number" ? revenue : Number(revenue) || 0);
    }, 0);
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    );
  };

  return (
    <div>
      <div style={{ "margin-bottom": "12px", display: "flex", gap: "8px" }}>
        <button onClick={handleExport} style={{ padding: "6px 16px" }}>
          Export to CSV
        </button>
        <button onClick={handleGetInfo} style={{ padding: "6px 16px" }}>
          Get Table Info
        </button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        columns={headers}
        getRowId={({ row }) => row.id}
        rows={csvExportData}
        enableColumnEditor={csvExportConfig.tableProps.enableColumnEditor}
        selectableCells={csvExportConfig.tableProps.selectableCells}
        customTheme={csvExportConfig.tableProps.customTheme}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
