import { useRef } from "react";
import {SimpleTable} from "@simple-table/react";import type { Theme, TableAPI } from "@simple-table/react";
import { rowGroupingConfig } from "./row-grouping.demo-data";
import "@simple-table/react/styles.css";

const btnStyle = (color: string) => ({
  padding: "6px 12px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500 as const,
});

const RowGroupingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, marginRight: 8 }}>Control Expansion:</span>
        <button style={btnStyle("#28a745")} onClick={() => tableRef.current?.expandAll()} title="expandAll()">
          Expand All
        </button>
        <button style={btnStyle("#dc3545")} onClick={() => tableRef.current?.collapseAll()} title="collapseAll()">
          Collapse All
        </button>
        <button
          style={btnStyle("#007bff")}
          onClick={() => { tableRef.current?.collapseAll(); tableRef.current?.expandDepth(0); }}
          title="expandDepth(0)"
        >
          Only Divisions
        </button>
        <button
          style={btnStyle("#6c757d")}
          onClick={() => tableRef.current?.setExpandedDepths(new Set([0, 1]))}
          title="setExpandedDepths(new Set([0, 1]))"
        >
          Divisions + Departments
        </button>
        <button style={btnStyle("#6f42c1")} onClick={() => tableRef.current?.toggleDepth(0)} title="toggleDepth(0)">
          Toggle Divisions
        </button>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={rowGroupingConfig.headers}
        rows={rowGroupingConfig.rows}
        rowGrouping={rowGroupingConfig.tableProps.rowGrouping}
        enableStickyParents={rowGroupingConfig.tableProps.enableStickyParents}
        getRowId={rowGroupingConfig.tableProps.getRowId}
        columnResizing
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default RowGroupingDemo;
