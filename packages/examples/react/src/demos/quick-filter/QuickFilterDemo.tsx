import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const QuickFilterDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={quickFilterConfig.headers}
      rows={quickFilterConfig.rows}
      height={height}
      theme={theme}
      quickFilter={quickFilterConfig.tableProps.quickFilter}
    />
  );
};

export default QuickFilterDemo;
