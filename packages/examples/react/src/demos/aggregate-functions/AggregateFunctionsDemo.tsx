import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import {
  aggregateFunctionsConfig,
  type AggregateFunctionsRow,
} from "./aggregate-functions.demo-data";
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
      columns={aggregateFunctionsConfig.headers}
      getRowId={({ row }) => row.id}
      rows={aggregateFunctionsConfig.rows}
      rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
      columnResizing
      height={height}
      theme={theme}
    />
  );
};

export default AggregateFunctionsDemo;
