import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";
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

// Sort only top-level rows, preserving hierarchy
const sortPreservingHierarchy = (
  rows: Row[],
  sortConfig: SortConfig,
  headers: HeaderObject[]
): Row[] => {
  // Find the header object that matches the sort key
  const type = sortConfig.key?.type || "string";
  const { direction } = sortConfig;

  // Group rows by sectors or other grouping criteria
  const groupedRows: Map<string, Row[]> = new Map();
  const groupHeaderRows: Map<string, Row> = new Map();
  let currentGroup = "";

  // First pass - identify and group rows by sector
  rows.forEach((row) => {
    // Check if this is a group header row (like "Sector 1", "Sector 2")
    const isSectorHeader =
      row.rowData &&
      // Assuming sector headers have some indicator (e.g., no data in key columns)
      row.rowMeta.isExpanded === true &&
      sortConfig.key.expandable === true;

    if (isSectorHeader) {
      // Extract sector name from the row (assuming it's in a column like 'sector')
      const sectorName = (row.rowData.sector || `group_${groupedRows.size}`).toString();
      currentGroup = sectorName;
      groupHeaderRows.set(currentGroup, row);

      // Initialize the group if it doesn't exist
      if (!groupedRows.has(currentGroup)) {
        groupedRows.set(currentGroup, []);
      }
    } else if (currentGroup) {
      // Add data row to current group
      const groupRows = groupedRows.get(currentGroup) || [];
      groupRows.push(row);
      groupedRows.set(currentGroup, groupRows);
    } else {
      // If no group is defined yet, create a default group
      const defaultGroup = "default";
      if (!groupedRows.has(defaultGroup)) {
        groupedRows.set(defaultGroup, []);
      }
      groupedRows.get(defaultGroup)?.push(row);
    }
  });
  // Helper function to sort rows by the specified column
  const sortRowsByColumn = (rowsToSort: Row[]): Row[] => {
    return [...rowsToSort].sort((a, b) => {
      // Skip sorting if either row doesn't have rowData
      if (!a?.rowData || !b?.rowData) return 0;

      const accessor = sortConfig.key.accessor;
      const aValue = a.rowData[accessor];
      const bValue = b.rowData[accessor];

      return compareValues(aValue, bValue, type, direction);
    });
  };

  // Process all rows to recursively sort their children
  const processRowsWithChildren = (rowsToProcess: Row[]): Row[] => {
    return rowsToProcess.map((row) => {
      // Create a new row to avoid mutating the original
      const newRow = { ...row };

      // Process children if they exist
      if (newRow.rowMeta.children && newRow.rowMeta.children.length > 0) {
        // Sort the children
        const sortedChildren = sortChildrenRecursively(
          newRow.rowMeta.children,
          sortConfig,
          headers
        );

        // Update the row with sorted children
        newRow.rowMeta = {
          ...newRow.rowMeta,
          children: sortedChildren,
        };
      }

      return newRow;
    });
  };

  // Now sort each group's rows independently and process their children
  const result: Row[] = [];

  groupedRows.forEach((groupRows, groupName) => {
    // Add the header row first if it exists
    if (groupHeaderRows.has(groupName)) {
      const headerRow = groupHeaderRows.get(groupName)!;

      // Process header row's children if they exist
      if (headerRow.rowMeta.children && headerRow.rowMeta.children.length > 0) {
        headerRow.rowMeta.children = sortChildrenRecursively(
          headerRow.rowMeta.children,
          sortConfig,
          headers
        );
      }

      result.push(headerRow);
    }

    // Sort the data rows and process their children
    const sortedRows = sortRowsByColumn(groupRows);
    result.push(...processRowsWithChildren(sortedRows));
  });

  return result;
};

// Recursively sort children and their children
const sortChildrenRecursively = (
  children: Row[],
  sortConfig: SortConfig,
  headers: HeaderObject[]
): Row[] => {
  const headerObject = headers.find((header) => header.accessor === sortConfig.key.accessor);
  const type = headerObject?.type || "string";
  const { direction } = sortConfig;

  // Sort the current level of children
  const sortedChildren = [...children].sort((a, b) => {
    // Skip sorting if either row doesn't have rowData
    if (!a?.rowData || !b?.rowData) return 0;

    const accessor = sortConfig.key.accessor;
    const aValue = a.rowData[accessor];
    const bValue = b.rowData[accessor];

    return compareValues(aValue, bValue, type, direction);
  });

  // Recursively sort any nested children
  return sortedChildren.map((child) => {
    if (child.rowMeta.children && child.rowMeta.children.length > 0) {
      return {
        ...child,
        rowMeta: {
          ...child.rowMeta,
          children: sortChildrenRecursively(child.rowMeta.children, sortConfig, headers),
        },
      };
    }
    return child;
  });
};

export const handleSort = (headers: HeaderObject[], rows: Row[], sortConfig: SortConfig) => {
  // Apply sorting while preserving hierarchy
  const sortedData = sortPreservingHierarchy(rows, sortConfig, headers);

  return { sortedData, newSortConfig: sortConfig };
};
