import type CellValue from "../types/CellValue";
import type { AggregationConfig } from "../types/AggregationTypes";
/**
 * Aggregate a flat list of cell values using the given AggregationConfig.
 * Shared by row-grouping rollups and matrix pivot.
 */
export declare const aggregateValues: (allValues: CellValue[], config: AggregationConfig) => number | string | undefined;
