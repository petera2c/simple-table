import HeaderObject, { Accessor } from "../types/HeaderObject";
import { AggregationConfig } from "../types/AggregationTypes";
import Row from "../types/Row";
import { flattenAllHeaders } from "../utils/headerUtils";
import { isRowArray, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { RowManager } from "../managers/RowManager";

interface CalculateAggregatedRowsProps {
  rows?: Row[];
  headers?: HeaderObject[];
  rowGrouping?: string[];
  rowManager?: RowManager;
}

const getAllAggregationHeaders = (headers: HeaderObject[]): HeaderObject[] => {
  return flattenAllHeaders(headers).filter((header) => header.aggregation);
};

const calculateAggregation = (
  childRows: Row[],
  accessor: Accessor,
  config: AggregationConfig,
  nextGroupKey?: string
): any => {
  const allValues: any[] = [];

  const collectValues = (rows: Row[]) => {
    rows.forEach((row) => {
      const nextGroupValue = nextGroupKey ? row[nextGroupKey] : undefined;
      if (nextGroupKey && nextGroupValue && isRowArray(nextGroupValue)) {
        collectValues(nextGroupValue);
      } else {
        const value = getNestedValue(row, accessor);
        if (value !== undefined && value !== null) {
          allValues.push(value);
        }
      }
    });
  };

  collectValues(childRows);

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

/**
 * Pure function to calculate aggregated rows based on row grouping and aggregation configuration
 */
export const calculateAggregatedRows = (props: CalculateAggregatedRowsProps): Row[] => {
  const { rows = [], headers = [], rowGrouping, rowManager } = props;

  if (rowManager) {
    return rowManager.getAggregatedRows();
  }
  if (!rowGrouping || rowGrouping.length === 0) {
    return rows;
  }

  const aggregationHeaders = getAllAggregationHeaders(headers);

  if (aggregationHeaders.length === 0) {
    return rows;
  }

  const aggregatedRows = JSON.parse(JSON.stringify(rows));

  const processRows = (rowsToProcess: Row[], groupingLevel: number = 0): Row[] => {
    return rowsToProcess.map((row) => {
      const currentGroupKey = rowGrouping[groupingLevel];
      const nextGroupKey = rowGrouping[groupingLevel + 1];

      const currentGroupValue = row[currentGroupKey];
      if (currentGroupValue && isRowArray(currentGroupValue)) {
        const processedChildren = processRows(currentGroupValue, groupingLevel + 1);

        const aggregatedRow = { ...row };
        aggregatedRow[currentGroupKey] = processedChildren;

        aggregationHeaders.forEach((header) => {
          const aggregatedValue = calculateAggregation(
            processedChildren,
            header.accessor,
            header.aggregation!,
            nextGroupKey
          );

          if (aggregatedValue !== undefined) {
            setNestedValue(aggregatedRow, header.accessor, aggregatedValue);
          }
        });

        return aggregatedRow;
      }

      return row;
    });
  };

  return processRows(aggregatedRows);
};

export default calculateAggregatedRows;
