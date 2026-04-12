import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { quickStartConfig } from "./quick-start.demo-data";
import "@simple-table/react/styles.css";

const QuickStartDemo = ({
  height = "300px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={quickStartConfig.headers}
      rows={quickStartConfig.rows}
      height={height}
      theme={theme}
      editColumns={quickStartConfig.tableProps.editColumns}
      selectableCells={quickStartConfig.tableProps.selectableCells}
      customTheme={quickStartConfig.tableProps.customTheme}
    />
  );
};

export default QuickStartDemo;
