import CellValue from "./CellValue";

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
  accessor: string;
  operator: FilterOperator;
  value?: CellValue;
  values?: CellValue[]; // For operators like 'between', 'in', etc.
}

// Filter state for the entire table
export interface TableFilterState {
  [accessor: string]: FilterCondition;
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

// Helper function to get available operators for a column type
export const getAvailableOperators = (
  columnType: "string" | "number" | "boolean" | "date" | "enum"
): FilterOperator[] => {
  switch (columnType) {
    case "string":
      return [
        "equals",
        "notEquals",
        "contains",
        "notContains",
        "startsWith",
        "endsWith",
        "isEmpty",
        "isNotEmpty",
      ];
    case "number":
      return [
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
      ];
    case "boolean":
      return ["equals", "isEmpty", "isNotEmpty"];
    case "date":
      return [
        "equals",
        "notEquals",
        "before",
        "after",
        "between",
        "notBetween",
        "isEmpty",
        "isNotEmpty",
      ];
    case "enum":
      return ["in", "notIn", "isEmpty", "isNotEmpty"];
    default:
      return ["equals", "notEquals", "isEmpty", "isNotEmpty"];
  }
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
