import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { aggregateFunctionsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function AggregateFunctionsDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={aggregateFunctionsConfig.headers}
      rows={aggregateFunctionsConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
