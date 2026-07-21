import type CellValue from "./CellValue";
export type AggregationType = "sum" | "average" | "count" | "min" | "max" | "custom";
export type AggregationConfig = {
    type: AggregationType;
    parseValue?: (value: CellValue) => number;
    formatResult?: (value: number) => string;
    customFn?: (values: CellValue[]) => number;
};
