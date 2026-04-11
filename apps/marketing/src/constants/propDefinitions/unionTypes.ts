import type { PropInfo } from "./types";

export const UNION_TYPE_DEFINITIONS: PropInfo[] = [
  {
    key: "accessor",
    name: "Accessor",
    required: false,
    description:
      "Valid property key that exists in the Row type. Used to safely access row data. Supports nested properties using dot notation (v1.7.6+) and array indices (v1.9.4+).",
    type: "keyof Row | string",
    example: `// Simple accessor
const accessor: Accessor = "name";     // Valid - exists in Row
const accessor2: Accessor = "age";     // Valid - exists in Row

// Nested data accessor (v1.7.6+)
const nested: Accessor = "latest.rank";           // Access nested property
const deepNested: Accessor = "user.profile.name"; // Access deeply nested property

// Array index accessor (v1.9.4+)
const arrayAccess: Accessor = "albums[0].title";  // Access array element with nested property
const simpleArray: Accessor = "awards[0]";        // Access first element of array
const releaseDate: Accessor = "releaseDate[0]";   // Access first element of releaseDate array`,
  },
  {
    key: "cellvalue",
    name: "CellValue",
    required: false,
    description: "Valid data types that can be stored in a table cell.",
    type: "string | number | boolean | undefined | null | string[] | number[] | Record<string, any>[]",
    example: `const name: CellValue = "John Doe";           // string
const age: CellValue = 30;                    // number
const isActive: CellValue = true;             // boolean
const score: CellValue = null;                // null
const description: CellValue = undefined;     // undefined
const tags: CellValue = ["tag1", "tag2"];     // string[]
const ratings: CellValue = [4.5, 3.8, 5.0];  // number[]
const users: CellValue = [                    // Record<string, any>[]
  { id: 1, name: "John", role: "admin" },
  { id: 2, name: "Jane", role: "user" }
];`,
  },
  {
    key: "theme",
    name: "Theme",
    required: false,
    description: "Built-in theme options for styling the table.",
    type: '"light" | "dark" | "sky" | "violet" | "neutral" | "modern-light" | "modern-dark" | "custom"',
    example: `theme="modern-dark"
theme="neutral"
theme="custom"`,
  },
  {
    key: "aggregationtype",
    name: "AggregationType",
    required: false,
    description: "Available aggregation functions for grouped data.",
    type: '"sum" | "average" | "count" | "min" | "max" | "custom"',
    example: `aggregation: {
  type: "sum"     // Sum all values
}
aggregation: {
  type: "custom"  // Custom function
}`,
  },
  {
    key: "pinned",
    name: "Pinned",
    required: false,
    description: "Column pinning position options.",
    type: '"left" | "right"',
    example: `pinned: "left"   // Pin to left side
pinned: "right"  // Pin to right side`,
  },
  {
    key: "columneditorposition",
    name: "ColumnEditorPosition",
    required: false,
    description: "Position options for the column editor panel.",
    type: '"left" | "right"',
    example: `columnEditorPosition="left"
columnEditorPosition="right"`,
  },
  {
    key: "row",
    name: "Row",
    required: false,
    description:
      "Data object representing a single table row. Can contain cell values, nested row arrays for hierarchical data, or any additional properties.",
    type: "Record<string, CellValue | Row[] | Record<string, any>>",
    example: `const row: Row = {
  id: 1,
  name: "John Doe",
  age: 30,
  status: "active",
  // Nested rows for hierarchical data
  children: [
    { id: 2, name: "Child Row", parentId: 1 }
  ],
  // Additional custom properties
  metadata: {
    lastModified: "2024-01-01",
    category: "active"
  }
}`,
  },
  {
    key: "type",
    name: "HeaderObject.type",
    required: false,
    description:
      "Data type for proper formatting and sorting behavior. Includes chart types for visualizing array data inline.",
    type: "string | number | boolean | date | enum | lineAreaChart | barChart | other",
    example: `type: "number"   // For numeric columns
type: "lineAreaChart"  // For inline line/area charts
type: "barChart"       // For inline bar charts`,
  },
  {
    key: "sortdirection",
    name: "SortDirection",
    required: false,
    description:
      "The sort direction for table columns. Used with applySortState() method for programmatic sort control. If direction is omitted from applySortState(), the sort cycles through: asc → desc → removed.",
    type: '"asc" | "desc"',
    example: `// Sort ascending (explicit)
await tableRef.current?.applySortState({ accessor: "name", direction: "asc" });

// Sort descending (explicit)
await tableRef.current?.applySortState({ accessor: "price", direction: "desc" });

// Cycle through sort states (asc → desc → removed)
await tableRef.current?.applySortState({ accessor: "name" });`,
  },
  {
    key: "sortcolumn",
    name: "SortColumn",
    required: false,
    description:
      "Object representing the current sort state of the table. Contains the column being sorted (as a HeaderObject) and the sort direction. Returned by getSortState() method.",
    type: "{ key: HeaderObject; direction: SortDirection }",
    link: "#header-object",
    example: `// The 'key' property is a full HeaderObject, not just the accessor
interface SortColumn {
  key: HeaderObject;           // Complete column definition
  direction: SortDirection;    // "asc" | "desc"
}

// Example: Get current sort state
const sortState = tableRef.current?.getSortState();
if (sortState) {
  console.log("Sorted column:", sortState.key.label);
  console.log("Accessor:", sortState.key.accessor);
  console.log("Direction:", sortState.direction);  // "asc" or "desc"
}`,
  },
];
