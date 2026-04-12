import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
import "@simple-table/react/styles.css";

const CellHighlightingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(cellHighlightingConfig.headers)}
      rows={cellHighlightingConfig.rows}
      height={height}
      theme={theme}
      selectableCells={cellHighlightingConfig.tableProps.selectableCells}
      selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
    />
  );
};

export default CellHighlightingDemo;
