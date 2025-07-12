import { useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import { AggregationConfig } from "../types/AggregationTypes";
import Row from "../types/Row";
import { flattenAllHeaders } from "../utils/headerUtils";
import { isRowArray } from "../utils/rowUtils";

interface UseAggregatedRowsProps {
  rows: Row[];
  headers: HeaderObject[];
  rowGrouping?: string[];
}

/**
 * Gets all headers that have aggregation configuration
 */
const getAllAggregationHeaders = (headers: HeaderObject[]): HeaderObject[] => {
  return flattenAllHeaders(headers).filter((header) => header.aggregation);
};

/**
 * Aggregates child row data into parent rows based on header configuration
 */
export const useAggregatedRows = ({ rows, headers, rowGrouping }: UseAggregatedRowsProps) => {
  return useMemo(() => {
    // If no row grouping is configured, return rows as-is
    if (!rowGrouping || rowGrouping.length === 0) {
      return rows;
    }

    // Get all headers that have aggregation configured (including nested ones)
    const aggregationHeaders = getAllAggregationHeaders(headers);

    // If no aggregation headers, return rows as-is
    if (aggregationHeaders.length === 0) {
      return rows;
    }

    // Deep clone rows to avoid mutating original data
    const aggregatedRows = JSON.parse(JSON.stringify(rows));

    // Process each row recursively
    const processRows = (rowsToProcess: Row[], groupingLevel: number = 0): Row[] => {
      return rowsToProcess.map((row) => {
        const currentGroupKey = rowGrouping[groupingLevel];
        const nextGroupKey = rowGrouping[groupingLevel + 1];

        // If this row has children at the current grouping level
        const currentGroupValue = row[currentGroupKey];
        if (currentGroupValue && isRowArray(currentGroupValue)) {
          // Process children recursively first
          const processedChildren = processRows(currentGroupValue, groupingLevel + 1);

          // Calculate aggregations for this parent row
          const aggregatedRow = { ...row };
          aggregatedRow[currentGroupKey] = processedChildren;

          // Calculate aggregated values for each configured header
          aggregationHeaders.forEach((header) => {
            const aggregatedValue = calculateAggregation(
              processedChildren,
              header.accessor,
              header.aggregation!,
              nextGroupKey
            );

            if (aggregatedValue !== undefined) {
              aggregatedRow[header.accessor] = aggregatedValue;
            }
          });

          return aggregatedRow;
        }

        return row;
      });
    };

    return processRows(aggregatedRows);
  }, [rows, headers, rowGrouping]);
};

/**
 * Calculates aggregation for a specific field across child rows
 */
const calculateAggregation = (
  childRows: Row[],
  accessor: string,
  config: AggregationConfig,
  nextGroupKey?: string
): any => {
  // Collect all values from child rows
  const allValues: any[] = [];

  const collectValues = (rows: Row[]) => {
    rows.forEach((row) => {
      // If this row has further children, collect from them too
      const nextGroupValue = nextGroupKey ? row[nextGroupKey] : undefined;
      if (nextGroupKey && nextGroupValue && isRowArray(nextGroupValue)) {
        collectValues(nextGroupValue);
      } else {
        // This is a leaf row, collect its value
        if (row[accessor] !== undefined && row[accessor] !== null) {
          allValues.push(row[accessor]);
        }
      }
    });
  };

  collectValues(childRows);

  if (allValues.length === 0) {
    return undefined;
  }

  // Handle custom aggregation function
  if (config.type === "custom" && config.customFn) {
    return config.customFn(allValues);
  }

  // Parse values if parseValue function is provided, otherwise try to parse as numbers
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

  // Format result if formatResult function is provided
  return config.formatResult ? config.formatResult(result) : result;
};
