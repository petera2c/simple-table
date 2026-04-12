import { createSignal } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme, TableAPI, SolidHeaderObject, CellRendererProps } from "@simple-table/solid";
import {
  programmaticControlConfig,
  PROGRAMMATIC_CONTROL_STATUS_COLORS,
} from "./programmatic-control.demo-data";
import "@simple-table/solid/styles.css";

export default function ProgrammaticControlDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  let tableRef: TableAPI | undefined;
  const [statusMessage, setStatusMessage] = createSignal("No status message");

  const headers: SolidHeaderObject[] = programmaticControlConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: (cr: CellRendererProps) => {
          const s = String(cr.row.status);
          const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? {
            bg: "#f3f4f6",
            color: "#374151",
          };
          return (
            <span
              style={{
                background: colors.bg,
                color: colors.color,
                padding: "4px 8px",
                "border-radius": "4px",
                "font-size": "12px",
                "font-weight": "bold",
              }}
            >
              {s}
            </span>
          );
        },
      };
    }
    return h;
  });

  const handleSortByName = () => {
    tableRef?.applySortState({ accessor: "name", direction: "asc" });
    setStatusMessage("Sorted by Name (A-Z)");
  };

  const handleSortByPrice = () => {
    tableRef?.applySortState({ accessor: "price", direction: "desc" });
    setStatusMessage("Sorted by Price (High to Low)");
  };

  const handleFilterAvailable = () => {
    tableRef?.applyFilter({ accessor: "status", operator: "equals", value: "Available" });
    setStatusMessage("Filtered to show only Available products");
  };

  const handleClearFilters = () => {
    tableRef?.clearAllFilters();
    setStatusMessage("All filters cleared");
  };

  const handleGetInfo = () => {
    if (!tableRef) return;
    const allRows = tableRef.getAllRows();
    const hdrs = tableRef.getHeaders();
    const sortState = tableRef.getSortState();
    const filterState = tableRef.getFilterState();
    const totalValue = allRows.reduce((sum, r) => {
      const data = r.row as { price?: number; stock?: number };
      return sum + (Number(data.price) || 0) * (Number(data.stock) || 0);
    }, 0);
    const sortInfo = sortState ? `${sortState.key.label} (${sortState.direction})` : "None";
    alert(
      `Table Info:\n• Rows: ${allRows.length}\n• Columns: ${hdrs.length}\n• Active filters: ${Object.keys(filterState).length}\n• Sort: ${sortInfo}\n• Total inventory value: $${totalValue.toFixed(2)}`,
    );
    setStatusMessage("Table info displayed");
  };

  return (
    <div>
      <div
        style={{
          "margin-bottom": "12px",
          padding: "8px 12px",
          "background-color": "#eff6ff",
          border: "1px solid #bfdbfe",
          "border-radius": "6px",
          color: "#1e40af",
          "font-size": "14px",
        }}
      >
        {statusMessage()}
      </div>
      <div style={{ "margin-bottom": "12px", display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
        <button onClick={handleSortByName}>Sort by Name (A-Z)</button>
        <button onClick={handleSortByPrice}>Sort by Price (High to Low)</button>
        <button onClick={handleFilterAvailable}>Filter: Available</button>
        <button onClick={handleClearFilters}>Clear Filters</button>
        <button onClick={handleGetInfo}>Get Table Info</button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        defaultHeaders={headers}
        rows={programmaticControlConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
