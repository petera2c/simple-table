import type CellValue from "./CellValue";

export type AggregationType = "sum" | "average" | "count" | "min" | "max" | "custom";

export type AggregationConfig = {
  type: AggregationType;
  parseValue?: (value: CellValue) => number; // for parsing string values like "$15.0M" to numbers
  formatResult?: (value: number) => string; // for formatting the aggregated result back to string
  customFn?: (values: CellValue[]) => number; // for custom aggregation logic
};
