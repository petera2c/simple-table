import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import {
  cellHighlightingConfig,
  type CellHighlightingEmployee,
} from "./cell-highlighting.demo-data";
import "@simple-table/react/styles.css";

const CellHighlightingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<CellHighlightingEmployee>
      columns={cellHighlightingConfig.headers}
      getRowId={({ row }) => row.id}
      rows={cellHighlightingConfig.rows}
      height={height}
      theme={theme}
      selectableCells={cellHighlightingConfig.tableProps.selectableCells}
      selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
    />
  );
};

export default CellHighlightingDemo;
