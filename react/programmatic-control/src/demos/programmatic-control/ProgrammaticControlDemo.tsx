import { useRef, useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import {
  programmaticControlConfig,
  PROGRAMMATIC_CONTROL_STATUS_COLORS,
} from "./programmatic-control.demo-data";
import "@simple-table/react/styles.css";

const ProgrammaticControlDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);
  const [statusMessage, setStatusMessage] = useState("No status message");

  const headers: ReactHeaderObject[] = useMemo(
    () =>
      programmaticControlConfig.headers.map((h) => {
        if (h.accessor === "status") {
          return {
            ...h,
            cellRenderer: ({ row }: CellRendererProps) => {
              const s = String(row.status);
              const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? {
                bg: "#f3f4f6",
                color: "#374151",
              };
              return (
                <span
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.color,
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {s}
                </span>
              );
            },
          };
        }
        return h;
      }),
    [],
  );

  const handleSortByName = () => {
    tableRef.current?.applySortState({ accessor: "name", direction: "asc" });
    setStatusMessage("Sorted by Name (A-Z)");
  };

  const handleSortByPrice = () => {
    tableRef.current?.applySortState({ accessor: "price", direction: "desc" });
    setStatusMessage("Sorted by Price (High to Low)");
  };

  const handleFilterAvailable = () => {
    tableRef.current?.applyFilter({ accessor: "status", operator: "equals", value: "Available" });
    setStatusMessage("Filtered to show only Available products");
  };

  const handleClearFilters = () => {
    tableRef.current?.clearAllFilters();
    setStatusMessage("All filters cleared");
  };

  const handleGetInfo = () => {
    const api = tableRef.current;
    if (!api) return;
    const allRows = api.getAllRows();
    const hdrs = api.getHeaders();
    const sortState = api.getSortState();
    const filterState = api.getFilterState();
    const totalValue = allRows.reduce((sum, r) => {
      const row = r as Record<string, unknown>;
      return sum + (Number(row.price) || 0) * (Number(row.stock) || 0);
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
          marginBottom: 12,
          padding: "8px 12px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 6,
          color: "#1e40af",
          fontSize: 14,
        }}
      >
        {statusMessage}
      </div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={handleSortByName} style={{ padding: "6px 16px" }}>
          Sort by Name (A-Z)
        </button>
        <button onClick={handleSortByPrice} style={{ padding: "6px 16px" }}>
          Sort by Price (High to Low)
        </button>
        <button onClick={handleFilterAvailable} style={{ padding: "6px 16px" }}>
          Filter: Available
        </button>
        <button onClick={handleClearFilters} style={{ padding: "6px 16px" }}>
          Clear Filters
        </button>
        <button onClick={handleGetInfo} style={{ padding: "6px 16px" }}>
          Get Table Info
        </button>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={headers}
        rows={programmaticControlConfig.rows}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default ProgrammaticControlDemo;
