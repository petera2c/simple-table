import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { cellHighlightingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CellHighlightingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={cellHighlightingConfig.headers}
      rows={cellHighlightingConfig.rows}
      height={height}
      theme={theme}
      selectableCells={cellHighlightingConfig.tableProps.selectableCells}
      selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
    />
  );
};

export default CellHighlightingDemo;
