import { FilterCondition } from "../types/FilterTypes";

/**
 * Normalizes a date to remove time component for accurate date-only comparison
 */
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Applies a filter condition to a cell value
 */
export const applyFilterToValue = <T>(cellValue: any, filter: FilterCondition<T>): boolean => {
  const { operator, value, values } = filter;

  // Handle null/undefined values for isEmpty/isNotEmpty
  if (cellValue == null) {
    return operator === "isEmpty";
  }

  // Handle isEmpty/isNotEmpty for all types
  if (operator === "isEmpty") {
    return !cellValue || String(cellValue).trim() === "";
  }
  if (operator === "isNotEmpty") {
    return cellValue && String(cellValue).trim() !== "";
  }

  // String operations
  if (
    typeof cellValue === "string" ||
    operator === "contains" ||
    operator === "notContains" ||
    operator === "startsWith" ||
    operator === "endsWith"
  ) {
    const cellString = String(cellValue).toLowerCase();
    const filterString = value ? String(value).toLowerCase() : "";

    switch (operator) {
      case "equals":
        return cellString === filterString;
      case "notEquals":
        return cellString !== filterString;
      case "contains":
        return cellString.includes(filterString);
      case "notContains":
        return !cellString.includes(filterString);
      case "startsWith":
        return cellString.startsWith(filterString);
      case "endsWith":
        return cellString.endsWith(filterString);
      default:
        break;
    }
  }

  // Number operations
  if (typeof cellValue === "number" || !isNaN(Number(cellValue))) {
    const cellNumber = Number(cellValue);
    const filterNumber = Number(value);

    switch (operator) {
      case "equals":
        return cellNumber === filterNumber;
      case "notEquals":
        return cellNumber !== filterNumber;
      case "greaterThan":
        return cellNumber > filterNumber;
      case "lessThan":
        return cellNumber < filterNumber;
      case "greaterThanOrEqual":
        return cellNumber >= filterNumber;
      case "lessThanOrEqual":
        return cellNumber <= filterNumber;
      case "between":
        if (values && values.length === 2) {
          const [min, max] = values.map(Number);
          return cellNumber >= min && cellNumber <= max;
        }
        return false;
      case "notBetween":
        if (values && values.length === 2) {
          const [min, max] = values.map(Number);
          return cellNumber < min || cellNumber > max;
        }
        return true;
      default:
        break;
    }
  }

  // Date operations
  if (cellValue instanceof Date || !isNaN(Date.parse(cellValue))) {
    const cellDate = new Date(cellValue);
    const filterDate = new Date(String(value || ""));

    const normalizedCellDate = normalizeDate(cellDate);
    const normalizedFilterDate = normalizeDate(filterDate);

    switch (operator) {
      case "equals":
        return normalizedCellDate.getTime() === normalizedFilterDate.getTime();
      case "notEquals":
        return normalizedCellDate.getTime() !== normalizedFilterDate.getTime();
      case "before":
        return normalizedCellDate < normalizedFilterDate;
      case "after":
        return normalizedCellDate > normalizedFilterDate;
      case "between":
        if (values && values.length === 2) {
          const [startDate, endDate] = values.map((d) => normalizeDate(new Date(String(d || ""))));
          return normalizedCellDate >= startDate && normalizedCellDate <= endDate;
        }
        return false;
      case "notBetween":
        if (values && values.length === 2) {
          const [startDate, endDate] = values.map((d) => normalizeDate(new Date(String(d || ""))));
          return normalizedCellDate < startDate || normalizedCellDate > endDate;
        }
        return true;
      default:
        break;
    }
  }

  // Boolean operations
  if (typeof cellValue === "boolean") {
    const filterBoolean = Boolean(value);

    switch (operator) {
      case "equals":
        return cellValue === filterBoolean;
      default:
        break;
    }
  }

  // Array operations (filtering on array values)
  if (Array.isArray(cellValue)) {
    // Convert array to string for filtering
    const arrayString = cellValue
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSON.stringify(item);
        }
        return String(item);
      })
      .join(", ");

    // For arrays, we'll use the string representation for filtering
    // and let it fall through to the string comparison logic below
    cellValue = arrayString;
  }

  // Enum operations (array-based filtering)
  if (operator === "in" || operator === "notIn") {
    if (values && Array.isArray(values)) {
      const cellString = String(cellValue);
      const isIncluded = values.includes(cellString);
      return operator === "in" ? isIncluded : !isIncluded;
    }
    return false;
  }

  // Fallback for string comparison if no specific type matched
  const cellString = String(cellValue).toLowerCase();
  const filterString = value ? String(value).toLowerCase() : "";

  switch (operator) {
    case "equals":
      return cellString === filterString;
    case "notEquals":
      return cellString !== filterString;
    default:
      return true;
  }
};
