import type CellValue from "../types/CellValue";
import type { AggregationConfig } from "../types/AggregationTypes";

/**
 * Aggregate a flat list of cell values using the given AggregationConfig.
 * Shared by row-grouping rollups and matrix pivot.
 */
export const aggregateValues = (
  allValues: CellValue[],
  config: AggregationConfig
): number | string | undefined => {
  if (allValues.length === 0) {
    return undefined;
  }

  if (config.type === "custom" && config.customFn) {
    return config.customFn(allValues);
  }

  const numericValues = config.parseValue
    ? allValues.map(config.parseValue).filter((val) => !isNaN(val))
    : allValues
        .map((val) => {
          if (typeof val === "number") return val;
          if (typeof val === "string") return parseFloat(val);
          return NaN;
        })
        .filter((val) => !isNaN(val));

  if (numericValues.length === 0) {
    return config.type === "count" ? allValues.length : undefined;
  }

  let result: number;

  switch (config.type) {
    case "sum":
      result = numericValues.reduce((sum, val) => sum + val, 0);
      break;
    case "average":
      result = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      break;
    case "count":
      result = allValues.length;
      break;
    case "min":
      result = Math.min(...numericValues);
      break;
    case "max":
      result = Math.max(...numericValues);
      break;
    default:
      return undefined;
  }

  return config.formatResult ? config.formatResult(result) : result;
};
