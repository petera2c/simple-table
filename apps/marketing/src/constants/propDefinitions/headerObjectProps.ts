import type { PropInfo } from "./types";

export const HEADER_OBJECT_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description:
      "The key to access data in your row objects. Must match a property in your data. Supports nested properties using dot notation (e.g., 'user.profile.name' or 'latest.rank').",
    type: "Accessor",
    link: "#union-types",
    example: `{ accessor: "firstName" }
// Nested data accessor (v1.7.6+)
{ accessor: "latest.rank" }
{ accessor: "user.profile.email" }`,
  },
  {
    key: "label",
    name: "label",
    required: true,
    description: "The display name shown in the column header.",
    type: "string",
    example: `{ label: "First Name" }`,
  },
  {
    key: "width",
    name: "width",
    required: true,
    description: "Column width. Can be pixels, string with units, or flexible units like '1fr'.",
    type: "number | string",
    example: `width: 100        // 100px
width: "150px"    // 150px  
width: "1fr"      // Flexible`,
  },
  {
    key: "aggregation",
    name: "aggregation",
    required: false,
    description: "Configuration for data aggregation when rows are grouped.",
    type: "AggregationConfig",
    link: "#aggregation-config",
    example: `aggregation: {
  type: "sum",
  parseValue: (val) => parseFloat(val.replace('$', '')),
  formatResult: (val) => '$' + val.toFixed(2)
}`,
  },
  {
    key: "align",
    name: "align",
    required: false,
    description: "Text alignment for the column content.",
    type: "string",
    enumValues: ["left", "center", "right"],
    example: `align: "center"`,
  },
  {
    key: "type",
    name: "type",
    required: false,
    description:
      "Data type for proper formatting and sorting behavior. Chart types render array data as inline visualizations.",
    type: "enum",
    link: "#union-types",
    enumValues: [
      "string",
      "number",
      "boolean",
      "date",
      "enum",
      "lineAreaChart",
      "barChart",
      "other",
    ],
    example: `type: "number"   // For numeric data
type: "date"     // For date data
type: "boolean"  // For true/false data
type: "enum"     // For enum data
type: "lineAreaChart"  // For inline line/area charts (array data)
type: "barChart"       // For inline bar charts (array data)
type: "other"    // For custom content (buttons, etc.)
type: "string"   // Default`,
  },
  {
    key: "chartOptions",
    name: "chartOptions",
    required: false,
    description:
      "Customization options for chart columns (lineAreaChart and barChart). Configure dimensions, colors, scaling, stroke width, and other visual properties. See the ChartOptions section for all available properties.",
    type: "ChartOptions",
    link: "#chart-options",
    example: `chartOptions: {
  min: 0,           // Custom minimum value for scaling
  max: 100,         // Custom maximum value for scaling
  width: 120,       // Chart width in pixels (default: 100)
  height: 35,       // Chart height in pixels (default: 30)
  color: "#3b82f6", // Custom chart color (overrides theme)
  fillColor: "#93c5fd",    // Fill color for area charts
  fillOpacity: 0.3,        // Fill opacity (default: 0.2)
  strokeWidth: 2,          // Line thickness (default: 2)
  gap: 3                   // Gap between bars (default: 2)
}`,
  },
  {
    key: "minWidth",
    name: "minWidth",
    required: false,
    description:
      "Minimum width constraint for the column. Note: When autoExpandColumns is enabled, minWidth is NOT enforced during initial scaling - columns can be scaled below their minWidth.",
    type: "number | string",
    example: `minWidth: 80
minWidth: "100px"`,
  },
  {
    key: "maxWidth",
    name: "maxWidth",
    required: false,
    description:
      "Maximum width constraint for the column. Note: When autoExpandColumns is enabled, maxWidth is NOT enforced at all - the property is ignored during proportional scaling.",
    type: "number | string",
    example: `maxWidth: 300
maxWidth: "400px"`,
  },
  {
    key: "isSortable",
    name: "isSortable",
    required: false,
    description: "Enable sorting for this column.",
    type: "boolean",
    example: `isSortable: true`,
  },
  {
    key: "sortingOrder",
    name: "sortingOrder",
    required: false,
    description:
      "Custom sort order cycle for this column. Defines the sequence of sort states when clicking the column header. Default is ['asc', 'desc', null] which cycles through ascending → descending → no sort. Customize per column based on data type - use ['desc', 'asc', null] for numbers/dates where descending is more common, or ['asc', 'desc'] to prevent removing sort.",
    type: "Array<'asc' | 'desc' | null>",
    example: `// Numbers/dates - descending first
sortingOrder: ['desc', 'asc', null]

// Text - ascending first (default)
sortingOrder: ['asc', 'desc', null]

// Always keep sort active
sortingOrder: ['asc', 'desc']

// Start with descending only
sortingOrder: ['desc', null]`,
  },
  {
    key: "filterable",
    name: "filterable",
    required: false,
    description: "Enable filtering for this column.",
    type: "boolean",
    example: `filterable: true`,
  },
  {
    key: "quickFilterable",
    name: "quickFilterable",
    required: false,
    description:
      "Controls whether this column should be included in quick filter searches. Set to false to exclude a column from global search. Defaults to true.",
    type: "boolean",
    link: "/docs/quick-filter",
    example: `// Exclude ID column from quick filter
quickFilterable: false

// Include in quick filter (default)
quickFilterable: true`,
  },
  {
    key: "quickFilterGetter",
    name: "quickFilterGetter",
    required: false,
    description:
      "Custom function to extract the searchable value for this column in quick filter. Useful for complex data structures, computed values, or custom search logic. Receives QuickFilterGetterProps and returns a string or string array to search.",
    type: "QuickFilterGetter",
    link: "/docs/quick-filter#quick-filter-getter",
    example: `// Search nested object
quickFilterGetter: ({ row }) => row.user?.fullName || ""

// Search multiple fields
quickFilterGetter: ({ row }) => [
  row.firstName,
  row.lastName,
  row.email
].filter(Boolean)

// Custom formatting for search
quickFilterGetter: ({ row }) => 
  row.tags?.map(t => t.name).join(" ") || ""`,
  },
  {
    key: "isEditable",
    name: "isEditable",
    required: false,
    description: "Enable inline editing for this column.",
    type: "boolean",
    example: `isEditable: true`,
  },
  {
    key: "hide",
    name: "hide",
    required: false,
    description: "Hide this column from display.",
    type: "boolean",
    example: `hide: true`,
  },
  {
    key: "disableReorder",
    name: "disableReorder",
    required: false,
    description: "Prevent this column from being reordered.",
    type: "boolean",
    example: `disableReorder: true`,
  },
  {
    key: "expandable",
    name: "expandable",
    required: false,
    description: "Make this column expandable for row grouping.",
    type: "boolean",
    example: `expandable: true`,
  },
  {
    key: "nestedTable",
    name: "nestedTable",
    required: false,
    description:
      "Configuration for nested tables that allows each level of row grouping to have its own independent grid structure with different columns and settings. When a row is expanded, its child data is displayed in a completely separate table with its own headers, column configuration, and features. This is different from standard row grouping where all levels share the same columns.",
    type: "NestedTableConfig",
    link: "/docs/nested-tables",
    example: `// Parent level with 9 columns
{
  accessor: "companyName",
  label: "Company",
  width: 200,
  expandable: true,
  nestedTable: {
    // Child level with 6 different columns
    defaultHeaders: [
      { accessor: "divisionId", label: "Division ID", width: 120 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "revenue", label: "Revenue", width: 120 },
      { accessor: "profitMargin", label: "Profit Margin", width: 130 },
      { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
      { accessor: "location", label: "Location", width: 150 }
    ],
    autoExpandColumns: true,
    enableRowSelection: true
  }
}`,
  },
  {
    key: "pinned",
    name: "pinned",
    required: false,
    description: "Pin this column to left or right side.",
    type: "Pinned",
    enumValues: ["left", "right"],
    link: "#union-types",
    example: `pinned: "left"`,
  },
  {
    key: "isEssential",
    name: "isEssential",
    required: false,
    description:
      "Marks the column as essential: not hideable in the column editor, not unpinable from its pinned side, and it stays in the leading essential group when reordering within each left / main / right section.",
    type: "boolean",
    link: "/docs/api-reference#header-object",
    example: `{
  accessor: "id",
  label: "ID",
  width: 72,
  pinned: "left",
  isEssential: true,
}`,
  },
  {
    key: "children",
    name: "children",
    required: false,
    description: "Child columns for nested header structure.",
    type: "HeaderObject[]",
    link: "#header-object",
    example: `children: [
  { accessor: "firstName", label: "First", width: 100 },
  { accessor: "lastName", label: "Last", width: 100 }
]`,
  },
  {
    key: "enumOptions",
    name: "enumOptions",
    required: false,
    description: "Options for enum type columns (dropdown values).",
    type: "EnumOption[]",
    link: "#enum-option",
    example: `enumOptions: [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
]`,
  },
  {
    key: "cellRenderer",
    name: "cellRenderer",
    required: false,
    description:
      "Custom render function for cell content. Receives both raw and formatted values, row path for nested data access, and other cell context for flexible rendering. Use this for React components, custom styling, or interactive elements. For simple text formatting (currency, dates), use valueFormatter instead for better performance.",
    type: "({ accessor, colIndex, row, rowIndex, rowPath, theme, value, formattedValue }: CellRendererProps) => ReactNode | string",
    example: `// Simple example using raw value
cellRenderer: ({ value, theme }) => (
  <span style={{ color: theme === 'dark' ? 'white' : 'blue' }}>
    {value}
  </span>
)

// Using formatted value from valueFormatter
cellRenderer: ({ value, formattedValue }) => (
  <div>
    <div className="text-sm">{formattedValue}</div>
    <div className="text-xs text-gray-500">Raw: {value}</div>
  </div>
)

// Using rowPath to access nested data (v1.9.7+)
cellRenderer: ({ row, rowPath, rowIndex }) => (
  <div>
    <div>Row: {rowIndex}</div>
    <div className="text-xs">Path: {rowPath?.join(' > ')}</div>
  </div>
)`,
  },
  {
    key: "valueFormatter",
    name: "valueFormatter",
    required: false,
    description:
      "Function to format the cell value for display without affecting the underlying data. Returns a string, number, or arrays of strings/numbers (v1.9.4+). Use this for currency, dates, percentages, and other simple text formatting. For React components or custom styling, use cellRenderer instead.",
    type: "(props: ValueFormatterProps) => string | number | string[] | number[]",
    link: "#value-formatter-props",
    example: `// Simple formatting
valueFormatter: ({ value }) => {
  return \`$\${(value as number).toFixed(2)}\`;
}

// Array formatting (v1.9.4+)
valueFormatter: ({ value }) => {
  if (Array.isArray(value)) {
    return value.map(v => \`$\${v.toFixed(2)}\`);
  }
  return value;
}`,
  },
  {
    key: "valueGetter",
    name: "valueGetter",
    required: false,
    description:
      "Function to extract or compute values dynamically for sorting operations. Useful when the displayed value differs from the sorting value, or when sorting by nested properties. The extracted value is used for sorting while the display value (from valueFormatter or cellRenderer) remains unchanged.",
    type: "(props: ValueGetterProps) => CellValue",
    link: "#value-getter-props",
    example: `// Extract nested value for sorting
valueGetter: ({ row }) => row.metadata?.seniorityLevel || 0,
valueFormatter: ({ row }) => {
  const level = row.metadata?.seniorityLevel || 0;
  return ["Intern", "Junior", "Mid", "Senior", "Lead"][level];
}

// Priority-based sorting
valueGetter: ({ row }) => {
  const priorityMap = { "Hot": 1, "Warm": 2, "Cold": 3 };
  return priorityMap[row.status] || 999;
}`,
  },
  {
    key: "comparator",
    name: "comparator",
    required: false,
    description:
      "Custom sorting function with full control over the sorting logic. Receives both row objects and sort direction, allowing complex multi-field sorting, metadata access, or domain-specific rules. Takes precedence over valueGetter and default sorting.",
    type: "(props: ComparatorProps) => number",
    link: "#comparator-props",
    example: `// Multi-field sorting
comparator: ({ rowA, rowB, direction }) => {
  // Sort by priority first
  if (rowA.priority !== rowB.priority) {
    return direction === "asc" 
      ? rowA.priority - rowB.priority 
      : rowB.priority - rowA.priority;
  }
  // Then by performance score
  return rowB.metadata.score - rowA.metadata.score;
}`,
  },
  {
    key: "useFormattedValueForClipboard",
    name: "useFormattedValueForClipboard",
    required: false,
    description:
      "When true, cells copy the formatted value (from valueFormatter) when users press Ctrl+C/Cmd+C. When false (default), cells copy the raw underlying data. Useful for copying currency with $ symbols, percentages with %, or formatted dates.",
    type: "boolean",
    example: `{
  accessor: "salary",
  valueFormatter: ({ value }) => \`$\${value.toLocaleString()}\`,
  useFormattedValueForClipboard: true  // Copies "$85,000"
}`,
  },
  {
    key: "useFormattedValueForCSV",
    name: "useFormattedValueForCSV",
    required: false,
    description:
      "When true, CSV exports use the formatted value from valueFormatter instead of raw data. Perfect for human-readable reports. Note: exportValueGetter takes precedence if provided.",
    type: "boolean",
    example: `{
  accessor: "completionRate",
  valueFormatter: ({ value }) => \`\${(value * 100).toFixed(1)}%\`,
  useFormattedValueForCSV: true  // CSV shows "92.5%"
}`,
  },
  {
    key: "exportValueGetter",
    name: "exportValueGetter",
    required: false,
    description:
      "Custom function to provide completely different values specifically for CSV export. Takes highest priority over useFormattedValueForCSV. Ideal for adding codes, identifiers, or transforming data for spreadsheet compatibility.",
    type: "(props: ExportValueProps) => string | number",
    link: "#export-value-props",
    example: `exportValueGetter: ({ value }) => {
  const codes = { engineering: "ENG", sales: "SLS" };
  return \`\${capitalize(value)} (\${codes[value]})\`;
}
// CSV exports: "Engineering (ENG)"`,
  },
  {
    key: "headerRenderer",
    name: "headerRenderer",
    required: false,
    description: "Custom render function for header content.",
    type: "({ accessor, colIndex, header }: { accessor: Accessor; colIndex: number; header: HeaderObject; }) => ReactNode | string",
    example: `headerRenderer: ({ accessor, colIndex, header }) => (
  <strong>{header.label}</strong>
)`,
  },
  {
    key: "collapsible",
    name: "collapsible",
    required: false,
    description:
      "Makes this column group collapsible. When true, users can click an arrow icon to collapse/expand the column group. Must have children columns.",
    type: "boolean",
    example: `collapsible: true`,
  },
  {
    key: "showWhen",
    name: "showWhen",
    required: false,
    description:
      'Controls when a child column is visible in collapsible groups. Can be "parentCollapsed" (only visible when collapsed), "parentExpanded" (only visible when expanded), or "always" (visible in both states). Default is "parentExpanded".',
    type: 'ShowWhen ("parentCollapsed" | "parentExpanded" | "always")',
    example: `showWhen: "parentCollapsed"  // Only visible when parent is collapsed
showWhen: "parentExpanded"   // Only visible when parent is expanded (default)
showWhen: "always"           // Always visible regardless of parent state`,
  },
  {
    key: "tooltip",
    name: "tooltip",
    required: false,
    description:
      "Tooltip text that appears when hovering over the column header. Provides helpful context about the column's purpose or data.",
    type: "string",
    example: `tooltip: "Current retail price in USD"
tooltip: "Date in YYYY-MM-DD format"
tooltip: "Average customer rating (1-5 stars)"`,
  },
  {
    key: "singleRowChildren",
    name: "singleRowChildren",
    required: false,
    description:
      "When true, displays the parent header and child headers horizontally in the same row (side-by-side) instead of the default nested structure where parent appears above children. This makes the parent header appear as a regular column that can collapse its sibling columns, rather than looking like a group header. Only applies to collapsible columns.",
    type: "boolean",
    example: `{
  accessor: "userInfo",
  label: "User Info",
  collapsible: true,
  singleRowChildren: true,  // Parent header appears beside children
  children: [
    { accessor: "firstName", label: "First Name", width: 100 },
    { accessor: "lastName", label: "Last Name", width: 100 },
    { accessor: "email", label: "Email", width: 200 }
  ]
}
// With singleRowChildren: true
//   Headers: [User Info] [First Name] [Last Name] [Email] (all in one row)
// With singleRowChildren: false (default nested)
//   Headers:     [User Info spanning full width]
//           [First Name] [Last Name] [Email] (children below parent)`,
  },
  {
    key: "collapseDefault",
    name: "collapseDefault",
    required: false,
    description:
      "When true, this column starts collapsed on initial render. Only applies to columns with collapsible set to true. Useful for showing a compact view by default.",
    type: "boolean",
    example: `{
  accessor: "details",
  label: "Details",
  collapsible: true,
  collapseDefault: true,  // Starts collapsed
  children: [
    { accessor: "description", label: "Description", width: 200 },
    { accessor: "notes", label: "Notes", width: 200 }
  ]
}`,
  },
  {
    key: "excludeFromRender",
    name: "excludeFromRender",
    required: false,
    description:
      "When true, excludes this column from the rendered table and from the column visibility drawer/popout menu. The column data is still available for CSV export. Useful for ID columns or metadata that should be exported but not displayed or toggled by users.",
    type: "boolean",
    example: `{
  accessor: "id",
  label: "ID",
  width: 80,
  excludeFromRender: true,  // Hidden from table and visibility menu, included in CSV
}`,
  },
  {
    key: "excludeFromCsv",
    name: "excludeFromCsv",
    required: false,
    description:
      "When true, excludes this column from CSV exports. The column is still displayed in the table. Useful for sensitive data or UI-only columns that shouldn't be exported.",
    type: "boolean",
    example: `{
  accessor: "actions",
  label: "Actions",
  width: 100,
  excludeFromCsv: true,  // Shown in table, excluded from CSV
  cellRenderer: ({ row }) => <ActionButtons row={row} />
}`,
  },
];
