import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI } from "@simple-table/react";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const RowGroupingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);

  const handleExpandAll = () => tableRef.current?.expandAll();
  const handleCollapseAll = () => tableRef.current?.collapseAll();
  const handleExpandDepth0 = () => tableRef.current?.expandDepth(0);
  const handleSetExpandedDepths = () =>
    tableRef.current?.setExpandedDepths(new Set([0, 1]));
  const handleToggleDepth1 = () => tableRef.current?.toggleDepth(1);

  return (
    <div>
      <div
        style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <button onClick={handleExpandAll} style={{ padding: "6px 16px" }}>
          Expand All
        </button>
        <button onClick={handleCollapseAll} style={{ padding: "6px 16px" }}>
          Collapse All
        </button>
        <button onClick={handleExpandDepth0} style={{ padding: "6px 16px" }}>
          Expand Depth 0
        </button>
        <button
          onClick={handleSetExpandedDepths}
          style={{ padding: "6px 16px" }}
        >
          Expand All Depths
        </button>
        <button onClick={handleToggleDepth1} style={{ padding: "6px 16px" }}>
          Toggle Depth 1
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
