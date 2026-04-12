import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import "@simple-table/react/styles.css";

const ValueFormatterDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(valueFormatterConfig.headers)}
      rows={valueFormatterConfig.rows}
      height={height}
      theme={theme}
      selectableCells={valueFormatterConfig.tableProps.selectableCells}
    />
  );
};

export default ValueFormatterDemo;
