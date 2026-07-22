import CellValue from "./CellValue";
import { Accessor } from "./ColumnDef";

// Filter operators for different data types
export type StringFilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "isEmpty"
  | "isNotEmpty";

export type NumberFilterOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "notBetween"
  | "isEmpty"
  | "isNotEmpty";

export type BooleanFilterOperator = "equals" | "isEmpty" | "isNotEmpty";

export type DateFilterOperator =
  | "equals"
  | "notEquals"
  | "before"
  | "after"
  | "between"
  | "notBetween"
  | "isEmpty"
  | "isNotEmpty";

export type EnumFilterOperator = "in" | "notIn" | "isEmpty" | "isNotEmpty";

// Union type for all filter operators
export type FilterOperator =
  | StringFilterOperator
  | NumberFilterOperator
  | BooleanFilterOperator
  | DateFilterOperator
  | EnumFilterOperator;

// Filter condition interface
export interface FilterCondition {
  accessor: Accessor;
  operator: FilterOperator;
  value?: CellValue;
  values?: CellValue[]; // For operators like 'between', 'in', etc.
}

// Filter state for the entire table
export interface TableFilterState {
  [accessor: Accessor]: FilterCondition;
}

// Human-readable labels for filter operators
export const FILTER_OPERATOR_LABELS: Record<FilterOperator, string> = {
  // String operators
  equals: "Equals",
  notEquals: "Not equals",
  contains: "Contains",
  notContains: "Does not contain",
  startsWith: "Starts with",
  endsWith: "Ends with",

  // Number operators
  greaterThan: "Greater than",
  lessThan: "Less than",
  greaterThanOrEqual: "Greater than or equal",
  lessThanOrEqual: "Less than or equal",
  between: "Between",
  notBetween: "Not between",

  // Boolean operators
  // equals already defined above

  // Date operators
  // equals, notEquals already defined above
  before: "Before",
  after: "After",
  // between, notBetween already defined above

  // Enum operators
  in: "Is one of",
  notIn: "Is not one of",

  // Common operators
  isEmpty: "Is empty",
  isNotEmpty: "Is not empty",
};

// Default operators supported by each column type
const DEFAULT_OPERATORS_BY_TYPE: Record<
  "string" | "number" | "boolean" | "date" | "enum",
  FilterOperator[]
> = {
  string: [
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "isEmpty",
    "isNotEmpty",
  ],
  number: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
    "notBetween",
    "isEmpty",
    "isNotEmpty",
  ],
  boolean: ["equals", "isEmpty", "isNotEmpty"],
  date: ["equals", "notEquals", "before", "after", "between", "notBetween", "isEmpty", "isNotEmpty"],
  enum: ["in", "notIn", "isEmpty", "isNotEmpty"],
};

const DEFAULT_FALLBACK_OPERATORS: FilterOperator[] = [
  "equals",
  "notEquals",
  "isEmpty",
  "isNotEmpty",
];

/**
 * Returns the list of operators a column should expose in its filter UI.
 *
 * When `allowedOperators` is provided, the result is restricted to that list,
 * preserving the consumer-specified order. Operators that aren't valid for the
 * given column type are ignored. If the restriction would leave no valid
 * operators (e.g. a misconfiguration), the full default list for the column
 * type is returned so the filter UI never renders an empty dropdown.
 */
export const getAvailableOperators = (
  columnType: "string" | "number" | "boolean" | "date" | "enum",
  allowedOperators?: FilterOperator[]
): FilterOperator[] => {
  const defaults = DEFAULT_OPERATORS_BY_TYPE[columnType] ?? DEFAULT_FALLBACK_OPERATORS;

  if (allowedOperators && allowedOperators.length > 0) {
    const validForType = new Set(defaults);
    const restricted = allowedOperators.filter((op) => validForType.has(op));
    if (restricted.length > 0) {
      return restricted;
    }
  }

  return defaults;
};

// Helper function to check if operator requires single value
export const requiresSingleValue = (operator: FilterOperator): boolean => {
  return !["between", "notBetween", "in", "notIn", "isEmpty", "isNotEmpty"].includes(operator);
};

// Helper function to check if operator requires multiple values
export const requiresMultipleValues = (operator: FilterOperator): boolean => {
  return ["between", "notBetween", "in", "notIn"].includes(operator);
};

// Helper function to check if operator requires no values
export const requiresNoValue = (operator: FilterOperator): boolean => {
  return ["isEmpty", "isNotEmpty"].includes(operator);
};
