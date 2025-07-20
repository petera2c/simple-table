import HeaderObject from "../types/HeaderObject";
import { SortColumn } from "../types/SortConfig";
import Row from "../types/Row";

// Type-specific comparators for different data types
const comparators = {
  string: (a: string, b: string, direction: string): number => {
    if (a === b) return 0;
    const result = a.localeCompare(b);
    return direction === "ascending" ? result : -result;
  },
  number: (a: number, b: number, direction: string): number => {
    if (a === b) return 0;
    const result = a - b;
    return direction === "ascending" ? result : -result;
  },
  boolean: (a: boolean, b: boolean, direction: string): number => {
    if (a === b) return 0;
    // For booleans, true comes before false in ascending order
    const result = a === b ? 0 : a ? -1 : 1;
    return direction === "ascending" ? result : -result;
  },
  date: (a: string, b: string, direction: string): number => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA.getTime() === dateB.getTime()) return 0;
    const result = dateA.getTime() - dateB.getTime();
    return direction === "ascending" ? result : -result;
  },
  enum: (a: string, b: string, direction: string): number => {
    // Basic enum sorting - for advanced enum sorting, define a custom order
    return comparators.string(a, b, direction);
  },
  // Default comparator for unknown types
  default: (a: any, b: any, direction: string): number => {
    if (a === b) return 0;
    if (a === null || a === undefined) return direction === "ascending" ? -1 : 1;
    if (b === null || b === undefined) return direction === "ascending" ? 1 : -1;

    if (typeof a === "string" && typeof b === "string") {
      return comparators.string(a, b, direction);
    }
    if (typeof a === "number" && typeof b === "number") {
      return comparators.number(a, b, direction);
    }
    if (typeof a === "boolean" && typeof b === "boolean") {
      return comparators.boolean(a, b, direction);
    }

    // Convert to strings as fallback
    return comparators.string(String(a), String(b), direction);
  },
};

// Compare two values based on column type
const compareValues = (
  aValue: any,
  bValue: any,
  type: string = "string",
  direction: "ascending" | "descending"
): number => {
  // Handle null, undefined, or empty values consistently
  if (aValue === null || aValue === undefined || aValue === "") {
    return direction === "ascending" ? -1 : 1;
  }
  if (bValue === null || bValue === undefined || bValue === "") {
    return direction === "ascending" ? 1 : -1;
  }

  // For numeric columns, try to parse values that might be formatted as strings
  if (type === "number") {
    // Handle currency values (e.g. "$123.45", "$1.7T")
    const parseNumericValue = (value: any): number => {
      if (typeof value === "number") return value;

      const stringValue = String(value);

      // Handle values with T (trillion), B (billion), M (million), K (thousand) suffixes
      if (typeof stringValue === "string") {
        // Remove currency symbols and commas
        let cleanValue = stringValue.replace(/[$,]/g, "");

        // Extract the numeric part and any suffix
        const match = cleanValue.match(/^([-+]?\d*\.?\d+)([TBMKtbmk])?/);
        if (match) {
          let num = parseFloat(match[1]);
          const suffix = match[2]?.toUpperCase();

          // Apply multiplier based on suffix
          if (suffix === "T") num *= 1e12;
          else if (suffix === "B") num *= 1e9;
          else if (suffix === "M") num *= 1e6;
          else if (suffix === "K") num *= 1e3;

          return num;
        }
      }

      // Fallback to default parsing
      return parseFloat(stringValue) || 0;
    };

    const aNum = parseNumericValue(aValue);
    const bNum = parseNumericValue(bValue);

    const result = comparators.number(aNum, bNum, direction);
    return result;
  }

  // For date columns, handle date strings or date objects
  if (type === "date") {
    return comparators.date(String(aValue), String(bValue), direction);
  }

  // For boolean values
  if (type === "boolean") {
    return comparators.boolean(Boolean(aValue), Boolean(bValue), direction);
  }

  // For enum values
  if (type === "enum") {
    return comparators.enum(String(aValue), String(bValue), direction);
  }

  // Default to string comparison
  return comparators.string(String(aValue), String(bValue), direction);
};

// Basic sort function for flat data (no grouping)
const sortFlatRows = ({
  rows,
  sortColumn,
  headers,
}: {
  rows: Row[];
  sortColumn: SortColumn;
  headers: HeaderObject[];
}): Row[] => {
  // Recursively search for the header in nested structure
  const findHeaderRecursively = (
    headers: HeaderObject[],
    accessor: string
  ): HeaderObject | undefined => {
    for (const header of headers) {
      if (header.accessor === accessor) {
        return header;
      }
      if (header.children && header.children.length > 0) {
        const found = findHeaderRecursively(header.children, accessor);
        if (found) return found;
      }
    }
    return undefined;
  };

  const headerObject = findHeaderRecursively(headers, sortColumn.key.accessor);
  const type = headerObject?.type || "string";
  const direction = sortColumn.direction;

  return [...rows].sort((a, b) => {
    const accessor = sortColumn.key.accessor;
    const aValue = a[accessor];
    const bValue = b[accessor];

    return compareValues(aValue, bValue, type, direction);
  });
};

export const handleSort = ({
  headers,
  rows,
  sortColumn,
}: {
  headers: HeaderObject[];
  rows: Row[];
  sortColumn: SortColumn;
}) => {
  // For now, use simple flat sorting since we've simplified the row structure
  // Row grouping will be handled by the table internally using the rowGrouping prop
  const sortedData = sortFlatRows({ rows, sortColumn, headers });

  return sortedData;
};
