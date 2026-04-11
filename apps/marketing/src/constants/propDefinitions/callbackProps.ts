import type { PropInfo } from "./types";

export const ROW_SELECTION_CHANGE_PROPS: PropInfo[] = [
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object that was selected or deselected",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, name: "John", age: 30 }`,
  },
  {
    key: "isSelected",
    name: "isSelected",
    required: true,
    description: "Boolean indicating whether the row was selected (true) or deselected (false)",
    type: "boolean",
    example: `props.isSelected // true or false`,
  },
  {
    key: "selectedRows",
    name: "selectedRows",
    required: true,
    description: "Set containing the IDs of all currently selected rows",
    type: "Set<string>",
    example: `props.selectedRows // Set(['1', '3', '5'])`,
  },
];

export const CELL_CHANGE_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key that was edited",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "firstName"`,
  },
  {
    key: "newValue",
    name: "newValue",
    required: true,
    description: "The new value after editing",
    type: "CellValue",
    link: "#union-types",
    example: `props.newValue // "John Doe"`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object that was edited",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, name: "John", age: 30 }`,
  },
];

export const VALUE_FORMATTER_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key for the cell being formatted",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "price"`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The column index (0-based)",
    type: "number",
    example: `props.colIndex // 2`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object containing all data for this row",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, price: 1234.56, currency: "USD" }`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The row index (0-based)",
    type: "number",
    example: `props.rowIndex // 5`,
  },
  {
    key: "value",
    name: "value",
    required: true,
    description: "The raw cell value to be formatted",
    type: "CellValue",
    link: "#union-types",
    example: `props.value // 1234.56`,
  },
];

export const VALUE_GETTER_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key for which the value is being extracted",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "metadata"`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object to extract the value from",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, metadata: { level: 3 } }`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The row index (0-based)",
    type: "number",
    example: `props.rowIndex // 5`,
  },
];

export const COMPARATOR_PROPS: PropInfo[] = [
  {
    key: "rowA",
    name: "rowA",
    required: true,
    description: "The first row object to compare",
    type: "Row",
    link: "#union-types",
    example: `props.rowA // { id: 1, priority: 1, score: 95 }`,
  },
  {
    key: "rowB",
    name: "rowB",
    required: true,
    description: "The second row object to compare",
    type: "Row",
    link: "#union-types",
    example: `props.rowB // { id: 2, priority: 2, score: 87 }`,
  },
  {
    key: "valueA",
    name: "valueA",
    required: true,
    description: "The raw cell value from rowA for the current column being sorted",
    type: "CellValue",
    link: "#union-types",
    example: `props.valueA // 95 (the value of rowA for this column)`,
  },
  {
    key: "valueB",
    name: "valueB",
    required: true,
    description: "The raw cell value from rowB for the current column being sorted",
    type: "CellValue",
    link: "#union-types",
    example: `props.valueB // 87 (the value of rowB for this column)`,
  },
  {
    key: "direction",
    name: "direction",
    required: true,
    description: "The sort direction",
    type: '"asc" | "desc"',
    example: `props.direction // "asc"`,
  },
  {
    key: "formattedValue",
    name: "formattedValue",
    required: false,
    description:
      "The formatted cell value (output from valueFormatter if defined). Available for both rowA and rowB. Useful when you need to compare formatted values or access both raw and formatted data in your comparison logic.",
    type: "string | number | string[] | number[] | undefined",
    example: `// Access formatted values if valueFormatter is defined
props.formattedValue // Could be "$1,234.56" if valueFormatter formats currency`,
  },
];

export const CELL_RENDERER_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key for the cell being rendered",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "name"`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The column index (0-based)",
    type: "number",
    example: `props.colIndex // 2`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object containing all data for this row",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, name: "John Doe", status: "active" }`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The row index (0-based)",
    type: "number",
    example: `props.rowIndex // 5`,
  },
  {
    key: "rowPath",
    name: "rowPath",
    required: false,
    description:
      "Array path through the nested data structure to reach this row. Each element is either a number (array index) or string (property name). Useful for accessing nested/hierarchical data.",
    type: "(string | number)[]",
    example: `// For rows[0]
props.rowPath // [0]

// For rows[0].teams[1]
props.rowPath // [0, "teams", 1]

// For rows[2].departments[3].employees[0]
props.rowPath // [2, "departments", 3, "employees", 0]`,
  },
  {
    key: "theme",
    name: "theme",
    required: true,
    description: "Current theme of the table",
    type: "Theme",
    link: "#union-types",
    example: `props.theme // "dark"`,
  },
  {
    key: "value",
    name: "value",
    required: true,
    description: "The raw cell value",
    type: "CellValue",
    link: "#union-types",
    example: `props.value // "John Doe"`,
  },
  {
    key: "formattedValue",
    name: "formattedValue",
    required: false,
    description:
      "The formatted cell value (output from valueFormatter if defined). Use this for display purposes when you need both raw and formatted values.",
    type: "string | number | string[] | number[] | boolean | null | undefined",
    example: `props.formattedValue // "$1,234.56" (when valueFormatter formats the raw value)`,
  },
];

export const EXPORT_VALUE_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key for the cell being exported",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "department"`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The column index (0-based)",
    type: "number",
    example: `props.colIndex // 3`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object containing all data for this row",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, department: "engineering" }`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The row index (0-based)",
    type: "number",
    example: `props.rowIndex // 5`,
  },
  {
    key: "value",
    name: "value",
    required: true,
    description: "The raw cell value",
    type: "CellValue",
    link: "#union-types",
    example: `props.value // "engineering"`,
  },
  {
    key: "formattedValue",
    name: "formattedValue",
    required: false,
    description: "The formatted cell value (if valueFormatter is defined)",
    type: "string | number | undefined",
    example: `props.formattedValue // "Engineering"`,
  },
];

export const CELL_CLICK_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key of the clicked cell",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "firstName"`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The column index of the clicked cell (0-based)",
    type: "number",
    example: `props.colIndex // 2`,
  },
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object containing the clicked cell",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: 1, name: "John", age: 30 }`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The row index of the clicked cell (0-based)",
    type: "number",
    example: `props.rowIndex // 5`,
  },
  {
    key: "value",
    name: "value",
    required: true,
    description: "The value of the clicked cell",
    type: "CellValue",
    link: "#union-types",
    example: `props.value // "John Doe"`,
  },
];

export const HEADER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key identifying which column this header belongs to",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "firstName", "salary", etc.`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The zero-based index of the column within the table",
    type: "number",
    example: `props.colIndex // 0, 1, 2, etc.`,
  },
  {
    key: "header",
    name: "header",
    required: true,
    description:
      "The complete HeaderObject containing all configuration for this column including label, width, and other properties",
    type: "HeaderObject",
    link: "#header-object",
    example: `props.header.label // "Name", "Status", etc.
props.header.width // 150, "1fr", etc.`,
  },
  {
    key: "components",
    name: "components",
    required: false,
    description:
      "Object containing pre-rendered header components (sortIcon, filterIcon, collapseIcon, labelContent) that can be positioned anywhere in your custom header renderer. This gives you complete control over the layout and order of header elements.",
    type: "HeaderRendererComponents",
    example: `// Custom header with reordered components
headerRenderer: ({ components }) => (
  <>
    {components?.labelContent}
    {components?.sortIcon}
    {components?.filterIcon}
  </>
)

// Or create your own layout
headerRenderer: ({ components, header }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>{components?.labelContent}</span>
    <div>
      {components?.filterIcon}
      {components?.sortIcon}
      {components?.collapseIcon}
    </div>
  </div>
)`,
  },
];

export const COLUMN_EDITOR_ROW_RENDERER_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key identifying which column this row represents",
    type: "Accessor",
    link: "#union-types",
    example: `props.accessor // "firstName", "email", etc.`,
  },
  {
    key: "header",
    name: "header",
    required: true,
    description:
      "The complete HeaderObject containing all configuration for this column including label, width, and other properties",
    type: "HeaderObject",
    link: "#header-object",
    example: `props.header.label // "Name", "Status", etc.
props.header.width // 150, "1fr", etc.`,
  },
  {
    key: "components",
    name: "components",
    required: false,
    description:
      "Pre-rendered components (expandIcon, checkbox, dragIcon, labelContent) to arrange in custom layout.",
    type: "ColumnEditorRowRendererComponents",
    example: `// Used in columnEditorConfig
columnEditorConfig={{
  rowRenderer: ({ components }) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {components.checkbox}
      {components.dragIcon}
      {components.labelContent}
    </div>
  )
}}`,
  },
  {
    key: "panelSection",
    name: "panelSection",
    required: false,
    description: "Which editor section this row is in: left, main, or right.",
    type: "'left' | 'main' | 'right'",
    link: "/docs/api-reference#column-editor-row-renderer-props",
    example: `rowRenderer: ({ panelSection, components }) => (
  <div data-section={panelSection}>{components.labelContent}</div>
)`,
  },
  {
    key: "isEssential",
    name: "isEssential",
    required: false,
    description: "True when the column is essential (stricter visibility and pin/reorder rules).",
    type: "boolean",
    link: "/docs/api-reference#column-editor-row-renderer-props",
    example: `rowRenderer: ({ isEssential, components }) => (
  <div style={{ fontWeight: isEssential ? 600 : 400 }}>{components.labelContent}</div>
)`,
  },
  {
    key: "canToggleVisibility",
    name: "canToggleVisibility",
    required: false,
    description: "Whether the visibility control can hide this column.",
    type: "boolean",
    link: "/docs/api-reference#column-editor-row-renderer-props",
    example: `rowRenderer: ({ canToggleVisibility, components }) => (
  <div>{canToggleVisibility ? components.checkbox : null}{components.labelContent}</div>
)`,
  },
  {
    key: "allowColumnPinning",
    name: "allowColumnPinning",
    required: false,
    description: "Same as columnEditorConfig.allowColumnPinning; useful for custom row layouts.",
    type: "boolean",
    link: "/docs/api-reference#column-editor-config",
    example: `rowRenderer: ({ allowColumnPinning, pinControl }) => (
  <div>{allowColumnPinning ? pinControl?.pinLeft : null}</div>
)`,
  },
  {
    key: "pinControl",
    name: "pinControl",
    required: false,
    description: "Optional pinLeft, pinRight, unpin UI and flags for what is allowed on this row.",
    type: "ColumnEditorPinControl",
    link: "/docs/api-reference#column-editor-row-renderer-props",
    example: `rowRenderer: ({ pinControl }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {pinControl?.pinLeft}
    {pinControl?.pinRight}
  </div>
)`,
  },
];

export const ON_ROW_GROUP_EXPAND_PROPS: PropInfo[] = [
  {
    key: "row",
    name: "row",
    required: true,
    description: "The complete row object that is being expanded or collapsed",
    type: "Row",
    link: "#union-types",
    example: `props.row // { id: "DEPT-1", name: "Engineering", teams: [] }`,
  },
  {
    key: "depth",
    name: "depth",
    required: true,
    description:
      "The depth level of the row in the hierarchy (0 = top level, 1 = first nested level, etc.)",
    type: "number",
    example: `props.depth // 0 (top-level row) or 1 (nested row)`,
  },
  {
    key: "event",
    name: "event",
    required: true,
    description: "The original mouse click event that triggered the expand/collapse action",
    type: "MouseEvent",
    example: `props.event // MouseEvent object`,
  },

  {
    key: "groupingKey",
    name: "groupingKey",
    required: false,
    description:
      "The property name that contains the children rows for this grouping level. Corresponds to the current level in the rowGrouping array.",
    type: "string",
    example: `props.groupingKey // "teams" or "employees"
// When rowGrouping={["teams", "employees"]}:
// - depth 0 rows have groupingKey "teams"
// - depth 1 rows have groupingKey "employees"`,
  },
  {
    key: "isExpanded",
    name: "isExpanded",
    required: true,
    description:
      "Boolean indicating whether the row is being expanded (true) or collapsed (false). Use this to determine whether to fetch data.",
    type: "boolean",
    example: `if (props.isExpanded) {
  // Row is expanding - fetch children data
  fetchChildrenData(props.row.id);
} else {
  // Row is collapsing - no action needed
}`,
  },
  {
    key: "rowIndexPath",
    name: "rowIndexPath",
    required: true,
    description:
      "Array containing ONLY numeric indices for navigating the nested data structure. Changed in v2.2.8: Previously mixed indices with grouping keys, now contains only numbers for clean, predictable navigation. Use this for direct array access to update nested data.",
    type: "number[]",
    example: `// For rows[0]
props.rowIndexPath // [0]

// For rows[0].teams[1]
props.rowIndexPath // [0, 2]  (NOT [0, "teams", 1])

// For rows[2].stores[3].products[0]
props.rowIndexPath // [2, 5, 0]  (numeric indices only)

// Usage: Direct nested data update
setRows(prevRows => {
  const newRows = [...prevRows];
  let current = newRows;
  
  // Navigate to parent using all but last index
  for (let i = 0; i < rowIndexPath.length - 1; i++) {
    current = current[rowIndexPath[i]][groupingKey];
  }
  
  // Update the target row
  current[rowIndexPath[rowIndexPath.length - 1]].children = data;
  return newRows;
});`,
  },
  {
    key: "rowIdPath",
    name: "rowIdPath",
    required: false,
    description:
      "Array containing ID-based path through the hierarchy (only available when getRowId prop is provided). Contains the actual ID values from your data, providing stable identification that persists across sorting and filtering. Much more reliable than index-based paths for dynamic data.",
    type: "(string | number)[]",
    example: `// When getRowId={({ row }) => row.id as string} is set:
// For rows[0] with id='REG-1'
props.rowIdPath // ['REG-1']

// For rows[0].stores[2] with ids 'REG-1' and 'STORE-101'
props.rowIdPath // ['REG-1', 'stores', 'STORE-101']

// For rows[1].stores[0].products[3]
props.rowIdPath // ['REG-2', 'stores', 'STORE-200', 'products', 'PROD-5']

// Compare with rowIndexPath (changes with sorting):
props.rowIndexPath // [1, 0, 3]  (changes when sorted)
props.rowIdPath    // ['REG-2', 'stores', 'STORE-200', 'products', 'PROD-5']  (stable)`,
  },
  {
    key: "groupingKeys",
    name: "groupingKeys",
    required: true,
    description:
      "Array of all grouping keys from the hierarchy (from the rowGrouping prop). Provides context about the complete hierarchy structure.",
    type: "string[]",
    example: `// When rowGrouping={["teams", "employees"]}
props.groupingKeys // ["teams", "employees"]

// Can be used to determine hierarchy depth
const isLastLevel = props.depth === props.groupingKeys.length - 1;`,
  },
  {
    key: "setLoading",
    name: "setLoading",
    required: true,
    description:
      "Helper function to set the loading state for this specific row. When true, displays the loadingStateRenderer component. Call with false to clear the loading state.",
    type: "(loading: boolean) => void",
    example: `// Show loading state
props.setLoading(true);

try {
  const data = await fetchData();
  props.setLoading(false); // Clear loading
  // Update your data...
} catch (error) {
  props.setLoading(false);
  props.setError(error.message);
}`,
  },
  {
    key: "setError",
    name: "setError",
    required: true,
    description:
      "Helper function to set an error state for this specific row. Pass an error message string to display the errorStateRenderer component, or null to clear the error state.",
    type: "(error: string | null) => void",
    example: `try {
  const data = await fetchData();
} catch (error) {
  // Show error state
  props.setError(error.message);
  // Or show a custom message
  props.setError("Failed to load children");
}

// Clear error state
props.setError(null);`,
  },
  {
    key: "setEmpty",
    name: "setEmpty",
    required: true,
    description:
      "Helper function to set an empty state for this specific row. When true, displays the emptyStateRenderer component. Optionally provide a custom message as the second parameter.",
    type: "(isEmpty: boolean, message?: string) => void",
    example: `const data = await fetchData();

if (data.length === 0) {
  // Show empty state
  props.setEmpty(true, "No items found");
  return;
}

// If we have data, ensure empty state is cleared
props.setEmpty(false);`,
  },
];
