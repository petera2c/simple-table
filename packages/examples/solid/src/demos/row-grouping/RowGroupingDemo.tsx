import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function RowGroupingDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  let tableRef: TableAPI | undefined;

  return (
    <div>
      <div style={{ "margin-bottom": "8px", display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
        <button onClick={() => tableRef?.expandAll()}>Expand All</button>
        <button onClick={() => tableRef?.collapseAll()}>Collapse All</button>
        <button onClick={() => tableRef?.expandDepth(0)}>Expand Depth 0</button>
        <button onClick={() => tableRef?.collapseDepth(0)}>Collapse Depth 0</button>
        <button onClick={() => tableRef?.toggleDepth(0)}>Toggle Depth 0</button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        defaultHeaders={rowGroupingConfig.headers}
        rows={rowGroupingConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
        rowGrouping={["id"]}
      />
    </div>
  );
}
