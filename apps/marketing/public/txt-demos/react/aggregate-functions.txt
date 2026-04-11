import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { aggregateFunctionsConfig } from "@simple-table/examples-shared";
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
      defaultHeaders={aggregateFunctionsConfig.headers}
      rows={aggregateFunctionsConfig.rows}
      rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
      columnResizing
      height={height}
      theme={theme}
    />
  );
};

export default AggregateFunctionsDemo;
