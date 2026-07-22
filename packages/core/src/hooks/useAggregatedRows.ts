import ColumnDef, { Accessor } from "../types/ColumnDef";
import { AggregationConfig } from "../types/AggregationTypes";
import Row from "../types/Row";
import { flattenAllHeaders } from "../utils/headerUtils";
import { isRowArray, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { aggregateValues } from "../utils/aggregationUtils";
import { RowManager } from "../managers/RowManager";

interface CalculateAggregatedRowsProps {
  rows?: Row[];
  headers?: ColumnDef[];
  rowGrouping?: string[];
  rowManager?: RowManager;
}

const getAllAggregationHeaders = (headers: ColumnDef[]): ColumnDef[] => {
  return flattenAllHeaders(headers).filter((header) => header.aggregation);
};

const calculateAggregation = (
  childRows: Row[],
  accessor: Accessor,
  config: AggregationConfig,
  nextGroupKey?: string
): ReturnType<typeof aggregateValues> => {
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
  return aggregateValues(allValues, config);
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
