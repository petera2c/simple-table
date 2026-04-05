import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { tooltipConfig } from "./tooltip.demo-data";
import "@simple-table/react/styles.css";

const TooltipDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(tooltipConfig.headers)}
      rows={tooltipConfig.rows}
      height={height}
      theme={theme}
      columnResizing={tooltipConfig.tableProps.columnResizing}
      columnReordering={tooltipConfig.tableProps.columnReordering}
      selectableCells={tooltipConfig.tableProps.selectableCells}
    />
  );
};

export default TooltipDemo;
