import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import { csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function CsvExportDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  let tableRef: TableAPI | undefined;

  return (
    <div>
      <div style={{ "margin-bottom": "8px" }}>
        <button onClick={() => tableRef?.exportToCSV()}>Export to CSV</button>
        <button
          onClick={() => tableRef?.exportToCSV({ filename: "custom-export" })}
          style={{ "margin-left": "8px" }}
        >
          Export with Custom Name
        </button>
      </div>
      <SimpleTable
        ref={(api) => (tableRef = api)}
        defaultHeaders={csvExportConfig.headers}
        rows={csvExportConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
