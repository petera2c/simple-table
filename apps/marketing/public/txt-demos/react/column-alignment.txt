import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnAlignmentConfig } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const ColumnAlignmentDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnAlignmentConfig.headers}
      rows={columnAlignmentConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnAlignmentDemo;
