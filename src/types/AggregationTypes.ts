export type AggregationType = "sum" | "average" | "count" | "min" | "max" | "custom";

export type AggregationConfig = {
  type: AggregationType;
  parseValue?: (value: any) => number; // for parsing string values like "$15.0M" to numbers
  formatResult?: (value: number) => string; // for formatting the aggregated result back to string
  customFn?: (values: any[]) => any; // for custom aggregation logic
};
