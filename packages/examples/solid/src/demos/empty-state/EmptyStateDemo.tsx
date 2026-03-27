import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { emptyStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function EmptyStateDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={emptyStateConfig.headers}
      rows={emptyStateConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      tableEmptyStateRenderer={
        <div style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "center",
          padding: "48px 16px",
          color: "#94a3b8",
        }}>
          <div style={{ "font-size": "32px", "margin-bottom": "8px" }}>📭</div>
          <div style={{ "font-size": "15px", "font-weight": "600" }}>No data available</div>
          <div style={{ "font-size": "13px", "margin-top": "4px" }}>Try adding some records to see them here.</div>
        </div>
      }
    />
  );
}
