import { SimpleTable } from "@simple-table/solid";
import type { Theme, RowSelectionChangeProps } from "@simple-table/solid";
import { rowSelectionConfig } from "@simple-table/examples-shared";
import { createSignal } from "solid-js";
import "simple-table-core/styles.css";

export default function RowSelectionDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [selectedCount, setSelectedCount] = createSignal(0);

  const handleSelectionChange = (selection: RowSelectionChangeProps) => {
    setSelectedCount(selection.selectedRows.size);
  };

  return (
    <div>
      <div style={{ "margin-bottom": "8px" }}>
        Selected rows: {selectedCount()}
      </div>
      <SimpleTable
        defaultHeaders={rowSelectionConfig.headers}
        rows={rowSelectionConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
        enableRowSelection={true}
        onRowSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
