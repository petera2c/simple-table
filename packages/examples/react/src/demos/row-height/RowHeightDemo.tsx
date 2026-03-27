import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { rowHeightConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const RowHeightDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={rowHeightConfig.headers}
      rows={rowHeightConfig.rows}
      height={height}
      theme={theme}
      customTheme={rowHeightConfig.tableProps.customTheme}
    />
  );
};

export default RowHeightDemo;
