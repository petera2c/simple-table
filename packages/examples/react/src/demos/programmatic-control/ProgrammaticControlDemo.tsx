import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI } from "@simple-table/react";
import { programmaticControlConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ProgrammaticControlDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  const handleSortBySalary = () => {
    tableRef.current?.applySortState({ accessor: "salary", direction: "desc" });
  };

  const handleFilterEngineering = () => {
    tableRef.current?.applyFilter({
      accessor: "department",
      operator: "contains",
      value: "Engineering",
    });
  };

  const handleClearFilters = () => {
    tableRef.current?.clearAllFilters();
  };

  const handleGetInfo = () => {
    const api = tableRef.current;
    if (!api) return;
    const sortState = api.getSortState();
    const filterState = api.getFilterState();
    const visibleRows = api.getVisibleRows();
    alert(
      `Table State:\n• Sort: ${sortState ? `${sortState.key.accessor} (${sortState.direction})` : "none"}\n• Active filters: ${Object.keys(filterState).length}\n• Visible rows: ${visibleRows.length}`
    );
  };

  return (
    <div>
      <div
        style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <button onClick={handleSortBySalary} style={{ padding: "6px 16px" }}>
          Sort by Salary (desc)
        </button>
        <button
          onClick={handleFilterEngineering}
          style={{ padding: "6px 16px" }}
        >
          Filter: Engineering
        </button>
        <button onClick={handleClearFilters} style={{ padding: "6px 16px" }}>
          Clear All Filters
        </button>
        <button onClick={handleGetInfo} style={{ padding: "6px 16px" }}>
          Get Table Info
        </button>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={programmaticControlConfig.headers}
        rows={programmaticControlConfig.rows}
        columnResizing
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default ProgrammaticControlDemo;
