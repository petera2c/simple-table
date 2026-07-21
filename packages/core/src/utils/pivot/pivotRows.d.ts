import type HeaderObject from "../../types/HeaderObject";
import type { Accessor } from "../../types/HeaderObject";
import type Row from "../../types/Row";
import type { PivotConfig, PivotResult } from "../../types/PivotTypes";
export type PivotRowsProps = {
    rows: Row[];
    pivot: PivotConfig;
    /** Field catalog (`defaultHeaders`) for labels, types, widths, formatters. */
    fieldHeaders: HeaderObject[];
};
export declare const buildPivotAccessor: (colKey: string, valueAccessor: Accessor) => string;
export declare const buildPivotRowTotalAccessor: (valueAccessor: Accessor) => string;
/**
 * Pure transform: flat source rows + pivot config → pivoted rows and generated headers.
 */
export declare const pivotRows: ({ rows, pivot, fieldHeaders }: PivotRowsProps) => PivotResult;
