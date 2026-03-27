import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, RowSelectionChangeProps } from "@simple-table/react";
import { rowSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const RowSelectionDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedCount, setSelectedCount] = useState(0);

  const handleRowSelectionChange = (props: RowSelectionChangeProps) => {
    setSelectedCount(props.selectedRows.length);
  };

  return (
    <div>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        {selectedCount > 0
          ? `${selectedCount} row${selectedCount > 1 ? "s" : ""} selected`
          : "No rows selected"}
      </div>
      <SimpleTable
        defaultHeaders={rowSelectionConfig.headers}
        rows={rowSelectionConfig.rows}
        enableRowSelection
        onRowSelectionChange={handleRowSelectionChange}
        height={height}
        theme={theme}
      />
    </div>
  );
};

export default RowSelectionDemo;
