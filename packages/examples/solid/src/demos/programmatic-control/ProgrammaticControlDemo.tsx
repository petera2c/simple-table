import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import { programmaticControlConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ProgrammaticControlDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  let tableRef: TableAPI | undefined;

  return (
    <div>
      <div style={{ "margin-bottom": "8px", display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
        <button onClick={() => tableRef?.applySortState({ accessor: "id", direction: "asc" })}>
          Sort by ID (Asc)
        </button>
        <button onClick={() => tableRef?.applySortState({ accessor: "id", direction: "desc" })}>
          Sort by ID (Desc)
        </button>
        <button onClick={() => tableRef?.applySortState()}>Clear Sort</button>
        <button onClick={() => tableRef?.clearAllFilters()}>Clear All Filters</button>
        <button onClick={() => tableRef?.exportToCSV()}>Export CSV</button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        defaultHeaders={programmaticControlConfig.headers}
        rows={programmaticControlConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
