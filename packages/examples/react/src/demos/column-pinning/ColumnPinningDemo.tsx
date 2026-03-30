import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnPinningConfig } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const ColumnPinningDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnPinningConfig.headers}
      rows={columnPinningConfig.rows}
      height={height}
      theme={theme}
      columnResizing={columnPinningConfig.tableProps.columnResizing}
    />
  );
};

export default ColumnPinningDemo;
