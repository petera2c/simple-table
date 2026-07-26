import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnPinningConfig, type ColumnPinningEmployee } from "./column-pinning.demo-data";
import "@simple-table/react/styles.css";

const ColumnPinningDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<ColumnPinningEmployee>
      columns={columnPinningConfig.headers}
      getRowId={({ row }) => row.id}
      rows={columnPinningConfig.rows}
      height={height}
      theme={theme}
      columnResizing={columnPinningConfig.tableProps.columnResizing}
    />
  );
};

export default ColumnPinningDemo;
