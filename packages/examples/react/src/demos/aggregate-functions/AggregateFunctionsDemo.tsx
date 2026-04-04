import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "@simple-table/react/styles.css";

const AggregateFunctionsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(aggregateFunctionsConfig.headers)}
      rows={aggregateFunctionsConfig.rows}
      rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
      columnResizing
      height={height}
      theme={theme}
    />
  );
};

export default AggregateFunctionsDemo;
