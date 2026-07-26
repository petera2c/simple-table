import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { quickStartConfig, type QuickStartEmployee } from "./quick-start.demo-data";
import "@simple-table/react/styles.css";

const QuickStartDemo = ({
  height = "300px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<QuickStartEmployee>
      columns={quickStartConfig.headers}
      rows={quickStartConfig.rows}
      height={height}
      theme={theme}
      enableColumnEditor={quickStartConfig.tableProps.enableColumnEditor}
      selectableCells={quickStartConfig.tableProps.selectableCells}
      customTheme={quickStartConfig.tableProps.customTheme}
      getRowId={({ row }) => row.id}
    />
  );
};

export default QuickStartDemo;
