import CellValue from "./CellValue";
import { Accessor } from "./HeaderObject";
export type StringFilterOperator = "equals" | "notEquals" | "contains" | "notContains" | "startsWith" | "endsWith" | "isEmpty" | "isNotEmpty";
export type NumberFilterOperator = "equals" | "notEquals" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual" | "between" | "notBetween" | "isEmpty" | "isNotEmpty";
export type BooleanFilterOperator = "equals" | "isEmpty" | "isNotEmpty";
export type DateFilterOperator = "equals" | "notEquals" | "before" | "after" | "between" | "notBetween" | "isEmpty" | "isNotEmpty";
export type EnumFilterOperator = "in" | "notIn" | "isEmpty" | "isNotEmpty";
export type FilterOperator = StringFilterOperator | NumberFilterOperator | BooleanFilterOperator | DateFilterOperator | EnumFilterOperator;
export interface FilterCondition {
    accessor: Accessor;
    operator: FilterOperator;
    value?: CellValue;
    values?: CellValue[];
}
export interface TableFilterState {
    [accessor: Accessor]: FilterCondition;
}
export declare const FILTER_OPERATOR_LABELS: Record<FilterOperator, string>;
/**
 * Returns the list of operators a column should expose in its filter UI.
 *
 * When `allowedOperators` is provided, the result is restricted to that list,
 * preserving the consumer-specified order. Operators that aren't valid for the
 * given column type are ignored. If the restriction would leave no valid
 * operators (e.g. a misconfiguration), the full default list for the column
 * type is returned so the filter UI never renders an empty dropdown.
 */
export declare const getAvailableOperators: (columnType: "string" | "number" | "boolean" | "date" | "enum", allowedOperators?: FilterOperator[]) => FilterOperator[];
export declare const requiresSingleValue: (operator: FilterOperator) => boolean;
export declare const requiresMultipleValues: (operator: FilterOperator) => boolean;
export declare const requiresNoValue: (operator: FilterOperator) => boolean;
