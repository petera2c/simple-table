import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";
import Row from "../types/Row";
import { RowId } from "../types/RowId";

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
  switch (type) {
    case "string":
      return comparators.string(String(aValue || ""), String(bValue || ""), direction);
    case "number":
      return comparators.number(Number(aValue || 0), Number(bValue || 0), direction);
    case "boolean":
      return comparators.boolean(Boolean(aValue), Boolean(bValue), direction);
    case "date":
      return comparators.date(String(aValue || ""), String(bValue || ""), direction);
    case "enum":
      return comparators.enum(String(aValue || ""), String(bValue || ""), direction);
    default:
      return comparators.default(aValue, bValue, direction);
  }
};

// Sort only top-level rows, preserving hierarchy
const sortPreservingHierarchy = (rows: Row[], sortConfig: SortConfig, headers: HeaderObject[]): Row[] => {
  // Find the header object that matches the sort key
  const headerObject = headers.find((header) => header.accessor === sortConfig.key.accessor);
  const type = headerObject?.type || "string";
  const { direction } = sortConfig;

  // Group rows by parent-child relationships to preserve hierarchy
  const topLevelRows: Row[] = [];
  const childrenMap = new Map<RowId, Row[]>();

  // First pass - identify top-level rows and organize children
  rows.forEach((row) => {
    // Check if this row is a child
    const isChild = rows.some((parentRow) =>
      parentRow.rowMeta.children?.some((childRow) => childRow.rowMeta.rowId === row.rowMeta.rowId)
    );

    if (!isChild) {
      topLevelRows.push(row);
    }

    // Store all children for each row
    if (row.rowMeta.children && row.rowMeta.children.length > 0) {
      childrenMap.set(row.rowMeta.rowId, row.rowMeta.children);
    }
  });

  // Helper function to sort rows by the specified column
  const sortRowsByColumn = (rowsToSort: Row[]): Row[] => {
    return [...rowsToSort].sort((a, b) => {
      const aValue = a?.rowData?.[sortConfig.key.accessor];
      const bValue = b?.rowData?.[sortConfig.key.accessor];

      return compareValues(aValue, bValue, type, direction);
    });
  };

  // Sort top-level rows
  const sortedTopLevelRows = sortRowsByColumn(topLevelRows);

  // Reconstruct the hierarchy with the sorted top-level rows
  // and sort children within each parent group
  return sortedTopLevelRows.map((row) => {
    // Clone the row to avoid mutating the original
    const newRow = { ...row };

    // Retrieve and sort the children if they exist
    if (childrenMap.has(row.rowMeta.rowId)) {
      const children = childrenMap.get(row.rowMeta.rowId) || [];

      // Sort the children recursively
      const sortedChildren = sortChildrenRecursively(children, sortConfig, headers);

      newRow.rowMeta = {
        ...newRow.rowMeta,
        children: sortedChildren,
      };
    }

    return newRow;
  });
};

// Recursively sort children and their children
const sortChildrenRecursively = (children: Row[], sortConfig: SortConfig, headers: HeaderObject[]): Row[] => {
  const headerObject = headers.find((header) => header.accessor === sortConfig.key.accessor);
  const type = headerObject?.type || "string";
  const { direction } = sortConfig;

  // Sort the current level of children
  const sortedChildren = [...children].sort((a, b) => {
    const aValue = a?.rowData?.[sortConfig.key.accessor];
    const bValue = b?.rowData?.[sortConfig.key.accessor];

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

// Resize handler
export const handleResizeStart = ({
  event,
  forceUpdate,
  header,
  headersRef,
  index,
  reverse,
  setIsWidthDragging,
  startWidth,
}: {
  event: MouseEvent;
  forceUpdate: () => void;
  header: HeaderObject;
  headersRef: React.RefObject<HeaderObject[]>;
  index: number;
  reverse?: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  startWidth: number;
}) => {
  setIsWidthDragging(true);
  event.preventDefault();
  const startX = event.clientX;
  if (!header) return;

  const handleMouseMove = (event: any) => {
    const newWidth = Math.max(startWidth + (event.clientX - startX), 40);

    if (!header || !headersRef.current) return;
    headersRef.current[index].width = newWidth;
    forceUpdate();
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsWidthDragging(false);
  };
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
