import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const btnStyle = (color: string) => ({
  padding: "6px 12px",
  background: color,
  color: "white",
  border: "none",
  "border-radius": "4px",
  cursor: "pointer",
  "font-size": "12px",
  "font-weight": 500,
});

export default function RowGroupingDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI | undefined;

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
      <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap", "align-items": "center" }}>
        <span style={{ "font-size": "13px", "font-weight": 600, "margin-right": "8px" }}>Control Expansion:</span>
        <button style={btnStyle("#28a745")} onClick={() => tableRef?.expandAll()} title="expandAll()">Expand All</button>
        <button style={btnStyle("#dc3545")} onClick={() => tableRef?.collapseAll()} title="collapseAll()">Collapse All</button>
        <button style={btnStyle("#007bff")} onClick={() => { tableRef?.collapseAll(); tableRef?.expandDepth(0); }} title="expandDepth(0)">Only Divisions</button>
        <button style={btnStyle("#6c757d")} onClick={() => tableRef?.setExpandedDepths(new Set([0, 1]))} title="setExpandedDepths(new Set([0, 1]))">Divisions + Departments</button>
        <button style={btnStyle("#6f42c1")} onClick={() => tableRef?.toggleDepth(0)} title="toggleDepth(0)">Toggle Divisions</button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        defaultHeaders={rowGroupingConfig.headers}
        rows={rowGroupingConfig.rows}
        rowGrouping={rowGroupingConfig.tableProps.rowGrouping}
        enableStickyParents={true}
        getRowId={rowGroupingConfig.tableProps.getRowId}
        columnResizing
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
